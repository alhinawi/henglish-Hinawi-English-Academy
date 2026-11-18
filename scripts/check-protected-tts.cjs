const fs = require('fs'), assert = require('node:assert/strict'), vm = require('vm'), ts = require('typescript'), { execFileSync } = require('node:child_process');
const compile = file => ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
(async () => {
  const calls = [];
  const context = { exports: {}, Response, AbortSignal, fetch: async (...args) => { calls.push(args); return Response.json({ audioBase64: 'fixture', cached: true }); } };
  vm.runInNewContext(compile('server/protectedTtsProxy.ts'), context);
  let response = await context.exports.protectedTtsProxy(JSON.stringify({ text: 'What is your name?' }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(calls[0][0], 'https://henglish-api.hnz.workers.dev/api/tts/synthesize');
  assert.equal((await context.exports.protectedTtsProxy('x'.repeat(24001))).status, 413);
  assert.equal(calls.length, 1);
  context.fetch = async () => { throw Error('private upstream failure'); };
  response = await context.exports.protectedTtsProxy('{}');
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: 'tts_unavailable' });
  for (const file of ['api/tts/synthesize.ts', 'functions/api/tts/synthesize.ts']) {
    const source = fs.readFileSync(file, 'utf8');
    assert(source.includes('protectedTtsProxy'));
    assert(!/GOOGLE_TTS|ELEVENLABS_API_KEY|texttospeech.googleapis|api.elevenlabs/.test(source));
  }
  const sent = [];
  const vercel = { exports: {}, require: () => ({ protectedTtsProxy: async body => { sent.push(JSON.parse(body)); return Response.json({ cached: true }); } }) };
  vm.runInNewContext(compile('api/tts/synthesize.ts'), vercel);
  for (const body of [{ text: 'What is your name?' }, JSON.stringify({ text: 'What is your name?' })]) {
    const res = { statusCode: 0, setHeader() {}, end(value) { this.result = value; } };
    await vercel.exports.default({ method: 'POST', body }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(sent.at(-1).text, 'What is your name?');
  }
  const raw = { method: 'POST', async *[Symbol.asyncIterator]() { yield Buffer.from('{"text":"What is your name?"}'); } };
  const rawRes = { statusCode: 0, setHeader() {}, end() {} };
  await vercel.exports.default(raw, rawRes);
  assert.equal(rawRes.statusCode, 200);
  assert.equal(sent.length, 3);
  const router = fs.readFileSync('server/apiRouter.ts', 'utf8');
  assert(router.slice(router.indexOf("if (url === '/api/tts/synthesize'"), router.indexOf('// Dynamic AI Question Generation endpoint')).includes('protectedTtsProxy'));
  const catalog = fs.readFileSync('src/data/voicesCatalog.ts', 'utf8');
  assert.deepEqual(JSON.parse(fs.readFileSync('backend/src/ttsVoiceAllowlist.json')), [...catalog.matchAll(/id: '([^']+)'/g)].map(match => match[1]));
  const output = '/tmp/henglish-tts-regression-manifest.sql';
  execFileSync(process.execPath, ['scripts/build-tts-manifest.cjs', output], { stdio: 'pipe' });
  const sql = fs.readFileSync(output, 'utf8');
  assert(sql.includes('What is your name?'));
  assert(sql.includes('Welcome to Henglish Academy!'));
  assert(!/DROP TABLE|DELETE FROM|ALTER TABLE/.test(sql));
  assert(sql.split('\n').length > 70000);
  execFileSync('npm', ['run', 'test:tts'], { cwd: 'backend', stdio: 'inherit' });
  console.log('Protected TTS hosting adapters, fixed destination, generic errors, no provider keys/Google route, exact catalog allowlist and actual-content additive manifest: PASS');
})().catch(error => { console.error(error); process.exitCode = 1; });
