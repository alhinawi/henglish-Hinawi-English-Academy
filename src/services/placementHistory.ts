import type { CEFRLevel } from '../types';
export interface PlacementAttempt { date: string; level: CEFRLevel; score: number; total: number }
export const LEGACY_PLACEMENT_KEY = 'henglish_placement_history';
export const GUEST_PLACEMENT_KEY = `${LEGACY_PLACEMENT_KEY}:guest`;
export function placementHistoryKey(userId?: string): string {
  return !userId || userId.startsWith('guest-') || userId.startsWith('demo-')
    ? GUEST_PLACEMENT_KEY : `${LEGACY_PLACEMENT_KEY}:user:${encodeURIComponent(userId)}`;
}
export function loadPlacementHistory(key: string): PlacementAttempt[] {
  try {
    try {
      if (localStorage.getItem(GUEST_PLACEMENT_KEY) === null) {
        const legacy = localStorage.getItem(LEGACY_PLACEMENT_KEY);
        if (legacy !== null && Array.isArray(JSON.parse(legacy))) localStorage.setItem(GUEST_PLACEMENT_KEY, legacy);
      }
    } catch { /* Guest recovery must not hide a valid owner history. */ }
    const raw: unknown = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.filter((v): v is PlacementAttempt => v && typeof v === 'object' &&
      typeof v.date === 'string' && ['A1','A2','B1','B2','C1','C2'].includes(v.level) &&
      Number.isFinite(v.score) && Number.isFinite(v.total) && v.total > 0 && v.score >= 0 && v.score <= v.total).slice(0, 5);
  } catch { return []; }
}

/** Read current history before saving. Never replace unreadable or damaged bytes. */
export function savePlacementAttempt(key: string, attempt: PlacementAttempt): PlacementAttempt[] {
  const raw = localStorage.getItem(key);
  const current: unknown = raw === null ? [] : JSON.parse(raw);
  if (!Array.isArray(current) || current.some(v => !v || typeof v !== 'object' ||
    typeof v.date !== 'string' || !['A1','A2','B1','B2','C1','C2'].includes(v.level) ||
    !Number.isFinite(v.score) || !Number.isFinite(v.total) || v.total <= 0 || v.score < 0 || v.score > v.total)) {
    throw new Error('Invalid placement history');
  }
  const updated = [attempt, ...current].slice(0, 5);
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
}
