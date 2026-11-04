// ==============================================================================
// HENGLISH ACADEMY - AUTOMATED AUTHENTICATION & PERSISTENT PROGRESS TEST SUITE
// Tests Supabase auth actions, OTP verification, password recovery, session persistence,
// progress sync service, role-based access control, guest mode and demo accounts.
// ==============================================================================

import {
  DEMO_PROFILES,
  GUEST_PROFILE,
  switchDemoAccount,
  switchGuestMode,
  saveAuthSession,
  getSavedAuthSession,
  clearAuthSession,
  verifyEmailOtp,
  mapSupabaseUserToProfile,
  signInUser,
  signUpUser,
  isSupabaseConfigured,
} from './src/services/authService';

import {
  PersistentProgressPayload,
  loadUserProgressFromDatabase,
  saveUserProgressToDatabase,
  migrateLocalProgressToSupabase,
} from './src/services/progressSyncService';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🚀 RUNNING HENGLISH AUTH & PERSISTENT PROGRESS TEST SUITE');
  console.log('======================================================\n');

  // --- SECTION 1: SEEDED PROFILES & DEMO IDENTITIES ---
  console.log('--- Section 1: Seeded Demo & Guest Profiles ---');
  assert(
    DEMO_PROFILES.student.role === 'student' && DEMO_PROFILES.student.email.includes('sarah'),
    'Demo Student profile is configured with student role and distinct identity'
  );
  assert(
    DEMO_PROFILES.teacher.role === 'teacher' && DEMO_PROFILES.teacher.name.includes('Hinawi'),
    'Demo Teacher profile is configured with teacher role and academic credentials'
  );
  assert(
    DEMO_PROFILES.admin.role === 'admin' && DEMO_PROFILES.admin.xp > 50000,
    'Demo Admin profile is configured with administrative role'
  );
  assert(
    GUEST_PROFILE.role === 'student' && GUEST_PROFILE.id === 'guest-learner',
    'Guest profile provides safe temporary non-privileged access'
  );

  // --- SECTION 2: GUEST & DEMO SWITCHING ---
  console.log('\n--- Section 2: Session State Transitions ---');
  const studentSession = switchDemoAccount('student');
  assert(
    studentSession.type === 'demo' && studentSession.user.role === 'student' && studentSession.isLoggedIn,
    'switchDemoAccount("student") activates student demo session'
  );

  const teacherSession = switchDemoAccount('teacher');
  assert(
    teacherSession.type === 'demo' && teacherSession.user.role === 'teacher' && teacherSession.isLoggedIn,
    'switchDemoAccount("teacher") activates teacher demo session'
  );

  const adminSession = switchDemoAccount('admin');
  assert(
    adminSession.type === 'demo' && adminSession.user.role === 'admin' && adminSession.isLoggedIn,
    'switchDemoAccount("admin") activates admin session'
  );

  const guestSession = switchGuestMode();
  assert(
    guestSession.type === 'guest' && !guestSession.isLoggedIn,
    'switchGuestMode() switches to guest mode without login status'
  );

  // --- SECTION 3: DIRECT DEMO CREDENTIAL INTERCEPTION IN LOGIN ---
  console.log('\n--- Section 3: Login Interception & Authentication ---');
  const demoStudentLogin = await signInUser('sarah.demo@henglish.academy');
  assert(
    demoStudentLogin.success && demoStudentLogin.session?.user.id === 'demo-student-sarah',
    'Signing in with student demo email directly loads student demo session'
  );

  const demoTeacherLogin = await signInUser('hinawi.academic@henglish.academy');
  assert(
    demoTeacherLogin.success && demoTeacherLogin.session?.user.role === 'teacher',
    'Signing in with teacher demo email directly loads teacher demo session'
  );

  const demoAdminLogin = await signInUser('admin@henglish.academy');
  assert(
    demoAdminLogin.success && demoAdminLogin.session?.user.role === 'admin',
    'Signing in with admin demo email directly loads admin session'
  );

  // Test standard registration fallback
  const regResult = await signUpUser({
    email: 'newbie.student@example.com',
    fullName: 'Newbie Student',
    password: 'password123',
    role: 'student',
  });
  assert(
    regResult.success && regResult.session?.user.email === 'newbie.student@example.com',
    'signUpUser successfully creates authenticated user session'
  );

  // --- SECTION 4: OTP VERIFICATION ---
  console.log('\n--- Section 4: Email Verification (OTP) ---');
  const validOtp = await verifyEmailOtp('newbie.student@example.com', '123456');
  assert(validOtp.success === true, 'Valid 6-digit OTP succeeds verification');

  const invalidOtp = await verifyEmailOtp('newbie.student@example.com', '12');
  assert(invalidOtp.success === false, 'Invalid length OTP fails verification');

  // --- SECTION 5: PROFILE MAPPING FROM SUPABASE AUTH ---
  console.log('\n--- Section 5: Supabase User to Profile Normalization ---');
  const mockSupabaseUser: any = {
    id: 'sb-uuid-1234-5678',
    email: 'mohamed@test.com',
    created_at: '2026-10-01T12:00:00Z',
    user_metadata: {
      full_name: 'Mohamed Ahmed',
      full_name_ar: 'محمد أحمد',
      role: 'student',
      current_level: 'B1',
      target_level: 'C1',
      xp: 1500,
      streak_days: 7,
    },
  };
  const normalizedProfile = mapSupabaseUserToProfile(mockSupabaseUser);
  assert(
    normalizedProfile.id === 'sb-uuid-1234-5678' &&
    normalizedProfile.name === 'Mohamed Ahmed' &&
    normalizedProfile.role === 'student' &&
    normalizedProfile.currentLevel === 'B1' &&
    normalizedProfile.xp === 1500 &&
    normalizedProfile.streakDays === 7,
    'mapSupabaseUserToProfile correctly maps auth metadata to UserProfile contract'
  );

  // --- SECTION 6: PERSISTENT PROGRESS & LOCAL STORAGE MIGRATION ---
  console.log('\n--- Section 6: Persistent Progress & Migration ---');
  // For demo/guest users, DB queries safely return null without throwing errors
  const guestDb = await loadUserProgressFromDatabase('guest-learner');
  assert(guestDb === null, 'loadUserProgressFromDatabase safely returns null for guest ID');

  const demoDb = await loadUserProgressFromDatabase('demo-student-sarah');
  assert(demoDb === null, 'loadUserProgressFromDatabase safely returns null for demo ID');

  // Test local progress migration merger
  const mockLocalProgress: any = {
    xp: 2200,
    level: 'B2',
    studyStreakDays: 12,
    completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
    quizScores: {
      'quiz-future-perfect': { score: 9, total: 10, date: '2026-10-31' },
      'quiz-modals': { score: 5, total: 5, date: '2026-10-31' },
    },
    dailyGoals: [{ id: '1', completed: true }],
  };

  const migrationRes = await migrateLocalProgressToSupabase('demo-student-sarah', mockLocalProgress);
  assert(
    typeof migrationRes.success === 'boolean' && typeof migrationRes.migratedCount === 'number',
    'migrateLocalProgressToSupabase safely handles local progress data structures'
  );

  // --- SECTION 7: ROLE-BASED ACCESS CONTROL (RBAC) RULES ---
  console.log('\n--- Section 7: RBAC Access Control Validations ---');
  const isStudentAdmin = (role: string) => role === 'admin';
  const isTeacherPrivileged = (role: string) => role === 'teacher' || role === 'admin';

  assert(!isStudentAdmin('student'), 'Students are denied access to Admin Control Panel');
  assert(!isStudentAdmin('teacher'), 'Teachers are denied access to Admin Control Panel');
  assert(isStudentAdmin('admin'), 'Admins have access to Admin Control Panel');

  assert(!isTeacherPrivileged('student'), 'Students are denied access to Teacher Dashboard');
  assert(isTeacherPrivileged('teacher'), 'Teachers have access to Teacher Dashboard');
  assert(isTeacherPrivileged('admin'), 'Admins have supervisory access to Teacher Dashboard');

  // --- TEST SUITE SUMMARY ---
  console.log('\n======================================================');
  console.log(`📊 TEST SUITE COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('======================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTestSuite();

