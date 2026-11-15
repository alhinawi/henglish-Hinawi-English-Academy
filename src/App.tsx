import React, { useState, useEffect, lazy, Suspense } from 'react';
import { PageRoute } from './types';
import { MainLayout } from './components/layout/MainLayout';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { AuthModal } from './components/AuthModal';
import { GuestNudge } from './components/GuestNudge';
import { useProgress } from './utils/useProgress';
import { useAuth } from './context/AuthContext';

// Auth Pages
import { LoginPage } from './views/auth/LoginPage';
import { RegisterPage } from './views/auth/RegisterPage';
import { VerifyEmailPage } from './views/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './views/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './views/auth/ResetPasswordPage';

// Academies & Platform Pages
const DashboardPage = lazy(() => import('./views/DashboardPage').then(m => ({ default: m.DashboardPage })));
const TeacherDashboardPage = lazy(() => import('./views/TeacherDashboardPage').then(m => ({ default: m.TeacherDashboardPage })));
const GrammarAcademyPage = lazy(() => import('./views/GrammarAcademyPage').then(m => ({ default: m.GrammarAcademyPage })));
const GrammarLessonPage = lazy(() => import('./views/GrammarLessonPage').then(m => ({ default: m.GrammarLessonPage })));
const VocabularyAcademyPage = lazy(() => import('./views/VocabularyAcademyPage').then(m => ({ default: m.VocabularyAcademyPage })));
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
const Interactive3DWorld = lazy(() => import('./components/Interactive3DWorld').then(m => ({ default: m.Interactive3DWorld })));

// Flagship Future Perfect & Existing Core Pages
const CourseOverviewPage = lazy(() => import('./views/CourseOverviewPage').then(m => ({ default: m.CourseOverviewPage })));
const LessonPage = lazy(() => import('./views/LessonPage').then(m => ({ default: m.LessonPage })));
const CoursesPage = lazy(() => import('./views/CoursesPage').then(m => ({ default: m.CoursesPage })));
const PracticePage = lazy(() => import('./views/PracticePage').then(m => ({ default: m.PracticePage })));
const QuizzesPage = lazy(() => import('./views/QuizzesPage').then(m => ({ default: m.QuizzesPage })));
const GamesPage = lazy(() => import('./views/GamesPage').then(m => ({ default: m.GamesPage })));
const ResourcesPage = lazy(() => import('./views/ResourcesPage').then(m => ({ default: m.ResourcesPage })));
const AboutPage = lazy(() => import('./views/AboutPage').then(m => ({ default: m.AboutPage })));
const SentencesLibraryPage = lazy(() => import('./views/SentencesLibraryPage').then(m => ({ default: m.SentencesLibraryPage })));
const MovieStudioPage = lazy(() => import('./views/MovieStudioPage').then(m => ({ default: m.MovieStudioPage })));
const TranslationStudioPage = lazy(() => import('./views/TranslationStudioPage').then(m => ({ default: m.TranslationStudioPage })));

