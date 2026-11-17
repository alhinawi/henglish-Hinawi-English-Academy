import { progressStorageKey, readAccountProgress } from '../services/accountProgressStorage';
import { useBadges } from './useBadges';
import { addStudyDay } from "./studyStreak";
import { useState, useEffect, useRef } from "react";
import { getHenglishApiToken, apiGetProgress, apiPutProgress } from "../services/henglishApi";
import {
  UserProgressState,
  UserProfile,
  DailyGoal,
  DailyActivity,
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

const USER_PROFILE_KEY = "hinawi_english_user_v2";
const NOTIFICATIONS_KEY = "hinawi_english_notifications_v2";

// Neutral local fallbacks, never a fabricated learner/instructor identity.
// Existing saved profiles and authenticated accounts are loaded unchanged.
export const DEFAULT_STUDENT_PROFILE: UserProfile = {
  id: "student-1",
  name: "Learner",
  nameAr: "",
  email: "",
  avatar: "",
  role: "student",
  currentLevel: "A1",
  targetLevel: "A1",
  xp: 0,
  streakDays: 0,
  joinedDate: "",
  bio: "",
};

export const DEFAULT_TEACHER_PROFILE: UserProfile = {
  ...DEFAULT_STUDENT_PROFILE,
  id: "teacher-1",
  name: "Teacher",
  role: "teacher",
};

// Daily goal definitions (targets + copy only). Progress is never pre-seeded:
// `current`/`completed` are derived from the real per-day activity record.
export const DAILY_GOAL_DEFS: Omit<DailyGoal, "current" | "completed">[] = [
  {
    id: "goal-1",
    title: "Complete 1 Grammar Lesson",
    titleAr: "pg.lessonTitle",
    target: 1,
    unit: "pg.lessonUnit",
    type: "lesson",
  },
  {
    id: "goal-2",
    title: "Review 10 Flashcards",
    titleAr: "pg.flashcardTitle",
    target: 10,
    unit: "pg.flashcardUnit",
    type: "flashcard",
  },
  {
    id: "goal-3",
    title: "Practice Speaking Dialogue",
    titleAr: "pg.speakingTitle",
    target: 1,
    unit: "pg.speakingUnit",
    type: "speaking",
  },
  {
    id: "goal-4",
    title: "Score 80%+ on a Quiz",
    titleAr: "pg.quizTitle",
    target: 1,
    unit: "pg.quizUnit",
    type: "quiz",
  },
];

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const emptyActivity = (date: string): DailyActivity => ({
  date,
  lessons: 0,
  flashcards: 0,
  speaking: 0,
  quizzes: 0,
  quiz80: false,
});

// Today's activity record from a progress blob. Legacy blobs may carry the old
// fake DailyGoal[] array under the same key — treat those as no activity.
export function dailyActivityOf(progress: UserProgressState): DailyActivity {
  const raw = progress.dailyGoals;
  const today = todayKey();
  if (raw && !Array.isArray(raw) && raw.date === today) return raw;
  return emptyActivity(today);
}

// Applies a per-day activity bump inside a setProgress updater.
function withActivity(
  prev: UserProgressState,
  patch: (a: DailyActivity) => Partial<DailyActivity>,
): UserProgressState {
  const cur = dailyActivityOf(prev);
  return { ...prev, dailyGoals: { ...cur, ...patch(cur) } };
}

// The Daily Goals card: definitions + real counts from today's activity.
export function deriveDailyGoals(progress: UserProgressState, translate?: (key: string) => string): DailyGoal[] {
  const a = dailyActivityOf(progress);
  return DAILY_GOAL_DEFS.map((def) => {
    const current =
      def.type === "lesson"
        ? a.lessons
        : def.type === "flashcard"
          ? a.flashcards
          : def.type === "speaking"
            ? a.speaking
            : def.id === "goal-4"
              ? a.quiz80
                ? 1
                : 0
              : a.quizzes;
    return { ...def, titleAr: translate ? translate(def.titleAr) : def.titleAr, unit: translate ? translate(def.unit) : def.unit, current, completed: current >= def.target };
  });
}

// Notifications are generated from real app events only — never pre-seeded.
const DEFAULT_NOTIFICATIONS: AppNotification[] = [];

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

  // Tag in-memory progress with its storage owner. Switching identity resets
  // during render, before effects or consumers can see/write the old account.
  const storageKey = progressStorageKey(activeUserId);
  const [ownedProgress, setOwnedProgress] = useState(() => ({
    key: storageKey, value: readAccountProgress(storageKey, DEFAULT_PROGRESS),
  }));
  if (ownedProgress.key !== storageKey) {
    setOwnedProgress({ key: storageKey, value: readAccountProgress(storageKey, DEFAULT_PROGRESS) });
  }
  const progress = ownedProgress.value;
  const setProgress = (update: UserProgressState | ((previous: UserProgressState) => UserProgressState)) => {
    setOwnedProgress(previous => previous.key !== storageKey ? previous : ({
      key: storageKey,
      value: typeof update === 'function' ? update(previous.value) : update,
    }));
  };

  const latestProgressRef = useRef({ key: storageKey, value: progress });
  useEffect(() => { latestProgressRef.current = { key: storageKey, value: progress }; }, [progress, storageKey]);

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
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }, [progress, storageKey]);

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
    apiHydratedRef.current = null;
    const token = getHenglishApiToken();
    if (!token || !activeUserId || activeUserId.startsWith('guest-') || activeUserId.startsWith('demo-')) {
      return;
    }
    let cancelled = false;
    (async () => {
      const remote = await apiGetProgress(token);
      if (cancelled) return;
      if (remote && remote.progress && typeof remote.progress === 'object') {
        // Merge only this account's local record with its remote record.
        // Guest/legacy and other accounts are separate storage owners.
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
        try { await apiPutProgress(token, latestProgressRef.current.value); } catch { /* ignore */ }
      }
      if (!cancelled) apiHydratedRef.current = activeUserId;
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

  const dbHydratedRef = useRef<string | null>(null);
  // Database Synchronization on authenticated login
  useEffect(() => {
    if (!activeUserId || activeUserId.startsWith('guest-') || activeUserId.startsWith('demo-')) {
      return;
    }

    dbHydratedRef.current = null;
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
      } else if (isMounted) {
        // Only this account's local progress may seed its remote record.
        await migrateLocalProgressToSupabase(activeUserId, latestProgressRef.current.value);
      }
      if (isMounted) dbHydratedRef.current = activeUserId;
    }

    syncDb();
    return () => { isMounted = false; };
  }, [activeUserId]);

  // Sync back to database when progress updates for authenticated user
  useEffect(() => {
    if (!activeUserId || activeUserId.startsWith('guest-') || activeUserId.startsWith('demo-')) {
      return;
    }

    if (dbHydratedRef.current !== activeUserId) return;
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
      dailyGoalCompleted: deriveDailyGoals(progress).every((g) => g.completed),
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
    if (progress.completedLessons.includes(lessonId)) return;
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const nextLessons = [...prev.completedLessons, lessonId];
      const nextXp = (prev.xp ?? 0) + 100;
      return withActivity(
        {
          ...prev,
          completedLessons: nextLessons,
          ...addStudyDay({studyStreakDays: prev.studyStreakDays, lastStudyDate: prev.lastStudyDate}),
          xp: nextXp,
        },
        (a) => ({ lessons: a.lessons + 1 }),
      );
    });
    setUserProfile((prev) => ({
      ...prev,
      xp: prev.xp + 100,
    }));
  };

  const recordQuizScore = (quizId: string, score: number, total: number) => {
    const earnedXp = Math.round((score / Math.max(1, total)) * 50);
    const passed80 = total > 0 && score / total >= 0.8;
    setProgress((prev) =>
      withActivity(
        {
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
        },
        (a) => ({ quizzes: a.quizzes + 1, quiz80: a.quiz80 || passed80 }),
      ),
    );
    setUserProfile((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
    }));
  };

  const setFlashcardStatus = (cardId: string, status: "known" | "review") => {
    setProgress((prev) => {
      const alreadySame =
        status === "known"
          ? prev.knownFlashcards.includes(cardId)
          : prev.reviewFlashcards.includes(cardId);
      const known = prev.knownFlashcards.filter((id) => id !== cardId);
      const review = prev.reviewFlashcards.filter((id) => id !== cardId);

      if (status === "known") {
        known.push(cardId);
      } else {
        review.push(cardId);
      }

      const next = {
        ...prev,
        ...addStudyDay({studyStreakDays: prev.studyStreakDays, lastStudyDate: prev.lastStudyDate}),
        knownFlashcards: known,
        reviewFlashcards: review,
      };
      // One flashcard review counts once per card per status change.
      return alreadySame ? next : withActivity(next, (a) => ({ flashcards: a.flashcards + 1 }));
    });
  };

  // A completed speaking-academy activity (wired from App where the speaking
  // pages report completion).
  const recordSpeakingPractice = () => {
    setProgress((prev) =>
      withActivity(
        {
          ...prev,
          ...addStudyDay({studyStreakDays: prev.studyStreakDays, lastStudyDate: prev.lastStudyDate}),
        },
        (a) => ({ speaking: a.speaking + 1 }),
      ),
    );
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

  // All-goals bonus: pay the promised 150 XP once per day when every daily
  // goal is genuinely complete. awardRef guards StrictMode double effects;
  // the persisted xpAwarded flag guards reloads.
  const dailyBonusRef = useRef<string | null>(null);
  useEffect(() => {
    const a = dailyActivityOf(progress);
    const allDone = a.lessons >= 1 && a.flashcards >= 10 && a.speaking >= 1 && a.quiz80;
    const bonusKey = `${storageKey}:${a.date}`;
    if (!allDone || a.xpAwarded || dailyBonusRef.current === bonusKey) return;
    dailyBonusRef.current = bonusKey;
    setProgress((prev) => {
      const cur = dailyActivityOf(prev);
      if (cur.date !== a.date || cur.xpAwarded) return prev;
      return { ...prev, dailyGoals: { ...cur, xpAwarded: true }, xp: (prev.xp ?? 0) + 150 };
    });
    setUserProfile((prev) => ({ ...prev, xp: prev.xp + 150 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.dailyGoals, storageKey]);

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
      localStorage.removeItem(storageKey);
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
    recordSpeakingPractice,
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
