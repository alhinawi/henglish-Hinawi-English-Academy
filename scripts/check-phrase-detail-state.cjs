const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const source=fs.readFileSync('src/components/PhraseBankPanel.tsx','utf8');
const hash=source.slice(source.indexOf('    const fromHash ='),source.indexOf('    fromHash();'));
const known={id:'idm-000001'};const c={exports:{},bank:'idioms',entries:[known],window:{location:{hash:'#idioms/idm-000001'}},setSelected:value=>c.selected=value};
vm.runInNewContext(ts.transpileModule(hash+'\nexports.sync=fromHash;',{}).outputText,c);c.exports.sync();assert.equal(c.selected,known);c.window.location.hash='#idioms/missing';c.exports.sync();assert.equal(c.selected,null);c.window.location.hash='#idioms';c.exports.sync();assert.equal(c.selected,null);
for(const text of ['aria-labelledby={titleId}','id={titleId}','ref={dialogRef}','ref={closeRef}','closeRef.current?.focus()','event.shiftKey','first.focus()','opener?.isConnected',"document.removeEventListener('keydown', trap)"])assert.ok(source.includes(text),text);
console.log('Phrase detail clears unmatched deep-link selection; named modal starts/traps/restores keyboard focus: PASS');
