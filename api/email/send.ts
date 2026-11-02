// ==============================================================================
// HENGLISH ACADEMY - TRANSACTIONAL EMAIL DISPATCH API
// Vercel Serverless Function: POST /api/email/send
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
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

function parseJsonBody(req: IncomingMessage): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 512 * 1024) { // 512KB limit for email payloads
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

  let body: Record<string, any> = {};
  try {
    body = await parseJsonBody(req);
  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid JSON request payload.' }));
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
          ipAddress: ipAddress || (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
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
        if (!body.resetUrl) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'resetUrl is required for password_reset_guidance.' }));
          return;
        }
        result = await sendPasswordResetGuidance({
          name: name || 'Learner',
          email: targetEmail,
          resetUrl: body.resetUrl,
        });
        break;

      case 'test':
        result = await sendAdminTestEmail(targetEmail);
        break;

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
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        status: 'error',
        error: `Internal server error during email dispatch: ${errorMsg}`,
      })
    );
  }
}
