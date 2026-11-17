const fs=require('fs'),assert=require('assert/strict');
const card=fs.readFileSync('src/components/SentenceCard.tsx','utf8'),page=fs.readFileSync('src/views/SentencesLibraryPage.tsx','utf8');
assert.ok(card.includes('setSrsRecord(rec);\n    setIsDifficult(isDifficultSentence(sentence.id, learnerId));'));
for(const name of ['isFavorite','isDifficult'])assert.ok(card.includes('aria-pressed={'+name+'}'));
const cards=page.match(/<SentenceCard[\s\S]*?(?:\/>)/g);assert.equal(cards.length,5);
for(const c of cards)assert.ok(/key=\{(?:sentence|dailySentence|weeklySentence|randomSentence)\.id\}/.test(c));
console.log('All5 sentence card locations keyed by identity; review syncs difficult status; toggles expose pressed state: PASS');
