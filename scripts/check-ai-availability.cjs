const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const c={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/services/aiAvailability.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,c);
const {throwForAiResponse:check,isAiServiceUnavailable:unavailable}=c.exports;
const response=(status,type,body)=>new Response(body,{status,headers:type?{'content-type':type}:{}});
(async()=>{
for(const status of [200,201,404,405,501])for(const type of ['text/html','text/plain','']){
 const r=response(status,type,'<html>SPA fallback</html>');await assert.rejects(check(r,'fallback'),unavailable);
}
let r=response(200,'application/json; charset=utf-8','{"text":"actual feedback"}');await check(r,'fallback');assert.equal((await r.json()).text,'actual feedback');
for(const status of [404,405,501])await assert.rejects(check(response(status,'application/json','{}'),'fallback'),unavailable);
await assert.rejects(check(response(500,'application/json','{"error":"server detail"}'),'fallback'),e=>!unavailable(e)&&e.message==='server detail');
await assert.rejects(check(response(429,'application/json','{"message":"rate limited"}'),'fallback'),e=>!unavailable(e)&&e.message==='rate limited');
await assert.rejects(check(response(500,'application/json','bad json'),'fallback'),e=>e.message==='fallback');
await assert.rejects(check(response(503,'application/json',JSON.stringify({code:'AI_SERVICE_UNAVAILABLE',error:'No provider'})),'fallback'),unavailable);
console.log('AI availability: 2xx HTML/nonJSON unavailable, success JSON body untouched, error status/message passthrough: PASS');
})().catch(e=>{console.error(e);process.exit(1)});

// Use an isolated environment and stubbed network, never real credentials.
const compile=(file,context)=>{context.exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,context);return context.exports};
const fsStub={existsSync:()=>false},processStub={env:{},cwd:()=>'/no-env'};
let providerResponse={ok:false,status:503};
const backend=compile('server/translationService.ts',{process:processStub,AbortController,setTimeout,clearTimeout,console:{warn(){}},fetch:async()=>providerResponse,require:name=>name==='node:fs'?fsStub:name==='node:dns'?{setDefaultResultOrder(){}}:name==='node:path'?require('path'):name.endsWith('aiAvailability')?c.exports:{}});
const req={text:'My original private sentence.',sourceLang:'en',targetLang:'ar',mode:'natural'},context={originalText:req.text,translatedText:'',sourceLang:'en',targetLang:'ar',mode:'natural'};
(async()=>{for(const env of [{},{AI_PROVIDER:'gemini',GEMINI_API_KEY:'fixture-only'},{AI_PROVIDER:'openai',OPENAI_API_KEY:'fixture-only'}]){processStub.env=env;await assert.rejects(backend.dispatchTranslation(req),unavailable);await assert.rejects(backend.dispatchTranslationAssistant('How can I improve?',context),unavailable);await assert.rejects(backend.dispatchImageOcr('fixture-image','image/png','ar'),unavailable);await assert.rejects(backend.dispatchVoiceTranscription('fixture-audio','audio/webm'),unavailable)}processStub.env={AI_PROVIDER:'gemini',GEMINI_API_KEY:'fixture-only'};providerResponse={ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify({translatedText:'Actual provider translation'})}]}}]})};const valid=await backend.dispatchTranslation({...req,text:'New successful fixture'});assert.equal(valid.translatedText,'Actual provider translation');assert.equal(valid.provider,'gemini');
processStub.env={};const route=compile('api/ai/translate.ts',{console:{error(){}},require:name=>name==='node:dns'?{setDefaultResultOrder(){}}:name.endsWith('aiAvailability')?c.exports:backend}).default;let status,body;await route({method:'POST',body:req},{setHeader(){},set statusCode(v){status=v},end:v=>body=JSON.parse(v)});assert.equal(status,503);assert.equal(body.code,'AI_SERVICE_UNAVAILABLE');
const router=fs.readFileSync('server/apiRouter.ts','utf8');assert.equal((router.match(/if \(isAiServiceUnavailable\(err\)\)/g)||[]).length,4);assert(fs.readFileSync('api/ai/translate.ts','utf8').includes("code: 'AI_SERVICE_UNAVAILABLE'"));console.log('No-provider and failed-provider translation,assistant,OCR and transcription reject fabricated output;API routes return503 unavailable and client classifies it: PASS')})().catch(e=>{console.error(e);process.exitCode=1});
