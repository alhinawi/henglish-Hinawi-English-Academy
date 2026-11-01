// ==============================================================================
// HENGLISH ACADEMY - SENTENCE BUILDER PLAYABLE MODULE
// Interactive syntax construction engine fed by 5,500 authentic sentences
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateSentenceBuilderRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { Volume2, RotateCcw, CheckCircle2, ChevronRight, Puzzle } from 'lucide-react';

interface SentenceBuilderGameProps {
  onExit: () => void;
  cefrLevel?: string;
}

export const SentenceBuilderGame: React.FC<SentenceBuilderGameProps> = ({
  onExit,
  cefrLevel = 'all',
}) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [builtWords, setBuiltWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<{ id: string; word: string }[]>([]);
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

  const loadRound = async () => {
    setIsLoading(true);
    setGameResult(null);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setAnswersAudit([]);

    const qs = await generateSentenceBuilderRound(cefrLevel, 5);
    setQuestions(qs);
    setupQuestion(qs[0]);
    setIsLoading(false);
    startTimeRef.current = Date.now();
  };

  const setupQuestion = (q: GameQuestion) => {
    if (!q) return;
    setBuiltWords([]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    const words = q.scrambledTiles || [];
    setAvailableWords(words.map((w, i) => ({ id: `${w}-${i}-${Date.now()}`, word: w })));
  };

  useEffect(() => {
    loadRound();
  }, [cefrLevel]);

  const handleTileClick = (item: { id: string; word: string }) => {
    if (isAnswerChecked) return;
    playSound('click');
    setBuiltWords(prev => [...prev, item.word]);
    setAvailableWords(prev => prev.filter(w => w.id !== item.id));
  };

  const handleBuiltWordClick = (word: string, index: number) => {
    if (isAnswerChecked) return;
    playSound('click');
    setBuiltWords(prev => prev.filter((_, i) => i !== index));
    setAvailableWords(prev => [...prev, { id: `${word}-${Date.now()}`, word }]);
  };

  const handleReset = () => {
    playSound('click');
    const q = questions[currentIndex];
    setupQuestion(q);
  };

  const handleCheckSentence = () => {
    const q = questions[currentIndex];
    const userBuilt = builtWords.join(' ').trim();
    const correct = q.correctAnswer.trim();

    // Flexible comparison ignoring trailing punctuation & case
    const normalize = (s: string) => s.replace(/[.,!?;:]/g, '').toLowerCase().trim();
    const match = normalize(userBuilt) === normalize(correct);

    setIsCorrect(match);
    setIsAnswerChecked(true);

    const auditItem: AnswerAuditItem = {
      question: q.prompt,
      isCorrect: match,
      userAnswer: userBuilt || '(جملة فارغة)',
      correctAnswer: correct,
      explanationAr: q.explanationAr,
    };
    setAnswersAudit(prev => [...prev, auditItem]);

    if (match) {
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
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setupQuestion(questions[nextIdx]);
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
      gameId: 'sentence-builder',
      score,
      maxScore: totalQuestions * 20,
      accuracy,
      durationSeconds: duration,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer,
        timeSpentSeconds: 8,
      })),
      idempotencyKey: `sb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
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
        <div className="w-12 h-12 border-3 border-[#41e7ff] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-white font-bold">جاري تحميل معمل تركيب الجمل...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <GameHud
        title="معمل تركيب الجمل 🧩"
        category="القواعد (Grammar)"
        currentRound={currentIndex + 1}
        totalRounds={questions.length}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {currentQ && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 text-center animate-in fade-in">
          
          {/* Prompt (Arabic meaning) */}
          <div className="space-y-2">
            <span className="text-xs font-black text-[#ffd166] uppercase tracking-wider block">
              المعنى المطلوب تكوينه بالإنجليزية:
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-['Cairo',sans-serif]">
              "{currentQ.prompt}"
            </h3>
          </div>

          {/* Assembly Zone (Drop buffer) */}
          <div className="p-6 rounded-2xl bg-[#09091a] border-2 border-dashed border-white/15 min-h-[90px] flex flex-wrap items-center justify-center gap-2">
            {builtWords.length === 0 ? (
              <span className="text-xs sm:text-sm text-white/30 font-medium">
                انقر على الكلمات بالترتيب الصحيح لبناء الجملة هنا...
              </span>
            ) : (
              builtWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBuiltWordClick(word, idx)}
                  disabled={isAnswerChecked}
                  dir="ltr"
                  className="px-4 py-2.5 rounded-xl bg-linear-to-r from-[#41e7ff]/20 to-[#9b7bff]/20 hover:bg-rose-500/20 border border-[#41e7ff]/40 text-white font-black text-sm font-['Outfit',sans-serif] shadow-md transition-all cursor-pointer hover:border-rose-400"
                >
                  {word}
                </button>
              ))
            )}
          </div>

          {/* Available Word Tiles */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {availableWords.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleTileClick(item)}
                  disabled={isAnswerChecked}
                  dir="ltr"
                  className="px-4 py-3 rounded-xl bg-[#171632] hover:bg-white/10 border border-white/15 text-white font-black text-sm font-['Outfit',sans-serif] shadow-md transition-all cursor-pointer active:scale-95"
                >
                  {item.word}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {!isAnswerChecked ? (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة ضبط الكلمات</span>
              </button>

              <button
                onClick={handleCheckSentence}
                disabled={builtWords.length === 0}
                className="py-3 px-8 rounded-2xl bg-linear-to-r from-[#c4ff55] to-[#41e7ff] text-[#0c0b20] font-black text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>فحص صحة الجملة 🚀</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm text-right space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>{isCorrect ? 'تركيب سليم واحترافي! ✅' : 'الترتيب غير دقيق ❌'}</span>
                  <button
                    onClick={() => speakEnglish(currentQ.correctAnswer)}
                    className="p-1.5 rounded-lg bg-white/10 text-[#41e7ff] hover:bg-white/20 cursor-pointer"
                    title="استمع للجملة الصحيحة"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p dir="ltr" className="font-bold text-white font-['Outfit',sans-serif]">
                  "{currentQ.correctAnswer}."
                </p>
                <p className="text-white/80">{currentQ.explanationAr}</p>
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#121124] font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110"
              >
                <span>الجملة التالية</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Results Modal */}
      {gameResult && (
        <GameResultsModal
          title="معمل تركيب الجمل 🧩"
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
