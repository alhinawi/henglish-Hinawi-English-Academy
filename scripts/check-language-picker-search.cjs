const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/components/translation/LanguageSelector.tsx','utf8');
const filter=source.slice(source.indexOf('  const matchesLanguage ='),source.indexOf('\n  const handleSwapClick'));
const data={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/types/translation.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,data);
for(const locale of ['ar','en','de','fr','tr']){
 const translations=JSON.parse(fs.readFileSync('src/i18n/locales/'+locale+'.json','utf8'));
 const run=(query)=>{
  const c={exports:{},SUPPORTED_LANGUAGES:data.exports.SUPPORTED_LANGUAGES,t:key=>translations[key]??key,searchSource:query,searchTarget:query};
  vm.runInNewContext(ts.transpileModule(filter+'\nexports.source=filteredSourceLanguages;exports.target=filteredTargetLanguages;', {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,c);return c.exports;
 };
 for(const language of data.exports.SUPPORTED_LANGUAGES){
  for(const query of [language.code,language.nameEn,translations[language.nameAr]]){
   if(!query)continue;
   const result=run('  '+query.toUpperCase()+'  ');
   assert(result.source.some(row=>row.code===language.code),locale+':'+query);
   assert.equal(result.target.some(row=>row.code===language.code),language.code!=='auto');
  }
 }
 assert.equal(run('  ').source.length,data.exports.SUPPORTED_LANGUAGES.length);
 assert.equal(run('  ').target.length,data.exports.SUPPORTED_LANGUAGES.length-1);
 assert.equal(run('not-a-language-zzz').source.length,0);
 assert.equal(run('not-a-language-zzz').target.length,0);
}
assert(source.includes('relative z-20 flex flex-col min-[360px]:flex-row'));
assert(source.includes("dir === 'rtl' ? 'right-0' : 'left-0'"));
assert(source.includes("dir === 'rtl' ? 'left-0' : 'right-0'"));
assert(source.includes('filteredSourceLanguages.length === 0'));
assert(source.includes('filteredTargetLanguages.length === 0'));
assert.equal(source.split("aria-label={t('tl.searchLang')}").length-1,2);
console.log('Translation source/target language search trims pasted spaces,ignores case,matches displayed names/English/codes,keeps auto source-only and announces empty results: PASS');
