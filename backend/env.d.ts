declare namespace Cloudflare {
  interface Env {
    CERTIFICATE_SIGNING_SECRET?: string
    DB: D1Database
    ALLOWED_ORIGINS: string
    TEST_MIGRATIONS: import('cloudflare:test').D1Migration[]
  }
}
