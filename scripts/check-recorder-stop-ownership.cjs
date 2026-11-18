const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
function fixture(){
 const recorders=[],readers=[],tracks=[],urls=[],timers=new Set(),frames=new Set();let seq=0;
 const x={exports:{},console:{warn(){}},navigator:{mediaDevices:{getUserMedia:async()=>{const track={stops:0,stop(){this.stops++}};tracks.push(track);return{getTracks:()=>[track]}}}},window:{AudioContext:class{state='running';createMediaStreamSource(){return{connect(){}}}createAnalyser(){return{frequencyBinCount:8,getByteFrequencyData(){}}}close(){this.state='closed'}}},MediaRecorder:class{static isTypeSupported(){return true}constructor(){this.mimeType='audio/webm';recorders.push(this)}start(){}stop(){this.stopped=true}},FileReader:class{constructor(){readers.push(this)}readAsDataURL(){}abort(){this.onabort?.()}complete(result='data:audio/webm;base64,YXVkaW8='){this.result=result;this.onload?.()}},Blob,Date,Uint8Array,URL:{createObjectURL(blob){urls.push(blob);return 'clip-'+urls.length}},setInterval(){const id=++seq;timers.add(id);return id},clearInterval:id=>timers.delete(id),requestAnimationFrame(){const id=++seq;frames.add(id);return id},cancelAnimationFrame:id=>frames.delete(id)};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/utils/audioRecorder.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,x);const recorder=new x.exports.RealAudioRecorder();return{recorder,recorders,readers,tracks,urls,timers,frames,chunk(){recorders.at(-1).ondataavailable({data:new Blob(['audio'])})}};
}
(async()=>{
 for(const stage of ['stop','encoding']){
  const f=fixture();await f.recorder.start();f.chunk();const stopped=f.recorder.stop();const old=f.recorders[0];if(stage==='encoding')old.onstop();f.recorder.cancel();assert.equal(await stopped,null);await f.recorder.start();const live=f.tracks[1];old.onstop();old.onerror();f.readers[0]?.complete();assert.equal(live.stops,0);assert.equal(f.recorder.state,'RECORDING');assert.equal(f.urls.length,0);f.recorder.cancel();assert.equal(live.stops,1);assert.equal(f.timers.size,0);assert.equal(f.frames.size,0);
 }
 for(const failure of ['empty','file-error','invalid-result','read-throw','stop-throw']){
  const f=fixture();await f.recorder.start();if(failure!=='empty')f.chunk();if(failure==='stop-throw')f.recorders[0].stop=()=>{throw Error('stop failed')};if(failure==='read-throw'){
   // Install a throwing read method before the stop callback creates its reader.
   const oldPush=f.readers.push;f.readers.push=function(reader){reader.readAsDataURL=()=>{throw Error('read failed')};return oldPush.call(this,reader)};
  }
  const stopped=f.recorder.stop();if(failure!=='stop-throw')f.recorders[0].onstop();if(failure==='file-error')f.readers[0].onerror();if(failure==='invalid-result')f.readers[0].complete(null);assert.equal(await stopped,null);assert.equal(f.recorder.state,'PROCESSING_ERROR');assert.equal(f.tracks[0].stops,1);assert.equal(f.urls.length,0);
 }
 const good=fixture();await good.recorder.start();good.chunk();const packaged=good.recorder.stop();good.recorders[0].onstop();good.readers[0].complete();const result=await packaged;assert.equal(result.base64,'YXVkaW8=');assert.equal(result.blobUrl,'clip-1');assert.equal(result.mimeType,'audio/webm');assert.equal(good.recorder.state,'COMPLETED');assert.equal(good.tracks[0].stops,1);assert.equal(good.urls.length,1);
 console.log('Shared recorder stop/encoding ownership: canceled promise settles,null/empty/read/stop failures release tracks,no premature URLs,stale callbacks cannot stop newer capture,real clip succeeds: PASS');
})().catch(e=>{console.error(e);process.exitCode=1});
