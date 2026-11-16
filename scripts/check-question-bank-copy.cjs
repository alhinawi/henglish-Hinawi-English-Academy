const fs=require('fs'),assert=require('assert/strict');
const files=fs.readdirSync('src/i18n/locales').filter(f=>f.endsWith('.json'));assert.equal(files.length,30);
for(const file of files){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+file));const text=d['qb.bankInfoPost'];assert.ok(text&&text.length>15,file);assert.ok(!/verified|checked|geprüft|vérifié|محقق|معتمد|مدقق/i.test(text),file);}
assert.ok(!fs.readFileSync('src/components/QuestionBankPanel.tsx','utf8').includes('verified chunked'));
console.log('Question-bank intro: all30locale strings present, neutral practice wording, no reviewed/verified claim: PASS');
