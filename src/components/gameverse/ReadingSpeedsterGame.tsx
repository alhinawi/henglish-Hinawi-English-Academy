// ==============================================================================
// HENGLISH ACADEMY - READING SPEEDSTER PLAYABLE MODULE
// Timed speed reading with hidden passage recall & comprehension challenge
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateReadingSpeedsterRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration } from '../../utils/audio';
import { BookOpen, Eye, EyeOff, Timer, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface ReadingSpeedsterGameProps {
  onExit: () => void;
}

export const ReadingSpeedsterGame: React.FC<ReadingSpeedsterGameProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [readingTime, setReadingTime] = useState(20);
  const [isReadingPhase, setIsReadingPhase] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answersAudit, setAnswersAudit] = useState<AnswerAuditItem[]>([]);
  const [gameResult, setGameResult] = useState<{
    xpAwarded: number;
    baseXp: number;
    speedBonus: number;
    accuracy: number;
  } | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setupQuestion = (q: GameQuestion) => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsReadingPhase(true);
    setReadingTime(20);
  };

  const loadRound = async () => {
    setIsLoading(true);
    setGameResult(null);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setAnswersAudit([]);

    const qs = await generateReadingSpeedsterRound(2);
    setQuestions(qs);
    if (qs.length > 0) setupQuestion(qs[0]);
    setIsLoading(false);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    loadRound();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Reading countdown timer
  useEffect(() => {
    if (isReadingPhase && readingTime > 0) {
      timerRef.current = setInterval(() => {
        setReadingTime(t => {
          if (t <= 1) {
            setIsReadingPhase(false);
            playSound('correct');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isReadingPhase, readingTime]);

  const handleFinishReadingEarly = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsReadingPhase(false);
    playSound('click');
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked || !isPlaying) return;

    setSelectedOption(option);
    setIsAnswerChecked(true);

    const currentQ = questions[currentIndex];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      playSound('correct');
      setScore(s => s + 25 + streak * 5);
      setStreak(st => st + 1);
    } else {
      playSound('wrong');
      setStreak(0);
    }

    setAnswersAudit(prev => [
      ...prev,
      {
        question: currentQ.prompt,
        isCorrect,
        userAnswer: option,
        correctAnswer: currentQ.correctAnswer,
        explanationAr: currentQ.explanationAr,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setupQuestion(questions[currentIndex + 1]);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = async () => {
    setIsPlaying(false);

    const totalQuestions = questions.length || 2;
    const correctCount = answersAudit.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

    if (accuracy >= 80) fireCelebration();

    const res = await submitGameSession({
      gameId: 'reading-speedster',
      score,
      maxScore: totalQuestions * 30,
      accuracy,
      durationSeconds: duration,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer,
        timeSpentSeconds: 15,
      })),
      idempotencyKey: `sess_rs_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    });

    setGameResult({
      xpAwarded: res.xpAwarded,
      baseXp: res.baseXp,
      speedBonus: res.speedBonus,
      accuracy: res.accuracy,
    });
  };

  if (isLoading) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-white/10">
        <div className="text-5xl animate-bounce">📖</div>
        <h3 className="text-xl font-black text-white font-['Cairo',sans-serif]">
          جارٍ إعداد نصوص القراءة السريعة...
        </h3>
        <p className="text-xs text-[#b9b6d5]">اختبار الذاكرة والاستيعاب بعد إخفاء النص</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-right">
      <GameHud
        title="محقق القراءة السريعة 📖"
        category="reading"
        currentRound={currentIndex + 1}
        totalRounds={questions.length}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {currentQ && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-black text-[#ffd166] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> القراءة السريعة • المستوى {currentQ.cefr}
            </span>

            {isReadingPhase ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs font-black text-[#41e7ff]">
                  <Timer className="w-4 h-4" /> وقت القراءة المتبقي: {readingTime}s
                </span>
                <button
                  onClick={handleFinishReadingEarly}
                  className="py-1 px-3 rounded-lg bg-white/10 hover:bg-[#41e7ff]/20 text-[#41e7ff] text-xs font-bold cursor-pointer"
                >
                  انتهيت، ابدأ السؤال! 🚀
                </button>
              </div>
            ) : (
              <span className="text-xs font-black text-[#c4ff55] flex items-center gap-1">
                <EyeOff className="w-4 h-4" /> تم إخفاء النص - اختبر ذاكرتك!
              </span>
            )}
          </div>

          {/* Passage Area */}
          {isReadingPhase ? (
            <div className="space-y-4">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold text-center">
                اقرأ النص واستوعب التفاصيل قبل أن يختفي النص بعد انتهاء العداد!
              </div>

              <div
                dir="ltr"
                className="p-6 rounded-2xl bg-[#09091a]/90 border border-white/10 text-base sm:text-lg font-medium text-white font-['Outfit',sans-serif] leading-relaxed select-none"
              >
                {currentQ.passage}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question */}
              <div className="space-y-2">
                <span className="text-xs text-[#ffd166] font-bold block">
                  سؤال الاستيعاب والاستنتاج:
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-relaxed">
                  {currentQ.prompt}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {currentQ.options?.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrectAnswer = option === currentQ.correctAnswer;

                  let btnStyle = 'bg-white/5 hover:bg-white/10 border-white/10 text-white';
                  if (isAnswerChecked) {
                    if (isCorrectAnswer) {
                      btnStyle = 'bg-[#c4ff55]/20 border-[#c4ff55] text-[#c4ff55] font-black shadow-lg';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-black';
                    } else {
                      btnStyle = 'bg-white/5 border-white/5 text-white/30';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectOption(option)}
                      className={`p-4 rounded-2xl border text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center justify-between gap-3 text-right ${btnStyle}`}
                    >
                      <span className="flex-1">{option}</span>
                      {isAnswerChecked && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-[#c4ff55] shrink-0" />
                      )}
                      {isAnswerChecked && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {isAnswerChecked && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#ffd166]">توضيح الإجابة الصحيحة:</span>
                    <button
                      onClick={handleNext}
                      className="py-2 px-5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-[#0c0b20] font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md"
                    >
                      <span>النص التالي</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#dedbf4] leading-relaxed">
                    {currentQ.explanationAr}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {gameResult && (
        <GameResultsModal
          title="محقق القراءة السريعة"
          score={score}
          maxScore={questions.length * 30}
          accuracy={gameResult.accuracy}
          durationSeconds={Math.round((Date.now() - startTimeRef.current) / 1000)}
          xpAwarded={gameResult.xpAwarded}
          baseXp={gameResult.baseXp}
          speedBonus={gameResult.speedBonus}
          answersSummary={answersAudit}
          onReplay={loadRound}
          onExit={onExit}
        />
      )}
    </div>
  );
};
