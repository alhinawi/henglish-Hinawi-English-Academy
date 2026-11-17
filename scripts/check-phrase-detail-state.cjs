const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const source=fs.readFileSync('src/components/PhraseBankPanel.tsx','utf8');
const hash=source.slice(source.indexOf('    const fromHash ='),source.indexOf('    fromHash();'));
const known={id:'idm-000001'};const c={exports:{},bank:'idioms',entries:[known],window:{location:{hash:'#idioms/idm-000001'}},setSelected:value=>c.selected=value};
vm.runInNewContext(ts.transpileModule(hash+'\nexports.sync=fromHash;',{}).outputText,c);c.exports.sync();assert.equal(c.selected,known);c.window.location.hash='#idioms/missing';c.exports.sync();assert.equal(c.selected,null);c.window.location.hash='#idioms';c.exports.sync();assert.equal(c.selected,null);
for(const text of ['aria-labelledby={titleId}','id={titleId}','ref={dialogRef}','ref={closeRef}','closeRef.current?.focus()','event.shiftKey','first.focus()','opener?.isConnected',"document.removeEventListener('keydown', trap)"])assert.ok(source.includes(text),text);
console.log('Phrase detail clears unmatched deep-link selection; named modal starts/traps/restores keyboard focus: PASS');

const filters=fs.readFileSync('src/components/FilterSheet.tsx','utf8');
for(const text of ['aria-labelledby={titleId}','id={titleId}','ref={dialogRef}','ref={closeRef}','closeRef.current?.focus()','event.shiftKey','first.focus()','opener?.isConnected',"document.removeEventListener('keydown', trap)",'aria-pressed={active}',"}, [open]);"])assert.ok(filters.includes(text),text);
console.log('Shared filter sheet has named dialog, lifecycle-scoped focus trap/restore and announced option selection: PASS');

const examSource=fs.readFileSync('src/components/ExamVocabPanel.tsx','utf8');
const examHash=examSource.slice(examSource.indexOf('    const fromHash ='),examSource.indexOf('    fromHash();'));
const ex={exports:{},exam:'ielts',entries:[{id:'iel-000001'}],window:{location:{hash:'#ielts/iel-000001'}},setSelected:value=>ex.selected=value};
vm.runInNewContext(ts.transpileModule(examHash+'\nexports.sync=fromHash;',{}).outputText,ex);ex.exports.sync();assert.equal(ex.selected.id,'iel-000001');ex.window.location.hash='#ielts/missing';ex.exports.sync();assert.equal(ex.selected,null);
for(const text of ['aria-labelledby={titleId}','id={titleId}','ref={dialogRef}','ref={closeRef}','closeRef.current?.focus()','event.shiftKey','first.focus()','opener?.isConnected',"document.removeEventListener('keydown', trap)"])assert.ok(examSource.includes(text),text);
console.log('Exam detail clears unmatched deep links and names/traps/restores modal focus: PASS');
