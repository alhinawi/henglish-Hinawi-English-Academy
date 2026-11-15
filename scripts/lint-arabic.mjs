// Arabic content lint (Hinawi accuracy bar).
// Use normal Unicode Arabic letters. U+0648 is WAW (و).
// U+FEE5 is ARABIC LETTER NOON ISOLATED FORM, not waw. A previous lint rule
// incorrectly recommended it for conjunctions next to Latin text.
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import assert from 'node:assert/strict';

const loneG = /[\u0600-\u06FF]\s+g\s+[\u0600-\u06FF]/g;

export function lintArabicLine(line) {
  const issues = [];
  if (line.includes('\uFEE5')) {
    issues.push('U+FEE5 is an isolated NOON, not WAW. For the Arabic conjunction use normal و (U+0648); do not substitute presentation-form letters.');
  }
  loneG.lastIndex = 0;
  let match;
  while ((match = loneG.exec(line))) {
    issues.push(`lone Latin "g" between Arabic words - corrupted و? ${match[0].trim()}`);
  }
  return issues;
}

if (process.argv.includes('--self-test')) {
  assert.deepEqual(lintArabicLine('الفرق بين Make و Do'), []);
  assert.deepEqual(lintArabicLine('الاستخدام مع While وWhen'), []);
  assert.deepEqual(lintArabicLine('و + كلمة English'), []);
  assert.equal(lintArabicLine('Make \uFEE5 Do').length, 1);
  assert.equal(lintArabicLine('الكلمة g الثانية').length, 1);
  assert.deepEqual(lintArabicLine('الكلمة الإنجليزية beginning صحيحة'), []);
  console.log('Arabic lint regression tests passed (6 cases).');
} else {
  const files = execSync("git ls-files 'src/**/*.ts' 'src/**/*.tsx'", { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  let errors = 0;
  for (const file of files) {
    readFileSync(file, 'utf8').split('\n').forEach((line, index) => {
      for (const issue of lintArabicLine(line)) {
        console.error(`${file}:${index + 1} ${issue}`);
        errors++;
      }
    });
  }
  if (errors) {
    console.error(`\n${errors} Arabic content error(s)`);
    process.exit(1);
  }
  console.log('Arabic content lint passed.');
}
