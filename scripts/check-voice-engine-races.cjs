const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const js=ts.transpileModule(fs.readFileSync('src/utils/voiceEngine.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const pending=[],clips=[],utterances=[],states=[];
class Audio{constructor(src){this.src=src;clips.push(this);}play(){return new Promise((resolve,reject)=>{this.resolve=resolve;this.reject=reject;});}pause(){this.paused=true;}}
const synth={getVoices:()=>[{name:'Microsoft Aria',lang:'en-US'},{name:'Microsoft Katja',lang:'de-DE'}],cancel(){},speak:u=>utterances.push(u)};
const c={exports:{},console,AbortController,Audio,SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},window:{speechSynthesis:synth},localStorage:{getItem:()=>null,setItem(){}},fetch:(url,options)=>new Promise((resolve,reject)=>pending.push({resolve,reject,options})),setTimeout};vm.runInNewContext(js,c);const api=c.exports;api.subscribeSpeechState((playing,text)=>states.push({playing,text}));
const flush=async()=>{for(let n=0;n<10;n++)await Promise.resolve();};const answer=(i,data)=>pending[i].resolve({json:async()=>data});
(async()=>{
 api.speakEnglishVoice('old');api.speakEnglishVoice('new');assert.ok(pending[0].options.signal.aborted);answer(0,{audioBase64:'old'});await flush();assert.equal(clips.length,0);answer(1,{audioBase64:'new'});await flush();assert.equal(clips.length,1);const a=clips[0];a.onplay();assert.equal(states.at(-1).text,'new');api.stopSpeech();a.onended();a.onerror();a.reject(Error());await flush();assert.equal(utterances.length,0);assert.equal(states.at(-1).playing,false);
 api.speakEnglishVoice('stopped');api.stopSpeech();pending[2].reject(Error('abort'));await flush();assert.equal(utterances.length,0);
 api.speakEnglishVoice('fallback');answer(3,{});await flush();assert.equal(utterances.length,1);const u=utterances[0];api.speakEnglishVoice('after');u.onstart();u.onend();u.onerror();assert.equal(states.at(-1).playing,false);answer(4,{audioBase64:'after'});await flush();const b=clips[1];b.onerror();b.reject(Error());await flush();assert.equal(utterances.length,2,'error event and rejection only fallback once');
 api.stopSpeech();api.speakEnglishVoice('new');const cached=clips[2];assert.ok(cached,'new should use cache');api.stopSpeech();cached.onerror();cached.reject(Error());await flush();assert.equal(utterances.length,2);
 api.speakMultilingualText('test','de');const multi=utterances.at(-1);api.stopSpeech();const before=states.length;multi.onstart();multi.onend();multi.onerror();assert.equal(states.length,before);
 console.log('Voice engine: superseded/stopped TTS requests aborted and ignored; cached/server/browser late events ignored; fallback once; multilingual callbacks guarded: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
