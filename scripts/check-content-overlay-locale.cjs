const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const js=ts.transpileModule(fs.readFileSync('src/services/contentI18nService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const englishMaps=Object.fromEntries(fs.readdirSync('public/data/app-i18n').filter(m=>fs.existsSync('public/data/app-i18n/'+m+'/en.json')).map(m=>[m,JSON.parse(fs.readFileSync('public/data/app-i18n/'+m+'/en.json','utf8'))]));
let lang='de',state=null,effect=null,cleanup=null;
const pending={};const c={exports:{},AbortController,setTimeout:(fn,ms)=>{const timer=setTimeout(fn,ms);timer.unref();return timer;},clearTimeout,fetch:url=>new Promise(resolve=>pending[url]=data=>resolve({ok:true,json:async()=>data})),require:p=>p.includes('englishAppTextMaps')?{ENGLISH_APP_TEXT_MAPS:englishMaps}:p==='react'?{useState:()=>[state,v=>state=v],useEffect:fn=>effect=fn}:{useLanguage:()=>({lang})}};vm.runInNewContext(js,c);
const flush=async()=>{for(let n=0;n<8;n++)await Promise.resolve();};
async function check(hook,first,next,firstUrl,nextUrl){
 state=null;lang='de';assert.equal(hook(first),null);cleanup=effect();pending[firstUrl](hook===c.exports.useContentMap?{entry:{m:'German'}}:{Quelle:'Deutsch'});await flush();assert.ok(hook(first));
 lang='fr';assert.equal(hook(first),null,'Old locale hidden before effect');cleanup?.();cleanup=effect();
 lang='ar';assert.equal(hook(first),null,'Arabic immediately uses source');cleanup?.();cleanup=effect();pending[nextUrl]({entry:{m:'French'}});await flush();assert.equal(hook(first),null,'Cancelled fetch cannot leak');
 lang='de';assert.equal(hook(next),null,'Old bank/module hidden before effect');cleanup?.();cleanup=effect();
}
(async()=>{
 await check(c.exports.useContentMap,'vocab','phrases','/data/vocab/i18n/de.json','/data/vocab/i18n/fr.json');
 await check(c.exports.useAppTextMap,'module-a','module-b','/data/app-i18n/module-a/de.json','/data/app-i18n/module-a/fr.json');
 lang='en';state=null;
 for(const module of Object.keys(englishMaps)){
  const map=c.exports.useAppTextMap(module);assert.equal(map,englishMaps[module],'English maps available synchronously on first render');assert.equal(await c.exports.loadAppTextMap(module,'en'),map);
 }
 lang='ar';assert.equal(c.exports.useAppTextMap('skillsAcademyData'),null,'Arabic never receives an English map');
 lang='en';
 assert.equal(c.exports.needsContentTranslation('en'),false,'English banks remain built-in');
 const grammarContext={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/allGrammarRules.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,grammarContext);
 const english=JSON.parse(fs.readFileSync('public/data/app-i18n/allGrammarRules/en.json','utf8'));
 for(const rule of grammarContext.exports.ALL_GRAMMAR_RULES)for(const field of ['titleAr','category','level'])assert.ok(english[rule[field]]&&!/[\u0600-\u06ff]/.test(english[rule[field]]),rule.id+' '+field);
 const speakingContext={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/speakingAcademyData.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,speakingContext);const speakingEnglish=JSON.parse(fs.readFileSync('public/data/app-i18n/speakingAcademyData/en.json','utf8'));for(const lesson of speakingContext.exports.SPEAKING_LESSONS)for(const field of ['title','unit'])assert.ok(speakingEnglish[lesson[field]]&&!/[\u0600-\u06ff]/.test(speakingEnglish[lesson[field]]));
 const speakingView=fs.readFileSync('src/views/SpeakingAcademyPage.tsx','utf8');assert.ok(speakingView.includes('dir={dir}'));assert.ok(speakingView.includes('txText(appText, active.title)'));assert.ok(speakingView.includes('txText(appText, active.unit)'));
 console.log('Content/app overlays keyed to locale and bank at render time; source fallback while loading, late cancelled response ignored: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});

(async()=>{
 for(const kind of ['content','app'])for(const mode of ['null','array','number','badvalue','http','network','json','missing']){
  let calls=0;const x={exports:{},AbortController,setTimeout:(fn,ms)=>{const timer=setTimeout(fn,ms);timer.unref();return timer;},clearTimeout,require:()=>({}),fetch:async()=>{calls++;if(calls===1){if(mode==='network')throw Error('offline');return{ok:mode!=='http'&&mode!=='missing',status:mode==='missing'?404:mode==='http'?503:200,json:async()=>{if(mode==='json')throw Error('JSON');return mode==='null'?null:mode==='array'?[]:mode==='number'?3:kind==='content'?{entry:{m:{bad:true}}}:{title:{bad:true}};}};}return{ok:true,status:200,json:async()=>kind==='content'?{entry:{m:'Translated',e:'Example'}}:{title:'Translated'}};}};vm.runInNewContext(js,x);const load=()=>kind==='content'?x.exports.loadContentMap('bank','fr'):x.exports.loadAppTextMap('module','fr');assert.equal(await load(),null);const recovered=await load();if(mode==='missing'){assert.equal(recovered,null);assert.equal(calls,1);}else{assert(recovered);assert.equal(calls,2);await load();assert.equal(calls,2);}
 }
 console.log('Content/app invalid payloads cannot become React children;network/HTTP/JSON/shape failure evicts cache for retry,404 stays optional and cached: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});


(async()=>{
 for(const kind of ['content','app'])for(const stage of ['headers','body']){
  let stalled=true,id=0,aborts=0;const timers=new Map();const x={exports:{},AbortController,require:()=>({}),setTimeout:(fn,ms)=>{assert.equal(ms,30000);timers.set(++id,fn);return id;},clearTimeout:id=>timers.delete(id),fetch:async(url,{signal})=>{
   const data=kind==='content'?{entry:{m:'Recovered'}}:{title:'Recovered'};
   if(!stalled)return{ok:true,status:200,json:async()=>data};
   const wait=()=>new Promise((_,reject)=>signal.addEventListener('abort',()=>{aborts++;reject(Error('AbortError'));},{once:true}));
   if(stage==='headers')return await wait();return{ok:true,status:200,json:wait};
  }};vm.runInNewContext(js,x);const load=()=>kind==='content'?x.exports.loadContentMap('bank','fr'):x.exports.loadAppTextMap('module','fr');const pending=load();for(let n=0;n<10;n++)await Promise.resolve();assert.equal(timers.size,1);[...timers.values()][0]();assert.equal(await pending,null);assert.equal(aborts,1);assert.equal(timers.size,0);stalled=false;assert(await load());assert.equal(timers.size,0);
 }
 console.log('Content/app translation headers and body decoding abort after30s,clear timers,fallback safely and allow next-consumer retry: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});

(async()=>{
 const valid={items:[{id:'slg-000001',s:Array.from({length:10},(_,i)=>'Line '+i)}]};
 for(const mode of ['null','array','missingItems','badId','duplicate','badLine','short','http','network','json','missing','headers','body']){
  let calls=0,id=0;const timers=new Map();const x={exports:{},AbortController,require:()=>({}),setTimeout:(fn,ms)=>{assert.equal(ms,30000);timers.set(++id,fn);return id;},clearTimeout:id=>timers.delete(id),fetch:async(url,{signal})=>{
   calls++;if(calls>1)return{ok:true,status:200,json:async()=>valid};if(mode==='network')throw Error('offline');
   const wait=()=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(Error('AbortError')),{once:true}));if(mode==='headers')return await wait();
   return{ok:!['http','missing'].includes(mode),status:mode==='missing'?404:mode==='http'?503:200,json:async()=>{
    if(mode==='body')return await wait();if(mode==='json')throw Error('JSON');
    return mode==='null'?null:mode==='array'?[]:mode==='missingItems'?{}:mode==='duplicate'?{items:[valid.items[0],valid.items[0]]}:mode==='badId'?{items:[{...valid.items[0],id:null}]}:mode==='badLine'?{items:[{...valid.items[0],s:[{},...valid.items[0].s.slice(1)]}]}:mode==='short'?{items:[{...valid.items[0],s:['one']}]}:valid;
   }};
  }};vm.runInNewContext(js,x);const load=()=>x.exports.loadSentenceOverlay('slang','fr','slg','slg-000001');const first=load();for(let n=0;n<12;n++)await Promise.resolve();if(['headers','body'].includes(mode))[...timers.values()][0]();assert.equal(await first,null,mode);assert.equal(timers.size,0);const recovered=await load();if(mode==='missing'){assert.equal(recovered,null);assert.equal(calls,1);}else{assert.equal(recovered.length,10);assert.equal(calls,2);await load();assert.equal(calls,2);}assert.equal(timers.size,0);
 }
 console.log('Sentence overlays validate unique IDs and ten nonempty text lines;HTTP/network/JSON/schema/deadline failures retry while404 stays cached: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});

for(const prefix of ['ielts-v','toefl-v'])for(const [id,file]of [['000001','000001-000100'],['000100','000001-000100'],['000101','000101-000200']]){const entryId=prefix+'-'+id;assert.equal(c.exports.sentenceBlockFileName(entryId.replace(/-\d+$/,''),entryId),prefix+'-sent-'+file+'.json');}assert(fs.readFileSync('src/components/ExamVocabPanel.tsx','utf8').includes("const idPrefix = entry.id.replace(/-\\d+$/, '');"));console.log('Exam translated sentence prefixes keep ielts-v/toefl-v across100-entry boundaries: PASS');
