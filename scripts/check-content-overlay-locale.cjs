const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const js=ts.transpileModule(fs.readFileSync('src/services/contentI18nService.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
let lang='de',state=null,effect=null,cleanup=null;
const pending={};const c={exports:{},fetch:url=>new Promise(resolve=>pending[url]=data=>resolve({ok:true,json:async()=>data})),require:p=>p==='react'?{useState:()=>[state,v=>state=v],useEffect:fn=>effect=fn}:{useLanguage:()=>({lang})}};vm.runInNewContext(js,c);
const flush=async()=>{for(let n=0;n<8;n++)await Promise.resolve();};
async function check(hook,first,next,firstUrl,nextUrl){
 state=null;lang='de';assert.equal(hook(first),null);cleanup=effect();pending[firstUrl]({entry:{m:'German'},Quelle:'Deutsch'});await flush();assert.ok(hook(first));
 lang='fr';assert.equal(hook(first),null,'Old locale hidden before effect');cleanup?.();cleanup=effect();
 lang='ar';assert.equal(hook(first),null,'Arabic immediately uses source');cleanup?.();cleanup=effect();pending[nextUrl]({entry:{m:'French'}});await flush();assert.equal(hook(first),null,'Cancelled fetch cannot leak');
 lang='de';assert.equal(hook(next),null,'Old bank/module hidden before effect');cleanup?.();cleanup=effect();
}
(async()=>{
 await check(c.exports.useContentMap,'vocab','phrases','/data/vocab/i18n/de.json','/data/vocab/i18n/fr.json');
 await check(c.exports.useAppTextMap,'module-a','module-b','/data/app-i18n/module-a/de.json','/data/app-i18n/module-a/fr.json');
 lang='en';state=null;c.exports.useAppTextMap('allGrammarRules');cleanup?.();cleanup=effect();
 pending['/data/app-i18n/allGrammarRules/en.json']({'أزمنة المضارع':'Present Tenses'});await flush();assert.equal(c.exports.useAppTextMap('allGrammarRules')['أزمنة المضارع'],'Present Tenses');
 assert.equal(c.exports.needsContentTranslation('en'),false,'English banks remain built-in');
 const grammarContext={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/allGrammarRules.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,grammarContext);
 const english=JSON.parse(fs.readFileSync('public/data/app-i18n/allGrammarRules/en.json','utf8'));
 for(const rule of grammarContext.exports.ALL_GRAMMAR_RULES)for(const field of ['titleAr','category','level'])assert.ok(english[rule[field]]&&!/[\u0600-\u06ff]/.test(english[rule[field]]),rule.id+' '+field);
 console.log('Content/app overlays keyed to locale and bank at render time; source fallback while loading, late cancelled response ignored: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
