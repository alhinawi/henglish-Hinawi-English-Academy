const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('../../node_modules/typescript');
const vm = require('node:vm');
function load(file) { const box={exports:{}, require}; vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,box); return box.exports; }
const {buildLeaderboard, pointsOf, isOwnerGoogleSession} = load('backend/src/leaderboard.ts');
const owner = {id:1,name:'Mohamed Alhinawi',email:'3asfuur@gmail.com',google_sub:'verified-local-google',avatar:'owner-photo',data:'{}'};
const learner = {id:2,name:'New Learner',email:'new@example.invalid',google_sub:null,avatar:'private-photo',data:JSON.stringify({xp:9999999})};
assert.equal(pointsOf(learner.data),0,'signup/local xp alone must not create points');
assert.equal(pointsOf(JSON.stringify({completedLessons:['a','a'],quizScores:{x:{score:9,total:10},y:{score:2,total:0}}})),145);
assert.equal(pointsOf(JSON.stringify({quizScores:{x:{score:100,total:1},y:{score:-5,total:5}}})),50);
assert.equal(pointsOf('broken'),0);
let b=buildLeaderboard([learner,owner],2);assert.equal(b.top[0].name,'Mohamed Alhinawi');assert.equal(b.top[0].points,120);assert.equal(b.top[1].points,0);assert.equal(b.top[1].avatar,null);assert.equal(b.top[1].name,'New L.');assert.equal(b.me.rank,2);
assert.ok(!JSON.stringify(b).includes('@'));assert.ok(!JSON.stringify(b).includes('verified-local-google'));assert.ok(!JSON.stringify(b).includes('private-photo'));
assert.equal(buildLeaderboard([{...owner,google_sub:null}],1).top.length,0,'unverified owner-email registration is not owner');
assert.equal(isOwnerGoogleSession(owner,'g.random'),true);assert.equal(isOwnerGoogleSession(owner,'random'),false);assert.equal(isOwnerGoogleSession({...owner,email:'alhinaawi@gmail.com'},'g.random'),false);assert.equal(isOwnerGoogleSession({...owner,google_sub:null},'g.random'),false);
// Use a minimal module mock for the frontend's placeholder dependency.
const displayBox={exports:{},require:p=>p.includes('authService')?{ANONYMOUS_AVATAR:'anonymous'}:require(p)};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/leaderboard/display.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,displayBox);
const display=displayBox.exports.displayLeaderboard;
let rows=display({top:[],me:null,realCount:0});assert.equal(rows.length,10);assert.equal(rows[0].name,'Mohamed Alhinawi');assert.equal(rows[1].name,'Maryam Adel');
rows=display(b);assert.equal(rows.length,10);assert.equal(rows[1].name,'Maryam Adel');assert.equal(rows[9].points,0);assert.ok(rows[9].own);assert.equal(rows.filter(r=>r.starter).length,8);
rows=display({top:Array.from({length:10},(_,i)=>({rank:i+1,name:'Learner '+i,points:0,avatar:null,pinned:i===0})),me:null,realCount:20});assert.equal(rows.filter(r=>r.starter).length,0);
assert.equal(display(b,false).length,2);
console.log('PASS: owner pin, exact owner identity, fresh Google-session gate, no fake XP, privacy, starter replacement, zero newcomers, and demo off switch.');
