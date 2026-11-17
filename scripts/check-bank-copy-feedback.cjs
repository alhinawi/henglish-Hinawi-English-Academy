const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
(async()=>{
 for(const path of ['src/components/PhraseBankPanel.tsx','src/components/ExamVocabPanel.tsx']){
 const s=fs.readFileSync(path,'utf8'),handler=s.slice(s.indexOf('  const copyAll ='),s.indexOf('  return (',s.indexOf('  const copyAll =')));
 for(const mode of ['modern','legacy','denied','throw']){
 let removed=0,legacy=0;const c={exports:{},entry:{phrase:'phrase',word:'word'},shownMeaning:'meaning',shown:[{en:'example',ar:'translation'}],copyText:async()=>mode==='modern',closeRef:{current:{focus(){}}},setCopied:v=>c.copied=v,setCopyFailed:v=>c.failed=v,document:{createElement:()=>({style:{},select(){},remove(){removed++}}),body:{appendChild(){}},execCommand:()=>{legacy++;if(mode==='throw')throw Error('denied');return mode==='legacy';}},window:{setTimeout(){}}};
 vm.runInNewContext(ts.transpileModule(handler+'\nexports.copy=copyAll;',{}).outputText,c);await c.exports.copy();assert.equal(c.copied,mode==='modern'||mode==='legacy');assert.equal(c.failed,mode==='denied'||mode==='throw');assert.equal(legacy,mode==='modern'?0:1);assert.equal(removed,mode==='modern'?0:1);
 }
 assert.ok(s.includes("t('copy.failed')"));
 }
 console.log('Phrase/exam copy modern success, checked legacy fallback, denied/throw failure status and temporary-element cleanup: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
