// Lightweight course catalog used by the main progress store. The regression
// test checks this list against the full lesson content without bundling that
// content into every page.
export const FUTURE_PERFECT_LESSON_IDS = [
  'lesson-1', 'lesson-2', 'lesson-3', 'lesson-4',
  'lesson-5', 'lesson-6', 'lesson-7', 'lesson-8',
] as const;

export function futurePerfectProgress(completedLessons: unknown) {
  const completed = new Set(Array.isArray(completedLessons) ? completedLessons : []);
  const count = FUTURE_PERFECT_LESSON_IDS.filter(id => completed.has(id)).length;
  return { count, total: FUTURE_PERFECT_LESSON_IDS.length,
    percentage: Math.round(count / FUTURE_PERFECT_LESSON_IDS.length * 100) };
}
