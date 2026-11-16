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
console.log('AI availability: 2xx HTML/nonJSON unavailable, success JSON body untouched, error status/message passthrough: PASS');
})().catch(e=>{console.error(e);process.exit(1)});
