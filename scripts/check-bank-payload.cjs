const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const compile=(file,c)=>{c.exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/services/'+file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,c);return c.exports};
(async()=>{
 for(const [file,load,owner,path]of [['phraseBankService.ts','loadAllPhrases','idioms','idioms'],['examVocabService.ts','loadAllExamVocab','ielts','ielts/vocab']]){
  const indexFile='public/data/'+path+'/'+(owner==='idioms'?'idioms-index.json':'vocab-index.json'),index=JSON.parse(fs.readFileSync(indexFile)),chunk=JSON.parse(fs.readFileSync('public/data/'+path+'/chunks/'+index.chunks[0]));
  for(const bad of [null,{},[],[{}],[{...chunk[0],exampleEn:null}],[{...chunk[0],popularity:0}],[chunk[0],chunk[0]]]){
   let fixed=false;const fetch=async url=>({ok:true,json:async()=>!fixed&&url.includes('/chunks/')?bad:JSON.parse(fs.readFileSync('public'+url))}),helper=compile('bankPayload.ts',{fetch,AbortController,setTimeout,clearTimeout}),s=compile(file,{require:n=>n.includes('bankPayload')?helper:{}});await assert.rejects(s[load](owner));fixed=true;assert.equal((await s[load](owner)).length,index.totalEntries);
  }
  for(const bad of [null,{}, {...index,chunks:['../bad.json']},{...index,totalEntries:index.totalEntries+1}]){
   let fixed=false;const fetch=async url=>({ok:true,json:async()=>!fixed&&url.includes('index.json')?bad:JSON.parse(fs.readFileSync('public'+url))}),helper=compile('bankPayload.ts',{fetch,AbortController,setTimeout,clearTimeout}),s=compile(file,{require:n=>n.includes('bankPayload')?helper:{}});await assert.rejects(s[load](owner));fixed=true;assert.equal((await s[load](owner)).length,index.totalEntries);
  }
 }
 for(const path of ['idioms','slang','genz','ielts/vocab','toefl/vocab']){
  const helper=compile('bankPayload.ts',{}),kind=path.includes('vocab')?'word':'phrase',owner=path.split('/')[0],index=JSON.parse(fs.readFileSync('public/data/'+path+'/'+(kind==='phrase'?owner+'-index.json':'vocab-index.json')));helper.validateBankIndex(index,kind==='phrase'?'bank':'exam',owner);const all=index.chunks.flatMap(file=>helper.validateBankRows(JSON.parse(fs.readFileSync('public/data/'+path+'/chunks/'+file)),kind));helper.validateWholeBank(all,index.totalEntries);
 }
 for(const stage of ['headers','body']){
  let expire,cleared=0;const helper=compile('bankPayload.ts',{AbortController,setTimeout:fn=>(expire=fn,1),clearTimeout:()=>cleared++,fetch:async(url,{signal})=>{const wait=()=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Error('deadline'))));return stage==='headers'?wait():{ok:true,json:wait}}});const promise=helper.fetchBankPayload('/test');for(let i=0;i<12;i++)await Promise.resolve();expire();await assert.rejects(promise);assert.equal(cleared,1);
 }
 console.log('Phrase/exam payloads validate before cache;bad manifest/chunks/fields/duplicates/counts retry repaired;all5 actual catalogs validate;headers/body deadline cleans up: PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
