// ==============================================================================
// HENGLISH ACADEMY - TRANSACTIONAL EMAIL DISPATCH API
// Vercel Serverless Function: POST /api/email/send
// Hardened with:
// 1. Admin authorization for administrative test emails
// 2. Action URL anti-phishing domain validation
// 3. IP-based and recipient-based rate limiting
// 4. Payload size limits and strict RFC email validation
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient } from '@supabase/supabase-js';
import {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordChangedAlert,
  sendAccountNotification,
  sendAdminTestEmail,
  sendVerificationGuidance,
  sendPasswordResetGuidance,
  isValidEmail,
} from '../../server/email/emailService';

// Sliding window IP rate limiter
const ipRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkIpRateLimit(ip: string, limit = 20, windowMs = 60 * 60 * 1000): boolean {
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

/**
 * Validates that action URLs provided in transactional email templates
 * do not point to arbitrary third-party phishing or credential harvesting domains.
 */
function isSafeActionUrl(url?: string): boolean {
  if (!url) return true;
  const trimmed = url.trim();
  // Relative paths are always safe
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    return (
      host === 'henglish.academy' ||
      host.endsWith('.henglish.academy') ||
      host === 'henglish.vercel.app' ||
      host.endsWith('.vercel.app') ||
      host === 'localhost' ||
      host === '127.0.0.1'
    );
  } catch {
    return false;
  }
}

/**
 * Verifies if the request Authorization header belongs to an authenticated Administrator.
 */
async function verifyAdminAuth(req: IncomingMessage): Promise<boolean> {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.slice(7).trim();
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || !token) return false;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) return false;

    // Check user profile role in profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();

    return profile?.role === 'admin' || userData.user.app_metadata?.role === 'admin';
  } catch {
    return false;
  }
}

function parseJsonBody(req: IncomingMessage): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 256 * 1024) { // 256KB strict limit for email payloads
        reject(new Error('Payload too large'));
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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST.' }));
    return;
  }

  const clientIp = (
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'anonymous'
  ).split(',')[0].trim();

  // Enforce IP rate limiting: max 20 email triggers per hour per IP
  if (!checkIpRateLimit(clientIp, 20)) {
    res.statusCode = 429;
    res.end(
      JSON.stringify({
        error: 'Too many email requests from this network. Please wait before requesting additional emails.',
      })
    );
    return;
  }

  let body: Record<string, any> = {};
  try {
    body = await parseJsonBody(req);
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid JSON request payload or exceeded maximum allowed size.' }));
    return;
  }

  const { type, to, name, email, title, message, actionText, actionUrl, ipAddress } = body;
  const targetEmail = (to || email || '').trim().toLowerCase();

  if (!targetEmail || !isValidEmail(targetEmail)) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        error: `A valid recipient email address is required (received: "${targetEmail}").`,
      })
    );
    return;
  }

  // Anti-Phishing: Validate that action URL is safe and points only to trusted application domains
  if (actionUrl && !isSafeActionUrl(actionUrl)) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        error: 'Security validation error: actionUrl points to an untrusted external domain.',
      })
    );
    return;
  }

  try {
    let result;

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail({
          name: name || 'Learner',
          email: targetEmail,
          loginUrl: actionUrl,
        });
        break;

      case 'password_changed':
        result = await sendPasswordChangedAlert({
          name: name || 'User',
          email: targetEmail,
          ipAddress: ipAddress || clientIp,
          changeTime: new Date().toUTCString(),
        });
        break;

      case 'notification':
        if (!title || !message) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Both title and message are required for notification type.' }));
          return;
        }
        result = await sendAccountNotification({
          name: name || 'Learner',
          email: targetEmail,
          title,
          message,
          actionText,
          actionUrl,
        });
        break;

      case 'verification_guidance':
        result = await sendVerificationGuidance({
          name: name || 'Learner',
          email: targetEmail,
          verificationOtp: body.verificationOtp,
          verificationUrl: body.verificationUrl,
        });
        break;

      case 'password_reset_guidance':
        if (!body.resetUrl || !isSafeActionUrl(body.resetUrl)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'A valid, trusted resetUrl is required for password reset guidance.' }));
          return;
        }
        result = await sendPasswordResetGuidance({
          name: name || 'Learner',
          email: targetEmail,
          resetUrl: body.resetUrl,
        });
        break;

      case 'test': {
        // Administrative test emails strictly require verified Administrator credentials
        const isAdmin = await verifyAdminAuth(req);
        if (!isAdmin) {
          res.statusCode = 403;
          res.end(
            JSON.stringify({
              error: 'Forbidden: Admin authorization is required to execute administrative SMTP test dispatches.',
            })
          );
          return;
        }
        result = await sendAdminTestEmail(targetEmail);
        break;
      }

      default:
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            error: `Unsupported email type: "${type}". Supported types: welcome, password_changed, notification, verification_guidance, password_reset_guidance, test.`,
          })
        );
        return;
    }

    if (!result.success) {
      res.statusCode = 502;
      res.end(
        JSON.stringify({
          status: 'error',
          error: result.error,
        })
      );
      return;
    }

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        status: 'success',
        message: 'Email successfully queued and delivered to Brevo SMTP relay.',
        messageId: result.messageId,
        recipient: targetEmail,
      })
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        status: 'error',
        error: `Internal error during email dispatch: ${errorMsg}`,
      })
    );
  }
}
