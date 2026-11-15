// ==============================================================================
// Henglish Academy - Arcade Progress (Phase 1, browser-side)
// XP, daily streak and per-game best scores live in localStorage until the
// owner approves the D1 tables that move them server-side (Phase 2).
// ==============================================================================

import { useSyncExternalStore, useCallback } from 'react';

export interface ArcadeProgress {
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

const KEY = 'henglish_arcade_v1';

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

function read(): ArcadeProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const p = JSON.parse(raw) as Partial<ArcadeProgress>;
    return {
      history: Array.isArray(p.history) ? p.history.filter(r => r && typeof r.at === 'number' && typeof r.xp === 'number').slice(-100) : [],
      xp: typeof p.xp === 'number' ? p.xp : 0,
      totalPlays: typeof p.totalPlays === 'number' ? p.totalPlays : 0,
      best: p.best && typeof p.best === 'object' ? p.best : {},
      plays: p.plays && typeof p.plays === 'object' ? p.plays : {},
      lastPlayDay: typeof p.lastPlayDay === 'string' ? p.lastPlayDay : null,
      streakDays: typeof p.streakDays === 'number' ? p.streakDays : 0,
    };
  } catch {
    return { ...EMPTY };
  }
}

let state: ArcadeProgress = typeof window === 'undefined' ? { ...EMPTY } : read();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // private mode: progress lives in memory only
  }
  listeners.forEach((l) => l());
}

/**
 * Records one finished game run. score is the run's points (correct answers,
 * seconds left, etc.). Returns the XP this run earned so the end screen can
 * show it.
 */
export function recordGameResult(gameId: string, score: number): { xpEarned: number; newBest: boolean } {
  const prev = state;
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

  state = {
    history: [...prev.history, { id: gameId, score, xp: xpEarned, at: Date.now() }].slice(-100),
    xp: prev.xp + xpEarned,
    totalPlays: prev.totalPlays + 1,
    best: { ...prev.best, [gameId]: Math.max(bestScore, score) },
    plays: { ...prev.plays, [gameId]: (prev.plays[gameId] ?? 0) + 1 },
    lastPlayDay: today,
    streakDays: streak,
  };
  persist();
  return { xpEarned, newBest };
}

export function useArcadeProgress(): ArcadeProgress {
  const subscribe = useCallback((cb: () => void) => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);
  return useSyncExternalStore(subscribe, () => state, () => state);
}
