// ==============================================================================
// Henglish Academy (HENGLISH 2.0) - COMPLETE GAMIFICATION & ARCADE ARENA
// Phase 6: 20+ Educational Games, Human vs AI Opponent Duel, Leaderboards, XP
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { SentenceBuilder } from '../components/SentenceBuilder';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { FLASHCARD_DECK } from '../data/flashcardsData';
import { VERB_TOOLKIT } from '../data/verbsData';
import { COMPLETE_GAMES_CATALOG, GameDefinition } from '../data/gamesCatalogData';
import { MISTAKE_HUNTER_CASES, MistakeHunterCase } from '../data/gamesData';
import { playSound, fireCelebration, speakEnglish } from '../utils/audio';
import {
  Gamepad2,
  Timer,
  Swords,
  Bot,
  User,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Zap,
  Star,
  Shield,
  Layers,
  ChevronLeft
} from 'lucide-react';

export const GamesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'builder' | 'blitz' | 'duel' | 'hunter' | 'cards'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // V3 Blitz State
  const [blitzRunning, setBlitzRunning] = useState(false);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzTime, setBlitzTime] = useState(25);
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const [blitzOptions, setBlitzOptions] = useState<string[]>([]);

  // AI Opponent Duel State
  const [duelRunning, setDuelRunning] = useState(false);
  const [duelRound, setDuelRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [duelQuestionIndex, setDuelQuestionIndex] = useState(0);
  const [duelAnswered, setDuelAnswered] = useState(false);
  const [aiAnswerStatus, setAiAnswerStatus] = useState<'thinking' | 'correct' | 'wrong'>('thinking');

  // Error Hunter State
  const [hunterIndex, setHunterIndex] = useState(0);
  const [hunterScore, setHunterScore] = useState(0);
  const [hunterFeedback, setHunterFeedback] = useState<string | null>(null);

  // V3 Blitz Logic
  const startBlitz = () => {
    playSound('click');
    setBlitzScore(0);
    setBlitzTime(25);
    setBlitzRunning(true);
    setupNextVerb();
  };

  const setupNextVerb = () => {
    const randomIdx = Math.floor(Math.random() * VERB_TOOLKIT.length);
    setCurrentVerbIndex(randomIdx);
    const target = VERB_TOOLKIT[randomIdx];

    const others = VERB_TOOLKIT.filter(v => v.v3 !== target.v3)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.v3);

    const allOpts = [...others, target.v3].sort(() => Math.random() - 0.5);
    setBlitzOptions(allOpts);
  };

  const handleBlitzChoice = (choice: string) => {
    if (!blitzRunning) return;
    const target = VERB_TOOLKIT[currentVerbIndex];

    if (choice === target.v3) {
      playSound('correct');
      setBlitzScore(prev => prev + 10);
      setupNextVerb();
    } else {
      playSound('wrong');
    }
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (blitzRunning && blitzTime > 0) {
      timer = setInterval(() => {
        setBlitzTime(t => t - 1);
      }, 1000);
    } else if (blitzRunning && blitzTime === 0) {
      setBlitzRunning(false);
      fireCelebration();
    }
    return () => clearInterval(timer);
  }, [blitzRunning, blitzTime]);

  // AI Duel Questions
  const duelQuestions = [
    {
      q: 'By next December, we _______ our new headquarters in New Cairo.',
      opts: ['will have opened', 'will open', 'opened', 'have open'],
      correct: 0,
      rule: 'Future Perfect Tense',
    },
    {
      q: 'If she _______ hard for the IELTS exam, she will get an 8.5 band score.',
      opts: ['studies', 'will study', 'studied', 'study'],
      correct: 0,
      rule: 'First Conditional',
    },
    {
      q: 'The ancient temple _______ by thousands of tourists every single week.',
      opts: ['is visited', 'was visit', 'is visit', 'visits'],
      correct: 0,
      rule: 'Present Simple Passive',
    },
    {
      q: 'Omar has been working at the AI laboratory _______ 2021.',
      opts: ['since', 'for', 'during', 'from'],
      correct: 0,
      rule: 'Present Perfect Since vs For',
    },
    {
      q: 'By the time the manager arrives, the team _______ the client proposal.',
      opts: ['will have finalized', 'finalizes', 'finalized', 'will finalize'],
      correct: 0,
      rule: 'Future Perfect with By the time',
    },
  ];

  const startAiDuel = () => {
    playSound('click');
    setPlayerScore(0);
    setAiScore(0);
    setDuelRound(1);
    setDuelQuestionIndex(0);
    setDuelAnswered(false);
    setAiAnswerStatus('thinking');
    setDuelRunning(true);
  };

  const handlePlayerDuelChoice = (choiceIdx: number) => {
    if (duelAnswered || !duelRunning) return;
    setDuelAnswered(true);

    const currentQ = duelQuestions[duelQuestionIndex];
    const isPlayerCorrect = choiceIdx === currentQ.correct;

    if (isPlayerCorrect) {
      playSound('correct');
      setPlayerScore(prev => prev + 20);
    } else {
      playSound('wrong');
    }

    // Simulate AI response based on difficulty
    const accuracyMap = { easy: 0.4, medium: 0.7, hard: 0.88, expert: 0.98 };
    const aiSuccess = Math.random() < accuracyMap[aiDifficulty];

    setTimeout(() => {
      if (aiSuccess) {
        setAiScore(prev => prev + 20);
        setAiAnswerStatus('correct');
      } else {
        setAiAnswerStatus('wrong');
      }

      // Next round or complete
      setTimeout(() => {
        if (duelQuestionIndex + 1 < duelQuestions.length) {
          setDuelQuestionIndex(prev => prev + 1);
          setDuelRound(prev => prev + 1);
          setDuelAnswered(false);
          setAiAnswerStatus('thinking');
        } else {
          setDuelRunning(false);
          fireCelebration();
        }
      }, 1800);
    }, 700);
  };

  // Error Hunter Logic
  const currentHunterCase = MISTAKE_HUNTER_CASES[hunterIndex] || MISTAKE_HUNTER_CASES[0];

  const handleHunterGuess = (guessedError: boolean) => {
    playSound('click');
    if (guessedError === currentHunterCase.hasError) {
      playSound('correct');
      setHunterScore(prev => prev + 15);
      setHunterFeedback(`✅ إجابة ممتازة! ${currentHunterCase.explanationAr}`);
      fireCelebration();
    } else {
      playSound('wrong');
      setHunterFeedback(`❌ إجابة غير دقيقة. ${currentHunterCase.explanationAr}`);
    }
  };

  const handleNextHunterCase = () => {
    playSound('click');
    setHunterFeedback(null);
    setHunterIndex(prev => (prev + 1) % MISTAKE_HUNTER_CASES.length);
  };

  const filteredCatalog = selectedCategory === 'all'
    ? COMPLETE_GAMES_CATALOG
    : COMPLETE_GAMES_CATALOG.filter(g => g.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-right">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/15 text-[#41e7ff] border border-[#41e7ff]/30">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>HENGLISH GAMIFICATION ARCADE • كبرى ساحات الألعاب التعليمية</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Cairo',sans-serif]">
          ألعاب القواعد والمفردات التفاعلية 🎮
        </h1>
        <p className="text-base text-[#b9b6d5] max-w-3xl leading-relaxed">
          أكثر من 20 لعبة تعليمية حقيقية! تدرب بمفردك في السباقات السريعة، أو ادخل في مبارزة مباشرة ضد الذكاء الاصطناعي (AI Opponent) بمستويات صعوبة متنوعة لجمع نقاط الـ XP.
        </p>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-white/10">
        <button
          onClick={() => { playSound('click'); setActiveTab('catalog'); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'catalog'
              ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>مكتبة الـ 20 لعبة (Games Catalog)</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('duel'); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'duel'
              ? 'bg-linear-to-r from-[#ff4f9a] to-[#9b7bff] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          <Swords className="w-4 h-4 text-[#ffd166]" />
          <span>مبارزة الذكاء الاصطناعي (AI Opponent Duel) ⚔️</span>
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('builder'); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeTab === 'builder'
              ? 'bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🧩 معمل تركيب الجمل
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('blitz'); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeTab === 'blitz'
              ? 'bg-linear-to-r from-[#c4ff55] to-[#41e7ff] text-[#0c0b20] shadow-lg font-black'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          ⚡ سباق التصريف V3
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('hunter'); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeTab === 'hunter'
              ? 'bg-linear-to-r from-[#ff4f9a] to-[#ffd166] text-[#0c0b20] shadow-lg font-black'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🎯 صائد الأخطاء (Error Hunter)
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('cards'); }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeTab === 'cards'
              ? 'bg-linear-to-r from-[#9b7bff] to-[#ff4f9a] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🃏 بطاقات الذاكرة
        </button>
      </div>

      {/* TAB 1: 20-GAME CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {['all', 'grammar', 'vocabulary', 'listening', 'spelling', 'challenge'].map(cat => (
              <button
                key={cat}
                onClick={() => { playSound('click'); setSelectedCategory(cat); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/5 text-[#b9b6d5] hover:text-white'
                }`}
              >
                {cat === 'all' && 'جميع الألعاب (20)'}
                {cat === 'grammar' && 'ألعاب القواعد 👑'}
                {cat === 'vocabulary' && 'ألعاب المفردات 📚'}
                {cat === 'listening' && 'ألعاب الاستماع 🎧'}
                {cat === 'spelling' && 'ألعاب التهجئة ✍️'}
                {cat === 'challenge' && 'تحديات كبرى 🌟'}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCatalog.map(game => (
              <div
                key={game.id}
                onClick={() => {
                  playSound('click');
                  if (game.id === 'sentence-builder') setActiveTab('builder');
                  else if (game.id === 'vocab-rush' || game.id === 'sentence-race') setActiveTab('blitz');
                  else if (game.id === 'error-hunter') setActiveTab('hunter');
                  else if (game.id === 'memory-match') setActiveTab('cards');
                  else setActiveTab('duel');
                }}
                className="p-5 rounded-3xl bg-linear-to-b from-[#171632] to-[#121128] border border-white/10 hover:border-[#ffd166]/40 transition-all cursor-pointer space-y-3 group hover:scale-[1.02] shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2 rounded-2xl bg-white/5">{game.icon}</span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#ffd166] bg-[#ffd166]/10 px-2.5 py-0.5 rounded-full">
                    <Zap className="w-3 h-3" />
                    <span>+{game.xpReward} XP</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-black text-white group-hover:text-[#ffd166] transition-colors">{game.titleAr}</h4>
                  <div className="text-xs font-mono text-[#b9b6d5]">{game.titleEn}</div>
                </div>

                <p className="text-xs text-[#dedbf4] leading-relaxed line-clamp-2">{game.descriptionAr}</p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[#41e7ff] font-mono font-bold">{game.cefrLevel}</span>
                  <span className="text-white font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    العب الآن <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AI OPPONENT DUEL ARENA */}
      {activeTab === 'duel' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 max-w-3xl mx-auto">
          
          {/* Header & Difficulty Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#ff4f9a]/20 text-[#ff8bb9] border border-[#ff4f9a]/30">
                <Swords className="w-3.5 h-3.5" />
                <span>HUMAN VS AI DUEL ARENA</span>
              </div>
              <h3 className="text-2xl font-black text-white mt-1">مبارزة الذكاء الاصطناعي التنافسية ⚔️</h3>
              <p className="text-xs text-[#b9b6d5]">
                تنافس في الوقت الفعلي ضد روبوت الذكاء الاصطناعي الذي يجيب بسرعة ودقة وفق مستوى الصعوبة المختار!
              </p>
            </div>

            {/* Difficulty Pills */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto">
              {(['easy', 'medium', 'hard', 'expert'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => { playSound('click'); setAiDifficulty(diff); }}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    aiDifficulty === diff
                      ? 'bg-linear-to-r from-[#ff4f9a] to-[#9b7bff] text-white shadow-md'
                      : 'text-[#b9b6d5] hover:text-white'
                  }`}
                >
                  {diff === 'easy' && 'سهل'}
                  {diff === 'medium' && 'متوسط'}
                  {diff === 'hard' && 'صعب'}
                  {diff === 'expert' && 'خبير 🤖'}
                </button>
              ))}
            </div>
          </div>

          {!duelRunning ? (
            <div className="py-8 text-center space-y-5">
              <div className="flex items-center justify-center gap-6 text-4xl">
                <span>👤 أنت</span>
                <span className="text-[#ffd166] font-black text-2xl">VS</span>
                <span>🤖 الروبوت ({aiDifficulty.toUpperCase()})</span>
              </div>
              <p className="text-sm text-[#dedbf4] max-w-md mx-auto leading-relaxed">
                5 جولات سريعة في قواعد الإنجليزية. كل إجابة صحيحة تمنحك 20 نقطة. هل تستطيع التفوق على الروبوت؟
              </p>
              <button
                onClick={startAiDuel}
                className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] via-[#ff9c66] to-[#ff4f9a] text-[#0c0b20] font-black text-base shadow-xl hover:scale-105 transition-all cursor-pointer"
              >
                بدء المبارزة الآن ⚔️
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Scoreboard */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#41e7ff]" />
                    <span className="text-xs font-bold text-white">نقاطك:</span>
                  </div>
                  <span className="text-2xl font-black text-[#c4ff55] font-mono">{playerScore}</span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-[#ff4f9a]" />
                    <span className="text-xs font-bold text-white">نقاط الروبوت:</span>
                  </div>
                  <span className="text-2xl font-black text-[#ff8bb9] font-mono">{aiScore}</span>
                </div>
              </div>

              {/* Round indicator */}
              <div className="flex items-center justify-between text-xs font-bold text-[#ffd166]">
                <span>الجولة {duelRound} من {duelQuestions.length}</span>
                <span>القاعدة: {duelQuestions[duelQuestionIndex].rule}</span>
              </div>

              {/* Question Text */}
              <div className="p-6 rounded-2xl bg-[#09091a] border border-white/10 text-center space-y-2">
                <span dir="ltr" className="text-lg sm:text-xl font-black text-white font-['Outfit',sans-serif] block">
                  "{duelQuestions[duelQuestionIndex].q}"
                </span>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {duelQuestions[duelQuestionIndex].opts.map((opt, idx) => {
                  const isCorrect = idx === duelQuestions[duelQuestionIndex].correct;
                  return (
                    <button
                      key={idx}
                      onClick={() => handlePlayerDuelChoice(idx)}
                      disabled={duelAnswered}
                      className={`p-4 rounded-2xl border font-black text-base transition-all cursor-pointer text-left font-['Outfit',sans-serif] ${
                        duelAnswered
                          ? isCorrect
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                            : 'bg-white/5 text-[#b9b6d5] border-white/10 opacity-60'
                          : 'bg-[#171632] hover:bg-[#41e7ff]/20 text-white border-white/10 hover:border-[#41e7ff]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* AI Status */}
              {duelAnswered && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center text-xs font-bold flex items-center justify-center gap-2">
                  <Bot className="w-4 h-4 text-[#ff4f9a]" />
                  <span>
                    {aiAnswerStatus === 'correct' ? '🤖 الروبوت أجاب إجابة صحيحة!' : '🤖 الروبوت أخطأ في هذه الجولة!'}
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* TAB 3: ERROR HUNTER */}
      {activeTab === 'hunter' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6 max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-black text-[#ffd166] flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              النقاط: {hunterScore} XP
            </span>
            <span className="text-xs text-[#b9b6d5]">الحالة {hunterIndex + 1} من {MISTAKE_HUNTER_CASES.length}</span>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-black text-white">صائد الأخطاء: هل تحتوي هذه الجملة على خطأ؟</h3>
            <p className="text-xs text-[#b9b6d5]">
              افحص الجملة بعين خبير القواعد؛ بعض الجمل قد تكون سليمة ١٠٠٪ لخداعك!
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#09091a] border border-white/10">
            <span dir="ltr" className="text-xl sm:text-2xl font-black text-white font-['Outfit',sans-serif] block">
              "{currentHunterCase.sentence}"
            </span>
          </div>

          {!hunterFeedback ? (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => handleHunterGuess(true)}
                className="py-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <XCircle className="w-5 h-5" />
                <span>نعم، بها خطأ ❌</span>
              </button>

              <button
                onClick={() => handleHunterGuess(false)}
                className="py-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-black text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>سليمة تماماً ✅</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10 text-xs sm:text-sm text-white leading-relaxed">
                {hunterFeedback}
              </div>
              <button
                onClick={handleNextHunterCase}
                className="px-6 py-3 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] font-black text-sm cursor-pointer hover:brightness-110 shadow-lg"
              >
                الحالة التالية ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SENTENCE BUILDER */}
      {activeTab === 'builder' && <SentenceBuilder />}

      {/* TAB 5: V3 BLITZ */}
      {activeTab === 'blitz' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 text-center space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#41e7ff] tracking-wider">
              V3 SPEED CHALLENGE
            </span>
            <div className="flex items-center gap-4 text-sm font-black">
              <span className="flex items-center gap-1 text-[#ffd166]">
                <Timer className="w-4 h-4" />
                <span>{blitzTime}s</span>
              </span>
              <span className="text-[#c4ff55]">النقاط: {blitzScore}</span>
            </div>
          </div>

          {!blitzRunning && blitzTime === 25 && (
            <div className="py-8 space-y-4">
              <span className="text-5xl block">⚡</span>
              <h3 className="text-2xl font-black text-white">تحدي الـ ٢٥ ثانية لتصريف الأفعال V3!</h3>
              <p className="text-sm text-[#b9b6d5] max-w-md mx-auto leading-relaxed">
                سيظهر لك فعل في المصدر (V1)، وعليك اختيار التصريف الثالث (V3) الصحيح بأسرع ما يمكن لتجميع أكبر قدر من النقاط.
              </p>
              <button
                onClick={startBlitz}
                className="px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-base hover:brightness-110 shadow-lg cursor-pointer transition-transform hover:scale-105"
              >
                ابدأ التحدي السريع الآن 🚀
              </button>
            </div>
          )}

          {!blitzRunning && blitzTime === 0 && (
            <div className="py-8 space-y-4">
              <span className="text-5xl block">🎉</span>
              <h3 className="text-2xl font-black text-white">انتهى الوقت! نتيجتك الرائعة:</h3>
              <div className="text-4xl font-black text-[#c4ff55]">{blitzScore} نقطة!</div>
              <button
                onClick={startBlitz}
                className="px-6 py-3 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer"
              >
                العب مرة ثانية ↻
              </button>
            </div>
          )}

          {blitzRunning && (
            <div className="py-6 space-y-6">
              <div className="p-6 rounded-2xl bg-[#09091a] border border-white/10">
                <span className="text-xs text-[#ffd166] font-bold block mb-1">
                  ما هو التصريف الثالث (V3) للفعل:
                </span>
                <span dir="ltr" className="en text-3xl sm:text-4xl font-black text-white font-['Outfit',sans-serif]">
                  {VERB_TOOLKIT[currentVerbIndex]?.v1.toUpperCase()}
                </span>
                <span className="text-xs text-[#b9b6d5] block mt-1">
                  ({VERB_TOOLKIT[currentVerbIndex]?.meaningAr})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {blitzOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBlitzChoice(opt)}
                    className="p-4 rounded-2xl bg-[#171632] hover:bg-[#41e7ff]/20 border border-white/15 hover:border-[#41e7ff] text-white hover:text-[#41e7ff] font-black text-lg transition-all cursor-pointer shadow-md active:scale-95 font-['Outfit',sans-serif]"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: FLASHCARDS */}
      {activeTab === 'cards' && <FlashcardDeck cards={FLASHCARD_DECK} />}

    </div>
  );
};
