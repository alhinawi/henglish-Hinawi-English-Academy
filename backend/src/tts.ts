import { Hono } from 'hono'
import { sha256Hex } from './crypto'
import allowedVoices from './ttsVoiceAllowlist.json'

export const TTS_VOICES = {
  'US-female': 'EXAVITQu4vr4xnSDxMaL', // Sarah, premade
  'US-male': 'CwhRBWXzGAHq8TQ4Fs17', // Roger, premade
  'UK-female': 'Xb7hH8MSUJpSbSDYk0k2', // Alice, premade; private preview checked
  'UK-male': 'JBFqnCBsd6RMkjVDRZzb', // George, premade
} as const
const MODEL = 'eleven_multilingual_v2'
const DEFAULT_CAP = 9000
const MAX_AUDIO_BYTES = 1_800_000
const MAX_CACHE_BYTES = 350_000_000

export function ttsKeys(env: Cloudflare.Env): { id: number; value: string }[] {
  const pool = (env.ELEVENLABS_KEYS_POOL || '').split(',')
  // Empty slots keep their IDs. Never shift a missing key onto another account.
  return [...pool.slice(0, 9).map((value, i) => ({ id: i + 1, value: value.trim() })),
    { id: 13, value: (env.ELEVENLABS_KEY_HENGLISH_13 || '').trim() },
    { id: 14, value: (env.ELEVENLABS_KEY_HENGLISH_14 || '').trim() }].filter(key => key.value)
}
export function usableTtsKeys(keys: { id: number; value: string }[], parked: { key_id: number; parked_until: number }[], now: number) {
  // Shared pool first; dedicated keys are reserved until the pool cannot serve.
  return keys.filter(key => !parked.some(row => row.key_id === key.id && row.parked_until > now))
    .sort((a, b) => a.id - b.id)
}
function base64(audio: ArrayBuffer): string {
  const bytes = new Uint8Array(audio)
  let result = ''
  for (let i = 0; i < bytes.length; i += 0x8000) result += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(result)
}
async function upstream(url: string, key: string, body?: unknown, deadline = Date.now() + 25000): Promise<Response> {
  return fetch(url, { method: body ? 'POST' : 'GET', headers: { 'xi-api-key': key, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(Math.max(1, Math.min(25000, deadline - Date.now()))) })
}
async function resetForKey(key: string, now: number, deadline: number): Promise<number> {
  try {
    const res = await upstream('https://api.elevenlabs.io/v1/user/subscription', key, undefined, deadline)
    if (res.ok) {
      const sub = await res.json() as { next_character_count_reset_unix?: number }
      const reset = sub.next_character_count_reset_unix
      if (typeof reset === 'number' && reset > now && reset <= now + 40 * 86400) return reset
    }
  } catch { /* Unverifiable reset never means unlimited retries. */ }
  return now + 86400
}

export function mountTts(app: Hono<{ Bindings: Cloudflare.Env; Variables: { userId: number } }>) {
  app.post('/api/tts/synthesize', async c => {
    // Disabled by default until license, secrets, backup and manifest are verified.
    if (c.env.TTS_ENABLED !== 'true') return c.json({ error: 'tts_unavailable' }, 503)
    if (Number(c.req.header('Content-Length') || 0) > 24000) return c.json({ error: 'too_large' }, 413)
    let input: unknown
    try { const raw = await c.req.text(); if (raw.length > 24000) return c.json({ error: 'too_large' }, 413); input = JSON.parse(raw) } catch { return c.json({ error: 'invalid_json' }, 400) }
    if (!input || typeof input !== 'object') return c.json({ error: 'invalid_text' }, 400)
    const body = input as Record<string, unknown>
    if (typeof body.text !== 'string' || !body.text.trim() || body.text.trim().length > 5000) return c.json({ error: 'invalid_text' }, 400)
    const text = body.text.trim()
    const hash = await sha256Hex(text)
    const manifest = await c.env.DB.prepare('SELECT text, chars FROM tts_manifest WHERE text_hash = ?').bind(hash).first<{ text: string; chars: number }>()
    if (!manifest || manifest.text !== text || manifest.chars !== text.length) return c.json({ error: 'unknown_text' }, 404)
    const accent = body.accent === 'UK' ? 'UK' : 'US'
    const gender = body.gender === 'male' ? 'male' : 'female'
    if (body.voiceId !== undefined && (typeof body.voiceId !== 'string' || !allowedVoices.includes(body.voiceId))) return c.json({ error: 'unsupported_voice' }, 400)
    const voice = typeof body.voiceId === 'string' ? body.voiceId : TTS_VOICES[`${accent}-${gender}`]
    // Speed is applied by the audio player, not charged as a new recording.
    const cacheKey = `${hash}:${voice}:${MODEL}`
    const cached = await c.env.DB.prepare('SELECT audio FROM tts_cache WHERE cache_key = ?').bind(cacheKey).first<{ audio: ArrayBuffer }>()
    if (cached) return c.json({ audioBase64: base64(cached.audio), mimeType: 'audio/mpeg', provider: 'elevenlabs', voiceId: voice, cached: true })
    const now = Math.floor(Date.now() / 1000)
    const deadline = Date.now() + 48000
    const storage = await c.env.DB.prepare('SELECT COALESCE(SUM(LENGTH(audio)),0) AS bytes FROM tts_cache').first<{ bytes: number }>()
    if (!storage || storage.bytes + MAX_AUDIO_BYTES > MAX_CACHE_BYTES) return c.json({ error: 'cache_full' }, 503)
    const keys = usableTtsKeys(ttsKeys(c.env), (await c.env.DB.prepare('SELECT key_id, parked_until FROM tts_key_state').all<{ key_id: number; parked_until: number }>()).results, now)
    if (!keys.length) return c.json({ error: 'quota_exhausted' }, 503)
    const token = crypto.randomUUID()
    const claimed = await c.env.DB.prepare('INSERT INTO tts_jobs (cache_key, token, expires_at) VALUES (?, ?, ?) ON CONFLICT(cache_key) DO UPDATE SET token = excluded.token, expires_at = excluded.expires_at WHERE tts_jobs.expires_at <= ?').bind(cacheKey, token, now + 600, now).run()
    if (!claimed.meta.changes) return c.json({ error: 'audio_pending' }, 503)
    try {
      const configured = Number(c.env.TTS_DAILY_CHAR_CAP || DEFAULT_CAP)
      const cap = Number.isInteger(configured) && configured > 0 && configured <= DEFAULT_CAP ? configured : DEFAULT_CAP
      const day = new Date().toISOString().slice(0, 10)
      // Atomic reservation before synthesis. Failures remain charged locally,
      // conservatively bounding spend even if a response is lost after generation.
      const reserved = await c.env.DB.prepare('INSERT INTO tts_usage (day, chars) SELECT ?, ? WHERE ? <= ? ON CONFLICT(day) DO UPDATE SET chars = tts_usage.chars + excluded.chars WHERE tts_usage.chars + excluded.chars <= ?').bind(day, text.length, text.length, cap, cap).run()
      if (!reserved.meta.changes) return c.json({ error: 'daily_cap' }, 503)
      for (const key of keys) {
        if (Date.now() >= deadline) return c.json({ error: 'tts_unavailable' }, 503)
        // Never use a paid tier, paid character extension or an unknown balance.
        // Shared keys can be used by other sites, so this check is live each time.
        try {
          const check = await upstream('https://api.elevenlabs.io/v1/user/subscription', key.value, undefined, deadline)
          if (!check.ok) continue
          const sub = await check.json() as { tier?: string; can_extend_character_limit?: boolean; character_count?: number; character_limit?: number; next_character_count_reset_unix?: number }
          if (sub.tier !== 'free' || sub.can_extend_character_limit !== false) continue
          if (typeof sub.character_count !== 'number' || typeof sub.character_limit !== 'number') continue
          if (sub.character_limit - sub.character_count < text.length) {
            const reset = sub.next_character_count_reset_unix
            const until = typeof reset === 'number' && reset > now && reset <= now + 40 * 86400 ? reset : now + 86400
            await c.env.DB.prepare('INSERT INTO tts_key_state (key_id, parked_until, reason) VALUES (?, ?, ?) ON CONFLICT(key_id) DO UPDATE SET parked_until = excluded.parked_until, reason = excluded.reason').bind(key.id, until, 'quota').run()
            continue
          }
        } catch { continue }
        let res: Response
        try { res = await upstream(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`, key.value, { text, model_id: MODEL }, deadline) } catch { return c.json({ error: 'tts_unavailable' }, 503) }
        if (!res.ok) {
          let status = ''
          try { const error = await res.json() as { detail?: { status?: string } }; status = error.detail?.status || '' } catch { /* No upstream body is logged or returned. */ }
          const quota = ['quota_exceeded', 'insufficient_credits'].includes(status)
          const invalid = ['invalid_api_key', 'key_disabled', 'key_expired'].includes(status)
          if (!quota && !invalid) return c.json({ error: 'tts_unavailable' }, 503)
          const until = quota ? await resetForKey(key.value, now, deadline) : now + 86400
          await c.env.DB.prepare('INSERT INTO tts_key_state (key_id, parked_until, reason) VALUES (?, ?, ?) ON CONFLICT(key_id) DO UPDATE SET parked_until = excluded.parked_until, reason = excluded.reason').bind(key.id, until, quota ? 'quota' : 'unavailable').run()
          continue
        }
        if (!res.headers.get('Content-Type')?.startsWith('audio/')) return c.json({ error: 'invalid_audio' }, 502)
        const audio = await res.arrayBuffer()
        if (!audio.byteLength || audio.byteLength > MAX_AUDIO_BYTES) return c.json({ error: 'invalid_audio' }, 502)
        // Persist before returning. A failed cache write must not look durable.
        const saved = await c.env.DB.prepare('INSERT OR IGNORE INTO tts_cache (cache_key, audio, created_at) SELECT ?, ?, ? WHERE (SELECT COALESCE(SUM(LENGTH(audio)),0) FROM tts_cache) + ? <= ?').bind(cacheKey, audio, new Date().toISOString(), audio.byteLength, MAX_CACHE_BYTES).run()
        if (!saved.meta.changes) return c.json({ error: 'cache_full' }, 503)
        return c.json({ audioBase64: base64(audio), mimeType: 'audio/mpeg', provider: 'elevenlabs', voiceId: voice, cached: false })
      }
      return c.json({ error: 'quota_exhausted' }, 503)
    } finally {
      await c.env.DB.prepare('DELETE FROM tts_jobs WHERE cache_key = ? AND token = ?').bind(cacheKey, token).run()
    }
  })
}
