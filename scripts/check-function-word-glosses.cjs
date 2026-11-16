const fs=require('fs'),assert=require('assert/strict');
const source=JSON.parse(fs.readFileSync('public/data/vocab/chunks/r00001-00100.json'));const byId=Object.fromEntries(source.map(e=>[e.id,e]));
const fixes={'voc-w00004':'von / aus','voc-w00013':'dies / dieser / diese / dieses','voc-w00020':'nicht','voc-w00025':'wir','voc-w00039':'was','voc-w00042':'tun / machen','voc-w00047':'welcher / welche / welches','voc-w00057':'sie / ihnen'};
for(const file of fs.readdirSync('public/data/vocab/i18n').filter(f=>f.endsWith('.json'))){const d=JSON.parse(fs.readFileSync('public/data/vocab/i18n/'+file));for(const id of ['voc-w00004','voc-w00013','voc-w00020']){assert.equal(d[id].m,file==='de.json'?fixes[id]:byId[id].meaningAr);assert.ok(d[id].e);}if(file==='de.json')for(const [id,m] of Object.entries(fixes))assert.equal(d[id].m,m);}
console.log('German8 dictionary-grounded function-word fixes;3corrupt meanings fallback to original Arabic across other27locales, examples preserved: PASS');

const de=JSON.parse(fs.readFileSync('public/data/vocab/i18n/de.json'));
const verbs={"voc-w00014": "sein", "voc-w00017": "haben", "voc-w00021": "von / durch / mit / bei / neben / bis", "voc-w00033": "können", "voc-w00035": "mögen / wie / ähnlich", "voc-w00040": "wann / wenn / als", "voc-w00050": "würde / würden (je nach Person und Kontext)"};
for(const [id,m] of Object.entries(verbs))assert.equal(de[id].m,m);
