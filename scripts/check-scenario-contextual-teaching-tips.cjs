const fs = require('fs');
const assert = require('node:assert/strict');
const rows = require('./fixtures/scenario-contextual-teaching-tips.json');
const data = JSON.parse(fs.readFileSync('src/data/realLifeSimulationsData.ts', 'utf8').split('export const REAL_LIFE_SCENARIOS: SimulationScenario[] = ')[1].trim().replace(/;$/, ''));
assert.equal(data.length, 9);
assert.equal(data.flatMap(s => s.turns).filter(t => t.grammarTipAr).length, 26);
assert.equal(rows.length, 14);
for (const row of rows) {
  const [scenario, turn] = row.key.split(':');
  assert.equal(data.find(s => s.id === scenario).turns.find(t => t.id === turn).grammarTipAr, row.ar);
}
const locales = fs.readdirSync('public/data/app-i18n/realLifeSimulationsData');
assert.equal(locales.length, 29);
for (const locale of locales) {
  const overlay = JSON.parse(fs.readFileSync(`public/data/app-i18n/realLifeSimulationsData/${locale}`, 'utf8'));
  for (const row of rows) {
    const value = overlay[row.ar];
    assert.equal(typeof value, 'string', locale + row.key);
    assert(value.length > 20 && value !== row.ar, locale + row.key);
    for (const example of row.ar.match(/"[^"]+"/g) || []) assert(value.includes(example.slice(1, -1)), locale + row.key + example);
    assert(!Object.keys(overlay).some(k => k.replace(/\\"/g, '"') === row.old), locale + row.key + ' stale alias');
  }
}
console.log('14 contextual tips/9 scenarios;29 localized overlays, English examples retained, no obsolete key aliases: PASS');
