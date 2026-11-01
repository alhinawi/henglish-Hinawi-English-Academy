import type { IncomingMessage, ServerResponse } from 'node:http';
import dns from 'node:dns';
import { dispatchTranslation } from '../../server/translationService';
import type { TranslationRequest } from '../../src/types/translation';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

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
      if (raw.length > 15 * 1024 * 1024) resolve({});
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
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = (await parseBody(req)) as unknown as TranslationRequest;
    if (!body || !body.text) {
      sendJson(res, 400, { error: 'Missing translation text' });
      return;
    }

    const result = await dispatchTranslation(body);
    sendJson(res, 200, result);
  } catch (err) {
    console.error('Serverless translate handler error:', err);
    sendJson(res, 500, { error: 'Translation service error', message: String(err) });
  }
}
