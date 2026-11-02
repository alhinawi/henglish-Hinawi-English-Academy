// ==============================================================================
// HENGLISH ACADEMY - PASSIVE VOICE CONVERTER PLAYABLE MODULE
// Interactive tile reordering converting active to passive voice sentences
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generatePassiveVoiceRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { ArrowRight, RotateCcw, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface PassiveVoiceConverterGameProps {
  onExit: () => void;
}

export const PassiveVoiceConverterGame: React.FC<PassiveVoiceConverterGameProps> = ({
  onExit,
}) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userTiles, setUserTiles] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<string[]>([]);
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
    setUserTiles([]);
    setAvailableTiles(q.scrambledTiles || []);
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

    const qs = await generatePassiveVoiceRound(5);
    setQuestions(qs);
    if (qs.length > 0) setupQuestion(qs[0]);
    setIsLoading(false);
    setIsPlaying(true);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    loadRound();
  }, []);

  const handleTileClick = (word: string, fromAvailable: boolean, index: number) => {
    if (isAnswerChecked) return;
    playSound('click');

    if (fromAvailable) {
      setAvailableTiles(prev => prev.filter((_, i) => i !== index));
      setUserTiles(prev => [...prev, word]);
    } else {
      setUserTiles(prev => prev.filter((_, i) => i !== index));
      setAvailableTiles(prev => [...prev, word]);
    }
  };

  const handleCheckAnswer = () => {
    if (isAnswerChecked) return;

    const currentQ = questions[currentIndex];
    const userSentence = userTiles.join(' ').trim();
    const correctClean = currentQ.correctAnswer.trim();
    const pass = userSentence.toLowerCase() === correctClean.toLowerCase();

    setIsAnswerChecked(true);
    setIsCorrect(pass);

    if (pass) {
      playSound('correct');
      setScore(s => s + 20 + streak * 4);
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
        userAnswer: userSentence || '(فارغ)',
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

  const handleResetTiles = () => {
    if (isAnswerChecked) return;
    playSound('click');
    const currentQ = questions[currentIndex];
    setUserTiles([]);
    setAvailableTiles(currentQ.scrambledTiles || []);
  };

  const handleGameOver = async () => {
    setIsPlaying(false);

    const totalQuestions = questions.length || 5;
    const correctCount = answersAudit.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

    if (accuracy >= 80) fireCelebration();

    const res = await submitGameSession({
      gameId: 'passive-converter',
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
      idempotencyKey: `sess_pvc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
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
        <div className="text-5xl animate-bounce">🔄</div>
        <h3 className="text-xl font-black text-white font-['Cairo',sans-serif]">
          جارٍ تحميل تحديات المبني للمجهول...
        </h3>
        <p className="text-xs text-[#b9b6d5]">إعادة ترتيب الجمل بدقة نحوية فائقة</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-right">
      <GameHud
        title="محول المبني للمجهول 🔄"
        category="grammar"
        currentRound={currentIndex + 1}
        totalRounds={questions.length}
        score={score}
        streak={streak}
        onExit={onExit}
      />

      {currentQ && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-black text-[#41e7ff] uppercase">
              Passive Voice Architecture
            </span>
            <span className="text-xs text-[#ffd166] font-bold">
              المستوى: {currentQ.cefr}
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-[#b9b6d5] font-bold block">{currentQ.promptAr}</span>
            <div dir="ltr" className="p-4 rounded-2xl bg-[#09091a]/80 border border-white/10 text-lg sm:text-xl font-black text-white font-['Outfit',sans-serif] text-center">
              {currentQ.prompt}
            </div>
          </div>

          {/* User Construction Dropzone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/60">بناء الجملة في المبني للمجهول (اضغط على الكلمات لإضافتها أو حذفها):</span>
              {userTiles.length > 0 && !isAnswerChecked && (
                <button
                  onClick={handleResetTiles}
                  className="text-xs text-[#b9b6d5] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> إعادة ضبط
                </button>
              )}
            </div>

            <div
              dir="ltr"
              className={`min-h-[70px] p-4 rounded-2xl border-2 border-dashed flex flex-wrap items-center gap-2 transition-all ${
                isAnswerChecked
                  ? isCorrect
                    ? 'border-[#c4ff55] bg-[#c4ff55]/10'
                    : 'border-rose-500 bg-rose-500/10'
                  : userTiles.length > 0
                  ? 'border-[#41e7ff] bg-white/5'
                  : 'border-white/20 bg-white/5'
              }`}
            >
              {userTiles.length === 0 ? (
                <span className="text-xs text-white/30 italic mx-auto">
                  اختر الكلمات بالترتيب لتكوين الجملة هنا...
                </span>
              ) : (
                userTiles.map((word, idx) => (
                  <button
                    key={idx}
                    disabled={isAnswerChecked}
                    onClick={() => handleTileClick(word, false, idx)}
                    className="py-2 px-3.5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-sm shadow-md cursor-pointer hover:brightness-110 active:scale-95 transition-all font-['Outfit',sans-serif]"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Available Word Tiles */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#ffd166]">الكلمات المتاحة:</span>
            <div dir="ltr" className="flex flex-wrap gap-2 min-h-[50px] p-3 rounded-2xl bg-[#09091a]/50 border border-white/5">
              {availableTiles.map((word, idx) => (
                <button
                  key={idx}
                  disabled={isAnswerChecked}
                  onClick={() => handleTileClick(word, true, idx)}
                  className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm shadow-sm cursor-pointer active:scale-95 transition-all font-['Outfit',sans-serif]"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          {!isAnswerChecked ? (
            <button
              onClick={handleCheckAnswer}
              disabled={userTiles.length === 0}
              className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] font-black text-base cursor-pointer shadow-lg hover:brightness-110 disabled:opacity-40 transition-all"
            >
              تحقق من صحة الترتيب ✓
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <span className="text-xs font-black text-[#c4ff55] flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> إجابة ممتازة وسليمة قواعدياً!
                    </span>
                  ) : (
                    <span className="text-xs font-black text-rose-400">
                      ترتيب غير دقيق؛ الجملة الصحيحة: "{currentQ.correctAnswer}"
                    </span>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="py-2 px-5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md"
                >
                  <span>التحدي التالي</span>
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
          title="محول المبني للمجهول"
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

