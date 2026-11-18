const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const registry={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/i18n/languages.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,registry);
const c={exports:{},require:()=>registry.exports};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/i18n/initialLanguage.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,c);const pick=c.exports.initialUiLanguage;
for(const locale of ['ar','ar-EG','ar-SA','AR_ma'])assert.equal(pick(null,null,locale),'ar');
for(const locale of ['en-US','de-DE','fr','es-MX','ur-PK'])assert.equal(pick(null,null,locale),'en');
for(const locale of [undefined,'',' ', '???'])assert.equal(pick(null,null,locale),'ar');
assert.equal(pick(null,'ar','en-US'),'ar');assert.equal(pick(null,'en','ar-EG'),'en');assert.equal(pick(null,'de','ar-EG'),'de');assert.equal(pick('fr','ar','ar-EG'),'fr');assert.equal(pick('bad','bad','ar-EG'),'ar');assert.equal(pick(null,'bad','en-US'),'en');
const provider=fs.readFileSync('src/i18n/LanguageContext.tsx','utf8');assert(provider.includes('STATIC[lang] ?? STATIC[FALLBACK_LANG]'));assert(!provider.includes('localStorage.setItem(STORAGE_KEY, lang)'));assert(provider.includes('localStorage.setItem(STORAGE_KEY, code)'));
console.log('First visit defaults Arabic for Arabic/no browser signal,English for other locales;valid URL and saved explicit choices override;invalid storage ignored,automatic detection not persisted: PASS');
