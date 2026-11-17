// Notes stay in this browser, separated by learner and lesson. No shared-key
// migration: older lesson notes existed only in component memory.
export function lessonNoteKey(lessonId: string, learnerId?: string): string {
  const owner = learnerId && !learnerId.startsWith('guest-') && !learnerId.startsWith('demo-')
    ? `user:${encodeURIComponent(learnerId)}` : 'guest';
  return `henglish-lesson-note-v1:${owner}:${encodeURIComponent(lessonId)}`;
}
export function readLessonNote(key: string): { text: string; failed: boolean } {
  try { return { text: localStorage.getItem(key) ?? '', failed: false }; }
  catch { return { text: '', failed: true }; }
}
export function saveLessonNote(key: string, text: string): boolean {
  try { localStorage.setItem(key, text); return true; }
  catch { return false; }
}
