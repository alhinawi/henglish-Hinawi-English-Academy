// ==============================================================================
// HENGLISH ACADEMY - VOCABULARY RUSH PLAYABLE MODULE
// Fast-paced lexical recall against the clock with dual pronunciation
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateVocabularyRushRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { Volume2, Sparkles, Zap } from 'lucide-react';

interface VocabularyRushGameProps {
  onExit: () => void;
  cefrLevel?: string;
}

export const VocabularyRushGame: React.FC<VocabularyRushGameProps> = ({
  onExit,
  cefrLevel = 'all',
}) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
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

  // Initialize round
  const loadRound = async () => {
    setIsLoading(true);
    setGameResult(null);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setAnswersAudit([]);
    setTimeRemaining(30);

    const qs = await generateVocabularyRushRound(cefrLevel, 8);
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
  }, [cefrLevel]);

  // Overall Timer
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

    const totalQuestions = questions.length || 8;
    const correctCount = answersAudit.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const duration = Math.min(30, Math.round((Date.now() - startTimeRef.current) / 1000));

    if (accuracy >= 80) fireCelebration();

    // Submit session authoritatively
    const res = await submitGameSession({
      gameId: 'vocab-rush',
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
      idempotencyKey: `vr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    });

    setGameResult({
      xpAwarded: res.xpAwarded,
      baseXp: res.baseXp,
      speedBonus: res.speedBonus,
      accuracy,
    });
  };

  const handleOptionSelect = (option: string) => {
    if (!isPlaying || isAnswerChecked) return;

    const currentQ = questions[currentIndex];
    setSelectedOption(option);
    setIsAnswerChecked(true);

    const isCorrect = option === currentQ.correctAnswer;
    const auditItem: AnswerAuditItem = {
      question: currentQ.prompt,
      isCorrect,
      userAnswer: option,
      correctAnswer: currentQ.correctAnswer,
      explanationAr: currentQ.explanationAr,
    };
    setAnswersAudit(prev => [...prev, auditItem]);

    if (isCorrect) {
      playSound('correct');
      const streakMultiplier = streak >= 3 ? 1.5 : streak >= 1 ? 1.2 : 1.0;
      const points = Math.round(15 * streakMultiplier);
      setScore(s => s + points);
      setStreak(s => s + 1);
    } else {
      playSound('wrong');
      setStreak(0);
    }

    // Auto-advance after brief pause
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
      } else {
        handleGameOver();
      }
    }, 700);
  };

  if (isLoading) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 border-3 border-[#41e7ff] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-white font-bold">جاري تحميل تحدي سباق المفردات السريع...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <GameHud
        title="سباق المفردات السريع ⚡"
        category="المفردات (Vocabulary)"
        currentRound={currentIndex + 1}
        totalRounds={questions.length}
        timeRemaining={timeRemaining}
        maxTime={30}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {/* Main Challenge Card */}
      {currentQ && isPlaying && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 text-center space-y-8 animate-in fade-in duration-200">
          
          {/* Target Word */}
          <div className="space-y-3">
            <span className="text-xs font-black text-[#ffd166] uppercase tracking-wider block">
              {currentQ.promptAr || 'اختر المعنى العربي الصحيح:'}
            </span>

            <div className="inline-flex items-center gap-3">
              <span
                dir="ltr"
                className="text-4xl sm:text-5xl font-black text-white font-['Outfit',sans-serif] tracking-wide"
              >
                {currentQ.prompt}
              </span>
              <button
                onClick={() => {
                  playSound('click');
                  speakEnglish(currentQ.prompt);
                }}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-[#41e7ff]/20 text-[#41e7ff] border border-white/15 transition-all cursor-pointer hover:scale-105"
                title="استمع للنطق الصوتي"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {currentQ.ipa && (
              <span className="text-xs text-[#41e7ff] font-['Outfit',sans-serif] block">
                {currentQ.ipa}
              </span>
            )}

            {currentQ.contextSentence && (
              <p
                dir="ltr"
                className="text-xs sm:text-sm text-[#b9b6d5] max-w-lg mx-auto italic font-['Outfit',sans-serif]"
              >
                "{currentQ.contextSentence}"
              </p>
            )}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto">
            {currentQ.options?.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectAnswer = option === currentQ.correctAnswer;

              let btnStyle =
                'bg-[#171632] hover:bg-white/10 border-white/15 text-white hover:border-[#41e7ff]/50';

              if (isAnswerChecked) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-500/25 border-emerald-500 text-emerald-300 font-black shadow-lg shadow-emerald-500/10';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-500/25 border-rose-500 text-rose-300 font-black';
                } else {
                  btnStyle = 'bg-white/5 border-white/5 text-white/40 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isAnswerChecked}
                  className={`p-4 rounded-2xl border text-base font-bold transition-all cursor-pointer shadow-md active:scale-98 flex items-center justify-between ${btnStyle}`}
                >
                  <span className="text-sm sm:text-base font-['Cairo',sans-serif]">{option}</span>
                  <span className="text-xs text-white/30 font-['Outfit',sans-serif]">{idx + 1}</span>
                </button>
              );
            })}
          </div>

        </div>
      )}

      {/* Results Modal */}
      {gameResult && (
        <GameResultsModal
          title="سباق المفردات السريع ⚡"
          score={score}
          maxScore={questions.length * 15}
          accuracy={gameResult.accuracy}
          durationSeconds={Math.min(30, Math.round((Date.now() - startTimeRef.current) / 1000))}
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
