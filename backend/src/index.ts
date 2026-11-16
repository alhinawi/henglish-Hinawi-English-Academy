import { buildLeaderboard, isOwner, isOwnerGoogleSession } from './leaderboard'
import { Hono, type MiddlewareHandler } from 'hono'
import { cors } from 'hono/cors'
import { hashPassword, newToken, sha256Hex, verifyPassword } from './crypto'
import { asBody, email, str, ValidationError } from './validate'
import { finishGoogleLogin, googleConfigured, startGoogleLogin } from './google'

type Env = { Bindings: Cloudflare.Env; Variables: { userId: number } }

const SESSION_DAYS = 30
const MAX_PROGRESS_BYTES = 512_000

const app = new Hono<Env>()

app.use('/api/*', async (c, next) => {
  const allowed = c.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  return cors({ origin: (o) => (allowed.includes(o) ? o : null), allowHeaders: ['Content-Type', 'Authorization'], maxAge: 600 })(c, next)
})

app.onError((err, c) => {
  if (err instanceof ValidationError) return c.json({ error: 'validation_failed', fields: err.fields }, 422)
  console.error(err)
  return c.json({ error: 'server_error' }, 500)
})
app.notFound((c) => c.json({ error: 'not_found' }, 404))

async function json(c: { req: { json: () => Promise<unknown> } }) {
  try {
    return asBody(await c.req.json())
  } catch (e) {
    if (e instanceof ValidationError) throw e
    throw new ValidationError({ body: 'invalid JSON' })
  }
}

const auth: MiddlewareHandler<Env> = async (c, next) => {
  const m = /^Bearer (.+)$/.exec(c.req.header('Authorization') ?? '')
  if (!m) return c.json({ error: 'unauthorized' }, 401)
  const row = await c.env.DB.prepare(
    'SELECT s.user_id, u.email, u.google_sub FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?',
  )
    .bind(await sha256Hex(m[1]), new Date().toISOString())
    .first<{ user_id: number; email: string; google_sub: string | null }>()
  if (!row) return c.json({ error: 'unauthorized' }, 401)
  if (isOwner(row.email) && !isOwnerGoogleSession(row, m[1])) return c.json({ error: 'google_reauth_required' }, 428)
  c.header('Cache-Control', 'no-store')
  c.set('userId', row.user_id)
  await next()
}

async function openSession(db: D1Database, userId: number, provider: 'password' | 'google' = 'password') {
  const token = (provider === 'google' ? 'g.' : '') + newToken()
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000).toISOString()
  await db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').bind(await sha256Hex(token), userId, expires).run()
  return token
}

async function saveProgress(db: D1Database, userId: number, data: string, now: string) {
  await db.prepare(
    'INSERT INTO progress (user_id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at',
  ).bind(userId, data, now).run()
}

type UserRow = { id: number; name: string; email: string; created_at: string; avatar: string | null; google_sub: string | null }
const publicUser = (u: UserRow, token = '') => ({ is_admin: isOwnerGoogleSession(u, token), id: u.id, name: u.name, email: u.email, created_at: u.created_at, avatar: u.avatar ?? null })

app.get('/api/ping', (c) => c.json({ ok: true, app: 'henglish-api' }))

// Public feature flags for the auth UI (Google button stays hidden until the
// OAuth secrets are configured on the worker).
app.get('/api/auth/config', (c) => c.json({ google: googleConfigured(c.env) }))

// Google OAuth: start (302 to Google) and callback (302 back to the site).
app.get('/api/auth/google/start', (c) => startGoogleLogin(c.req.raw, c.env))
app.get('/api/auth/google/callback', (c) => finishGoogleLogin(c.req.raw, c.env, (db, id) => openSession(db, id, 'google')))

