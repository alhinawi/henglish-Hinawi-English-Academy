const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const c={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/services/writingFeedback.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,c);const f=c.exports.writingFeedback;
for(const value of [null,undefined,{},[],false,42,'raw', {text:''},{text:'  '},{text:42},{text:{}},{response:[]},{text:true,response:false}])assert.equal(f(value),null);
assert.equal(f({text:'  Real analysis  '}),'Real analysis');assert.equal(f({response:' Legacy result '}),'Legacy result');assert.equal(f({text:{},response:'Usable alternative'}),'Usable alternative');assert.equal(f({text:'  ',response:'Fallback field'}),'Fallback field');assert.equal(f({text:'Primary',response:'Secondary'}),'Primary');
const view=fs.readFileSync('src/views/WritingAcademyPage.tsx','utf8');assert.ok(view.indexOf('if (!feedbackText)')<view.indexOf("playSound('correct')"));assert.ok(view.includes("setSubmissionFeedback(t('wa.feedback.unavailable'));\n        return;"));console.log('Empty/malformed writing response never treated as usable feedback; string contracts preserved: PASS');

assert.ok(view.includes('signal: controller.signal'));
assert.ok((view.match(/if \(!isCurrent\(\)\) return;/g)||[]).length>=3);
assert.equal((view.match(/invalidateAnalysis\(\);/g)||[]).length,8); // submit + 5 templates + input + import
assert.ok(view.includes('if (isCurrent()) {\n        analysisController.current = null;\n        setIsAnalyzing(false);'));
assert.ok(view.includes('useEffect(() => () => {\n    analysisVersion.current += 1;\n    analysisController.current?.abort();'));
console.log('Writing analysis canceled/invalidated on edits, imports, templates and unmount; stale results/errors/finally ignored: PASS');
