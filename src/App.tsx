import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { MainLayout } from './components/layout/MainLayout';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { useProgress } from './utils/useProgress';

// Academies & Platform Pages
import { DashboardPage } from './pages/DashboardPage';
import { GrammarAcademyPage } from './pages/GrammarAcademyPage';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  // Sync route with URL hash for browser navigation & deep-linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash || hash === 'dashboard' || hash === 'home') {
        setCurrentRoute('dashboard');
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

  const handleNavigate = (route: PageRoute, lessonId?: string) => {
    setCurrentRoute(route);
    if (lessonId) {
      setActiveLessonId(lessonId);
      window.location.hash = lessonId;
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

  return (
    <>
      <MainLayout
        currentRoute={currentRoute}
        activeLessonId={activeLessonId}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        userProfile={userProfile}
        notifications={notifications}
        unreadCount={unreadNotificationsCount}
        onMarkNotificationRead={markNotificationRead}
        onMarkAllNotificationsRead={markAllNotificationsRead}
        onToggleRole={toggleUserRole}
        onResetProgress={resetAllProgress}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute === 'lesson' ? `${currentRoute}-${activeLessonId}` : currentRoute}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {/* 1. Central Dashboard */}
            {(currentRoute === 'dashboard' || currentRoute === 'home') && (
              <DashboardPage
                onNavigate={handleNavigate}
                userProfile={userProfile}
                progress={progress}
                badges={badges}
                onToggleGoal={toggleDailyGoal}
              />
            )}

            {/* 2. Grammar Academy */}
            {(currentRoute === 'grammar' || currentRoute === 'courses/grammar') && (
              <GrammarAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 3. Flagship Course: Future Perfect */}
            {currentRoute === 'courses/grammar/future-perfect' && (
              <CourseOverviewPage
                onNavigate={handleNavigate}
                completionPercentage={completionPercentage}
              />
            )}

            {/* 4. Universal Lesson Viewer */}
            {currentRoute === 'lesson' && (
              <LessonPage
                lessonId={activeLessonId}
                onNavigate={handleNavigate}
                onMarkComplete={markLessonComplete}
                isCompleted={progress.completedLessons.includes(activeLessonId)}
              />
            )}

            {/* 5. Vocabulary Academy */}
            {currentRoute === 'vocabulary' && (
              <VocabularyAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 6. Speaking Academy */}
            {currentRoute === 'speaking' && (
              <SpeakingAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 7. Listening Academy */}
            {currentRoute === 'listening' && (
              <ListeningAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 8. Reading Academy */}
            {currentRoute === 'reading' && (
              <ReadingAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 9. Writing Academy */}
            {currentRoute === 'writing' && (
              <WritingAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 10. Pronunciation Academy */}
            {currentRoute === 'pronunciation' && (
              <PronunciationAcademyPage onNavigate={handleNavigate} />
            )}

            {/* 11. Real-Life English */}
            {currentRoute === 'real-life' && (
              <RealLifeEnglishPage onNavigate={handleNavigate} />
            )}

            {/* 12. Exams & Placement */}
            {currentRoute === 'exams' && (
              <ExamsAssessmentPage
                onNavigate={handleNavigate}
                onRecordScore={recordQuizScore}
              />
            )}

            {/* 13. Practice Lab */}
            {currentRoute === 'practice' && (
              <PracticePage />
            )}

            {/* 14. My Learning */}
            {(currentRoute === 'my-learning' || currentRoute === 'progress') && (
              <MyLearningPage
                onNavigate={handleNavigate}
                userProfile={userProfile}
                progress={progress}
                badges={badges}
                onDeleteNote={deletePersonalNote}
                completionPercentage={completionPercentage}
              />
            )}

            {/* 15. Teacher & Content Studio */}
            {currentRoute === 'admin' && (
              <AdminDashboardPage onNavigate={handleNavigate} />
            )}

            {/* 16. Courses Catalog */}
            {currentRoute === 'courses' && (
              <CoursesPage onNavigate={handleNavigate} />
            )}

            {/* 17. Quizzes Hub */}
            {currentRoute === 'quizzes' && (
              <QuizzesPage onRecordScore={recordQuizScore} />
            )}

            {/* 18. Games Arena */}
            {currentRoute === 'games' && (
              <GamesPage />
            )}

            {/* 19. Resources Hub */}
            {currentRoute === 'resources' && (
              <ResourcesPage />
            )}

            {/* 20. About Academy */}
            {currentRoute === 'about' && (
              <AboutPage />
            )}
          </motion.div>
        </AnimatePresence>
      </MainLayout>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </>
  );
};
