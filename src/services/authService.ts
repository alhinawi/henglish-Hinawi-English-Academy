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

export function isProductionEnv(): boolean {
  if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) return true;
  if (typeof process !== 'undefined') {
    return process.env.NODE_ENV === 'production' || process.env.VITE_APP_ENV === 'production';
  }
  return false;
}

// Seeded Demo Profiles (Strictly for isolated client-side preview in non-production)
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

export function isSupabaseConfigured(): boolean {
  const rawUrl = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
    ''
  ).trim();
  const rawKey = (
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
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
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
      (typeof process !== 'undefined' && (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL)) ||
      ''
    ).trim();
    const rawKey = (
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
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

  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('fetch failed')) {
    if (!isSupabaseConfigured()) {
      return 'تعذر الاتصال بخادم قاعدة البيانات. يرجى تهيئة متغيرات VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في إعدادات البيئة (Vercel).';
    }
    return 'تعذر الاتصال بخادم المصادقة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.';
  }

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
        // SECURITY: If running in production, ensure demo sessions never carry elevated privileges
        if (isProductionEnv() && parsed.type === 'demo' && parsed.user.role !== 'student') {
          parsed.user.role = 'student';
        }
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
  // Authoritative role comes strictly from public.profiles table, never unverified client metadata
  const role: UserRole = (profileRow?.role as UserRole) || (authUser.app_metadata?.role as UserRole) || 'student';
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
// AUTHENTICATION ACTIONS (HARDENED SERVER-VERIFIED RBAC)
// ==============================================================================

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  fullNameAr?: string;
  username?: string;
  phone?: string;
  role?: UserRole; // Ignored by security policy: all signups default strictly to 'student'
}

