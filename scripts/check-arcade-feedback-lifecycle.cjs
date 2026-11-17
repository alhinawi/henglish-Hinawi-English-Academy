const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
let index=0,slots=[],effects=[],timers=new Map(),serial=0;
const react={useRef:v=>{const i=index++;return slots[i]??(slots[i]={current:v})},useCallback:fn=>{index++;return fn},useEffect:fn=>effects.push(fn)};
const context={exports:{},require:()=>react,setTimeout:fn=>{timers.set(++serial,fn);return serial},clearTimeout:id=>timers.delete(id)};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/hooks/useArcadeTimeout.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
const hook=context.exports.useArcadeTimeout();const cleanup=effects[0]();let calls=[];
hook.scheduleTransition(()=>calls.push('old'),700);hook.scheduleTransition(()=>calls.push('new'),700);assert.equal(timers.size,1);for(const [id,fn]of [...timers]){timers.delete(id);fn()}assert.deepEqual(calls,['new']);
hook.scheduleTransition(()=>calls.push('replay-stale'),600);hook.cancelTransition();assert.equal(timers.size,0);hook.scheduleTransition(()=>calls.push('exit-stale'),600);cleanup();assert.equal(timers.size,0);assert.deepEqual(calls,['new']);
for(const name of ['WordSprint','WordMatch','SentenceScramble','GapFill','TrueFalse','MovieMemory']){const s=fs.readFileSync('src/components/arcade/games/'+name+'Game.tsx','utf8');assert(s.includes('useArcadeTimeout()'),name);assert(!s.includes('setTimeout('),name);assert(s.includes('cancelTransition();'),name)}
const match=fs.readFileSync('src/components/arcade/games/WordMatchGame.tsx','utf8');assert.equal((match.match(/disabled=\{isDone \|\| !!wrongPair\}/g)||[]).length,2);assert(match.includes('setWrongPair(null);'));
console.log('Arcade feedback transitions cancel on replay/unmount/replacement; six games use owned timeouts; matching waits for wrong-pair feedback: PASS');
