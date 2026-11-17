const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const s=fs.readFileSync('src/views/TranslationStudioPage.tsx','utf8');
const snippet=s.slice(s.indexOf('  const requestVersion ='),s.indexOf('  // Interactive Word Click'));
const pending=[],effects=[];const c={exports:{},useRef:()=>({current:0}),useEffect(){},sourceText:'Original',sourceLang:'en',targetLang:'ar',mode:'natural',currentLevel:'B1',learnerId:'A',translationResult:null,setSelectedWordDetail(){},setIsWordModalOpen(){},setWordAnalysisUnavailable(){},setVocabularySaveMessage:v=>c.saveMessage=v,setIsLoading:v=>c.loading=v,setError:v=>c.error=v,setTranslationResult:v=>c.translationResult=v,setSourceLang:v=>c.sourceLang=v,setTargetLang:v=>c.targetLang=v,setSourceText:v=>c.sourceText=v,playSound:v=>effects.push(v),t:k=>k,isAiServiceUnavailable:()=>false,console,executeTranslation:req=>new Promise((resolve,reject)=>pending.push({req,resolve,reject}))};
vm.runInNewContext(ts.transpileModule(snippet+'\nexports.api={handleTranslate,handleSwapLanguages,invalidateTranslation};',{}).outputText,c);
(async()=>{
 const a=c.exports.api;const first=a.handleTranslate('first');a.invalidateTranslation();pending[0].resolve({translatedText:'stale'});await first;assert.equal(c.translationResult,null);
 const older=a.handleTranslate('older');const latest=a.handleTranslate('latest');pending[1].reject(Error('late error'));await older;assert.equal(c.error,null);assert.equal(c.loading,true);pending[2].resolve({translatedText:'current'});await latest;assert.equal(c.translationResult.translatedText,'current');
 c.translationResult={translatedText:'Arabic input'};a.handleSwapLanguages();assert.equal(pending[3].req.sourceLang,'ar');assert.equal(pending[3].req.targetLang,'en');assert.equal(pending[3].req.text,'Arabic input');pending[3].resolve({translatedText:'English result'});await new Promise(setImmediate);assert.equal(c.translationResult.translatedText,'English result');
 const reused=a.handleTranslate('history',{mode:'formal'});assert.equal(pending[4].req.mode,'formal');pending[4].resolve({translatedText:'history result'});await reused;
 const before=pending.length;await a.handleTranslate('');assert.equal(pending.length,before);assert.equal(c.translationResult,null);
 for(const key of ['onSourceChange={lang => { invalidateTranslation();','onTargetChange={lang => { invalidateTranslation();','onSelectMode={nextMode => { invalidateTranslation();','onChangeText={text => { invalidateTranslation();'])assert.ok(s.includes(key));
 console.log('Translation studio correct swap direction/history mode; stale success/error/finally ignored; edits invalidate output; explicit empty input stays empty: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
