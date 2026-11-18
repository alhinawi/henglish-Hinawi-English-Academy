const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const js=ts.transpileModule(fs.readFileSync('src/services/vocabularyService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const row={id:'chunk',word:'chunk',rank:1,ipa:'',partOfSpeech:'noun',meaningAr:'x',level:'A1',category:'everyday',exampleEn:'chunk example',exampleAr:'original example',highlight:'chunk'};
(async()=>{
for(const mode of ['emptyIndex','badIndex','duplicateFile','path','emptyChunk','badRow','badRank','duplicateId']){
 let fail=true;const c={exports:{},AbortController,setTimeout,clearTimeout,console:{error(){}},require:p=>p.includes('vocabularyAcademyData')?{VOCABULARY_ACADEMY_WORDS:[{id:'core',word:'core',partOfSpeech:'noun',level:'A1',category:'everyday',meaningAr:'x'}]}:{},fetch:async url=>({ok:true,json:async()=>{
 if(url.includes('ranks-index'))return{};
 if(url.includes('chunks-index'))return fail&&mode==='emptyIndex'?{files:[]}:fail&&mode==='badIndex'?{files:'x'}:fail&&mode==='duplicateFile'?{files:['x.json','x.json']}:fail&&mode==='path'?{files:['../x.json']}:{files:['x.json']};
 return fail&&mode==='emptyChunk'?[]:fail&&mode==='badRow'?[{...row,category:null}]:fail&&mode==='badRank'?[{...row,rank:'1'}]:fail&&mode==='duplicateId'?[{...row,id:'core'}]:[row];
 }})};vm.runInNewContext(js,c);const api=c.exports;await api.loadVocabularyCore();await assert.rejects(api.loadFullVocabulary(),/Invalid|Duplicate/);assert.equal(api.getLoadedVocabularyCount(),1);assert.equal(api.searchVocabulary().entries[0].id,'core');fail=false;assert.equal((await api.loadFullVocabulary()).length,2);assert.equal(api.getLoadedVocabularyCount(),2);assert.equal(api.searchVocabulary({searchQuery:'chunk'}).entries[0].collocations,undefined);
 const overlay={chunk:{m:'Translated meaning',e:'Translated example'}};for(const term of [' TRANSLATED MEANING ','TRANSLATED EXAMPLE','original example','chunk example','chunk'])assert.equal(api.searchVocabulary({searchQuery:term},overlay).entries[0].id,'chunk');assert.equal(api.searchVocabulary({searchQuery:'translated meaning'}).totalMatches,0);for(const filter of [{cefr:'C2'},{pos:'verb'},{domain:'business'},{letter:'z'},{frequencyTier:'rare'},{audioFilter:'has_us'}])assert.equal(api.searchVocabulary({searchQuery:'translated meaning',...filter},overlay).totalMatches,0);

}
console.log('Vocabulary invalid index/chunk/rank/duplicate IDs never poison full cache; core remains usable and clean retry succeeds: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});

(async()=>{
 for(const endpoint of ['ranks-index','chunks-index','chunks/x.json','expressions.json','vocabulary-manifest.json'])for(const stage of ['headers','body']){
  let stalled=true,id=0,aborts=0;const timers=new Map(),pending=new Map();
  const c={exports:{},AbortController,console:{error(){}},setTimeout:(fn,ms)=>{assert.equal(ms,30000);timers.set(++id,fn);return id;},clearTimeout:id=>timers.delete(id),require:p=>p.includes('vocabularyAcademyData')?{VOCABULARY_ACADEMY_WORDS:[{id:'core',word:'core',partOfSpeech:'noun',level:'A1',category:'everyday',meaningAr:'x'}]}:{},fetch:async(url,{signal})=>{
   const data=url.includes('ranks-index')?{}:url.includes('chunks-index')?{files:['x.json']}:url.includes('vocabulary-manifest')?{totalHeadwords:2}:url.includes('expressions')?[{id:'e',expression:'x',meaningAr:'x',definitionEn:'',exampleEn:'',exampleAr:'',category:'idiom',cefr:'A1'}]:[row];
   if(stalled&&url.includes(endpoint)){
    const wait=()=>new Promise((_,reject)=>{pending.set(url,true);signal.addEventListener('abort',()=>{aborts++;reject(Error('AbortError'));},{once:true});});
    if(stage==='headers')return await wait();return{ok:true,json:wait};
   }
   return{ok:true,json:async()=>data};
  }};vm.runInNewContext(js,c);const api=c.exports;
  const run=()=>endpoint==='ranks-index'?api.loadVocabularyCore():endpoint==='expressions.json'?api.loadExpressions():endpoint==='vocabulary-manifest.json'?api.loadVocabularyManifest():api.loadFullVocabulary();
  const result=run().then(value=>({value}),error=>({error}));for(let n=0;n<30;n++)await Promise.resolve();assert.equal(pending.size,1,endpoint+stage);for(const timer of [...timers.values()])timer();const first=await result;assert.equal(aborts,1);assert.equal(timers.size,0);
  if(endpoint==='ranks-index')assert.equal(first.value.length,1);else if(endpoint==='vocabulary-manifest.json')assert.equal(first.value,null);else assert(first.error);
  stalled=false;const recovered=await (endpoint==='ranks-index'?api.loadFullVocabulary():run());assert(recovered);assert.equal(timers.size,0);
 }
 console.log('Vocabulary ranks/index/chunks/expressions/manifest headers and JSON bodies have finite abort deadlines,clear timers,preserve safe fallback and retry: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});

(async()=>{
 for(const invalid of [null,[],3,'bad',{core:null},{core:[0,1]},{core:[1,'2']},{core:[1,-1]},{' ':[1,1]},{core:[1,2,3]}]){
  let fail=true,calls=0;const c={exports:{},AbortController,setTimeout,clearTimeout,console:{error(){}},require:p=>p.includes('vocabularyAcademyData')?{VOCABULARY_ACADEMY_WORDS:[{id:'core',word:'core',partOfSpeech:'noun',level:'A1',category:'everyday',meaningAr:'x'}]}:{},fetch:async url=>({ok:true,json:async()=>url.includes('ranks-index')?(calls++,fail?invalid:{core:[7,3.2]}):url.includes('chunks-index')?{files:['x.json']}:[row]})};
  vm.runInNewContext(js,c);const api=c.exports;const core=await api.loadVocabularyCore();assert.equal(core.length,1);assert.equal(core[0].rank,undefined);fail=false;const full=await api.loadFullVocabulary();assert.equal(full.length,2);assert.equal(full[0].rank,7);assert.equal(full[0].zipf,3.2);assert.equal(calls,2);
 }
 console.log('Malformed optional rank indices never block core/full words or poison frequency values;clean retry restores real rank/Zipf: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
