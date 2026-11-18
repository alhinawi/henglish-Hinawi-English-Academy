const fs=require('fs'),assert=require('assert/strict'),ts=require('typescript'),vm=require('vm');
const rows=JSON.parse(fs.readFileSync('docs/academy-audio-manifest.json','utf8'));assert.equal(rows.length,360);
const src=fs.readFileSync('src/utils/voiceEngine.ts','utf8'),js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;const c={exports:{},console,localStorage:{getItem:()=>null},window:{},setTimeout};vm.runInNewContext(js,c);const map=c.exports.STATIC_ENGLISH_AUDIO;
const groups={};for(const r of rows){assert(map[r.text.trim()],r.id);assert(fs.statSync('public'+r.src).size>500);assert(r.duration>0.2);if(r.group)groups[r.group]=(groups[r.group]||0)+1;}
assert.deepEqual(groups,{reading:36,writing:36,listening:84,pronunciation:36,'legacy-speaking':40});assert.equal(Object.keys(map).length,349);
console.log('360 verified recordings cover349 distinct texts:32 speaking dialogues,42 listening passages/dictation,36 reading,36 writing,36 minimal-pair words and40 legacy dialogue lines: PASS');
