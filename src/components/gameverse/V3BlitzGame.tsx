// ==============================================================================
// HENGLISH ACADEMY - V3 BLITZ PLAYABLE MODULE
// High-adrenaline 25-second irregular verbs third form (V3) challenge
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { VERB_TOOLKIT } from '../../data/verbsData';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { Zap, Volume2, Timer } from 'lucide-react';

interface V3BlitzGameProps {
  onExit: () => void;
}

export const V3BlitzGame: React.FC<V3BlitzGameProps> = ({ onExit }) => {
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(25);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answersAudit, setAnswersAudit] = useState<AnswerAuditItem[]>([]);
  const [gameResult, setGameResult] = useState<{
    xpAwarded: number;
    baseXp: number;
    speedBonus: number;
    accuracy: number;
  } | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextVerb = () => {
    const nextIdx = Math.floor(Math.random() * VERB_TOOLKIT.length);
    setCurrentVerbIndex(nextIdx);
    const target = VERB_TOOLKIT[nextIdx];

    // Pick 3 distractors
    const distractors = VERB_TOOLKIT
      .filter((_, idx) => idx !== nextIdx)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.v3);

    const opts = [target.v3, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(opts);
  };

  const startRound = () => {
    setScore(0);
    setStreak(0);
    setAnswersAudit([]);
    setGameResult(null);
    setTimeRemaining(25);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
    nextVerb();
  };

  useEffect(() => {
    startRound();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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

    const totalAnswered = answersAudit.length || 1;
    const correctCount = answersAudit.filter(a => a.isCorrect).length;
    const accuracy = (correctCount / totalAnswered) * 100;

    if (score >= 80) fireCelebration();

    const res = await submitGameSession({
      gameId: 'v3-blitz',
      score,
      maxScore: totalAnswered * 15,
      accuracy,
      durationSeconds: 25,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer,
        timeSpentSeconds: 2,
      })),
      idempotencyKey: `sess_v3_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    });

    setGameResult({
      xpAwarded: res.xpAwarded,
      baseXp: res.baseXp,
      speedBonus: res.speedBonus,
      accuracy: res.accuracy,
    });
  };

  const handleChoice = (selected: string) => {
    if (!isPlaying) return;

    const currentVerb = VERB_TOOLKIT[currentVerbIndex];
    const isCorrect = selected === currentVerb.v3;

    if (isCorrect) {
      playSound('correct');
      setScore(s => s + 10 + streak * 2);
      setStreak(st => st + 1);
    } else {
      playSound('wrong');
      setStreak(0);
    }

    setAnswersAudit(prev => [
      ...prev,
      {
        question: `V1: ${currentVerb.v1} (${currentVerb.meaningAr})`,
        isCorrect,
        userAnswer: selected,
        correctAnswer: currentVerb.v3,
        explanationAr: `الفعل ${currentVerb.v1} تصريفه الثاني ${currentVerb.v2} وتصريفه الثالث هو ${currentVerb.v3}.`,
      },
    ]);

    nextVerb();
  };

  const currentVerb = VERB_TOOLKIT[currentVerbIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-right">
      <GameHud
        title="سباق التصريف الثالث V3 ⚡"
        category="grammar"
        currentRound={answersAudit.length + 1}
        totalRounds={25}
        timeRemaining={timeRemaining}
        maxTime={25}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {currentVerb && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-6 shadow-2xl text-center">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-black text-[#ffd166] uppercase flex items-center gap-1">
              <Zap className="w-4 h-4 fill-[#ffd166]" /> V3 SPEED CHALLENGE
            </span>
            <button
              onClick={() => speakEnglish(currentVerb.v1)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#41e7ff] text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>نطق الفعل</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#09091a]/80 border border-white/10 space-y-2">
            <span className="text-xs text-[#ffd166] font-bold block">
              ما هو التصريف الثالث (V3) للفعل:
            </span>
            <span dir="ltr" className="text-4xl sm:text-5xl font-black text-white font-['Outfit',sans-serif] block">
              {currentVerb.v1.toUpperCase()}
            </span>
            <span className="text-xs sm:text-sm text-[#b9b6d5] block">
              ({currentVerb.meaningAr}) • الماضي (V2): <strong className="text-white">{currentVerb.v2}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {options.map((opt, idx) => (
              <button
                key={idx}
                disabled={!isPlaying}
                onClick={() => handleChoice(opt)}
                className="p-4 rounded-2xl bg-[#171632] hover:bg-[#41e7ff]/20 border border-white/15 hover:border-[#41e7ff] text-white hover:text-[#41e7ff] font-black text-xl transition-all cursor-pointer shadow-md active:scale-95 font-['Outfit',sans-serif]"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameResult && (
        <GameResultsModal
          title="سباق التصريف الثالث V3"
          score={score}
          maxScore={answersAudit.length * 15}
          accuracy={gameResult.accuracy}
          durationSeconds={25}
          xpAwarded={gameResult.xpAwarded}
          baseXp={gameResult.baseXp}
          speedBonus={gameResult.speedBonus}
          answersSummary={answersAudit}
          onReplay={startRound}
          onExit={onExit}
        />
      )}
    </div>
  );
};
