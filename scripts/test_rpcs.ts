import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY!;
const supabase = createClient(url, key);

async function testRPCs() {
  console.log('Testing RPC functions...');
  
  // 1. search_dictionary_entries
  try {
    const { data, error } = await supabase.rpc('search_dictionary_entries', { search_term: 'test', result_limit: 5 });
    console.log('search_dictionary_entries:', error ? `Error: ${error.message}` : `Success (${data?.length || 0} items)`);
  } catch (e: any) {
    console.log('search_dictionary_entries exception:', e.message);
  }

  // 2. submit_verified_game_session
  try {
    const { data, error } = await supabase.rpc('submit_verified_game_session', {
      p_user_id: '00000000-0000-0000-0000-000000000000',
      p_game_id: 'word-runner',
      p_score: 100,
      p_accuracy: 95,
      p_duration_seconds: 60,
      p_idempotency_key: 'test-key-1'
    });
    console.log('submit_verified_game_session:', error ? `Expected security/validation error or result: ${error.message}` : `Result: ${JSON.stringify(data)}`);
  } catch (e: any) {
    console.log('submit_verified_game_session exception:', e.message);
  }
}

testRPCs();
