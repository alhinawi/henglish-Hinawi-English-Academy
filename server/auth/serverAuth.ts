// ==============================================================================
// HENGLISH ACADEMY - SERVER-SIDE AUTHENTICATION & AUTHORIZATION ENGINE
// Authoritative Supabase JWT verification, RBAC enforcement & Origin Protection
// File: server/auth/serverAuth.ts
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import { createClient, SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { z, ZodSchema } from 'zod';
import type { UserRole } from '../../src/types';

// Approved origins for cross-origin requests
const TRUSTED_ORIGIN_PATTERNS = [
  /^https:\/\/(.*\.)?henglish\.academy$/,
  /^https:\/\/(.*\.)?vercel\.app$/,
  /^http:\/\/localhost(:[0-9]+)?$/,
  /^http:\/\/127\.0\.0\.1(:[0-9]+)?$/,
];

export function applyCorsHeaders(req: IncomingMessage, res: ServerResponse): boolean {
  const origin = req.headers.origin || '';
  let isAllowed = false;

  if (origin) {
    isAllowed = TRUSTED_ORIGIN_PATTERNS.some(pattern => pattern.test(origin));
  } else {
    // Non-browser or same-origin request
    isAllowed = true;
  }

  const effectiveOrigin = isAllowed && origin ? origin : 'https://henglish.academy';
  res.setHeader('Access-Control-Allow-Origin', effectiveOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  return false;
}

export function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  // SECURITY: Prioritize server-only SUPABASE_SERVICE_ROLE_KEY. Never expose service role key to frontend!
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export interface VerifiedAuthContext {
  authenticated: boolean;
  user?: SupabaseUser;
  userId?: string;
  email?: string;
  role?: UserRole;
  isEmailVerified: boolean;
  error?: string;
}

/**
 * Extracts and authoritatively verifies the Supabase JWT token from the Authorization header,
 * then checks the user's database role and account status in public.profiles.
 */
export async function verifyAuthToken(req: IncomingMessage): Promise<VerifiedAuthContext> {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      authenticated: false,
      isEmailVerified: false,
      error: 'Missing or malformed Authorization header.',
    };
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return {
      authenticated: false,
      isEmailVerified: false,
      error: 'Empty Bearer token.',
    };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      authenticated: false,
      isEmailVerified: false,
      error: 'Supabase server client unconfigured.',
    };
  }

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return {
        authenticated: false,
        isEmailVerified: false,
        error: userError?.message || 'Invalid or expired authentication token.',
      };
    }

    const user = userData.user;

    // Fetch authoritative role and account status from public.profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, account_status, is_email_verified')
      .eq('id', user.id)
      .single();

    if (profile?.account_status === 'suspended') {
      return {
        authenticated: false,
        isEmailVerified: false,
        error: 'Account has been suspended. Contact support.',
      };
    }

    const verifiedRole: UserRole = (profile?.role as UserRole) || (user.app_metadata?.role as UserRole) || 'student';
    const isEmailVerified = Boolean(user.email_confirmed_at || profile?.is_email_verified);

    return {
      authenticated: true,
      user,
      userId: user.id,
      email: user.email || '',
      role: verifiedRole,
      isEmailVerified,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      authenticated: false,
      isEmailVerified: false,
      error: `Token verification failed: ${msg}`,
    };
  }
}

/**
 * Helper to parse and validate request JSON bodies against a Zod schema.
 */
export async function parseAndValidateBody<T>(
  req: IncomingMessage & { body?: unknown },
  schema: ZodSchema<T>,
  maxBytes: number = 256 * 1024
): Promise<{ success: true; data: T } | { success: false; error: string; statusCode: number }> {
  // If already parsed by serverless runtime
  if (req.body && typeof req.body === 'object') {
    const result = schema.safeParse(req.body);
    if (result.success) {
      return { success: true, data: result.data };
    }
    const errMsg = result.error.issues.map(e => `${e.path.map(String).join('.')}: ${e.message}`).join(', ');
    return { success: false, error: `Validation error: ${errMsg}`, statusCode: 400 };
  }

  return new Promise(resolve => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > maxBytes) {
        resolve({ success: false, error: 'Payload exceeds maximum permitted size.', statusCode: 413 });
      }
    });

    req.on('end', () => {
      if (!raw.trim()) {
        const result = schema.safeParse({});
        if (result.success) return resolve({ success: true, data: result.data });
        return resolve({ success: false, error: 'Empty request body.', statusCode: 400 });
      }

      try {
        const parsed = JSON.parse(raw);
        const result = schema.safeParse(parsed);
        if (result.success) {
          resolve({ success: true, data: result.data });
        } else {
          const errMsg = result.error.issues.map(e => `${e.path.map(String).join('.')}: ${e.message}`).join(', ');
          resolve({ success: false, error: `Validation error: ${errMsg}`, statusCode: 400 });
        }
      } catch {
        resolve({ success: false, error: 'Malformed JSON payload.', statusCode: 400 });
      }
    });

    req.on('error', err => {
      resolve({ success: false, error: `Stream read error: ${err.message}`, statusCode: 400 });
    });
  });
}
