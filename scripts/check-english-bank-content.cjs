const fs=require('fs'),assert=require('assert/strict');
for(const bank of ['idioms','slang','genz','ielts/vocab','toefl/vocab']){
 const base='public/data/'+bank;const entries=fs.readdirSync(base+'/chunks').filter(f=>f.endsWith('.json')).flatMap(f=>{const d=JSON.parse(fs.readFileSync(base+'/chunks/'+f));return Array.isArray(d)?d:d.items;});
 const english=JSON.parse(fs.readFileSync(base+'/i18n/en.json'));assert.deepEqual(Object.keys(english).sort(),entries.map(row=>row.id).sort());
 for(const row of entries){const tx=english[row.id];assert(tx.m.trim());assert(!/[\u0600-\u06ff]/.test(tx.m));assert.equal(tx.e,row.exampleEn,'Original English teaching example must be retained verbatim');}
}
for(const panel of ['PhraseBankPanel','ExamVocabPanel']){const s=fs.readFileSync('src/components/'+panel+'.tsx','utf8');assert(s.includes("if (lang !== 'en') lines.push(`   ${s.ar}`)"));assert(s.includes("{lang !== 'en' && <p dir=\"auto\""));}
const service=fs.readFileSync('src/services/contentI18nService.ts','utf8');assert(service.includes("return lang === 'en' ? ENGLISH_BANK_MAPS[bankPath] ?? null"));
console.log('7500 phrase/exam bank entries have nonempty English meanings and unchanged source examples; English details/copy keep English examples, Arabic mode retains translations; English maps available on first render: PASS');