// ---------- auth ----------
app.post('/api/auth/register', async (c) => {
  const b = await json(c)
  const name = str(b, 'name', { min: 2, max: 60, required: true })!.trim()
  if (name.length < 2) throw new ValidationError({ name: 'at least 2 characters' })
  const mail = email(b)
  if (isOwner(mail)) return c.json({ error: 'owner_google_required' }, 422)
  const password = str(b, 'password', { min: 8, max: 200, required: true })!

  const exists = await c.env.DB.prepare('SELECT 1 FROM users WHERE email = ?').bind(mail).first()
  if (exists) throw new ValidationError({ email: 'already registered' })

  const res = await c.env.DB.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .bind(name, mail, await hashPassword(password))
    .run()
  const userId = Number(res.meta.last_row_id)
  const user = (await c.env.DB.prepare('SELECT id, name, email, created_at, avatar, google_sub FROM users WHERE id = ?').bind(userId).first<UserRow>())!

  // Optional one-time migration: the visitor's localStorage progress blob moves into the account.
  const local = b.progress
  if (local !== undefined) {
    const data = JSON.stringify(local)
    if (data.length > MAX_PROGRESS_BYTES) throw new ValidationError({ progress: 'too large' })
    await saveProgress(c.env.DB, userId, data, new Date().toISOString())
  }

  return c.json({ user: publicUser(user), token: await openSession(c.env.DB, userId) }, 201)
})

app.post('/api/auth/login', async (c) => {
  const b = await json(c)
  const mail = email(b)
  if (isOwner(mail)) return c.json({ error: 'owner_google_required' }, 422)
  const password = str(b, 'password', { max: 200, required: true })!
  const row = await c.env.DB.prepare('SELECT id, name, email, created_at, password_hash, avatar, google_sub FROM users WHERE email = ?')
    .bind(mail)
    .first<UserRow & { password_hash: string }>()
  // Run a hash even for unknown emails so timing does not reveal which emails exist.
  const ok = row ? await verifyPassword(password, row.password_hash) : (await hashPassword(password), false)
  if (!row || !ok) return c.json({ error: 'invalid_credentials' }, 401)
  return c.json({ user: publicUser(row), token: await openSession(c.env.DB, row.id) })
})

app.use('/api/auth/logout', auth)
app.post('/api/auth/logout', async (c) => {
  const token = /^Bearer (.+)$/.exec(c.req.header('Authorization') ?? '')![1]
  await c.env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256Hex(token)).run()
  return c.json({ message: 'logged_out' })
})

// ---------- me ----------
app.use('/api/me', auth)
app.get('/api/me', async (c) => {
  const u = (await c.env.DB.prepare('SELECT id, name, email, created_at, avatar, google_sub FROM users WHERE id = ?').bind(c.get('userId')).first<UserRow>())!
  return c.json({ user: publicUser(u, c.req.header('Authorization')?.slice(7) ?? '') })
})
const AVATAR_RE = /^(https:\/\/lh3\.googleusercontent\.com\/[\w=\-]+|data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+)$/
const AVATAR_MAX = 41_000 // ~30KB image as a base64 data URL

app.patch('/api/me', async (c) => {
  const b = await json(c)
  const name = str(b, 'name', { min: 2, max: 60 })?.trim()
  if (name) await c.env.DB.prepare('UPDATE users SET name = ? WHERE id = ?').bind(name, c.get('userId')).run()
  if ('avatar' in b) {
    const a = b.avatar
    if (a === null || a === '') {
      await c.env.DB.prepare('UPDATE users SET avatar = NULL WHERE id = ?').bind(c.get('userId')).run()
    } else if (typeof a === 'string' && a.length <= AVATAR_MAX && AVATAR_RE.test(a)) {
      await c.env.DB.prepare('UPDATE users SET avatar = ? WHERE id = ?').bind(a, c.get('userId')).run()
    } else {
      throw new ValidationError({ avatar: 'image must be a jpeg/png/webp data URL under 30KB' })
    }
  }
  const u = (await c.env.DB.prepare('SELECT id, name, email, created_at, avatar, google_sub FROM users WHERE id = ?').bind(c.get('userId')).first<UserRow>())!
  return c.json({ user: publicUser(u, c.req.header('Authorization')?.slice(7) ?? '') })
})

// ---------- progress sync ----------
app.use('/api/progress', auth)

