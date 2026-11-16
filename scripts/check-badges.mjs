import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const catalog=JSON.parse(readFileSync(new URL('../shared/badges.json',import.meta.url),'utf8'));
assert.equal(catalog.length,86);
assert.equal(new Set(catalog.map(b=>b.id)).size,86);
assert.equal(new Set(catalog.map(b=>b.category)).size,11);
for(const lang of ['ar','en','de']) {
 const messages=JSON.parse(readFileSync(new URL(`../src/i18n/locales/${lang}.json`,import.meta.url),'utf8'));
 for(const b of catalog)for(const key of [b.titleKey,b.descriptionKey,'badges.category.'+b.category,'badges.tier.'+b.tier])assert.ok(messages[key],`${lang}: ${key}`);
 for(const [key,value] of Object.entries(messages).filter(([key])=>key.startsWith('badges.')))assert.equal(/\p{Extended_Pictographic}/u.test(value),false,`${lang}: ${key} contains emoji`);
}
console.log('PASS 86 unique medals, 11 categories, complete ar/en/de badge keys, no emoji');
