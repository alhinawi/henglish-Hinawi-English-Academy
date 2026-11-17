const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const src=fs.readFileSync('src/views/WritingAcademyPage.tsx','utf8');
const invalidator=src.slice(src.indexOf('  const invalidateCopy ='),src.indexOf('  useEffect(() => () => {',src.indexOf('  const invalidateCopy =')));
const handler=src.slice(src.indexOf('  const handleCopyTemplate ='),src.indexOf('  const handleAnalyzeWriting ='));
(async()=>{
 const pending=[],timers=[];let cleared=0;
 const c={exports:{},copyVersion:{current:0},copyTimer:{current:null},currentTemplate:{subject:'subject',salutation:'hello',body:'body',signoff:'bye'},playSound(){},copyText:text=>new Promise(resolve=>pending.push({text,resolve})),setCopied:v=>c.copied=v,setCopyFailed:v=>c.failed=v,setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout(){cleared++}};
 vm.runInNewContext(ts.transpileModule(invalidator+handler+'\nexports.copy=handleCopyTemplate;exports.invalidate=invalidateCopy;',{}).outputText,c);
 const first=c.exports.copy();assert.equal(pending[0].text,'subject\n\nhello\n\nbody\n\nbye');c.exports.invalidate();pending[0].resolve(true);await first;assert.equal(c.copied,false);
 const second=c.exports.copy(),third=c.exports.copy();pending[2].resolve(true);await third;assert.equal(c.copied,true);pending[1].resolve(false);await second;assert.equal(c.failed,false);assert.equal(c.copied,true);
 c.exports.invalidate();assert.equal(c.copied,false);assert.ok(cleared>0);timers[0]();assert.equal(c.copied,false);
 const denied=c.exports.copy();pending[3].resolve(false);await denied;assert.equal(c.failed,true);c.exports.invalidate();assert.equal(c.failed,false);
 assert.equal((src.match(/invalidateCopy\(\);\s+setActiveTemplate/g)||[]).length,5);
 assert.ok(src.includes('if (copyTimer.current !== null) clearTimeout(copyTimer.current);'));
 console.log('Writing template copy ignores stale success/failure, latest click wins, clears previous timer and template-change feedback: PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
