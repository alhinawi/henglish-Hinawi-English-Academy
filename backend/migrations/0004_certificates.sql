-- Additive only. Back up remote D1 before applying.
CREATE TABLE IF NOT EXISTS certificate_checkpoints (
 user_id INTEGER NOT NULL REFERENCES users(id), lesson_id TEXT NOT NULL,
 passed_at INTEGER NOT NULL, score INTEGER NOT NULL, total INTEGER NOT NULL,
 PRIMARY KEY(user_id, lesson_id)
);
CREATE TABLE IF NOT EXISTS certificate_attempts (
 id TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), target TEXT NOT NULL,
 kind TEXT NOT NULL CHECK(kind IN ('checkpoint','final')), started_at INTEGER NOT NULL,
 expires_at INTEGER NOT NULL, consumed INTEGER NOT NULL DEFAULT 0,
 questions TEXT NOT NULL, score INTEGER, total INTEGER
);
CREATE INDEX IF NOT EXISTS certificate_attempt_rate ON certificate_attempts(user_id,target,kind,started_at);
CREATE TABLE IF NOT EXISTS certificates (
 id TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id), definition_id TEXT NOT NULL,
 student_name TEXT NOT NULL, title TEXT NOT NULL, level TEXT NOT NULL,
 issued_at INTEGER NOT NULL, score INTEGER NOT NULL, total INTEGER NOT NULL,
 revoked INTEGER NOT NULL DEFAULT 0, curriculum_version INTEGER NOT NULL,
 UNIQUE(user_id,definition_id)
);
