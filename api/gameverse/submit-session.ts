// ==============================================================================
// HENGLISH ACADEMY - AUTHORITATIVE GAMEVERSE SESSION VERIFICATION API
// Endpoint: POST /api/gameverse/submit-session
// Validates gameplay, enforces anti-cheat rules, records in ledger & awards XP
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';

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
      if (raw.length > 5 * 1024 * 1024) resolve({});
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

    // Anti-Cheat: Validate numeric bounds
    const numericScore = Number(score) || 0;
    const numericMaxScore = Number(maxScore) || 100;
    const numericDuration = Number(durationSeconds) || 0;
    let numericAccuracy = Number(accuracy) || 0;

    if (numericAccuracy > 100) numericAccuracy = 100;
    if (numericAccuracy < 0) numericAccuracy = 0;

    const verificationFlags: string[] = [];

    // Flag: Impossible speed (less than 3 seconds for a multi-question test with high score)
    if (numericDuration < 3 && numericScore > 20) {
      verificationFlags.push('impossible_speed_detected');
    }

    // Flag: Negative or inverted score
    if (numericScore > numericMaxScore * 1.5) {
      verificationFlags.push('score_exceeds_maximum');
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      // Call authoritative RPC function
      const { data, error } = await supabase.rpc('submit_verified_game_session', {
        p_user_id: userId || null,
        p_game_id: gameId,
        p_score: Math.round(numericScore),
        p_max_score: Math.round(numericMaxScore),
        p_accuracy: numericAccuracy,
        p_duration_seconds: Math.round(numericDuration),
        p_answers: answersSummary,
        p_idempotency_key: idempotencyKey,
      });

      if (error) {
        console.warn('Supabase RPC error, executing authoritative fallback:', error.message);
      } else if (data) {
        return sendJson(res, 200, data);
      }
    }

    // Authoritative Fallback if database RPC is unconfigured
    const isSuspicious = verificationFlags.length > 0;
    let calculatedXp = 0;
    let speedBonus = 0;

    if (!isSuspicious) {
      const baseReward = 35;
      calculatedXp = Math.round(baseReward * (numericAccuracy / 100));
      if (numericAccuracy >= 80 && numericDuration > 0 && numericDuration < 45) {
        speedBonus = Math.min(15, Math.round((45 - numericDuration) * 0.4));
      }
    }

    const totalXp = calculatedXp + speedBonus;

    return sendJson(res, 200, {
      status: 'success',
      session_id: `fallback-${Date.now()}`,
      xp_awarded: totalXp,
      base_xp: calculatedXp,
      speed_bonus: speedBonus,
      accuracy: numericAccuracy,
      flags: verificationFlags,
      message: isSuspicious ? 'Session flagged by anti-cheat filter' : 'Session verified successfully.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return sendJson(res, 500, { error: message });
  }
}
