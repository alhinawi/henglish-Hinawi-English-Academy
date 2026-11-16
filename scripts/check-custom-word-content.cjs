const fs=require('fs'),assert=require('assert/strict');
const admin=fs.readFileSync('src/components/vocabulary/AdminVocabularyModal.tsx','utf8'),detail=fs.readFileSync('src/components/vocabulary/WordDetailModal.tsx','utf8');
for(const fake of ['Refers to ${','Understanding ${','`/${headword}/`','`/${item.headword}/`',"t('avm.exampleFallback')"]){assert.ok(!admin.includes(fake),fake);}
for(const supplied of ['ipaUs: ipaUs.trim(),','ipaUk: ipaUk.trim(),','definitionEn: definitionEn.trim(),','exampleEn: exampleEn.trim(),','exampleAr: exampleAr.trim(),'])assert.ok(admin.includes(supplied));
assert.ok(fs.readFileSync('src/services/vocabularyImport.ts','utf8').includes("field('cefr') || 'Unclassified'"));
assert.ok(!admin.includes("pos: item.pos || 'noun'"));
assert.ok(!admin.includes("frequencyTier: 'academic'"));
assert.ok(detail.includes('(entry.exampleEn?.trim() || shownExample?.trim()) &&'));
console.log('Custom add/import keep absent optional IPA/definition/examples empty; details omit absent examples: PASS');
