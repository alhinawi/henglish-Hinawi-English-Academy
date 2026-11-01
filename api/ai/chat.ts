// ==============================================================================
// HENGLISH ACADEMY (HENGLISH 2.0) - SERVERLESS AI CHAT HANDLER
// Powered by Centralized Multi-Provider Router (Groq -> Gemini -> Cloudflare -> OpenAI -> Local)
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import dns from 'node:dns';
import { dispatchAiChat, ChatRequestBody } from '../../server/aiService';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

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
      if (raw.length > 1024 * 1024) resolve({});
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
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = (await parseBody(req)) as unknown as ChatRequestBody;
    if (!body || !body.message) {
      sendJson(res, 400, { error: 'Missing required field: message' });
      return;
    }

    const result = await dispatchAiChat(body);
    sendJson(res, 200, result);
  } catch (err) {
    console.error('API /api/ai/chat error:', err);
    sendJson(res, 500, { error: 'Internal AI service error', message: String(err) });
  }
}
