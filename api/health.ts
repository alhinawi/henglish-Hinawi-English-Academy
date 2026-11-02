import type { IncomingMessage, ServerResponse } from 'node:http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const startTime = Date.now();

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  let supabaseStatus = 'unconfigured';
  let supabaseLatencyMs = 0;

  if (supabaseUrl && supabaseKey) {
    const sbStart = Date.now();
    try {
      const pingRes = await fetch(`${supabaseUrl}/auth/v1/health`, {
        headers: { apikey: supabaseKey },
        signal: AbortSignal.timeout(3000),
      });
      supabaseLatencyMs = Date.now() - sbStart;
      supabaseStatus = pingRes.ok ? 'connected' : `http_${pingRes.status}`;
    } catch (err: any) {
      supabaseLatencyMs = Date.now() - sbStart;
      supabaseStatus = 'unreachable';
    }
  }

  const aiProviders = {
    groq: Boolean(process.env.GROQ_API_KEY),
    gemini: Boolean(process.env.GEMINI_API_KEY),
    cloudflare: Boolean(process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_R2_ACCESS_KEY_ID),
    openai: Boolean(process.env.OPENAI_API_KEY),
  };

  const ttsProviders = {
    elevenlabs: Boolean(process.env.ELEVENLABS_API_KEY),
  };

  const emailService = {
    configured: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD),
    host: process.env.SMTP_HOST || 'none',
  };

  const isHealthy = (supabaseStatus === 'connected' || supabaseStatus.startsWith('http_')) && (aiProviders.groq || aiProviders.gemini);

  res.statusCode = isHealthy ? 200 : 503;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  res.end(
    JSON.stringify({
      status: isHealthy ? 'healthy' : 'degraded',
      service: 'Henglish Educational Platform',
      version: '2.0.0-production',
      environment: process.env.NODE_ENV || 'production',
      database: {
        provider: 'Supabase PostgreSQL',
        status: supabaseStatus,
        latencyMs: supabaseLatencyMs,
      },
      aiProviders,
      ttsProviders,
      emailService,
      responseTimeMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    }, null, 2)
  );
}
