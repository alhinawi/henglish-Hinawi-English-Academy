// ==============================================================================
// HENGLISH ACADEMY - BREVO SMTP SERVER-SIDE SERVICE
// Authoritative email delivery, connection verification, rate limiting & error shielding
// ==============================================================================

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { getSmtpConfig, maskSecret } from './emailConfig';
import {
  renderWelcomeEmail,
  renderVerificationGuidanceEmail,
  renderPasswordResetGuidanceEmail,
  renderPasswordChangedEmail,
  renderAccountNotificationEmail,
  renderAdminTestEmail,
  WelcomeEmailParams,
  VerificationGuidanceEmailParams,
  PasswordResetGuidanceParams,
  PasswordChangedEmailParams,
  AccountNotificationParams,
} from './emailTemplates';

// Email address format validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim();
  return clean.length >= 5 && clean.length <= 254 && EMAIL_REGEX.test(clean);
}

// In-Memory Rate Limiting: max 5 emails per recipient per hour
interface RateLimitRecord {
  timestamps: number[];
}
const recipientRateLimits = new Map<string, RateLimitRecord>();

function checkRecipientRateLimit(recipient: string, maxPerHour: number = 5): boolean {
  const clean = recipient.trim().toLowerCase();
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;

  const record = recipientRateLimits.get(clean) || { timestamps: [] };
  // Filter out timestamps older than 1 hour
  record.timestamps = record.timestamps.filter(t => t > oneHourAgo);

  if (record.timestamps.length >= maxPerHour) {
    return false; // Rate limit exceeded
  }

  record.timestamps.push(now);
  recipientRateLimits.set(clean, record);
  return true;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  tags?: string[];
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  accepted?: string[];
  rejected?: string[];
  error?: string;
}

// Cached singleton transporter
let cachedTransporter: Transporter | null = null;
let lastConfigHash: string = '';

function getTransporter(): { transporter: Transporter; error?: string } {
  const config = getSmtpConfig();

  if (!config.isConfigured || !config.password) {
    return {
      transporter: null as unknown as Transporter,
      error: 'Brevo SMTP credentials are not configured in environment variables (SMTP_PASSWORD missing).',
    };
  }

  const currentHash = `${config.host}:${config.port}:${config.user}:${config.password.slice(0, 5)}`;
  if (cachedTransporter && lastConfigHash === currentHash) {
    return { transporter: cachedTransporter };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: false, // 587 uses STARTTLS
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: {
        rejectUnauthorized: true,
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });

    cachedTransporter = transporter;
    lastConfigHash = currentHash;
    return { transporter };
  } catch (err: unknown) {
    const safeMsg = err instanceof Error ? err.message : String(err);
    return {
      transporter: null as unknown as Transporter,
      error: `Failed to initialize SMTP transporter: ${safeMsg}`,
    };
  }
}

/**
 * Verifies live connection to the Brevo SMTP server using STARTTLS handshake
 */
export async function verifySmtpConnection(): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
}> {
  const startTime = Date.now();
  const { transporter, error } = getTransporter();

  if (!transporter) {
    return {
      success: false,
      message: error || 'SMTP transporter unavailable',
    };
  }

  try {
    await transporter.verify();
    const latencyMs = Date.now() - startTime;
    return {
      success: true,
      message: `Successfully verified connection to Brevo SMTP relay (${latencyMs}ms)`,
      latencyMs,
    };
  } catch (err: unknown) {
    const rawMsg = err instanceof Error ? err.message : String(err);
    // Sanitize any potential credential leaks from error message
    const safeMsg = rawMsg.replace(/AUTH\s+[A-Za-z0-9+/=]+/gi, 'AUTH [MASKED]');
    return {
      success: false,
      message: `Brevo SMTP verification failed: ${safeMsg}`,
      latencyMs: Date.now() - startTime,
    };
  }
}

/**
 * Sends a raw transactional email via Brevo SMTP with rate-limiting and validation
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html, text, replyTo } = options;

  // 1. Recipient validation
  if (!isValidEmail(to)) {
    return {
      success: false,
      error: `Invalid recipient email address: "${to}".`,
    };
  }

  // 2. Rate limit check
  if (!checkRecipientRateLimit(to)) {
    return {
      success: false,
      error: `Rate limit exceeded for recipient: ${to}. Please wait before requesting additional emails.`,
    };
  }

  // 3. Transporter resolution
  const config = getSmtpConfig();
  const { transporter, error: transError } = getTransporter();
  if (!transporter) {
    return {
      success: false,
      error: transError || 'SMTP service unavailable.',
    };
  }

  // 4. Execution
  try {
    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: to.trim().toLowerCase(),
      subject,
      html,
      text,
      replyTo: replyTo || config.fromEmail,
      headers: {
        'X-Henglish-Platform': 'v2.0',
        'X-Mailer': 'Henglish Brevo Mailer',
      },
    });

    return {
      success: true,
      messageId: info.messageId,
      accepted: Array.isArray(info.accepted) ? info.accepted.map(String) : [],
      rejected: Array.isArray(info.rejected) ? info.rejected.map(String) : [],
    };
  } catch (err: unknown) {
    const rawMsg = err instanceof Error ? err.message : String(err);
    // Sanitize any password or auth hash from log / response
    const sanitized = rawMsg
      .replace(new RegExp(config.password || '___NONE___', 'g'), '[REDACTED_KEY]')
      .replace(/AUTH\s+[A-Za-z0-9+/=]+/gi, 'AUTH [REDACTED]');

    return {
      success: false,
      error: `SMTP delivery failed: ${sanitized}`,
    };
  }
}

// ==============================================================================
// HIGH-LEVEL CONVENIENCE HELPERS
// ==============================================================================

/**
 * 1. Send Welcome Email
 */
export async function sendWelcomeEmail(params: WelcomeEmailParams): Promise<SendEmailResult> {
  const rendered = renderWelcomeEmail(params);
  return sendEmail({
    to: params.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}

/**
 * 2. Send Password Changed Security Alert
 */
export async function sendPasswordChangedAlert(params: PasswordChangedEmailParams): Promise<SendEmailResult> {
  const rendered = renderPasswordChangedEmail(params);
  return sendEmail({
    to: params.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}

/**
 * 3. Send Important Account Notification
 */
export async function sendAccountNotification(params: AccountNotificationParams): Promise<SendEmailResult> {
  const rendered = renderAccountNotificationEmail(params);
  return sendEmail({
    to: params.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}

/**
 * 4. Send Verification Guidance
 */
export async function sendVerificationGuidance(params: VerificationGuidanceEmailParams): Promise<SendEmailResult> {
  const rendered = renderVerificationGuidanceEmail(params);
  return sendEmail({
    to: params.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}

/**
 * 5. Send Password Reset Guidance
 */
export async function sendPasswordResetGuidance(params: PasswordResetGuidanceParams): Promise<SendEmailResult> {
  const rendered = renderPasswordResetGuidanceEmail(params);
  return sendEmail({
    to: params.email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}

/**
 * 6. Send Administrative Test Email
 */
export async function sendAdminTestEmail(targetEmail: string): Promise<SendEmailResult> {
  const config = getSmtpConfig();
  const rendered = renderAdminTestEmail({
    timestamp: new Date().toISOString(),
    host: config.host,
    user: config.user,
    environment: process.env.NODE_ENV || 'production',
  });

  return sendEmail({
    to: targetEmail,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text,
  });
}
