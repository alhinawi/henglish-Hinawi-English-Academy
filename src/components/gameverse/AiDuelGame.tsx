// ==============================================================================
// HENGLISH ACADEMY - AI DUEL 1v1 BATTLE ARENA
// Deterministic skill-based AI bots with latency simulation and live scores
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { GameHud } from './GameHud';
import { GameResultsModal, AnswerAuditItem } from './GameResultsModal';
import { generateDuelQuestions, GameQuestion } from '../../services/gameGenerationService';
import {
  simulateAiBotTurn,
  BOT_PROFILES,
  BotDifficulty,
  submitGameSession,
} from '../../services/gameverseService';
import { playSound, fireCelebration, speakEnglish } from '../../utils/audio';
import { Swords, Bot, User, Sparkles, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

interface AiDuelGameProps {
  onExit: () => void;
}

export const AiDuelGame: React.FC<AiDuelGameProps> = ({ onExit }) => {
  const [difficulty, setDifficulty] = useState<BotDifficulty>('medium');
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [playerStreak, setPlayerStreak] = useState(0);
  const [aiStatus, setAiStatus] = useState<'thinking' | 'correct' | 'wrong'>('thinking');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inLobby, setInLobby] = useState(true);
  const [answersAudit, setAnswersAudit] = useState<AnswerAuditItem[]>([]);
  const [gameResult, setGameResult] = useState<{
    xpAwarded: number;
    baseXp: number;
    speedBonus: number;
    accuracy: number;
  } | null>(null);

  const startTimeRef = useRef<number>(Date.now());
  const botTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const botProfile = BOT_PROFILES[difficulty];

  const startMatch = async (chosenDifficulty: BotDifficulty) => {
    playSound('click');
    setDifficulty(chosenDifficulty);
    setIsLoading(true);
    setInLobby(false);
    setGameResult(null);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setPlayerScore(0);
    setAiScore(0);
    setPlayerStreak(0);
    setCurrentIndex(0);
    setAnswersAudit([]);
    setAiStatus('thinking');

    const qs = await generateDuelQuestions(8);
    setQuestions(qs);
    setIsLoading(false);
    startTimeRef.current = Date.now();

    // Trigger AI bot turn simulation for question 0
    triggerBotTurn(qs[0], chosenDifficulty);
  };

  const triggerBotTurn = (q: GameQuestion, diff: BotDifficulty) => {
    if (!q) return;
    setAiStatus('thinking');

    const botTurn = simulateAiBotTurn(diff, q.correctAnswer, q.options);

    if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);

    botTimeoutRef.current = setTimeout(() => {
      if (botTurn.isCorrect) {
        setAiStatus('correct');
        setAiScore(s => s + 15);
      } else {
        setAiStatus('wrong');
      }
    }, botTurn.delayMs);
  };

  useEffect(() => {
    return () => {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    };
  }, []);

  const handlePlayerChoice = (opt: string) => {
    if (isAnswerChecked) return;

    const currentQ = questions[currentIndex];
    setSelectedOption(opt);
    setIsAnswerChecked(true);

    const isCorrect = opt === currentQ.correctAnswer;
    const auditItem: AnswerAuditItem = {
      question: currentQ.prompt,
      isCorrect,
      userAnswer: opt,
      correctAnswer: currentQ.correctAnswer,
      explanationAr: currentQ.explanationAr,
    };
    setAnswersAudit(prev => [...prev, auditItem]);

    if (isCorrect) {
      playSound('correct');
      const points = 15;
      setPlayerScore(s => s + points);
      setPlayerStreak(s => s + 1);
    } else {
      playSound('wrong');
      setPlayerStreak(0);
    }
  };

  const handleNextRound = () => {
    playSound('click');
    if (currentIndex + 1 < questions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      triggerBotTurn(questions[nextIdx], difficulty);
    } else {
      handleMatchEnd();
    }
  };

  const handleMatchEnd = async () => {
    if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);

    const totalQuestions = questions.length || 8;
    const correctCount = answersAudit.filter(a => a.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);

    const playerWon = playerScore >= aiScore;
    if (playerWon) fireCelebration();

    const res = await submitGameSession({
      gameId: 'ai-duel',
      score: playerScore,
      maxScore: totalQuestions * 15,
      accuracy,
      durationSeconds: duration,
      answersSummary: answersAudit.map(a => ({
        questionId: a.question,
        isCorrect: a.isCorrect,
        userAnswer: a.userAnswer,
        timeSpentSeconds: 6,
      })),
      idempotencyKey: `duel_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    });

    setGameResult({
      xpAwarded: res.xpAwarded,
      baseXp: res.baseXp,
      speedBonus: res.speedBonus,
      accuracy,
    });
  };

  // 1. LOBBY SCREEN (Difficulty selection)
  if (inLobby) {
    return (
      <div className="glass-panel p-6 sm:p-10 rounded-3xl max-w-2xl mx-auto border border-white/10 text-center space-y-8 animate-in fade-in">
        <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-[#ff4f9a]/20 to-[#9b7bff]/20 border border-white/20 flex items-center justify-center mx-auto text-3xl shadow-xl">
          ⚔️
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white font-['Cairo',sans-serif]">
            مبارزة الذكاء الاصطناعي 1v1
          </h2>
          <p className="text-xs sm:text-sm text-[#b9b6d5] max-w-md mx-auto leading-relaxed">
            اختر مستوى خصم الذكاء الاصطناعي وادخل في معركة أسئلة بالوقت الحقيقي. كل روبوت يمتلك معدل دقة وسرعة تفكير حقيقية!
          </p>
        </div>

        {/* Bot Difficulties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-right">
          {(Object.keys(BOT_PROFILES) as BotDifficulty[]).map(diffKey => {
            const bot = BOT_PROFILES[diffKey];
            return (
              <div
                key={diffKey}
                onClick={() => startMatch(diffKey)}
                className="p-5 rounded-2xl bg-[#171632] hover:bg-white/10 border border-white/10 hover:border-[#41e7ff] transition-all cursor-pointer space-y-2 group hover:scale-[1.02] shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 rounded-xl bg-white/5">{bot.avatar}</span>
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-white/5 text-[#ffd166] border border-white/10">
                    {bot.badge}
                  </span>
                </div>
                <h4 className="text-base font-black text-white group-hover:text-[#41e7ff] transition-colors">
                  {bot.name}
                </h4>
                <div className="text-xs text-[#b9b6d5] flex items-center justify-between pt-2 border-t border-white/10">
                  <span>معدل الدقة: {Math.round(bot.accuracyRate * 100)}%</span>
                  <span>السرعة: {(bot.minDelayMs / 1000).toFixed(1)}s</span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onExit}
          className="text-xs text-[#b9b6d5] hover:text-white underline cursor-pointer"
        >
          العودة لساحة الألعاب
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center border border-white/10 space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 border-3 border-[#ff4f9a] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-white font-bold">جاري إعداد ساحة المبارزة المباشرة ضد {botProfile.name}...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Duel Arena Header (Versus Banner) */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/10 flex items-center justify-between gap-4">
        
        {/* Left: AI Bot */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-2xl shadow-md">
            {botProfile.avatar}
          </div>
          <div>
            <span className="text-[10px] text-rose-300 font-bold block">{botProfile.badge}</span>
            <h4 className="text-xs sm:text-sm font-black text-white">{botProfile.name}</h4>
            <div className="text-xs font-black text-rose-400 font-['Outfit',sans-serif]">
              {aiScore} XP
            </div>
          </div>
        </div>

        {/* Center: Status & Round */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-black text-[#ffd166]">
            <Swords className="w-3.5 h-3.5" />
            <span>جولة {currentIndex + 1} / {questions.length}</span>
          </div>
          <div className="text-[11px] text-[#b9b6d5]">
            {aiStatus === 'thinking' && 'الخصم يفكر الآن... ⏳'}
            {aiStatus === 'correct' && 'الخصم أجاب بشكل صحيح! ⚡'}
            {aiStatus === 'wrong' && 'الخصم أخطأ في الإجابة! ❌'}
          </div>
        </div>

        {/* Right: Player */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <span className="text-[10px] text-[#c4ff55] font-bold block">أنت (You)</span>
            <h4 className="text-xs sm:text-sm font-black text-white">المتعلم الماهر</h4>
            <div className="text-xs font-black text-[#c4ff55] font-['Outfit',sans-serif]">
              {playerScore} XP
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#c4ff55]/20 border border-[#c4ff55]/30 flex items-center justify-center text-2xl shadow-md">
            😎
          </div>
        </div>

      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/10 space-y-8 text-center animate-in fade-in">
          
          <div className="space-y-2">
            <span className="text-xs font-black text-[#ffd166] uppercase tracking-wider block">
              {currentQ.promptAr || 'اختر الإجابة الصحيحة:'}
            </span>
            <h3
              dir="ltr"
              className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif] leading-relaxed max-w-xl mx-auto"
            >
              "{currentQ.prompt}"
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto">
            {currentQ.options?.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = opt === currentQ.correctAnswer;

              let style =
                'bg-[#171632] hover:bg-white/10 border-white/15 text-white hover:border-[#ffd166]';

              if (isAnswerChecked) {
                if (isCorrectAnswer) {
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
                  onClick={() => handlePlayerChoice(opt)}
                  disabled={isAnswerChecked}
                  dir="ltr"
                  className={`p-4 rounded-2xl border text-sm sm:text-base font-bold transition-all cursor-pointer shadow-md active:scale-98 flex items-center justify-between font-['Outfit',sans-serif] ${style}`}
                >
                  <span>{opt}</span>
                  <span className="text-xs text-white/30 font-['Outfit',sans-serif]">{idx + 1}</span>
                </button>
              );
            })}
          </div>

          {/* Turn Feedback & Next */}
          {isAnswerChecked && (
            <div className="space-y-4 max-w-xl mx-auto pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-right space-y-2">
                <div className="flex items-center justify-between text-white font-bold">
                  <span>
                    {selectedOption === currentQ.correctAnswer ? 'إجابتك صحيحة! 🎯' : 'إجابتك خاطئة ❌'}
                  </span>
                  <span className="text-[#ffd166]">
                    {aiStatus === 'correct' ? 'الروبوت أجاب صح أيضاً' : 'الروبوت أخطأ في هذه الجولة'}
                  </span>
                </div>
                <p className="text-[#dedbf4] leading-relaxed">
                  💡 {currentQ.explanationAr}
                </p>
              </div>

              <button
                onClick={handleNextRound}
                className="w-full py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#121124] font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110"
              >
                <span>الجولة التالية</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Results Modal */}
      {gameResult && (
        <GameResultsModal
          title={`مبارزة 1v1 ضد ${botProfile.name}`}
          score={playerScore}
          maxScore={questions.length * 15}
          accuracy={gameResult.accuracy}
          durationSeconds={Math.round((Date.now() - startTimeRef.current) / 1000)}
          xpAwarded={gameResult.xpAwarded}
          baseXp={gameResult.baseXp}
          speedBonus={gameResult.speedBonus}
          answersSummary={answersAudit}
          onReplay={() => startMatch(difficulty)}
          onExit={onExit}
        />
      )}
    </div>
  );
};

