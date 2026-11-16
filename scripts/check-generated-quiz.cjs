const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
function load(file,extra={}){const c={exports:{},...extra};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,c);return c.exports}
const {parseGeneratedQuiz:parse}=load('src/services/generatedQuiz.ts');
const q={id:'test',type:'multiple-choice',cefrLevel:'B2',topic:'grammar',prompt:'Choose a word',options:['yes','no'],correctAnswerIndex:1,explanationAr:'Explanation',difficulty:'easy'};
const wrap=x=>({questions:x});
for(const data of [null,{},wrap([]),wrap([null]),wrap(['bad'])])assert.throws(()=>parse(data,'grammar','Notes'));
for(const patch of [{prompt:''},{options:['yes']},{options:['yes',' YES ']},{options:['yes',42]},{correctAnswerIndex:undefined},{correctAnswerIndex:null},{correctAnswerIndex:'1'},{correctAnswerIndex:-1},{correctAnswerIndex:2},{correctAnswerIndex:0.5},{difficulty:'x'},{explanationAr:{}},{distractorNotesAr:'bad'}])assert.throws(()=>parse(wrap([{...q,...patch}]),'grammar','Notes'));
const before=JSON.stringify(q),result=parse(wrap([q]),'grammar','Notes');assert.equal(result[0].answer,1);assert.equal(result[0].difficulty,'beginner');assert.equal(JSON.stringify(q),before);
const server=load('server/ai/schemas.ts',{require});
for(const answer of [undefined,null,'1',-1,2,0.5])assert.throws(()=>server.validateQuestionsJson(JSON.stringify([{...q,correctAnswerIndex:answer}])));
assert.equal(server.validateQuestionsJson(JSON.stringify([q]))[0].correctAnswerIndex,1);
const view=fs.readFileSync('src/views/QuizzesPage.tsx','utf8');assert.ok(!view.includes('Date.now()'));assert.ok(view.includes('setAiGeneratedQuestions(null);'));
console.log('Generated quiz: malformed/empty/duplicate options/index guessing rejected client+server; real answer preserved; stable render key: PASS');

assert.ok(view.includes("'ai_' + quizDetails.topic"));assert.ok(view.includes('setQuizDetails({ topic: aiTopic, level: aiLevel, difficulty: aiDifficulty })'));
