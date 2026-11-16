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
  c.recorder.current.onstop();
  assert.equal(stops(), 1);assert.equal(c.url, 'recorded-clip');assert.equal(c.recording, false);
  const late = fixture('none');late.c.mounted.current = false;await late.c.exports.start();
  assert.equal(late.stops(), 1);assert.equal(late.c.recorder.current, null);
  console.log('Speaking recorder releases microphone on construction/start failure; permission denial, successful stop, old clip and late grant preserved: PASS');
})().catch(e => {console.error(e);process.exitCode = 1;});
