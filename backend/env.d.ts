declare namespace Cloudflare {
  interface Env {
    TTS_ENABLED?: string
    TTS_DAILY_CHAR_CAP?: string
    ELEVENLABS_KEYS_POOL?: string
    ELEVENLABS_KEY_HENGLISH_13?: string
    ELEVENLABS_KEY_HENGLISH_14?: string
    CERTIFICATE_SIGNING_SECRET?: string
    DB: D1Database
    ALLOWED_ORIGINS: string
    TEST_MIGRATIONS: import('cloudflare:test').D1Migration[]
  }
}
