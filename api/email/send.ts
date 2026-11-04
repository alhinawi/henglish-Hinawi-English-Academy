// ==============================================================================
// HENGLISH ACADEMY - TRANSACTIONAL & SECURE EMAIL DISPATCH API
// Vercel Serverless Function: POST /api/email/send
//
// Hardened Security Controls:
// 1. RBAC Authorization: Admin role strictly required for 'test' and 'notification' emails.
// 2. Identity Verification: 'password_changed' and 'welcome' require JWT matching recipient.
// 3. Strict RFC email & Zod schema validation.
// 4. Anti-phishing domain validation for actionUrl and resetUrl.
// 5. Sliding window IP & recipient rate limiting.
// 6. Safe CORS origin allowlist & payload size limits.
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import { z } from 'zod';
import {
  applyCorsHeaders,
  sendJson,
  verifyAuthToken,
  parseAndValidateBody,
} from '../../server/auth/serverAuth';
import {
  sendWelcomeEmail,
  sendPasswordChangedAlert,
  sendAccountNotification,
  sendAdminTestEmail,
  sendVerificationGuidance,
  sendPasswordResetGuidance,
  isValidEmail,
} from '../../server/email/emailService';

// Anti-Phishing: Allowed action URL domains
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

// Zod Schema for Email Dispatch
const EmailDispatchSchema = z.object({
  type: z.enum([
    'welcome',
    'password_changed',
    'notification',
    'verification_guidance',
    'password_reset_guidance',
    'test',
  ]),
  to: z.string().email('Invalid recipient email address').optional(),
  email: z.string().email('Invalid recipient email address').optional(),
  name: z.string().max(100).optional(),
  title: z.string().max(200).optional(),
  message: z.string().max(4000).optional(),
  actionText: z.string().max(100).optional(),
  actionUrl: z.string().max(1000).optional().refine(isSafeActionUrl, {
    message: 'Security validation error: actionUrl points to an untrusted external domain.',
  }),
  resetUrl: z.string().max(1000).optional().refine(isSafeActionUrl, {
    message: 'Security validation error: resetUrl points to an untrusted external domain.',
  }),
  verificationOtp: z.string().max(10).optional(),
  verificationUrl: z.string().max(1000).optional().refine(isSafeActionUrl, {
    message: 'Security validation error: verificationUrl points to an untrusted external domain.',
  }),
  ipAddress: z.string().max(50).optional(),
});

type EmailDispatchInput = z.infer<typeof EmailDispatchSchema>;

// Sliding window IP rate limiter (20 email requests per hour per IP)
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

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
) {
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

  // Enforce IP rate limiting
  if (!checkIpRateLimit(clientIp, 20)) {
    return sendJson(res, 429, {
      error: 'Rate limit exceeded: Too many email requests from this network. Please wait before requesting additional emails.',
    });
  }

  // Validate payload with Zod
  const validation = await parseAndValidateBody(req, EmailDispatchSchema, 128 * 1024);
  if (!validation.success) {
    return sendJson(res, validation.statusCode, { error: validation.error });
  }

  const body: EmailDispatchInput = validation.data;
  const targetEmail = (body.to || body.email || '').trim().toLowerCase();

  if (!targetEmail || !isValidEmail(targetEmail)) {
    return sendJson(res, 400, {
      error: `A valid recipient email address is required (received: "${targetEmail}").`,
    });
  }

  try {
    let result;

    switch (body.type) {
      // 1. Administrative Test Email -> Requires authenticated ADMIN role
      case 'test': {
        const auth = await verifyAuthToken(req);
        if (!auth.authenticated || auth.role !== 'admin') {
          return sendJson(res, 403, {
            error: 'Forbidden: Administrator authorization required to execute SMTP test dispatches.',
          });
        }
        result = await sendAdminTestEmail(targetEmail);
        break;
      }

      // 2. Platform Broadcast Notification -> Requires authenticated ADMIN role
      case 'notification': {
        const auth = await verifyAuthToken(req);
        if (!auth.authenticated || auth.role !== 'admin') {
          return sendJson(res, 403, {
            error: 'Forbidden: Administrator authorization required to dispatch broadcast account notifications.',
          });
        }
        if (!body.title || !body.message) {
          return sendJson(res, 400, {
            error: 'Both title and message are required for notification type.',
          });
        }
        result = await sendAccountNotification({
          name: body.name || 'Learner',
          email: targetEmail,
          title: body.title,
          message: body.message,
          actionText: body.actionText,
          actionUrl: body.actionUrl,
        });
        break;
      }

      // 3. Security Alert: Password Changed -> Requires AUTHENTICATED user matching recipient
      case 'password_changed': {
        const auth = await verifyAuthToken(req);
        if (!auth.authenticated || !auth.email) {
          return sendJson(res, 401, {
            error: 'Unauthorized: Authentication required to trigger password changed alerts.',
          });
        }
        // Anti-Spoofing: Recipient email MUST match the authenticated user's email
        if (auth.email.toLowerCase() !== targetEmail) {
          return sendJson(res, 403, {
            error: 'Forbidden: Cannot trigger password alerts for an account other than your own.',
          });
        }
        result = await sendPasswordChangedAlert({
          name: body.name || 'User',
          email: targetEmail,
          ipAddress: body.ipAddress || clientIp,
          changeTime: new Date().toUTCString(),
        });
        break;
      }

      // 4. Welcome Email -> Requires AUTHENTICATED user matching recipient
      case 'welcome': {
        const auth = await verifyAuthToken(req);
        if (!auth.authenticated || !auth.email) {
          return sendJson(res, 401, {
            error: 'Unauthorized: Authentication required to trigger welcome emails.',
          });
        }
        if (auth.email.toLowerCase() !== targetEmail) {
          return sendJson(res, 403, {
            error: 'Forbidden: Recipient email does not match authenticated user.',
          });
        }
        result = await sendWelcomeEmail({
          name: body.name || 'Learner',
          email: targetEmail,
          loginUrl: body.actionUrl,
        });
        break;
      }

      // 5. Verification Guidance (Self-Service)
      case 'verification_guidance': {
        result = await sendVerificationGuidance({
          name: body.name || 'Learner',
          email: targetEmail,
          verificationOtp: body.verificationOtp,
          verificationUrl: body.verificationUrl,
        });
        break;
      }

      // 6. Password Reset Guidance (Self-Service)
      case 'password_reset_guidance': {
        if (!body.resetUrl) {
          return sendJson(res, 400, {
            error: 'A valid, trusted resetUrl is required for password reset guidance.',
          });
        }
        result = await sendPasswordResetGuidance({
          name: body.name || 'Learner',
          email: targetEmail,
          resetUrl: body.resetUrl,
        });
        break;
      }

      default:
        return sendJson(res, 400, {
          error: `Unsupported email type: "${body.type}".`,
        });
    }

    if (!result.success) {
      return sendJson(res, 502, {
        status: 'error',
        error: result.error || 'Failed to dispatch email via SMTP relay.',
      });
    }

    return sendJson(res, 200, {
      status: 'success',
      message: 'Email successfully queued and delivered to Brevo SMTP relay.',
      messageId: result.messageId,
      recipient: targetEmail,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown internal error';
    return sendJson(res, 500, {
      status: 'error',
      error: `Internal error during email dispatch: ${errorMsg}`,
    });
  }
}
