// ==============================================================================
// Henglish Academy (HENGLISH) - SERVER API ROUTER & MIDDLEWARE
// Integrates with Vite dev server and Node / Serverless runtimes
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import { dispatchAiChat, streamAiChat, checkRateLimit, getAiConfig, ChatRequestBody } from './aiService';
import { synthesizeSpeech, TtsSynthesisRequest } from './ttsService';

function parseJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1024 * 1024) { // 1MB limit
        reject(new Error('Request payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
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

export async function handleApiRoute(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return true;
  }

  // Health check
  if (url === '/api/health') {
    const config = getAiConfig();
    sendJson(res, 200, {
      status: 'ok',
      service: 'Henglish AI & TTS Engine',
      provider: config.provider,
      model: config.model,
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  // AI Chat endpoint (Non-streaming)
  if (url === '/api/ai/chat' && req.method === 'POST') {
    const clientIp = req.socket.remoteAddress || 'client';
    if (!checkRateLimit(clientIp)) {
      sendJson(res, 429, { error: 'Too many requests. Please slow down.' });
      return true;
    }

    try {
      const body = (await parseJsonBody(req)) as ChatRequestBody;
      if (!body.message || !body.mode) {
        sendJson(res, 400, { error: 'Missing required fields: message, mode' });
        return true;
      }

      const result = await dispatchAiChat(body);
      sendJson(res, 200, result);
    } catch (err) {
      console.error('API /api/ai/chat error:', err);
      sendJson(res, 500, { error: 'Internal AI service error', message: String(err) });
    }
    return true;
  }

  // AI Stream endpoint (Server-Sent Events)
  if (url === '/api/ai/stream' && req.method === 'POST') {
    const clientIp = req.socket.remoteAddress || 'client';
    if (!checkRateLimit(clientIp)) {
      sendJson(res, 429, { error: 'Too many requests. Please slow down.' });
      return true;
    }

    try {
      const body = (await parseJsonBody(req)) as ChatRequestBody;
      if (!body.message || !body.mode) {
        sendJson(res, 400, { error: 'Missing required fields: message, mode' });
        return true;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');

      const result = await streamAiChat(body, chunk => {
        res.write(`event: token\ndata: ${JSON.stringify({ text: chunk })}\n\n`);
      });

      res.write(`event: done\ndata: ${JSON.stringify(result)}\n\n`);
      res.end();
    } catch (err) {
      console.error('API /api/ai/stream error:', err);
      res.write(`event: error\ndata: ${JSON.stringify({ error: String(err) })}\n\n`);
      res.end();
    }
    return true;
  }

  // TTS Synthesis endpoint
  if (url === '/api/tts/synthesize' && req.method === 'POST') {
    try {
      const body = (await parseJsonBody(req)) as TtsSynthesisRequest;
      if (!body.text) {
        sendJson(res, 400, { error: 'Missing required text for TTS synthesis' });
        return true;
      }

      const result = await synthesizeSpeech(body);
      sendJson(res, 200, result);
    } catch (err) {
      console.error('API /api/tts/synthesize error:', err);
      sendJson(res, 500, { error: 'TTS synthesis error', message: String(err) });
    }
    return true;
  }

  return false;
}

