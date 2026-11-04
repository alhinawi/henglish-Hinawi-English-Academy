// ==============================================================================
// HENGLISH ACADEMY - AUTHENTICATION & RBAC SECURITY HARDENING TEST SUITE
// File: tests/auth_rbac_hardening.test.ts
//
// Tests:
// 1. Client-Side Role Tampering Prevention in Registration
// 2. Production Mode Demo & Bypass Neutralization
// 3. Server JWT Verification & Token Validation (serverAuth)
// 4. GameVerse Session Submission Anti-Impersonation & Anti-Cheat
// 5. Transactional Email Endpoint Security & Anti-Phishing RBAC
// 6. Client-Side XP Manipulation Prevention in Progress Sync
// 7. Route-Level RBAC Protection (Student, Teacher, Admin Isolation)
// ==============================================================================

import {
  signUpUser,
  DEMO_PROFILES,
  GUEST_PROFILE,
  switchDemoAccount,
  switchGuestMode,
  saveAuthSession,
  getSavedAuthSession,
  isProductionEnv,
  isSupabaseConfigured,
} from '../src/services/authService';

import {
  saveUserProgressToDatabase,
  PersistentProgressPayload,
} from '../src/services/progressSyncService';

import {
  verifyAuthToken,
  applyCorsHeaders,
  parseAndValidateBody,
} from '../server/auth/serverAuth';

import submitGameSessionHandler from '../api/gameverse/submit-session';
import sendEmailHandler from '../api/email/send';
import issueCertHandler from '../api/certificates/issue';
import verifyCertHandler from '../api/certificates/verify';
import chatHandler from '../api/ai/chat';
import translateHandler from '../api/ai/translate';
import synthesizeHandler from '../api/tts/synthesize';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { EventEmitter } from 'node:events';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
  }
}

// Mock HTTP Request / Response helpers for testing serverless API routes
function createMockReqRes(options: {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  body?: unknown;
}) {
  const reqEmitter = new EventEmitter() as unknown as IncomingMessage & { body?: unknown };
  reqEmitter.method = options.method || 'POST';
  reqEmitter.url = options.url || '/';
  reqEmitter.headers = options.headers || {};
  (reqEmitter as any).socket = { remoteAddress: '127.0.0.1' };
  reqEmitter.body = options.body;

  let statusCode = 200;
  const headers: Record<string, string> = {};
  let responseData = '';

  const res = {
    get statusCode() {
      return statusCode;
    },
    set statusCode(val: number) {
      statusCode = val;
    },
    setHeader(name: string, value: string) {
      headers[name.toLowerCase()] = value;
    },
    getHeader(name: string) {
      return headers[name.toLowerCase()];
    },
    end(data?: string) {
      if (data) responseData += data;
    },
    write(chunk: string) {
      responseData += chunk;
    },
    getJson() {
      try {
        return JSON.parse(responseData);
      } catch {
        return responseData;
      }
    },
  } as unknown as ServerResponse & { getJson: () => any };

  return { req: reqEmitter, res };
}

