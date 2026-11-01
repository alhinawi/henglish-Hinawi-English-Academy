// ==============================================================================
// HENGLISH ACADEMY - GAMEVERSE RESULTS MODAL & ANSWER AUDITOR
// ==============================================================================

import React, { useState } from 'react';
import { Trophy, Sparkles, CheckCircle2, XCircle, RotateCcw, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { playSound } from '../../utils/audio';

export interface AnswerAuditItem {
  question: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanationAr: string;
}

interface GameResultsModalProps {
  title: string;
  score: number;
  maxScore: number;
  accuracy: number;
  durationSeconds: number;
  xpAwarded: number;
  baseXp: number;
  speedBonus: number;
  answersSummary: AnswerAuditItem[];
  onReplay: () => void;
  onExit: () => void;
}

export const GameResultsModal: React.FC<GameResultsModalProps> = ({
  title,
  score,
  maxScore,
  accuracy,
  durationSeconds,
  xpAwarded,
  baseXp,
  speedBonus,
  answersSummary,
  onReplay,
  onExit,
}) => {
  const [showReview, setShowReview] = useState(false);

  const isExcellent = accuracy >= 80;
  const isGood = accuracy >= 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel p-6 sm:p-10 rounded-3xl max-w-lg w-full border border-white/10 text-center space-y-6 my-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Trophy & Badge */}
        <div className="relative inline-block">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-linear-to-tr from-[#ffd166]/20 via-[#41e7ff]/20 to-[#ff4f9a]/20 border border-white/20 flex items-center justify-center mx-auto shadow-2xl text-4xl sm:text-5xl animate-bounce">
            {isExcellent ? '🏆' : isGood ? '⭐' : '🎯'}
          </div>
          {isExcellent && (
            <span className="absolute -top-2 -right-2 p-1.5 rounded-full bg-[#ffd166] text-[#121124] shadow-md">
              <Sparkles className="w-4 h-4" />
            </span>
          )}
        </div>

        {/* Title & Celebration message */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Cairo',sans-serif]">
            {isExcellent ? 'أداء أسطوري ومتقن!' : isGood ? 'أداء رائع جداً!' : 'تدريب جيد! استمر في المحاولة'}
          </h2>
          <p className="text-xs sm:text-sm text-[#b9b6d5]">
            لقد أنهيت تحدي <span className="text-[#41e7ff] font-bold">"{title}"</span> بنجاح.
          </p>
        </div>

        {/* Verified XP Banner */}
        <div className="p-4 rounded-2xl bg-linear-to-r from-[#41e7ff]/15 via-[#c4ff55]/15 to-[#ffd166]/15 border border-[#41e7ff]/30 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#c4ff55] font-black">
            <ShieldCheck className="w-4 h-4" />
            <span>نقاط موثقة ومحسوبة من السيرفر</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-['Outfit',sans-serif]">
            +{xpAwarded} <span className="text-lg text-[#ffd166]">XP</span>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-[#b9b6d5] pt-1 border-t border-white/10">
            <span>النقاط الأساسية: <strong className="text-white">{baseXp} XP</strong></span>
            {speedBonus > 0 && (
              <span className="text-[#ffd166] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-[#ffd166]" /> مكافأة السرعة: +{speedBonus} XP
              </span>
            )}
          </div>
        </div>

        {/* Core Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs text-[#b9b6d5] block mb-1">النقاط</span>
            <span className="text-lg font-black text-white font-['Outfit',sans-serif]">{score}/{maxScore}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs text-[#b9b6d5] block mb-1">الدقة</span>
            <span className="text-lg font-black text-[#c4ff55] font-['Outfit',sans-serif]">{Math.round(accuracy)}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs text-[#b9b6d5] block mb-1">الوقت</span>
            <span className="text-lg font-black text-[#41e7ff] font-['Outfit',sans-serif]">{durationSeconds}s</span>
          </div>
        </div>

        {/* Review Answers Toggle */}
        <div className="space-y-3 text-right">
          <button
            onClick={() => {
              playSound('click');
              setShowReview(!showReview);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#dedbf4] flex items-center justify-between cursor-pointer transition-colors"
          >
            <span>مراجعة الأسئلة والإجابات النموذجية ({answersSummary.length})</span>
            <span className="text-[#ffd166]">{showReview ? 'إخفاء ▲' : 'عرض التفاصيل ▼'}</span>
          </button>

          {showReview && (
            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {answersSummary.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                    item.isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      {item.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                      سؤال {idx + 1}
                    </span>
                    <span className="text-white/60">{item.isCorrect ? 'صحيحة ✅' : 'خاطئة ❌'}</span>
                  </div>
                  <p className="text-white font-medium" dir="ltr">{item.question}</p>
                  {!item.isCorrect && (
                    <div className="text-[11px] text-rose-300">
                      إجابتك: <span className="line-through">{item.userAnswer}</span> • الصحيح: <strong>{item.correctAnswer}</strong>
                    </div>
                  )}
                  {item.explanationAr && (
                    <p className="text-[11px] text-[#b9b6d5] leading-relaxed pt-1 border-t border-white/10">
                      💡 {item.explanationAr}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              playSound('click');
              onReplay();
            }}
            className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة التحدي ↻</span>
          </button>

          <button
            onClick={() => {
              playSound('click');
              onExit();
            }}
            className="py-3 px-4 rounded-2xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition-all hover:scale-[1.02]"
          >
            <span>ساحة الألعاب</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
