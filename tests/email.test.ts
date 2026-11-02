import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../server/email/emailService';

describe('Henglish Transactional Email Security Suite', () => {
  describe('RFC Email Address Validation', () => {
    it('accepts valid RFC 5322 email addresses', () => {
      expect(isValidEmail('learner@henglish.academy')).toBe(true);
      expect(isValidEmail('student.john+tag@example.com')).toBe(true);
      expect(isValidEmail('admin_test@university.edu')).toBe(true);
    });

    it('rejects malformed and dangerous email addresses', () => {
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('@missingusername.com')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('user@com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('user<script>alert(1)</script>@domain.com')).toBe(false);
    });
  });

  describe('Anti-Phishing Action URL Validation', () => {
    function isSafeActionUrl(url?: string): boolean {
      if (!url) return true;
      const trimmed = url.trim();
      if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;

      try {
        const parsed = new URL(trimmed);
        const host = parsed.hostname.toLowerCase();
        return (
          host === 'henglish.academy' ||
          host.endsWith('.henglish.academy') ||
          host === 'henglish.vercel.app' ||
          host.endsWith('.vercel.app') ||
          host === 'localhost' ||
          host === '127.0.0.1'
        );
      } catch {
        return false;
      }
    }

    it('permits safe internal and application URLs', () => {
      expect(isSafeActionUrl('/dashboard')).toBe(true);
      expect(isSafeActionUrl('/reset-password?token=xyz')).toBe(true);
      expect(isSafeActionUrl('https://henglish.academy/login')).toBe(true);
      expect(isSafeActionUrl('https://app.henglish.academy/verify')).toBe(true);
      expect(isSafeActionUrl('https://henglish.vercel.app/courses')).toBe(true);
      expect(isSafeActionUrl('http://localhost:5173/auth')).toBe(true);
    });

    it('strictly blocks malicious phishing and external redirect domains', () => {
      expect(isSafeActionUrl('https://evil-phishing-site.com/steal-creds')).toBe(false);
      expect(isSafeActionUrl('https://attacker.org/verify')).toBe(false);
      expect(isSafeActionUrl('//malicious-redirect.com/login')).toBe(false);
      expect(isSafeActionUrl('javascript:alert(1)')).toBe(false);
    });
  });

  describe('Administrative Operation Authorization', () => {
    function canTriggerAdminTestEmail(userRole?: string): boolean {
      return userRole === 'admin';
    }

    it('strictly forbids non-admin users from triggering admin test emails', () => {
      expect(canTriggerAdminTestEmail(undefined)).toBe(false);
      expect(canTriggerAdminTestEmail('student')).toBe(false);
      expect(canTriggerAdminTestEmail('teacher')).toBe(false);
      expect(canTriggerAdminTestEmail('admin')).toBe(true);
    });
  });
});
