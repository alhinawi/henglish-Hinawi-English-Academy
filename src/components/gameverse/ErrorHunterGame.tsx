// ==============================================================================
// HENGLISH ACADEMY - ERROR HUNTER PLAYABLE MODULE
// Grammatical error diagnosis and verification arena
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateErrorHunterRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { CheckCircle2, XCircle, ChevronRight, Target, Volume2 } from 'lucide-react';

interface ErrorHunterGameProps {
  onExit: () => void;
}

export const ErrorHunterGame: React.FC<ErrorHunterGameProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [userGuess, setUserGuess] = useState<'error' | 'correct' | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrectGuess, setIsCorrectGuess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    setUserGuess(null);
    setIsAnswerChecked(false);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setAnswersAudit([]);

    const qs = await generateErrorHunterRound(6);
    setQuestions(qs);
    setIsLoading(false);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    loadRound();
  }, []);

  const handleGuess = (hasError: boolean) => {
    if (isAnswerChecked) return;

    const currentQ = questions[currentIndex];
    const guessType = hasError ? 'error' : 'correct';
    setUserGuess(guessType);
    setIsAnswerChecked(true);

    const actualHasError = currentQ.hasError ?? false;
    const isSuccess = hasError === actualHasError;
    setIsCorrectGuess(isSuccess);

    const auditItem: AnswerAuditItem = {
      question: currentQ.prompt,
      isCorrect: isSuccess,
      userAnswer: hasError ? 'تحتوي على خطأ ❌' : 'سليمة تماماً ✅',
      correctAnswer: actualHasError ? 'تحتوي على خطأ قواعدي ❌' : 'سليمة تماماً ✅',
      explanationAr: currentQ.explanationAr,
    };
    setAnswersAudit(prev => [...prev, auditItem]);

    if (isSuccess) {
      playSound('correct');
      setScore(s => s + 20);
      setStreak(s => s + 1);
    } else {
      playSound('wrong');
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    playSound('click');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1);
      setUserGuess(null);
      setIsAnswerChecked(false);
    } else {
      handleFinishGame();
    }
  };

  const handleFinishGame = async () => {
    const totalQuestions = questions.length || 6;
    const correctCount = answersAudit.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

    if (accuracy >= 80) fireCelebration();

    const res = await submitGameSession({
      gameId: 'error-hunter',
      score,
      maxScore: totalQuestions * 20,
      accuracy,
      durationSeconds: duration,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer,
        timeSpentSeconds: 6,
      })),
      idempotencyKey: `eh_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    });

    setGameResult({
      xpAwarded: res.xpAwarded,
      baseXp: res.baseXp,
      speedBonus: res.speedBonus,
      accuracy,
    });
  };

  if (isLoading) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 border-3 border-[#ff4f9a] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-white font-bold">جاري فحص وتجهيز الحالات القواعدية...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <GameHud
        title="صائد الأخطاء القواعدية 🎯"
        category="القواعد (Grammar)"
        currentRound={currentIndex + 1}
        totalRounds={questions.length}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {currentQ && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 text-center animate-in fade-in">
          
          <div className="space-y-2">
            <span className="text-xs font-black text-[#ffd166] uppercase tracking-wider block">
              افحص الجملة بعين خبير القواعد:
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#b9b6d5]">
              هل تحتوي هذه الجملة على خطأ لغوي أو قواعدي؟
            </h3>
          </div>

          {/* Sentence Display Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#09091a] border border-white/10 space-y-3">
            <span
              dir="ltr"
              className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif] block leading-relaxed"
            >
              "{currentQ.prompt}"
            </span>
            <button
              onClick={() => speakEnglish(currentQ.prompt)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#41e7ff] cursor-pointer transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>استمع للنطق</span>
            </button>
          </div>

          {/* Choices: Error or Clean */}
          {!isAnswerChecked ? (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => handleGuess(true)}
                className="py-4 px-6 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] shadow-lg"
              >
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>نعم، بها خطأ ❌</span>
              </button>

              <button
                onClick={() => handleGuess(false)}
                className="py-4 px-6 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02] shadow-lg"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>سليمة تماماً ✅</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-w-xl mx-auto">
              <div
                className={`p-5 rounded-2xl border text-xs sm:text-sm text-right space-y-2.5 ${
                  isCorrectGuess
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>{isCorrectGuess ? 'تشخيص ممتاز ودقيق! ✅' : 'تشخيص غير صحيح ❌'}</span>
                  <span className="text-xs text-white/50 font-normal">
                    {currentQ.hasError ? 'الجملة بها خطأ' : 'الجملة كانت صحيحة'}
                  </span>
                </div>

                {currentQ.correction && (
                  <div className="pt-1">
                    <strong className="text-white block mb-0.5">التصحيح المقترح:</strong>
                    <p dir="ltr" className="font-['Outfit',sans-serif] font-bold text-white text-sm">
                      {currentQ.correction}
                    </p>
                  </div>
                )}

                <p className="text-white/80 pt-1 border-t border-white/10 leading-relaxed">
                  💡 {currentQ.explanationAr}
                </p>
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#121124] font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110"
              >
                <span>الحالة التالية</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Results Modal */}
      {gameResult && (
        <GameResultsModal
          title="صائد الأخطاء القواعدية 🎯"
          score={score}
          maxScore={questions.length * 20}
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

