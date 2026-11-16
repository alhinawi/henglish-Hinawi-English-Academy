import { getEnvVar } from '../utils/env';
import { createClient, SupabaseClient, User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';
import { UserProfile, CEFRLevel, UserRole } from '../types';
import { apiRegister, apiLogin, apiLogout, apiGetMe, ApiUser } from './henglishApi';

export type { UserProfile, CEFRLevel, UserRole };

export type SessionType = 'guest' | 'authenticated';

export interface AuthSessionState {
  type: SessionType;
  user: UserProfile;
  isLoggedIn: boolean;
  isEmailVerified: boolean;
  accessToken?: string;
  errorMessage?: string;
}

const AUTH_STORAGE_KEY = 'henglish_auth_session';
// Neutral placeholder shown until the user picks their own picture (no
// external photo by default). Google sign-in fills the Google picture instead.
export const ANONYMOUS_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'><rect width='96' height='96' fill='%23334155'/><circle cx='48' cy='36' r='16' fill='%2394a3b8'/><path d='M16 88c4-20 16-28 32-28s28 8 32 28z' fill='%2394a3b8'/></svg>";

const GUEST_DATA_KEY = 'henglish_guest_local_progress';

export const GUEST_PROFILE: UserProfile = {
  id: 'guest-learner',
  name: 'Guest Learner',
  nameAr: 'طالب زائر (Guest)',
  email: 'guest@henglish.academy',
  avatar: ANONYMOUS_AVATAR,
  role: 'student',
  currentLevel: 'A1',
  targetLevel: 'B2',
  // Guests start at real zero — no pre-seeded XP or streak (no-fake-data rule).
  xp: 0,
  streakDays: 0,
  joinedDate: '2026-10-30',
  bio: 'وضع الزائر: يمكنك تجربة الدروس والمحاكاة، وحفظ تقدمك مؤقتاً في متصفحك.',
};

// ==============================================================================
// SUPABASE CLIENT INITIALIZATION & VALIDATION
// ==============================================================================

/**
 * Validates if the configured Supabase URL and Anon Key are genuine production credentials,
 * rather than unconfigured placeholders (e.g. 'https://your-project-id.supabase.co').
 */
export function isSupabaseConfigured(): boolean {
  const rawUrl = (
    getEnvVar('VITE_SUPABASE_URL') ||
    (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
    ''
  ).trim();
  const rawKey = (
    getEnvVar('VITE_SUPABASE_ANON_KEY') ||
    (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY)) ||
    ''
  ).trim();

  if (!rawUrl || !rawKey) return false;
  if (!rawUrl.startsWith('https://') && !rawUrl.startsWith('http://')) return false;

  // Placeholder detection
  if (
    rawUrl.includes('your-project-id') ||
    rawUrl.includes('example.supabase.co') ||
    rawUrl.includes('placeholder')
  ) {
    return false;
  }
  if (
    rawKey.includes('your_supabase_anon') ||
    rawKey.includes('placeholder') ||
    rawKey.length < 20
  ) {
    return false;
  }

  return true;
}

export let supabase: SupabaseClient | null = null;

export function initSupabaseClient(): SupabaseClient | null {
  if (isSupabaseConfigured()) {
    const rawUrl = (
      getEnvVar('VITE_SUPABASE_URL') ||
      (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
      ''
    ).trim();
    const rawKey = (
      getEnvVar('VITE_SUPABASE_ANON_KEY') ||
      (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY)) ||
      ''
    ).trim();

    supabase = createClient(rawUrl, rawKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } else {
    supabase = null;
  }
  return supabase;
}

// Initial client instantiation
initSupabaseClient();

// ==============================================================================
// ERROR NORMALIZATION HELPER
// ==============================================================================

export function normalizeAuthError(err: unknown): string {
  if (!err) return 'حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.';
  const msg = err instanceof Error ? err.message : String(err);

  // Network / Connectivity errors
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('fetch failed')) {
    if (!isSupabaseConfigured()) {
      return 'تعذر الاتصال بخادم قاعدة البيانات. يرجى تهيئة متغيرات VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في إعدادات البيئة (Vercel).';
    }
    return 'تعذر الاتصال بخادم المصادقة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.';
  }

  // Supabase Auth specific error codes & descriptions
  if (msg.includes('Invalid login credentials')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق والمحاولة مرة أخرى.';
  }
  if (msg.includes('Email not confirmed')) {
    return 'البريد الإلكتروني لم يتم تأكيده بعد. يرجى تفعيل حسابك عبر رمز التحقق (OTP).';
  }
  if (msg.includes('User already registered') || msg.includes('email address is already registered')) {
    return 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استعادة كلمة المرور.';
  }
  if (msg.includes('Password should be at least')) {
    return 'كلمة المرور ضعيفة. يجب ألا تقل عن 6 أحرف.';
  }
  if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit')) {
    return 'تم إرسال عدد كبير من الطلبات. يرجى الانتظار دقيقة قبل المحاولة مجدداً.';
  }

  return msg;
}

