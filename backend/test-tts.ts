import { getPlatformProxy } from 'wrangler'
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { Hono } from 'hono'
import { mountTts, ttsKeys, usableTtsKeys, TTS_VOICES } from './src/tts'
import { sha256Hex } from './src/crypto'

const mf = await getPlatformProxy<{ DB: D1Database }>({ persist: false })
const originalFetch = globalThis.fetch
try {
  const db = mf.env.DB
  for (const sql of readFileSync('migrations/0005_tts.sql', 'utf8').split(';').map(s => s.trim()).filter(Boolean)) await db.prepare(sql).run()
  const app = new Hono<any>()
  mountTts(app)
  const env: any = { DB: db, TTS_ENABLED: 'true', ELEVENLABS_KEYS_POOL: 'pool-one,,pool-three', ELEVENLABS_KEY_HENGLISH_13: 'dedicated-thirteen' }
  assert.deepEqual(ttsKeys(env).map(key => key.id), [1, 3, 13])
  assert.deepEqual(usableTtsKeys(ttsKeys(env), [{ key_id: 1, parked_until: 200 }], 100).map(key => key.id), [3, 13])
  assert.deepEqual(usableTtsKeys(ttsKeys(env), [{ key_id: 1, parked_until: 200 }], 200).map(key => key.id), [1, 3, 13])
  const text = 'What is your name?'
  await db.prepare('INSERT INTO tts_manifest VALUES (?,?,?,?)').bind(await sha256Hex(text), text, text.length, 'speaking:conversation-01').run()
  const call = async (body: unknown = { text }, overrides = {}) => {
    const response = await app.request('http://test/api/tts/synthesize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, { ...env, ...overrides })
    return { status: response.status, body: await response.json() as any }
  }
  const requests: { url: string; key: string; body: any }[] = []
  let mode: 'success' | 'quota' | 'paid' | 'pending' | 'fail' = 'success'
  let release: () => void = () => {}
  let started: () => void = () => {}
  let reset = Math.floor(Date.now() / 1000) + 120000
  globalThis.fetch = (async (url: string | URL | Request, options: RequestInit) => {
    const target = String(url), key = (options.headers as Record<string, string>)['xi-api-key']
    requests.push({ url: target, key, body: options.body ? JSON.parse(String(options.body)) : null })
    if (target.endsWith('/subscription')) return Response.json({ tier: mode === 'paid' ? 'creator' : 'free', can_extend_character_limit: mode === 'paid', character_count: 0, character_limit: 10000, next_character_count_reset_unix: reset })
    if (mode === 'quota' && key === 'pool-one') return Response.json({ detail: { status: 'quota_exceeded' } }, { status: 401 })
    if (mode === 'fail') throw new Error('synthetic upstream failure')
    if (mode === 'pending') { started(); await new Promise<void>(resolve => { release = resolve }) }
    return new Response(new Uint8Array([73, 68, 51, 1, 2, 3]), { headers: { 'Content-Type': 'audio/mpeg' } })
  }) as typeof fetch
  assert.equal((await call({ text: 'Arbitrary user text' })).status, 404)
  assert.equal((await call({ text, voiceId: '../../unsafe' })).status, 400)
  assert.equal((await call({}, { TTS_ENABLED: undefined })).status, 503)
  assert.equal(requests.length, 0)
  let result = await call()
  assert.equal(result.status, 200)
  assert.equal(result.body.cached, false)
  assert.equal(result.body.audioBase64, 'SUQzAQID')
  assert.equal(requests.filter(req => req.body).length, 1)
  result = await call({ text, speed: 0.7 })
  assert.equal(result.body.cached, true)
  assert.equal(result.body.audioBase64, 'SUQzAQID')
  assert.equal(requests.filter(req => req.body).length, 1)
  // Cache survives a new app instance and exhausted/absent keys and cap.
  assert.equal((await call({ text }, { ELEVENLABS_KEYS_POOL: '', ELEVENLABS_KEY_HENGLISH_13: '', TTS_DAILY_CHAR_CAP: '1' })).status, 200)
  mode = 'quota'
  result = await call({ text, accent: 'UK' })
  assert.equal(result.status, 200)
  assert.equal(result.body.voiceId, TTS_VOICES['UK-female'])
  assert.equal(requests.filter(req => req.body).at(-1)?.key, 'pool-three')
  const parked = await db.prepare('SELECT parked_until FROM tts_key_state WHERE key_id = 1').first<{ parked_until: number }>()
  assert.equal(parked?.parked_until, reset)
  await db.prepare('DELETE FROM tts_cache').run()
  mode = 'paid'
  const beforePaid = requests.filter(req => req.body).length
  assert.equal((await call()).status, 503)
  assert.equal(requests.filter(req => req.body).length, beforePaid)
  // Atomic day reservation across different uncached voice variants.
  mode = 'success'
  await db.prepare('DELETE FROM tts_usage').run()
  const concurrent = await Promise.all([call({ text }, { TTS_DAILY_CHAR_CAP: String(text.length) }), call({ text, gender: 'male' }, { TTS_DAILY_CHAR_CAP: String(text.length) })])
  assert.equal(concurrent.filter(row => row.status === 200).length, 1)
  assert.equal(concurrent.filter(row => row.body.error === 'daily_cap').length, 1)
  await db.prepare('DELETE FROM tts_usage').run()
  await db.prepare('DELETE FROM tts_cache').run()
  mode = 'pending'
  const start = new Promise<void>(resolve => { started = resolve })
  const first = call()
  await start
  assert.equal((await call()).body.error, 'audio_pending')
  release()
  assert.equal((await first).status, 200)
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM tts_jobs').first<{ n: number }>())?.n, 0)
  mode = 'fail'
  await db.prepare('DELETE FROM tts_cache').run()
  assert.equal((await call()).status, 503)
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM tts_jobs').first<{ n: number }>())?.n, 0)
  assert.equal((await call({ text: 'x'.repeat(25000) })).status, 413)
  console.log('PASS manifest-only, explicit voices, default-off, durable binary cache, speed deduplication, stable key IDs, quota failover/reset parking, paid-tier rejection, atomic day cap, concurrent job lock, failure lock cleanup and request size')
} finally { globalThis.fetch = originalFetch; await mf.dispose() }
