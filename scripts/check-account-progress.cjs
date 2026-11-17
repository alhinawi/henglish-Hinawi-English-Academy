const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const transpile=path=>ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const store=new Map(),localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
const storageContext={exports:{},localStorage};vm.runInNewContext(transpile('src/services/accountProgressStorage.ts'),storageContext);
const {progressStorageKey:key,readAccountProgress:read,LEGACY_PROGRESS_KEY:legacy,GUEST_PROGRESS_KEY:guest}=storageContext.exports;
const defaults={quizScores:{},completedLessons:[],knownFlashcards:[],reviewFlashcards:[],notes:[],bookmarks:[],xp:0};
const old=JSON.stringify({...defaults,quizScores:{legacy:75},xp:200});store.set(legacy,old);
assert.equal(read(key('A'),defaults).xp,0);assert.equal(store.get(legacy),old);assert.equal(JSON.parse(store.get(guest)).xp,200);
assert.equal(read(guest,defaults).quizScores.legacy,75);store.set(legacy,'{}');assert.equal(read(guest,defaults).xp,200);
assert.equal(key(),guest);assert.equal(key('guest-123'),guest);assert.notEqual(key('A'),key('B'));assert.notEqual(key('a/b'),key('a%2Fb'));
// Damaged or unavailable legacy recovery cannot replace a readable owner record.
const beforeRecovery=new Map(store),savedOwner=JSON.stringify({...defaults,xp:120,completedLessons:['saved-lesson'],quizScores:{saved:{score:4,total:5,date:'2026-11-17'}}});
store.set(key('recovery'),savedOwner);store.delete(guest);store.set(legacy,'{damaged');
assert.equal(read(key('recovery'),defaults).xp,120);
assert.equal(read(key('recovery'),defaults).completedLessons[0],'saved-lesson');
assert.equal(read(key('recovery'),defaults).quizScores.saved.score,4);
assert.equal(store.get(legacy),'{damaged');assert.equal(store.get(key('recovery')),savedOwner);assert.equal(store.has(guest),false);
store.set(legacy,old);const originalSet=localStorage.setItem;localStorage.setItem=(k,v)=>{if(k===guest)throw Error('migration denied');return originalSet(k,v)};
assert.equal(read(key('recovery'),defaults).xp,120);assert.equal(store.get(legacy),old);assert.equal(store.has(guest),false);localStorage.setItem=originalSet;
const originalGet=localStorage.getItem;localStorage.getItem=k=>{if(k===guest||k===legacy)throw Error('legacy access denied');return originalGet(k)};
assert.equal(read(key('recovery'),defaults).xp,120);localStorage.getItem=originalGet;
localStorage.getItem=()=>{throw Error('all storage denied')};assert.equal(read(key('recovery'),defaults).xp,0);localStorage.getItem=originalGet;
store.clear();for(const [k,v] of beforeRecovery)store.set(k,v);
const apiReads=[],dbReads=[],apiWrites=[],dbWrites=[],migrations=[],timers=new Map();let timerId=0,token='token-A';
let states=[],refs=[],effects=[],cursor=0,dirty=false,proposed=[],result,identity;
const same=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>Object.is(v,b[i]));
const react={
 useState:init=>{const i=cursor++;if(!(i in states))states[i]=typeof init==='function'?init():init;return [states[i],update=>{states[i]=typeof update==='function'?update(states[i]):update;dirty=true}]},
 useRef:init=>{const i=cursor++;return refs[i]??(refs[i]={current:init})},
 useEffect:(fn,deps)=>{const i=cursor++;proposed.push({i,fn,deps})},
};
const deferred=(list,id)=>new Promise(resolve=>list.push({id,resolve}));
const context={exports:{},console,Date,localStorage,window:{},setTimeout:fn=>{timers.set(++timerId,fn);return timerId},clearTimeout:id=>timers.delete(id),require:path=>{
 if(path==='react')return react;
 if(path.endsWith('courseProgress')){const c={exports:{}};vm.runInNewContext(transpile('src/services/courseProgress.ts'),c);return c.exports;}
 if(path.endsWith('accountProgressStorage'))return storageContext.exports;
 if(path.endsWith('useBadges'))return {useBadges:()=>({badges:[]})};
 if(path.endsWith('studyStreak'))return {addStudyDay:()=>({})};
 if(path.endsWith('henglishApi'))return {getHenglishApiToken:()=>token,apiGetProgress:t=>deferred(apiReads,t),apiPutProgress:async(t,p)=>apiWrites.push({t,p})};
 if(path.endsWith('progressSyncService'))return {readUserProgressFromDatabase:id=>deferred(dbReads,id),saveUserProgressToDatabase:async(id,p)=>dbWrites.push({id,p}),migrateLocalProgressToSupabase:async(id,p)=>migrations.push({id,p})};
 throw Error(path);
}};
vm.runInNewContext(transpile('src/utils/useProgress.ts'),context);
function render(...args){if(args.length)identity=args[0];let guard=0;do{dirty=false;cursor=0;proposed=[];result=context.exports.useProgress(identity);if(++guard>30)throw Error('render loop')}while(dirty);
 for(const e of proposed){if(!same(effects[e.i]?.deps,e.deps)){effects[e.i]?.cleanup?.();effects[e.i]={deps:e.deps,cleanup:e.fn()}}}if(dirty)return render();return result;}
