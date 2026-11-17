const fs=require('fs'),assert=require('assert/strict');
const keys=['va.heroBodyStrong','va.tabExplorer','vx.loading','vx.ofVerified','ev.wordSuffix','pb.verifiedSuffix','ev.emptyHint','pb.emptyHint','pb.idiomsBlurb'];
for(const f of fs.readdirSync('src/i18n/locales').filter(f=>f.endsWith('.json'))){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+f));for(const k of keys){if(k==='pb.idiomsBlurb'&&!d[k])continue;assert.ok(d[k],f+':'+k);assert.ok(!/verified|checked|reviewed|geprüft|vérifié|محقق|موثق|مراجع يدو/i.test(d[k]),f+':'+k);}assert.ok(d['vx.ofVerified'].includes('{n}'));}
for(const file of ['ExamVocabPanel','PhraseBankPanel'])assert.ok(!fs.readFileSync('src/components/'+file+'.tsx','utf8').includes('showVerified'));
console.log('All30locale vocab hero/explorer/exam/phrase copy neutral; counts keep placeholder; no source-review label on translated content: PASS');
