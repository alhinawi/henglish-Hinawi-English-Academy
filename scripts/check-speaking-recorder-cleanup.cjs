const fs = require('fs'), vm = require('vm'), ts = require('typescript'), assert = require('assert/strict');
const source = fs.readFileSync('src/components/SpeakingPracticeStudio.tsx', 'utf8');
const start = source.slice(source.indexOf('  async function start()'), source.indexOf('  return <div'));
function fixture(failure) {
  let stops = 0;
  const media = {getTracks: () => [{stop: () => stops++}]};
  const c = {exports: {}, recording: false, starting: false, error: '', mounted: {current: true}, recorder: {current: null}, stream: {current: null}, objectUrl: {current: 'previous-clip'}, timer: {current: null}, navigator: {mediaDevices: {getUserMedia: async () => {if (failure === 'permission') throw Error('denied');return media;}}}, stopSpeech() {}, t: key => key,
    setError: v => c.error = v, setStarting: v => c.starting = v, setRecording: v => c.recording = v,
    setUrl: v => c.url = v, URL: {revokeObjectURL() {throw Error('Previous clip should survive failed start');}},
    setTimeout: () => 1, clearTimeout() {}, Blob,
    MediaRecorder: class {constructor() {if (failure === 'constructor') throw Error('codec');this.state = 'inactive';}start() {if (failure === 'start') throw Error('device lost');this.state = 'recording';}}
  };
  vm.runInNewContext(ts.transpileModule(start + '\nexports.start = start;', {}).outputText, c);
  return {c, media, stops: () => stops};
}
(async () => {
  for (const failure of ['constructor', 'start', 'permission']) {
    const {c, stops} = fixture(failure);
    await c.exports.start();
    assert.equal(stops(), failure === 'permission' ? 0 : 1, failure);
    assert.equal(c.recorder.current, null);
    assert.equal(c.stream.current, null);
    assert.equal(c.recording, false);
    assert.equal(c.starting, false);
    assert.equal(c.error, 'sp.rec.micError');
    assert.equal(c.objectUrl.current, 'previous-clip');
  }
  const {c, stops} = fixture('none');
  await c.exports.start();
  assert.equal(stops(), 0);assert.equal(c.recording, true);assert.equal(c.starting, false);
  c.URL.revokeObjectURL = () => {};c.URL.createObjectURL = () => 'recorded-clip';
  c.recorder.current.ondataavailable({data:new Blob(['audio'])});
  c.recorder.current.onstop();
  assert.equal(stops(), 1);assert.equal(c.url, 'recorded-clip');assert.equal(c.recording, false);
  for(const emptyChunk of [false,true]) {
    const empty=fixture('none');await empty.c.exports.start();const r=empty.c.recorder.current;
    if(emptyChunk)r.ondataavailable({data:new Blob([])});
    r.onstop();assert.equal(empty.stops(),1);assert.equal(empty.c.objectUrl.current,'previous-clip');assert.equal(empty.c.url,undefined);assert.equal(empty.c.error,'sp.rec.micError');assert.equal(empty.c.recording,false);assert.equal(empty.c.recorder.current,null);assert.equal(empty.c.stream.current,null);assert.equal(empty.c.timer.current,null);
    await empty.c.exports.start();assert.equal(empty.c.error,'');assert.equal(empty.c.recording,true);
  }
  const unmounted=fixture('none');await unmounted.c.exports.start();const r=unmounted.c.recorder.current;unmounted.c.mounted.current=false;r.onstop();assert.equal(unmounted.stops(),1);assert.equal(unmounted.c.url,undefined);assert.equal(unmounted.c.error,'');
  console.log('Empty recordings never replace/revoke a usable clip;release tracks/refs/timer,announce failure,retry cleanly and ignore late unmounted stop: PASS');
  const late = fixture('none');late.c.mounted.current = false;await late.c.exports.start();
  assert.equal(late.stops(), 1);assert.equal(late.c.recorder.current, null);
  for (const mounted of [true,false]) {
    const runtime=fixture('none');await runtime.c.exports.start();const r=runtime.c.recorder.current;let stopCalls=0;r.stop=()=>{stopCalls++;r.state='inactive';r.onstop?.();};runtime.c.mounted.current=mounted;
    runtime.c.recording=true;runtime.c.error='';r.onerror();assert.equal(runtime.stops(),1);assert.equal(stopCalls,1);assert.equal(runtime.c.recorder.current,null);assert.equal(runtime.c.stream.current,null);assert.equal(r.onstop,null);assert.equal(r.ondataavailable,null);assert.equal(runtime.c.timer.current,null);assert.equal(runtime.c.objectUrl.current,'previous-clip');assert.equal(runtime.c.url,undefined);
    assert.equal(runtime.c.recording,!mounted);assert.equal(runtime.c.error,mounted?'sp.rec.micError':'');
    if(mounted){await runtime.c.exports.start();assert.equal(runtime.c.recording,true);assert.equal(runtime.c.error,'');}
  }
  const brokenStop=fixture('none');await brokenStop.c.exports.start();brokenStop.c.recorder.current.stop=()=>{throw Error('already failed')};brokenStop.c.recorder.current.onerror();assert.equal(brokenStop.stops(),1);assert.equal(brokenStop.c.recording,false);
  console.log('Speaking recorder runtime errors release microphone/timer,retain prior clip,avoid late unmounted updates,and allow retry; thrown stop is safe: PASS');
  console.log('Speaking recorder releases microphone on construction/start failure; permission denial, successful stop, old clip and late grant preserved: PASS');
})().catch(e => {console.error(e);process.exitCode = 1;});

const legacySource=fs.readFileSync('src/components/SpeakingLegacyPractice.tsx','utf8');assert(legacySource.includes('key={activeTargetLine}'));assert.equal((legacySource.match(/setShadowingLineIdx\(idx\); setCustomPrompt\(null\);/g)||[]).length,2);console.log('Legacy shadowing recorder remounts per target and explicit line selection clears a free-prompt override: PASS');
