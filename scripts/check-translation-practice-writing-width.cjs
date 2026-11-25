const fs=require('fs'),a=require('node:assert/strict'),s=fs.readFileSync('src/components/translation/PracticeModeTab.tsx','utf8');
a.equal((s.match(/bg-\[#080619\] px-2 py-4 sm:px-4 text-base leading-8 text-white/g)||[]).length,2);
for(const v of ['id="translation-practice-draft"','id="translation-practice-revision"','maxLength={3000}','value={drafts[challenge.id]','value={revisions[challenge.id]'])a(s.includes(v));
console.log('Translation draft/revision horizontal8px mobile, vertical16px/desktop16px retained; independent fields/3000limit unchanged PASS');
