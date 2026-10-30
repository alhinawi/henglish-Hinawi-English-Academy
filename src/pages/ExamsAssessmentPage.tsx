import React, { useState } from 'react';
import { PageRoute, CEFRLevel } from '../types';
import { CEFR_PLACEMENT_QUESTIONS } from '../data/skillsAcademyData';
import { playSound, fireCelebration } from '../utils/audio';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface ExamsAssessmentPageProps {
  onNavigate: (route: PageRoute) => void;
  onRecordScore?: (quizId: string, score: number, total: number) => void;
}

export const ExamsAssessmentPage: React.FC<ExamsAssessmentPageProps> = ({
  onNavigate,
  onRecordScore,
}) => {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [testFinished, setTestFinished] = useState(false);

  const questions = CEFR_PLACEMENT_QUESTIONS;
  const currentQ = questions[currentQIdx];

  const handleSelectOption = (optIdx: number) => {
    playSound('click');
    setSelectedAnswers(prev => ({ ...prev, [currentQIdx]: optIdx }));
  };

  const handleNext = () => {
    playSound('click');
    if (currentQIdx < questions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
    } else {
      // Finish
      setTestFinished(true);
      playSound('correct');
      fireCelebration();

      // Calculate score
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.answer) correctCount++;
      });
      if (onRecordScore) {
        onRecordScore('cefr-placement', correctCount, questions.length);
      }
    }
  };

  const handleRestart = () => {
    playSound('click');
    setCurrentQIdx(0);
    setSelectedAnswers({});
    setTestFinished(false);
  };

  // Compute final CEFR level
  const calculateResult = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) score++;
    });

    const percent = Math.round((score / questions.length) * 100);
    let level: CEFRLevel = 'A1';
    let labelAr = 'مبتدئ (Beginner)';

    if (percent >= 90) {
      level = 'C1';
      labelAr = 'متقدم ومحترف (Advanced C1)';
    } else if (percent >= 70) {
      level = 'B2';
      labelAr = 'فوق متوسط (Upper Intermediate B2)';
    } else if (percent >= 50) {
      level = 'B1';
      labelAr = 'متوسط (Intermediate B1)';
    } else if (percent >= 30) {
      level = 'A2';
      labelAr = 'فوق المبتدئ (Elementary A2)';
    }

    return { score, total: questions.length, percent, level, labelAr };
  };

  const result = testFinished ? calculateResult() : null;

  return (
    <div className="space-y-10 pb-16 text-right">
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-gradient-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 left-10 w-80 h-80 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/40 shadow-sm">
            <FileCheck2 className="w-4 h-4" />
            <span>CEFR EXAMS & ASSESSMENTS • منظومة التقييم والاختبارات الدولية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            اختبارات تحديد المستوى والتقييم الأكاديمي 🎯
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            اختبار تشخيصي دقيق وفق الإطار الأوروبي المشترك للغات (CEFR) من A1 إلى C1، مع تقييمات موضوعية لقواعد الأزمنة والمفردات واستعدادات امتحانات IELTS وTOEFL.
          </p>
        </div>
      </section>

      {/* 1. PLACEMENT TEST CONTAINER */}
      {!testFinished ? (
        <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 max-w-3xl mx-auto">
          {/* Header & Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#b9b6d5]">
              <span>السؤال {currentQIdx + 1} من {questions.length}</span>
              <span className="text-[#ffd166]">مستوى السؤال المقدر: {currentQ.level}</span>
            </div>

            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-[#ffd166] to-[#41e7ff] h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="p-6 rounded-2xl bg-[#09091a] border border-white/10 space-y-4">
            <div className="text-xs font-bold text-[#41e7ff]">اختر الإجابة الصحيحة لإكمال الفراغ:</div>
            <p className="en text-lg sm:text-xl font-black text-white leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQIdx] === optIdx;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`en p-4 rounded-xl border text-sm sm:text-base font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#41e7ff]/20 border-[#41e7ff] text-[#41e7ff] font-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[#41e7ff]" />}
                </button>
              );
            })}
          </div>

          {/* Navigation Button */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => {
                if (currentQIdx > 0) setCurrentQIdx(prev => prev - 1);
              }}
              disabled={currentQIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#b9b6d5] hover:text-white disabled:opacity-30 cursor-pointer"
            >
              السؤال السابق
            </button>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQIdx] === undefined}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer disabled:opacity-40 transition-all"
            >
              {currentQIdx < questions.length - 1 ? 'السؤال التالي ➡️' : 'عرض النتيجة النهائية 🏆'}
            </button>
          </div>
        </section>
      ) : (
        /* TEST RESULTS REPORT */
        <section className="glass-panel rounded-3xl p-6 sm:p-12 border border-[#ffd166]/40 max-w-3xl mx-auto space-y-8 text-center shadow-2xl">
          <div className="inline-flex p-4 rounded-3xl bg-[#ffd166]/20 border border-[#ffd166]/40 text-[#ffd166]">
            <Award className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">تقرير تحديد المستوى الأكاديمي</h2>
            <p className="text-sm text-[#b9b6d5]">وفق معايير الإطار الأوروبي الموحد (CEFR Framework)</p>
          </div>

          {/* Score Badge */}
          <div className="p-6 rounded-3xl bg-black/40 border border-white/10 max-w-md mx-auto space-y-3">
            <div className="text-xs text-[#b9b6d5]">مستواك التشخيصي المعتمد:</div>
            <div className="text-4xl sm:text-5xl font-black text-[#ffd166]">
              {result?.level}
            </div>
            <div className="text-sm font-bold text-white">{result?.labelAr}</div>
            <div className="text-xs text-[#c4ff55] font-mono">
              النتيجة: {result?.score} من {result?.total} ({result?.percent}%)
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#dedbf4] max-w-xl mx-auto leading-relaxed">
            بناءً على إجاباتك، يوصى ببدء الدراسة من مسار قواعد <strong className="text-[#ffd166]">{result?.level}</strong>، مع التركيز على كورس المستقبل التام والمحادثة اليومية.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('grammar')}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer"
            >
              الانتقال لدروس أكاديمية الجرامر 🦅
            </button>

            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>
          </div>
        </section>
      )}

    </div>
  );
};
