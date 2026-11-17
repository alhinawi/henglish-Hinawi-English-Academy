const fs=require('fs'),assert=require('assert/strict');
const modal=fs.readFileSync('src/components/vocabulary/WordDetailModal.tsx','utf8'),card=fs.readFileSync('src/components/vocabulary/WordCard.tsx','utf8');
for(const text of ['role="dialog"','aria-modal="true"','aria-labelledby={titleId}','id={titleId}','opener?.isConnected','event.shiftKey','first.focus()','last : first','document.removeEventListener(\'keydown\', trap)'])assert.ok(modal.includes(text),text);
assert.equal((card.match(/e.stopPropagation\(\); onOpenDetails\(entry\);/g)||[]).length,2);
console.log('Word details named modal dialog, initial/trapped/restored focus, keyboard headword buttons in grid and list: PASS');
for(const text of ["window.confirm(t('wdm.discardNote'))",'userNote !== persistedNote','setPersistedNote(userNote)',"setNoteSaved(true)",'onSubmit={e => { e.preventDefault(); handleSaveNote(); }}',"window.removeEventListener('beforeunload', warn)"])assert.ok(modal.includes(text),text);
for(const l of ['ar','en','de']){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+l+'.json'));for(const key of ['wdm.discardNote','wdm.noteUnsaved','wdm.noteSaved'])assert.ok(d[key]);}

const manager=fs.readFileSync('src/components/vocabulary/AdminVocabularyModal.tsx','utf8');
for(const text of ['role="dialog"','aria-modal="true"','aria-labelledby={titleId}','id={titleId}',"aria-label={t('fs.close')}",'closeRef.current?.focus()','event.shiftKey','first.focus()','opener?.isConnected',"document.removeEventListener('keydown', trap)","event.key === 'Escape'"])assert.ok(manager.includes(text),text);
console.log('Vocabulary management named modal, labelled close, initial/trapped/restored focus and Escape: PASS');

for(const field of ['headword','meaningAr','cefr','pos','ipaUs','ipaUk','definitionEn','exampleEn','exampleAr','bulkData']){assert.ok(manager.includes('htmlFor={`${titleId}-'+field+'`}'),field+' label');assert.ok(manager.includes('id={`${titleId}-'+field+'`}'),field+' control');}
assert.ok(manager.includes("role={bulkOk ? 'status' : 'alert'}"));
console.log('Vocabulary authoring controls have explicit label bindings; import/add feedback is announced: PASS');

for(const [file,prefix,state,option] of [['VocabularyExplorer','vx','selectedCefr','c'],['ExpressionsTab','ex','selectedCategory','cat']]){
 const src=fs.readFileSync('src/components/vocabulary/'+file+'.tsx','utf8');
 for(const text of ["aria-label={t('"+prefix+".searchPlaceholder')}","aria-label={t('se.clear')}",'searchRef.current?.focus()','aria-pressed={'+state+' === '+option+'.id}'])assert.ok(src.includes(text),file+': '+text);
}
console.log('Vocabulary/expression search naming, clear focus restoration and selected chips: PASS');

const explorer=fs.readFileSync('src/components/vocabulary/VocabularyExplorer.tsx','utf8');
for(const text of ['role="dialog"','aria-modal="true"','aria-labelledby={filterTitleId}','filterCloseRef.current?.focus()',"event.key === 'Escape'","document.removeEventListener('keydown', handleKey)",'aria-pressed={selectedLetter === l}','aria-pressed={selectedPos === p.id}'])assert.ok(explorer.includes(text),text);
for(const field of ['selectedDomain','selectedFrequency','sortBy']){assert.ok(explorer.includes('htmlFor={`${filterTitleId}-'+field+'`}'));assert.ok(explorer.includes('id={`${filterTitleId}-'+field+'`}'));}
console.log('Word explorer filter sheet is named, keyboard-modal with focus restoration, labelled selects and pressed options: PASS');
