import { useBadges } from './useBadges';
import { addStudyDay } from "./studyStreak";
import { useState, useEffect, useRef } from "react";
import { getHenglishApiToken, apiGetProgress, apiPutProgress } from "../services/henglishApi";
import {
  UserProgressState,
  UserProfile,
  DailyGoal,
  AppNotification,
  PersonalNote,
  BookmarkItem,
  CEFRLevel,
} from "../types";
import { 
  loadUserProgressFromDatabase, 
  saveUserProgressToDatabase, 
  migrateLocalProgressToSupabase,
  PersistentProgressPayload 
} from "../services/progressSyncService";

const STORAGE_KEY = "hinawi_english_progress_v2";
const USER_PROFILE_KEY = "hinawi_english_user_v2";
const NOTIFICATIONS_KEY = "hinawi_english_notifications_v2";

export const DEFAULT_STUDENT_PROFILE: UserProfile = {
  id: "student-1",
  name: "Ahmed Elhinawi",
  nameAr: "محمد الهناوي",
  email: "ahmed@hinawi-english.com",
  avatar: "/images/avatars/default-user.png",
  role: "student",
  currentLevel: "B1",
  targetLevel: "C1",
  xp: 1450,
  streakDays: 4,
  joinedDate: "2026-01-15",
  bio: "متعلم شغوف يسعى لإتقان قواعد اللغة الإنجليزية والمحادثة المهنية.",
};

export const DEFAULT_TEACHER_PROFILE: UserProfile = {
  id: "teacher-1",
  name: "Prof. Hinawi",
  nameAr: "أ. د. هناوي",
  email: "instructor@hinawi-english.com",
  avatar: "/images/avatars/default-user.png",
  role: "teacher",
  currentLevel: "C2",
  targetLevel: "C2",
  xp: 12800,
  streakDays: 45,
  joinedDate: "2025-09-01",
  bio: "المشرف الأكاديمي لمنصة هناوي ومؤلف مناهج القواعد والمحادثة.",
};

const DEFAULT_GOALS: DailyGoal[] = [
  {
    id: "goal-1",
    title: "Complete 1 Grammar Lesson",
    titleAr: "إكمال درس قواعد تفاعلي",
    target: 1,
    current: 1,
    unit: "درس",
    completed: true,
    type: "lesson",
  },
  {
    id: "goal-2",
    title: "Review 10 Flashcards",
    titleAr: "مراجعة 10 بطاقات كلمات V3",
    target: 10,
    current: 7,
    unit: "بطاقة",
    completed: false,
    type: "flashcard",
  },
  {
    id: "goal-3",
    title: "Practice Speaking Dialogue",
    titleAr: "ممارسة محادثة واقعية صوتية",
    target: 1,
    current: 0,
    unit: "سيناريو",
    completed: false,
    type: "speaking",
  },
  {
    id: "goal-4",
    title: "Score 80%+ on Daily Challenge",
    titleAr: "حل التحدي اليومي بدرجة 80%+",
    target: 1,
    current: 1,
    unit: "كويز",
    completed: true,
    type: "quiz",
  },
];

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "🔥 استمرارية رائعة! 4 أيام متتالية",
    message:
      "أحسنت يا بطل! حافظ على وتيرة تعلمك اليومية لتصل إلى شارة المحارب الذهبي.",
    timestamp: "منذ ساعتين",
    read: false,
    type: "achievement",
    actionRoute: "dashboard",
  },
  {
    id: "notif-2",
    title: "📚 درس مقترح لمستواك B1",
    message:
      "تم إضافة موديول جديد في أكاديمية المحادثة: مقابلات العمل الاحترافية.",
    timestamp: "منذ يوم",
    read: false,
    type: "assignment",
    actionRoute: "speaking",
  },
  {
    id: "notif-3",
    title: "👑 المستقبل التام بانتظارك",
    message:
      "أكملت 80% من أسئلة المستقبل التام، اختبر نفسك في الاختبار الشامل الآن.",
    timestamp: "منذ يومين",
    read: true,
    type: "reminder",
    actionRoute: "courses/grammar/future-perfect",
  },
];

