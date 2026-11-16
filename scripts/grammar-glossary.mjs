/** Deterministic, source-backed grammar labels. Run after translation emission.
 * --check detects drift without editing. No locale keys or source content change.
 */
import fs from 'node:fs';
import ts from 'typescript';
const check=process.argv.includes('--check');
const templatePath='scripts/i18n/grammar-heading-templates.json';
const templates=fs.existsSync(templatePath)?JSON.parse(fs.readFileSync(templatePath,'utf8')):{};
const requiredTemplates=new Set();
const glossary=JSON.parse(fs.readFileSync('scripts/i18n/grammar-glossary.json','utf8'));
const aliases=[];
for(const [id,t] of Object.entries(glossary.terms)){
 for(const a of [t.english,...t.aliases])aliases.push({id,a});
 for(const lang of glossary.languages){
  const v=t.locales[lang];if(!v?.term||!v?.source||!['sourced-label','canonical-english'].includes(v.status))throw Error(`Invalid glossary ${id}/${lang}`);
 }
}
aliases.sort((a,b)=>b.a.length-a.a.length);
const escaped=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const matcher=new RegExp(`\\b(?:${aliases.map(x=>escaped(x.a)).join('|')})\\b`,'gi');
const lookup=new Map(aliases.map(x=>[x.a.toLowerCase(),x.id]));
function heading(english,lang){
 const terms=[];
 const masked=english.replace(matcher,s=>{const token=`QQ${terms.length}QQ`;terms.push({id:lookup.get(s.toLowerCase()),matched:s});return token;});
 if(!terms.length)return null;
 requiredTemplates.add(masked);
 let text=templates[lang]?.[masked]??masked;
 for(let i=0;i<terms.length;i++){
  if(!text.includes(`QQ${i}QQ`))throw Error(`Lost glossary token: ${lang}/${english}`);
  // Dictionary labels are citation forms, not inflected phrases. In compound
  // headings keep the canonical English phrase so plural/case agreement is not fabricated.
  const exact=english.trim().toLowerCase()===terms[i].matched.toLowerCase();
  text=text.replaceAll(`QQ${i}QQ`,exact?glossary.terms[terms[i].id].locales[lang].term:terms[i].matched);
 }
 return text;
}
const path='src/data/allGrammarRules.ts';const sf=ts.createSourceFile(path,fs.readFileSync(path,'utf8'),ts.ScriptTarget.Latest,true);const titles=[];
function visit(n){
 if(ts.isObjectLiteralExpression(n)){
  const r={};for(const p of n.properties)if(ts.isPropertyAssignment(p)&&p.name&&ts.isStringLiteralLike(p.initializer))r[p.name.getText(sf)]=p.initializer.text;
  if(r.titleAr&&r.titleEn)titles.push(r);
 }
 ts.forEachChild(n,visit);
}
visit(sf);
const previous=fs.existsSync('scripts/i18n/grammar-overrides.json')?JSON.parse(fs.readFileSync('scripts/i18n/grammar-overrides.json','utf8')):{};
const en=JSON.parse(fs.readFileSync('src/i18n/locales/en.json','utf8'));
let changes=0,protectedTitles=0,protectedUi=0;const overrides={};
function write(path,dict){fs.writeFileSync(path,JSON.stringify(dict,null,path.startsWith('public/data/')?0:2)+(path.startsWith('public/data/')?'':'\n'));}
for(const lang of glossary.languages){
 const appPath=`public/data/app-i18n/allGrammarRules/${lang}.json`,uiPath=`src/i18n/locales/${lang}.json`;
 const app=JSON.parse(fs.readFileSync(appPath,'utf8')),ui=JSON.parse(fs.readFileSync(uiPath,'utf8'));const appOverride={},uiOverride={};
 for(const r of titles){const v=heading(r.titleEn,lang);if(v){appOverride[r.titleAr]=v;protectedTitles++;}}
 for(const [k,v] of Object.entries(en)){
  if(k.startsWith('grammar.item.')||k.startsWith('header.quickLesson.')||aliases.some(a=>a.a.toLowerCase()===v.toLowerCase())){const term=heading(v,lang);if(term){uiOverride[k]=term;protectedUi++;}}
 }
 for(const [dict,expected] of [[app,check?(previous[lang]?.app??{}):appOverride],[ui,check?(previous[lang]?.ui??{}):uiOverride]])for(const [k,v] of Object.entries(expected))if(dict[k]!==v){changes++;dict[k]=v;}
 overrides[lang]={app:appOverride,ui:uiOverride};
 if(!check){write(appPath,app);write(uiPath,ui);}
}
if(!check)write('scripts/i18n/grammar-overrides.json',overrides);
// Check only already-protected fields: a new extraction key must not block other work.
console.log(`Grammar glossary: ${glossary.languages.length} languages, ${Object.keys(glossary.terms).length} concepts, ${protectedTitles} title fields, ${protectedUi} UI fields; ${changes} ${check?'drifted':'updated'}`);
if(check&&changes)process.exit(1);

if(process.argv.includes('--export-templates'))fs.writeFileSync('/tmp/grammar-required-templates.json',JSON.stringify([...requiredTemplates]));
