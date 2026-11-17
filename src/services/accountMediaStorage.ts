export function mediaStorageKey(base: string, userId?: string): string {
  return !userId || userId.startsWith('guest-') || userId.startsWith('demo-')
    ? `${base}:guest` : `${base}:user:${encodeURIComponent(userId)}`;
}

export function readMediaList(base: string, userId?: string): unknown[] {
  try {
    const guest = mediaStorageKey(base);
    if (localStorage.getItem(guest) === null) {
      const legacy = localStorage.getItem(base);
      // The browser-wide record has no reliable owner. Preserve it as guest
      // once, keeping the original untouched as a recovery copy.
      try {
        if (legacy !== null && Array.isArray(JSON.parse(legacy))) localStorage.setItem(guest, legacy);
      } catch { /* A damaged legacy copy must not hide a valid owner record. */ }
    }
    const parsed: unknown = JSON.parse(localStorage.getItem(mediaStorageKey(base, userId)) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
