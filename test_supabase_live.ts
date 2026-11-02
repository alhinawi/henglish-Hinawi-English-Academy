// ==============================================================================
// HENGLISH ACADEMY - LIVE SUPABASE CONNECTIVITY & AUTH VALIDATION
// Verifies live connectivity to https://ywjvgawhrcbkmuuqewrt.supabase.co
// ==============================================================================

import * as fs from 'fs';
import * as path from 'path';

// Load .env variables
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const idx = trimmed.indexOf('=');
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (key && !process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (err) {
  console.warn('Could not load .env file:', err);
}

import { isSupabaseConfigured, supabase, initSupabaseClient } from './src/services/authService';

// Ensure client re-initialized with loaded env vars
const activeSupabase = initSupabaseClient();

let passed = 0;
let failed = 0;

function assert(condition: boolean, name: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${name}`);
    failed++;
  }
}

async function runLiveSupabaseTests() {
  console.log('\n======================================================');
  console.log('⚡ SUPABASE LIVE INSTANCE CONNECTIVITY TEST');
  console.log('======================================================\n');

  // 1. Configuration Guard
  const configured = isSupabaseConfigured();
  assert(configured === true, 'isSupabaseConfigured() detects valid live Supabase credentials');

  // 2. Client Instance
  assert(supabase !== null, 'Supabase client is initialized successfully');

  // 3. Ping Supabase Auth Health endpoint
  const url = process.env.VITE_SUPABASE_URL || 'https://ywjvgawhrcbkmuuqewrt.supabase.co';
  const apiKey = process.env.VITE_SUPABASE_ANON_KEY || '';

  console.log(`  Target Instance: ${url}`);
  console.log(`  Publishable Key: ${apiKey.slice(0, 15)}...${apiKey.slice(-6)}`);

  try {
    const startTime = Date.now();
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const latency = Date.now() - startTime;
    console.log(`  Auth Health Response: HTTP ${res.status} (${latency}ms)`);
    assert(res.ok || res.status === 200, `Supabase Auth service is healthy and reachable (${latency}ms)`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    assert(false, `Network connection to Supabase failed: ${msg}`);
  }

  // 4. Test Supabase Client API Call (getSession)
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.getSession();
      assert(!error, `supabase.auth.getSession() completed cleanly (session: ${data.session ? 'active' : 'null (guest)'})`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      assert(false, `supabase.auth.getSession() threw: ${msg}`);
    }
  }

  console.log('\n======================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runLiveSupabaseTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
