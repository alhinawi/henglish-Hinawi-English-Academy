const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict');
const c={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/speakingAcademyData.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,c);
for(const l of c.exports.SPEAKING_LESSONS){assert(l.dialogue.length>=2);assert(l.dialogue.some(x=>x.role==='A'));assert(l.dialogue.some(x=>x.role==='B'));assert(l.dialogue.every(x=>x.en.trim()&&['A','B'].includes(x.role)));}
const s=fs.readFileSync('src/components/SpeakingRoleRehearsal.tsx','utf8');
assert(s.includes("useState('B')"));assert(s.includes('const yourTurn = line.role === role'));
assert(s.includes('<SpeakingRecorder key={`${role}:${turn}`}'));assert(s.includes('{revealed &&'));
assert(s.includes('setTurn(i => (i+1)%lesson.dialogue.length)'));assert(s.includes('stopSpeech(); setRole(nextRole); setTurn(0); setRevealed(false)'));
assert(!s.includes('localStorage'));assert(!s.includes('onComplete'));assert(!s.includes('fetch('));
const p=fs.readFileSync('src/views/SpeakingAcademyPage.tsx','utf8');assert(p.includes('key={`roleplay:${active.id}`} lesson={active}'));
for(const lang of ['en','ar','de']){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+lang+'.json'));assert(d['sp.roleplay.note']);assert(d['sp.roleplay.turn'].includes('{current}'));assert(d['sp.roleplay.turn'].includes('{total}'));}
console.log(`${c.exports.SPEAKING_LESSONS.length} speaking dialogues support both roles, hidden model replies and keyed local recording; turn/role/lesson reset, no scoring/storage effects: PASS`);
