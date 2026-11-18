import type { IncomingMessage, ServerResponse } from 'node:http';
import { protectedTtsProxy } from '../../server/protectedTtsProxy';

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.statusCode = 405; res.end(JSON.stringify({ error: 'method_not_allowed' })); return; }
  let body = typeof req.body === 'string' ? req.body : req.body === undefined ? '' : JSON.stringify(req.body);
  try {
    if (req.body === undefined) for await (const chunk of req) {
      body += chunk.toString();
      if (body.length > 24000) break;
    }
    if (body.length > 24000) { res.statusCode = 413; res.end(JSON.stringify({ error: 'too_large' })); return; }
    const response = await protectedTtsProxy(body);
    res.statusCode = response.status;
    res.end(await response.text());
  } catch {
    res.statusCode = 503;
    res.end(JSON.stringify({ error: 'tts_unavailable' }));
  }
}
