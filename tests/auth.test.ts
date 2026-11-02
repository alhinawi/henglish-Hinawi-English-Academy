import { describe, it, expect, beforeEach } from 'vitest';
import {
  signInUser,
  signUpUser,
  verifyEmailOtp,
  requestPasswordRecovery,
  isTokenExpired,
  normalizeAuthError,
  isSupabaseConfigured,
  getSavedAuthSession,
  clearAuthSession,
} from '../src/services/authService';

describe('Henglish Authentication Security Suite', () => {
  beforeEach(() => {
    clearAuthSession();
  });

  describe('Password Recovery & Error Normalization', () => {
    it('normalizes network errors into user-friendly guidance', () => {
      const err = new Error('Failed to fetch');
      const normalized = normalizeAuthError(err);
      expect(normalized).toContain('المصادقة');
    });

    it('translates invalid login credentials into Arabic', () => {
      const err = new Error('Invalid login credentials');
      const normalized = normalizeAuthError(err);
      expect(normalized).toContain('كلمة المرور غير صحيحة');
    });

    it('translates duplicate user registration', () => {
      const err = new Error('User already registered');
      const normalized = normalizeAuthError(err);
      expect(normalized).toContain('مسجل بالفعل');
    });
  });

  describe('Token Expiration & Session Integrity', () => {
    it('correctly detects expired JWT tokens', () => {
      // Create an expired JWT token (exp in the past: 1000)
      const expiredPayload = Buffer.from(JSON.stringify({ exp: 1000 })).toString('base64');
      const fakeToken = `header.${expiredPayload}.signature`;
      expect(isTokenExpired(fakeToken)).toBe(true);
    });

    it('correctly validates active, non-expired JWT tokens', () => {
      // Future exp (year 2030)
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const validPayload = Buffer.from(JSON.stringify({ exp: futureExp })).toString('base64');
      const fakeToken = `header.${validPayload}.signature`;
      expect(isTokenExpired(fakeToken)).toBe(false);
    });

    it('handles malformed tokens safely without throwing', () => {
      expect(isTokenExpired('malformed-token')).toBe(false);
      expect(isTokenExpired('')).toBe(false);
      expect(isTokenExpired(undefined)).toBe(false);
    });
  });

  describe('Demo Account Access & Protection', () => {
    it('allows student demo in preview mode', async () => {
      const res = await signInUser('student-demo');
      expect(res.success).toBe(true);
      expect(res.session?.user.role).toBe('student');
      expect(res.session?.type).toBe('demo');
    });

    it('allows teacher demo in preview mode', async () => {
      const res = await signInUser('teacher-demo');
      expect(res.success).toBe(true);
      expect(res.session?.user.role).toBe('teacher');
      expect(res.session?.type).toBe('demo');
    });

    it('prevents unauthenticated local fallback in configured Supabase environment', async () => {
      if (isSupabaseConfigured()) {
        const res = await signInUser('random_unregistered_user@henglish.academy', 'wrong_pass');
        expect(res.success).toBe(false);
        expect(res.error).toBeDefined();
      }
    });
  });
});
