-- Additive only. Rollback is disabling TTS_ENABLED. Existing account tables are untouched.
CREATE TABLE IF NOT EXISTS tts_manifest (
  text_hash TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  chars INTEGER NOT NULL CHECK(chars > 0 AND chars <= 5000),
  source TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tts_cache (
  cache_key TEXT PRIMARY KEY,
  audio BLOB NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tts_usage (
  day TEXT PRIMARY KEY,
  chars INTEGER NOT NULL DEFAULT 0 CHECK(chars >= 0)
);
CREATE TABLE IF NOT EXISTS tts_key_state (
  key_id INTEGER PRIMARY KEY,
  parked_until INTEGER NOT NULL DEFAULT 0,
  reason TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS tts_jobs (
  cache_key TEXT PRIMARY KEY,
  token TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
