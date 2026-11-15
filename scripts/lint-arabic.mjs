// Arabic content lint (Hinawi accuracy bar):
// 1) Standalone U+0648 (waw) adjacent to a Latin word must be written as U+FEE5
//    (ARABIC LETTER WAW ISOLATED FORM). Chrome does not apply Arabic shaping to a
//    waw in a Latin bidi run, and Cairo's default waw glyph looks exactly like a
//    Latin "g" there. U+FEE5 renders the classic waw everywhere.
// 2) A lone Latin "g" surrounded by Arabic words is the corrupted-waw signature.
// NOTE: JS \W treats Arabic letters as non-word chars - use explicit classes.
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const files = execSync("git ls-files 'src/**/*.ts' 'src/**/*.tsx'", { encoding: 'utf8' }).trim().split('\n');
const WORD = 'A-Za-z\\u0600-\\u06FF\\uFE70-\\uFEFF';
const SEP = '^A-Za-z0-9_\\u0600-\\u06FF\\u0660-\\u0669\\uFE70-\\uFEFF';
const ARAB = '\\u0600-\\u06FF';
const standaloneWaw = /(?<![\u0621-\u064A\u0671-\u06D3])\u0648(?![\u0621-\u064A\u0671-\u06D3])/g;
const leftWord = new RegExp(`([${WORD}]+)[${SEP}]*$`);
const rightWord = new RegExp(`^[${SEP}]*([${WORD}]+)`);
const loneG = new RegExp(`[${ARAB}]\\s+g\\s+[${ARAB}]`, 'g');
let errors = 0;
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (!/[\u0600-\u06FF]/.test(line)) return; // content lines only, skip escaped-code lines
    standaloneWaw.lastIndex = 0;
    let m;
    while ((m = standaloneWaw.exec(line))) {
      const left = line.slice(Math.max(0, m.index - 60), m.index);
      const right = line.slice(m.index + 1, m.index + 61);
      const lw = left.match(leftWord);
      const rw = right.match(rightWord);
      if ((lw && /[A-Za-z]/.test(lw[1])) || (rw && /[A-Za-z]/.test(rw[1]))) {
        console.error(`${f}:${i + 1} standalone و next to Latin text - use U+FEE5 (ARABIC LETTER WAW ISOLATED FORM) or it renders as a Latin "g" with web fonts`);
        errors++;
      }
    }
    loneG.lastIndex = 0;
    while ((m = loneG.exec(line))) {
      console.error(`${f}:${i + 1} lone Latin "g" between Arabic words - corrupted و? ${m[0].trim()}`);
      errors++;
    }
  });
}
if (errors) { console.error(`\n${errors} Arabic content error(s)`); process.exit(1); }
console.log('Arabic content lint passed.');
