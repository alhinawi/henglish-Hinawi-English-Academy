const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const c={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/services/vocabularyCollectionLabel.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,c);
const f=c.exports.vocabularyCollectionLabel;
for(const l of ['ar','en','de']){
 const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+l+'.json')),t=k=>d[k];
 const originals=[['col-business','Business & Career','إنجليزي الأعمال والشركات','business'],['col-idioms','Idioms & Phrasal Verbs','تعبيرات واصطلاحات متقدمة','idioms'],['col-daily','Daily Spoken English','محادثات الحياة اليومية','daily']];
 for(const [id,name,nameAr,key] of originals){const col={id,name,nameAr},before=JSON.stringify(col);assert.equal(f(col,t),d['vcl.'+key]);assert.equal(JSON.stringify(col),before);assert.equal(f({...col,nameAr:'My renamed collection'},t),'My renamed collection');assert.equal(f({...col,id:'custom'},t),nameAr)}
 assert.equal(f({id:'custom',name:'English custom',nameAr:''},t),'English custom');
 assert.equal(f({id:'custom',name:'My deck',nameAr:'قائمتي'},t,true),'قائمتي (My deck)');
}
console.log('Built-in labels translated; custom/renamed names and source records preserved: PASS');
