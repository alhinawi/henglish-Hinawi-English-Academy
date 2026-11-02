// ==============================================================================
// HENGLISH ACADEMY - GRAMMAR TOWER PLAYABLE MODULE
// Ascending floor-by-floor grammar survival mode with lives & high-altitude bonus
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateGrammarTowerRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration } from '../../utils/audio';
import { Heart, Trophy, ArrowUp, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface GrammarTowerGameProps {
  onExit: () => void;
}

export const GrammarTowerGame: React.FC<GrammarTowerGameProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentFloor, setCurrentFloor] = useState(0); // 0 to 7 (8 floors)
  const [lives, setLives] = useState(3);
  const [highestFloor, setHighestFloor] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
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

  const loadRound = async () => {
    setIsLoading(true);
    setGameResult(null);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setScore(0);
    setStreak(0);
    setLives(3);
    setCurrentFloor(0);
    setHighestFloor(1);
    setAnswersAudit([]);

    const qs = await generateGrammarTowerRound(8);
    setQuestions(qs);
    setIsLoading(false);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    loadRound();
  }, []);

  const handleGameOver = async (won: boolean) => {
    setIsPlaying(false);

    const totalQuestions = questions.length || 8;
    const correctCount = answersAudit.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

    if (won || highestFloor >= 6) fireCelebration();

    const res = await submitGameSession({
      gameId: 'grammar-tower',
      score: score + (won ? 50 : 0),
      maxScore: totalQuestions * 20 + 50,
      accuracy,
      durationSeconds: duration,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer,
        timeSpentSeconds: 5,
      })),
      idempotencyKey: `sess_tower_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    });

    setGameResult({
      xpAwarded: res.xpAwarded + (won ? 25 : 0),
      baseXp: res.baseXp,
      speedBonus: res.speedBonus,
      accuracy: res.accuracy,
    });
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked || !isPlaying) return;

    setSelectedOption(option);
    setIsAnswerChecked(true);

    const currentQ = questions[currentFloor];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      playSound('correct');
      const floorBonus = (currentFloor + 1) * 10;
      setScore(s => s + 20 + floorBonus);
      setStreak(st => st + 1);
      setHighestFloor(h => Math.max(h, currentFloor + 2));
    } else {
      playSound('wrong');
      setStreak(0);
      setLives(l => {
        const nextLives = l - 1;
        if (nextLives <= 0) {
          setTimeout(() => handleGameOver(false), 1200);
        }
        return nextLives;
      });
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

  const handleNextFloor = () => {
    if (lives <= 0) return;

    if (currentFloor + 1 < questions.length) {
      setCurrentFloor(f => f + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      handleGameOver(true);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-panel p-12 rounded-3xl text-center space-y-4 max-w-xl mx-auto border border-white/10">
        <div className="text-5xl animate-bounce">🏰</div>
        <h3 className="text-xl font-black text-white font-['Cairo',sans-serif]">
          جارٍ بناء طوابق برج القواعد...
        </h3>
        <p className="text-xs text-[#b9b6d5]">تحديات تصاعدية الصعوبة من A1 حتى C2</p>
      </div>
    );
  }

  const currentQ = questions[currentFloor];

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-right">
      <GameHud
        title="برج القواعد المتصاعد 🏰"
        category="grammar"
        currentRound={currentFloor + 1}
        totalRounds={questions.length}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {/* Tower Progress & Lives Bar */}
      <div className="p-4 rounded-2xl bg-[#121124] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#b9b6d5]">القلوب المتبقية:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(i => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-colors ${
                  i <= lives
                    ? 'text-rose-500 fill-rose-500 animate-pulse'
                    : 'text-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Visual Floor Track */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {questions.map((q, idx) => {
            const isDone = idx < currentFloor;
            const isCurrent = idx === currentFloor;
            return (
              <div
                key={idx}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                  isCurrent
                    ? 'bg-[#ffd166] text-[#0c0b20] scale-110 shadow-lg'
                    : isDone
                    ? 'bg-[#c4ff55]/20 text-[#c4ff55] border border-[#c4ff55]/30'
                    : 'bg-white/5 text-white/30 border border-white/5'
                }`}
              >
                طابق {idx + 1} ({q.cefr})
              </div>
            );
          })}
        </div>
      </div>

      {currentQ && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏰</span>
              <div>
                <span className="text-xs font-black text-[#ffd166]">
                  الطابق {currentFloor + 1} من {questions.length} • المستوى ({currentQ.cefr})
                </span>
                <span className="text-white/40 text-xs block">{currentQ.promptAr}</span>
              </div>
            </div>

            <div className="px-3 py-1 rounded-full bg-[#41e7ff]/10 text-[#41e7ff] text-xs font-black border border-[#41e7ff]/30">
              +{20 + (currentFloor + 1) * 10} XP عند الإتقان
            </div>
          </div>

          <div
            dir="ltr"
            className="text-2xl sm:text-3xl font-black text-white font-['Outfit',sans-serif] leading-relaxed p-6 rounded-2xl bg-[#09091a]/80 border border-white/10 text-center"
          >
            {currentQ.prompt}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  disabled={isAnswerChecked || lives <= 0}
                  onClick={() => handleSelectOption(option)}
                  className={`p-4 rounded-2xl border text-base font-bold transition-all cursor-pointer text-center ${btnStyle} active:scale-98`}
                >
                  <span className="font-['Outfit',sans-serif]">{option}</span>
                </button>
              );
            })}
          </div>

          {isAnswerChecked && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ffd166]">تفسير القاعدة:</span>
                {lives > 0 && (
                  <button
                    onClick={handleNextFloor}
                    className="py-2 px-5 rounded-xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md transition-transform hover:scale-105"
                  >
                    <span>{currentFloor + 1 < questions.length ? 'اصعد للطابق التالي' : 'تتويج القمة! 🏆'}</span>
                    <ArrowUp className="w-4 h-4" />
                  </button>
                )}
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
          title="برج القواعد المتصاعد"
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

