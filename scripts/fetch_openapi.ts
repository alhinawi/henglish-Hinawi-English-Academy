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

async function fetchOpenApi() {
  const res = await fetch(`${url}/rest/v1/`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });

  console.log('Status:', res.status, res.statusText);
  const data = await res.json();
  const tables = Object.keys(data.definitions || {});
  console.log('Tables exposed in OpenAPI schema:', tables.length);
  if (tables.length > 0) {
    console.log('Tables:', tables);
  } else {
    console.log('No public tables exposed in schema.');
  }
}

fetchOpenApi().catch(console.error);
