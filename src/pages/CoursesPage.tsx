import React, { useState } from 'react';
import { COURSES_CATALOG, CourseItem } from '../data/coursesData';
import { PageRoute } from '../types';
import { playSound } from '../utils/audio';
import { BookOpen, Star, Clock, Users, ArrowRight, Sparkles, Filter } from 'lucide-react';

interface CoursesPageProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ onNavigate }) => {
  const [filterLevel, setFilterLevel] = useState<string>('All');

  const levels = ['All', 'مبتدئ', 'متوسط', 'متقدم', 'شامل'];

  const filtered = filterLevel === 'All'
    ? COURSES_CATALOG
    : COURSES_CATALOG.filter(c => c.level === filterLevel);

  const handleSelectCourse = (course: CourseItem) => {
    playSound('click');
    if (course.id === 'future-perfect') {
      onNavigate('courses/grammar/future-perfect');
    } else {
      // preview message or navigate
      onNavigate('courses/grammar/future-perfect');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HINAWI COURSE CATALOG</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          دليل الكورسات والمسارات التعليمية 📚
        </h1>
        <p className="text-base text-[#b9b6d5] max-w-3xl leading-relaxed">
          اختر مسارك التعليمي المفضل لتطوير قواعدك، طلاقتك النطقية، ومراسلاتك المهنية باللغة الإنجليزية بأعلى معايير الإتقان.
        </p>
      </div>

      {/* Level Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        <span className="text-xs text-[#b9b6d5] flex items-center gap-1 ml-2 font-bold shrink-0">
          <Filter className="w-3.5 h-3.5" />
          تصفية حسب المستوى:
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
                ? 'bg-gradient-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black shadow-md'
                : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
            }`}
          >
            {lvl === 'All' ? 'جميع المستويات' : lvl}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => (
          <div
            key={course.id}
            onClick={() => handleSelectCourse(course)}
            className={`glass-panel p-6 sm:p-7 rounded-3xl border transition-all hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group ${
              course.isFlagship
                ? 'border-[#ffd166]/50 shadow-[0_0_30px_rgba(255,209,102,0.15)] ring-1 ring-[#ffd166]/30'
                : 'border-white/10 hover:border-[#41e7ff]/40'
            }`}
          >
            <div>
              {/* Top Tag & Level */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black ${
                  course.isFlagship
                    ? 'bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40'
                    : 'bg-white/10 text-[#41e7ff]'
                }`}>
                  {course.tag}
                </span>

                <div className="flex items-center gap-1 text-xs text-[#ffd166] font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{course.rating}</span>
                </div>
              </div>

              {/* Course Title & Icon */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl shrink-0 p-2 rounded-2xl bg-white/5 border border-white/10">
                  {course.icon}
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-[#41e7ff] transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <span className="en block text-xs font-bold text-[#b9b6d5] mt-1">
                    {course.titleEn}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#b9b6d5] leading-relaxed line-clamp-3 mb-6">
                {course.description}
              </p>
            </div>

            {/* Bottom Meta & Button */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#dedbf4]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#41e7ff]" />
                  <span>{course.lessonsCount} دروس</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#ffd166]" />
                  <span>{course.duration}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#c4ff55]" />
                  <span>{course.studentsCount} طالب</span>
                </span>
              </div>

              <button
                className={`w-full py-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  course.isFlagship
                    ? 'bg-gradient-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] hover:brightness-110 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <span>ابدأ دراسة الكورس</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
