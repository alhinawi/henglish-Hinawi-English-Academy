const fs=require('fs'),assert=require('assert/strict');const s=fs.readFileSync('src/components/vocabulary/AdminVocabularyModal.tsx','utf8');
for(const x of ['37,636','37,223','>5,000<','>10,000<','loadVocabularyManifest',"t('avm.standard1')","t('avm.standard2')","t('avm.standard3')"])assert.ok(!s.includes(x),x);
for(const x of ['loadFullVocabulary().then(words','words: words.length','words.filter(w => !!w.audioUsUrl).length','words.filter(w => !!w.audioUkUrl).length','Object.entries(stats.levels)',"t('ev.loadError')","t('vx.loading')"])assert.ok(s.includes(x),x);
console.log('Vocabulary stats derive from actual loaded explorer entries, no fixed/manifest or blanket sourcing claims, honest loading/error: PASS');
