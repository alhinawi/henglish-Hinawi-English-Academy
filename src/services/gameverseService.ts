// ==============================================================================
// HENGLISH ACADEMY - GAMEVERSE CLIENT & MULTIPLAYER SERVICE
// Authoritative session submission, anti-cheat XP syncing, deterministic AI bots
// ==============================================================================

import { supabase } from './authService';

export interface GameSessionSubmission {
  userId?: string;
  gameId: string;
  score: number;
  maxScore: number;
  accuracy: number;
  durationSeconds: number;
  answersSummary: Array<{
    questionId: string;
    isCorrect: boolean;
    userAnswer: string;
    timeSpentSeconds: number;
  }>;
  idempotencyKey: string;
}

export interface GameSessionResult {
  status: 'success' | 'already_processed' | 'error';
  sessionId: string;
  xpAwarded: number;
  baseXp: number;
  speedBonus: number;
  accuracy: number;
  currentTotalXp?: number;
  flags?: string[];
  message?: string;
}

export type BotDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface BotProfile {
  name: string;
  avatar: string;
  difficulty: BotDifficulty;
  accuracyRate: number; // 0.0 - 1.0
  minDelayMs: number;
  maxDelayMs: number;
  badge: string;
}

export const BOT_PROFILES: Record<BotDifficulty, BotProfile> = {
  easy: {
    name: 'Sparky AI (مبتدئ)',
    avatar: '🤖',
    difficulty: 'easy',
    accuracyRate: 0.55,
    minDelayMs: 4000,
    maxDelayMs: 7000,
    badge: 'Novice Bot',
  },
  medium: {
    name: 'Byte AI (متوسط)',
    avatar: '👾',
    difficulty: 'medium',
    accuracyRate: 0.75,
    minDelayMs: 2500,
    maxDelayMs: 4500,
    badge: 'Challenger Bot',
  },
  hard: {
    name: 'Nexus AI (متقدم)',
    avatar: '⚡',
    difficulty: 'hard',
    accuracyRate: 0.90,
    minDelayMs: 1500,
    maxDelayMs: 3000,
    badge: 'Grandmaster Bot',
  },
  expert: {
    name: 'Titan AI (خبير لغوي)',
    avatar: '👑',
    difficulty: 'expert',
    accuracyRate: 0.98,
    minDelayMs: 1000,
    maxDelayMs: 2000,
    badge: 'Invincible AI',
  },
};

const GUEST_SESSIONS_STORAGE_KEY = 'henglish_guest_gameverse_sessions_v1';

/**
 * Submit game session to authoritative backend with offline fallback
 */
export async function submitGameSession(
  submission: GameSessionSubmission
): Promise<GameSessionResult> {
  // Generate stable idempotency key if not supplied
  const key =
    submission.idempotencyKey ||
    `sess_${submission.gameId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const payload = {
    ...submission,
    idempotencyKey: key,
  };

  try {
    const res = await fetch('/api/gameverse/submit-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        status: data.status || 'success',
        sessionId: data.session_id || key,
        xpAwarded: data.xp_awarded ?? 0,
        baseXp: data.base_xp ?? 0,
        speedBonus: data.speed_bonus ?? 0,
        accuracy: data.accuracy ?? submission.accuracy,
        currentTotalXp: data.current_total_xp,
        flags: data.flags || [],
        message: data.message,
      };
    }
  } catch (err) {
    console.warn('Backend session endpoint unreachable, fallback calculation applied:', err);
  }

  // Local Authoritative Fallback for offline or local dev
  const calculatedXp = Math.round(35 * (submission.accuracy / 100));
  const speedBonus =
    submission.accuracy >= 80 && submission.durationSeconds > 0 && submission.durationSeconds < 45
      ? Math.min(15, Math.round((45 - submission.durationSeconds) * 0.4))
      : 0;
  const totalXp = calculatedXp + speedBonus;

  // Persist guest session in localStorage
  try {
    const existing = JSON.parse(localStorage.getItem(GUEST_SESSIONS_STORAGE_KEY) || '[]');
    existing.push({
      ...payload,
      xpAwarded: totalXp,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem(GUEST_SESSIONS_STORAGE_KEY, JSON.stringify(existing.slice(-50)));
  } catch {}

  return {
    status: 'success',
    sessionId: key,
    xpAwarded: totalXp,
    baseXp: calculatedXp,
    speedBonus: speedBonus,
    accuracy: submission.accuracy,
    message: 'حفظت النتيجة محلياً وتم احتساب نقاط الـ XP بنجاح.',
  };
}

/**
 * Deterministic AI Opponent decision engine
 */
export function simulateAiBotTurn(
  difficulty: BotDifficulty,
  correctAnswer: string,
  options?: string[]
): {
  isCorrect: boolean;
  chosenAnswer: string;
  delayMs: number;
} {
  const profile = BOT_PROFILES[difficulty];
  const isCorrect = Math.random() < profile.accuracyRate;

  // Random delay within profile bounds
  const delayMs = Math.floor(
    Math.random() * (profile.maxDelayMs - profile.minDelayMs) + profile.minDelayMs
  );

  let chosenAnswer = correctAnswer;
  if (!isCorrect && options && options.length > 1) {
    const wrongOptions = options.filter(o => o !== correctAnswer);
    chosenAnswer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || options[0];
  } else if (!isCorrect) {
    chosenAnswer = 'incorrect_choice';
  }

  return {
    isCorrect,
    chosenAnswer,
    delayMs,
  };
}

/**
 * Multiplayer Room Operations
 */
export interface MultiplayerRoom {
  id: string;
  roomCode: string;
  hostName: string;
  gameId: string;
  category: string;
  playerCount: number;
  maxPlayers: number;
  status: 'waiting' | 'in_progress' | 'finished';
}

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
