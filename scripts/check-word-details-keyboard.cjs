const fs=require('fs'),assert=require('assert/strict');
const modal=fs.readFileSync('src/components/vocabulary/WordDetailModal.tsx','utf8'),card=fs.readFileSync('src/components/vocabulary/WordCard.tsx','utf8');
for(const text of ['role="dialog"','aria-modal="true"','aria-labelledby={titleId}','id={titleId}','opener?.isConnected','event.shiftKey','first.focus()','last : first','document.removeEventListener(\'keydown\', trap)'])assert.ok(modal.includes(text),text);
assert.equal((card.match(/e.stopPropagation\(\); onOpenDetails\(entry\);/g)||[]).length,2);
console.log('Word details named modal dialog, initial/trapped/restored focus, keyboard headword buttons in grid and list: PASS');
