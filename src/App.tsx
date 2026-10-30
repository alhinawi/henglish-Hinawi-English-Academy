import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { MainLayout } from './components/layout/MainLayout';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { AuthModal } from './components/AuthModal';
import { useProgress } from './utils/useProgress';
import { getSavedAuthSession, AuthSessionState } from './services/authService';

// Academies & Platform Pages
import { DashboardPage } from './pages/DashboardPage';
import { GrammarAcademyPage } from './pages/GrammarAcademyPage';
import { GrammarLessonPage } from './pages/GrammarLessonPage';
import { VocabularyAcademyPage } from './pages/VocabularyAcademyPage';
import { SpeakingAcademyPage } from './pages/SpeakingAcademyPage';
import { ListeningAcademyPage } from './pages/ListeningAcademyPage';
import { ReadingAcademyPage } from './pages/ReadingAcademyPage';
import { WritingAcademyPage } from './pages/WritingAcademyPage';
import { PronunciationAcademyPage } from './pages/PronunciationAcademyPage';
import { RealLifeEnglishPage } from './pages/RealLifeEnglishPage';
import { ExamsAssessmentPage } from './pages/ExamsAssessmentPage';
import { MyLearningPage } from './pages/MyLearningPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AiTutorPage } from './pages/AiTutorPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { Interactive3DWorld } from './components/Interactive3DWorld';

// Flagship Future Perfect & Existing Core Pages
import { CourseOverviewPage } from './pages/CourseOverviewPage';
import { LessonPage } from './pages/LessonPage';
import { CoursesPage } from './pages/CoursesPage';
import { PracticePage } from './pages/PracticePage';
import { QuizzesPage } from './pages/QuizzesPage';
import { GamesPage } from './pages/GamesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AboutPage } from './pages/AboutPage';

import { AnimatePresence, motion } from 'framer-motion';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string>('lesson-1');
  const [activeGrammarRuleId, setActiveGrammarRuleId] = useState<string>('present-simple');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'demo' | 'migrate'>('login');
  const [authSession, setAuthSession] = useState<AuthSessionState>(() => getSavedAuthSession());

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
  } = useProgress();

  // Active profile from auth session or progress
  const activeProfile = authSession.user || userProfile;

  // Sync route with URL hash for deep-linking & browser back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash || hash === 'dashboard' || hash === 'home') {
        setCurrentRoute('dashboard');
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
      } else if (hash === 'admin' || hash === 'teacher') {
        setCurrentRoute('admin');
      } else if (hash === 'quizzes') {
        setCurrentRoute('quizzes');
      } else if (hash === 'games') {
        setCurrentRoute('games');
      } else if (hash === 'resources') {
        setCurrentRoute('resources');
      } else if (hash === 'about') {
        setCurrentRoute('about');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (route: PageRoute, targetId?: string) => {
    setCurrentRoute(route);
    if (route === 'grammar-lesson' && targetId) {
      setActiveGrammarRuleId(targetId);
      window.location.hash = `grammar/${targetId}`;
    } else if (route === 'lesson' && targetId) {
      setActiveLessonId(targetId);
      window.location.hash = targetId;
    } else {
      if (route === 'dashboard' || route === 'home') {
        window.location.hash = '';
      } else if (route === 'courses/grammar/future-perfect') {
        window.location.hash = 'future-perfect';
      } else {
        window.location.hash = route;
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

  return (
    <>
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
        authSessionType={authSession.type}
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
                onMarkComplete={markLessonComplete}
                isCompleted={progress.completedLessons.includes(activeLessonId)}
              />
            )}

            {/* 6. AI English Tutor Agent */}
            {currentRoute === 'ai-tutor' && (
              <AiTutorPage
                onNavigate={handleNavigate}
                userProfile={activeProfile}
              />
            )}

            {/* 7. Interactive 3D Campus World */}
            {currentRoute === 'world-3d' && (
              <Interactive3DWorld
                onNavigate={handleNavigate}
                onSelectScenario={() => handleNavigate('real-life')}
              />
            )}

            {/* 8. Certificates & Public Verification */}
            {currentRoute === 'certificates' && (
              <CertificatesPage
                onNavigate={handleNavigate}
                userProfile={activeProfile}
                completedLessonsCount={progress.completedLessons.length}
              />
            )}

            {/* 9. Vocabulary Academy */}
            {currentRoute === 'vocabulary' && (
              <VocabularyAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 10. Speaking Academy */}
            {currentRoute === 'speaking' && (
              <SpeakingAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 11. Listening Academy */}
            {currentRoute === 'listening' && (
              <ListeningAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 12. Reading Academy */}
            {currentRoute === 'reading' && (
              <ReadingAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 13. Writing Academy */}
            {currentRoute === 'writing' && (
              <WritingAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 14. Pronunciation Academy */}
            {currentRoute === 'pronunciation' && (
              <PronunciationAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 15. Real-Life English Simulator */}
            {currentRoute === 'real-life' && (
              <RealLifeEnglishPage onNavigate={handleNavigate} />
            )}

            {/* 16. Exams & Adaptive Placement Test */}
            {currentRoute === 'exams' && (
              <ExamsAssessmentPage
                onNavigate={handleNavigate}
                onRecordScore={recordQuizScore}
              />
            )}

            {/* 17. Practice Lab */}
            {currentRoute === 'practice' && (
              <PracticePage />
            )}

            {/* 18. My Learning Space */}
            {(currentRoute === 'my-learning' || currentRoute === 'progress') && (
              <MyLearningPage
                onNavigate={handleNavigate}
                userProfile={activeProfile}
                progress={progress}
                badges={badges}
                onDeleteNote={deletePersonalNote}
                completionPercentage={completionPercentage}
              />
            )}

            {/* 19. Teacher Studio & Administration */}
            {currentRoute === 'admin' && (
              <AdminDashboardPage onNavigate={handleNavigate} />
            )}

            {/* 20. Courses Catalog */}
            {currentRoute === 'courses' && (
              <CoursesPage onNavigate={handleNavigate} />
            )}

            {/* 21. Quizzes Hub */}
            {currentRoute === 'quizzes' && (
              <QuizzesPage onRecordScore={recordQuizScore} />
            )}

            {/* 22. Games Arena */}
            {currentRoute === 'games' && (
              <GamesPage />
            )}

            {/* 23. Resources Hub */}
            {currentRoute === 'resources' && (
              <ResourcesPage />
            )}

            {/* 24. About Academy */}
            {currentRoute === 'about' && (
              <AboutPage />
            )}
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
        onSessionChange={(newSession) => setAuthSession(newSession)}
      />
    </>
  );
};
