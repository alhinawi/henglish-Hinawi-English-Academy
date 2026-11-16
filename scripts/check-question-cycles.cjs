const fs=require('fs'),ts=require('typescript'),vm=require('vm'),assert=require('assert/strict');
let stored={};const storage={getItem:k=>stored[k]??null,setItem:(k,v)=>stored[k]=v,removeItem:k=>delete stored[k]};const c={exports:{},localStorage:storage,Math:Object.assign(Object.create(Math),{random:()=>0.5})};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/services/questionBankService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,c);
const {drawQuestions:draw,resetServedQuestions:reset}=c.exports;
const pool=Array.from({length:5},(_,i)=>({id:'q-'+i,skill:'vocabulary',level:'A1',type:'multiple-choice'})),before=JSON.stringify(pool),opts={count:3,skill:'vocabulary',level:'A1'};
const first=draw(pool,opts),seen=new Set(first.map(q=>q.id)),tail=pool.filter(q=>!seen.has(q.id));const second=draw(pool,opts);assert.equal(second.length,3);assert.deepEqual(new Set(second.slice(0,2).map(q=>q.id)),new Set(tail.map(q=>q.id)));assert.equal(new Set(second.map(q=>q.id)).size,3);
const newCycleFirst=second[2].id,third=draw(pool,opts);assert.equal(third.length,3);assert.ok(third.every(q=>q.id!==newCycleFirst));assert.equal(JSON.stringify(pool),before);
reset();assert.equal(draw(pool,{count:99}).length,5);assert.equal(new Set(draw(pool,{count:99}).map(q=>q.id)).size,5);assert.equal(draw(pool,{count:0}).length,0);assert.equal(draw(pool,{count:3,skill:'grammar'}).length,0);
reset();draw(pool,opts);const different=draw(pool,{count:5,skill:'vocabulary',level:'all'});assert.equal(different.length,5);assert.equal(JSON.stringify(pool),before);
console.log('Question cycles serve unseen tail before repeat, no duplicate within draw, pool isolation and source preservation: PASS');
