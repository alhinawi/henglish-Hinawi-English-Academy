import { LESSON_PHOTOGRAPHY } from '../data/lessonPhotography';
import { LessonPhoto } from '../components/LessonPhotography';
import React from 'react';
import { PageRoute } from '../types';
import { FUTURE_PERFECT_LESSONS } from '../data/futurePerfectCourse';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { playSound } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  Sparkles, 
  Play, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface CourseOverviewPageProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  completionPercentage: number;
}

export const CourseOverviewPage: React.FC<CourseOverviewPageProps> = ({
  onNavigate,
  completionPercentage,
}) => {
  const { t } = useLanguage();
  const appText = useAppTextMap('futurePerfectCourse');
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#b9b6d5] font-semibold flex-wrap">
        <button 
          onClick={() => { playSound('click'); onNavigate('dashboard'); }} 
          className="hover:text-white transition-colors cursor-pointer"
        >
          {t('co.home')}
        </button>
        <span>/</span>
        <button 
          onClick={() => { playSound('click'); onNavigate('grammar'); }} 
          className="hover:text-white transition-colors cursor-pointer"
        >
          {t('co.breadcrumb')}
        </button>
        <span>/</span>
        <span className="text-[#ffd166] font-bold">{t('co.breadcrumbCourse')}</span>
      </nav>

      {/* Course Hero Banner */}
      <div className="glass-panel rounded-3xl p-8 sm:p-12 relative overflow-hidden border-2 border-[#ffd166]/30 shadow-[0_0_50px_rgba(255,209,102,0.1)]">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/40">
            <Sparkles className="w-4 h-4" />
            <span>{t('co.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl 2xl:text-6xl font-black text-white leading-tight">
            Master the Future Perfect Tense
          </h1>

          <p className="text-base sm:text-lg text-[#dedbf4] leading-relaxed">
            {t('co.heroBlurb')}
          </p>

          {/* Quick Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#b9b6d5] font-bold">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <BookOpen className="w-4 h-4 text-[#41e7ff]" />
              <span>{t('co.lessonsCount')}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <Clock className="w-4 h-4 text-[#ffd166]" />
              <span>{t('co.duration')}</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <Award className="w-4 h-4 text-[#c4ff55]" />
              <span>{t('co.progress')} {completionPercentage}%</span>
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => {
                playSound('click');
                onNavigate('lesson', 'lesson-1');
              }}
              className="px-8 py-4 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black text-base hover:brightness-110 shadow-xl transition-all hover:-translate-y-1 cursor-pointer flex items-center gap-2.5"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{t('co.startCta')}</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                onNavigate('practice');
              }}
              className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-base transition-colors cursor-pointer"
            >
              {t('co.practiceCta')}
            </button>
          </div>
        </div>
      </div>

      {/* Prerequisites & Outcomes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
          <h3 className="text-lg font-black text-[#ffd166] flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5" />
            <span>{t('co.prereqTitle')}</span>
          </h3>
          <ul className="space-y-3 text-sm text-[#dedbf4]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#c4ff55] mt-1 shrink-0" />
              <span>{t('co.prereq1')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#c4ff55] mt-1 shrink-0" />
              <span>{t('co.prereq2')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#c4ff55] mt-1 shrink-0" />
              <span>{t('co.prereq3')}</span>
            </li>
          </ul>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
          <h3 className="text-lg font-black text-[#41e7ff] flex items-center gap-2 mb-4">
            <Award className="w-5 h-5" />
            <span>{t('co.outcomesTitle')}</span>
          </h3>
          <ul className="space-y-3 text-sm text-[#dedbf4]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#41e7ff] mt-1 shrink-0" />
              <span>{t('co.outcome1')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#41e7ff] mt-1 shrink-0" />
              <span>{t('co.outcome2')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#41e7ff] mt-1 shrink-0" />
              <span>{t('co.outcome3')}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Complete 8-Lesson Syllabus Breakdown */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-black uppercase text-[#ffd166] tracking-widest block mb-1">
            COURSE SYLLABUS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {t('co.syllabusTitle')}
          </h2>
        </div>

        <div className="space-y-3.5">
          {FUTURE_PERFECT_LESSONS.map((lesson) => (
            <div
              key={lesson.id}
              className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-[#41e7ff]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <LessonPhoto photo={LESSON_PHOTOGRAPHY[lesson.id][0]} className="h-40 rounded-xl sm:h-28 sm:w-40 shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="en font-black text-xs text-[#ffd166]">
                    MODULE 0{lesson.number}
                  </span>
                  <span className="text-xs text-[#b9b6d5]">• {txText(appText, lesson.readTime)}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-[#c4ff55]">
                    {txText(appText, lesson.level)}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">
                  {txText(appText, lesson.title)}
                </h3>
                <p className="text-xs sm:text-sm text-[#b9b6d5]">
                  {txText(appText, lesson.description)}
                </p>
              </div>

              <button
                onClick={() => {
                  playSound('click');
                  onNavigate('lesson', lesson.id);
                }}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-[#41e7ff]/20 text-[#41e7ff] hover:text-white border border-[#41e7ff]/30 text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>{t('co.enterLesson')}</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
