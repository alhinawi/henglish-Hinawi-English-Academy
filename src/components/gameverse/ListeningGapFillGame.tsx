// ==============================================================================
// HENGLISH ACADEMY - LISTENING GAP FILL PLAYABLE MODULE
// Audio playback + fill-in-the-blank single missing word challenge
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateListeningGapFillRound, GameQuestion } from '../../services/gameGenerationService';
import { submitGameSession } from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { Volume2, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface ListeningGapFillGameProps {
  onExit: () => void;
}

export const ListeningGapFillGame: React.FC<ListeningGapFillGameProps> = ({ onExit }) => {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
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
    setUserInput('');
    setIsAnswerChecked(false);
    setIsCorrect(false);
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

    const qs = await generateListeningGapFillRound(4);
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
    const cleanUser = userInput.trim().toLowerCase();
    const cleanCorrect = currentQ.correctAnswer.trim().toLowerCase();
    const pass = cleanUser === cleanCorrect;

    setIsAnswerChecked(true);
    setIsCorrect(pass);

    if (pass) {
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
        question: currentQ.prompt,
        isCorrect: pass,
        userAnswer: userInput,
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
      gameId: 'listening-gap-fill',
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
      idempotencyKey: `sess_lgf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
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
        <div className="text-5xl animate-bounce">📝</div>
        <h3 className="text-xl font-black text-white font-['Cairo',sans-serif]">
          جارٍ إعداد تحدي إكمال الفراغات السمعية...
        </h3>
        <p className="text-xs text-[#b9b6d5]">استمع واكتب الكلمة المحذوفة</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-right">
      <GameHud
        title="إكمال الفراغات السمعية 📝"
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
            <button
              onClick={() => speakEnglish(currentQ.audioText!)}
              className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-[#41e7ff]/20 text-[#41e7ff] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>استمع للجملة كاملة</span>
            </button>
          </div>

          <div className="space-y-3">
            <span className="text-xs text-[#b9b6d5] font-bold block">
              {currentQ.promptAr}
            </span>

            <div
              dir="ltr"
              className="p-5 rounded-2xl bg-[#09091a] border border-white/10 text-lg sm:text-xl font-black text-white font-['Outfit',sans-serif] leading-relaxed"
            >
              {currentQ.prompt}
            </div>
          </div>

          <div className="space-y-3">
            <input
              dir="ltr"
              type="text"
              disabled={isAnswerChecked}
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleCheck();
              }}
              placeholder="اكتب الكلمة الناقصة هنا بالإنجليزية..."
              className="w-full py-3.5 px-5 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-white/30 font-['Outfit',sans-serif] text-base font-bold text-center focus:border-[#41e7ff] outline-none transition-all shadow-inner"
            />

            {!isAnswerChecked ? (
              <button
                onClick={handleCheck}
                disabled={!userInput.trim()}
                className="w-full py-3 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] font-black text-base cursor-pointer shadow-lg hover:brightness-110 disabled:opacity-40 transition-all"
              >
                تحقق من الكلمة ✓
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in text-right">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="text-xs font-black text-[#c4ff55] flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> أحسنت! إجابة صحيحة تماماً
                      </span>
                    ) : (
                      <span className="text-xs font-black text-rose-400 flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> الكلمة الصحيحة هي: "{currentQ.correctAnswer}"
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    className="py-2 px-5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md"
                  >
                    <span>السؤال التالي</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#dedbf4] leading-relaxed">
                  {currentQ.explanationAr}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {gameResult && (
        <GameResultsModal
          title="إكمال الفراغات السمعية"
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

