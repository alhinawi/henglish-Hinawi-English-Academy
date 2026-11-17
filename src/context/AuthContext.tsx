import { useLanguage } from '../i18n/LanguageContext';
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
  switchGuestMode,
  SignUpParams,
  supabase,
  mapSupabaseUserToProfile
} from '../services/authService';

interface AuthContextType {
  session: AuthSessionState;
  user: UserProfile;
  role: UserRole;
  isAuthenticated: boolean;
  isGuest: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  login: (identifier: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (params: SignUpParams) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  // Re-read the saved session from storage (used after the auth modal signs in/out directly).
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const [session, setSession] = useState<AuthSessionState>(() => getSavedAuthSession());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize listener to Supabase Auth State changes
  useEffect(() => {
    let mounted = true;
    let authRevision = 0;
    const initialRevision = authRevision;
    const ownsInitialization = () => mounted && authRevision === initialRevision;

    async function initAuth() {
      if (supabase) {
        try {
          const { data: { session: sbSession } } = await supabase.auth.getSession();
          if (sbSession?.user && ownsInitialization()) {
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

            // A newer provider event or unmount owns the session now.
            if (!ownsInitialization()) return;
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
      if (ownsInitialization()) setIsLoading(false);
    }

    initAuth();

    let authSubscription: { unsubscribe: () => void } | null = null;
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sbSession) => {
        if (!mounted) return;
        if (event === 'SIGNED_IN' && sbSession?.user) {
          authRevision += 1;
          setIsLoading(false);
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
          authRevision += 1;
          setIsLoading(false);
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
    return { success: false, error: result.error || t('am.errLogin') };
  };

  const register = async (params: SignUpParams) => {
    setIsLoading(true);
    const result = await signUpUser(params);
    setIsLoading(false);
    if (result.success && result.session) {
      setSession(result.session);
      return { success: true };
    }
    return { success: false, error: result.error || t('am.errCreate') };
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
    const ownerId = session.user.id;
    const requestedEmail = email.trim().toLowerCase();
    const res = await verifyEmailOtp(email, code);
    if (res.success) {
      setSession(prev => prev.isLoggedIn && prev.user.id === ownerId && prev.user.email?.trim().toLowerCase() === requestedEmail
        ? { ...prev, isEmailVerified: true } : prev);
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

  const refreshSession = () => {
    setSession(getSavedAuthSession());
  };

  const value: AuthContextType = {
    session,
    user: session.user,
    role: session.user.role,
    isAuthenticated: session.isLoggedIn && session.type === 'authenticated',
    isGuest: session.type === 'guest',
    isEmailVerified: session.isEmailVerified,
    isLoading,
    login,
    register,
    logout,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    refreshSession,
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

