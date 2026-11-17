const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
(async()=>{for(const file of ['PhraseBankPanel','ExamVocabPanel']){
 const src=fs.readFileSync('src/components/'+file+'.tsx','utf8'),handler=src.slice(src.indexOf('  const copyAll ='),src.indexOf('  return (',src.indexOf('  const copyAll =')));
 const identity=file==='PhraseBankPanel'?'bank':'exam';assert.ok(src.includes('key={`${'+identity+'}:${selected.id}:${lang}`}'),'Entry/locale changes must remount sentence and overlay state before copying');
 const pending=[],timers=[];let legacy=0,cleared=0;
 const c={exports:{},copyVersion:{current:0},copyTimer:{current:null},entry:{phrase:'phrase',word:'word'},shownMeaning:'meaning',shown:[],copyText:()=>new Promise(resolve=>pending.push(resolve)),setCopied:v=>c.copied=v,setCopyFailed:v=>c.failed=v,document:{createElement(){legacy++;throw Error('stale fallback attempted')}},window:{setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout(){cleared++}}};
 vm.runInNewContext(ts.transpileModule(handler+'\nexports.copy=copyAll;',{}).outputText,c);
 const first=c.exports.copy();c.copyVersion.current++;pending[0](false);await first;assert.equal(legacy,0);assert.equal(c.copied,false);assert.equal(c.failed,false);
 const second=c.exports.copy(),third=c.exports.copy();pending[2](true);await third;assert.equal(c.copied,true);pending[1](false);await second;assert.equal(c.failed,false);assert.equal(legacy,0);
 const fourth=c.exports.copy();assert.equal(cleared,1);pending[3](true);await fourth;timers[0]();assert.equal(c.copied,true);timers[1]();assert.equal(c.copied,false);
 assert.ok(src.includes('}, [entry.id, lang]);'));assert.ok(src.includes('window.clearTimeout(copyTimer.current)'));
}console.log('Phrase/exam stale copy cannot fall back or change feedback; latest click owns status/timer; entry/language cleanup: PASS');})().catch(e=>{console.error(e);process.exitCode=1});
