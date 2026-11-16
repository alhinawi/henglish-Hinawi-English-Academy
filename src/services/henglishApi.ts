// ==============================================================================
// Henglish Accounts API client (Cloudflare Workers + D1, see backend/)
// Owns the Bearer token lifecycle for the Henglish backend. Independent of
// authService to avoid circular imports; authService writes the token here.
// ==============================================================================

const API_BASE = 'https://henglish-api.hnz.workers.dev';
const TOKEN_KEY = 'henglish_api_token';

// The owner account must sign in via Google. A stale password-minted session
// makes the API answer 428 google_reauth_required on every authed call; the
// app listens for this event, drops the dead session and offers Google sign-in.
export const GOOGLE_REAUTH_EVENT = 'henglish:google-reauth-required';
export const GOOGLE_REAUTH_MESSAGE =
  'ae.googleRequired';

function notifyGoogleReauth(): void {
  clearHenglishApiToken();
  try {
    window.dispatchEvent(new CustomEvent(GOOGLE_REAUTH_EVENT));
  } catch {
    // ignore
  }
}

// True when the response is the owner-Google 428 (and handles it).
async function checkGoogleReauth(res: Response): Promise<boolean> {
  if (res.status !== 428) return false;
  const body = await res.clone().json().catch(() => null);
  if (body && body.error === 'google_reauth_required') {
    notifyGoogleReauth();
    return true;
  }
  return false;
}

export interface ApiUser {
  is_admin?: boolean;
  id: number;
  name: string;
  email: string;
  created_at: string;
  avatar: string | null;
}

export interface ApiAuthResult {
  success: boolean;
  user?: ApiUser;
  token?: string;
  error?: string;
}

export function saveHenglishApiToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function getHenglishApiToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearHenglishApiToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

// ---------- Google OAuth ----------

export interface AuthConfig {
  google: boolean;
}

// Which sign-in providers the backend is configured for. Defaults to
// google:false so the button stays hidden whenever the check fails.
export async function apiGetAuthConfig(): Promise<AuthConfig> {
  try {
    const res = await fetch(`${API_BASE}/api/auth/config`);
    if (!res.ok) return { google: false };
    const body = await res.json();
    return { google: Boolean(body && body.google) };
  } catch {
    return { google: false };
  }
}

// Where the site sends the browser to start Google sign-in.
export function googleLoginUrl(): string {
  return `${API_BASE}/api/auth/google/start?origin=${encodeURIComponent(window.location.origin)}`;
}

// The worker redirects back to <origin>/#auth-callback?token=...&provider=google
// after Google sign-in. Reads and clears that hash, saving the API token.
// Returns the token (or an "error:<code>" string) when a callback was consumed.
export function consumeGoogleAuthCallback(): string | null {
  if (typeof window === 'undefined') return null;
  const m = /^#auth-callback\?(.*)$/.exec(window.location.hash);
  if (!m) return null;
  const params = new URLSearchParams(m[1]);
  const token = params.get('token');
  const error = params.get('error');
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#movies`);
  if (token) {
    saveHenglishApiToken(token);
    return token;
  }
  return error ? `error:${error}` : null;
}

export interface AdminOverview {
  counts: { users: number; newUsers: number; sessions: number; progress: number };
  recentUsers: { name: string; email: string; createdAt: string }[];
  health: { database: boolean; google: boolean; origin: string; adminCount: number };
  generatedAt: string;
}

// Server-checked admin overview. 401 = not signed in, 403 = signed in but not admin.
export async function apiAdminOverview(
  token: string
): Promise<{ status: number; body: AdminOverview | null }> {
  try {
    const res = await fetch(`${API_BASE}/api/admin/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      await checkGoogleReauth(res);
      return { status: res.status, body: null };
    }
    return { status: res.status, body: (await res.json()) as AdminOverview };
  } catch {
    return { status: 0, body: null };
  }
}

export async function apiGetMe(token: string): Promise<{ user: ApiUser } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      await checkGoogleReauth(res);
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}
export type ApiUpdateMeResult =
  | { ok: true; user: ApiUser }
  | { ok: false; googleReauth: boolean };

export async function apiUpdateMe(
  token: string,
  patch: { name?: string; avatar?: string | null }
): Promise<ApiUpdateMeResult> {
  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return { ok: false, googleReauth: await checkGoogleReauth(res) };
    const body = (await res.json()) as { user: ApiUser };
    return { ok: true, user: body.user };
  } catch {
    return { ok: false, googleReauth: false };
  }
}


function mapApiError(status: number, body: any): string {
  if (body?.error === 'owner_google_required' || body?.error === 'google_reauth_required') return GOOGLE_REAUTH_MESSAGE;
  const fields = body && body.fields ? body.fields : {};
  if (fields.email === 'already registered') return 'ae.already';
  if (fields.password) return 'ae.password8';
  if (fields.name) return 'ae.name';
  if (fields.email) return 'ae.email';
  if (body && body.error === 'invalid_credentials') return 'ae.invalid';
  if (body && body.error === 'unauthorized') return 'ae.expired';
  if (status === 422) return 'ae.incomplete';
  return 'ae.retry';
}

async function post<T>(path: string, payload: unknown, token?: string): Promise<{ status: number; body: T | any }> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

export async function apiRegister(params: {
  name: string;
  email: string;
  password: string;
  progress?: unknown;
}): Promise<ApiAuthResult> {
  try {
    const { status, body } = await post('/api/auth/register', params);
    if ((status === 200 || status === 201) && body.user && body.token) {
      saveHenglishApiToken(body.token);
      return { success: true, user: body.user, token: body.token };
    }
    return { success: false, error: mapApiError(status, body) };
  } catch {
    return { success: false, error: 'ae.offline' };
  }
}

export async function apiLogin(email: string, password: string): Promise<ApiAuthResult> {
  try {
    const { status, body } = await post('/api/auth/login', { email, password });
    if (status === 200 && body.user && body.token) {
      saveHenglishApiToken(body.token);
      return { success: true, user: body.user, token: body.token };
    }
    return { success: false, error: mapApiError(status, body) };
  } catch {
    return { success: false, error: 'ae.offline' };
  }
}

export async function apiLogout(): Promise<void> {
  const token = getHenglishApiToken();
  clearHenglishApiToken();
  if (!token) return;
  try {
    await post('/api/auth/logout', {}, token);
  } catch {
    // ignore network errors on logout
  }
}

export async function apiGetProgress(token: string): Promise<{ progress: any; updated_at: string | null } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      await checkGoogleReauth(res);
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiPutProgress(token: string, progress: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ progress }),
    });
    if (!res.ok) await checkGoogleReauth(res);
    return res.ok;
  } catch {
    return false;
  }
}


export interface LeaderboardRow { rank: number; name: string; points: number; avatar: string | null; pinned: boolean }
export interface LeaderboardResult { top: LeaderboardRow[]; me: { rank: number; points: number } | null; realCount: number }
export async function apiLeaderboard(): Promise<LeaderboardResult | null> {
  try {
    const token = getHenglishApiToken();
    const res = await fetch(`${API_BASE}/api/leaderboard`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!res.ok) {
      await checkGoogleReauth(res);
      return null;
    }
    return await res.json();
  } catch { return null; }
}
