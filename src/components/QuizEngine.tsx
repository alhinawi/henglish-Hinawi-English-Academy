import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { playSound, fireCelebration, speakEnglish } from '../utils/audio';
import { CheckCircle2, XCircle, RotateCcw, Volume2, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizEngineProps {
  questions: QuizQuestion[];
  quizTitle?: string;
  onComplete?: (score: number, total: number) => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  quizTitle = 'اختبار تفاعلي شامل',
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  const currentQ = questions[currentIndex];
  const isAnswered = selectedAnswers[currentIndex] !== undefined;
  const userAnswer = selectedAnswers[currentIndex];
  const isCorrect = isAnswered && userAnswer === currentQ.answer;

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return; // Prevent changing answer once selected

    const newAnswers = { ...selectedAnswers, [currentIndex]: optionIndex };
    setSelectedAnswers(newAnswers);
    setShowExplanation({ ...showExplanation, [currentIndex]: true });

    if (optionIndex === currentQ.answer) {
      playSound('correct');
    } else {
      playSound('wrong');
    }

    // Check if this was the last question answered
    const totalAnswered = Object.keys(newAnswers).length;
    if (totalAnswered === questions.length) {
      const finalScore = Object.entries(newAnswers).filter(
        ([idx, ans]) => ans === questions[Number(idx)].answer
      ).length;

      if (finalScore >= Math.ceil(questions.length * 0.75)) {
        fireCelebration();
      }
      onComplete?.(finalScore, questions.length);
    }
  };

  const handleReset = () => {
    playSound('click');
    setSelectedAnswers({});
    setShowExplanation({});
    setCurrentIndex(0);
  };

  const calculateScore = () => {
    return Object.entries(selectedAnswers).filter(
      ([idx, ans]) => ans === questions[Number(idx)].answer
    ).length;
  };

  const score = calculateScore();
  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/30">
              {currentQ.topic}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              currentQ.difficulty === 'beginner'
                ? 'bg-[#c4ff55]/15 text-[#c4ff55]'
                : currentQ.difficulty === 'intermediate'
                ? 'bg-[#ffd166]/15 text-[#ffd166]'
                : 'bg-[#ff4f9a]/15 text-[#ff4f9a]'
            }`}>
              {currentQ.difficulty === 'beginner' ? 'مبتدئ' : currentQ.difficulty === 'intermediate' ? 'متوسط' : 'متقدم'}
            </span>
          </div>
          <h3 className="text-xl font-black text-white">{quizTitle}</h3>
        </div>

        {/* Score & Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#09091a] border border-white/10">
            <Award className="w-4 h-4 text-[#ffd166]" />
            <span className="text-xs text-[#b9b6d5] font-bold">النتيجة:</span>
            <span className="text-sm font-black text-[#ffd166]">{score}</span>
            <span className="text-xs text-[#b9b6d5]">/ {questions.length}</span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#dedbf4] hover:text-white transition-colors cursor-pointer"
            title="إعادة تعيين الاختبار"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Counter Indicator */}
      <div className="flex items-center justify-between text-xs text-[#b9b6d5] mb-4">
        <span>السؤال {currentIndex + 1} من {questions.length}</span>
        <button
          onClick={() => speakEnglish(currentQ.question)}
          className="inline-flex items-center gap-1.5 text-[#41e7ff] hover:underline cursor-pointer font-bold"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع للسؤال (Audio)</span>
        </button>
      </div>

      {/* Progress Bars by Questions */}
      <div className="grid grid-cols-10 gap-1.5 mb-6">
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const answered = selectedAnswers[idx] !== undefined;
          const wasCorrect = answered && selectedAnswers[idx] === q.answer;

          return (
            <button
              key={q.id}
              onClick={() => {
                playSound('click');
                setCurrentIndex(idx);
              }}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                isCurrent
                  ? 'ring-2 ring-[#41e7ff] scale-110'
                  : ''
              } ${
                answered
                  ? wasCorrect
                    ? 'bg-[#c4ff55]'
                    : 'bg-[#ff4f9a]'
                  : 'bg-white/15 hover:bg-white/30'
              }`}
              title={`الانتقال للسؤال ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Question Box */}
      <div className="p-6 rounded-2xl bg-[#09091a]/90 border border-white/10 mb-6" dir="ltr" lang="en">
        <p className="en text-lg sm:text-xl font-extrabold text-white leading-relaxed">
          {currentQ.question}
        </p>
      </div>

      {/* 4 Interactive Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6" dir="ltr" lang="en">
        {currentQ.options.map((option, optIdx) => {
          const isSelected = userAnswer === optIdx;
          const isThisCorrect = optIdx === currentQ.answer;

          let btnStyles = 'bg-[#171632] hover:bg-[#201d43] border-white/10 text-[#f7f5ff] hover:border-[#41e7ff]/50';

          if (isAnswered) {
            if (isThisCorrect) {
              btnStyles = 'bg-[#c4ff55]/15 border-[#c4ff55] text-[#c4ff55] shadow-[0_0_15px_rgba(196,255,85,0.2)] font-black';
            } else if (isSelected) {
              btnStyles = 'bg-[#ff4f9a]/15 border-[#ff4f9a] text-[#ff4f9a] shadow-[0_0_15px_rgba(255,79,154,0.2)]';
            } else {
              btnStyles = 'opacity-40 bg-[#171632] border-white/5 text-[#b9b6d5]';
            }
          }

          return (
            <button
              key={optIdx}
              dir="ltr"
              lang="en"
              onClick={() => handleSelectOption(optIdx)}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${btnStyles}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                  {optionLetters[optIdx]}
                </span>
                <span className="en font-bold text-sm sm:text-base text-left">
                  {option}
                </span>
              </div>

              {isAnswered && isThisCorrect && (
                <CheckCircle2 className="w-5 h-5 text-[#c4ff55] shrink-0" />
              )}
              {isAnswered && isSelected && !isThisCorrect && (
                <XCircle className="w-5 h-5 text-[#ff4f9a] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Immediate Explanation Box */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-2xl border text-sm leading-relaxed mb-6 ${
              isCorrect
                ? 'bg-[#c4ff55]/10 border-[#c4ff55]/30 text-[#dedbf4]'
                : 'bg-[#ff4f9a]/10 border-[#ff4f9a]/30 text-[#dedbf4]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5 font-bold">
              {isCorrect ? (
                <span className="text-[#c4ff55]">✅ إجابة صحيحة وممتازة!</span>
              ) : (
                <span className="text-[#ff4f9a]">❌ مش دي الإجابة الصحيحة.</span>
              )}
            </div>
            <p className="text-sm">
              <strong className="text-white">التفسير بالمصري: </strong>
              {currentQ.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav: Prev / Next */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
        <button
          onClick={() => {
            playSound('click');
            setCurrentIndex(Math.max(0, currentIndex - 1));
          }}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-bold text-[#dedbf4] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span>السؤال السابق</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1));
          }}
          disabled={currentIndex === questions.length - 1}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#ff9c66] disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm font-black text-[#21132c] hover:brightness-110 shadow-md transition-all cursor-pointer"
        >
          <span>السؤال التالي</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
