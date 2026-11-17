const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const js=ts.transpileModule(fs.readFileSync('src/services/vocabularyService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const row={id:'chunk',word:'chunk',rank:1,ipa:'',partOfSpeech:'noun',meaningAr:'x',level:'A1',category:'everyday',exampleEn:'chunk example',exampleAr:'original example',highlight:'chunk'};
(async()=>{
for(const mode of ['emptyIndex','badIndex','duplicateFile','path','emptyChunk','badRow','badRank','duplicateId']){
 let fail=true;const c={exports:{},console:{error(){}},require:p=>p.includes('vocabularyAcademyData')?{VOCABULARY_ACADEMY_WORDS:[{id:'core',word:'core',partOfSpeech:'noun',level:'A1',category:'everyday',meaningAr:'x'}]}:{},fetch:async url=>({ok:true,json:async()=>{
 if(url.includes('ranks-index'))return{};
 if(url.includes('chunks-index'))return fail&&mode==='emptyIndex'?{files:[]}:fail&&mode==='badIndex'?{files:'x'}:fail&&mode==='duplicateFile'?{files:['x.json','x.json']}:fail&&mode==='path'?{files:['../x.json']}:{files:['x.json']};
 return fail&&mode==='emptyChunk'?[]:fail&&mode==='badRow'?[{...row,category:null}]:fail&&mode==='badRank'?[{...row,rank:'1'}]:fail&&mode==='duplicateId'?[{...row,id:'core'}]:[row];
 }})};vm.runInNewContext(js,c);const api=c.exports;await api.loadVocabularyCore();await assert.rejects(api.loadFullVocabulary(),/Invalid|Duplicate/);assert.equal(api.getLoadedVocabularyCount(),1);assert.equal(api.searchVocabulary().entries[0].id,'core');fail=false;assert.equal((await api.loadFullVocabulary()).length,2);assert.equal(api.getLoadedVocabularyCount(),2);assert.equal(api.searchVocabulary({searchQuery:'chunk'}).entries[0].collocations,undefined);
 const overlay={chunk:{m:'Translated meaning',e:'Translated example'}};for(const term of [' TRANSLATED MEANING ','TRANSLATED EXAMPLE','original example','chunk example','chunk'])assert.equal(api.searchVocabulary({searchQuery:term},overlay).entries[0].id,'chunk');assert.equal(api.searchVocabulary({searchQuery:'translated meaning'}).totalMatches,0);for(const filter of [{cefr:'C2'},{pos:'verb'},{domain:'business'},{letter:'z'},{frequencyTier:'rare'},{audioFilter:'has_us'}])assert.equal(api.searchVocabulary({searchQuery:'translated meaning',...filter},overlay).totalMatches,0);

}
console.log('Vocabulary invalid index/chunk/rank/duplicate IDs never poison full cache; core remains usable and clean retry succeeds: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
