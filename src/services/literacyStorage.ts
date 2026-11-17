export type LiteracySaved = { done: string[]; drafts: Record<string, string> };
export const LEGACY_LITERACY_KEY = 'henglish-literacy-v1';
export const literacyStorageKey = (id?: string) => `${LEGACY_LITERACY_KEY}:${id && !id.startsWith('guest-') && !id.startsWith('demo-') ? `user:${encodeURIComponent(id)}` : 'guest'}`;
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
      done: Array.isArray(p?.done) ? p.done.filter((x: unknown) => typeof x === 'string') : [],
      drafts: p?.drafts && typeof p.drafts === 'object' && !Array.isArray(p.drafts)
        ? Object.fromEntries(Object.entries(p.drafts).filter((entry): entry is [string, string] => typeof entry[1] === 'string')) : {},
    };
  } catch { return { done: [], drafts: {} }; }
}
