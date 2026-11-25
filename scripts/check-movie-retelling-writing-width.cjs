const fs=require('fs'),a=require('node:assert/strict'),s=fs.readFileSync('src/components/MoviePrivateRetelling.tsx','utf8');
a(s.includes('bg-[#0c0b20] px-2 py-4 sm:px-4 text-base leading-8'));
for(const v of ['id="movie-retelling-draft"','lang="en" dir="ltr"','maxLength={1500}','value={draft}','setFirstDraft(draft)'])a(s.includes(v));
console.log('Film retelling input horizontal8px mobile,vertical16px/desktop16px retained;English1500limit/retrysnapshot unchanged PASS');
