// ==============================================================================
// HENGLISH ACADEMY - BREVO SMTP CONFIGURATION
// Server-side environment variable loader, validator & safe maskers
// ==============================================================================

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  fromEmail: string;
  fromName: string;
  isConfigured: boolean;
}

/**
 * Safely masks a sensitive secret for logs without revealing credential tokens
 */
export function maskSecret(secret?: string): string {
  if (!secret) return '(not configured)';
  if (secret.length <= 8) return '********';
  return `${secret.slice(0, 4)}...${secret.slice(-4)}`;
}

/**
 * Loads and validates server-side SMTP configuration from process.env
 * Strictly prevents exposure of credentials to the frontend.
 */
export function getSmtpConfig(): SmtpConfig {
  const host = (process.env.SMTP_HOST || 'smtp-relay.brevo.com').trim();
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = (process.env.SMTP_USER || '').trim();
  const password = (process.env.SMTP_PASSWORD || '').trim();
  const fromEmail = (process.env.SMTP_FROM_EMAIL || 'no-reply@henglish.academy').trim();
  const fromName = (process.env.SMTP_FROM_NAME || 'Henglish Academy').trim();

  const isConfigured = Boolean(
    host &&
    port &&
    user &&
    password &&
    !password.includes('REPLACE_WITH') &&
    !password.includes('ADD_NEW')
  );

  return {
    host,
    port: isNaN(port) ? 587 : port,
    user,
    password,
    fromEmail,
    fromName,
    isConfigured,
  };
}

/**
 * Returns safe diagnostic metadata (sanitized, zero secrets exposed)
 */
export function getSafeSmtpDiagnostics() {
  const config = getSmtpConfig();
  return {
    host: config.host,
    port: config.port,
    user: config.user ? `${config.user.slice(0, 4)}***` : '(empty)',
    fromEmail: config.fromEmail,
    fromName: config.fromName,
    isConfigured: config.isConfigured,
    hasPassword: Boolean(config.password && config.password.length > 5),
    maskedPassword: maskSecret(config.password),
  };
}
