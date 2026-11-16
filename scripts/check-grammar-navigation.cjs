const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const source=fs.readFileSync('src/views/GrammarAcademyPage.tsx','utf8');
const handler=source.slice(source.indexOf('  const openLesson ='),source.indexOf('  return ('));
for(const blocked of [true,false]){
 const calls=[],saved=[];const c={exports:{},playSound:s=>calls.push(s),onNavigate:(...args)=>calls.push(args),window:{scrollY:250},sessionStorage:{setItem:(...args)=>{if(blocked)throw Error('blocked');saved.push(args);}}};
 vm.runInNewContext(ts.transpileModule(handler+'\nexports.open=openLesson;',{}).outputText,c);c.exports.open('present-simple');
 assert.equal(calls[0],'click');assert.equal(calls[1][0],'grammar-lesson');assert.equal(calls[1][1],'present-simple');assert.equal(saved.length,blocked?0:1);
}
assert.equal((source.match(/sessionStorage\.setItem/g)||[]).length,1);
assert.ok(source.includes('href={`#grammar/${rule.id}`}'));
assert.ok(source.includes('e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0'));
assert.equal((source.match(/openLesson\(rule.id\)/g)||[]).length,3);
console.log('Grammar navigation survives blocked scroll storage; card, native title link and CTA share handler; modified link clicks preserved: PASS');