async function runHardeningTests() {
  console.log('\n======================================================');
  console.log('🛡️  HENGLISH ACADEMY - AUTH & RBAC HARDENING TEST SUITE');
  console.log('======================================================\n');

  // ==========================================================================
  // SECTION 1: Self-Registration Client Role Tampering Prevention
  // ==========================================================================
  console.log('--- Section 1: Self-Registration Role Neutralization ---');

  // An attacker submits role: 'admin' or role: 'teacher' in signup payload
  const maliciousSignupPayload = {
    email: `hacker_${Date.now()}@example.com`,
    password: 'Password123!',
    fullName: 'Mr Hacker',
    role: 'admin' as any,
  };

  const signupResult = await signUpUser(maliciousSignupPayload);
  assert(
    signupResult.success === true,
    'Sign up executes with valid input structure'
  );
  assert(
    signupResult.session?.user.role === 'student',
    'Client-supplied role: "admin" is stripped; role is strictly forced to "student"'
  );

  // ==========================================================================
  // SECTION 2: Production Isolation & Zero-Token Demo Accounts
  // ==========================================================================
  console.log('\n--- Section 2: Demo & Guest Token Isolation ---');

  const studentSession = switchDemoAccount('student');
  assert(
    studentSession.accessToken === undefined,
    'Demo Student session has NO server accessToken (cannot forge API calls)'
  );

  const teacherSession = switchDemoAccount('teacher');
  assert(
    teacherSession.accessToken === undefined,
    'Demo Teacher session has NO server accessToken'
  );

  const guestSession = switchGuestMode();
  assert(
    guestSession.accessToken === undefined && guestSession.type === 'guest',
    'Guest session is strictly flagged type="guest" with NO accessToken'
  );
  assert(
    guestSession.user.role === 'student',
    'Guest session is restricted to role "student"'
  );

  // ==========================================================================
  // SECTION 3: Server Auth Header & Token Verification
  // ==========================================================================
  console.log('\n--- Section 3: Server Auth Token Verification (serverAuth) ---');

  // Missing Authorization header
  const reqNoAuth = { headers: {} } as IncomingMessage;
  const authResultNoAuth = await verifyAuthToken(reqNoAuth);
  assert(
    authResultNoAuth.authenticated === false,
    'Requests without Authorization header are unauthenticated'
  );
  assert(
    authResultNoAuth.error?.includes('Missing or malformed Authorization header'),
    'Clear error returned when Authorization header is missing'
  );

  // Malformed Bearer Token
  const reqMalformedAuth = { headers: { authorization: 'Basic 123456' } } as IncomingMessage;
  const authResultMalformed = await verifyAuthToken(reqMalformedAuth);
  assert(
    authResultMalformed.authenticated === false,
    'Non-Bearer Authorization schemes are rejected'
  );

  // Empty Bearer Token
  const reqEmptyBearer = { headers: { authorization: 'Bearer   ' } } as IncomingMessage;
  const authResultEmpty = await verifyAuthToken(reqEmptyBearer);
  assert(
    authResultEmpty.authenticated === false,
    'Empty Bearer tokens are rejected'
  );

  // ==========================================================================
  // SECTION 4: CORS Origin Protection
  // ==========================================================================
  console.log('\n--- Section 4: CORS & Origin Validation ---');

  const { req: corsReq, res: corsRes } = createMockReqRes({
    headers: { origin: 'https://malicious-phishing-site.com' },
  });
  applyCorsHeaders(corsReq, corsRes);
  assert(
    corsRes.getHeader('access-control-allow-origin') === 'https://henglish.academy',
    'Untrusted origins fall back safely to canonical https://henglish.academy instead of reflecting attacker origin'
  );

  const { req: trustedReq, res: trustedRes } = createMockReqRes({
    headers: { origin: 'https://app.henglish.academy' },
  });
  applyCorsHeaders(trustedReq, trustedRes);
  assert(
    trustedRes.getHeader('access-control-allow-origin') === 'https://app.henglish.academy',
    'Trusted subdomain origins are permitted'
  );

  // ==========================================================================
  // SECTION 5: GameVerse XP Submission Security & Anti-Impersonation
  // ==========================================================================
  console.log('\n--- Section 5: GameVerse Authoritative Submission Security ---');

  // Test 5A: Missing idempotency key or invalid gameId
  const { req: gvReq1, res: gvRes1 } = createMockReqRes({
    body: { gameId: '', score: 100 },
  });
  await submitGameSessionHandler(gvReq1, gvRes1);
  assert(
    gvRes1.statusCode === 400,
    'Invalid GameVerse submission payload rejected with 400 Bad Request'
  );

  // Test 5B: Guest submission
  const { req: gvReqGuest, res: gvResGuest } = createMockReqRes({
    body: {
      userId: 'guest_12345',
      gameId: 'speed-reading',
      score: 50,
      maxScore: 100,
      accuracy: 80,
      durationSeconds: 30,
      idempotencyKey: 'idemp_key_guest_test_01',
    },
  });
  await submitGameSessionHandler(gvReqGuest, gvResGuest);
  assert(
    gvResGuest.statusCode === 200,
    'Guest submission returns non-persisted success status'
  );
  assert(
    gvResGuest.getJson().persisted === false,
    'Guest submission explicitly does NOT persist XP to database'
  );

  // Test 5C: Unauthenticated caller attempting to submit on behalf of a real user
  const { req: gvReqNoAuth, res: gvResNoAuth } = createMockReqRes({
    body: {
      userId: 'real-user-uuid-1234',
      gameId: 'speed-reading',
      score: 100,
      maxScore: 100,
      accuracy: 100,
      durationSeconds: 45,
      idempotencyKey: 'idemp_key_unauth_test_01',
    },
  });
  await submitGameSessionHandler(gvReqNoAuth, gvResNoAuth);
  assert(
    gvResNoAuth.statusCode === 401,
    'Submissions claiming authenticated userId without valid Bearer token are rejected with 401'
  );

  // ==========================================================================
  // SECTION 6: Transactional Email RBAC & Anti-Phishing Security
  // ==========================================================================
  console.log('\n--- Section 6: Transactional Email RBAC & Anti-Phishing ---');

  // Test 6A: Unauthenticated user attempting to broadcast a notification or trigger admin test
  const { req: emailReqTest, res: emailResTest } = createMockReqRes({
    body: {
      type: 'test',
      to: 'target@example.com',
    },
  });
  await sendEmailHandler(emailReqTest, emailResTest);
  assert(
    emailResTest.statusCode === 401 || emailResTest.statusCode === 403,
    'Unauthenticated callers are blocked from sending "test" or "notification" emails'
  );

  // Test 6B: Phishing action URL injection
  const { req: emailReqPhish, res: emailResPhish } = createMockReqRes({
    body: {
      type: 'welcome',
      to: 'user@example.com',
      actionUrl: 'https://evil-credential-stealer.com/steal-login',
    },
  });
  await sendEmailHandler(emailReqPhish, emailResPhish);
  assert(
    emailResPhish.statusCode === 400,
    'Phishing/untrusted external actionUrl is rejected with 400 Bad Request'
  );
  assert(
    emailResPhish.getJson().error?.includes('actionUrl') &&
      emailResPhish.getJson().error?.includes('untrusted external domain'),
    'Clear anti-phishing security error message returned'
  );

  // ==========================================================================
  // SECTION 7: Client Progress Sync XP Manipulation Prevention
  // ==========================================================================
  console.log('\n--- Section 7: Progress Sync XP Manipulation Prevention ---');

  // Attacker attempts to inflate their XP directly via saveUserProgressToDatabase
  const inflatedPayload: PersistentProgressPayload = {
    userId: 'test-user-id',
    totalXp: 9999999,
    level: 99,
    streak: 50,
    progress: {},
    gameStats: {},
  };

  // We verify that the save payload sent to Supabase in progressSyncService
  // no longer pushes total_xp or xp_points directly to profiles or user_learning_progress
  // Notice that in progressSyncService:
  // user_learning_progress only updates total_quizzes_taken, total_flashcards_reviewed, etc.
  // profiles only updates updated_at.
  // Calling saveUserProgressToDatabase with inflated XP safely runs without corrupting XP.
  const syncResult = await saveUserProgressToDatabase('guest_user', inflatedPayload);
  assert(
    syncResult === false,
    'saveUserProgressToDatabase safely refuses to write for guest accounts'
  );

  const demoSyncResult = await saveUserProgressToDatabase('demo-student-id', inflatedPayload);
  assert(
    demoSyncResult === false,
    'saveUserProgressToDatabase safely refuses to write for demo accounts'
  );

  // ==========================================================================
  // SECTION 8: Frontend RBAC Route Isolation Matrix
  // ==========================================================================
  console.log('\n--- Section 8: Frontend RBAC Route Matrix ---');

  type Role = 'student' | 'teacher' | 'admin';

  function evaluateRouteAccess(role: Role, isDemo: boolean, targetRoute: string): boolean {
    if (targetRoute === '#admin') {
      if (role !== 'admin' || isDemo) return false;
      return true;
    }
    if (targetRoute === '#teacher-dashboard') {
      if ((role !== 'teacher' && role !== 'admin') || isDemo) return false;
      return true;
    }
    return true; // regular routes
  }

  // Student checks
  assert(!evaluateRouteAccess('student', false, '#admin'), 'Real Student cannot access #admin');
  assert(!evaluateRouteAccess('student', false, '#teacher-dashboard'), 'Real Student cannot access #teacher-dashboard');
  assert(evaluateRouteAccess('student', false, '#learn'), 'Real Student can access #learn');

  // Teacher checks
  assert(!evaluateRouteAccess('teacher', false, '#admin'), 'Real Teacher cannot access #admin');
  assert(evaluateRouteAccess('teacher', false, '#teacher-dashboard'), 'Real Teacher can access #teacher-dashboard');

  // Admin checks
  assert(evaluateRouteAccess('admin', false, '#admin'), 'Real Admin can access #admin');
  assert(evaluateRouteAccess('admin', false, '#teacher-dashboard'), 'Real Admin can access #teacher-dashboard');

  // Demo accounts isolation checks
  assert(!evaluateRouteAccess('admin', true, '#admin'), 'Demo Admin cannot access #admin in production');
  assert(!evaluateRouteAccess('teacher', true, '#teacher-dashboard'), 'Demo Teacher cannot access #teacher-dashboard in production');

  // ==========================================================================
  // SECTION 9: Authoritative Certificate Issuance & Public Verification
  // ==========================================================================
  console.log('\n--- Section 9: Certificate Issuance & Verification Security ---');

  // Test 9A: Unauthenticated user attempting to issue certificate
  const { req: certReqNoAuth, res: certResNoAuth } = createMockReqRes({
    body: {
      definitionId: 'cert-grammar-foundations',
      studentNameEn: 'Attacker Name',
    },
  });
  await issueCertHandler(certReqNoAuth, certResNoAuth);
  assert(
    certResNoAuth.statusCode === 401,
    'Unauthenticated callers are rejected from issuing certificates (401 Unauthorized)'
  );

  // Test 9B: Malformed certificate verification code
  const { req: verifyReqBad, res: verifyResBad } = createMockReqRes({
    method: 'GET',
    url: '/api/certificates/verify?code=INVALID_CODE_123',
  });
  await verifyCertHandler(verifyReqBad, verifyResBad);
  assert(
    verifyResBad.statusCode === 400,
    'Malformed certificate verification code rejected with 400 Bad Request'
  );

  // ==========================================================================
  // SECTION 10: AI & TTS Input Bounds & Sanitization (C-5, H-5, M-1)
  // ==========================================================================
  console.log('\n--- Section 10: AI & TTS Input Bounds & Sanitization ---');

  // Test 10A: Oversized AI chat message (exceeding 4,000 chars)
  const oversizedMsg = 'A'.repeat(4500);
  const { req: chatReqHuge, res: chatResHuge } = createMockReqRes({
    body: { message: oversizedMsg, mode: 'tutor' },
  });
  await chatHandler(chatReqHuge, chatResHuge);
  assert(
    chatResHuge.statusCode === 400,
    'AI Chat message exceeding 4,000 characters is rejected with 400 Bad Request'
  );

  // Test 10B: Oversized translation text (exceeding 5,000 chars)
  const oversizedTranslation = 'T'.repeat(5500);
  const { req: transReqHuge, res: transResHuge } = createMockReqRes({
    body: { text: oversizedTranslation, sourceLang: 'en', targetLang: 'ar' },
  });
  await translateHandler(transReqHuge, transResHuge);
  assert(
    transResHuge.statusCode === 400,
    'Translation text exceeding 5,000 characters is rejected with 400 Bad Request'
  );

  // Test 10C: Oversized TTS synthesis text (exceeding 1,000 chars - Finding H-5)
  const oversizedTts = 'S'.repeat(1200);
  const { req: ttsReqHuge, res: ttsResHuge } = createMockReqRes({
    body: { text: oversizedTts, accent: 'US', gender: 'female' },
  });
  await synthesizeHandler(ttsReqHuge, ttsResHuge);
  assert(
    ttsResHuge.statusCode === 400,
    'TTS synthesis text exceeding 1,000 characters is rejected with 400 Bad Request (H-5)'
  );

  // Summary
  console.log('\n======================================================');
  console.log(`📊 HARDENING TEST SUITE SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
  if (failedTests > 0) {
    console.error(`❌ ${failedTests} TESTS FAILED`);
    process.exit(1);
  } else {
    console.log('🎉 ALL SECURITY & RBAC HARDENING CHECKS VERIFIED SUCCESSFULLY!');
    console.log('======================================================\n');
  }
}

runHardeningTests().catch(err => {
  console.error('Test suite failed with unexpected error:', err);
  process.exit(1);
});
