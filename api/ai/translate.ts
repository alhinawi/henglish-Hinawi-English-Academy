// ==============================================================================
// HENGLISH ACADEMY - SERVERLESS AI TRANSLATION HANDLER
// Endpoint: POST /api/ai/translate
//
// Security Controls:
// 1. CORS origin allowlist (serverAuth).
// 2. Text payload length bounds (max 5,000 characters).
// 3. Sliding window IP rate limiting (40 req / min).
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import dns from 'node:dns';
import { dispatchTranslation } from '../../server/translationService';
import type { TranslationRequest } from '../../src/types/translation';
import { applyCorsHeaders, sendJson } from '../../server/auth/serverAuth';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const ipRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 40, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const record = ipRateLimits.get(ip);
  if (!record || now > record.resetAt) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}

async function parseBody(req: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown>> {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    if (typeof req.body === 'object' && req.body !== null) {
      return req.body as Record<string, unknown>;
    }
  }

  return new Promise(resolve => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 256 * 1024) resolve({});
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

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  // CORS & Preflight handling
  if (applyCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed. Use POST.' });
  }

  const clientIp = (
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'anonymous'
  ).split(',')[0].trim();

  if (!checkRateLimit(clientIp, 40)) {
    return sendJson(res, 429, {
      error: 'Rate limit exceeded: Too many translation requests. Please slow down.',
    });
  }

  try {
    const body = (await parseBody(req)) as unknown as TranslationRequest;
    if (!body || !body.text) {
      return sendJson(res, 400, { error: 'Missing translation text' });
    }

    if (typeof body.text === 'string' && body.text.length > 5000) {
      return sendJson(res, 400, {
        error: 'Text length exceeds maximum permitted limit (5,000 characters).',
      });
    }

    const result = await dispatchTranslation(body);
    return sendJson(res, 200, result);
  } catch (err) {
    console.error('API /api/ai/translate error:', err);
    return sendJson(res, 500, { error: 'Translation engine failure' });
  }
}