// ==============================================================================
// SESSION PERSISTENCE & STORAGE
// ==============================================================================

export function getSavedAuthSession(): AuthSessionState {
  if (typeof window === 'undefined') {
    return { type: 'guest', user: GUEST_PROFILE, isLoggedIn: false, isEmailVerified: false };
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.user) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return { type: 'guest', user: GUEST_PROFILE, isLoggedIn: false, isEmailVerified: false };
}

// Completes a Google sign-in: the worker already saved the API token after the
// OAuth redirect; we fetch the account and persist a normal session.
export async function completeGoogleSignIn(token: string): Promise<{ success: boolean; session?: AuthSessionState; error?: string }> {
  const me = await apiGetMe(token);
  if (!me || !me.user) {
    return { success: false, error: 'تعذر إكمال تسجيل الدخول بحساب Google. حاول مرة تانية.' };
  }
  const session: AuthSessionState = {
    type: 'authenticated',
    user: mapApiUserToProfile(me.user),
    isLoggedIn: true,
    isEmailVerified: true,
    accessToken: token,
  };
  saveAuthSession(session);
  return { success: true, session };
}

export function saveAuthSession(session: AuthSessionState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ==============================================================================
// PROFILE NORMALIZATION HELPER
// ==============================================================================

export function mapSupabaseUserToProfile(
  authUser: SupabaseUser,
  profileRow?: Record<string, unknown> | null
): UserProfile {
  const metadata = authUser.user_metadata || {};
  const role: UserRole = (profileRow?.role as UserRole) || (metadata.role as UserRole) || 'student';
  const name = (profileRow?.full_name as string) || (metadata.full_name as string) || (authUser.email?.split('@')[0] ?? 'Learner');
  const nameAr = (profileRow?.full_name_ar as string) || (metadata.full_name_ar as string) || name;
  const currentLevel: CEFRLevel = (profileRow?.current_level as CEFRLevel) || (metadata.current_level as CEFRLevel) || 'A1';
  const targetLevel: CEFRLevel = (profileRow?.target_level as CEFRLevel) || (metadata.target_level as CEFRLevel) || 'B2';
  const xp = typeof profileRow?.xp_points === 'number' ? profileRow.xp_points : (metadata.xp as number) || 100;
  const streakDays = typeof profileRow?.streak_days === 'number' ? profileRow.streak_days : (metadata.streak_days as number) || 1;
  const avatar = (profileRow?.avatar_url as string) || (metadata.avatar_url as string) || ANONYMOUS_AVATAR;

  return {
    id: authUser.id,
    name,
    nameAr,
    email: authUser.email || '',
    avatar,
    role,
    currentLevel,
    targetLevel,
    xp,
    streakDays,
    joinedDate: authUser.created_at ? authUser.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    bio: (profileRow?.bio as string) || metadata.bio || 'طالب متميز في Henglish Academy',
  };
}

// ==============================================================================
// AUTHENTICATION ACTIONS (SUPABASE + RESILIENT OFFLINE FALLBACK)
// ==============================================================================

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  fullNameAr?: string;
  username?: string;
  phone?: string;
  role?: UserRole;
}

// Maps a Henglish Accounts API user record to the app's UserProfile shape.
export function mapApiUserToProfile(u: ApiUser, role: UserRole = 'student'): UserProfile {
  return {
    id: `u-${u.id}`,
    name: u.name,
    nameAr: u.name,
    email: u.email,
    avatar: u.avatar || ANONYMOUS_AVATAR,
    role: u.is_admin ? 'admin' : role === 'admin' ? 'student' : role,
    currentLevel: 'A1',
    targetLevel: 'B2',
    xp: 0,
    streakDays: 1,
    joinedDate: (u.created_at || new Date().toISOString()).split('T')[0],
  };
}

export async function signUpUser(params: SignUpParams): Promise<{ success: boolean; session?: AuthSessionState; error?: string }> {
  const { email, password, fullName, fullNameAr, username, phone, role = 'student' } = params;
  const cleanEmail = email.trim().toLowerCase();

  // 1. Henglish Accounts API (Cloudflare Workers + D1) - the production backend.
  // The visitor's localStorage progress blob migrates into the new account in the same call.
  let localProgress: unknown = undefined;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('hinawi_english_progress_v2') : null;
    if (raw) localProgress = JSON.parse(raw);
  } catch {
    localProgress = undefined;
  }
  const apiResult = await apiRegister({
    name: (fullNameAr || fullName).trim(),
    email: cleanEmail,
    password,
    ...(localProgress ? { progress: localProgress } : {}),
  });
  if (!apiResult.success) return { success: false, error: apiResult.error };
  const apiSession: AuthSessionState = {
    type: 'authenticated',
    user: mapApiUserToProfile(apiResult.user!, role),
    isLoggedIn: true,
    isEmailVerified: true,
    accessToken: apiResult.token,
  };
  saveAuthSession(apiSession);
  return { success: true, session: apiSession };
}

