import { useState, useEffect } from 'react';
import { UserProgressState, AchievementBadge } from '../types';

const STORAGE_KEY = 'hinawi_english_progress_v1';

const DEFAULT_PROGRESS: UserProgressState = {
  completedLessons: [],
  quizScores: {},
  knownFlashcards: [],
  reviewFlashcards: [],
  studyStreakDays: 1,
  lastStudyDate: new Date().toISOString().split('T')[0],
  dailyChallengeCompleted: false,
  totalTimeMinutes: 15,
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgressState>(() => {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }, [progress]);

  const markLessonComplete = (lessonId: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
  };

  const recordQuizScore = (quizId: string, score: number, total: number) => {
    setProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [quizId]: {
          score,
          total,
          date: new Date().toISOString(),
        },
      },
    }));
  };

  const setFlashcardStatus = (cardId: string, status: 'known' | 'review') => {
    setProgress(prev => {
      const known = prev.knownFlashcards.filter(id => id !== cardId);
      const review = prev.reviewFlashcards.filter(id => id !== cardId);

      if (status === 'known') {
        known.push(cardId);
      } else {
        review.push(cardId);
      }

      return {
        ...prev,
        knownFlashcards: known,
        reviewFlashcards: review,
      };
    });
  };

  const completeDailyChallenge = () => {
    setProgress(prev => ({
      ...prev,
      dailyChallengeCompleted: true,
    }));
  };

  const resetAllProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const totalLessons = 8;
  const completionPercentage = Math.min(100, Math.round((progress.completedLessons.length / totalLessons) * 100));

  const badges: AchievementBadge[] = [
    {
      id: 'first_step',
      title: 'الخطوة الأولى',
      description: 'أكملت أول درس في المستقبل التام',
      icon: '🌱',
      unlocked: progress.completedLessons.length >= 1,
    },
    {
      id: 'quiz_master',
      title: 'صياد الدرجات',
      description: 'أكملت اختباراً بدرجة كاملة',
      icon: '🎯',
      unlocked: Object.values(progress.quizScores).some(q => q.score === q.total && q.total > 0),
    },
    {
      id: 'streak_warrior',
      title: 'استمرارية مذهلة',
      description: 'حافظت على التعلم لعدة أيام',
      icon: '🔥',
      unlocked: progress.studyStreakDays >= 1,
    },
    {
      id: 'flashcard_champ',
      title: 'خبير الكلمات والأفعال',
      description: 'حفظت 5 بطاقات فلاش كارد على الأقل',
      icon: '⚡',
      unlocked: progress.knownFlashcards.length >= 5,
    },
    {
      id: 'future_perfect_master',
      title: 'فارس المستقبل التام',
      description: 'أكملت جميع دروس كورس Future Perfect',
      icon: '👑',
      unlocked: progress.completedLessons.length >= totalLessons,
    },
  ];

  return {
    progress,
    markLessonComplete,
    recordQuizScore,
    setFlashcardStatus,
    completeDailyChallenge,
    resetAllProgress,
    completionPercentage,
    badges,
  };
}
