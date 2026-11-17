import { isSourceRoute } from './services/sourceNavigation';
import { BadgesPage } from './components/BadgeCollection';
import { useArcadeProgress } from './services/arcadeProgressService';
import { combinedStudyStreak } from './utils/studyStreak';
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { PageRoute } from './types';
import { AdminServerGate } from './components/admin/AdminServerGate';
import { MainLayout } from './components/layout/MainLayout';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { AuthModal } from './components/AuthModal';
import { useProgress } from './utils/useProgress';
import { useAuth } from './context/AuthContext';
import { completeGoogleSignIn, getSavedAuthSession, saveAuthSession } from './services/authService';
import { SettingsModal } from './components/SettingsModal';
import { consumeGoogleAuthCallback, GOOGLE_REAUTH_EVENT } from './services/henglishApi';

// Auth Pages
import { LoginPage } from './views/auth/LoginPage';
import { RegisterPage } from './views/auth/RegisterPage';
import { VerifyEmailPage } from './views/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './views/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './views/auth/ResetPasswordPage';

// Academies & Platform Pages
const LeaderboardPage = lazy(() => import('./views/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })));
const DashboardPage = lazy(() => import('./views/DashboardPage').then(m => ({ default: m.DashboardPage })));
const TeacherDashboardPage = lazy(() => import('./views/TeacherDashboardPage').then(m => ({ default: m.TeacherDashboardPage })));
const GrammarAcademyPage = lazy(() => import('./views/GrammarAcademyPage').then(m => ({ default: m.GrammarAcademyPage })));
const GrammarLessonPage = lazy(() => import('./views/GrammarLessonPage').then(m => ({ default: m.GrammarLessonPage })));
const VocabularyAcademyPage = lazy(() => import('./views/VocabularyAcademyPage').then(m => ({ default: m.VocabularyAcademyPage })));
const PhraseBankPage = lazy(() => import('./views/PhraseBankPage').then(m => ({ default: m.PhraseBankPage })));
const ExamVocabPage = lazy(() => import('./views/ExamVocabPage').then(m => ({ default: m.ExamVocabPage })));
const SpeakingAcademyPage = lazy(() => import('./views/SpeakingAcademyPage').then(m => ({ default: m.SpeakingAcademyPage })));
const ListeningAcademyPage = lazy(() => import('./views/ListeningAcademyPage').then(m => ({ default: m.ListeningAcademyPage })));
const ReadingAcademyPage = lazy(() => import('./views/ReadingAcademyPage').then(m => ({ default: m.ReadingAcademyPage })));
const WritingAcademyPage = lazy(() => import('./views/WritingAcademyPage').then(m => ({ default: m.WritingAcademyPage })));
const PronunciationAcademyPage = lazy(() => import('./views/PronunciationAcademyPage').then(m => ({ default: m.PronunciationAcademyPage })));
const RealLifeEnglishPage = lazy(() => import('./views/RealLifeEnglishPage').then(m => ({ default: m.RealLifeEnglishPage })));
const ExamsAssessmentPage = lazy(() => import('./views/ExamsAssessmentPage').then(m => ({ default: m.ExamsAssessmentPage })));
const MyLearningPage = lazy(() => import('./views/MyLearningPage').then(m => ({ default: m.MyLearningPage })));
const AdminDashboardPage = lazy(() => import('./views/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AiTutorPage = lazy(() => import('./views/AiTutorPage').then(m => ({ default: m.AiTutorPage })));
const CertificatesPage = lazy(() => import('./views/CertificatesPage').then(m => ({ default: m.CertificatesPage })));
const ProfilePage = lazy(() => import('./views/ProfilePage').then(m => ({ default: m.ProfilePage })));
const Interactive3DWorld = lazy(() => import('./components/Interactive3DWorld').then(m => ({ default: m.Interactive3DWorld })));

// Flagship Future Perfect & Existing Core Pages
const CourseOverviewPage = lazy(() => import('./views/CourseOverviewPage').then(m => ({ default: m.CourseOverviewPage })));
const FuturePerfectCoursePage = lazy(() => import('./views/FuturePerfectCoursePage').then(m => ({ default: m.FuturePerfectCoursePage })));
const LessonPage = lazy(() => import('./views/LessonPage').then(m => ({ default: m.LessonPage })));
const CoursesPage = lazy(() => import('./views/CoursesPage').then(m => ({ default: m.CoursesPage })));
const PracticePage = lazy(() => import('./views/PracticePage').then(m => ({ default: m.PracticePage })));
const QuizzesPage = lazy(() => import('./views/QuizzesPage').then(m => ({ default: m.QuizzesPage })));
const GamesPage = lazy(() => import('./views/GamesPage').then(m => ({ default: m.GamesPage })));
const ResourcesPage = lazy(() => import('./views/ResourcesPage').then(m => ({ default: m.ResourcesPage })));
const SourcesPage = lazy(() => import('./views/SourcesPage').then(m => ({ default: m.SourcesPage })));
const AboutPage = lazy(() => import('./views/AboutPage').then(m => ({ default: m.AboutPage })));
const SentencesLibraryPage = lazy(() => import('./views/SentencesLibraryPage').then(m => ({ default: m.SentencesLibraryPage })));
const MovieStudioPage = lazy(() => import('./views/MovieStudioPage').then(m => ({ default: m.MovieStudioPage })));
const TranslationStudioPage = lazy(() => import('./views/TranslationStudioPage').then(m => ({ default: m.TranslationStudioPage })));

import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

// Neutral boot screen shown for a frame while the initial route resolves,
// so signed-in users never see the login page flash on load.
const BootSplash: React.FC = () => (
  <div className="min-h-screen bg-[#0c0b20] flex items-center justify-center">
    <img src="/logo-splash.png" alt="Henglish" className="w-28 h-28 object-contain animate-pulse filter drop-shadow-[0_0_18px_rgba(255,209,102,0.45)]" />
  </div>
);

export const App: React.FC<{ initialRoute?: PageRoute }> = ({ initialRoute }) => {
  const { 
    session, 
    user: authUser, 
    role: authRole, 
    isAuthenticated, 
    isGuest, 
    logout,
    refreshSession,
  } = useAuth();

  const navigationVersion = useRef(0);
  useEffect(() => () => { navigationVersion.current += 1; }, []);
  const [currentRoute, setCurrentRoute] = useState<PageRoute | null>(initialRoute ?? null);
  const [activeLessonId, setActiveLessonId] = useState<string>('lesson-1');
  const [activeGrammarRuleId, setActiveGrammarRuleId] = useState<string>('present-simple');
  const [verifyEmailParam, setVerifyEmailParam] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'migrate'>('login');

  const {
    progress,
    userProfile,
    notifications,
    unreadNotificationsCount,
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
    resetAllProgress,
    completionPercentage,
    badges,
  } = useProgress(authUser?.id);

  // Active profile from auth session or fallback
  const arcadeProgress = useArcadeProgress();
  const [streakClock, setStreakClock] = useState(() => new Date());
  useEffect(() => { const timer = setInterval(() => setStreakClock(new Date()), 60_000); return () => clearInterval(timer); }, []);
  const activeProfile = { ...(authUser || userProfile), streakDays: combinedStudyStreak(progress, arcadeProgress, streakClock) };

  // Consume a Google sign-in redirect (#auth-callback?token=...) once on mount.
  useEffect(() => {
    const result = consumeGoogleAuthCallback();
    if (!result || result.startsWith('error:')) return;
    completeGoogleSignIn(result).then((res) => {
      if (res.success) refreshSession();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Owner account must use Google: when any API call gets 428
  // google_reauth_required (stale password session), sign out locally so the
  // login page (with the Google button) replaces the half-broken session.
  useEffect(() => {
    const onReauthRequired = () => {
      if (session.type === 'authenticated') logout();
    };
    window.addEventListener(GOOGLE_REAUTH_EVENT, onReauthRequired);
    return () => window.removeEventListener(GOOGLE_REAUTH_EVENT, onReauthRequired);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.type]);

  // Sync route with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      // Tolerate both '#movies' and '#/movies' style hashes
      let fullHash = window.location.hash.replace(/^#\/*/, '').trim();

      // Clean-URL bridge (Next.js static routes): /movies/ behaves like #movies
      if (!fullHash) {
        const pathPart = window.location.pathname.replace(/^\/+|\/+$/g, '');
        if (pathPart) fullHash = pathPart;
      }

      const [hash, queryString] = fullHash.split('?');

      // Check query params for verify-email
      if (queryString) {
        const params = new URLSearchParams(queryString);
        const email = params.get('email');
        if (email) setVerifyEmailParam(email);
      }

      // 1. Explicit Auth routes
      if (hash === 'login') {
        setCurrentRoute('login');
        return;
      }
      if (hash === 'register') {
        setCurrentRoute('register');
        return;
      }
      if (hash === 'verify-email') {
        setCurrentRoute('verify-email');
        return;
      }
      if (hash === 'forgot-password') {
        setCurrentRoute('forgot-password');
        return;
      }
      if (hash === 'reset-password') {
        setCurrentRoute('reset-password');
        return;
      }

      // 2. Unauthenticated root route handler:
      // If user is neither authenticated nor an active guest: default to 'login'
      const hasActiveSession = session.isLoggedIn || session.type === 'guest';
      if (!hasActiveSession && (!hash || hash === 'dashboard' || hash === 'home')) {
        setCurrentRoute('login');
        return;
      }

      // 3. Platform Routes
      if (!hash || hash === 'dashboard' || hash === 'home') {
        setCurrentRoute('dashboard');
      } else if (hash === 'teacher-dashboard') {
        setCurrentRoute('teacher-dashboard');
      } else if (hash.startsWith('grammar/')) {
        setCurrentRoute('grammar-lesson');
        setActiveGrammarRuleId(hash.replace('grammar/', ''));
      } else if (hash.startsWith('lesson-')) {
        setCurrentRoute('courses/grammar/future-perfect');
        requestAnimationFrame(() =>
          setTimeout(() => document.getElementById(`fp-${hash}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250)
        );
      } else if (hash === 'courses') {
        setCurrentRoute('courses');
      } else if (hash === 'grammar' || hash === 'courses/grammar') {
        setCurrentRoute('grammar');
      } else if (hash === 'future-perfect' || hash === 'courses/grammar/future-perfect') {
        setCurrentRoute('courses/grammar/future-perfect');
      } else if (hash === 'vocabulary') {
        setCurrentRoute('vocabulary');
      } else if (hash === 'idioms' || hash.startsWith('idioms/')) {
        setCurrentRoute('idioms');
      } else if (hash === 'slang' || hash.startsWith('slang/')) {
        setCurrentRoute('slang');
      } else if (hash === 'genz' || hash === 'gen-z' || hash.startsWith('genz/')) {
        setCurrentRoute('genz');
      } else if (hash === 'ielts' || hash.startsWith('ielts/')) {
        setCurrentRoute('ielts');
      } else if (hash === 'toefl' || hash.startsWith('toefl/')) {
        setCurrentRoute('toefl');
      } else if (hash === 'speaking') {
        setCurrentRoute('speaking');
      } else if (hash === 'listening') {
        setCurrentRoute('listening');
      } else if (hash === 'reading') {
        setCurrentRoute('reading');
      } else if (hash === 'writing') {
        setCurrentRoute('writing');
      } else if (hash === 'pronunciation') {
        setCurrentRoute('pronunciation');
      } else if (hash === 'real-life') {
        setCurrentRoute('real-life');
      } else if (hash === 'ai-tutor' || hash === 'tutor') {
        setCurrentRoute('ai-tutor');
      } else if (hash === 'world-3d' || hash === '3d-world') {
        setCurrentRoute('world-3d');
      } else if (hash === 'badges') {
        setCurrentRoute('badges');
      } else if (hash === 'certificates') {
        setCurrentRoute('certificates');
      } else if (hash === 'profile' || hash === 'account') {
        setCurrentRoute('profile');
      } else if (hash === 'exams' || hash === 'assessment') {
        setCurrentRoute('exams');
      } else if (hash === 'practice' || hash === 'homework') {
        setCurrentRoute('practice');
      } else if (hash === 'my-learning' || hash === 'progress') {
        setCurrentRoute('my-learning');
      } else if (hash === 'leaderboard') {
        setCurrentRoute('leaderboard');
      } else if (hash === 'admin') {
        setCurrentRoute('admin');
      } else if (hash === 'quizzes') {
        setCurrentRoute('quizzes');
      } else if (hash === 'games') {
        setCurrentRoute('games');
      } else if (hash === 'resources') {
        setCurrentRoute('resources');
      } else if (isSourceRoute(hash)) {
        setCurrentRoute('sources');
      } else if (hash === 'about') {
        setCurrentRoute('about');
      } else if (hash === 'sentences' || hash === 'library' || hash === 'sentences-library') {
        setCurrentRoute('sentences');
      } else if (hash === 'movies' || hash === 'movie-studio' || hash === 'learn-from-movies') {
        setCurrentRoute('movies');
      } else if (hash === 'translation' || hash === 'translate' || hash === 'translator') {
        setCurrentRoute('translation');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    handleHashChange(); // Run once on mount

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [session]);

  const handleNavigate = (route: PageRoute | string, targetId?: string) => {
    const version = ++navigationVersion.current;
    const castRoute = route as PageRoute;
    setCurrentRoute(castRoute);

    if (castRoute === 'grammar-lesson' && targetId) {
      setActiveGrammarRuleId(targetId);
      window.location.hash = `grammar/${targetId}`;
    } else if (castRoute === 'vocabulary' && targetId) {
      window.location.hash = `vocabulary?entry=${encodeURIComponent(targetId)}`;
    } else if (castRoute === 'lesson' && targetId && targetId.startsWith('lesson-')) {
      // Future Perfect is a single scrolling page now: land on it and scroll
      // to the module anchor instead of opening a separate lesson route.
      setCurrentRoute('courses/grammar/future-perfect');
      window.location.hash = 'future-perfect';
      requestAnimationFrame(() =>
        setTimeout(() => document.getElementById(`fp-${targetId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
      );
      return;
    } else if (castRoute === 'lesson' && targetId) {
      setActiveLessonId(targetId);
      window.location.hash = targetId;
    } else {
      if (castRoute === 'dashboard' || castRoute === 'home') {
        window.location.hash = 'dashboard';
      } else if (castRoute === 'courses/grammar/future-perfect') {
        window.location.hash = 'future-perfect';
      } else {
        window.location.hash = castRoute;
      }
    }
    if (castRoute === 'grammar' || castRoute === 'courses/grammar') {
      let savedScrollY: string | null = null;
      try { savedScrollY = sessionStorage.getItem('henglish:grammarScrollY'); } catch {
        // Optional scroll storage must not interrupt navigation.
      }
      const y = savedScrollY?.trim() ? Number(savedScrollY) : NaN;
      if (Number.isFinite(y) && y >= 0) {
        const expectedHash = window.location.hash;
        const restore = () => {
          if (navigationVersion.current !== version || window.location.hash !== expectedHash) return;
          window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior });
        };
        requestAnimationFrame(restore);
        setTimeout(restore, 250);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openAuthWithTab = (tab: 'login' | 'register' | 'migrate' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  // -------------------------------------------------------------
  // RENDER DEDICATED AUTH PAGES
  // -------------------------------------------------------------
  // Boot splash: the initial route resolves in the mount effect (hash + saved
  // session). Render a neutral splash instead of flashing the login page.
  if (currentRoute === null) {
    return <BootSplash />;
  }
  if (currentRoute === 'login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }
  if (currentRoute === 'register') {
    return <RegisterPage onNavigate={handleNavigate} />;
  }
  if (currentRoute === 'verify-email') {
    return <VerifyEmailPage onNavigate={handleNavigate} defaultEmail={verifyEmailParam} />;
  }
  if (currentRoute === 'forgot-password') {
    return <ForgotPasswordPage onNavigate={handleNavigate} />;
  }
  if (currentRoute === 'reset-password') {
    return <ResetPasswordPage onNavigate={handleNavigate} />;
  }

  // -------------------------------------------------------------
  // RBAC GUARD FOR ADMIN CONTROL PANEL
  // -------------------------------------------------------------
  // /admin access is enforced server-side by AdminServerGate (henglish-api checks the account email).

  return (
    <>
      <MainLayout
        currentRoute={currentRoute}
        activeLessonId={activeLessonId}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuthModal={openAuthWithTab}
        userProfile={activeProfile}
        notifications={notifications}
        unreadCount={unreadNotificationsCount}
        onMarkNotificationRead={markNotificationRead}
        onMarkAllNotificationsRead={markAllNotificationsRead}
        onToggleRole={toggleUserRole}
        onResetProgress={resetAllProgress}
        onSignOut={logout}
        authSessionType={session.type}
      >
        <Suspense fallback={<div className="min-h-[40vh]" />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={
              currentRoute === 'lesson'
                ? `lesson-${activeLessonId}`
                : currentRoute === 'grammar-lesson'
                ? `grammar-${activeGrammarRuleId}`
                : currentRoute
            }
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {/* RBAC Block View for non-admins */}
            {false ? (
              <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-slate-900/60 border border-red-500/30 rounded-3xl backdrop-blur-xl" dir="rtl">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">منطقة محمية - الدخول مقيّد</h2>
                <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
                  لوحة التحكم الإدارية مخصصة فقط للمدراء والمشرفين المعتمدين. ليس لديك الصلاحيات الكافية لعرض هذه الصفحة.
                </p>
                <button
                  onClick={() => handleNavigate(authRole === 'teacher' ? 'teacher-dashboard' : 'dashboard')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  العودة إلى لوحة التعلم المعتمدة
                </button>
              </div>
            ) : (
              <>
                {/* 1. Central Dashboard */}
                {(currentRoute === 'dashboard' || currentRoute === 'home') && (
                  <DashboardPage
                    onNavigate={handleNavigate}
                    userProfile={activeProfile}
                    progress={progress}
                    badges={badges}
                  />
                )}

                {/* 1.1 Teacher Dashboard */}
                {currentRoute === 'teacher-dashboard' && (
                  <TeacherDashboardPage onNavigate={handleNavigate} />
                )}

                {/* 2. Grammar Academy Home */}
                {(currentRoute === 'grammar' || currentRoute === 'courses/grammar') && (
                  <GrammarAcademyPage onNavigate={handleNavigate} />
                )}

                {/* 3. Dedicated Full-Length Grammar Lesson Page */}
                {currentRoute === 'grammar-lesson' && (
                  <GrammarLessonPage
                    ruleId={activeGrammarRuleId}
                    onNavigate={handleNavigate}
                    onMarkComplete={(rId) => markLessonComplete(`rule-${rId}`)}
                    isCompleted={progress.completedLessons.includes(`rule-${activeGrammarRuleId}`)}
                  />
                )}

                {/* 4. Flagship Course: Future Perfect */}
                {currentRoute === 'courses/grammar/future-perfect' && (
                  <FuturePerfectCoursePage
                    onNavigate={handleNavigate}
                    onMarkComplete={(lId: string) => markLessonComplete(lId)}
                    completedLessons={progress.completedLessons}
                    completionPercentage={completionPercentage}
                  />
                )}

                {/* 5. Universal Lesson Viewer (Future Perfect 10 Modules) */}
                {currentRoute === 'lesson' && (
                  <LessonPage
                    lessonId={activeLessonId}
                    onNavigate={handleNavigate}
                    onMarkComplete={(lId: string) => markLessonComplete(lId)}
                    isCompleted={progress.completedLessons.includes(activeLessonId)}
                  />
                )}

                {/* 6. Courses Catalog */}
                {currentRoute === 'courses' && (
                  <CoursesPage onNavigate={handleNavigate} />
                )}

                {/* 7. Vocabulary Academy */}
                {currentRoute === 'vocabulary' && (
                  <VocabularyAcademyPage key={authUser?.id || 'guest'} learnerId={authUser?.id} onNavigate={handleNavigate} />
                )}

                {currentRoute === 'idioms' && (
                  <PhraseBankPage bank="idioms" />
                )}
                {currentRoute === 'slang' && (
                  <PhraseBankPage bank="slang" />
                )}
                {currentRoute === 'genz' && (
                  <PhraseBankPage bank="genz" />
                )}
                {currentRoute === 'ielts' && (
                  <ExamVocabPage exam="ielts" />
                )}
                {currentRoute === 'toefl' && (
                  <ExamVocabPage exam="toefl" />
                )}

                {/* 8. Speaking Academy */}
                {currentRoute === 'speaking' && (
                  <SpeakingAcademyPage onNavigate={handleNavigate} onCompleteActivity={(id, s, t) => { recordQuizScore(id, s, t); recordSpeakingPractice(); }} completedActivityIds={Object.keys(progress.quizScores)} />
                )}

                {/* 9. Listening Academy */}
                {currentRoute === 'listening' && (
                  <ListeningAcademyPage onNavigate={handleNavigate} onCompleteActivity={recordQuizScore} learnerId={authUser?.id} />
                )}

                {/* 10. Reading Academy */}
                {currentRoute === 'reading' && (
                  <ReadingAcademyPage onNavigate={handleNavigate} onCompleteActivity={recordQuizScore} />
                )}

                {/* 11. Writing Academy */}
                {currentRoute === 'writing' && (
                  <WritingAcademyPage onNavigate={handleNavigate} onCompleteActivity={recordQuizScore} />
                )}

                {/* 12. Pronunciation & Phonetics Academy */}
                {currentRoute === 'pronunciation' && (
                  <PronunciationAcademyPage onNavigate={handleNavigate} />
                )}

                {/* 13. Real Life English Simulation */}
                {currentRoute === 'real-life' && (
                  <RealLifeEnglishPage onNavigate={handleNavigate} />
                )}

                {/* 14. Exams & Level Placement */}
                {currentRoute === 'exams' && (
                  <ExamsAssessmentPage key={authUser?.id || 'guest'} learnerId={authUser?.id} onNavigate={handleNavigate} />
                )}

                {/* 15. Practice Lab */}
                {currentRoute === 'practice' && (
                  <PracticePage />
                )}

                {/* 16. My Learning, Notes & Bookmarks */}
                {currentRoute === 'my-learning' && (
                  <MyLearningPage
                    progress={progress}
                    userProfile={activeProfile}
                    onNavigate={handleNavigate}
                    onDeleteNote={deletePersonalNote}
                    badges={badges}
                    completionPercentage={completionPercentage}
                  />
                )}

                {/* 17. Admin & Teacher Studio */}
                {currentRoute === 'leaderboard' && <LeaderboardPage onNavigate={handleNavigate} authenticated={isAuthenticated} />}

                {currentRoute === 'admin' && (
                  <AdminServerGate>
                    <AdminDashboardPage onNavigate={handleNavigate} />
                  </AdminServerGate>
                )}

                {/* 18. Quizzes & Tests Lab */}
                {currentRoute === 'quizzes' && (
                  <QuizzesPage key={authUser?.id || 'guest'} onRecordScore={recordQuizScore} />
                )}

                {/* 19. Games & Interactive Practice */}
                {currentRoute === 'games' && (
                  <GamesPage key={authUser?.id || 'guest'} />
                )}

                {/* 20. Resources & Cheat Sheets */}
                {currentRoute === 'resources' && (
                  <ResourcesPage />
                )}

                {/* 20b. Top External Resources Directory */}
                {currentRoute === 'sources' && (
                  <SourcesPage key={authUser?.id || 'guest'} learnerId={authUser?.id} />
                )}

                {/* 21. About Academy & Methodology */}
                {currentRoute === 'about' && (
                  <AboutPage />
                )}

                {/* 22. AI English Tutor Agent */}
                {currentRoute === 'ai-tutor' && (
                  <AiTutorPage key={authUser?.id || 'guest'} onNavigate={handleNavigate} userProfile={activeProfile} />
                )}

                {/* 23. 3D Virtual Academy World */}
                {currentRoute === 'world-3d' && (
                  <div className="space-y-6">
                    <Interactive3DWorld onNavigate={handleNavigate} />
                  </div>
                )}

                {/* 24. Official Certificates System */}
                {currentRoute === 'badges' && <BadgesPage onNavigate={handleNavigate} learnerId={authUser?.id} />}
                {currentRoute === 'certificates' && (
                  <CertificatesPage key={authUser?.id || 'guest'}
                    onRecordScore={recordQuizScore}
                    onNavigate={handleNavigate}
                    userProfile={activeProfile}
                    completedLessons={progress.completedLessons}
                    quizScores={progress.quizScores}
                    isLoggedIn={session.isLoggedIn && session.type === 'authenticated'}
                    onRequestAuth={() => openAuthWithTab('register')}
                  />
                )}

                {currentRoute === 'profile' && (
                  <ProfilePage
                    userProfile={activeProfile}
                    isLoggedIn={session.isLoggedIn && session.type === 'authenticated'}
                    onNavigate={handleNavigate}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onToggleRole={toggleUserRole}
                    onSignOut={logout}
                    onRequestAuth={() => openAuthWithTab('login')}
                  />
                )}

                {/* 25. Complete 5,000 Sentences Library */}
                {currentRoute === 'sentences' && (
                  <SentencesLibraryPage key={authUser?.id || 'guest'} learnerId={authUser?.id} onNavigate={handleNavigate} />
                )}

                {/* 26. Learn English Through Movies Studio */}
                {currentRoute === 'movies' && (
                  <MovieStudioPage key={authUser?.id || 'guest'} learnerId={authUser?.id} onNavigate={handleNavigate} />
                )}

                {/* 27. Complete AI Translation Studio */}
                {currentRoute === 'translation' && (
                  <TranslationStudioPage key={authUser?.id || 'guest'} learnerId={authUser?.id} userProfile={activeProfile} />
                )}
              </>
            )}

          </motion.div>
        </AnimatePresence>
        </Suspense>
      </MainLayout>

      {/* Global Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        key={authUser?.id || 'guest'}
        learnerId={authUser?.id}
        userLevel={activeProfile.currentLevel}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {isSettingsOpen && (
        <SettingsModal key={`${authUser?.id || 'guest'}:${session.accessToken || ''}`}
          userProfile={activeProfile}
          accessToken={session.accessToken}
          onClose={() => setIsSettingsOpen(false)}
          onSaved={(patch) => {
            const sess = getSavedAuthSession();
            if (sess.user.id !== activeProfile.id || sess.accessToken !== session.accessToken) return;
            saveAuthSession({
              ...sess,
              user: {
                ...sess.user,
                ...(patch.name ? { name: patch.name, nameAr: patch.name } : {}),
                ...(patch.avatar !== undefined ? { avatar: patch.avatar || sess.user.avatar } : {}),
              },
            });
            refreshSession();
          }}
        />
      )}

      {/* Voice Settings & Preview Modal (Natural Male / Preserved Female) */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Authentication & Guest Mode Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onSessionChange={refreshSession}
      />
    </>
  );
};
