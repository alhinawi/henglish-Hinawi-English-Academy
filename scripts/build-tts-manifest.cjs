// Real on-site learning text only. This does not synthesize audio or use keys.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
const rows = new Map();
function add(value, source) {
  if (typeof value !== 'string') return;
  const text = value.trim();
  if (!text || text.length > 5000 || !/[A-Za-z]/.test(text) || /[\u0600-\u06ff]/.test(text) || /^https?:/.test(text)) return;
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  if (!rows.has(hash)) rows.set(hash, { text_hash: hash, text, chars: text.length, source });
}
function moduleData(name) { return require(path.resolve('src/data/' + name + '.ts')); }
const literacy = moduleData('literacyAcademyData');
for (const lesson of literacy.LITERACY_READING) { add(lesson.content, 'reading:' + lesson.id); add(lesson.word, 'reading-word:' + lesson.id); }
for (const lesson of literacy.LITERACY_WRITING) add(lesson.model, 'writing:' + lesson.id);
for (const lesson of moduleData('speakingAcademyData').SPEAKING_LESSONS) {
  for (const line of lesson.dialogue) add(line.en, 'speaking:' + lesson.id);
  add(lesson.phrase, 'speaking:' + lesson.id); add(lesson.prompt, 'speaking:' + lesson.id);
}
for (const lesson of moduleData('listeningAcademyData').ALL_LISTENING_LESSONS) { add(lesson.transcript, 'listening:' + lesson.id); add(lesson.dictationSentence, 'listening:' + lesson.id); }
const fields = new Set(['en', 'english', 'word', 'exampleEn', 'phrase', 'expression', 'textEn', 'question', 'sentence', 'sentenceEn', 'content', 'model', 'samplePhrase']);
function walk(value, source) {
  if (Array.isArray(value)) { value.forEach(row => walk(row, source)); return; }
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    if (fields.has(key)) add(item, source);
    if (item && typeof item === 'object') walk(item, source);
  }
}
walk(moduleData('voicesCatalog'), 'voice-preview');
for (const name of ['allGrammarRules', 'dialoguesData', 'realLifeSimulationsData', 'skillsAcademyData']) walk(moduleData(name), name);
for (const file of ['public/data/expressions.json', 'public/data/sentences.json']) walk(JSON.parse(fs.readFileSync(file, 'utf8')), file);
for (const bank of ['vocab', 'idioms', 'slang', 'genz']) {
  const dir = 'public/data/' + bank + '/chunks';
  if (fs.existsSync(dir)) for (const file of fs.readdirSync(dir).sort().filter(file => file.endsWith('.json'))) walk(JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')), bank + ':' + file);
}
const sorted = [...rows.values()].sort((a, b) => a.text_hash.localeCompare(b.text_hash));
const quote = value => "'" + String(value).replace(/'/g, "''") + "'";
const output = process.argv[2] || '/tmp/henglish-tts-manifest.sql';
fs.writeFileSync(output, '-- Generated from real tracked learning content. Additive; no deletion.\n' + sorted.map(row => 'INSERT OR IGNORE INTO tts_manifest (text_hash,text,chars,source) VALUES (' + [row.text_hash, row.text, row.chars, row.source].map(quote).join(',') + ');').join('\n') + '\n');
const summary = { output, texts: sorted.length, characters: sorted.reduce((sum, row) => sum + row.chars, 0), maxCharacters: Math.max(...sorted.map(row => row.chars)), digest: crypto.createHash('sha256').update(JSON.stringify(sorted)).digest('hex') };
fs.writeFileSync('/tmp/henglish-tts-manifest-summary.json', JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