export async function signInUser(
  identifier: string, // Email or Username
  password?: string
): Promise<{ success: boolean; session?: AuthSessionState; error?: string }> {
  const clean = identifier.trim().toLowerCase();

  // 2. Henglish Accounts API (Cloudflare Workers + D1) - the production backend
  if (password) {
    if (!clean.includes('@')) {
      return { success: false, error: 'سجّل الدخول بالإيميل بتاعك.' };
    }
    const apiResult = await apiLogin(clean, password);
    if (!apiResult.success) return { success: false, error: apiResult.error };
    const apiSession: AuthSessionState = {
      type: 'authenticated',
      user: mapApiUserToProfile(apiResult.user!),
      isLoggedIn: true,
      isEmailVerified: true,
      accessToken: apiResult.token,
    };
    saveAuthSession(apiSession);
    return { success: true, session: apiSession };
  }

  // 3. Legacy Supabase Authentication (kept for reference if configured later)
  if (supabase && password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: clean,
        password,
      });

      if (error) {
        return { success: false, error: normalizeAuthError(error) };
      }

      if (data.user) {
        // Fetch detailed profile row from public.profiles
        let profileRow: Record<string, unknown> | null = null;
        try {
          const { data: pRow } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          profileRow = pRow;
        } catch {
          // Ignore profile row fetch error and use metadata fallback
        }

        const isVerified = Boolean(data.user.email_confirmed_at);
        const profile = mapSupabaseUserToProfile(data.user, profileRow);
        const sessionState: AuthSessionState = {
          type: 'authenticated',
          user: profile,
          isLoggedIn: true,
          isEmailVerified: isVerified,
          accessToken: data.session?.access_token,
        };
        saveAuthSession(sessionState);
        return { success: true, session: sessionState };
      }
    } catch (err: unknown) {
      return { success: false, error: normalizeAuthError(err) };
    }
  }

  return { success: false, error: 'خادم الحسابات غير متاح حالياً. حاول مرة تانية.' };
}

export async function verifyEmailOtp(email: string, token: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type: 'signup',
      });
      if (error) return { success: false, error: normalizeAuthError(error) };

      // Update local session state
      const current = getSavedAuthSession();
      if (current.isLoggedIn) {
        current.isEmailVerified = true;
        saveAuthSession(current);
      }
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: normalizeAuthError(err) };
    }
  }

  // Local fallback: any 6-digit token succeeds for unconfigured environments
  if (token.trim().length === 6) {
    const current = getSavedAuthSession();
    current.isEmailVerified = true;
    saveAuthSession(current);
    return { success: true };
  }
  return { success: false, error: 'رمز التحقق غير صالح، يرجى إدخال 6 أرقام.' };
}

export async function resendVerificationOtp(email: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
      });
      if (error) return { success: false, error: normalizeAuthError(error) };
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: normalizeAuthError(err) };
    }
  }
  return { success: true };
}

export async function requestPasswordRecovery(email: string): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (supabase) {
    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/#reset-password` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo,
      });
      if (error) return { success: false, error: normalizeAuthError(error) };
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: normalizeAuthError(err) };
    }
  }
  return { success: false, error: 'auth.recoveryUnavailable' };
}

export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) return { success: false, error: normalizeAuthError(error) };

      // Dispatch asynchronous password changed security alert via Brevo SMTP
      try {
        const current = getSavedAuthSession();
        if (current?.user?.email && typeof window !== 'undefined') {
          fetch('/api/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'password_changed',
              to: current.user.email,
              name: current.user.name,
            }),
          }).catch(() => {});
        }
      } catch {
        // Non-blocking security alert
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: normalizeAuthError(err) };
    }
  }
  return { success: false, error: 'auth.passwordUpdateUnavailable' };
}

export async function signOutUser(): Promise<void> {
  await apiLogout();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }
  clearAuthSession();
}

// ==============================================================================
// GUEST MODE CONTROLS
// ==============================================================================

export function switchGuestMode(): AuthSessionState {
  const session: AuthSessionState = {
    type: 'guest',
    user: GUEST_PROFILE,
    isLoggedIn: false,
    isEmailVerified: false,
  };
  saveAuthSession(session);
  return session;
}

export function saveGuestLocalData(key: string, data: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem(GUEST_DATA_KEY) || '{}');
    existing[key] = data;
    localStorage.setItem(GUEST_DATA_KEY, JSON.stringify(existing));
  } catch {
    // ignore
  }
}

export function getGuestLocalData(): Record<string, unknown> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(GUEST_DATA_KEY) || '{}');
  } catch {
    return {};
  }
}

export function clearGuestLocalData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(GUEST_DATA_KEY);
  } catch {
    // ignore
  }
}
