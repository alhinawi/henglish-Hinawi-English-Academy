const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const code=ts.transpileModule(fs.readFileSync('src/services/audioPlaybackManager.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const clips=[],spoken=[],timers=new Map();let timer=0;
class Audio{constructor(url){this.url=url;this.events={};clips.push(this);}addEventListener(k,fn){this.events[k]=fn;}pause(){this.paused=true;}play(){return new Promise((resolve,reject)=>{this.resolve=resolve;this.reject=reject;});}emit(k){this.events[k]?.();}}
const c={exports:{},Audio,window:{speechSynthesis:{cancel(){}}},require:()=>({stopSpeech(){},speakEnglishVoice:(text,options)=>spoken.push({text,options})}),setTimeout:fn=>{timers.set(++timer,fn);return timer;},clearTimeout:id=>timers.delete(id)};vm.runInNewContext(code,c);const api=c.exports.audioPlayback;
(async()=>{
 const old=api.playPronunciation('old','old','US','https://example.invalid/old.mp3');const a=clips[0];
 const next=api.playPronunciation('next','next','UK','https://example.invalid/next.mp3');const b=clips[1];b.emit('play');
 for(const event of ['play','ended','error'])a.emit(event);a.reject(Error('late'));await old;assert.equal(api.getState().wordId,'next');assert.equal(api.getState().status,'playing');assert.equal(spoken.length,0);b.resolve();await next;
 b.emit('error');b.emit('error');assert.equal(spoken.length,1);assert.equal(spoken[0].text,'next');assert.equal(api.getState().source,'speech-synthesis');
 api.stop();const stopped=api.playPronunciation('stopped','stopped','US','https://example.invalid/stop.mp3');const d=clips[2];api.stop();d.reject(Error('stop'));d.emit('error');await stopped;assert.equal(api.getState().status,'idle');assert.equal(spoken.length,1);
 await api.playPronunciation('same','same','US');const oldTimer=[...timers.values()][0];api.stop();await api.playPronunciation('same','same','US');oldTimer();assert.equal(api.getState().status,'playing');
 const bad=api.playPronunciation('bad','bad','US','https://example.invalid/bad.mp3');const e=clips[3];e.emit('error');e.reject(Error('duplicate'));await bad;assert.equal(spoken.filter(x=>x.text==='bad').length,1);
 console.log('Pronunciation races: stale remote events/rejections and old timers ignored; stop invalidates pending; fallback once per generation: PASS');
})().catch(e=>{console.error(e);process.exitCode=1;});
