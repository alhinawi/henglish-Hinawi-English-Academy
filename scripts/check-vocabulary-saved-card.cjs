const fs=require('fs'),assert=require('assert/strict');
const card=fs.readFileSync('src/components/vocabulary/WordCard.tsx','utf8');
const explorer=fs.readFileSync('src/components/vocabulary/VocabularyExplorer.tsx','utf8');
assert.ok(card.includes('setSaved(isWordSaved(entry.headword));'));
assert.ok(card.includes('[entry.headword, savedVersion]'));
assert.equal((card.match(/aria-pressed=\{saved\}/g)||[]).length,2);
assert.ok(explorer.includes('savedVersion={savedUpdateCount}'));
assert.ok(explorer.includes('onWordSavedChange={() => setSavedUpdateCount(c => c + 1)}'));
console.log('Vocabulary grid/list save state follows detail-modal mutations and exposes pressed state: PASS');
