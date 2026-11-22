const fs=require('node:fs'),ts=require('typescript'),vm=require('node:vm'),assert=require('node:assert/strict');
const c={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/vowelWorkshopData.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,c);
const data=c.exports.VOWEL_WORKSHOP;
assert.equal(data.length,20);assert.equal(new Set(data.map(v=>v.symbol)).size,20);
assert.equal(data.filter(v=>v.type==='pure').length,12);assert.equal(data.filter(v=>v.type==='glide').length,8);
for(const v of data){assert(v.sentence.endsWith('.'));assert(v.sentence.split(/\s+/).length>=6);assert(v.tipEn.length>35);assert(v.tipAr.length>20);assert(!/[\u0600-\u06ff]/.test(v.sentence));for(const lang of ['en','ar'])assert(JSON.parse(fs.readFileSync('src/i18n/locales/'+lang+'.json'))[v.ar]);}
const s=fs.readFileSync('src/views/PronunciationAcademyPage.tsx','utf8');
assert(s.includes("vowelGroup === 'all' || v.type === vowelGroup"));assert(s.includes('key={activeVowel.symbol} prompt={activeVowel.sentence}'));
assert(s.includes("playWord(v.ex, null, v.ex, 'UK')"));assert(s.includes("`vowel-${activeVowel.symbol}`, 'UK')"));
assert(s.includes('resetAudio();\n    setSelectedVowel(symbol)'));assert(s.includes('aria-pressed={selectedVowel === v.symbol}'));
assert(s.includes("t('pa.recordGuide')"));assert(s.includes("t('pa.vowelScope')"));
assert(data.find(v=>v.symbol==='/ʊə/').tipEn.includes('variable'));
const original=['/iː/','/ɪ/','/e/','/æ/','/ɑː/','/uː/','/ʊ/','/ə/'];assert.deepEqual(Array.from(data.slice(0,8),v=>v.symbol),original);
console.log('20 unique vowels, 12 steady/8 glides, all original 8 retained, 20 original sentences and bilingual tips, UK reference playback, keyed recorder reset, accessible filters and accent caveat: PASS');