const tick=async()=>{await new Promise(setImmediate);render()};
(async()=>{
 render('A');assert.deepEqual(Object.keys(result.progress.quizScores),[]);assert.equal(dbWrites.length,0);assert.equal(apiWrites.length,0);
 result.markLessonComplete('lesson-once');render();const firstXp=result.userProfile.xp;result.markLessonComplete('lesson-once');render();assert.equal(result.userProfile.xp,firstXp);assert.equal(result.progress.completedLessons.length,1);
 result.recordQuizScore('A-only',4,5);render();const staleA=result.recordQuizScore;assert.equal(result.progress.quizScores['A-only'].score,4);
 token='token-B';render('B');assert.deepEqual(Object.keys(result.progress.quizScores),[]);staleA('stale-A',5,5);render();assert.deepEqual(Object.keys(result.progress.quizScores),[]);
 apiReads[0].resolve({progress:{quizScores:{'late-A':100},xp:900}});dbReads[0].resolve({status:'ready',progress:{quizScores:{'late-db-A':100},totalXp:900,completedLessons:[]}});await tick();assert.equal(result.progress.xp,0);assert.equal(apiWrites.length,0);assert.equal(migrations.length,0);
 apiReads[1].resolve({progress:{quizScores:{'remote-B':60},xp:10}});dbReads[1].resolve({status:'ready',progress:{quizScores:{'db-B':80},totalXp:15,completedLessons:[]}});await tick();assert.equal(result.progress.quizScores['remote-B'],60);assert.equal(result.progress.quizScores['db-B'],80);assert.equal(result.progress.xp,15);
 for(const w of apiWrites){assert.equal(w.t,'token-B');assert(!('A-only' in w.p.quizScores))}for(const w of dbWrites){assert.equal(w.id,'B');assert(!('A-only' in w.p.quizScores))}
 token=null;render(undefined);assert.equal(result.progress.quizScores.legacy,75);assert(!('remote-B' in result.progress.quizScores));assert.equal(timers.size,0);
 token='token-A';render('A');assert.equal(result.progress.quizScores['A-only'].score,4);assert(!('late-A' in result.progress.quizScores));assert(!('legacy' in result.progress.quizScores));
 result.recordQuizScore('during-hydration',3,5);render();
 apiReads[2].resolve({progress:null});dbReads[2].resolve({status:'empty'});await tick();assert.equal(migrations.at(-1).id,'A');assert.equal(migrations.at(-1).p.quizScores['A-only'].score,4);assert(!('legacy' in migrations.at(-1).p.quizScores));assert.equal(migrations.at(-1).p.quizScores['during-hydration'].score,3);assert.equal(apiWrites.at(-1).p.quizScores['during-hydration'].score,3);
 const savedA=store.get(key('A'));token='token-B';render('B');result.resetAllProgress();render();assert.equal(store.get(key('A')),savedA);assert.equal(store.get(legacy),'{}');assert.equal(JSON.parse(store.get(guest)).quizScores.legacy,75);
 const writesBefore=apiWrites.length,migrationsBefore=migrations.length,dbBefore=dbWrites.length;token='token-failure';render('failure');result.recordQuizScore('safe-local',2,3);render();apiReads.at(-1).resolve(null);dbReads.at(-1).resolve({status:'unavailable'});await tick();for(const fn of timers.values())fn();assert.equal(apiWrites.length,writesBefore);assert.equal(migrations.length,migrationsBefore);assert.equal(dbWrites.length,dbBefore);assert.equal(result.progress.quizScores['safe-local'].score,2);
 store.delete(guest);store.set(legacy,'{damaged');store.set(key('mount-recovery'),savedOwner);token='token-recovery';render('mount-recovery');assert.equal(result.progress.xp,120);assert.equal(result.progress.completedLessons[0],'saved-lesson');assert.equal(JSON.parse(store.get(key('mount-recovery'))).quizScores.saved.score,4);assert.equal(store.get(legacy),'{damaged');assert.equal(store.has(guest),false);
 console.log('Legacy parse/write/read failures do not hide or overwrite valid owner progress on mount; account/guest keys, legacy recovery copy, isolated scores, synchronous switch, stale reads/callbacks, hydration guards, same-account migration and reset scope: PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
