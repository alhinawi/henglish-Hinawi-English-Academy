import type { IncomingMessage, ServerResponse } from 'node:http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(
    JSON.stringify({
      status: 'ok',
      service: 'Henglish Educational Engine',
      hasElevenLabs: Boolean(process.env.ELEVENLABS_API_KEY),
      hasGemini: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    })
  );
}
