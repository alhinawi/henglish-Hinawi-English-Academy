// Check the pure profile/goal definitions without loading auth or storage effects.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const source = fs.readFileSync('src/utils/useProgress.ts', 'utf8');
const ast = ts.createSourceFile('progress.ts', source, ts.ScriptTarget.Latest, true);
const names = new Set(['DEFAULT_STUDENT_PROFILE', 'DEFAULT_TEACHER_PROFILE', 'DAILY_GOAL_DEFS', 'todayKey', 'emptyActivity', 'dailyActivityOf', 'deriveDailyGoals']);
const selected = ast.statements.filter(node => {
  if (ts.isFunctionDeclaration(node)) return node.name && names.has(node.name.text);
  return ts.isVariableStatement(node) && node.declarationList.declarations.some(d => names.has(d.name.getText(ast)));
}).map(node => node.getText(ast)).join('\n');
const js = ts.transpileModule(selected, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }}).outputText;
const context = {exports: {}, Date, console};
vm.runInNewContext(js, context);
const {DEFAULT_STUDENT_PROFILE: student, DEFAULT_TEACHER_PROFILE: teacher, deriveDailyGoals} = context.exports;
for (const profile of [student, teacher]) {
  assert.equal(profile.xp, 0); assert.equal(profile.streakDays, 0);
  for (const field of ['email', 'avatar', 'joinedDate', 'bio', 'nameAr']) assert.equal(profile[field], '');
  assert.equal(profile.currentLevel, 'A1');
}
assert.equal(student.name, 'Learner'); assert.equal(teacher.name, 'Teacher');
const zero = deriveDailyGoals({});
assert(zero.every(g => g.current === 0 && !g.completed));
const now = new Date();
const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
const progress = {dailyGoals: {date, lessons: 1, flashcards: 10, speaking: 1, quizzes: 1, quiz80: true}};
const before = JSON.stringify(progress);
for (const lang of ['ar','en','de']) {
  const messages = JSON.parse(fs.readFileSync(`src/i18n/locales/${lang}.json`, 'utf8'));
  const goals = deriveDailyGoals(progress, key => messages[key]);
  assert(goals.every(g => g.completed && g.titleAr && g.unit && !g.titleAr.startsWith('pg.')));
  assert.equal(JSON.stringify(progress), before);
}
assert(deriveDailyGoals({dailyGoals: [{current: 99, completed: true}]}).every(g => g.current === 0));
console.log('Neutral profiles, real daily counts, legacy-array handling, 3-language copy and no input mutation: PASS');
