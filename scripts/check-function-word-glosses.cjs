const fs=require('fs'),assert=require('assert/strict');
const source=JSON.parse(fs.readFileSync('public/data/vocab/chunks/r00001-00100.json'));const byId=Object.fromEntries(source.map(e=>[e.id,e]));
const fixes={'voc-w00004':'von / aus','voc-w00013':'dies / dieser / diese / dieses','voc-w00020':'nicht','voc-w00025':'wir','voc-w00039':'was','voc-w00042':'tun / machen','voc-w00047':'welcher / welche / welches','voc-w00057':'sie / ihnen'};
for(const file of fs.readdirSync('public/data/vocab/i18n').filter(f=>f.endsWith('.json'))){const d=JSON.parse(fs.readFileSync('public/data/vocab/i18n/'+file));for(const id of ['voc-w00004','voc-w00013','voc-w00020']){assert.equal(d[id].m,file==='de.json'?fixes[id]:byId[id].meaningAr);assert.ok(d[id].e);}if(file==='de.json')for(const [id,m] of Object.entries(fixes))assert.equal(d[id].m,m);}
console.log('German8 dictionary-grounded function-word fixes;3corrupt meanings fallback to original Arabic across other27locales, examples preserved: PASS');

const de=JSON.parse(fs.readFileSync('public/data/vocab/i18n/de.json'));
const verbs={"voc-w00014": "sein", "voc-w00017": "haben", "voc-w00021": "von / durch / mit / bei / neben / bis", "voc-w00033": "können", "voc-w00035": "mögen / wie / ähnlich", "voc-w00040": "wann / wenn / als", "voc-w00050": "würde / würden (je nach Person und Kontext)"};
for(const [id,m] of Object.entries(verbs))assert.equal(de[id].m,m);

const relations={"voc-w00002": "zu / nach / an / bis", "voc-w00008": "für / seit / denn / weil", "voc-w00018": "an / bei / um / in", "voc-w00034": "gerade / nur / genau / eben", "voc-w00059": "andere / sonstige / weitere", "voc-w00061": "als (beim Vergleich)", "voc-w00063": "nur / lediglich / einzig"};
for(const [id,m] of Object.entries(relations))assert.equal(de[id].m,m);

const earlyMeanings={"voc-w00006": "in / auf / bei / an", "voc-w00066": "ihn / ihm", "voc-w00067": "in (+Akkusativ) / in ... hinein", "voc-w00074": "dann / danach / damals", "voc-w00078": "diese (Plural)", "voc-w00087": "sogar / selbst", "voc-w00090": "brauchen / benötigen", "voc-w00093": "Arbeit / Werk / Tätigkeit"};
for(const [id,m] of Object.entries(earlyMeanings))assert.equal(de[id].m,m);

const sourceFallbacks=['voc-w00066','voc-w00074','voc-w00078','voc-w00087','voc-w00093'];
for(const file of fs.readdirSync('public/data/vocab/i18n').filter(f=>f.endsWith('.json')&&f!=='de.json')){
 const map=JSON.parse(fs.readFileSync('public/data/vocab/i18n/'+file));
 for(const id of sourceFallbacks){assert.equal(map[id].m,byId[id].meaningAr);assert.ok(map[id].e);}
}

const contextualMeanings={"voc-w00009": "dass / der / die / das", "voc-w00010": "du / ihr / Sie", "voc-w00011": "auf / an / bei", "voc-w00065": "erste / erster / erstes", "voc-w00070": "machen / herstellen / zubereiten", "voc-w00076": "Rücken / Rückseite; zurück (Adverb)", "voc-w00092": "richtig / rechts / Recht", "voc-w00098": "gehend (Form von go)", "voc-w00100": "von / ab / weg / aus"};
for(const [id,m] of Object.entries(contextualMeanings))assert.equal(de[id].m,m);
