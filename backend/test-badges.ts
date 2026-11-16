import {getPlatformProxy} from 'wrangler';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import app from './src/index';
import {sha256Hex} from './src/crypto';
import {evaluateBadges,type BadgeEvidence} from './src/badges';
const empty:BadgeEvidence={account:true,avatar:false,checkpoints:[],attempts:[],certificates:[]};
const get=(e:BadgeEvidence,id:string)=>evaluateBadges(e,Date.parse('2026-11-16T12:00:00Z')).find(b=>b.id===id)!;
assert.equal(get(empty,'first-login').unlocked,true);
assert.equal(get(empty,'xp-100').available,false);
assert.equal(get(empty,'level-c1').available,false);
assert.equal(get({...empty,certificates:[{definition_id:'cert-grammar-diploma',level:'C1'}]},'level-c1').unlocked,false);
const attempt=(day:number)=>({started_at:Date.parse(`2026-11-${day}T04:00:00Z`)/1000,score:3,total:3});
assert.equal(get({...empty,attempts:[attempt(14),attempt(15),attempt(16)]},'streak-3').unlocked,true);
assert.equal(get({...empty,attempts:[attempt(10),attempt(11),attempt(12)]},'streak-3').unlocked,true);
assert.equal(get({...empty,attempts:[attempt(16)]},'early-bird').unlocked,true);
assert.equal(get({...empty,attempts:[{...attempt(16),score:0}]},'early-bird').unlocked,false);
assert.equal(get({...empty,attempts:[attempt(10),attempt(12),attempt(16)]},'streak-3').unlocked,false);
const mf=await getPlatformProxy<{DB:D1Database}>({persist:false});
try {
 const db=mf.env.DB;
 for(const f of ['0001_init.sql','0002_google_oauth.sql','0003_avatar.sql','0004_certificates.sql'])for(const sql of readFileSync('migrations/'+f,'utf8').split(';').map(s=>s.trim()).filter(Boolean))await db.prepare(sql).run();
 await db.prepare("INSERT INTO users(name,email,password_hash) VALUES('Test Learner','test@example.invalid','x'),('Other Learner','other@example.invalid','x')").run();
 const token='test-badge-session';
 await db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,1,?)').bind(await sha256Hex(token),new Date(Date.now()+3600000).toISOString()).run();
 const env={DB:db,ALLOWED_ORIGINS:'http://localhost:5173'};
 async function call(authed=true){const r=await app.request('http://local/api/badges?userId=2',{headers:authed?{Authorization:'Bearer '+token}:{}},env as any);return {status:r.status,body:await r.json() as any};}
 assert.equal((await call(false)).status,401);
 await db.prepare('INSERT INTO progress(user_id,data) VALUES(1,?)').bind(JSON.stringify({xp:999999999,studyStreakDays:365,completedLessons:['rule-present-simple'],badges:['streak-365','xp-50000'],quizScores:{test:{score:100,total:100}}})).run();
 let response=await call();assert.equal(response.status,200);assert.equal(response.body.badges.length,86);
 assert.deepEqual(response.body.badges.filter((b:any)=>b.unlocked).map((b:any)=>b.id),['first-login']);
 // A different user's checkpoint must not leak or award the current user.
 await db.prepare("INSERT INTO certificate_checkpoints VALUES(2,'rule-present-simple',1,3,3)").run();
 assert.equal((await call()).body.badges.find((b:any)=>b.id==='lessons-1').unlocked,false);
 await db.prepare("INSERT INTO certificate_checkpoints VALUES(1,'rule-present-simple',1,3,3)").run();
 response=await call();assert.equal(response.body.badges.find((b:any)=>b.id==='lessons-1').unlocked,true);assert.equal(response.body.badges.find((b:any)=>b.id==='grammar-1').unlocked,true);
 await db.prepare("INSERT INTO certificates VALUES('test',1,'cert-level-a1','Test','A1','A1',1,10,12,0,1)").run();
 assert.equal((await call()).body.badges.find((b:any)=>b.id==='level-a1').unlocked,true);
 await db.prepare("UPDATE certificates SET revoked=1").run();
 assert.equal((await call()).body.badges.find((b:any)=>b.id==='level-a1').unlocked,false);
 console.log('PASS 86 badges: auth, account isolation, forged progress ignored, actual checkpoint awards, certificate revocation, streak dates, Cairo early bird, no XP-to-level shortcut');
} finally {await mf.dispose();}
