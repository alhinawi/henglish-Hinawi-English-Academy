const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
async function check(name,scenario){
 const s=fs.readFileSync('src/components/arcade/games/'+name+'Game.tsx','utf8');const start=s.indexOf('  const start = async'),end=s.indexOf('\n  };',start)+6;const exit=s.indexOf('  const exit ='),exitEnd=s.indexOf('\n  };',exit)+6;let pending=[],calls=[];const c={exports:{},requestVersion:{current:0},advanceTimer:{current:null},cancelTransition(){},clearTimeout(){},onExit:()=>calls.push('exit'),allSentencePairs:()=>new Promise(r=>pending.push(r)),sample:a=>a.slice(0,6),uniqueMeaningPairs:a=>a,shuffle:a=>a,buildTrueFalseRounds:a=>a,PAIRS:6,ROUNDS:8,prepRound:()=>calls.push('prep')};
 for(const setter of new Set(s.match(/\bset[A-Z]\w+/g)))c[setter]=v=>calls.push(setter);
 const cleanup=s.match(/useEffect\(\(\) => \(\) => \{ requestVersion.current \+= 1;[^\n]+/)[0];c.useEffect=fn=>c.cleanup=fn();
 vm.runInNewContext(ts.transpileModule(cleanup+'\n'+s.slice(exit,exitEnd)+'\n'+s.slice(start,end)+'\nexports.start=start;exports.exit=exit;',{}).outputText,c);
 const first=c.exports.start();const before=calls.length;
 if(scenario==='exit'){c.exports.exit();const after=calls.length;pending[0]([{en:'Older real sentence',ar:'old'}]);await first;assert.equal(calls.length,after,name+' stale state after explicit exit');assert(calls.includes('exit'))}
 else if(scenario==='unmount'){c.cleanup();pending[0]([{en:'Older real sentence',ar:'old'}]);await first;assert.equal(calls.length,before,name+' stale state after unmount')}
 else if(scenario==='replace'){const second=c.exports.start();pending[1]([{en:'Latest real sentence',ar:'new'}]);await second;const after=calls.length;pending[0]([{en:'Older real sentence',ar:'old'}]);await first;assert.equal(calls.length,after,name+' older request overwrites latest');assert(calls.includes('setPhase'))}
 else{pending[0]([{en:'Active real sentence',ar:'active'}]);await first;assert(calls.length>before,name+' active result missing')}
 assert(s.includes('role="status"'));assert(s.includes("{t('as.back')}"));assert(s.includes('onClick={exit}'));assert(!s.includes('onBack={onExit}'));assert(!s.includes('onQuit={onExit}'));
}
(async()=>{for(const name of ['MovieMemory','SentenceScramble','TrueFalse','ListeningChallenge'])for(const scenario of ['active','exit','unmount','replace'])await check(name,scenario);console.log('Four actual arcade startup handlers retain active responses,ignore old/replaced/exited/unmounted requests and expose a loading exit: PASS')})().catch(e=>{console.error(e);process.exitCode=1});
