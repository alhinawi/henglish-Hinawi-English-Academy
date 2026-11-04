import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AuthSessionState, 
  UserProfile, 
  UserRole,
  getSavedAuthSession, 
  saveAuthSession, 
  clearAuthSession,
  signInUser, 
  signUpUser, 
  verifyEmailOtp, 
  resendVerificationOtp, 
  requestPasswordRecovery, 
  updatePassword, 
  signOutUser, 
  switchDemoAccount, 
  switchGuestMode,
  SignUpParams,
  supabase,
  mapSupabaseUserToProfile,
  isProductionEnv
} from '../services/authService';

interface AuthContextType {
  session: AuthSessionState;
  user: UserProfile;
  role: UserRole;
  isAuthenticated: boolean;
  isGuest: boolean;
  isDemo: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (params: SignUpParams) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  continueAsGuest: () => void;
  loginDemoStudent: () => void;
  loginDemoTeacher: () => void;
  loginDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSessionState>(() => getSavedAuthSession());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize listener to Supabase Auth State changes
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (supabase) {
        try {
          const { data: { session: sbSession } } = await supabase.auth.getSession();
          if (sbSession?.user && mounted) {
            let profileRow = null;
            try {
              const { data: pRow } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', sbSession.user.id)
                .single();
              profileRow = pRow;
            } catch {
              // Ignore
            }

            const profile = mapSupabaseUserToProfile(sbSession.user, profileRow);
            const newState: AuthSessionState = {
              type: 'authenticated',
              user: profile,
              isLoggedIn: true,
              isEmailVerified: Boolean(sbSession.user.email_confirmed_at),
              accessToken: sbSession.access_token,
            };
            setSession(newState);
            saveAuthSession(newState);
          }
        } catch {
          // Keep current saved session on error
        }
      }
      if (mounted) setIsLoading(false);
    }

    initAuth();

    let authSubscription: { unsubscribe: () => void } | null = null;
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sbSession) => {
        if (event === 'SIGNED_IN' && sbSession?.user) {
          const profile = mapSupabaseUserToProfile(sbSession.user);
          const newState: AuthSessionState = {
            type: 'authenticated',
            user: profile,
            isLoggedIn: true,
            isEmailVerified: Boolean(sbSession.user.email_confirmed_at),
            accessToken: sbSession.access_token,
          };
          setSession(newState);
          saveAuthSession(newState);
        } else if (event === 'SIGNED_OUT') {
          clearAuthSession();
          setSession(switchGuestMode());
        }
      });
      authSubscription = subscription;
    }

    return () => {
      mounted = false;
      authSubscription?.unsubscribe();
    };
  }, []);

  const login = async (identifier: string, password?: string) => {
    setIsLoading(true);
    const result = await signInUser(identifier, password);
    setIsLoading(false);
    if (result.success && result.session) {
      setSession(result.session);
      return { success: true };
    }
    return { success: false, error: result.error || 'فشل تسجيل الدخول' };
  };

  const register = async (params: SignUpParams) => {
    setIsLoading(true);
    const result = await signUpUser(params);
    setIsLoading(false);
    if (result.success && result.session) {
      setSession(result.session);
      return { success: true };
    }
    return { success: false, error: result.error || 'فشل إنشاء الحساب' };
  };

  const logout = async () => {
    setIsLoading(true);
    await signOutUser();
    const guest = switchGuestMode();
    setSession(guest);
    setIsLoading(false);
    if (typeof window !== 'undefined') {
      window.location.hash = 'login';
    }
  };

  const verifyOtp = async (email: string, code: string) => {
    const res = await verifyEmailOtp(email, code);
    if (res.success) {
      setSession(prev => ({ ...prev, isEmailVerified: true }));
    }
    return res;
  };

  const resendOtp = async (email: string) => {
    return await resendVerificationOtp(email);
  };

  const forgotPassword = async (email: string) => {
    return await requestPasswordRecovery(email);
  };

  const resetPassword = async (newPassword: string) => {
    return await updatePassword(newPassword);
  };

  const continueAsGuest = () => {
    const guest = switchGuestMode();
    setSession(guest);
    if (typeof window !== 'undefined') {
      window.location.hash = 'dashboard';
    }
  };

  const loginDemoStudent = () => {
    const demo = switchDemoAccount('student');
    setSession(demo);
    if (typeof window !== 'undefined') {
      window.location.hash = 'dashboard';
    }
  };

  const loginDemoTeacher = () => {
    if (isProductionEnv()) {
      // In production, teacher demo is strictly disabled to prevent privilege confusion
      return;
    }
    const demo = switchDemoAccount('teacher');
    setSession(demo);
    if (typeof window !== 'undefined') {
      window.location.hash = 'teacher-dashboard';
    }
  };

  const loginDemoAdmin = () => {
    if (isProductionEnv()) {
      // In production, admin demo is strictly disabled
      return;
    }
    const demo = switchDemoAccount('admin');
    setSession(demo);
    if (typeof window !== 'undefined') {
      window.location.hash = 'admin';
    }
  };

  // Authoritative RBAC role determination:
  // In production, only authenticated sessions with valid tokens can have non-student roles
  const effectiveRole: UserRole = 
    session.type === 'authenticated'
      ? session.user.role
      : isProductionEnv()
        ? 'student'
        : session.user.role;

  const value: AuthContextType = {
    session,
    user: {
      ...session.user,
      role: effectiveRole,
    },
    role: effectiveRole,
    isAuthenticated: session.isLoggedIn && session.type === 'authenticated' && Boolean(session.accessToken),
    isGuest: session.type === 'guest',
    isDemo: session.type === 'demo',
    isEmailVerified: session.isEmailVerified,
    isLoading,
    login,
    register,
    logout,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    continueAsGuest,
    loginDemoStudent,
    loginDemoTeacher,
    loginDemoAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
