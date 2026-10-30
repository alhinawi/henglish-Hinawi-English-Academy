import React, { useState, useEffect } from 'react';
import { PageRoute, CEFRLevel } from '../types';
import { 
  generateAdaptivePlacementSession, 
  evaluateAssessmentSession, 
  AssessmentQuestion, 
  AssessmentResultBreakdown,
  QuestionSkill
} from '../data/massiveQuestionBank';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Volume2,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Compass,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExamsAssessmentPageProps {
  onNavigate: (route: PageRoute) => void;
  onRecordScore?: (quizId: string, score: number, total: number) => void;
}

const HISTORY_KEY = 'henglish_placement_history';

export const ExamsAssessmentPage: React.FC<ExamsAssessmentPageProps> = ({
  onNavigate,
  onRecordScore,
}) => {
  // Adaptive test session generated dynamically on mount or restart
  const [sessionQuestions, setSessionQuestions] = useState<AssessmentQuestion[]>(() => generateAdaptivePlacementSession());
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [testFinished, setTestFinished] = useState(false);
  const [result, setResult] = useState<AssessmentResultBreakdown | null>(null);
  const [pastAttempts, setPastAttempts] = useState<Array<{ date: string; level: CEFRLevel; score: number; total: number }>>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        setPastAttempts(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  const currentQ = sessionQuestions[currentQIdx];

  const handleSelectOption = (optIdx: number) => {
    playSound('click');
    setSelectedAnswers(prev => ({ ...prev, [currentQIdx]: optIdx }));
  };

  const handleNext = () => {
    playSound('click');
    if (currentQIdx < sessionQuestions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
    } else {
      // Evaluate test session dynamically
      const evalResult = evaluateAssessmentSession(sessionQuestions, selectedAnswers);
      setResult(evalResult);
      setTestFinished(true);
      playSound('correct');
      fireCelebration();

      if (onRecordScore) {
        onRecordScore('cefr-placement', evalResult.score, evalResult.total);
      }

      // Save to local test history
      const newAttempt = {
        date: new Date().toLocaleDateString('ar-EG'),
        level: evalResult.estimatedLevel,
        score: evalResult.score,
        total: evalResult.total,
      };
      const updated = [newAttempt, ...pastAttempts].slice(0, 5);
      setPastAttempts(updated);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  const handleRestart = () => {
    playSound('click');
    const newSession = generateAdaptivePlacementSession();
    setSessionQuestions(newSession);
    setCurrentQIdx(0);
    setSelectedAnswers({});
    setTestFinished(false);
    setResult(null);
  };

  return (
    <div className="space-y-10 pb-16 text-right">
      
      {/* Academy Hero Header */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-gradient-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 left-10 w-80 h-80 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/40 shadow-sm">
            <FileCheck2 className="w-4 h-4" />
            <span>ADAPTIVE CEFR PLACEMENT ENGINE • محرك تحديد المستوى التكيفي الذكي</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            اختبار تحديد المستوى والتقييم الأكاديمي 🎯
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            اختبار تشخيصي تكيفي غير ثابت يولد جلسات اختبار عشوائية فريدة في كل مرة، يقيم مهارات القواعد، المفردات، القراءة، والاستماع بدقة، ويحدد مستواك الموصى به من Pre-A1 إلى C1.
          </p>
        </div>
      </section>

      {/* 1. PLACEMENT TEST IN PROGRESS */}
      {!testFinished && currentQ ? (
        <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 max-w-3xl mx-auto shadow-2xl">
          {/* Header & Progress Indicator */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#b9b6d5]">
              <span>السؤال {currentQIdx + 1} من {sessionQuestions.length}</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#ffd166]/15 text-[#ffd166] font-mono">
                  {currentQ.level}
                </span>
                <span className="text-[#41e7ff] font-semibold">{currentQ.topic}</span>
              </div>
            </div>

            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-[#ffd166] via-[#41e7ff] to-[#c4ff55] h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQIdx + 1) / sessionQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Reading or Listening Passage Card if exists */}
          {currentQ.passage && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#ffd166]">
                <span>{currentQ.skill === 'listening' ? 'نص الاستماع الصوتي:' : 'القطعة القرائية القصيرة:'}</span>
                {currentQ.audioText && (
                  <button
                    onClick={() => {
                      playSound('click');
                      speakEnglish(currentQ.audioText!);
                    }}
                    className="p-1.5 rounded-lg bg-[#41e7ff]/20 text-[#41e7ff] hover:bg-[#41e7ff] hover:text-[#0c0b20] transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>تشغيل الصوت 🔊</span>
                  </button>
                )}
              </div>
              <p className="text-left font-sans text-sm sm:text-base text-[#dedbf4] leading-relaxed italic bg-black/30 p-3.5 rounded-xl border border-white/5">
                "{currentQ.passage}"
              </p>
            </div>
          )}

          {/* Question Prompt */}
          <div className="p-6 rounded-2xl bg-[#09091a] border border-white/10 space-y-3">
            {currentQ.promptAr && (
              <div className="text-xs font-bold text-[#ffd166]">{currentQ.promptAr}</div>
            )}
            <p className="text-left font-sans text-lg sm:text-xl font-black text-white leading-relaxed">
              {currentQ.prompt}
            </p>
            {/* Quick Audio for Prompt */}
            <button
              onClick={() => {
                playSound('click');
                speakEnglish(currentQ.prompt);
              }}
              className="inline-flex items-center gap-1 text-xs text-[#41e7ff] hover:underline cursor-pointer pt-1"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>استمع لنطق السؤال بالإنجليزية</span>
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQIdx] === optIdx;

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-xl border text-left font-sans text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#41e7ff]/25 to-[#ffd166]/15 border-[#41e7ff] text-white shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white/10 text-xs font-mono flex items-center justify-center text-[#ffd166]">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[#41e7ff]" />}
                </button>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-white/10">
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
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#ffd166] via-[#ff9c66] to-[#41e7ff] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer disabled:opacity-40 transition-all"
            >
              {currentQIdx < sessionQuestions.length - 1 ? 'السؤال التالي ➡️' : 'عرض التقرير والنتيجة 🏆'}
            </button>
          </div>
        </section>
      ) : (
        /* 2. COMPREHENSIVE RESULT REPORT & DIAGNOSTICS */
        result && (
          <section className="glass-panel rounded-3xl p-6 sm:p-12 border border-[#ffd166]/40 max-w-4xl mx-auto space-y-10 shadow-2xl">
            {/* Header Badge */}
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-3xl bg-[#ffd166]/20 border border-[#ffd166]/40 text-[#ffd166] shadow-xl">
                <Award className="w-12 h-12" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">تقرير تقييم المستوى الأكاديمي الشامل</h2>
              <p className="text-xs sm:text-sm text-[#b9b6d5]">تشخيص المهارات وفق الإطار الأوروبي الموحد (CEFR Framework)</p>
            </div>

            {/* Level Score Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#171632] via-[#0c0b20] to-[#1a1438] border border-white/15 max-w-lg mx-auto text-center space-y-3 shadow-2xl">
              <div className="text-xs text-[#b9b6d5] font-semibold">مستواك المقدر الحالي:</div>
              <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-[#ffd166] via-[#ff9c66] to-[#41e7ff] bg-clip-text text-transparent">
                {result.estimatedLevel}
              </div>
              <div className="text-base sm:text-lg font-bold text-white">{result.levelTitleAr}</div>
              <div className="text-xs text-[#c4ff55] font-mono font-bold">
                النتيجة الإجمالية: {result.score} من {result.total} ({result.overallPercentage}%)
              </div>
            </div>

            {/* Skill-by-Skill Breakdown Bars */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#41e7ff]" />
                <span>تحليل الأداء حسب المهارات اللغوية:</span>
              </h4>

              <div className="space-y-3">
                {(Object.entries(result.skillBreakdown) as [QuestionSkill, { score: number; total: number; percentage: number }][]).map(([skillKey, stat]) => (
                  <div key={skillKey} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-[#dedbf4] capitalize">{skillKey}</span>
                      <span className="text-[#ffd166] font-mono">{stat.percentage}% ({stat.score}/{stat.total})</span>
                    </div>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#ffd166] to-[#41e7ff] h-full rounded-full transition-all duration-500"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths and Weaknesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Check className="w-4 h-4" />
                  <span>نقاط القوة المتميزة:</span>
                </div>
                <ul className="text-xs text-[#dedbf4] space-y-1">
                  {result.strengths.map((str, idx) => (
                    <li key={idx}>• {str}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-5 rounded-2xl bg-[#ff4f9a]/10 border border-[#ff4f9a]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#ff8bb9]">
                  <TrendingUp className="w-4 h-4" />
                  <span>مجالات التطور المقترحة:</span>
                </div>
                <ul className="text-xs text-[#dedbf4] space-y-1">
                  {result.weaknesses.map((w, idx) => (
                    <li key={idx}>• {w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Personalized Recommended Learning Path */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#ffd166]/10 to-[#41e7ff]/10 border border-[#ffd166]/40 max-w-2xl mx-auto space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#ffd166]">
                <Compass className="w-4 h-4" />
                <span>المسار التعليمي المخصص لك الآن:</span>
              </div>
              <h4 className="text-lg font-black text-white">{result.recommendedPath.startAcademy}</h4>
              <p className="text-xs text-[#dedbf4]">
                يوصى بالبدء بدراسة الموضوعات التالية لتحقيق قفزة نوعية في مستواك:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {result.recommendedPath.focusTopics.map((top, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-white/10 text-[#ffd166] text-xs font-bold border border-white/10">
                    {top}
                  </span>
                ))}
              </div>
            </div>

            {/* Official Academic Disclaimer */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-2xl mx-auto flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#ffd166] shrink-0 mt-0.5" />
              <p className="text-xs text-[#b9b6d5] leading-relaxed">
                {result.disclaimerAr}
              </p>
            </div>

            {/* Past Attempts History */}
            {pastAttempts.length > 1 && (
              <div className="max-w-2xl mx-auto space-y-2 pt-2">
                <h5 className="text-xs font-bold text-[#b9b6d5]">سجل اختباراتك السابقة:</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pastAttempts.map((att, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center text-xs">
                      <div className="text-[#ffd166] font-bold">مستوى {att.level}</div>
                      <div className="text-[10px] text-[#b9b6d5]">{att.date} • {att.score}/{att.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate(result.recommendedPath.startRoute as PageRoute)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-xl cursor-pointer"
              >
                بدء المسار الموصى به الآن 🚀
              </button>

              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إجراء اختبار تكيفي جديد</span>
              </button>
            </div>
          </section>
        )
      )}

    </div>
  );
};
