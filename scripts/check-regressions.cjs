// Explicit allowlist: each regression is offline and must finish successfully.
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const checks = [
  'check-admin-honesty.cjs',
  'check-auth-error-i18n.cjs',
  'check-certificate-errors.cjs',
  'check-otp-fallbacks.cjs',
  'check-video-detail-i18n.cjs',
  'check-video-import-boundary.cjs',
  'check-video-import-errors.cjs',
  'check-video-verification.cjs',
  'check-collection-labels.cjs',
  'check-translation-counts.cjs',
  'check-tutor-metadata.cjs',
  'check-metadata-consumers.cjs',
  'check-writing-feedback.cjs',
  'check-pronunciation-guess.cjs',
  'check-phrase-retry.cjs',
  'check-exam-vocab-retry.cjs',
  'check_progress_fallbacks.cjs',
  'check_recovery_fallbacks.cjs',
];
for (const check of checks) {
  console.log(`\n=== ${check}`);
  const result = spawnSync(process.execPath, [path.join(__dirname, check)], {
    cwd: path.join(__dirname, '..'), stdio: 'inherit', timeout: 30000,
  });
  if (result.error) console.error(result.error.message);
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
console.log(`\nAll ${checks.length} offline regression checks passed.`);
