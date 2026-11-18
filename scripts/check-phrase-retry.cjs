const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const js=ts.transpileModule(fs.readFileSync('src/services/phraseBankService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
function service(fetch){const h={exports:{},fetch,AbortController,setTimeout,clearTimeout};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/services/bankPayload.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,h);const c={exports:{},require:n=>n.includes('bankPayload')?h.exports:{},fetch};vm.runInNewContext(js,c);return c.exports;}
const index={bank:'idioms',totalEntries:2,chunks:['a000001-000001.json','b000002-000002.json'],idPrefix:'idm'},rows=[{id:'idm-000001',phrase:'test-only',meaningAr:'meaning',exampleEn:'example',exampleAr:'translation',source:'test',register:'neutral',origin:'global'}];
(async()=>{
 for(const failure of ['network','http','json']){
  let calls=0;const s=service(async()=>{calls++;if(calls===1){if(failure==='network')throw Error('offline');if(failure==='http')return{ok:false,status:503};return{ok:true,json:async()=>{throw Error('bad json')}}}return{ok:true,json:async()=>index}});
  await assert.rejects(s.loadPhraseIndex('idioms'));const [a,b]=await Promise.all([s.loadPhraseIndex('idioms'),s.loadPhraseIndex('idioms')]);assert.equal(a,index);assert.equal(a,b);assert.equal(calls,2);await s.loadPhraseIndex('idioms');assert.equal(calls,2);
 }
 for(const failure of ['network','http','json']){
  const counts={};const s=service(async(url)=>{counts[url]=(counts[url]||0)+1;if(url.includes('-index'))return{ok:true,json:async()=>index};if(url.endsWith('b000002-000002.json')&&counts[url]===1){if(failure==='network')throw Error('offline');if(failure==='http')return{ok:false,status:503};return{ok:true,json:async()=>{throw Error('bad json')}}}return{ok:true,json:async()=>rows.map(row=>({...row,id:url.endsWith('b000002-000002.json')?'test-000002':row.id}))}});
  await assert.rejects(s.loadAllPhrases('idioms'));const [a,b]=await Promise.all([s.loadAllPhrases('idioms'),s.loadAllPhrases('idioms')]);assert.equal(a.length,2);assert.equal(b.length,2);assert.equal(counts['/data/idioms/idioms-index.json'],1);assert.equal(counts['/data/idioms/chunks/a000001-000001.json'],1);assert.equal(counts['/data/idioms/chunks/b000002-000002.json'],2);
 }
 console.log('Phrase index/chunk network/HTTP/JSON failure retries; successes and concurrent requests stay cached: PASS');
})().catch(e=>{console.error(e);process.exit(1)});
