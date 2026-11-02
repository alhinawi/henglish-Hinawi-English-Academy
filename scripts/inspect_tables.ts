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

const tablesToCheck = ['profiles', 'courses', 'lessons', 'grammar_topics', 'gameverse_definitions', 'dictionary_lexical_entries'];

async function inspectTables() {
  for (const t of tablesToCheck) {
    const res = await supabase.from(t).select('*', { count: 'exact', head: true });
    console.log(`Table '${t}':`, {
      hasData: res.data !== null,
      count: res.count,
      error: res.error ? { code: res.error.code, message: res.error.message, details: res.error.details, hint: res.error.hint } : null
    });
  }
}

inspectTables();
