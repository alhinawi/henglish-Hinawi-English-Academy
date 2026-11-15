// ==============================================================================
// Henglish Accounts API client (Cloudflare Workers + D1, see backend/)
// Owns the Bearer token lifecycle for the Henglish backend. Independent of
// authService to avoid circular imports; authService writes the token here.
// ==============================================================================

const API_BASE = 'https://henglish-api.hnz.workers.dev';
const TOKEN_KEY = 'henglish_api_token';

export interface ApiUser {
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

export async function apiGetMe(token: string): Promise<{ user: ApiUser } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
export async function apiUpdateMe(
  token: string,
  patch: { name?: string; avatar?: string | null }
): Promise<{ user: ApiUser } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return null;
    return (await res.json()) as { user: ApiUser };
  } catch {
    return null;
  }
}


function mapApiError(status: number, body: any): string {
  const fields = body && body.fields ? body.fields : {};
  if (fields.email === 'already registered') return 'الإيميل ده مسجل قبل كده. جرّب تسجيل الدخول.';
  if (fields.password) return 'كلمة السر لازم تكون 8 حروف على الأقل.';
  if (fields.name) return 'الاسم لازم يكون حرفين على الأقل.';
  if (fields.email) return 'صيغة الإيميل مش صحيحة.';
  if (body && body.error === 'invalid_credentials') return 'الإيميل أو كلمة السر غلط.';
  if (body && body.error === 'unauthorized') return 'الجلسة انتهت. سجّل الدخول من جديد.';
  if (status === 422) return 'البيانات المدخلة غير مكتملة.';
  return 'حدث خطأ غير متوقع. حاول مرة تانية.';
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
    return { success: false, error: 'مش قادرين نوصل للسيرفر. اتأكد من النت وجرب تاني.' };
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
    return { success: false, error: 'مش قادرين نوصل للسيرفر. اتأكد من النت وجرب تاني.' };
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
    if (!res.ok) return null;
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
    return res.ok;
  } catch {
    return false;
  }
}
