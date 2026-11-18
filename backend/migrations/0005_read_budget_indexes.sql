-- Additive only. Back up remote D1 before the deployer applies this migration.
-- Admin active-session count: WHERE expires_at > ? (covering range index).
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Admin recent registrations and last-seven-days count share this index.
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Badge evidence reads only graded, consumed attempts for one learner.
-- Keep the existing user/target/kind/started_at rate-limit index unchanged.
CREATE INDEX IF NOT EXISTS idx_certificate_attempts_badge_evidence
  ON certificate_attempts(user_id, started_at, score, total)
  WHERE consumed = 1 AND total > 0 AND score IS NOT NULL;