// New students start from a genuinely empty record: certificates and progress
// must reflect real work, so nothing is pre-seeded here.
const DEFAULT_PROGRESS: UserProgressState = {
  completedLessons: [],
  quizScores: {},
  knownFlashcards: [],
  reviewFlashcards: [],
  studyStreakDays: 0,
  lastStudyDate: "",
  dailyChallengeCompleted: false,
  totalTimeMinutes: 0,
  dailyGoals: DEFAULT_GOALS,
  notes: [],
  bookmarks: [],
  xp: 0,
  level: "A1",
};

export function useProgress(activeUserId?: string) {
  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window === "undefined") return DEFAULT_STUDENT_PROFILE;
    try {
      const saved = localStorage.getItem(USER_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_STUDENT_PROFILE;
  });

  // Progress state
  const [progress, setProgress] = useState<UserProgressState>(() => {
    if (typeof window === "undefined") return DEFAULT_PROGRESS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_PROGRESS;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return DEFAULT_NOTIFICATIONS;
  });

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
    } catch {
      // Ignore
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch {
      // Ignore
    }
  }, [notifications]);

  // Henglish Accounts API sync: pull the account's saved progress on login,
  // then push local changes (debounced). Hydration guard prevents the first
  // render's local state from overwriting the remote blob before the pull lands.
  const apiHydratedRef = useRef<string | null>(null);
  useEffect(() => {
    const token = getHenglishApiToken();
    if (!token || !activeUserId || activeUserId.startsWith('guest-') || activeUserId.startsWith('demo-')) {
      return;
    }
    let cancelled = false;
    (async () => {
      const remote = await apiGetProgress(token);
      if (cancelled) return;
      if (remote && remote.progress && typeof remote.progress === 'object') {
        // Merge remote with local instead of remote-wins: guest progress made
        // before login/Google sign-in (which never migrated the local blob at
        // auth time) must survive the first sync. Union lists, keep the best
        // numbers, then push the merged blob back so both sides converge.
        const r = remote.progress as Partial<UserProgressState>;
        setProgress(prev => {
          const union = (a?: string[], b?: string[]) =>
            Array.from(new Set([...(a ?? []), ...(b ?? [])]));
          const unionById = <T extends { id: string }>(a?: T[], b?: T[]): T[] => {
            const seen = new Set<string>();
            const out: T[] = [];
            for (const item of [...(a ?? []), ...(b ?? [])]) {
              if (item && typeof item.id === 'string' && !seen.has(item.id)) {
                seen.add(item.id);
                out.push(item);
              }
            }
            return out;
          };
          const mergedQuiz: UserProgressState['quizScores'] = { ...(prev.quizScores ?? {}) };
          for (const [k, v] of Object.entries(r.quizScores ?? {})) {
            const pct = (q: unknown): number => {
              if (typeof q === 'number') return q;
              if (q && typeof q === 'object' && 'score' in q && 'total' in q && (q as { total: number }).total > 0) {
                const o = q as { score: number; total: number };
                return (o.score / o.total) * 100;
              }
              return -1;
            };
            if (pct(v) >= pct(mergedQuiz[k])) (mergedQuiz as Record<string, unknown>)[k] = v;
          }
          const merged: UserProgressState = {
            ...prev,
            ...r,
            completedLessons: union(prev.completedLessons, r.completedLessons),
            knownFlashcards: union(prev.knownFlashcards, r.knownFlashcards),
            reviewFlashcards: union(prev.reviewFlashcards, r.reviewFlashcards),
            bookmarks: unionById(prev.bookmarks, r.bookmarks),
            notes: unionById(prev.notes, r.notes),
            quizScores: mergedQuiz,
            xp: Math.max(prev.xp ?? 0, r.xp ?? 0),
            studyStreakDays: Math.max(prev.studyStreakDays ?? 0, r.studyStreakDays ?? 0),
            totalTimeMinutes: Math.max(prev.totalTimeMinutes ?? 0, r.totalTimeMinutes ?? 0),
            dailyChallengeCompleted: Boolean(prev.dailyChallengeCompleted || r.dailyChallengeCompleted),
          };
          if (!cancelled) {
            apiPutProgress(token, merged).catch(() => { /* retried by the debounced sync */ });
          }
          return merged;
        });
      } else {
        // No remote blob yet (account created before sync existed): upload local.
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          try { await apiPutProgress(token, JSON.parse(raw)); } catch { /* ignore */ }
        }
      }
      apiHydratedRef.current = activeUserId;
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeUserId]);

  useEffect(() => {
    const token = getHenglishApiToken();
    if (!token || !activeUserId || activeUserId.startsWith('guest-') || activeUserId.startsWith('demo-')) {
      return;
    }
    if (apiHydratedRef.current !== activeUserId) return;
    const t = setTimeout(() => {
      apiPutProgress(token, progress);
    }, 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, activeUserId]);

  // Database Synchronization on authenticated login
  useEffect(() => {
    if (!activeUserId || activeUserId.startsWith('guest-') || activeUserId.startsWith('demo-')) {
      return;
    }

    let isMounted = true;
    async function syncDb() {
      if (!activeUserId) return;
      const dbData = await loadUserProgressFromDatabase(activeUserId);
      if (dbData && isMounted) {
        setProgress(prev => ({
          ...prev,
          xp: Math.max(prev.xp || 0, dbData.totalXp || 0),
          level: (dbData.currentLevel as CEFRLevel) || prev.level,
          studyStreakDays: Math.max(prev.studyStreakDays || 0, dbData.streakDays || 0),
          completedLessons: Array.from(new Set([...prev.completedLessons, ...dbData.completedLessons])),
          quizScores: { ...prev.quizScores, ...(dbData.quizScores as any) },
        }));
      } else {
        // First login: migrate local progress to database
        migrateLocalProgressToSupabase(activeUserId, progress);
      }
    }

    syncDb();
    return () => { isMounted = false; };
  }, [activeUserId]);

  // Sync back to database when progress updates for authenticated user
  useEffect(() => {
    if (!activeUserId || activeUserId.startsWith('guest-') || activeUserId.startsWith('demo-')) {
      return;
    }

    const quizMap: Record<string, number> = {};
    if (progress.quizScores) {
      Object.entries(progress.quizScores).forEach(([k, v]) => {
        if (typeof v === 'number') {
          quizMap[k] = v;
        } else if (v && typeof v === 'object' && 'score' in v && 'total' in v && (v as any).total > 0) {
          quizMap[k] = Math.round(((v as any).score / (v as any).total) * 100);
        }
      });
    }

    const payload: PersistentProgressPayload = {
      totalXp: progress.xp || 0,
      currentLevel: progress.level || 'A1',
      targetLevel: 'B2',
      streakDays: progress.studyStreakDays || 0,
      completedLessons: progress.completedLessons || [],
      completedRules: [],
      quizScores: quizMap,
      dailyGoalCompleted: progress.dailyGoals ? progress.dailyGoals.every(g => g.completed) : false,
    };

    saveUserProgressToDatabase(activeUserId, payload);
  }, [progress, activeUserId]);

  // Switch role between student and teacher/admin
  const toggleUserRole = () => {
    setUserProfile((prev) => {
      if (prev.role === "student") {
        return DEFAULT_TEACHER_PROFILE;
      } else {
        return DEFAULT_STUDENT_PROFILE;
      }
    });
  };

  const setRole = (role: "student" | "teacher" | "admin") => {
    if (role === "teacher" || role === "admin") {
      setUserProfile({ ...DEFAULT_TEACHER_PROFILE, role });
    } else {
      setUserProfile(DEFAULT_STUDENT_PROFILE);
    }
  };

  const markLessonComplete = (lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const nextLessons = [...prev.completedLessons, lessonId];
      const nextXp = (prev.xp ?? 0) + 100;
      return {
        ...prev,
        completedLessons: nextLessons,
        ...addStudyDay({studyStreakDays: prev.studyStreakDays, lastStudyDate: prev.lastStudyDate}),
        xp: nextXp,
      };
    });
    setUserProfile((prev) => ({
      ...prev,
      xp: prev.xp + 100,
    }));
  };

  const recordQuizScore = (quizId: string, score: number, total: number) => {
    const earnedXp = Math.round((score / Math.max(1, total)) * 50);
    setProgress((prev) => ({
      ...prev,
      ...addStudyDay({studyStreakDays: prev.studyStreakDays, lastStudyDate: prev.lastStudyDate}),
      quizScores: {
        ...prev.quizScores,
        [quizId]: {
          score,
          total,
          date: new Date().toISOString(),
        },
      },
      xp: (prev.xp || 0) + earnedXp,
    }));
    setUserProfile((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
    }));
  };

  const setFlashcardStatus = (cardId: string, status: "known" | "review") => {
    setProgress((prev) => {
      const known = prev.knownFlashcards.filter((id) => id !== cardId);
      const review = prev.reviewFlashcards.filter((id) => id !== cardId);

      if (status === "known") {
        known.push(cardId);
      } else {
        review.push(cardId);
      }

      return {
        ...prev,
        ...addStudyDay({studyStreakDays: prev.studyStreakDays, lastStudyDate: prev.lastStudyDate}),
        knownFlashcards: known,
        reviewFlashcards: review,
      };
    });
  };

  const completeDailyChallenge = () => {
    setProgress((prev) => ({
      ...prev,
      ...addStudyDay({studyStreakDays: prev.studyStreakDays, lastStudyDate: prev.lastStudyDate}),
      dailyChallengeCompleted: true,
      xp: (prev.xp ?? 0) + 50,
    }));
    setUserProfile((prev) => ({
      ...prev,
      xp: prev.xp + 50,
    }));
  };

  const toggleDailyGoal = (goalId: string) => {
    setProgress((prev) => {
      const goals = (prev.dailyGoals || DEFAULT_GOALS).map((g) => {
        if (g.id === goalId) {
          const nextCompleted = !g.completed;
          return {
            ...g,
            completed: nextCompleted,
            current: nextCompleted ? g.target : Math.max(0, g.current - 1),
          };
        }
        return g;
      });
      return { ...prev, dailyGoals: goals };
    });
  };

  const savePersonalNote = (
    lessonId: string,
    lessonTitle: string,
    content: string,
  ) => {
    setProgress((prev) => {
      const existing = prev.notes || [];
      const filtered = existing.filter((n) => n.lessonId !== lessonId);
      const newNote: PersonalNote = {
        id: `note-${Date.now()}`,
        lessonId,
        lessonTitle,
        content,
        updatedAt: new Date().toISOString().split("T")[0],
      };
      return {
        ...prev,
        notes: [newNote, ...filtered],
      };
    });
  };

  const deletePersonalNote = (noteId: string) => {
    setProgress((prev) => ({
      ...prev,
      notes: (prev.notes || []).filter((n) => n.id !== noteId),
    }));
  };

  const toggleBookmark = (item: Omit<BookmarkItem, "id" | "savedAt">) => {
    setProgress((prev) => {
      const bookmarks = prev.bookmarks || [];
      const existingIndex = bookmarks.findIndex(
        (b) => b.route === item.route && b.lessonId === item.lessonId,
      );

      if (existingIndex >= 0) {
        return {
          ...prev,
          bookmarks: bookmarks.filter((_, i) => i !== existingIndex),
        };
      } else {
        const newBm: BookmarkItem = {
          ...item,
          id: `bm-${Date.now()}`,
          savedAt: new Date().toISOString().split("T")[0],
        };
        return {
          ...prev,
          bookmarks: [newBm, ...bookmarks],
        };
      }
    });
  };

  const isBookmarked = (route: string, lessonId?: string) => {
    const bookmarks = progress.bookmarks || [];
    return bookmarks.some((b) => b.route === route && b.lessonId === lessonId);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)),
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetAllProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    setUserProfile(DEFAULT_STUDENT_PROFILE);
    setNotifications(DEFAULT_NOTIFICATIONS);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USER_PROFILE_KEY);
      localStorage.removeItem(NOTIFICATIONS_KEY);
    } catch {
      // Ignore
    }
  };

  const totalLessons = 8;
  const completionPercentage = Math.min(
    100,
    Math.round((progress.completedLessons.length / totalLessons) * 100),
  );

  const { badges } = useBadges(activeUserId);

  return {
    progress,
    userProfile,
    notifications,
    unreadNotificationsCount: notifications.filter((n) => !n.read).length,
    markLessonComplete,
    recordQuizScore,
    setFlashcardStatus,
    completeDailyChallenge,
    toggleDailyGoal,
    savePersonalNote,
    deletePersonalNote,
    toggleBookmark,
    isBookmarked,
    markNotificationRead,
    markAllNotificationsRead,
    toggleUserRole,
    setRole,
    resetAllProgress,
    completionPercentage,
    badges,
  };
}
