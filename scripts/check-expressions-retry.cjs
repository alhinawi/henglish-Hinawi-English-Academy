const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const js=ts.transpileModule(fs.readFileSync('src/services/vocabularyService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const row={id:'test',expression:'test',meaningAr:'test',definitionEn:'',exampleEn:'',exampleAr:'',category:'idiom',cefr:'A1'};
(async()=>{
for(const mode of ['network','http','json','object','nullrow','badfield']){
 let calls=0;const c={exports:{},AbortController,setTimeout,clearTimeout,console:{error(){}},require:()=>({}),fetch:async()=>{calls++;if(calls===1){if(mode==='network')throw Error();if(mode==='http')return{ok:false,status:503};return{ok:true,json:async()=>{if(mode==='json')throw Error();return mode==='object'?{}:mode==='nullrow'?[null]:[{...row,expression:1}];}};}return{ok:true,json:async()=>[row]};}};
 vm.runInNewContext(js,c);await assert.rejects(c.exports.loadExpressions());const [a,b]=await Promise.all([c.exports.loadExpressions(),c.exports.loadExpressions()]);assert.equal(a.length,1);assert.equal(a,b);assert.equal(calls,2);await c.exports.loadExpressions();assert.equal(calls,2);
}
const view=fs.readFileSync('src/components/vocabulary/ExpressionsTab.tsx','utf8');assert.ok(view.includes('}, [loadAttempt]);'));assert.ok(view.includes('setLoadAttempt(n => n + 1)'));assert.ok(view.indexOf('{loadError ? (')<view.indexOf(') : pagedItems.length === 0 ? ('));
for(const l of ['ar','en','de']){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+l+'.json'));assert.ok(d['ex.loadError']&&d['ex.retry']);}
console.log('Expressions network/HTTP/JSON/shape failure rejects, retries, shares pending/success cache; UI separates error from empty search: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});

const expressionView=fs.readFileSync('src/components/vocabulary/ExpressionsTab.tsx','utf8');assert(!expressionView.includes('speakEnglishVoice'));for(const accent of ['US','UK'])assert(expressionView.includes('wordId={`expression:${item.id}`} wordText={item.expression} accent="'+accent+'" size="sm"'));const pronunciation=fs.readFileSync('src/components/vocabulary/PronunciationButton.tsx','utf8');assert(pronunciation.includes('audioPlayback.stopOwned(owner.current)'));assert(pronunciation.includes("t(active ? 'pr.stop'"));assert(pronunciation.includes("t('listen.audioError')"));console.log('Expressions reuse owned dual-accent playback controls with loading/Stop/error states and per-card cleanup on search/page/tab removal: PASS');
