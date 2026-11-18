const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const js=ts.transpileModule(fs.readFileSync('src/services/examVocabService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
function service(fetch){const h={exports:{},fetch,AbortController,setTimeout,clearTimeout};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/services/bankPayload.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,h);const c={exports:{},require:n=>n.includes('bankPayload')?h.exports:{},fetch};vm.runInNewContext(js,c);return c.exports;}
const index={exam:'ielts',totalEntries:2,chunks:['a000001-000001.json','b000002-000002.json'],idPrefix:'test'},rows=[{id:'test-000001',word:'test-only',meaningAr:'meaning',exampleEn:'example',exampleAr:'translation',source:'test',partOfSpeech:'noun',level:'A1',topic:'test'}];
(async()=>{
 for(const exam of ['ielts']) for(const failure of ['network','http','json']){
  let calls=0;const s=service(async()=>{calls++;if(calls===1){if(failure==='network')throw Error('offline');if(failure==='http')return{ok:false,status:503};return{ok:true,json:async()=>{throw Error('bad json')}}}return{ok:true,json:async()=>index}});
  await assert.rejects(s.loadExamVocabIndex(exam));const [a,b]=await Promise.all([s.loadExamVocabIndex(exam),s.loadExamVocabIndex(exam)]);assert.equal(a,index);assert.equal(a,b);assert.equal(calls,2);await s.loadExamVocabIndex(exam);assert.equal(calls,2);
 }
 for(const exam of ['ielts']) for(const failure of ['network','http','json']){
  const counts={};const s=service(async(url)=>{counts[url]=(counts[url]||0)+1;if(url.includes('-index'))return{ok:true,json:async()=>index};if(url.endsWith('b000002-000002.json')&&counts[url]===1){if(failure==='network')throw Error('offline');if(failure==='http')return{ok:false,status:503};return{ok:true,json:async()=>{throw Error('bad json')}}}return{ok:true,json:async()=>rows.map(row=>({...row,id:url.endsWith('b000002-000002.json')?'test-000002':row.id}))}});
  await assert.rejects(s.loadAllExamVocab(exam));const [a,b]=await Promise.all([s.loadAllExamVocab(exam),s.loadAllExamVocab(exam)]);assert.equal(a.length,2);assert.equal(b.length,2);assert.equal(counts[`/data/${exam}/vocab/vocab-index.json`],1);assert.equal(counts[`/data/${exam}/vocab/chunks/a000001-000001.json`],1);assert.equal(counts[`/data/${exam}/vocab/chunks/b000002-000002.json`],2);
 }
 console.log('Exam vocabulary index/chunk network/HTTP/JSON failure retries; successes and concurrent requests stay cached: PASS');
})().catch(e=>{console.error(e);process.exit(1)});

for(const [file,source] of [['PhraseBankPanel','bank'],['ExamVocabPanel','exam']]){
 const view=fs.readFileSync('src/components/'+file+'.tsx','utf8');
 for(const text of ['}, ['+source+', loadAttempt]);','setLoadAttempt(attempt => attempt + 1)','role="alert"',"t('ex.retry')"])assert.ok(view.includes(text),file+': '+text);
}
console.log('Phrase/exam loading errors offer in-place retry with announced error state: PASS');

for(const file of ['PhraseBankPanel','ExamVocabPanel']){
 const view=fs.readFileSync('src/components/'+file+'.tsx','utf8');
 for(const text of ["typeof IntersectionObserver === 'undefined'",'!loading && !error && visibleCount < visible.length','setVisibleCount(count => Math.min(count + PAGE, visible.length))',"t('pb.loadMore')"])assert.ok(view.includes(text),file+': '+text);
}
console.log('Phrase/exam list observer is optional, with bounded native Show more fallback: PASS');

const examSearch=service(()=>{}).filterExamVocab,phraseContext={exports:{},require:()=>({})};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/services/phraseBankService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,phraseContext);const phraseSearch=phraseContext.exports.filterPhrases,entry={id:'test',word:'headword',phrase:'headword',meaningAr:'Original meaning',exampleAr:'Original example',exampleEn:'English example',level:'A1',topic:'general',partOfSpeech:'noun',register:'neutral',origin:'general',popularity:1},overlay={test:{m:'Displayed meaning',e:'Displayed example'}};
for(const query of [' DISPLAYED MEANING ',' DISPLAYED EXAMPLE ','ORIGINAL MEANING','ORIGINAL EXAMPLE','HEADWORD','ENGLISH EXAMPLE','  ']){assert.equal(examSearch([entry],query,'all','all','all',overlay).length,1,query);assert.equal(phraseSearch([entry],query,'all','all','all',overlay).length,1,query)}assert.equal(examSearch([entry],'displayed','B2','all','all',overlay).length,0);assert.equal(phraseSearch([entry],'displayed','all','all',3,overlay).length,0);assert.equal(examSearch([entry],'headword','all','all','all').length,1);assert.equal(phraseSearch([entry],'headword','all','all').length,1);for(const name of ['ExamVocabPanel','PhraseBankPanel'])assert(fs.readFileSync('src/components/'+name+'.tsx','utf8').includes('sortMode, txMap]'));console.log('Exam and phrase search includes visible translated meanings/examples,originals and English examples;case/padding,filters and optional overlay compatibility preserved: PASS');
