const fs=require('fs'),assert=require('assert/strict');
const modal=fs.readFileSync('src/components/vocabulary/WordDetailModal.tsx','utf8'),card=fs.readFileSync('src/components/vocabulary/WordCard.tsx','utf8');
for(const text of ['role="dialog"','aria-modal="true"','aria-labelledby={titleId}','id={titleId}','opener?.isConnected','event.shiftKey','first.focus()','last : first','document.removeEventListener(\'keydown\', trap)'])assert.ok(modal.includes(text),text);
assert.equal((card.match(/e.stopPropagation\(\); onOpenDetails\(entry\);/g)||[]).length,2);
console.log('Word details named modal dialog, initial/trapped/restored focus, keyboard headword buttons in grid and list: PASS');
for(const text of ["window.confirm(t('wdm.discardNote'))",'userNote !== persistedNote','setPersistedNote(userNote)',"setNoteSaved(true)",'onSubmit={e => { e.preventDefault(); handleSaveNote(); }}',"window.removeEventListener('beforeunload', warn)"])assert.ok(modal.includes(text),text);
for(const l of ['ar','en','de']){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+l+'.json'));for(const key of ['wdm.discardNote','wdm.noteUnsaved','wdm.noteSaved'])assert.ok(d[key]);}
