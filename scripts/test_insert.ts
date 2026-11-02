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

async function testPermissions() {
  console.log('Testing insert on gameverse_definitions with anon key...');
  const { data, error } = await supabase.from('gameverse_definitions').insert({
    id: 'test-game',
    title: 'Test Game',
    description: 'Test Description',
    category: 'vocabulary',
    difficulty: 'beginner',
    is_active: true
  }).select();

  console.log('Insert gameverse_definitions:', error ? `Error: ${error.code} - ${error.message}` : `Success: ${JSON.stringify(data)}`);
  
  if (!error) {
    // clean up test record
    await supabase.from('gameverse_definitions').delete().eq('id', 'test-game');
    console.log('Cleaned up test record');
  }
}

testPermissions();
