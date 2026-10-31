import React, { useState } from 'react';
import { COMPREHENSIVE_QUIZ_BANK } from '../data/quizzesData';
import { QuizEngine } from '../components/QuizEngine';
import { playSound } from '../utils/audio';
import { Sparkles, Filter } from 'lucide-react';

interface QuizzesPageProps {
  onRecordScore?: (quizId: string, score: number, total: number) => void;
}

export const QuizzesPage: React.FC<QuizzesPageProps> = ({ onRecordScore }) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filteredQuestions = filterDifficulty === 'all'
    ? COMPREHENSIVE_QUIZ_BANK
    : COMPREHENSIVE_QUIZ_BANK.filter(q => q.difficulty === filterDifficulty);

  const handleComplete = (score: number, total: number) => {
    onRecordScore?.(`quiz_${filterDifficulty}`, score, total);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OFFICIAL QUIZ REPOSITORY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          بنك الاختبارات والأسئلة الشاملة 🎮
        </h1>
        <p className="text-base text-[#b9b6d5] leading-relaxed">
          اختبر إتقانك لكل زوايا وتفاصيل المستقبل التام مع نتائج وتفسيرات فورية بالمصري والإنجليزي.
        </p>
      </div>

      {/* Difficulty Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        <span className="text-xs text-[#b9b6d5] flex items-center gap-1 ml-2 font-bold shrink-0">
          <Filter className="w-3.5 h-3.5" />
          مستوى الصعوبة:
        </span>
        {[
          { id: 'all', label: `جميع الأسئلة (${COMPREHENSIVE_QUIZ_BANK.length})` },
          { id: 'beginner', label: 'مبتدئ (Beginner)' },
          { id: 'intermediate', label: 'متوسط (Intermediate)' },
          { id: 'advanced', label: 'متقدم (Advanced)' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => {
              playSound('click');
              setFilterDifficulty(item.id);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              filterDifficulty === item.id
                ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black shadow-md'
                : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Quiz Engine */}
      <QuizEngine
        key={filterDifficulty}
        questions={filteredQuestions}
        quizTitle={`اختبار المستقبل التام — ${
          filterDifficulty === 'all'
            ? 'بنك الأسئلة الكامل'
            : filterDifficulty === 'beginner'
            ? 'مستوى المبتدئين'
            : filterDifficulty === 'intermediate'
            ? 'المستوى المتوسط'
            : 'المستوى المتقدم'
        }`}
        onComplete={handleComplete}
      />

    </div>
  );
};