export async function signUpUser(params: SignUpParams): Promise<{ success: boolean; session?: AuthSessionState; error?: string }> {
  const { email, password, fullName, fullNameAr, username, phone } = params;
  const cleanEmail = email.trim().toLowerCase();
  
  // SECURITY HARDENING: Client cannot assign privileged roles during registration.
  // All self-registrations are strictly 'student'. Promotions require verified admin actions in DB.
  const role: UserRole = 'student';

  const client = supabase || initSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName,
            full_name_ar: fullNameAr || fullName,
            username: username?.trim().toLowerCase(),
            phone,
            role: 'student', // Enforce student in auth metadata
          },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/#verify-email` : undefined,
        },
      });

      if (error) {
        const isTransientDevError =
          error.message.includes('rate limit') ||
          error.message.includes('fetch failed') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError');
        if (!isProductionEnv() && isTransientDevError) {
          console.warn('[AuthService] Supabase transient error in dev/test, using local student profile.');
        } else {
          return { success: false, error: normalizeAuthError(error) };
        }
      }

      if (data && data.user) {
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
      if (isProductionEnv()) {
        return { success: false, error: normalizeAuthError(err) };
      }
      // In offline development / test environments, fall through to isolated student fallback
    }
  }

  // SECURITY: In production environments, never create fake local accounts when Supabase is unreachable
  if (isProductionEnv()) {
    return {
      success: false,
      error: 'تعذر إنشاء الحساب في خادم المصادقة. يرجى التحقق من صحة البيانات أو المحاولة لاحقاً.',
    };
  }

  // Isolated development fallback ONLY for local testing without database keys
  const fallbackProfile: UserProfile = {
    id: `usr-${Date.now()}`,
    name: fullName,
    nameAr: fullNameAr || fullName,
    email: cleanEmail,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    currentLevel: 'A1',
    targetLevel: 'B2',
    xp: 100,
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
  identifier: string,
  password?: string
): Promise<{ success: boolean; session?: AuthSessionState; error?: string }> {
  const clean = identifier.trim().toLowerCase();
  const isProduction = isProductionEnv();

  // 1. PRODUCTION SECURITY GUARD:
  // In production, unauthenticated demo login bypasses are strictly disallowed.
  if (isProduction) {
    if (clean === 'admin-demo' || clean === 'teacher-demo' || clean === 'student-demo') {
      return {
        success: false,
        error: 'الاختصارات التجريبية غير مفعّلة في بيئة الإنتاج. يرجى تسجيل الدخول بحساب رسمي معتمد.',
      };
    }

    if (
      clean === 'admin@henglish.academy' ||
      clean === 'hinawi.academic@henglish.academy' ||
      clean === 'sarah.demo@henglish.academy'
    ) {
      if (!password) {
        return {
          success: false,
          error: 'يتطلب هذا الحساب إدخال كلمة المرور المعتمدة للمصادقة عبر خادم Supabase.',
        };
      }
    }
  } else {
    // 2. ISOLATED DEVELOPMENT / OFFLINE DEMO INTERCEPTION:
    // Only in non-production environments can demo keywords instantly activate sandboxed previews.
    if (clean === 'sarah.demo@henglish.academy' || clean === 'student-demo') {
      return { success: true, session: switchDemoAccount('student') };
    }
    if (clean === 'hinawi.academic@henglish.academy' || clean === 'teacher-demo') {
      return { success: true, session: switchDemoAccount('teacher') };
    }
    if (clean === 'admin@henglish.academy' || clean === 'admin-demo') {
      return { success: true, session: switchDemoAccount('admin') };
    }
  }

  // 3. Real Server-Side Supabase Authentication
  if (supabase && password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: clean,
        password,
      });

      if (error) {
        console.log('SUPABASE SIGNUP ERROR:', error);
        return { success: false, error: normalizeAuthError(error) };
      }

      if (data.user) {
        // Fetch authoritative profile row from public.profiles
        let profileRow: Record<string, unknown> | null = null;
        try {
          const { data: pRow } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          profileRow = pRow;
        } catch {
          // If profiles row fetch fails, profile normalization falls back safely
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

  // In production environments, never silently create unverified fake authenticated sessions on failed login
  if (isProduction || isSupabaseConfigured()) {
    return {
      success: false,
      error: 'بيانات تسجيل الدخول غير صحيحة، أو لم يتم إدخال كلمة المرور.',
    };
  }

  // Isolated development fallback ONLY for local development without DB
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

  // In production environments, never bypass genuine OTP verification
  if (isProductionEnv() || isSupabaseConfigured()) {
    return {
      success: false,
      error: 'رمز التحقق غير صحيح أو منتهي الصلاحية. يرجى طلب رمز جديد والمحاولة مرة أخرى.',
    };
  }

  // Local development mock fallback
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

      // Dispatch security alert with current authenticated user's access token
      try {
        const current = getSavedAuthSession();
        if (current?.user?.email && typeof window !== 'undefined' && current.accessToken) {
          fetch('/api/email/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${current.accessToken}`,
            },
            body: JSON.stringify({
              type: 'password_changed',
              to: current.user.email,
              name: current.user.name,
            }),
          }).catch(() => {});
        }
      } catch {
        // Non-blocking security notification
      }

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
// DEMO & GUEST MODE CONTROLS (ISOLATED SANDBOX)
// ==============================================================================

export function switchDemoAccount(role: 'student' | 'teacher' | 'admin'): AuthSessionState {
  const isProduction = isProductionEnv();

  // In production, demo accounts cannot assume administrative or teacher roles
  const effectiveRole = isProduction && role !== 'student' ? 'student' : role;
  const profile = {
    ...DEMO_PROFILES[effectiveRole],
    role: effectiveRole,
  };

  const session: AuthSessionState = {
    type: 'demo',
    user: profile,
    isLoggedIn: true,
    isEmailVerified: true,
    // SECURITY: Demo sessions NEVER possess real Supabase tokens!
    accessToken: undefined,
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
    accessToken: undefined,
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
    role: 'student', // Strictly student on migration
  };

  const session: AuthSessionState = {
    type: 'authenticated',
    user: migratedProfile,
    isLoggedIn: true,
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
