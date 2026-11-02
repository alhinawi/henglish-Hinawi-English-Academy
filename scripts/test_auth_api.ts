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

async function testAuthEndpoint() {
  const testEmail = `henglish.student.test${Math.floor(Math.random()*10000)}@gmail.com`;
  console.log('Testing with email:', testEmail);
  const signUpRes = await supabase.auth.signUp({
    email: testEmail,
    password: 'SecureTestPassword999!'
  });
  console.log('signUp result:', {
    user: signUpRes.data?.user?.id,
    email: signUpRes.data?.user?.email,
    error: signUpRes.error ? `${signUpRes.error.status} - ${signUpRes.error.message}` : null
  });
}

testAuthEndpoint().catch(console.error);
