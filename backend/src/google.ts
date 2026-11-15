// Google OAuth 2.0 sign-in (authorization-code flow, Workers/Hono friendly).
//
// Active only when the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET secrets are
// set on the worker; /api/auth/config reports google:false until then and the
// site keeps the button hidden, so deploying this file changes nothing for
// users until the keys exist.
//
// Flow: site -> GET /api/auth/google/start?origin=<site origin>
//        -> 302 to Google consent -> Google redirects back to
//        GET /api/auth/google/callback?code&state
//        -> token exchange + OpenID userinfo -> find/link/create user
//        -> 302 to <origin>/#auth-callback?token=<session>&provider=google

import { newToken } from './crypto'

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'
const STATE_TTL_MS = 10 * 60 * 1000

interface GoogleEnv {
  GOOGLE_CLIENT_ID?: string
  GOOGLE_CLIENT_SECRET?: string
  ALLOWED_ORIGINS: string
  DB: D1Database
}

export function googleConfigured(env: GoogleEnv): boolean {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
}

const jsonError = (error: string, status: number) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

function callbackUrl(requestUrl: string): string {
  return `${new URL(requestUrl).origin}/api/auth/google/callback`
}

function allowedOrigin(env: GoogleEnv, origin: string | null): string | null {
  if (!origin) return null
  const allowed = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  return allowed.includes(origin) ? origin : null
}

export async function startGoogleLogin(request: Request, env: GoogleEnv): Promise<Response> {
  if (!googleConfigured(env)) return jsonError('google_not_configured', 404)
  const origin = allowedOrigin(env, new URL(request.url).searchParams.get('origin'))
  if (!origin) return jsonError('bad_origin', 400)

  const state = newToken()
  const expires = new Date(Date.now() + STATE_TTL_MS).toISOString()
  await env.DB.prepare('INSERT INTO oauth_states (state, origin, expires_at) VALUES (?, ?, ?)')
    .bind(state, origin, expires)
    .run()

  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID!,
    redirect_uri: callbackUrl(request.url),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  })
  return Response.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`, 302)
}

interface GoogleUserInfo {
  sub: string
  email?: string
  email_verified?: boolean
  name?: string
  picture?: string
}

interface UserRow {
  id: number
  name: string
  email: string
  created_at: string
}

const redirectBack = (origin: string, params: Record<string, string>) =>
  Response.redirect(`${origin}/#auth-callback?${new URLSearchParams(params).toString()}`, 302)

export async function finishGoogleLogin(request: Request, env: GoogleEnv, openSession: (db: D1Database, userId: number) => Promise<string>): Promise<Response> {
  if (!googleConfigured(env)) return jsonError('google_not_configured', 404)
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  const row = state
    ? await env.DB.prepare('SELECT origin, expires_at FROM oauth_states WHERE state = ?').bind(state).first<{ origin: string; expires_at: string }>()
    : null
  if (state) await env.DB.prepare('DELETE FROM oauth_states WHERE state = ?').bind(state).run()
  // Without a valid state we have no trusted origin to redirect to, so answer plain JSON.
  if (!code || !row) return jsonError('invalid_state', 400)
  if (new Date(row.expires_at).getTime() < Date.now()) return redirectBack(row.origin, { error: 'google_state_expired' })
  if (url.searchParams.get('error')) return redirectBack(row.origin, { error: 'google_denied' })

  // Exchange the authorization code for tokens.
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID!,
      client_secret: env.GOOGLE_CLIENT_SECRET!,
      code,
      grant_type: 'authorization_code',
      redirect_uri: callbackUrl(request.url),
    }).toString(),
  })
  if (!tokenRes.ok) return redirectBack(row.origin, { error: 'google_exchange_failed' })
  const tokens = (await tokenRes.json()) as { access_token?: string }
  if (!tokens.access_token) return redirectBack(row.origin, { error: 'google_exchange_failed' })

  // Who is this? (access token came straight from Google over TLS)
  const infoRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  if (!infoRes.ok) return redirectBack(row.origin, { error: 'google_userinfo_failed' })
  const info = (await infoRes.json()) as GoogleUserInfo
  if (!info.sub || !info.email || info.email_verified === false) {
    return redirectBack(row.origin, { error: 'google_email_unverified' })
  }
  const mail = info.email.trim().toLowerCase()
  const displayName = (info.name || mail.split('@')[0]).trim().slice(0, 60) || 'Learner'

  // 1) Known Google identity -> its account.
  let user = await env.DB.prepare('SELECT id, name, email, created_at, avatar FROM users WHERE google_sub = ?')
    .bind(info.sub)
    .first<UserRow>()

  // 2) Same email already registered with a password -> link Google to that account.
  if (!user) {
    const byEmail = await env.DB.prepare('SELECT id, name, email, created_at, avatar FROM users WHERE email = ?')
      .bind(mail)
      .first<UserRow>()
    if (byEmail) {
      await env.DB.prepare('UPDATE users SET google_sub = ? WHERE id = ?').bind(info.sub, byEmail.id).run()
      user = byEmail
    }
  }

  // 3) Brand new learner -> create the account (no password; Google-only).
  if (!user) {
    const res = await env.DB.prepare('INSERT INTO users (name, email, password_hash, google_sub, avatar) VALUES (?, ?, ?, ?, ?)')
      .bind(displayName, mail, '', info.sub, info.picture ?? null)
      .run()
    user = (await env.DB.prepare('SELECT id, name, email, created_at, avatar FROM users WHERE id = ?')
      .bind(Number(res.meta.last_row_id))
      .first<UserRow>())!
  }

  // Pull the Google profile picture when the account has no avatar yet.
  if (info.picture && !(user as { avatar?: string | null }).avatar) {
    await env.DB.prepare('UPDATE users SET avatar = ? WHERE id = ?').bind(info.picture, user.id).run()
  }

  const token = await openSession(env.DB, user.id)
  return redirectBack(row.origin, { token, provider: 'google' })
}
