import { useLanguage } from '../i18n/LanguageContext';
import React, { useState } from 'react';
import { COURSES_CATALOG, COURSES_PAGE_COPY, CourseItem } from '../data/coursesData';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { PageRoute } from '../types';
import { playSound } from '../utils/audio';
import { BookOpen, Star, Clock, Users, ArrowRight, Sparkles, Filter, Rocket, RefreshCw, GitBranch, Cpu, Mic2 } from 'lucide-react';

const COURSE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'future-perfect': Rocket,
  'grammar-academy': GitBranch,
  'vocabulary-academy': BookOpen,
  'present-perfect': RefreshCw,
  'conditionals': Cpu,
  'listening-academy': Mic2,
};

interface CoursesPageProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const appText = useAppTextMap('coursesData');

  const levels = ['All', 'مبتدئ', 'متوسط', 'متقدم', 'شامل'];

  const filtered = filterLevel === 'All'
    ? COURSES_CATALOG
    : COURSES_CATALOG.filter(c => c.level === filterLevel);

  const handleSelectCourse = (course: CourseItem) => {
    playSound('click');
    if (course.ruleId) {
      onNavigate('grammar-lesson', course.ruleId);
    } else if (course.route) {
      onNavigate(course.route as PageRoute);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HENGLISH ACADEMY • {appText ? txText(appText, COURSES_PAGE_COPY.catalogChip) : 'COURSE CATALOG'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          {txText(appText, COURSES_PAGE_COPY.heroTitle)}
        </h1>
        <p className="text-base text-[#b9b6d5] max-w-3xl leading-relaxed">
          {txText(appText, COURSES_PAGE_COPY.heroSubtitle)}
        </p>
      </div>

      {/* Grammar Academy Spotlight Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#41e7ff]/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(65,231,255,0.1)]">
        <div className="space-y-2">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/30">
            {txText(appText, COURSES_PAGE_COPY.promoChip)}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {txText(appText, COURSES_PAGE_COPY.promoTitle)}
          </h2>
          <p className="text-xs sm:text-sm text-[#dedbf4]">
            {txText(appText, COURSES_PAGE_COPY.promoBody)}
          </p>
        </div>

        <button
          onClick={() => {
            playSound('click');
            onNavigate('courses/grammar');
          }}
          className="px-5 py-3 rounded-2xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm hover:brightness-110 shadow-lg shrink-0 cursor-pointer flex items-center gap-2"
        >
          <span>{txText(appText, COURSES_PAGE_COPY.promoCta)}</span>
          <ArrowRight className="w-4 h-4 rotate-180" />
        </button>
      </div>

      {/* Level Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        <span className="text-xs text-[#b9b6d5] flex items-center gap-1 ml-2 font-bold shrink-0">
          <Filter className="w-3.5 h-3.5" />
          {txText(appText, COURSES_PAGE_COPY.filterLabel)}
        </span>
        {levels.map(lvl => (
          <button
            key={lvl}
            onClick={() => {
              playSound('click');
              setFilterLevel(lvl);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              filterLevel === lvl
                ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black shadow-md'
                : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
            }`}
          >
            {lvl === 'All' ? txText(appText, COURSES_PAGE_COPY.allLevels) : txText(appText, lvl)}
          </button>
        ))}
      </div>

      {/* Courses Grid with Real Online Photo Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => (
          <div
            key={course.id}
            onClick={() => handleSelectCourse(course)}
            className={`glass-panel rounded-3xl border transition-all hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group overflow-hidden ${
              course.isFlagship
                ? 'border-[#ffd166]/50 shadow-[0_0_30px_rgba(255,209,102,0.15)] ring-1 ring-[#ffd166]/30'
                : 'border-white/10 hover:border-[#41e7ff]/40'
            }`}
          >
            {/* Real Online Course Photo Banner */}
            {course.imageUrl && (
              <div className="h-44 relative overflow-hidden shrink-0">
                <img 
                  src={course.imageUrl} 
                  alt={course.title}
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={675}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#171632] via-transparent to-transparent" />
                
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black backdrop-blur-md ${
                  course.isFlagship
                    ? 'bg-[#ffd166]/90 text-[#21132c] shadow-md'
                    : 'bg-[#09091a]/80 text-[#41e7ff] border border-white/15'
                }`}>
                  {txText(appText, course.tag)}
                </span>

                {typeof course.rating === 'number' && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 text-xs text-[#ffd166] font-bold px-2 py-0.5 rounded-lg bg-[#09091a]/80 backdrop-blur-md border border-white/10">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{course.rating}</span>
                  </div>
                )}
              </div>
            )}

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Course Title & Icon */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="shrink-0 p-2 rounded-xl bg-white/5 border border-white/10 inline-flex">
                    {(() => { const CourseIcon = COURSE_ICONS[course.id] || BookOpen; return <CourseIcon className="w-6 h-6 text-[#41e7ff]" />; })()}
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-[#41e7ff] transition-colors leading-snug">
                      {txText(appText, course.title)}
                    </h3>
                    <span className="en block text-xs font-bold text-[#b9b6d5] mt-0.5">
                      {course.titleEn}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#dedbf4] leading-relaxed line-clamp-3 mb-4">
                  {txText(appText, course.description)}
                </p>
              </div>

              {/* Bottom Meta & Button */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#dedbf4]">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#41e7ff]" />
                    <span>{course.countLabel ? txText(appText, course.countLabel) : t('dash.lessonsCount').replace('{n}', String(course.lessonsCount))}</span>
                  </span>
                  {course.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#ffd166]" />
                      <span>{txText(appText, course.duration)}</span>
                    </span>
                  )}
                  {typeof course.studentsCount === 'number' && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#c4ff55]" />
                      <span>{course.studentsCount}</span>
                    </span>
                  )}
                </div>

                <button
                  className={`w-full py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    course.isFlagship
                      ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] hover:brightness-110 shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span>{course.ctaLabel ? txText(appText, course.ctaLabel) : txText(appText, COURSES_PAGE_COPY.defaultCta)}</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
