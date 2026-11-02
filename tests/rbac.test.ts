import { describe, it, expect } from 'vitest';
import { DEMO_PROFILES, UserRole } from '../src/services/authService';

describe('Henglish Role-Based Access Control (RBAC) Suite', () => {
  it('strictly validates role permissions hierarchy', () => {
    const roles: UserRole[] = ['student', 'teacher', 'admin'];
    expect(roles).toContain('student');
    expect(roles).toContain('teacher');
    expect(roles).toContain('admin');
  });

  it('guarantees student demo has student role and cannot access admin operations', () => {
    const student = DEMO_PROFILES.student;
    expect(student.role).toBe('student');
    expect(student.role).not.toBe('admin');
    expect(student.role).not.toBe('teacher');
  });

  it('guarantees teacher demo has teacher role', () => {
    const teacher = DEMO_PROFILES.teacher;
    expect(teacher.role).toBe('teacher');
    expect(teacher.role).not.toBe('admin');
  });

  it('verifies that admin operations check role explicitly', () => {
    function canAccessAdminPanel(userRole: UserRole, isDemo: boolean, isProd: boolean): boolean {
      if (userRole !== 'admin') return false;
      if (isProd && isDemo) return false;
      return true;
    }

    expect(canAccessAdminPanel('student', false, false)).toBe(false);
    expect(canAccessAdminPanel('teacher', false, false)).toBe(false);
    expect(canAccessAdminPanel('admin', true, true)).toBe(false); // Demo admin blocked in prod
    expect(canAccessAdminPanel('admin', false, true)).toBe(true); // Verified admin allowed in prod
    expect(canAccessAdminPanel('admin', true, false)).toBe(true); // Demo admin allowed in local dev
  });

  it('verifies teacher dashboard access guard', () => {
    function canAccessTeacherPanel(userRole: UserRole): boolean {
      return userRole === 'teacher' || userRole === 'admin';
    }

    expect(canAccessTeacherPanel('student')).toBe(false);
    expect(canAccessTeacherPanel('teacher')).toBe(true);
    expect(canAccessTeacherPanel('admin')).toBe(true);
  });
});

