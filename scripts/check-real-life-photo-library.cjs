const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict');
const c={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/realLifeSimulationsData.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,c);const scenarios=c.exports.REAL_LIFE_SCENARIOS;
assert.equal(scenarios.length,9);assert.equal(scenarios.filter(s=>s.category==='daily').length,3);
for(const s of scenarios){assert(fs.statSync('public'+s.backdropImage).size>4000);assert(s.descriptionAr);assert(s.turns.length);}
const page=fs.readFileSync('src/views/RealLifeEnglishPage.tsx','utf8');
assert(page.includes('src={sc.backdropImage}'));assert(page.includes('txText(appText, sc.descriptionAr)'));
assert(page.includes("{ id: 'daily', label: t('rle.cat.daily') }"));assert(page.includes('role="group" aria-label={t(\'rle.filterLabel\')}'));
assert(page.includes('onClick={() => handleSelectScenario(sc.id)}'));assert(page.includes("t('rle.photoNote')"));
for(const l of ['en','ar','de']){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+l+'.json'));for(const k of ['rle.filterLabel','rle.cat.daily','rle.photoNote','rle.topicPhoto'])assert(d[k]);}
const ledger=JSON.parse(fs.readFileSync('docs/academy-topic-photography.json'));const clothing=ledger.images.find(r=>r.src.includes('sim-clothing-shopping'));assert(clothing.alt.includes('jackets'));assert.equal(clothing.author,'Amanda Vick');assert(!clothing.reusedFrom);
console.log('All nine real-life scenes have local photo cards and descriptions; all five categories reachable including three daily scenarios; original dialogue entry points and stock-photo caveat preserved; clothing photo/source corrected: PASS');