import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export const App: React.FC<{ initialRoute?: PageRoute }> = ({ initialRoute }) => {
  const { 
    session, 
    user: authUser, 
    role: authRole, 
    isAuthenticated, 
    isGuest, 
    isDemo, 
    logout,
    refreshSession,
  } = useAuth();

  const [currentRoute, setCurrentRoute] = useState<PageRoute>(initialRoute ?? 'login');
  const [activeLessonId, setActiveLessonId] = useState<string>('lesson-1');
  const [activeGrammarRuleId, setActiveGrammarRuleId] = useState<string>('present-simple');
  const [verifyEmailParam, setVerifyEmailParam] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'demo' | 'migrate'>('login');

  const {
    progress,
    userProfile,
    notifications,
    unreadNotificationsCount,
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
    resetAllProgress,
    completionPercentage,
    badges,
  } = useProgress(authUser?.id);

  // Active profile from auth session or fallback
  const activeProfile = authUser || userProfile;

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
      // If user is neither authenticated, nor demo, nor active guest: default to 'login'
      const hasActiveSession = session.isLoggedIn || session.type === 'guest' || session.type === 'demo';
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
        setCurrentRoute('lesson');
        setActiveLessonId(hash);
      } else if (hash === 'courses') {
        setCurrentRoute('courses');
      } else if (hash === 'grammar' || hash === 'courses/grammar') {
        setCurrentRoute('grammar');
      } else if (hash === 'future-perfect' || hash === 'courses/grammar/future-perfect') {
        setCurrentRoute('courses/grammar/future-perfect');
      } else if (hash === 'vocabulary') {
        setCurrentRoute('vocabulary');
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
      } else if (hash === 'certificates') {
        setCurrentRoute('certificates');
      } else if (hash === 'exams' || hash === 'assessment') {
        setCurrentRoute('exams');
      } else if (hash === 'practice' || hash === 'homework') {
        setCurrentRoute('practice');
      } else if (hash === 'my-learning' || hash === 'progress') {
        setCurrentRoute('my-learning');
      } else if (hash === 'admin') {
        setCurrentRoute('admin');
      } else if (hash === 'quizzes') {
        setCurrentRoute('quizzes');
      } else if (hash === 'games') {
        setCurrentRoute('games');
      } else if (hash === 'resources') {
        setCurrentRoute('resources');
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
    const castRoute = route as PageRoute;
    setCurrentRoute(castRoute);

    if (castRoute === 'grammar-lesson' && targetId) {
      setActiveGrammarRuleId(targetId);
      window.location.hash = `grammar/${targetId}`;
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

  const openAuthWithTab = (tab: 'login' | 'register' | 'demo' | 'migrate' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  // -------------------------------------------------------------
  // RENDER DEDICATED AUTH PAGES
  // -------------------------------------------------------------
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
  const isAdminBlocked = currentRoute === 'admin' && authRole !== 'admin';

  return (
    <>
      <GuestNudge
        isGuest={isGuest}
        currentRoute={currentRoute}
        onRegister={() => handleNavigate('register')}
      />

      <MainLayout
        currentRoute={currentRoute}
        activeLessonId={activeLessonId}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenVoiceSettings={() => setIsVoiceModalOpen(true)}
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
            <Suspense fallback={<div className="min-h-[40vh]" />}>
            {/* RBAC Block View for non-admins */}
            {isAdminBlocked ? (
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
                    onToggleGoal={toggleDailyGoal}
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
                  <CourseOverviewPage
                    onNavigate={handleNavigate}
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
                  <VocabularyAcademyPage onNavigate={handleNavigate} />
                )}

                {/* 8. Speaking Academy */}
                {currentRoute === 'speaking' && (
                  <SpeakingAcademyPage onNavigate={handleNavigate} />
                )}

                {/* 9. Listening Academy */}
                {currentRoute === 'listening' && (
                  <ListeningAcademyPage onNavigate={handleNavigate} />
                )}

                {/* 10. Reading Academy */}
                {currentRoute === 'reading' && (
                  <ReadingAcademyPage onNavigate={handleNavigate} />
                )}

                {/* 11. Writing Academy */}
                {currentRoute === 'writing' && (
                  <WritingAcademyPage onNavigate={handleNavigate} />
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
                  <ExamsAssessmentPage onNavigate={handleNavigate} />
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
                {currentRoute === 'admin' && (
                  <AdminDashboardPage onNavigate={handleNavigate} />
                )}

                {/* 18. Quizzes & Tests Lab */}
                {currentRoute === 'quizzes' && (
                  <QuizzesPage onRecordScore={recordQuizScore} />
                )}

                {/* 19. Games & Interactive Practice */}
                {currentRoute === 'games' && (
                  <GamesPage />
                )}

                {/* 20. Resources & Cheat Sheets */}
                {currentRoute === 'resources' && (
                  <ResourcesPage />
                )}

                {/* 21. About Academy & Methodology */}
                {currentRoute === 'about' && (
                  <AboutPage />
                )}

                {/* 22. AI English Tutor Agent */}
                {currentRoute === 'ai-tutor' && (
                  <AiTutorPage onNavigate={handleNavigate} userProfile={activeProfile} />
                )}

                {/* 23. 3D Virtual Academy World */}
                {currentRoute === 'world-3d' && (
                  <div className="space-y-6">
                    <Interactive3DWorld onNavigate={handleNavigate} />
                  </div>
                )}

                {/* 24. Official Certificates System */}
                {currentRoute === 'certificates' && (
                  <CertificatesPage
                    onNavigate={handleNavigate}
                    userProfile={activeProfile}
                    completedLessons={progress.completedLessons}
                    quizScores={progress.quizScores}
                  />
                )}

                {/* 25. Complete 5,000 Sentences Library */}
                {currentRoute === 'sentences' && (
                  <SentencesLibraryPage onNavigate={handleNavigate} />
                )}

                {/* 26. Learn English Through Movies Studio */}
                {currentRoute === 'movies' && (
                  <MovieStudioPage onNavigate={handleNavigate} />
                )}

                {/* 27. Complete AI Translation Studio */}
                {currentRoute === 'translation' && (
                  <TranslationStudioPage userProfile={activeProfile} />
                )}
              </>
            )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </MainLayout>

      {/* Global Search Modal (Ctrl+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Voice Settings & Preview Modal (Natural Male / Preserved Female) */}
      <VoiceSettingsModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* Authentication, Guest Mode & Demo Accounts Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
        onSessionChange={refreshSession}
      />
    </>
  );
};
