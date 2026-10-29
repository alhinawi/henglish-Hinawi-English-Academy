import React, { useState, useEffect } from 'react';
import { PageRoute } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { useProgress } from './utils/useProgress';

// Pages
import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseOverviewPage } from './pages/CourseOverviewPage';
import { LessonPage } from './pages/LessonPage';
import { PracticePage } from './pages/PracticePage';
import { QuizzesPage } from './pages/QuizzesPage';
import { GamesPage } from './pages/GamesPage';
import { SpeakingPage } from './pages/SpeakingPage';
import { VocabularyPage } from './pages/VocabularyPage';
import { ProgressPage } from './pages/ProgressPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { AboutPage } from './pages/AboutPage';

import { AnimatePresence, motion } from 'framer-motion';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [activeLessonId, setActiveLessonId] = useState<string>('lesson-1');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    progress,
    markLessonComplete,
    recordQuizScore,
    resetAllProgress,
    completionPercentage,
    badges,
  } = useProgress();

  // Sync route with URL hash for browser navigation & deep-linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) {
        setCurrentRoute('home');
      } else if (hash.startsWith('lesson-')) {
        setCurrentRoute('lesson');
        setActiveLessonId(hash);
      } else if (hash === 'courses') {
        setCurrentRoute('courses');
      } else if (hash === 'future-perfect' || hash === 'courses/grammar/future-perfect') {
        setCurrentRoute('courses/grammar/future-perfect');
      } else if (hash === 'practice') {
        setCurrentRoute('practice');
      } else if (hash === 'quizzes') {
        setCurrentRoute('quizzes');
      } else if (hash === 'games') {
        setCurrentRoute('games');
      } else if (hash === 'speaking') {
        setCurrentRoute('speaking');
      } else if (hash === 'vocabulary') {
        setCurrentRoute('vocabulary');
      } else if (hash === 'homework') {
        setCurrentRoute('practice');
      } else if (hash === 'progress') {
        setCurrentRoute('progress');
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
      if (route === 'home') {
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
    <div className="min-h-screen flex flex-col bg-[#0c0b20] text-[#f7f5ff] selection:bg-[#ff4f9a]/30 selection:text-[#ffd166]">
      {/* Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        completionPercentage={completionPercentage}
      />

      {/* Main Content Router with Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute === 'lesson' ? `${currentRoute}-${activeLessonId}` : currentRoute}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {currentRoute === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                completionPercentage={completionPercentage}
              />
            )}

            {currentRoute === 'courses' && (
              <CoursesPage onNavigate={handleNavigate} />
            )}

            {currentRoute === 'courses/grammar/future-perfect' && (
              <CourseOverviewPage
                onNavigate={handleNavigate}
                completionPercentage={completionPercentage}
              />
            )}

            {currentRoute === 'lesson' && (
              <LessonPage
                lessonId={activeLessonId}
                onNavigate={handleNavigate}
                onMarkComplete={markLessonComplete}
                isCompleted={progress.completedLessons.includes(activeLessonId)}
              />
            )}

            {currentRoute === 'practice' && (
              <PracticePage />
            )}

            {currentRoute === 'quizzes' && (
              <QuizzesPage onRecordScore={recordQuizScore} />
            )}

            {currentRoute === 'games' && (
              <GamesPage />
            )}

            {currentRoute === 'speaking' && (
              <SpeakingPage />
            )}

            {currentRoute === 'vocabulary' && (
              <VocabularyPage />
            )}

            {currentRoute === 'progress' && (
              <ProgressPage
                progress={progress}
                completionPercentage={completionPercentage}
                badges={badges}
                onResetProgress={resetAllProgress}
                onNavigate={handleNavigate}
              />
            )}

            {currentRoute === 'resources' && (
              <ResourcesPage />
            )}

            {currentRoute === 'about' && (
              <AboutPage />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Branded Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};
