import type { UserProgressState } from '../types';

export const LEGACY_PROGRESS_KEY = 'hinawi_english_progress_v2';
export const GUEST_PROGRESS_KEY = `${LEGACY_PROGRESS_KEY}:guest`;
export function progressStorageKey(userId?: string): string {
  return !userId || userId.startsWith('guest-') || userId.startsWith('demo-')
    ? GUEST_PROGRESS_KEY : `${LEGACY_PROGRESS_KEY}:user:${encodeURIComponent(userId)}`;
}

export function readAccountProgress(key: string, defaults: UserProgressState): UserProgressState {
  try {
    // Legacy progress has no reliable owner. Preserve it as guest only, once.
    // Keep the original key untouched as a recovery copy. Never seed an account
    // from another account or the guest record.
    if (localStorage.getItem(GUEST_PROGRESS_KEY) === null) {
      const legacy = localStorage.getItem(LEGACY_PROGRESS_KEY);
      if (legacy !== null) {
        const parsed: unknown = JSON.parse(legacy);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          localStorage.setItem(GUEST_PROGRESS_KEY, legacy);
        }
      }
    }
    const raw = localStorage.getItem(key);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { ...defaults, ...parsed };
    }
  } catch { /* Storage can be denied or contain an invalid legacy record. */ }
  return { ...defaults, quizScores: {}, completedLessons: [], knownFlashcards: [], reviewFlashcards: [], notes: [], bookmarks: [] };
}
