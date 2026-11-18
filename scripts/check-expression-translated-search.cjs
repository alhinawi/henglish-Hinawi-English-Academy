const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/components/vocabulary/ExpressionsTab.tsx','utf8');
const filter=source.slice(source.indexOf('  const filtered = useMemo('),source.indexOf('\n  const totalMatches ='));
const entries=JSON.parse(fs.readFileSync('public/data/expressions.json','utf8'));
for(const lang of ['de','fr','es']){
 const txMap=JSON.parse(fs.readFileSync('public/data/expressions/i18n/'+lang+'.json','utf8'));
 const first=entries.find(row=>txMap[row.id]?.m&&txMap[row.id]?.e);
 assert(first);
 const match=(query,category='all',cefr='all',map=txMap)=>{
  const ctx={exports:{},expressions:entries,searchQuery:query,selectedCategory:category,selectedCefr:cefr,txMap:map,useMemo:fn=>fn(),txMeaning:(m,id,fallback)=>m?.[id]?.m??fallback,txExample:(m,id,fallback)=>m?.[id]?.e??fallback};
  vm.runInNewContext(filter+'exports.matches=filtered;',ctx);return ctx.exports.matches;
 };
 for(const query of [txMap[first.id].m,txMap[first.id].e,first.expression,first.meaningAr,first.definitionEn,first.exampleEn,first.exampleAr]){
  if(!query)continue;
  const found=match('  '+query.toUpperCase()+'  ');
  assert(found.some(row=>row.id===first.id),lang+': '+query);
 }
 assert.equal(match('   ').length,entries.length);
 assert.equal(match(txMap[first.id].m,'not-a-category').length,0);
 assert.equal(match(txMap[first.id].m,'all','not-a-level').length,0);
 assert(match(first.meaningAr,'all','all',null).some(row=>row.id===first.id));
}
assert(filter.includes('selectedCefr, txMap]'));
console.log('Actual Expressions filter searches displayed German/French/Spanish meanings/examples and original English/Arabic text, ignores pasted spaces/case, preserves category/level scopes and reacts when the locale overlay loads: PASS');
