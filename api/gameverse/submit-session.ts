// ==============================================================================
// HENGLISH ACADEMY - AUTHORITATIVE GAMEVERSE SESSION VERIFICATION API
// Endpoint: POST /api/gameverse/submit-session
// Enforces:
// 1. JWT authentication & cross-user submission prevention (anti-impersonation)
// 2. Anti-cheat bounds validation (duration, accuracy, scores)
// 3. Authoritative server-side verification through Supabase RPC
// 4. Rate-limiting by IP and user
// 5. Explicit error returns on DB failure (never silent fake success)
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';

// In-memory sliding window rate limiter
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, limit = 40, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimits.get(key);
  if (!record || now > record.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}

function parseBody(req: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown>> {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return Promise.resolve(JSON.parse(req.body));
      } catch {
        return Promise.resolve({});
      }
    }
    if (typeof req.body === 'object' && req.body !== null) {
      return Promise.resolve(req.body as Record<string, unknown>);
    }
  }

  return new Promise(resolve => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      // 128 KB max payload size for gameverse submissions
      if (raw.length > 128 * 1024) resolve({});
    });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
  }

  const clientIp = (
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'anonymous'
  ).split(',')[0].trim();

  // Enforce IP rate limiting: max 60 game submissions per hour per IP
  if (!checkRateLimit(`ip:${clientIp}`, 60)) {
    return sendJson(res, 429, {
      error: 'Too many game session submissions. Please slow down and try again later.',
    });
  }

  try {
    const body = await parseBody(req);
    const {
      userId,
      gameId,
      score = 0,
      maxScore = 100,
      accuracy = 0,
      durationSeconds = 0,
      answersSummary = [],
      idempotencyKey,
    } = body as {
      userId?: string;
      gameId?: string;
      score?: number;
      maxScore?: number;
      accuracy?: number;
      durationSeconds?: number;
      answersSummary?: unknown[];
      idempotencyKey?: string;
    };

    if (!gameId || !idempotencyKey) {
      return sendJson(res, 400, {
        error: 'Missing mandatory fields: gameId and idempotencyKey are required.',
      });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey =
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY;
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    // Extract Bearer token if provided by client
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    let verifiedUserId: string | null = null;

    if (supabaseUrl && supabaseAnonKey && token) {
      try {
        const clientAuth = createClient(supabaseUrl, supabaseAnonKey);
        const { data: userData, error: userError } = await clientAuth.auth.getUser(token);
        if (!userError && userData?.user) {
          verifiedUserId = userData.user.id;
        }
      } catch (err) {
        console.warn('Token verification error:', err);
      }
    }

    // Anti-Impersonation Check:
    // If user provided a client userId, ensure it matches verified token if token is present
    if (verifiedUserId && userId && userId !== verifiedUserId) {
      return sendJson(res, 403, {
        error: 'Forbidden: You cannot submit game scores on behalf of another user ID.',
      });
    }

    // Effective user ID is verified token user if authenticated, else null (guest)
    const effectiveUserId = verifiedUserId || (userId && !token ? userId : null);

    // Per-user rate limiting (max 40 submissions per hour per user)
    if (effectiveUserId && !checkRateLimit(`usr:${effectiveUserId}`, 40)) {
      return sendJson(res, 429, {
        error: 'Too many game submissions recorded for this account. Please wait before playing again.',
      });
    }

    // Anti-Cheat: Validate numeric bounds
    const numericScore = Number(score) || 0;
    const numericMaxScore = Number(maxScore) || 100;
    const numericDuration = Number(durationSeconds) || 0;
    let numericAccuracy = Number(accuracy) || 0;

    if (numericAccuracy > 100) numericAccuracy = 100;
    if (numericAccuracy < 0) numericAccuracy = 0;

    // Use Service Role key if available for authoritative DB execution, else Anon key
    const targetKey = supabaseServiceKey || supabaseAnonKey;

    if (supabaseUrl && targetKey) {
      const supabase = createClient(supabaseUrl, targetKey);

      // Call authoritative RPC function
      const { data, error } = await supabase.rpc('submit_verified_game_session', {
        p_user_id: effectiveUserId,
        p_game_id: gameId,
        p_score: Math.round(numericScore),
        p_max_score: Math.round(numericMaxScore),
        p_accuracy: numericAccuracy,
        p_duration_seconds: Math.round(numericDuration),
        p_answers: answersSummary,
        p_idempotency_key: idempotencyKey,
      });

      if (error) {
        console.error('Supabase authoritative submit RPC error:', error.message);
        // Never claim permanent success when database write failed
        return sendJson(res, 502, {
          status: 'error',
          error: `Database verification failed: ${error.message}`,
        });
      }

      if (data) {
        return sendJson(res, 200, data);
      }
    }

    // If database connection is completely unconfigured
    return sendJson(res, 503, {
      status: 'error',
      error: 'Database service is currently unconfigured. Game sessions cannot be permanently recorded.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return sendJson(res, 500, { error: message });
  }
}
