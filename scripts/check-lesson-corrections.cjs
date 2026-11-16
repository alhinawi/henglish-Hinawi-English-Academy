const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
function load(file) {
  const source = fs.readFileSync(file,'utf8').replace(/^import .*;\n/gm,'');
  const code = ts.transpile(source,{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020});
  const exports = {}; new Function('exports','ONLINE_IMAGES',code)(exports,new Proxy({},{get:()=>new Proxy({},{get:()=>''})})); return exports;
}
const {splitLessonCorrection:split}=load('src/utils/lessonCorrection.ts');
const data=load('src/data/allGrammarRules.ts');
const rules=Object.values(data).find(Array.isArray);
assert.ok(rules?.length>=59);
let pairs=0;
for(const rule of rules) for(const trap of rule.commonTraps){
  const pair=split(trap);
  if(/الخطأ/.test(trap)&&/الصح\s*:/.test(trap)) assert.ok(pair,trap);
  if(pair){assert.ok(pair.wrong&&pair.correct);assert.ok(trap.includes(pair.wrong)&&trap.includes(pair.correct));pairs++;}
}
assert.ok(pairs>100);
assert.equal(split('معلومة تعليمية بدون مقارنة'),null);
for(const label of ['الصح','الأدق','الأفصح','الطبيعي']) assert.equal(split(`فخ: الخطأ I went، ${label}: I go.`).correct,'I go.');
console.log(`Correction checks passed: ${rules.length} grammar lessons, ${pairs} explicit pairs, source text preserved.`);
