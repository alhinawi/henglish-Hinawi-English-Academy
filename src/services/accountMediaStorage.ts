export function mediaStorageKey(base: string, userId?: string): string {
  return !userId || userId.startsWith('guest-') || userId.startsWith('demo-')
    ? `${base}:guest` : `${base}:user:${encodeURIComponent(userId)}`;
}

export function readMediaList(base: string, userId?: string): unknown[] {
  try {
    // Legacy guest recovery is best-effort and independent of owner reads.
    try {
      const guest = mediaStorageKey(base);
      if (localStorage.getItem(guest) === null) {
        const legacy = localStorage.getItem(base);
        // Preserve the original browser-wide record as a recovery copy.
        if (legacy !== null && Array.isArray(JSON.parse(legacy))) localStorage.setItem(guest, legacy);
      }
    } catch { /* A failed migration must not hide a valid owner record. */ }
    const parsed: unknown = JSON.parse(localStorage.getItem(mediaStorageKey(base, userId)) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
