const fs=require('fs'),a=require('node:assert/strict'),s=fs.readFileSync('src/components/SpeakingTransferPractice.tsx','utf8');
a(s.includes('bg-[#0c0b20] px-2 py-4 sm:px-4 text-base leading-8'));
for(const v of ['id="speaking-transfer-plan"','dir="auto"','maxLength={1500}','setPlan(\'\')','value={plan}'])a(s.includes(v));
console.log('Speaking follow-up plan horizontal8px mobile,vertical16px/desktop16px retained;1500limit/autodirection/reset unchanged PASS');
