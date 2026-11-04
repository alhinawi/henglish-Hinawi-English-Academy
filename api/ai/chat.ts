// ==============================================================================
// HENGLISH ACADEMY (HENGLISH 2.0) - SERVERLESS AI CHAT HANDLER
// Powered by Centralized Multi-Provider Router (Groq -> Gemini -> Cloudflare -> OpenAI -> Local)
//
// Security Controls:
// 1. CORS origin allowlist (serverAuth).
// 2. Sliding window IP rate limiting (30 req / min).
// 3. Message payload size bounds (max 4,000 characters).
// 4. Safe error handling (never leak internal stack traces or API keys).
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import dns from 'node:dns';
import { dispatchAiChat, ChatRequestBody } from '../../server/aiService';
import { applyCorsHeaders, sendJson } from '../../server/auth/serverAuth';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const ipRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 30, windowMs = 60 * 1000): boolean {
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
      if (raw.length > 256 * 1024) resolve({}); // 256KB max raw body
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

  if (!checkRateLimit(clientIp, 30)) {
    return sendJson(res, 429, {
      error: 'Rate limit exceeded: Too many AI requests. Please slow down.',
    });
  }

  try {
    const body = (await parseBody(req)) as unknown as ChatRequestBody;
    if (!body || !body.message) {
      return sendJson(res, 400, { error: 'Missing required field: message' });
    }

    if (typeof body.message === 'string' && body.message.length > 4000) {
      return sendJson(res, 400, {
        error: 'Message length exceeds maximum permitted limit (4,000 characters).',
      });
    }

    const result = await dispatchAiChat(body);
    return sendJson(res, 200, result);
  } catch (err) {
    console.error('API /api/ai/chat error:', err);
    return sendJson(res, 500, { error: 'Internal AI service error' });
  }
}
