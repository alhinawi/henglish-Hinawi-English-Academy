const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const context = { exports: {}, require: name => load(path.resolve(path.dirname(file), name + '.ts')) };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, context);
  cache.set(file, context.exports);
  return context.exports;
}
const { ALL_LISTENING_LESSONS: lessons, normalizeListeningAnswer: normalize } = load('src/data/listeningAcademyData.ts');
const { listeningGapActivity: build } = load('src/services/listeningActivities.ts');
let seed = 1823;
const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
const snapshot = JSON.stringify(lessons);
const vocabulary = new Set(lessons.flatMap(l => l.dictationSentence.split(' ')).map(normalize));
for (const lesson of lessons) {
  const positions = new Set();
  const distractorSets = new Set();
  for (let round = 0; round < 80; round++) {
    const gap = build(lesson, lessons, random);
    assert.equal(gap.options.length, 4, lesson.id);
    assert.equal(new Set(gap.options).size, 4, lesson.id);
    assert.equal(gap.options.filter(w => w === gap.answer).length, 1);
    assert(gap.options.every(w => vocabulary.has(w)));
    assert.equal((gap.sentence.match(/______/g) || []).length, 1);
    assert.equal(normalize(gap.sentence.replace('______', gap.answer)), normalize(lesson.dictationSentence));
    positions.add(gap.options.indexOf(gap.answer));
    distractorSets.add(gap.options.filter(w => w !== gap.answer).sort().join('|'));
  }
  assert.equal(positions.size, 4, lesson.id + ': all answer positions are reachable');
  assert(distractorSets.size > 1, lesson.id + ': distractors vary between rounds');
}
assert.equal(JSON.stringify(lessons), snapshot, 'source lessons and progress IDs must stay untouched');
const short = { ...lessons[0], dictationSentence: 'I am OK.' };
assert.equal(build(short, [short], random).answer, 'ok');
assert.equal(build(short, [short], random).options.length, 1);
const repeated = { ...short, dictationSentence: 'Word, word WORD!' };
assert.equal(build(repeated, [repeated], random).options.length, 1, 'normalization removes duplicate distractors');
const source = fs.readFileSync('src/views/ListeningAcademyPage.tsx', 'utf8');
assert(source.includes('useMemo(() => selected ? listeningGapActivity(selected, ALL_LISTENING_LESSONS) : null, [selected])'));
assert(!source.includes('lesson.id.length % 4'));
assert(source.includes("if(w === gap.answer) solve('gap')"));
console.log('All 42 listening gap drills: unique real choices, four reachable answer positions, varied distractors, stable lesson round, unchanged answers and source data: PASS');
