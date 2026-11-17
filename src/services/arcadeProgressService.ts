// ==============================================================================
// Henglish Academy - Arcade Progress (Phase 1, browser-side)
// XP, daily streak and per-game best scores live in localStorage until the
// owner approves the D1 tables that move them server-side (Phase 2).
// ==============================================================================

import { useSyncExternalStore, useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export interface ArcadeProgress {
  storageFailed?: boolean;
  history: { id: string; score: number; xp: number; at: number }[];
  xp: number;
  totalPlays: number;
  /** best score per game id */
  best: Record<string, number>;
  /** finished runs per game id */
  plays: Record<string, number>;
  /** local date (yyyy-mm-dd) of the last finished game */
  lastPlayDay: string | null;
  /** consecutive days with at least one finished game */
  streakDays: number;
}

export const LEGACY_ARCADE_KEY = 'henglish_arcade_v1';
export const GUEST_ARCADE_KEY = `${LEGACY_ARCADE_KEY}:guest`;
export function arcadeStorageKey(userId?: string): string {
  return !userId || userId.startsWith('guest-') || userId.startsWith('demo-')
    ? GUEST_ARCADE_KEY : `${LEGACY_ARCADE_KEY}:user:${encodeURIComponent(userId)}`;
}

const EMPTY: ArcadeProgress = {
  history: [],
  xp: 0,
  totalPlays: 0,
  best: {},
  plays: {},
  lastPlayDay: null,
  streakDays: 0,
};

function dayKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function read(key: string): ArcadeProgress {
  try {
    // The old browser-wide record has no reliable owner. Copy it to guest
    // once and retain the original for recovery, never seed a signed-in user.
    if (localStorage.getItem(GUEST_ARCADE_KEY) === null) {
      const legacy = localStorage.getItem(LEGACY_ARCADE_KEY);
      if (legacy !== null) {
        const parsed: unknown = JSON.parse(legacy);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          localStorage.setItem(GUEST_ARCADE_KEY, legacy);
        }
      }
    }
    const raw = localStorage.getItem(key);
    if (!raw) return { ...EMPTY };
    const p = JSON.parse(raw) as Partial<ArcadeProgress>;
    if (!p || typeof p !== 'object' || Array.isArray(p)) return { ...EMPTY };
    const nonNegative = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
    const counts = (v: unknown): Record<string, number> => v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).filter(([, count]) => nonNegative(count))) : {};
    return {
      history: Array.isArray(p.history) ? p.history.filter(r => r && typeof r.id === 'string' && nonNegative(r.at) && nonNegative(r.xp) && nonNegative(r.score)).slice(-100) : [],
      xp: nonNegative(p.xp) ? p.xp : 0,
      totalPlays: nonNegative(p.totalPlays) ? p.totalPlays : 0,
      best: counts(p.best),
      plays: counts(p.plays),
      lastPlayDay: typeof p.lastPlayDay === 'string' ? p.lastPlayDay : null,
      streakDays: nonNegative(p.streakDays) ? p.streakDays : 0,
    };
  } catch {
    return { ...EMPTY };
  }
}

const states = new Map<string, ArcadeProgress>();
function getState(key: string): ArcadeProgress {
  if (!states.has(key)) states.set(key, typeof window === 'undefined' ? { ...EMPTY } : read(key));
  return states.get(key)!;
}
const listeners = new Set<() => void>();

function persist(key: string, state: ArcadeProgress): boolean {
  const { storageFailed: previousFailure, ...durable } = state;
  let saved = false;
  try { localStorage.setItem(key, JSON.stringify(durable)); saved = true; } catch { /* Keep this visit usable, but disclose the unsaved progress. */ }
  states.set(key, { ...durable, storageFailed: !saved });
  listeners.forEach((l) => l());
  return saved;
}

/**
 * Records one finished game run. score is the run's points (correct answers,
 * seconds left, etc.). Returns the XP this run earned so the end screen can
 * show it.
 */
function recordGameResult(key: string, gameId: string, score: number): { xpEarned: number; newBest: boolean } {
  if (!Number.isFinite(score) || score < 0) return { xpEarned: 0, newBest: false };
  const prev = getState(key);
  const bestScore = prev.best[gameId] ?? 0;
  const newBest = score > bestScore;

  const today = dayKey(new Date());
  let streak = prev.streakDays;
  if (prev.lastPlayDay !== today) {
    const yesterday = dayKey(new Date(Date.now() - 86_400_000));
    streak = prev.lastPlayDay === yesterday ? streak + 1 : 1;
  }

  // XP: 10 per point, +20 for finishing, +40 for a personal best.
  const xpEarned = Math.max(0, score) * 10 + 20 + (newBest && prev.totalPlays > 0 ? 40 : 0);

  const state: ArcadeProgress = {
    history: [...prev.history, { id: gameId, score, xp: xpEarned, at: Date.now() }].slice(-100),
    xp: prev.xp + xpEarned,
    totalPlays: prev.totalPlays + 1,
    best: { ...prev.best, [gameId]: Math.max(bestScore, score) },
    plays: { ...prev.plays, [gameId]: (prev.plays[gameId] ?? 0) + 1 },
    lastPlayDay: today,
    streakDays: streak,
  };
  persist(key, state);
  return { xpEarned, newBest };
}

export function useArcadeProgress() {
  const { user } = useAuth();
  const key = arcadeStorageKey(user?.id);
  const current = useRef({ key, mounted: true });
  current.current.key = key;
  useEffect(() => {
    current.current.mounted = true;
    return () => { current.current.mounted = false; };
  }, []);
  const recordResult = useCallback((gameId: string, score: number) => {
    if (!current.current.mounted || current.current.key !== key) return { xpEarned: 0, newBest: false };
    return recordGameResult(key, gameId, score);
  }, [key]);
  const retrySave = useCallback(() => {
    if (!current.current.mounted || current.current.key !== key) return false;
    return persist(key, getState(key));
  }, [key]);
  const subscribe = useCallback((cb: () => void) => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);
  const snapshot = useSyncExternalStore(subscribe, () => getState(key), () => getState(key));
  return useMemo(() => ({ ...snapshot, recordGameResult: recordResult, retrySave }), [snapshot, recordResult, retrySave]);
}
