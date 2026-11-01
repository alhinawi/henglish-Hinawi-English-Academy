// ==============================================================================
// HENGLISH ACADEMY - AUTHENTICATION ERROR HANDLING & VALIDATION TEST SUITE
// Tests Supabase URL detection, isSupabaseConfigured() guard, error normalization,
// registration & login flow resiliency against "Failed to fetch" exceptions.
// ==============================================================================

import {
  isSupabaseConfigured,
  normalizeAuthError,
  signInUser,
  signUpUser,
  DEMO_PROFILES,
} from './src/services/authService';

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

async function runAuthDiagnostics() {
  console.log('\n======================================================');
  console.log('🔍 RUNNING HENGLISH AUTH CONNECTIVITY & ERROR HANDLING TESTS');
  console.log('======================================================\n');

  // --- SECTION 1: SUPABASE CONFIGURATION DETECTION ---
  console.log('--- Section 1: Supabase Configuration & Placeholder Detection ---');
  // Default repo has placeholder URL 'https://your-project-id.supabase.co'
  const isConfigured = isSupabaseConfigured();
  assert(
    isConfigured === false,
    'isSupabaseConfigured correctly rejects unconfigured placeholder URLs (prevents browser "Failed to fetch")'
  );

  // --- SECTION 2: ERROR NORMALIZATION ---
  console.log('\n--- Section 2: User-Friendly Error Message Normalization ---');
  const fetchError = new Error('Failed to fetch');
  const normalizedFetch = normalizeAuthError(fetchError);
  assert(
    !normalizedFetch.includes('Failed to fetch') && normalizedFetch.includes('VITE_SUPABASE_URL'),
    'normalizeAuthError converts "Failed to fetch" into an actionable configuration message'
  );

  const credsError = new Error('Invalid login credentials');
  const normalizedCreds = normalizeAuthError(credsError);
  assert(
    normalizedCreds.includes('كلمة المرور غير صحيحة'),
    'normalizeAuthError translates Supabase invalid credentials into friendly Arabic'
  );

  const duplicateError = new Error('User already registered');
  const normalizedDup = normalizeAuthError(duplicateError);
  assert(
    normalizedDup.includes('مسجل بالفعل'),
    'normalizeAuthError translates duplicate email error correctly'
  );

  // --- SECTION 3: LOGIN RESILIENCY ---
  console.log('\n--- Section 3: Login Flow Verification ---');
  // 1. Demo Student Login
  const demoStudent = await signInUser('sarah.demo@henglish.academy');
  assert(
    demoStudent.success === true && demoStudent.session?.user.id === 'demo-student-sarah',
    'Student demo login succeeds instantly with zero latency'
  );

  // 2. Demo Teacher Login
  const demoTeacher = await signInUser('hinawi.academic@henglish.academy');
  assert(
    demoTeacher.success === true && demoTeacher.session?.user.role === 'teacher',
    'Teacher demo login succeeds instantly with zero latency'
  );

  // 3. Unconfigured Environment Login (Falls back safely without throwing "Failed to fetch")
  const standardLogin = await signInUser('user@example.com', 'mypassword123');
  assert(
    standardLogin.success === true && standardLogin.session?.user.email === 'user@example.com',
    'Login gracefully completes without unhandled network exceptions when Supabase is unconfigured'
  );

  // --- SECTION 4: REGISTRATION RESILIENCY ---
  console.log('\n--- Section 4: Registration Flow Verification ---');
  const newAccount = await signUpUser({
    email: 'newbie@henglish.academy',
    fullName: 'Newbie Student',
    password: 'securePassword123',
    role: 'student',
  });

  assert(
    newAccount.success === true && newAccount.session?.user.email === 'newbie@henglish.academy',
    'Registration creates valid session without unhandled network exceptions'
  );

  // --- SUMMARY ---
  console.log('\n======================================================');
  console.log(`📊 TEST SUITE COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('======================================================\n');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAuthDiagnostics();
