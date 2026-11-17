export type LiteracySaved = { storageUnreadable?: boolean; done: string[]; drafts: Record<string, string> };
export const LEGACY_LITERACY_KEY = 'henglish-literacy-v1';
export const literacyStorageKey = (id?: string) => `${LEGACY_LITERACY_KEY}:${id && !id.startsWith('guest-') && !id.startsWith('demo-') ? `user:${encodeURIComponent(id)}` : 'guest'}`;
function readable(value: unknown): value is { done?: string[]; drafts?: Record<string, string> } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const p = value as Record<string, unknown>;
  return (p.done === undefined || (Array.isArray(p.done) && p.done.every(x => typeof x === 'string'))) &&
    (p.drafts === undefined || (!!p.drafts && typeof p.drafts === 'object' && !Array.isArray(p.drafts) && Object.values(p.drafts).every(x => typeof x === 'string')));
}
export function loadLiteracy(key: string): LiteracySaved {
  try {
    const guestKey = literacyStorageKey();
    if (localStorage.getItem(guestKey) === null) {
      const legacy = localStorage.getItem(LEGACY_LITERACY_KEY);
      if (legacy !== null) localStorage.setItem(guestKey, legacy);
    }
  } catch { /* A failed migration must not block reading an existing account. */ }
  try {
    const p = JSON.parse(localStorage.getItem(key) || '{}');
    return {
      ...(!readable(p) ? { storageUnreadable: true } : {}),
      done: Array.isArray(p?.done) ? p.done.filter((x: unknown) => typeof x === 'string') : [],
      drafts: p?.drafts && typeof p.drafts === 'object' && !Array.isArray(p.drafts)
        ? Object.fromEntries(Object.entries(p.drafts).filter((entry): entry is [string, string] => typeof entry[1] === 'string')) : {},
    };
  } catch { return { done: [], drafts: {}, storageUnreadable: true }; }
}

// Never turn an unreadable saved record into an empty replacement.
export function saveLiteracy(key: string, saved: LiteracySaved): boolean {
  if (saved.storageUnreadable) return false;
  try {
    const raw = localStorage.getItem(key);
    const current: unknown = raw === null ? {} : JSON.parse(raw);
    if (!readable(current)) return false;
    // Completion is monotonic: a stale workshop must not erase another tab's work.
    const done = [...new Set([...(current.done || []), ...saved.done])];
    localStorage.setItem(key, JSON.stringify({ done, drafts: { ...current.drafts, ...saved.drafts } }));
    return true;
  } catch { return false; }
}
