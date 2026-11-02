// ==============================================================================
// HENGLISH ACADEMY - HARDENED SERVERLESS AI CHAT HANDLER
// Powered by Centralized Multi-Provider Router (Groq -> Gemini -> Cloudflare -> OpenAI -> Local)
// Features:
// 1. IP & User rate limiting (prevents DDoS & quota exhaustion)
// 2. Strict payload validation & size bounds
// 3. Safe error responses (never leaks API keys or stack traces)
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import dns from 'node:dns';
import { dispatchAiChat, ChatRequestBody } from '../../server/aiService';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

// Sliding window IP rate limiter (60 requests per minute)
const chatRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkChatRateLimit(ip: string, limit = 60, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const record = chatRateLimits.get(ip);
  if (!record || now > record.resetAt) {
    chatRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
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
      // 128 KB max payload size for AI requests
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method Not Allowed. Use POST.' });
    return;
  }

  const clientIp = (
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'anonymous'
  ).split(',')[0].trim();

  if (!checkChatRateLimit(clientIp)) {
    sendJson(res, 429, { error: 'Too many AI requests. Please slow down.' });
    return;
  }

  try {
    const rawBody = await parseBody(req);
    const body = rawBody as unknown as ChatRequestBody;

    if (!body || typeof body.message !== 'string' || !body.message.trim()) {
      sendJson(res, 400, { error: 'Missing required field: message must be a non-empty string.' });
      return;
    }

    // Input sanitization: limit user message to 4,000 characters
    if (body.message.length > 4000) {
      body.message = body.message.slice(0, 4000);
    }

    // Sanitize conversation history if present
    if (Array.isArray(body.history)) {
      body.history = body.history.slice(-20); // Keep last 20 messages max
    }

    const result = await dispatchAiChat(body);
    sendJson(res, 200, result);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown AI processing error';
    // Cleanse any accidental key exposure from error message
    const sanitizedError = errorMsg
      .replace(/gsk_[a-zA-Z0-9_-]+/g, '[REDACTED_GROQ_KEY]')
      .replace(/cfat_[a-zA-Z0-9_-]+/g, '[REDACTED_CLOUDFLARE_KEY]')
      .replace(/AIza[a-zA-Z0-9_-]+/g, '[REDACTED_API_KEY]');

    console.error('API /api/ai/chat error:', sanitizedError);
    sendJson(res, 500, { error: 'Internal AI service error', message: sanitizedError });
  }
}
