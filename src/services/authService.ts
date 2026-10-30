import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, CEFRLevel, UserRole } from '../types';

export type SessionType = 'guest' | 'demo' | 'authenticated';

export interface AuthSessionState {
  type: SessionType;
  user: UserProfile;
  isLoggedIn: boolean;
}

const AUTH_STORAGE_KEY = 'henglish_auth_session';

// Seeded Demo Profiles
export const DEMO_PROFILES: Record<'student' | 'teacher', UserProfile> = {
  student: {
    id: 'demo-student-sarah',
    name: 'Sarah Abdulrahman',
    nameAr: 'سارة عبد الرحمن',
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
  bio: 'وضع الزائر: يمكنك تجربة الدروس والمحاكاة، وحفظ تقدمك مؤقتاً.',
};

// Supabase Client initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Load persisted session
export function getSavedAuthSession(): AuthSessionState {
  if (typeof window === 'undefined') {
    return { type: 'guest', user: GUEST_PROFILE, isLoggedIn: false };
  }
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return { type: 'guest', user: GUEST_PROFILE, isLoggedIn: false };
}

export function saveAuthSession(session: AuthSessionState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore
  }
}

// Auth Actions
export async function signUpUser(email: string, fullName: string): Promise<AuthSessionState> {
  const newProfile: UserProfile = {
    id: `usr-${Date.now()}`,
    name: fullName,
    nameAr: fullName,
    email: email.trim().toLowerCase(),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    role: 'student',
    currentLevel: 'A1',
    targetLevel: 'B2',
    xp: 200,
    streakDays: 1,
    joinedDate: new Date().toISOString().split('T')[0],
  };

  const session: AuthSessionState = {
    type: 'authenticated',
    user: newProfile,
    isLoggedIn: true,
  };

  saveAuthSession(session);
  return session;
}

export async function signInUser(email: string): Promise<AuthSessionState> {
  // If demo credentials matched
  if (email.includes('teacher') || email.includes('hinawi')) {
    const session: AuthSessionState = {
      type: 'demo',
      user: DEMO_PROFILES.teacher,
      isLoggedIn: true,
    };
    saveAuthSession(session);
    return session;
  }

  const session: AuthSessionState = {
    type: 'authenticated',
    user: {
      ...DEMO_PROFILES.student,
      email: email.trim().toLowerCase(),
      nameAr: email.split('@')[0],
    },
    isLoggedIn: true,
  };

  saveAuthSession(session);
  return session;
}

export function switchDemoAccount(role: 'student' | 'teacher'): AuthSessionState {
  const session: AuthSessionState = {
    type: 'demo',
    user: DEMO_PROFILES[role],
    isLoggedIn: true,
  };
  saveAuthSession(session);
  return session;
}

export function switchGuestMode(): AuthSessionState {
  const session: AuthSessionState = {
    type: 'guest',
    user: GUEST_PROFILE,
    isLoggedIn: false,
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
  };

  saveAuthSession(session);
  return session;
}
