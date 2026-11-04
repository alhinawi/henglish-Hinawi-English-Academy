// ==============================================================================
// HENGLISH ACADEMY - AUTHORITATIVE GAMEVERSE SESSION VERIFICATION API
// Endpoint: POST /api/gameverse/submit-session
// 
// Security Controls:
// 1. Enforces Supabase JWT identity verification (anti-impersonation).
// 2. Strict Zod schema validation & numeric bounds enforcement.
// 3. Atomically calculates & records XP via authoritative database RPC.
// 4. Never awards persistent XP or trusts unauthenticated client-supplied userIds.
// 5. Never returns fake success when database write fails or is unconfigured.
// 6. Sliding window rate limiting & Origin protection.
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import { z } from 'zod';
import { 
  applyCorsHeaders, 
  sendJson, 
  verifyAuthToken, 
  getSupabaseServerClient,
  parseAndValidateBody 
} from '../../server/auth/serverAuth';

// Zod Schema for Game Session Submission
const GameSessionSchema = z.object({
  userId: z.string().optional(),
  gameId: z.string().min(1, 'gameId is required').max(100),
  score: z.number().int().min(0).max(100000).default(0),
  maxScore: z.number().int().min(1).max(100000).default(100),
  accuracy: z.number().min(0).max(100).default(0),
  durationSeconds: z.number().int().min(0).max(3600).default(0),
  answersSummary: z.array(z.record(z.string(), z.unknown())).optional().default([]),
  idempotencyKey: z.string().min(8, 'idempotencyKey must be at least 8 characters').max(200),
});

type GameSessionInput = z.infer<typeof GameSessionSchema>;

// Sliding window rate limiter
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

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
) {
  // CORS & Preflight handling
  if (applyCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
  }

  const clientIp = (
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'anonymous'
  ).split(',')[0].trim();

  // Enforce IP rate limiting: max 60 submissions per hour per IP
  if (!checkRateLimit(`ip:${clientIp}`, 60)) {
    return sendJson(res, 429, {
      error: 'Rate limit exceeded: Too many game session submissions. Please try again later.',
    });
  }

  // Parse and validate request body with Zod
  const validation = await parseAndValidateBody(req, GameSessionSchema, 128 * 1024);
  if (!validation.success) {
    return sendJson(res, validation.statusCode, { error: validation.error });
  }

  const body: GameSessionInput = validation.data;

  try {
    // 1. Authoritative Identity Verification via JWT
    const authHeader = req.headers['authorization'] || '';
    let effectiveUserId: string | null = null;

    if (authHeader.startsWith('Bearer ')) {
      const authContext = await verifyAuthToken(req);
      if (authContext.authenticated && authContext.userId) {
        effectiveUserId = authContext.userId;

        // Anti-Impersonation Guard: If client passed a userId, verify it matches the token identity
        if (body.userId && body.userId !== effectiveUserId) {
          return sendJson(res, 403, {
            error: 'Forbidden: You cannot submit game scores on behalf of another user ID.',
          });
        }
      } else {
        return sendJson(res, 401, {
          error: `Authentication failed: ${authContext.error || 'Invalid session token'}`,
        });
      }
    } else {
      // Unauthenticated / Guest Mode:
      // SECURITY: Never trust client-supplied account userId without a verified JWT!
      if (body.userId && !body.userId.startsWith('guest')) {
        return sendJson(res, 401, {
          error: 'Unauthorized: Authentication required to submit game sessions for user accounts.',
        });
      }

      // Guest sessions are evaluated on the fly, but explicitly do NOT persist XP
      const guestCalculatedXp = Math.min(Math.round((body.score / Math.max(body.maxScore, 1)) * 50), 50);
      return sendJson(res, 200, {
        success: true,
        persisted: false,
        awardedXp: guestCalculatedXp,
        message: 'Guest session evaluated. Sign in to save XP permanently to your account.',
      });
    }

    // Per-user rate limiting (max 40 submissions per hour for authenticated accounts)
    if (effectiveUserId && !checkRateLimit(`usr:${effectiveUserId}`, 40)) {
      return sendJson(res, 429, {
        error: 'Too many game submissions recorded for this account. Please wait before playing again.',
      });
    }

    // 2. Authoritative Database Execution
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      // In production or configured environment, NEVER return fake success when DB is unconfigured
      return sendJson(res, 503, {
        status: 'error',
        error: 'Database service is currently unconfigured. Game sessions cannot be authoritatively recorded.',
      });
    }

    // Call authoritative RPC function
    const { data, error } = await supabase.rpc('submit_verified_game_session', {
      p_user_id: effectiveUserId,
      p_game_id: body.gameId,
      p_score: body.score,
      p_max_score: body.maxScore,
      p_accuracy: body.accuracy,
      p_duration_seconds: body.durationSeconds,
      p_answers: body.answersSummary,
      p_idempotency_key: body.idempotencyKey,
    });

    if (error) {
      console.error('Authoritative submit RPC error:', error.message);
      return sendJson(res, 502, {
        status: 'error',
        error: `Database transaction failed: ${error.message}`,
      });
    }

    if (data) {
      return sendJson(res, 200, data);
    }

    return sendJson(res, 500, {
      status: 'error',
      error: 'Unexpected empty response from authoritative database RPC.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return sendJson(res, 500, { error: message });
  }
}