app.get('/api/progress', async (c) => {
  const row = await c.env.DB.prepare('SELECT data, updated_at FROM progress WHERE user_id = ?').bind(c.get('userId')).first<{ data: string; updated_at: string }>()
  return c.json({ progress: row ? JSON.parse(row.data) : null, updated_at: row?.updated_at ?? null })
})

app.put('/api/progress', async (c) => {
  const raw = await c.req.text()
  if (raw.length > MAX_PROGRESS_BYTES) throw new ValidationError({ progress: 'too large' })
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new ValidationError({ body: 'invalid JSON' })
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new ValidationError({ progress: 'object expected' })
  const body = parsed as Record<string, unknown>
  const data = JSON.stringify(body.progress ?? body)
  const now = new Date().toISOString()
  await saveProgress(c.env.DB, c.get('userId'), data, now)
  return c.json({ progress: JSON.parse(data), updated_at: now })
})


// ---------- admin (server-checked, owner account only) ----------
const ADMIN_EMAILS = ['3asfuur@gmail.com']

const adminOnly: MiddlewareHandler<Env> = async (c, next) => {
  const u = await c.env.DB.prepare('SELECT email, google_sub FROM users WHERE id = ?').bind(c.get('userId')).first<{ email: string; google_sub: string | null }>()
  if (!u || !isOwner(u.email)) return c.json({ error: 'forbidden' }, 403)
  if (!isOwnerGoogleSession(u, c.req.header('Authorization')?.slice(7) ?? '')) return c.json({ error: 'google_reauth_required' }, 428)
  await next()
}

const maskEmail = (e: string) => {
  const [name, domain] = e.split('@')
  if (!domain) return '***'
  return `${name.slice(0, 2)}***@${domain}`
}

app.use('/api/admin/*', auth, adminOnly)

app.get('/api/admin/overview', async (c) => {
  const db = c.env.DB
  const users = await db.prepare('SELECT COUNT(*) AS n FROM users').first<{ n: number }>()
  const sessions = await db.prepare('SELECT COUNT(*) AS n FROM sessions WHERE expires_at > ?').bind(new Date().toISOString()).first<{ n: number }>()
  const progressRows = await db.prepare('SELECT COUNT(*) AS n FROM progress').first<{ n: number }>()
  const newUsers = await db.prepare("SELECT COUNT(*) AS n FROM users WHERE created_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-7 days')").first<{ n: number }>()
  const recent = await db.prepare('SELECT name, email, created_at FROM users ORDER BY created_at DESC LIMIT 8').all<{ name: string; email: string; created_at: string }>()
  return c.json({
    counts: { users: users?.n ?? 0, newUsers: newUsers?.n ?? 0, sessions: sessions?.n ?? 0, progress: progressRows?.n ?? 0 },
    recentUsers: (recent.results ?? []).map((u) => ({ name: u.name, email: maskEmail(u.email), createdAt: u.created_at })),
    health: {
      database: true,
      google: googleConfigured(c.env),
      origin: 'https://henglish.pages.dev',
      adminCount: ADMIN_EMAILS.length,
    },
    generatedAt: new Date().toISOString(),
  })
})

app.get('/api/leaderboard', async (c) => {
  c.header('Cache-Control', 'no-store')
  const rows = await c.env.DB.prepare('SELECT u.id, u.name, u.email, u.google_sub, u.avatar, p.data FROM users u LEFT JOIN progress p ON u.id = p.user_id').all<import('./leaderboard').LeaderboardAccount>()
  let viewerId: number | null = null
  const token = /^Bearer (.+)$/.exec(c.req.header('Authorization') ?? '')?.[1]
  if (token) {
    const session = await c.env.DB.prepare('SELECT user_id FROM sessions WHERE token_hash = ? AND expires_at > ?').bind(await sha256Hex(token), new Date().toISOString()).first<{user_id: number}>()
    viewerId = session?.user_id ?? null
  }
  return c.json(buildLeaderboard(rows.results ?? [], viewerId))
})

export default app
