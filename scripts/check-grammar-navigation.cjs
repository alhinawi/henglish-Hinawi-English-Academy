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

const app=fs.readFileSync('src/App.tsx','utf8');
const nav=app.slice(app.indexOf('  const handleNavigate ='),app.indexOf('  // Keyboard shortcut'));
for(const saved of [null,'','bad','-10','Infinity','120px','120']){
 for(const blocked of [false,true]){
  const frames=[],timers=[],scrolls=[];
  const c={exports:{},navigationVersion:{current:0},setCurrentRoute(){},setActiveGrammarRuleId(){},setActiveLessonId(){},window:{location:{hash:'#grammar'},scrollTo:o=>scrolls.push(o)},sessionStorage:{getItem:()=>{if(blocked)throw Error('blocked');return saved;}},requestAnimationFrame:fn=>frames.push(fn),setTimeout:fn=>timers.push(fn)};
  vm.runInNewContext(ts.transpileModule(nav+'\nexports.nav=handleNavigate;',{}).outputText,c);c.exports.nav('grammar');
  const valid=saved==='120'&&!blocked;
  if(valid){assert.equal(frames.length,1);frames[0]();assert.equal(scrolls[0].top,120);c.exports.nav('vocabulary');timers[0]();assert.equal(scrolls.length,2);assert.equal(scrolls[1].top,0);}
  else {assert.equal(frames.length,0);assert.equal(scrolls.length,1);assert.equal(scrolls[0].top,0);}
 }
}
console.log('Grammar scroll restore: blocked reads/invalid coordinates use top; delayed callbacks ignored after later navigation: PASS');
for(const text of ["aria-label={t('grammar.searchPlaceholder')}",'aria-pressed={selectedCategory === cat}','aria-pressed={selectedLevel === lvl}'])assert.ok(fs.readFileSync('src/views/GrammarAcademyPage.tsx','utf8').includes(text),text);
console.log('Grammar academy search has a localized name and category/level filters expose selected state: PASS');
