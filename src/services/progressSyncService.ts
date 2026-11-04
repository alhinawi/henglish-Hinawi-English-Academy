import { supabase } from './authService';
import { UserProgressState, UserProfile } from '../types';

export interface PersistentProgressPayload {
  totalXp: number;
  currentLevel: string;
  targetLevel: string;
  streakDays: number;
  completedLessons: string[];
  completedRules: string[];
  quizScores: Record<string, number>;
  totalStudyTimeMinutes?: number;
  dailyGoalTarget?: number;
  dailyGoalCurrent?: number;
  dailyGoalCompleted?: boolean;
}

/**
 * Loads learning progress from Supabase for authenticated user.
 * Falls back to null if user not authenticated or on error.
 */
export async function loadUserProgressFromDatabase(userId: string): Promise<PersistentProgressPayload | null> {
  if (!supabase || !userId || userId.startsWith('guest-') || userId.startsWith('demo-')) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('user_learning_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      totalXp: data.total_xp || 0,
      currentLevel: data.current_level || 'A1',
      targetLevel: data.target_level || 'B2',
      streakDays: data.streak_days || 1,
      completedLessons: data.completed_lessons || [],
      completedRules: data.completed_rules || [],
      quizScores: data.quiz_scores || {},
      totalStudyTimeMinutes: data.total_study_time_minutes || 0,
      dailyGoalTarget: data.daily_goal_target || 1,
      dailyGoalCurrent: data.daily_goal_current || 0,
      dailyGoalCompleted: Boolean(data.daily_goal_completed),
    };
  } catch (err) {
    console.warn('[ProgressSync] Failed to load progress from DB:', err);
    return null;
  }
}

/**
 * Persists updated study progress to Supabase for authenticated user.
 * SECURITY: Total XP and XP points are strictly managed by server RPCs and cannot be overwritten by client sync.
 */
export async function saveUserProgressToDatabase(
  userId: string,
  payload: PersistentProgressPayload
): Promise<boolean> {
  if (!supabase || !userId || userId.startsWith('guest-') || userId.startsWith('demo-')) {
    return false;
  }

  try {
    // SECURITY HARDENING: Omit total_xp from client update to prevent client-side XP injection.
    const { error } = await supabase
      .from('user_learning_progress')
      .upsert({
        user_id: userId,
        current_level: payload.currentLevel,
        target_level: payload.targetLevel,
        streak_days: payload.streakDays,
        completed_lessons: payload.completedLessons,
        completed_rules: payload.completedRules,
        quiz_scores: payload.quizScores,
        total_study_time_minutes: payload.totalStudyTimeMinutes || 0,
        daily_goal_target: payload.dailyGoalTarget || 1,
        daily_goal_current: payload.dailyGoalCurrent || 0,
        daily_goal_completed: payload.dailyGoalCompleted || false,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.warn('[ProgressSync] Failed to save progress to DB:', error.message);
      return false;
    }

    // Update non-privileged learning progress metadata in profiles (level & streak only)
    await supabase
      .from('profiles')
      .update({
        streak_days: payload.streakDays,
        current_level: payload.currentLevel,
        target_level: payload.targetLevel,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return true;
  } catch (err) {
    console.warn('[ProgressSync] Save exception:', err);
    return false;
  }
}

/**
 * Vocabulary SRS persistence
 */
export async function saveVocabularySrsProgress(
  userId: string,
  wordId: string,
  headword: string,
  status: 'learning' | 'reviewed' | 'mastered',
  intervalDays: number = 1
): Promise<boolean> {
  if (!supabase || !userId || userId.startsWith('guest-') || userId.startsWith('demo-')) {
    return false;
  }

  try {
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + intervalDays);

    const { error } = await supabase
      .from('user_vocabulary_progress')
      .upsert({
        user_id: userId,
        word_id: wordId,
        headword,
        status,
        interval_days: intervalDays,
        next_review_at: nextReview.toISOString(),
        last_reviewed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,word_id' });

    return !error;
  } catch {
    return false;
  }
}

/**
 * Migrates local storage data to the authenticated user's Supabase account on first sign in.
 */
export async function migrateLocalProgressToSupabase(
  userId: string,
  localProgress: UserProgressState
): Promise<{ success: boolean; migratedCount: number }> {
  if (!supabase || !userId || userId.startsWith('guest-') || userId.startsWith('demo-')) {
    return { success: false, migratedCount: 0 };
  }

  try {
    // 1. Fetch current DB progress
    const currentDb = await loadUserProgressFromDatabase(userId);

    // Merge logic: Take highest XP, union completed lessons and rules, merge quiz scores
    const mergedXp = Math.max(currentDb?.totalXp || 0, localProgress.xp || 0);
    const mergedLessons = Array.from(new Set([...(currentDb?.completedLessons || []), ...localProgress.completedLessons]));
    
    // Normalize quiz scores to Record<string, number>
    const normalizedScores: Record<string, number> = { ...(currentDb?.quizScores || {}) };
    if (localProgress.quizScores) {
      Object.entries(localProgress.quizScores).forEach(([k, v]) => {
        if (typeof v === 'number') {
          normalizedScores[k] = v;
        } else if (v && typeof v === 'object' && 'percentage' in v) {
          normalizedScores[k] = (v as any).percentage;
        } else if (v && typeof v === 'object' && 'score' in v && 'total' in v && (v as any).total > 0) {
          normalizedScores[k] = Math.round(((v as any).score / (v as any).total) * 100);
        }
      });
    }

    const payload: PersistentProgressPayload = {
      totalXp: mergedXp,
      currentLevel: localProgress.level || currentDb?.currentLevel || 'A1',
      targetLevel: currentDb?.targetLevel || 'B2',
      streakDays: Math.max(currentDb?.streakDays || 1, localProgress.studyStreakDays || 1),
      completedLessons: mergedLessons,
      completedRules: currentDb?.completedRules || [],
      quizScores: normalizedScores,
      dailyGoalCompleted: localProgress.dailyGoals?.every(g => g.completed) || false,
    };

    const saved = await saveUserProgressToDatabase(userId, payload);
    return { success: saved, migratedCount: mergedLessons.length };
  } catch (err) {
    console.warn('[ProgressSync] Local migration failed:', err);
    return { success: false, migratedCount: 0 };
  }
}
