import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Read local .env
const envPath = path.resolve(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split(/\r?\n/);

const envVars = [];
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  const value = trimmed.slice(eqIdx + 1).trim();
  if (key && value && !value.includes('your_') && !value.includes('your-project-id')) {
    envVars.push({ key, value });
  }
}

console.log(`📦 Found ${envVars.length} environment variables to push to Vercel...`);

const targets = ['production', 'preview', 'development'];

for (const { key, value } of envVars) {
  for (const target of targets) {
    try {
      console.log(`➡️ Adding ${key} to ${target}...`);
      // Echo value to vercel env add command
      const cmd = `npx vercel env add ${key} ${target} --force`;
      execSync(cmd, { input: value, stdio: ['pipe', 'inherit', 'inherit'] });
    } catch {
      console.warn(`⚠️ Could not add ${key} to ${target} (might already exist or need link)`);
    }
  }
}

console.log('✅ Finished environment variables sync to Vercel.');
