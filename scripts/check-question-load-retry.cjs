const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const js=ts.transpileModule(fs.readFileSync('src/services/questionBankService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const item={id:'q-test-000001',skill:'grammar',type:'multiple-choice',level:'A1',prompt:'Choose.',promptAr:'اختر',options:['one','two'],answerIndex:0,explanationAr:'شرح',topic:'Grammar',source:'test'};
const index={totalQuestions:1,chunks:['q000001-000001.json']};
(async()=>{
 for(const [badIndex,badChunk]of [[null,[item]],[{},[item]],[{...index,chunks:[]},[item]],[{...index,chunks:['../other.json']},[item]],[{...index,totalQuestions:2},[item]],[index,null],[index,{}],[index,[]],[index,[{}]],[index,[{...item,answerIndex:2}]],[index,[{...item,options:['one','one']}]],[{...index,totalQuestions:2},[item,item]]]){
  let repaired=false,calls=0;const c={exports:{},AbortController,setTimeout,clearTimeout,fetch:async url=>{calls++;return{ok:true,json:async()=>url.includes('index')?(repaired?index:badIndex):(repaired?[item]:badChunk)}}};vm.runInNewContext(js,c);await assert.rejects(c.exports.loadAllQuestions());assert.equal(c.exports.getLoadedQuestionCount(),0);repaired=true;assert.equal((await c.exports.loadAllQuestions())[0].id,item.id);const before=calls;await c.exports.loadAllQuestions();assert.equal(calls,before);
 }
 let calls=0;const c={exports:{},AbortController,setTimeout,clearTimeout,fetch:async url=>{calls++;if(calls===1)throw Error('offline');return{ok:true,json:async()=>url.includes('index')?index:[item]}}};vm.runInNewContext(js,c);await assert.rejects(c.exports.loadAllQuestions());const results=await Promise.all([c.exports.loadAllQuestions(),c.exports.loadAllQuestions()]);assert.equal(results[0],results[1]);assert.equal(calls,3);
 const manifest=JSON.parse(fs.readFileSync('public/data/questions/questions-index.json'));const live={exports:{},AbortController,setTimeout,clearTimeout,fetch:async url=>({ok:true,json:async()=>JSON.parse(fs.readFileSync('public'+url))})};vm.runInNewContext(js,live);assert.equal((await live.exports.loadAllQuestions()).length,manifest.totalQuestions);
 const page=fs.readFileSync('src/components/QuestionBankPanel.tsx','utf8');for(const s of ['role="alert"','setLoadAttempt(attempt => attempt + 1)','}, [loadAttempt, lang]);','if (mounted) setLoadError(true)'])assert(page.includes(s));console.log('Question manifest/chunk/schema/count/duplicate failures stay uncached;network retry,shared in-flight,actual catalog and mounted retry UI: PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
(async()=>{
 for(const stalled of ['manifest','chunk','body']){
  let expire,cleared=0,repaired=false;const c={exports:{},AbortController,setTimeout:fn=>{expire=fn;return 1},clearTimeout:()=>cleared++,fetch:async(url,{signal})=>{
   const hang=!repaired&&(stalled==='manifest'?url.includes('index'):!url.includes('index'));
   const never=()=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('deadline'))));
   if(hang&&stalled!=='body')return never();return{ok:true,json:()=>hang?never():Promise.resolve(url.includes('index')?index:[item])};
  }};vm.runInNewContext(js,c);const promise=c.exports.loadAllQuestions();for(let i=0;i<12;i++)await Promise.resolve();expire();await assert.rejects(promise);assert.equal(c.exports.getLoadedQuestionCount(),0);assert(cleared>=1);repaired=true;assert.equal((await c.exports.loadAllQuestions())[0].id,item.id);
 }
 console.log('Question fetch deadlines cover stalled manifest/chunk/body,clear timers and allow repaired retry: PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
