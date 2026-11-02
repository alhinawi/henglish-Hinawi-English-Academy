// ==============================================================================
// HENGLISH ACADEMY - BREVO SMTP HEALTH & CONNECTION VERIFICATION API
// Vercel Serverless Function: GET /api/email/health
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import { getSafeSmtpDiagnostics } from '../../server/email/emailConfig';
import { verifySmtpConnection } from '../../server/email/emailService';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  const diagnostics = getSafeSmtpDiagnostics();

  // If credentials are not configured, return clear actionable state
  if (!diagnostics.isConfigured) {
    res.statusCode = 503;
    res.end(
      JSON.stringify({
        status: 'unconfigured',
        service: 'Henglish Brevo Mailer',
        message: 'SMTP credentials (SMTP_PASSWORD) are not yet configured in environment variables.',
        diagnostics,
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  // Verify live connection to Brevo SMTP
  const verification = await verifySmtpConnection();

  res.statusCode = verification.success ? 200 : 502;
  res.end(
    JSON.stringify({
      status: verification.success ? 'healthy' : 'connection_failed',
      service: 'Henglish Brevo Mailer',
      connected: verification.success,
      message: verification.message,
      latencyMs: verification.latencyMs,
      diagnostics,
      timestamp: new Date().toISOString(),
    })
  );
}
