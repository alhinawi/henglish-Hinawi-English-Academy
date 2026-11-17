import { mediaStorageKey } from './accountMediaStorage';
export const SOURCE_BOOKMARKS_KEY = 'henglish-source-bookmarks';
function parseBookmarks(raw: string | null): string[] {
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(id => typeof id === 'string' && id.trim())) throw new Error('Invalid source bookmarks');
  return [...new Set(parsed)];
}
export function loadSourceBookmarks(userId?: string): string[] {
  // Browser-wide history has no owner. Copy once to guest, never to an account.
  // Keep the legacy record untouched, including when migration is unavailable.
  const guestKey = mediaStorageKey(SOURCE_BOOKMARKS_KEY);
  try {
    if (localStorage.getItem(guestKey) === null) {
      const legacy = localStorage.getItem(SOURCE_BOOKMARKS_KEY);
      if (legacy !== null) localStorage.setItem(guestKey, JSON.stringify(parseBookmarks(legacy)));
    }
  } catch { /* An invalid legacy record must not hide a valid account record. */ }
  return parseBookmarks(localStorage.getItem(mediaStorageKey(SOURCE_BOOKMARKS_KEY, userId)));
}
export function toggleSourceBookmark(id: string, userId?: string): string[] {
  // Re-read before writing. Do not replace malformed or inaccessible storage.
  const previous = loadSourceBookmarks(userId);
  const next = previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id];
  localStorage.setItem(mediaStorageKey(SOURCE_BOOKMARKS_KEY, userId), JSON.stringify(next));
  return next;
}
