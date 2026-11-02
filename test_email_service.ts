// ==============================================================================
// HENGLISH ACADEMY - BREVO SMTP AUTOMATED VERIFICATION SUITE
// Tests configuration, templates, validation, rate limits, live SMTP handshake & delivery
// ==============================================================================

import { getSmtpConfig, getSafeSmtpDiagnostics, maskSecret } from './server/email/emailConfig';
import {
  renderWelcomeEmail,
  renderVerificationGuidanceEmail,
  renderPasswordResetGuidanceEmail,
  renderPasswordChangedEmail,
  renderAccountNotificationEmail,
  renderAdminTestEmail,
  escapeHtml,
} from './server/email/emailTemplates';
import {
  isValidEmail,
  verifySmtpConnection,
  sendEmail,
  sendAdminTestEmail,
  sendWelcomeEmail,
} from './server/email/emailService';

import * as fs from 'fs';
import * as path from 'path';

// Load .env variables directly using Node built-in file parsing
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const idx = trimmed.indexOf('=');
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (key && !process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (err) {
  console.warn('Could not load .env file:', err);
}

let passed = 0;
let failed = 0;

function assert(condition: boolean, name: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${name}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('📧 HENGLISH ACADEMY - BREVO SMTP VERIFICATION SUITE');
  console.log('======================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: CONFIGURATION & CREDENTIAL MASKING
  // --------------------------------------------------------------------------
  console.log('--- TEST 1: SMTP Configuration & Masking ---');
  const config = getSmtpConfig();
  assert(config.host === 'smtp-relay.brevo.com', `Host is Brevo SMTP relay (${config.host})`);
  assert(config.port === 587, `Port is 587 STARTTLS (${config.port})`);
  assert(Boolean(config.user), `SMTP user is configured (${config.user})`);
  assert(config.fromEmail === 'no-reply@henglish.academy', `From email is ${config.fromEmail}`);

  // Test secret masking
  const maskedKey = maskSecret('xsmtpsib-1234567890abcdef');
  assert(maskedKey.startsWith('xsmt') && maskedKey.endsWith('cdef'), `Secret masking preserves prefix/suffix (${maskedKey})`);
  assert(!maskedKey.includes('1234567890'), 'Secret masking completely obscures middle payload');

  const diagnostics = getSafeSmtpDiagnostics();
  assert(diagnostics.maskedPassword !== config.password, 'Diagnostics never expose raw password');
  assert(diagnostics.isConfigured, 'SMTP is marked as configured');

  // --------------------------------------------------------------------------
  // TEST 2: EMAIL TEMPLATE RENDERING & XSS SANITIZATION
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2: Email Template Rendering & HTML Escaping ---');

  // HTML escaping check
  const dangerousString = '<script>alert("xss")</script> & "test"';
  const escaped = escapeHtml(dangerousString);
  assert(!escaped.includes('<script>') && escaped.includes('&lt;script&gt;'), 'HTML escaping eliminates script injection');

  // 1. Welcome Email
  const welcome = renderWelcomeEmail({
    name: 'أحمد محمود <script>',
    email: 'ahmed@example.com',
    loginUrl: 'https://henglish.academy/#login',
  });
  assert(welcome.subject.includes('Welcome') && welcome.subject.includes('مرحباً'), 'Welcome email subject rendered');
  assert(!welcome.html.includes('<script>') && welcome.html.includes('&lt;script&gt;'), 'Welcome email escapes user name safely');
  assert(welcome.text.length > 50, 'Welcome email has plain text fallback');

  // 2. Verification Guidance
  const verifyGuidance = renderVerificationGuidanceEmail({
    name: 'Sarah',
    email: 'sarah@example.com',
    verificationOtp: '849201',
    verificationUrl: 'https://henglish.academy/#verify',
  });
  assert(verifyGuidance.html.includes('849201'), 'Verification OTP correctly rendered in template');
  assert(verifyGuidance.subject.includes('التحقق'), 'Verification guidance subject rendered');

  // 3. Password Reset Guidance
  const resetGuidance = renderPasswordResetGuidanceEmail({
    name: 'Omar',
    email: 'omar@example.com',
    resetUrl: 'https://henglish.academy/#reset-password',
  });
  assert(resetGuidance.html.includes('https://henglish.academy/#reset-password'), 'Password reset URL rendered in CTA');

  // 4. Password Changed Notification
  const passChanged = renderPasswordChangedEmail({
    name: 'Laila',
    email: 'laila@example.com',
    ipAddress: '197.165.20.1',
    changeTime: '2026-11-02 03:00 UTC',
  });
  assert(passChanged.html.includes('197.165.20.1'), 'IP address correctly included in security alert');

  // 5. Account Notification
  const notif = renderAccountNotificationEmail({
    name: 'Khaled',
    email: 'khaled@example.com',
    title: 'تهانينا! لقد حصلت على وسام C1 Titan',
    message: 'لقد أكملت جميع تحديات برج القواعد بنجاح.',
    actionText: 'عرض الوسام',
    actionUrl: 'https://henglish.academy/#profile',
  });
  assert(notif.html.includes('C1 Titan'), 'Notification title rendered');

  // 6. Admin Test Email
  const adminTest = renderAdminTestEmail({
    timestamp: new Date().toISOString(),
    host: config.host,
    user: config.user,
    environment: 'testing',
  });
  assert(adminTest.html.includes('Brevo SMTP Verification'), 'Admin test email rendered');

  // --------------------------------------------------------------------------
  // TEST 3: RECIPIENT VALIDATION & ERROR SHIELDING
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 3: Recipient Email Validation ---');
  assert(isValidEmail('learner@henglish.academy'), 'Valid email recognized: learner@henglish.academy');
  assert(isValidEmail('user.name+tag@domain.co.uk'), 'Valid plus-tagged email recognized');
  assert(!isValidEmail('plainaddress'), 'Invalid email rejected: plainaddress');
  assert(!isValidEmail('@missinguser.com'), 'Invalid email rejected: @missinguser.com');
  assert(!isValidEmail('user@.com'), 'Invalid email rejected: user@.com');
  assert(!isValidEmail(''), 'Empty email rejected');

  // --------------------------------------------------------------------------
  // TEST 4: IN-MEMORY RATE LIMITING
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 4: Rate Limiting Enforcement ---');
  const spamTarget = `rate-test-${Date.now()}@test.henglish.academy`;

  let rateLimitHit = false;
  for (let i = 0; i < 7; i++) {
    const res = await sendEmail({
      to: spamTarget,
      subject: `Test ${i}`,
      html: '<p>Test</p>',
      text: 'Test',
    });
    if (!res.success && res.error?.includes('Rate limit exceeded')) {
      rateLimitHit = true;
      break;
    }
  }
  assert(rateLimitHit, 'Recipient rate limiter triggered after exceeding threshold');

  // --------------------------------------------------------------------------
  // TEST 5: LIVE BREVO SMTP CONNECTION & STARTTLS HANDSHAKE
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 5: Live Brevo SMTP Relay Connection Verification ---');
  const verifyResult = await verifySmtpConnection();
  console.log(`  Connection Result: ${verifyResult.message} (${verifyResult.latencyMs}ms)`);
  assert(verifyResult.success, `Brevo SMTP STARTTLS connection handshake succeeded: ${verifyResult.message}`);

  // --------------------------------------------------------------------------
  // TEST 6: LIVE SMTP DELIVERY TEST (REAL BREVO RELAY SUBMISSION)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 6: Live Brevo SMTP Email Submission ---');
  // Send test email to the configured Brevo SMTP user account
  const testRecipient = config.user; // c103be001@smtp-brevo.com
  console.log(`  Dispatching administrative test email to: ${testRecipient}`);

  const deliveryResult = await sendAdminTestEmail(testRecipient);
  if (deliveryResult.success) {
    console.log(`  Message ID assigned by Brevo: ${deliveryResult.messageId}`);
    assert(Boolean(deliveryResult.messageId), `Email accepted by Brevo SMTP relay (Message ID: ${deliveryResult.messageId})`);
  } else {
    console.error(`  Delivery error: ${deliveryResult.error}`);
    assert(false, `Brevo delivery failed: ${deliveryResult.error}`);
  }

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test suite failed unexpectedly:', err);
  process.exit(1);
});
