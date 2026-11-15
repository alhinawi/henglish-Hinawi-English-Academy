// Keep grammar lesson badges aligned with the shared CEFR presentation map.
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const labels = Object.fromEntries([...readFileSync('src/utils/levels.ts', 'utf8').matchAll(/^  ([ABC][12]): '([^']+)',/gm)].slice(0, 6).map(m => [m[1], m[2]]));
const grammar = readFileSync('src/data/allGrammarRules.ts', 'utf8');
let count = 0;
for (const match of grammar.matchAll(/^    level: '([ABC][12]) - ([^']+)'/gm)) {
  assert.equal(match[2], labels[match[1]], `Nonstandard grammar badge: ${match[0]}`);
  count++;
}
assert.equal(count, 59, 'Expected every grammar lesson to have a level badge');
for (const file of ['src/data/allGrammarRules.ts', 'src/views/AdminDashboardPage.tsx', 'src/views/QuizzesPage.tsx', 'src/views/SentencesLibraryPage.tsx']) {
  assert.doesNotMatch(readFileSync(file, 'utf8'), /A2 - (?:تأسيسي|فوق المبتدئ)|B2 [-•] فوق متوسط(?!ا)/, file);
}
console.log(`CEFR badge checks passed (${count} grammar lessons and 4 presentation files).`);
