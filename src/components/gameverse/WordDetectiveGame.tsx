// ==============================================================================
// HENGLISH ACADEMY - WORD DETECTIVE PLAYABLE MODULE
// Deductive linguistic mystery using progressive contextual clues
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateWordDetectiveRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { Search, KeyRound, Sparkles, Volume2, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';

interface WordDetectiveGameProps {
  onExit: () => void;
}

export const WordDetectiveGame: React.FC<WordDetectiveGameProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cluesRevealed, setCluesRevealed] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
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
    setSelectedWord(null);
    setIsAnswerChecked(false);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setCluesRevealed(1);
    setAnswersAudit([]);

    const qs = await generateWordDetectiveRound(5);
    setQuestions(qs);
    setIsLoading(false);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    loadRound();
  }, []);

  const handleNextClue = () => {
    playSound('click');
    setCluesRevealed(prev => Math.min(3, prev + 1));
  };

  const handleWordGuess = (word: string) => {
    if (isAnswerChecked) return;

    const currentQ = questions[currentIndex];
    setSelectedWord(word);
    setIsAnswerChecked(true);

    const isCorrect = word === currentQ.correctAnswer;
    const auditItem: AnswerAuditItem = {
      question: `لغز الكلمة السرية (المستوى: ${currentQ.cefr})`,
      isCorrect,
      userAnswer: word,
      correctAnswer: currentQ.correctAnswer,
      explanationAr: currentQ.explanationAr,
    };
    setAnswersAudit(prev => [...prev, auditItem]);

    if (isCorrect) {
      playSound('correct');
      // Fewer clues used = higher score
      const points = cluesRevealed === 1 ? 40 : cluesRevealed === 2 ? 25 : 15;
      setScore(s => s + points);
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
      setCluesRevealed(1);
      setSelectedWord(null);
      setIsAnswerChecked(false);
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
      gameId: 'word-detective',
      score,
      maxScore: totalQuestions * 40,
      accuracy,
      durationSeconds: duration,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer,
        timeSpentSeconds: 10,
      })),
      idempotencyKey: `wd_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
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
        <div className="w-12 h-12 border-3 border-[#ffd166] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-white font-bold">جاري تجهيز قضايا المحقق اللغوي...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <GameHud
        title="المحقق اللغوي 🕵️"
        category="المفردات (Vocabulary)"
        currentRound={currentIndex + 1}
        totalRounds={questions.length}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {currentQ && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-6 text-right animate-in fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-black text-[#ffd166] flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              <span>مستوى القضية: CEFR {currentQ.cefr}</span>
            </span>
            <span className="text-xs text-[#b9b6d5]">
              التلميحات المفعلة: {cluesRevealed} من 3
            </span>
          </div>

          {/* Clues Stack */}
          <div className="space-y-3">
            {currentQ.clues?.slice(0, cluesRevealed).map((clue, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#09091a] border border-[#ffd166]/20 text-xs sm:text-sm text-[#dedbf4] leading-relaxed flex items-start gap-3 shadow-md"
              >
                <span className="p-1.5 rounded-xl bg-[#ffd166]/15 text-[#ffd166] text-xs font-black shrink-0">
                  تلميح {idx + 1}
                </span>
                <p className="grow">{clue}</p>
              </div>
            ))}
          </div>

          {/* Request Next Clue Button */}
          {!isAnswerChecked && cluesRevealed < 3 && (
            <button
              onClick={handleNextClue}
              className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#ffd166] font-bold flex items-center gap-2 cursor-pointer transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>كشف التلميح التالي ({3 - cluesRevealed} متبقي)</span>
            </button>
          )}

          {/* Candidates Grid */}
          <div className="space-y-2 pt-2">
            <span className="text-xs text-[#b9b6d5] font-bold block">
              اختر الكلمة المطابقة للتلميحات:
            </span>
            <div className="grid grid-cols-2 gap-3">
              {currentQ.options?.map((opt, idx) => {
                const isSelected = selectedWord === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let style =
                  'bg-[#171632] hover:bg-[#ffd166]/10 border-white/15 text-white hover:border-[#ffd166]';

                if (isAnswerChecked) {
                  if (isCorrect) {
                    style = 'bg-emerald-500/25 border-emerald-500 text-emerald-300 font-black';
                  } else if (isSelected) {
                    style = 'bg-rose-500/25 border-rose-500 text-rose-300 font-black';
                  } else {
                    style = 'bg-white/5 border-white/5 text-white/30';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleWordGuess(opt)}
                    disabled={isAnswerChecked}
                    dir="ltr"
                    className={`p-4 rounded-2xl border text-base font-black font-['Outfit',sans-serif] transition-all cursor-pointer shadow-md active:scale-98 text-center ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation & Next */}
          {isAnswerChecked && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 pt-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#c4ff55]" />
                <span>الشرح والتحليل اللغوي:</span>
                <button
                  onClick={() => speakEnglish(currentQ.correctAnswer)}
                  className="p-1.5 rounded-lg bg-white/10 text-[#41e7ff] hover:bg-white/20 mr-auto cursor-pointer"
                  title="استمع للنطق"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[#dedbf4] leading-relaxed">
                {currentQ.explanationAr}
              </p>
              <button
                onClick={handleNextQuestion}
                className="w-full py-3 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#121124] font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110"
              >
                <span>القضية التالية</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Results Modal */}
      {gameResult && (
        <GameResultsModal
          title="المحقق اللغوي 🕵️"
          score={score}
          maxScore={questions.length * 40}
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

