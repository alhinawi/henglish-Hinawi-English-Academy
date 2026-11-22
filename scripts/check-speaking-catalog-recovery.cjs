const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const view=fs.readFileSync('src/views/SpeakingAcademyPage.tsx','utf8'),line=view.split('\n').find(s=>s.includes('const filtered ='));
const row={title:'عنوان',titleEn:'Meeting',unit:'التعارف',level:'A1',phrase:'Nice to meet you',dialogue:[{en:'Where are you from?',ar:'أنت منين؟'}]};
function match(search,level='all'){const c={exports:{},SPEAKING_LESSONS:[row],level,search,appText:{'عنوان':'Begegnung','التعارف':'Kontakt'},txText:(m,s)=>m[s]||s};vm.runInNewContext(line+'exports.rows=filtered;',c);return c.exports.rows;}
for(const q of ['  NICE TO MEET YOU ','where are you from','أنت منين','Begegnung','Kontakt','Meeting','عنوان'])assert.equal(match(q).length,1,q);
assert.equal(match('where are you from','B2').length,0);assert.equal(match('missing_zzz').length,0);assert.equal(match('   ').length,1);
assert(view.includes("setSearch(''); searchInput.current?.focus();"));assert(view.includes("setSearch(''); setLevel('all'); searchInput.current?.focus();"));assert(view.includes("e.key==='Escape'"));assert(view.includes('role="status"'));assert(view.includes('onClick={clearSearch}'));assert(view.includes('onClick={resetFilters}'));
for(const lang of ['en','ar','de']){const t=JSON.parse(fs.readFileSync('src/i18n/locales/'+lang+'.json'));for(const key of ['sa.clearSearch','sa.resetFilters','sa.results'])assert(t[key]);assert(t['sa.results'].includes('{count}')&&t['sa.results'].includes('{total}'));}
console.log('Speaking search finds original/displayed title,unit,phrase and bilingual dialogue; keeps level intersection,clear/Escape preserves level,explicitreset restores all/focus;localized count/recovery: PASS');
