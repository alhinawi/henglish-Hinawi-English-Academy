const fs = require('fs'), vm = require('vm'), ts = require('typescript'), assert = require('assert/strict');
const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const data = { exports: {} };
vm.runInNewContext(compile(fs.readFileSync('src/data/verbsData.ts', 'utf8')), data);
const verbs = data.exports.VERB_TOOLKIT;
const source = fs.readFileSync('src/components/arcade/games/WordLabGames.tsx', 'utf8');
const builder = source.slice(source.indexOf('function seeded'), source.indexOf('export function WordLabGame('));
for (const arrange of [items => items, items => [...items].reverse(), ...Array.from({length: 50}, (_, seed) => items => { const out = [...items];let state = seed + 1;for(let i = out.length - 1;i > 0;i--){state = (state * 1664525 + 1013904223) >>> 0;const j = state % (i + 1);[out[i],out[j]] = [out[j],out[i]];}return out;})]) {
 const context = { exports: {}, Date, WORDS: [], uniqueAcademyWords: a => a, VERB_TOOLKIT: verbs, shuffle: arrange };
 vm.runInNewContext(compile(builder), context);
 const rounds = context.exports.buildWordLabRounds('verb-workshop', 'all');
 assert.equal(rounds.length, 10);
 assert.equal(new Set(rounds.map(r => r.prompt)).size, 10);
 for (const round of rounds) {
  const canonical = verbs.find(v => v.v1 === round.prompt);
  assert.equal(round.answer, canonical.v2);assert.equal(round.extra, canonical.v3);assert.equal(round.detail, canonical.example);
 }
}
// Force learn into every short session; both legitimate regional spellings survive.
const context = { exports: {}, Date, WORDS: [], uniqueAcademyWords: a => a, VERB_TOOLKIT: verbs, shuffle: a => [...a].sort((x,y) => Number(y.v1 === 'learn') - Number(x.v1 === 'learn')) };
vm.runInNewContext(compile(builder), context);
const learn = context.exports.buildWordLabRounds('verb-workshop', 'all').find(r => r.prompt === 'learn');
for (const form of ['learned', 'learnt']) { assert(learn.answer.split(' / ').includes(form));assert(learn.extra.split(' / ').includes(form)); }
assert.equal(verbs.length, 60); // Keep every teaching example, deduplicate only the game selection.
console.log('Verb workshop selects 10 distinct base verbs across ordered/reverse/random sessions, retains canonical examples and learned/learnt answers, all 60 source entries preserved: PASS');
