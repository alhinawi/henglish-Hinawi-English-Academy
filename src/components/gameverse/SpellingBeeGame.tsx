// ==============================================================================
// HENGLISH ACADEMY - SPELLING BEE PLAYABLE MODULE
// Pronunciation-driven auditory spelling challenge with phonetic guidance
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateSpellingBeeRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { Volume2, Sparkles, CheckCircle2, ChevronRight, PenTool } from 'lucide-react';

interface SpellingBeeGameProps {
  onExit: () => void;
}

export const SpellingBeeGame: React.FC<SpellingBeeGameProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [answersAudit, setAnswersAudit] = useState<AnswerAuditItem[]>([]);
  const [gameResult, setGameResult] = useState<{
    xpAwarded: number;
    baseXp: number;
    speedBonus: number;
    accuracy: number;
  } | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const loadRound = async () => {
    setIsLoading(true);
    setGameResult(null);
    setInputVal('');
    setIsAnswerChecked(false);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setAnswersAudit([]);

    const qs = await generateSpellingBeeRound(5);
    setQuestions(qs);
    setIsLoading(false);
    startTimeRef.current = Date.now();

    // Auto speak first word after brief delay
    if (qs.length > 0 && qs[0].audioText) {
      setTimeout(() => speakEnglish(qs[0].audioText!), 500);
    }
  };

  useEffect(() => {
    loadRound();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAnswerChecked && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, isLoading, isAnswerChecked]);

  const handlePlayAudio = () => {
    const q = questions[currentIndex];
    if (q?.audioText) {
      playSound('click');
      speakEnglish(q.audioText);
    }
  };

  const handleSubmitSpelling = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isAnswerChecked || !inputVal.trim()) return;

    const q = questions[currentIndex];
    const userSpelling = inputVal.trim().toLowerCase();
    const correctSpelling = q.correctAnswer.toLowerCase();
    const match = userSpelling === correctSpelling;

    setIsCorrect(match);
    setIsAnswerChecked(true);

    const auditItem: AnswerAuditItem = {
      question: `تهجئة الكلمة: "${q.prompt}"`,
      isCorrect: match,
      userAnswer: userSpelling,
      correctAnswer: correctSpelling,
      explanationAr: q.explanationAr,
    };
    setAnswersAudit(prev => [...prev, auditItem]);

    if (match) {
      playSound('correct');
      setScore(s => s + 25);
      setStreak(s => s + 1);
    } else {
      playSound('wrong');
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    playSound('click');
    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setInputVal('');
      setIsAnswerChecked(false);
      setTimeout(() => {
        if (questions[nextIdx]?.audioText) speakEnglish(questions[nextIdx].audioText!);
      }, 300);
    } else {
      handleFinishGame();
    }
  };

  const handleFinishGame = async () => {
    const totalQuestions = questions.length || 5;
    const correctCount = answersAudit.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

    if (accuracy >= 80) fireCelebration();

    const res = await submitGameSession({
      gameId: 'spelling-bee',
      score,
      maxScore: totalQuestions * 25,
      accuracy,
      durationSeconds: duration,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer,
        timeSpentSeconds: 7,
      })),
      idempotencyKey: `sp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
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
        <div className="w-12 h-12 border-3 border-[#c4ff55] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-white font-bold">جاري تحميل اختبارات التهجئة الصوتية...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <GameHud
        title="تحدي التهجئة والإملاء ✍️"
        category="المفردات (Vocabulary)"
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
              المعنى بالعربية: ({currentQ.prompt})
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-[#b9b6d5]">
              استمع للنطق الصوتي واكتب الكلمة بالإنجليزية:
            </h3>
          </div>

          {/* Big Audio Play Button */}
          <div className="flex flex-col items-center justify-center gap-3">
            <button
              onClick={handlePlayAudio}
              className="w-24 h-24 rounded-3xl bg-linear-to-tr from-[#c4ff55]/20 to-[#41e7ff]/20 hover:from-[#c4ff55]/30 hover:to-[#41e7ff]/30 border-2 border-[#c4ff55]/40 text-[#c4ff55] flex items-center justify-center shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95 group"
            >
              <Volume2 className="w-10 h-10 group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-xs text-[#b9b6d5]">انقر للاستماع للنطق مجدداً 🔊</span>

            {currentQ.ipa && (
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-[#41e7ff] font-['Outfit',sans-serif] border border-white/10">
                الرموز الصوتية: {currentQ.ipa}
              </span>
            )}
          </div>

          {/* Spelling Input Form */}
          {!isAnswerChecked ? (
            <form onSubmit={handleSubmitSpelling} className="space-y-4 max-w-md mx-auto">
              <input
                ref={inputRef}
                type="text"
                dir="ltr"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Type the word here..."
                autoComplete="off"
                spellCheck="false"
                className="w-full py-4 px-6 rounded-2xl bg-[#09091a] border-2 border-white/20 focus:border-[#c4ff55] text-white text-center text-xl sm:text-2xl font-black font-['Outfit',sans-serif] tracking-widest outline-none transition-colors shadow-inner"
              />

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#c4ff55] to-[#41e7ff] text-[#0c0b20] font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>تأكيد الإملاء 🚀</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4 max-w-xl mx-auto">
              <div
                className={`p-5 rounded-2xl border text-xs sm:text-sm text-right space-y-2.5 ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>{isCorrect ? 'إملاء ممتاز ودقيق! ✅' : 'تهجئة غير صحيحة ❌'}</span>
                  <span className="text-xs text-white/50 font-normal">
                    {isCorrect ? '+25 XP' : '0 XP'}
                  </span>
                </div>

                <div className="pt-1">
                  <span className="text-white/60 block mb-0.5 text-xs">التهجئة الصحيحة:</span>
                  <p dir="ltr" className="font-['Outfit',sans-serif] font-black text-white text-lg">
                    {currentQ.correctAnswer}
                  </p>
                </div>

                {!isCorrect && (
                  <div>
                    <span className="text-rose-300/70 block mb-0.5 text-xs">ما كتبته:</span>
                    <p dir="ltr" className="font-['Outfit',sans-serif] text-rose-300 text-sm line-through">
                      {inputVal}
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
                <span>الكلمة التالية</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Results Modal */}
      {gameResult && (
        <GameResultsModal
          title="تحدي التهجئة والإملاء ✍️"
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

