import { CEFRLevel } from '../types';

/**
 * Single source of truth for CEFR level presentation.
 * Arabic labels approved by Hinawi: A1 مبتدئ، A2 أساسي، B1 متوسط،
 * B2 فوق المتوسط، C1 متقدم، C2 إتقان.
 */
export const CEFR_LEVELS: readonly CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const CEFR_LABELS_AR: Record<CEFRLevel, string> = {
  A1: 'مبتدئ',
  A2: 'أساسي',
  B1: 'متوسط',
  B2: 'فوق المتوسط',
  C1: 'متقدم',
  C2: 'إتقان',
};

export const CEFR_LABELS_EN: Record<CEFRLevel, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced',
  C2: 'Mastery',
};

/** Cumulative XP required to ENTER each level. */
export const LEVEL_XP_THRESHOLDS: Record<CEFRLevel, number> = {
  A1: 0,
  A2: 1000,
  B1: 2500,
  B2: 5000,
  C1: 8500,
  C2: 13000,
};

export function nextLevelOf(level: CEFRLevel): CEFRLevel | null {
  const idx = CEFR_LEVELS.indexOf(level);
  return idx >= 0 && idx < CEFR_LEVELS.length - 1 ? CEFR_LEVELS[idx + 1] : null;
}

/**
 * Real XP-based progress toward the next level (0-100).
 * Returns 100 when already at the top level.
 */
export function levelProgressPercent(xp: number, level: CEFRLevel): number {
  const next = nextLevelOf(level);
  if (!next) return 100;
  const floor = LEVEL_XP_THRESHOLDS[level];
  const ceil = LEVEL_XP_THRESHOLDS[next];
  const span = Math.max(1, ceil - floor);
  const into = Math.min(Math.max(0, xp - floor), span);
  return Math.round((into / span) * 100);
}

/** XP still needed to reach the next level (0 at top level). */
export function xpToNextLevel(xp: number, level: CEFRLevel): number {
  const next = nextLevelOf(level);
  if (!next) return 0;
  return Math.max(0, LEVEL_XP_THRESHOLDS[next] - xp);
}

/**
 * Arabic counted-noun form for a day streak (Egyptian colloquial):
 * 1 → يوم واحد، 2 → يومين، 3-10 → N أيام، 11+ → N يوم.
 */
export function formatDaysAr(n: number): string {
  if (n === 1) return 'يوم واحد';
  if (n === 2) return 'يومين';
  if (n >= 3 && n <= 10) return `${n} أيام`;
  return `${n} يوم`;
}

/** Same, with the trailing adjective form used in streak copy. */
export function formatStreakAr(n: number): string {
  if (n === 1) return 'يوم متتالي';
  if (n === 2) return 'يومين متتاليين';
  if (n >= 3 && n <= 10) return `${n} أيام متتالية`;
  return `${n} يوم متتالي`;
}
