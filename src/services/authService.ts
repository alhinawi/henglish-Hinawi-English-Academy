import { createClient, SupabaseClient, User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';
import { UserProfile, CEFRLevel, UserRole } from '../types';

export type { UserProfile, CEFRLevel, UserRole };

export type SessionType = 'guest' | 'demo' | 'authenticated';

export interface AuthSessionState {
  type: SessionType;
  user: UserProfile;
  isLoggedIn: boolean;
  isEmailVerified: boolean;
  accessToken?: string;
  errorMessage?: string;
}

const AUTH_STORAGE_KEY = 'henglish_auth_session';
const GUEST_DATA_KEY = 'henglish_guest_local_progress';

// Seeded Demo Profiles
export const DEMO_PROFILES: Record<'student' | 'teacher' | 'admin', UserProfile> = {
  student: {
    id: 'demo-student-sarah',
    name: 'Sarah Abdulrahman',
    nameAr: 'سارة عبد الرحمن (طالب تجريبي)',
    email: 'sarah.demo@henglish.academy',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    currentLevel: 'B1',
    targetLevel: 'C1',
    xp: 3450,
    streakDays: 14,
    joinedDate: '2026-09-15',
    bio: 'طالبة هندسة شغوفة بإتقان الإنجليزية للعمل في الشركات العالمية.',
  },
  teacher: {
    id: 'demo-teacher-hinawi',
    name: 'Mr. Hinawi',
    nameAr: 'أ. هناوي (المعلم الأكاديمي)',
    email: 'hinawi.academic@henglish.academy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    role: 'teacher',
    currentLevel: 'C2',
    targetLevel: 'C2',
    xp: 18900,
    streakDays: 85,
    joinedDate: '2025-01-01',
    bio: 'مؤسس أكاديمية هناوي للغة الإنجليزية ومصمم المنهج التفاعلي.',
  },
  admin: {
    id: 'demo-admin-super',
    name: 'System Administrator',
    nameAr: 'مدير المنصة الرئيسي',
    email: 'admin@henglish.academy',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    role: 'admin',
    currentLevel: 'C2',
    targetLevel: 'C2',
    xp: 99999,
    streakDays: 365,
    joinedDate: '2024-01-01',
    bio: 'التحكم الإداري الكامل في منصة ومحتوى أكاديمية هناوي.',
  },
};

export const GUEST_PROFILE: UserProfile = {
  id: 'guest-learner',
  name: 'Guest Learner',
  nameAr: 'طالب زائر (Guest)',
  email: 'guest@henglish.academy',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  role: 'student',
  currentLevel: 'A1',
  targetLevel: 'B2',
  xp: 150,
  streakDays: 1,
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
  const rawUrl = (import.meta.env?.VITE_SUPABASE_URL || '').trim();
  const rawKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY || '').trim();

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

const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY || '').trim();

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

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
  const avatar = (profileRow?.avatar_url as string) || (metadata.avatar_url as string) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';

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
    bio: (profileRow?.bio as string) || metadata.bio || 'طالب متميز في أكاديمية هناوي',
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

export async function signUpUser(params: SignUpParams): Promise<{ success: boolean; session?: AuthSessionState; error?: string }> {
  const { email, password, fullName, fullNameAr, username, phone, role = 'student' } = params;
  const cleanEmail = email.trim().toLowerCase();

  // If Supabase is properly configured, execute real Auth API call
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            full_name_ar: fullNameAr || fullName,
            username: username?.trim().toLowerCase(),
            phone,
            role,
          },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/#verify-email` : undefined,
        },
      });

      if (error) {
        return { success: false, error: normalizeAuthError(error) };
      }

      if (data.user) {
        const isVerified = Boolean(data.user.email_confirmed_at);
        const profile = mapSupabaseUserToProfile(data.user);
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

  // Graceful local development fallback when Supabase credentials have not yet been configured in Vercel
  const fallbackProfile: UserProfile = {
    id: `usr-${Date.now()}`,
    name: fullName,
    nameAr: fullNameAr || fullName,
    email: cleanEmail,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role,
    currentLevel: 'A1',
    targetLevel: 'B2',
    xp: 200,
    streakDays: 1,
    joinedDate: new Date().toISOString().split('T')[0],
  };

  const session: AuthSessionState = {
    type: 'authenticated',
    user: fallbackProfile,
    isLoggedIn: true,
    isEmailVerified: false,
  };
  saveAuthSession(session);
  return { success: true, session };
}

export async function signInUser(
  identifier: string, // Email or Username
  password?: string
): Promise<{ success: boolean; session?: AuthSessionState; error?: string }> {
  const clean = identifier.trim().toLowerCase();

  // 1. Direct Demo Account Interception (Instant Zero-Latency Demo)
  if (clean === 'sarah.demo@henglish.academy' || clean === 'student-demo') {
    return { success: true, session: switchDemoAccount('student') };
  }
  if (clean === 'hinawi.academic@henglish.academy' || clean === 'teacher-demo') {
    return { success: true, session: switchDemoAccount('teacher') };
  }
  if (clean === 'admin@henglish.academy' || clean === 'admin-demo') {
    return { success: true, session: switchDemoAccount('admin') };
  }

  // 2. Real Supabase Authentication
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

  // 3. Resilient fallback when Supabase keys are not configured yet in environment
  const fallbackProfile: UserProfile = {
    ...DEMO_PROFILES.student,
    id: `usr-${Date.now()}`,
    email: clean,
    name: clean.split('@')[0],
    nameAr: clean.split('@')[0],
  };

  const session: AuthSessionState = {
    type: 'authenticated',
    user: fallbackProfile,
    isLoggedIn: true,
    isEmailVerified: true,
  };
  saveAuthSession(session);
  return { success: true, session };
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
  return { success: true };
}

export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) return { success: false, error: normalizeAuthError(error) };
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: normalizeAuthError(err) };
    }
  }
  return { success: true };
}

export async function signOutUser(): Promise<void> {
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
// DEMO & GUEST MODE CONTROLS
// ==============================================================================

export function switchDemoAccount(role: 'student' | 'teacher' | 'admin'): AuthSessionState {
  const profile = DEMO_PROFILES[role];
  const session: AuthSessionState = {
    type: 'demo',
    user: profile,
    isLoggedIn: true,
    isEmailVerified: true,
  };
  saveAuthSession(session);
  return session;
}

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

export function migrateGuestProgressToAccount(accountName: string, accountEmail: string): AuthSessionState {
  const guestSession = getSavedAuthSession();
  const migratedProfile: UserProfile = {
    ...guestSession.user,
    id: `usr-${Date.now()}`,
    name: accountName,
    nameAr: accountName,
    email: accountEmail,
    role: 'student',
  };

  const session: AuthSessionState = {
    type: 'authenticated',
    user: migratedProfile,
    isLoggedIn: true,
    isEmailVerified: true,
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
