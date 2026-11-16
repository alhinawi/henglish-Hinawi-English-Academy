/** Legacy lesson traps keep their source wording; only split explicit correction markers. */
export function splitLessonCorrection(text: string) {
  const wrong = /الخطأ\s*:?\s*/.exec(text);
  if (!wrong) return null;
  const rest = text.slice(wrong.index + wrong[0].length);
  const correct = /[،؛,]?\s*(?:الصح|الصواب|الأدق للحاضر|الأدق|الأفصح|الطبيعي)(?:\s+بدون فواصل)?\s*:\s*/.exec(rest);
  if (!correct) return null;
  return { intro: text.slice(0, wrong.index).trim(), wrong: rest.slice(0, correct.index).trim(), correct: rest.slice(correct.index + correct[0].length).trim() };
}
