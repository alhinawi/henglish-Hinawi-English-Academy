const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const source=fs.readFileSync('src/views/GrammarLessonPage.tsx','utf8');
const wrapper=source.slice(source.indexOf('export const GrammarLessonPage:'),source.indexOf('const ResolvedGrammarLesson:'));
let navigation=[],completed=[];const c={exports:{},useLanguage:()=>({t:k=>k}),ALL_GRAMMAR_RULES:[{id:'known'}],ResolvedGrammarLesson:{},React:{createElement:(type,props,...children)=>({type,props,children})}};
vm.runInNewContext(ts.transpileModule(wrapper,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React}}).outputText,c);
const props={onNavigate:r=>navigation.push(r),onMarkComplete:r=>completed.push(r)};
const missing=c.exports.GrammarLessonPage({...props,ruleId:'unknown'});assert.equal(missing.type,'section');assert.equal(missing.children[0].children[0],'gl.notFoundTitle');missing.children[2].props.onClick();assert.deepEqual(navigation,['grammar']);assert.deepEqual(completed,[]);
const valid=c.exports.GrammarLessonPage({...props,ruleId:'known'});assert.equal(valid.type,c.ResolvedGrammarLesson);assert.equal(valid.props.rule.id,'known');assert.equal(valid.props.key,'known');assert.equal(valid.props.onMarkComplete,props.onMarkComplete);
assert.ok(!source.includes('|| ALL_GRAMMAR_RULES[0]'));
for(const lang of ['ar','en','de']){const d=JSON.parse(fs.readFileSync('src/i18n/locales/'+lang+'.json'));for(const k of ['gl.notFoundTitle','gl.notFoundBody'])assert.ok(d[k]);}
console.log('Unknown grammar link cannot render/complete an unrelated rule; valid lesson identity and callbacks preserved; localized recovery: PASS');
