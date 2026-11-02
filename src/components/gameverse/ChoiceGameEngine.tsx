// ==============================================================================
// HENGLISH ACADEMY - CHOICE GAME ENGINE (GAMEVERSE CORE)
// High-performance, accessible, responsive multi-choice game engine
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { Volume2, Sparkles, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export interface ChoiceGameEngineProps {
  gameId: string;
  title: string;
  titleAr: string;
  category: string;
  icon: string;
  badge: string;
  durationSeconds?: number;
  questionCount?: number;
  generator: (count: number) => Promise<GameQuestion[]>;
  onExit: () => void;
}

export const ChoiceGameEngine: React.FC<ChoiceGameEngineProps> = ({
  gameId,
  title,
  titleAr,
  category,
  icon,
  badge,
  durationSeconds = 45,
  questionCount = 6,
  generator,
  onExit,
}) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [answersAudit, setAnswersAudit] = useState<AnswerAuditItem[]>([]);
  const [gameResult, setGameResult] = useState<{
    xpAwarded: number;
    baseXp: number;
    speedBonus: number;
    accuracy: number;
  } | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadRound = async () => {
    setIsLoading(true);
    setGameResult(null);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setAnswersAudit([]);
    setTimeRemaining(durationSeconds);

    const qs = await generator(questionCount);
    setQuestions(qs);
    setIsLoading(false);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    loadRound();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameId]);

  // Timer loop
  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(t => {
          if (t <= 1) {
            handleGameOver();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeRemaining]);

  const handleGameOver = async () => {
    setIsPlaying(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const totalQuestions = questions.length || questionCount;
    const correctCount = answersAudit.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const duration = Math.min(
      durationSeconds,
      Math.round((Date.now() - startTimeRef.current) / 1000)
    );

    if (accuracy >= 80) fireCelebration();

    const res = await submitGameSession({
      gameId,
      score,
      maxScore: totalQuestions * 15,
      accuracy,
      durationSeconds: duration,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer,
        timeSpentSeconds: 3,
      })),
      idempotencyKey: `sess_${gameId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    });

    setGameResult({
      xpAwarded: res.xpAwarded,
      baseXp: res.baseXp,
      speedBonus: res.speedBonus,
      accuracy: res.accuracy,
    });
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked || !isPlaying) return;

    setSelectedOption(option);
    setIsAnswerChecked(true);

    const currentQ = questions[currentIndex];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      playSound('correct');
      setScore(s => s + 15 + streak * 3);
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

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      handleGameOver();
    }
  };

  if (isLoading) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-white/10">
        <div className="text-5xl animate-bounce">{icon}</div>
        <h3 className="text-xl font-black text-white font-['Cairo',sans-serif]">
          جارٍ إعداد تحدي {titleAr}...
        </h3>
        <p className="text-xs text-[#b9b6d5]">نستخرج الأسئلة الحية من قاعدة البيانات اللغوية المعتمدة</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-right">
      <GameHud
        title={title}
        category={category}
        currentRound={currentIndex + 1}
        totalRounds={questions.length}
        timeRemaining={timeRemaining}
        maxTime={durationSeconds}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {currentQ && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Header Tag */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/5 border border-white/10 text-xl">{icon}</span>
              <div>
                <span className="text-xs font-black text-[#ffd166] uppercase">{badge}</span>
                <span className="text-white/40 text-xs mr-2">• المستوى: {currentQ.cefr}</span>
              </div>
            </div>

            {currentQ.audioText && (
              <button
                onClick={() => speakEnglish(currentQ.audioText!)}
                className="p-2.5 rounded-xl bg-[#41e7ff]/10 hover:bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/30 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                title="استمع للنطق الصوتي"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">نطق صوتي</span>
              </button>
            )}
          </div>

          {/* Prompt */}
          <div className="space-y-3">
            {currentQ.promptAr && (
              <span className="text-xs sm:text-sm text-[#b9b6d5] font-bold block">
                {currentQ.promptAr}
              </span>
            )}

            <div
              dir="ltr"
              className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif] leading-relaxed p-4 rounded-2xl bg-[#09091a]/80 border border-white/10 text-center"
            >
              {currentQ.prompt}
            </div>

            {currentQ.ipa && (
              <div dir="ltr" className="text-center text-sm font-bold text-[#41e7ff] font-mono">
                {currentQ.ipa}
              </div>
            )}

            {currentQ.contextSentence && (
              <p dir="ltr" className="text-xs sm:text-sm text-[#b9b6d5] text-center italic">
                "{currentQ.contextSentence}"
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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
                  className={`p-4 rounded-2xl border text-base font-bold transition-all cursor-pointer flex items-center justify-between gap-3 text-right ${btnStyle} active:scale-98`}
                >
                  <span className="flex-1 font-['Outfit',sans-serif]">{option}</span>
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

          {/* Explanation Banner on Answered */}
          {isAnswerChecked && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ffd166]">الشرح اللغوي والسياق:</span>
                <button
                  onClick={handleNextQuestion}
                  className="py-2 px-5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-[#0c0b20] font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md transition-transform hover:scale-105"
                >
                  <span>السؤال التالي</span>
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

      {/* Results Modal */}
      {gameResult && (
        <GameResultsModal
          title={titleAr}
          score={score}
          maxScore={questions.length * 15}
          accuracy={gameResult.accuracy}
          durationSeconds={durationSeconds - timeRemaining}
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
