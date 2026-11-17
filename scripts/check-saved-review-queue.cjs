const fs=require('fs'),assert=require('assert/strict');const view=fs.readFileSync('src/components/vocabulary/MyVocabularyTab.tsx','utf8');
assert.ok(!view.includes('reviewIdx'));assert.ok(!view.includes('activeReviewDeck'));assert.ok(view.includes('setReviewQueue(deck.map(item => item.word))'));
assert.ok(view.includes('savedWords.find(item => item.word === reviewQueue[0])'));assert.ok(view.includes('setReviewQueue(queue => queue.slice(1))'));assert.ok(view.includes('setReviewedCount(count => count + 1)'));
assert.ok(view.includes('queue.filter(item => item !== word)'));assert.ok(view.includes('isReviewMode && !currentReviewItem'));assert.ok(view.includes("dueWords.length ? t('mvt.startReview') : t('mvt.practiceSaved')"));
for(const l of ['ar','en','de']){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+l+'.json'));for(const k of ['mvt.practiceSaved','mvt.sessionDone','mvt.sessionCount'])assert.ok(d[k]);}
console.log('Saved-word session snapshots queue, consumes without modulo skips, resets start, handles deletion and honest completion/practice copy: PASS');

for(const text of ['aria-expanded={isFlipped}','aria-controls={isFlipped ? meaningId : undefined}','id={meaningId}',"e.stopPropagation(); playSound('flip'); setIsFlipped(value => !value);"])assert.ok(view.includes(text));
for(const lang of ['ar','en','de']){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+lang+'.json'));for(const k of ['mvt.showMeaning','mvt.hideMeaning'])assert.ok(d[k]);}
console.log('Review meaning reveal/hide is a native keyboard button with expanded state and isolated pointer handling: PASS');
