// ==============================================================================
// Henglish Academy (HENGLISH) - CENTRALIZED PRODUCTION SUPABASE CLIENT
// Single Source of Truth for Supabase Client, Health Checks, and Typed Repositories
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfigStatus {
  isConfigured: boolean;
  projectUrl: string;
  hasAnonKey: boolean;
}

/**
 * Checks if genuine Supabase production credentials are configured
 */
export function getSupabaseConfig(): { url: string; anonKey: string; isConfigured: boolean } {
  const url =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
    '';

  const anonKey =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' &&
      (process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_ANON_KEY ||
        process.env.SUPABASE_PUBLISHABLE_KEY)) ||
    '';

  const isConfigured =
    Boolean(url) &&
    Boolean(anonKey) &&
    !url.includes('example.supabase.co') &&
    !url.includes('your-project-id') &&
    !anonKey.includes('your_supabase_anon');

  return { url, anonKey, isConfigured };
}

let clientInstance: SupabaseClient | null = null;

/**
 * Returns singleton Supabase client or null if unconfigured
 */
export function getSupabase(): SupabaseClient | null {
  if (clientInstance) return clientInstance;

  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  try {
    clientInstance = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'henglish_supabase_auth_token_v2',
      },
      global: {
        headers: {
          'x-application-name': 'henglish-academy-web',
        },
      },
    });
  } catch (err) {
    console.error('[SupabaseClient] Initialization failed:', err);
    clientInstance = null;
  }

  return clientInstance;
}

export const supabase = getSupabase();

/**
 * Tests live connectivity to Supabase
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
  const client = getSupabase();
  if (!client) {
    return { ok: false, latencyMs: 0, error: 'Supabase credentials not configured' };
  }

  const startTime = Date.now();
  try {
    const { error } = await client.auth.getSession();
    const latencyMs = Date.now() - startTime;
    if (error) {
      return { ok: false, latencyMs, error: error.message };
    }
    return { ok: true, latencyMs };
  } catch (err: any) {
    return { ok: false, latencyMs: Date.now() - startTime, error: err.message || 'Network error' };
  }
}
