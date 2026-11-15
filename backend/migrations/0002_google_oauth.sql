-- Google OAuth sign-in: link a Google identity to a user account, plus
-- one-time redirect states for the authorization-code flow.
-- Users who register via Google have an empty password_hash (password login
-- stays impossible for them until they set a password).

ALTER TABLE users ADD COLUMN google_sub TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_sub) WHERE google_sub IS NOT NULL;

CREATE TABLE IF NOT EXISTS oauth_states (
  state TEXT PRIMARY KEY,
  origin TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
