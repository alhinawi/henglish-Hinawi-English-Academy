import React from 'react';
import { CheckCircle2, ListTree } from 'lucide-react';
import { PageRoute } from '../types';
import { FUTURE_PERFECT_LESSONS } from '../data/futurePerfectCourse';
import { playSound } from '../utils/audio';
import { CourseOverviewPage } from './CourseOverviewPage';
import { LessonPage } from './LessonPage';

interface FuturePerfectCoursePageProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  onMarkComplete: (lessonId: string) => void;
  completedLessons: string[];
  completionPercentage: number;
}

// The full Future Perfect course on ONE scrolling page: overview, a table of
// contents with per-module progress, then every module with its exercises.
// Old per-lesson links redirect here and scroll to the module anchor.
export const FuturePerfectCoursePage: React.FC<FuturePerfectCoursePageProps> = ({
  onNavigate,
  onMarkComplete,
  completedLessons,
  completionPercentage,
}) => {
  const scrollToLesson = (id: string) => {
    playSound('click');
    document.getElementById(`fp-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-4 pb-16">
      <CourseOverviewPage onNavigate={onNavigate} completionPercentage={completionPercentage} />

      {/* Table of contents */}
      <nav
        aria-label="فهرس دروس المستقبل التام"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="glass-panel rounded-2xl border border-white/10 p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-black text-sm">
            <ListTree className="w-4 h-4 text-[#41e7ff]" />
            <span>محتويات الكورس - {FUTURE_PERFECT_LESSONS.length} دروس في صفحة واحدة</span>
            <span className="ms-auto text-xs font-bold text-[#ffd166]">{completionPercentage}%</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar sm:flex-wrap sm:overflow-visible">
            {FUTURE_PERFECT_LESSONS.map((lesson) => {
              const done = completedLessons.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => scrollToLesson(lesson.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    done
                      ? 'bg-[#c4ff55]/15 border-[#c4ff55]/40 text-[#c4ff55]'
                      : 'bg-white/5 border-white/10 text-[#dedbf4] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {done && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>0{lesson.number}</span>
                  <span className="max-w-36 truncate">{lesson.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Every module with its exercises, in order */}
      {FUTURE_PERFECT_LESSONS.map((lesson) => (
        <LessonPage
          key={lesson.id}
          embedded
          lessonId={lesson.id}
          onNavigate={onNavigate}
          onMarkComplete={onMarkComplete}
          isCompleted={completedLessons.includes(lesson.id)}
        />
      ))}
    </div>
  );
};
