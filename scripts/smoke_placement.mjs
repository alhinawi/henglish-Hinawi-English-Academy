// Smoke test for the placement session builder against the real question bank.
// Usage: node scripts/smoke_placement.mjs   (Node >= 22.6)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'placement-'));
for (const f of ['questionBankService.ts', 'placementService.ts']) {
  let s = fs.readFileSync(path.join(root, 'src/services', f), 'utf8');
  s = s.replace(/from '\.\/questionBankService'/g, "from './questionBankService.ts'")
       .replace(/import type \{ AssessmentQuestion \}[^\n]*\n/, 'type AssessmentQuestion = any;\n')
       .replace(/import \{\n  BankQuestion,\n  QuestionLevel,\n  QuestionSkill,/, 'import {');
  fs.writeFileSync(path.join(tmp, f), s);
}
// Node strips types but needs value-only imports; the service imports only values + types.
const mem = new Map();
globalThis.localStorage = {
  getItem: k => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: k => mem.delete(k),
};
const { buildPlacementFromPool, PLACEMENT_PLAN } = await import(pathToFileURL(path.join(tmp, 'placementService.ts')).href);

const chunkDir = path.join(root, 'public/data/questions/chunks');
const all = fs.readdirSync(chunkDir).sort().flatMap(f => JSON.parse(fs.readFileSync(path.join(chunkDir, f), 'utf8')));
console.log('bank size:', all.length);

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const ATTEMPTS = 60;
let failures = 0;
const fail = m => { failures++; console.log('FAIL:', m); };
const poolSize = {};
for (const q of all) if (q.type === 'multiple-choice') { const k = `${q.skill}|${q.level}`; poolSize[k] = (poolSize[k] || 0) + 1; }
const poolSeen = {};
let earlyRepeats = 0;
const seen = new Map();
const skillTotals = {};
let repeatsAcrossAttempts = 0;
for (let a = 0; a < ATTEMPTS; a++) {
  const s = buildPlacementFromPool(all);
  if (s.length !== 12) fail(`attempt ${a}: ${s.length} questions`);
  for (const lv of levels) if (s.filter(q => q.level === lv).length !== 2) fail(`attempt ${a}: level ${lv} count`);
  if (new Set(s.map(q => q.id)).size !== s.length) fail(`attempt ${a}: duplicate id in session`);
  for (const q of s) {
    if (q.options.length !== 4 || q.type !== 'multiple-choice') fail(`${q.id} not 4-option MC`);
    if (!(q.answerIndex >= 0 && q.answerIndex < q.options.length)) fail(`${q.id} bad answerIndex`);
    if (q.skill === 'listening' && !q.audioText) fail(`${q.id} listening without audioText`);
    if (q.skill === 'reading' && !q.passage) fail(`${q.id} reading without passage`);
    skillTotals[q.skill] = (skillTotals[q.skill] || 0) + 1;
    const pk = `${q.skill}|${q.level}`;
    poolSeen[pk] = poolSeen[pk] || new Set();
    // A repeat is only acceptable once every question of that (skill, level) pool was served.
    if (poolSeen[pk].has(q.id)) {
      repeatsAcrossAttempts++;
      if (poolSeen[pk].size < poolSize[pk]) earlyRepeats++;
      if (poolSeen[pk].size >= poolSize[pk]) poolSeen[pk] = new Set();
    }
    poolSeen[pk].add(q.id);
    seen.set(q.id, a);
  }
}
console.log('attempts:', ATTEMPTS, 'distinct questions served:', seen.size, 'of', ATTEMPTS * 12);
console.log('repeats after pool exhausted (small pools only):', repeatsAcrossAttempts);
console.log('MC pool sizes (skill|level):', JSON.stringify(poolSize));
console.log('skill totals:', skillTotals);
console.log('repeats before the pool was exhausted:', earlyRepeats);
if (earlyRepeats > 0) fail('question repeated before its pool was exhausted');
console.log(failures === 0 ? 'SMOKE OK' : `SMOKE FAILED (${failures})`);
process.exit(failures === 0 ? 0 : 1);
