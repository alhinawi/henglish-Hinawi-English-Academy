const fs = require('fs'), vm = require('vm'), ts = require('typescript'), assert = require('assert/strict');
const source = fs.readFileSync('src/views/SpeakingAcademyPage.tsx', 'utf8');
const wrapper = source.slice(source.indexOf('export const SpeakingAcademyPage:'), source.indexOf('const LearnerSpeakingAcademy:'));
let user = {id: 'learner-a'};
const c = {exports: {}, useAuth: () => ({user}), LearnerSpeakingAcademy: {}, React: {createElement: (type, props) => ({type, props})}};
vm.runInNewContext(ts.transpileModule(wrapper, {compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React}}).outputText, c);
const props = {onNavigate() {}, completedActivityIds: []};
const a = c.exports.SpeakingAcademyPage(props);user = {id: 'learner-b'};
const b = c.exports.SpeakingAcademyPage(props);user = {id: 'learner-a'};
const again = c.exports.SpeakingAcademyPage(props);
assert.notEqual(a.props.key, b.props.key);assert.equal(a.props.key, again.props.key);
assert.equal(a.props.storageKey, 'henglish-speaking-v1:learner-a');assert.equal(b.props.storageKey, 'henglish-speaking-v1:learner-b');
assert.equal(a.type, c.LearnerSpeakingAcademy);assert.equal(a.props.completedActivityIds, props.completedActivityIds);
for (const state of ['localDone', 'activeId', 'saveError']) assert.ok(source.indexOf(`const [${state}`) > source.indexOf('const LearnerSpeakingAcademy:'));
console.log('Speaking page remounts learner-local completion, active practice and recorder state on identity change; existing storage keys preserved: PASS');

const finishSource=source.slice(source.indexOf('  function finish()'),source.indexOf('  const open ='));
let raw=null,failRead=false,failWrite=false,doneUpdates=0,awards=0,error='';
const finishContext={exports:{},active:{id:'lesson-new'},done:['lesson-old'],storageKey:'owner',Set,JSON,Error,t:key=>key,localStorage:{getItem:()=>{if(failRead)throw Error('denied');return raw},setItem:(_,value)=>{if(failWrite)throw Error('quota');raw=value}},setDone:()=>doneUpdates++,setSaveError:value=>error=value,onCompleteActivity:()=>awards++};
vm.runInNewContext(ts.transpileModule(finishSource+'exports.finish=finish;',{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,finishContext);
for(const copy of ['bad json','null','{}','[null]','[3]']){raw=copy;finishContext.exports.finish();assert.equal(raw,copy);assert.equal(doneUpdates,0);assert.equal(awards,0);assert.equal(error,'sa.saveError')}
raw='["lesson-old","unknown-preserved"]';failRead=true;finishContext.exports.finish();failRead=false;assert.equal(doneUpdates,0);failWrite=true;finishContext.exports.finish();failWrite=false;assert.equal(awards,0);assert.equal(raw,'["lesson-old","unknown-preserved"]');finishContext.exports.finish();assert.deepEqual(JSON.parse(raw),['lesson-old','unknown-preserved','lesson-new']);assert.equal(awards,1);assert.equal(doneUpdates,1);assert.equal(error,'');console.log('Speaking completion preserves malformed/late-corrupted copies and valid unknown IDs;read/write errors block awards and completion until successful retry: PASS');
