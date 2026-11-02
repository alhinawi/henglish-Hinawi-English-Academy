// ==============================================================================
// HENGLISH ACADEMY - PARAGRAPH BUILDER PLAYABLE MODULE
// Coherence & text organization game: reorder scrambled sentences into an essay
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateParagraphBuilderRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration } from '../../utils/audio';
import { ArrowUp, ArrowDown, ArrowRight, CheckCircle2, XCircle, FileText } from 'lucide-react';

interface ParagraphBuilderGameProps {
  onExit: () => void;
}

export const ParagraphBuilderGame: React.FC<ParagraphBuilderGameProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentences, setSentences] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answersAudit, setAnswersAudit] = useState<AnswerAuditItem[]>([]);
  const [gameResult, setGameResult] = useState<{
    xpAwarded: number;
    baseXp: number;
    speedBonus: number;
    accuracy: number;
  } | null>(null);

  const startTimeRef = useRef<number>(Date.now());

  const setupQuestion = (q: GameQuestion) => {
    setSentences([...(q.scrambledTiles || [])]);
    setIsAnswerChecked(false);
    setIsCorrect(false);
  };

  const loadRound = async () => {
    setIsLoading(true);
    setGameResult(null);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setAnswersAudit([]);

    const qs = await generateParagraphBuilderRound(2);
    setQuestions(qs);
    if (qs.length > 0) setupQuestion(qs[0]);
    setIsLoading(false);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    loadRound();
  }, []);

  const moveSentence = (index: number, direction: 'up' | 'down') => {
    if (isAnswerChecked) return;
    playSound('click');

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sentences.length) return;

    const copy = [...sentences];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setSentences(copy);
  };

  const handleCheckAnswer = () => {
    if (isAnswerChecked) return;

    const currentQ = questions[currentIndex];
    const userText = sentences.join('\n').trim();
    const correctText = (currentQ.orderedItems || []).join('\n').trim();
    const pass = userText === correctText;

    setIsAnswerChecked(true);
    setIsCorrect(pass);

    if (pass) {
      playSound('correct');
      setScore(s => s + 30 + streak * 5);
      setStreak(st => st + 1);
    } else {
      playSound('wrong');
      setStreak(0);
    }

    setAnswersAudit(prev => [
      ...prev,
      {
        question: currentQ.prompt,
        isCorrect: pass,
        userAnswer: userText,
        correctAnswer: correctText,
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

    const totalQuestions = questions.length || 2;
    const correctCount = answersAudit.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

    if (accuracy >= 80) fireCelebration();

    const res = await submitGameSession({
      gameId: 'paragraph-builder',
      score,
      maxScore: totalQuestions * 35,
      accuracy,
      durationSeconds: duration,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer.slice(0, 100),
        timeSpentSeconds: 15,
      })),
      idempotencyKey: `sess_pb_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
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
        <div className="text-5xl animate-bounce">📑</div>
        <h3 className="text-xl font-black text-white font-['Cairo',sans-serif]">
          جارٍ إعداد نصوص الفقرات المقالية...
        </h3>
        <p className="text-xs text-[#b9b6d5]">تحديات التماسك المنطقي وتدفق الأفكار</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-right">
      <GameHud
        title="معمار الفقرات والمقالات 📑"
        category="reading"
        currentRound={currentIndex + 1}
        totalRounds={questions.length}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {currentQ && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-black text-[#ffd166] flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> {currentQ.prompt}
            </span>
            <span className="text-xs text-[#41e7ff] font-bold">
              المستوى: {currentQ.cefr}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#b9b6d5] leading-relaxed">
            {currentQ.promptAr} استخدم أزرار الأسهم لتحريك كل جملة لأعلى أو لأسفل حتى تتكون الفقرة بالترتيب المنطقي السليم.
          </p>

          {/* Interactive Draggable / Movable Sentence Rows */}
          <div className="space-y-3">
            {sentences.map((sent, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === sentences.length - 1;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isAnswerChecked
                      ? isCorrect
                        ? 'border-[#c4ff55]/50 bg-[#c4ff55]/10'
                        : 'border-rose-500/50 bg-rose-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white/10 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p dir="ltr" className="text-sm sm:text-base font-semibold text-white font-['Outfit',sans-serif] leading-relaxed">
                      {sent}
                    </p>
                  </div>

                  {!isAnswerChecked && (
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        disabled={isFirst}
                        onClick={() => moveSentence(idx, 'up')}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-[#41e7ff]/20 text-[#41e7ff] disabled:opacity-20 cursor-pointer transition-colors"
                        title="تحريك لأعلى"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={isLast}
                        onClick={() => moveSentence(idx, 'down')}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-[#ffd166]/20 text-[#ffd166] disabled:opacity-20 cursor-pointer transition-colors"
                        title="تحريك لأسفل"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!isAnswerChecked ? (
            <button
              onClick={handleCheckAnswer}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] font-black text-base cursor-pointer shadow-lg hover:brightness-110 transition-all"
            >
              تحقق من الترتيب المنطقي للفقرة ✓
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black flex items-center gap-1.5 ${isCorrect ? 'text-[#c4ff55]' : 'text-rose-400'}`}>
                  {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {isCorrect ? 'ترتيب منطقي وسياقي ممتاز!' : 'الترتيب غير متطابق؛ راجع علامات الربط الزمنية'}
                </span>

                <button
                  onClick={handleNext}
                  className="py-2 px-5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md"
                >
                  <span>الفقرة التالية</span>
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
          title="معمار الفقرات والمقالات"
          score={score}
          maxScore={questions.length * 35}
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
