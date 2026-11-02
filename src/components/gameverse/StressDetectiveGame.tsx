// ==============================================================================
// HENGLISH ACADEMY - STRESS DETECTIVE PLAYABLE MODULE
// Primary syllable stress recognition with phonetics & rhythmic audio guidance
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateStressDetectiveRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { Volume2, Music, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface StressDetectiveGameProps {
  onExit: () => void;
}

export const StressDetectiveGame: React.FC<StressDetectiveGameProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [answersAudit, setAnswersAudit] = useState<AnswerAuditItem[]>([]);
  const [gameResult, setGameResult] = useState<{
    xpAwarded: number;
    baseXp: number;
    speedBonus: number;
    accuracy: number;
  } | null>(null);

  const startTimeRef = useRef<number>(Date.now());

  const setupQuestion = (q: GameQuestion) => {
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  const loadRound = async () => {
    setIsLoading(true);
    setGameResult(null);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setAnswersAudit([]);

    const qs = await generateStressDetectiveRound(4);
    setQuestions(qs);
    if (qs.length > 0) setupQuestion(qs[0]);
    setIsLoading(false);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    loadRound();
  }, []);

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked || !isPlaying) return;

    setSelectedOption(option);
    setIsAnswerChecked(true);

    const currentQ = questions[currentIndex];
    const isPass = option === currentQ.correctAnswer;

    if (isPass) {
      playSound('correct');
      setScore(s => s + 20 + streak * 3);
      setStreak(st => st + 1);
    } else {
      playSound('wrong');
      setStreak(0);
    }

    setAnswersAudit(prev => [
      ...prev,
      {
        question: `النبرة في: ${currentQ.prompt}`,
        isCorrect: isPass,
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

    const totalQuestions = questions.length || 4;
    const correctCount = answersAudit.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

    if (accuracy >= 80) fireCelebration();

    const res = await submitGameSession({
      gameId: 'stress-detective',
      score,
      maxScore: totalQuestions * 25,
      accuracy,
      durationSeconds: duration,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer,
        timeSpentSeconds: 6,
      })),
      idempotencyKey: `sess_sd_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
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
        <div className="text-5xl animate-bounce">🎵</div>
        <h3 className="text-xl font-black text-white font-['Cairo',sans-serif]">
          جارٍ إعداد تحدي نبرة المقاطع الصوتية...
        </h3>
        <p className="text-xs text-[#b9b6d5]">تحديد المقطع المشدد في الكلمات الإنجليزية</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-right">
      <GameHud
        title="محقق نبرة المقاطع الصوتية 🎵"
        category="spelling"
        currentRound={currentIndex + 1}
        totalRounds={questions.length}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {currentQ && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl text-center">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-black text-[#ffd166] flex items-center gap-1">
              <Music className="w-4 h-4" /> Syllable Stress
            </span>
            <span className="text-xs text-[#41e7ff] font-bold">
              المستوى: {currentQ.cefr}
            </span>
          </div>

          <div className="space-y-3">
            <span className="text-xs text-[#b9b6d5] font-bold block">
              {currentQ.promptAr}
            </span>

            <div
              dir="ltr"
              className="p-6 rounded-2xl bg-[#09091a] border border-white/10 text-3xl sm:text-4xl font-black text-white font-['Outfit',sans-serif] tracking-wider"
            >
              {currentQ.prompt}
            </div>

            {currentQ.audioText && (
              <button
                onClick={() => speakEnglish(currentQ.audioText!)}
                className="py-2 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-[#41e7ff] text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>استمع للكلمة بوضوح 🔊</span>
              </button>
            )}
          </div>

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

          {isAnswerChecked && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in text-right">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ffd166]">القاعدة الصوتية:</span>
                <button
                  onClick={handleNext}
                  className="py-2 px-5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md"
                >
                  <span>الكلمة التالية</span>
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

      {gameResult && (
        <GameResultsModal
          title="محقق نبرة المقاطع الصوتية"
          score={score}
          maxScore={questions.length * 25}
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

