// ==============================================================================
// HENGLISH ACADEMY - DICTATION CHALLENGE PLAYABLE MODULE
// Real-time audio dictation listening with fuzzy string distance evaluation
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateDictationRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { Volume2, Mic, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface DictationChallengeGameProps {
  onExit: () => void;
}

// Compute simple Levenshtein-based similarity percentage
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const s2 = str2.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  if (s1 === s2) return 100;
  if (!s1.length || !s2.length) return 0;

  const words1 = s1.split(/\s+/);
  const words2 = s2.split(/\s+/);
  let matchingWords = 0;

  words1.forEach(w => {
    if (words2.includes(w)) matchingWords++;
  });

  const wordRatio = (matchingWords / Math.max(words1.length, words2.length)) * 100;
  return Math.round(wordRatio);
}

export const DictationChallengeGame: React.FC<DictationChallengeGameProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [similarity, setSimilarity] = useState(0);
  const [answersAudit, setAnswersAudit] = useState<AnswerAuditItem[]>([]);
  const [gameResult, setGameResult] = useState<{
    xpAwarded: number;
    baseXp: number;
    speedBonus: number;
    accuracy: number;
  } | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const setupQuestion = (q: GameQuestion) => {
    setUserInput('');
    setIsAnswerChecked(false);
    setSimilarity(0);
    // Play sentence audio automatically
    if (q.audioText) {
      setTimeout(() => speakEnglish(q.audioText!), 400);
    }
  };

  const loadRound = async () => {
    setIsLoading(true);
    setGameResult(null);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setAnswersAudit([]);

    const qs = await generateDictationRound(4);
    setQuestions(qs);
    if (qs.length > 0) setupQuestion(qs[0]);
    setIsLoading(false);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    loadRound();
  }, []);

  const handleCheck = () => {
    if (isAnswerChecked || !userInput.trim()) return;

    const currentQ = questions[currentIndex];
    const sim = calculateSimilarity(userInput, currentQ.correctAnswer);
    setSimilarity(sim);
    setIsAnswerChecked(true);

    const isPass = sim >= 75;
    if (isPass) {
      playSound('correct');
      const roundScore = Math.round(25 * (sim / 100));
      setScore(s => s + roundScore + streak * 3);
      setStreak(st => st + 1);
    } else {
      playSound('wrong');
      setStreak(0);
    }

    setAnswersAudit(prev => [
      ...prev,
      {
        question: `إملاء: ${currentQ.prompt}`,
        isCorrect: isPass,
        userAnswer: userInput,
        correctAnswer: currentQ.audioText || currentQ.correctAnswer,
        explanationAr: `نسبة التطابق: ${sim}% • النص المنطوق: "${currentQ.audioText}"`,
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

    if (accuracy >= 75) fireCelebration();

    const res = await submitGameSession({
      gameId: 'dictation-challenge',
      score,
      maxScore: totalQuestions * 30,
      accuracy,
      durationSeconds: duration,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer,
        timeSpentSeconds: 10,
      })),
      idempotencyKey: `sess_dc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
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
        <div className="text-5xl animate-bounce">🎙️</div>
        <h3 className="text-xl font-black text-white font-['Cairo',sans-serif]">
          جارٍ إعداد تحدي الإملاء السمعي...
        </h3>
        <p className="text-xs text-[#b9b6d5]">استمع واكتب بدقة إملائية عالية</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-right">
      <GameHud
        title="تحدي الإملاء السمعي المباشر 🎙️"
        category="listening"
        currentRound={currentIndex + 1}
        totalRounds={questions.length}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {currentQ && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl text-center">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-black text-[#ffd166]">
              المستوى: {currentQ.cefr}
            </span>
            <span className="text-xs text-[#b9b6d5]">
              {currentQ.prompt}
            </span>
          </div>

          <div className="py-4 space-y-3">
            <button
              onClick={() => speakEnglish(currentQ.audioText!)}
              className="py-4 px-8 rounded-2xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-[#0c0b20] font-black text-base inline-flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Volume2 className="w-5 h-5" />
              <span>استمع للجملة مرة أخرى 🔊</span>
            </button>
            <p className="text-xs text-[#b9b6d5]">
              استمع بانتباه واكتب الجملة الإنجليزية التي تسمعها كاملة
            </p>
          </div>

          {/* Text Input */}
          <div className="space-y-3">
            <input
              ref={inputRef}
              dir="ltr"
              type="text"
              disabled={isAnswerChecked}
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCheck();
              }}
              placeholder="Type what you hear here..."
              className="w-full py-4 px-5 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-white/30 font-['Outfit',sans-serif] text-lg font-bold text-center focus:border-[#41e7ff] outline-none transition-all shadow-inner"
            />

            {!isAnswerChecked ? (
              <button
                onClick={handleCheck}
                disabled={!userInput.trim()}
                className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] font-black text-base cursor-pointer shadow-lg hover:brightness-110 disabled:opacity-40 transition-all"
              >
                تحقق من دقة الإملاء ✓
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in text-right">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-black px-3 py-1 rounded-full ${
                        similarity >= 75
                          ? 'bg-[#c4ff55]/20 text-[#c4ff55] border border-[#c4ff55]/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      نسبة الدقة: {similarity}%
                    </span>
                  </div>

                  <button
                    onClick={handleNext}
                    className="py-2 px-5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md"
                  >
                    <span>الجملة التالية</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="text-white/60">
                    النص الصحيح المنطوق:{' '}
                    <strong dir="ltr" className="text-white font-['Outfit',sans-serif]">
                      "{currentQ.audioText}"
                    </strong>
                  </p>
                  <p className="text-[#ffd166]">
                    المعنى: ({currentQ.prompt})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {gameResult && (
        <GameResultsModal
          title="تحدي الإملاء السمعي المباشر"
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
