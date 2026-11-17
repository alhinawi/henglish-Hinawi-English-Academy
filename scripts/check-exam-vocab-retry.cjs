const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const js=ts.transpileModule(fs.readFileSync('src/services/examVocabService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
function service(fetch){const c={exports:{},fetch};vm.runInNewContext(js,c);return c.exports;}
const index={chunks:['a.json','b.json'],idPrefix:'test'},rows=[{id:'test-000001',word:'test-only'}];
(async()=>{
 for(const exam of ['ielts','toefl']) for(const failure of ['network','http','json']){
  let calls=0;const s=service(async()=>{calls++;if(calls===1){if(failure==='network')throw Error('offline');if(failure==='http')return{ok:false,status:503};return{ok:true,json:async()=>{throw Error('bad json')}}}return{ok:true,json:async()=>index}});
  await assert.rejects(s.loadExamVocabIndex(exam));const [a,b]=await Promise.all([s.loadExamVocabIndex(exam),s.loadExamVocabIndex(exam)]);assert.equal(a,index);assert.equal(a,b);assert.equal(calls,2);await s.loadExamVocabIndex(exam);assert.equal(calls,2);
 }
 for(const exam of ['ielts','toefl']) for(const failure of ['network','http','json']){
  const counts={};const s=service(async(url)=>{counts[url]=(counts[url]||0)+1;if(url.includes('-index'))return{ok:true,json:async()=>index};if(url.endsWith('b.json')&&counts[url]===1){if(failure==='network')throw Error('offline');if(failure==='http')return{ok:false,status:503};return{ok:true,json:async()=>{throw Error('bad json')}}}return{ok:true,json:async()=>rows}});
  await assert.rejects(s.loadAllExamVocab(exam));const [a,b]=await Promise.all([s.loadAllExamVocab(exam),s.loadAllExamVocab(exam)]);assert.equal(a.length,2);assert.equal(b.length,2);assert.equal(counts[`/data/${exam}/vocab/vocab-index.json`],1);assert.equal(counts[`/data/${exam}/vocab/chunks/a.json`],1);assert.equal(counts[`/data/${exam}/vocab/chunks/b.json`],2);
 }
 console.log('Exam vocabulary index/chunk network/HTTP/JSON failure retries; successes and concurrent requests stay cached: PASS');
})().catch(e=>{console.error(e);process.exit(1)});

for(const [file,source] of [['PhraseBankPanel','bank'],['ExamVocabPanel','exam']]){
 const view=fs.readFileSync('src/components/'+file+'.tsx','utf8');
 for(const text of ['}, ['+source+', loadAttempt]);','setLoadAttempt(attempt => attempt + 1)','role="alert"',"t('ex.retry')"])assert.ok(view.includes(text),file+': '+text);
}
console.log('Phrase/exam loading errors offer in-place retry with announced error state: PASS');
