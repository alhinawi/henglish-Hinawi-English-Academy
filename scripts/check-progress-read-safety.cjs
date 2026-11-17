const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
let result={data:null,error:{message:'offline'}},throws=false,writes=[];
const db={from:table=>({select(){return this},eq(){return this},async maybeSingle(){if(throws)throw Error('offline');return result},async upsert(payload){writes.push({table,payload});return {error:null}},update(payload){writes.push({table,payload});return this}})};
const c={exports:{},console:{warn(){}},Date,require:path=>{assert.equal(path,'./authService');return {supabase:db}}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/services/progressSyncService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,c);
const local={xp:0,completedLessons:[],quizScores:{local:{score:4,total:5}},studyStreakDays:0,level:'A1'};
(async()=>{
 for(const throwError of [false,true]){throws=throwError;assert.equal((await c.exports.readUserProgressFromDatabase('A')).status,'unavailable');assert.equal((await c.exports.migrateLocalProgressToSupabase('A',local)).success,false);assert.equal(writes.length,0)}
 throws=false;result={data:null,error:null};assert.equal((await c.exports.readUserProgressFromDatabase('A')).status,'empty');assert.equal((await c.exports.migrateLocalProgressToSupabase('A',local)).success,true);assert.equal(writes[0].payload.quiz_scores.local,80);assert.equal(writes[0].payload.streak_days,0);
 result={data:{total_xp:25,completed_lessons:['remote'],quiz_scores:{remote:90}},error:null};const ready=await c.exports.readUserProgressFromDatabase('A');assert.equal(ready.status,'ready');assert.equal(ready.progress.totalXp,25);assert.equal((await c.exports.loadUserProgressFromDatabase('A')).quizScores.remote,90);
 console.log('Failed/unavailable database reads never seed or save; confirmed empty can migrate; ready records and compatibility reader preserved: PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
