import assert from 'node:assert/strict';
import {displayLeaderboard} from '../src/data/leaderboard/display';
const menschenNames = ['Maryam Adel','Ahmed Hassan','Omar Mahmoud','Nour Ahmed','Youssef Ibrahim','Sara Khaled','Karim Mostafa','Aya Mohamed','Hassan Ali','Fatma Samy'];
const empty = {top:[],me:null,realCount:0};
const rows=displayLeaderboard(empty);
assert.equal(rows.length,10);
assert.equal(rows[0].name,'Mohamed Alhinawi');
assert.equal(rows[0].avatar,'/images/leaderboard/owner.webp');
for (const row of rows.slice(1)) {
  assert(!menschenNames.includes(row.name));
  assert(!row.avatar?.includes('leaderboard-profile-'));
  assert.equal(row.starter,true);
}
assert.equal(new Set(rows.map(r=>r.name)).size,10);
assert.deepEqual(displayLeaderboard(empty,false),[]);
const real={rank:1,name:'Real Learner',points:0,avatar:'/actual-account-photo.jpg',pinned:false};
const board=displayLeaderboard({top:[real],me:{rank:1,points:0},realCount:1});
assert.equal(board.length,10);
assert.equal(board.find(r=>r.name===real.name)?.avatar,real.avatar);
assert.equal(board.find(r=>r.name===real.name)?.starter,false);
assert.equal(board.find(r=>r.name===real.name)?.points,0);
const launch=displayLeaderboard({top:[real],me:{rank:1,points:0},realCount:1},false);
assert.equal(launch.length,1);assert.equal(launch[0].name,real.name);
console.log('PASS distinct starter names/assets, owner preserved, real account unchanged, launch flag removes demos');
