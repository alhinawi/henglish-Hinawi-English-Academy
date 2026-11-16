const fs=require('fs'),assert=require('assert/strict');
const s=fs.readFileSync('src/components/translation/VocabularyHistoryTab.tsx','utf8');
assert.equal((s.match(/<bdi dir="ltr" className="whitespace-nowrap">\(\{(?:historyItems|vocabCards)\.length\}\)<\/bdi>/g)||[]).length,3);
console.log('Both translation tabs and All Words chip isolate parenthesized counts: PASS');
