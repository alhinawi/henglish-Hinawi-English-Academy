// ==============================================================================
// HENGLISH ACADEMY (HENGLISH 2.0) - COMPLETE GAMEVERSE PLATFORM
// Real educational gaming arena, dynamic question generation, AI Opponent, and anti-cheat XP
// ==============================================================================

import React, { useState } from 'react';
import { GameVerseDashboard } from '../components/gameverse/GameVerseDashboard';
import { VocabularyRushGame } from '../components/gameverse/VocabularyRushGame';
import { WordDetectiveGame } from '../components/gameverse/WordDetectiveGame';
import { SentenceBuilderGame } from '../components/gameverse/SentenceBuilderGame';
import { ErrorHunterGame } from '../components/gameverse/ErrorHunterGame';
import { SpellingBeeGame } from '../components/gameverse/SpellingBeeGame';
import { AiDuelGame } from '../components/gameverse/AiDuelGame';
import { MultiplayerLobbyModal } from '../components/gameverse/MultiplayerLobbyModal';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { FLASHCARD_DECK } from '../data/flashcardsData';
import { VERB_TOOLKIT } from '../data/verbsData';
import { playSound, speakEnglish } from '../utils/audio';
import {
  Gamepad2,
  Swords,
  Layers,
  Sparkles,
  Timer,
  ChevronLeft,
  Users,
} from 'lucide-react';

export const GamesPage: React.FC = () => {
  const [activeView, setActiveView] = useState<
    | 'dashboard'
    | 'vocab-rush'
    | 'word-detective'
    | 'sentence-builder'
    | 'error-hunter'
    | 'spelling-bee'
    | 'ai-duel'
    | 'v3-blitz'
    | 'flashcards'
  >('dashboard');

  const [showMultiplayerModal, setShowMultiplayerModal] = useState<boolean>(false);

  // V3 Blitz State
  const [blitzRunning, setBlitzRunning] = useState(false);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzTime, setBlitzTime] = useState(25);
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const [blitzOptions, setBlitzOptions] = useState<string[]>([]);

  // V3 Blitz Handlers
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

  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (blitzRunning && blitzTime > 0) {
      timer = setInterval(() => {
        setBlitzTime(t => t - 1);
      }, 1000);
    } else if (blitzTime === 0) {
      setBlitzRunning(false);
    }
    return () => clearInterval(timer);
  }, [blitzRunning, blitzTime]);

  const handleLaunchGame = (gameId: string) => {
    if (gameId === 'vocab-rush' || gameId === 'synonym-hunter') {
      setActiveView('vocab-rush');
    } else if (gameId === 'word-detective') {
      setActiveView('word-detective');
    } else if (gameId === 'sentence-builder') {
      setActiveView('sentence-builder');
    } else if (gameId === 'error-hunter') {
      setActiveView('error-hunter');
    } else if (gameId === 'spelling-bee') {
      setActiveView('spelling-bee');
    } else if (gameId === 'ai-duel') {
      setActiveView('ai-duel');
    } else if (gameId === 'v3-blitz') {
      setActiveView('v3-blitz');
    } else if (gameId === 'memory-match' || gameId === 'cards') {
      setActiveView('flashcards');
    } else {
      // Default to AI duel or vocab rush
      setActiveView('vocab-rush');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      
      {/* Primary Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/15 text-[#41e7ff] border border-[#41e7ff]/30">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>HENGLISH GAMEVERSE • كبرى ساحات الألعاب التعليمية الموثقة</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Cairo',sans-serif]">
          ساحة الألعاب والمبارزات اللغوية 🎮
        </h1>
        <p className="text-sm sm:text-base text-[#b9b6d5] max-w-3xl leading-relaxed">
          ألعاب تفاعلية حقيقية معتمدة على 55,000 كلمة و 10,000 تعبير و 5,500 جملة. تدرّب بالسرعة القصوى، أو ادخل في مواجهة 1v1 ضد الذكاء الاصطناعي، أو أنشئ غرفة تحدٍ جماعية بالوقت الحقيقي!
        </p>
      </div>

      {/* Quick Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-white/10">
        <button
          onClick={() => {
            playSound('click');
            setActiveView('dashboard');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeView === 'dashboard'
              ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>الساحة الرئيسية (GameVerse Arena)</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('ai-duel');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeView === 'ai-duel'
              ? 'bg-linear-to-r from-[#ff4f9a] to-[#9b7bff] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          <Swords className="w-4 h-4 text-[#ffd166]" />
          <span>مبارزة الذكاء الاصطناعي 1v1 ⚔️</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('vocab-rush');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'vocab-rush'
              ? 'bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          ⚡ سباق المفردات
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('sentence-builder');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'sentence-builder'
              ? 'bg-linear-to-r from-[#c4ff55] to-[#41e7ff] text-[#0c0b20] shadow-lg font-black'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🧩 معمل تركيب الجمل
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('error-hunter');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'error-hunter'
              ? 'bg-linear-to-r from-[#ff4f9a] to-[#ffd166] text-[#0c0b20] shadow-lg font-black'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🎯 صائد الأخطاء
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('spelling-bee');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'spelling-bee'
              ? 'bg-linear-to-r from-[#ffd166] to-[#c4ff55] text-[#0c0b20] shadow-lg font-black'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          ✍️ تحدي التهجئة
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('word-detective');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'word-detective'
              ? 'bg-linear-to-r from-[#9b7bff] to-[#41e7ff] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🕵️ المحقق اللغوي
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('flashcards');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'flashcards'
              ? 'bg-linear-to-r from-[#9b7bff] to-[#ff4f9a] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🃏 بطاقات الذاكرة
        </button>
      </div>

      {/* VIEW: MAIN DASHBOARD */}
      {activeView === 'dashboard' && (
        <GameVerseDashboard
          onSelectGame={handleLaunchGame}
          onOpenMultiplayer={() => setShowMultiplayerModal(true)}
        />
      )}

      {/* VIEW: VOCABULARY RUSH */}
      {activeView === 'vocab-rush' && (
        <VocabularyRushGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: WORD DETECTIVE */}
      {activeView === 'word-detective' && (
        <WordDetectiveGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: SENTENCE BUILDER */}
      {activeView === 'sentence-builder' && (
        <SentenceBuilderGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: ERROR HUNTER */}
      {activeView === 'error-hunter' && (
        <ErrorHunterGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: SPELLING BEE */}
      {activeView === 'spelling-bee' && (
        <SpellingBeeGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: AI DUEL */}
      {activeView === 'ai-duel' && (
        <AiDuelGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: V3 BLITZ */}
      {activeView === 'v3-blitz' && (
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

      {/* VIEW: FLASHCARDS */}
      {activeView === 'flashcards' && <FlashcardDeck cards={FLASHCARD_DECK} />}

      {/* MULTIPLAYER LOBBY MODAL */}
      {showMultiplayerModal && (
        <MultiplayerLobbyModal
          onClose={() => setShowMultiplayerModal(false)}
          onStartMultiplayerGame={roomCode => {
            setShowMultiplayerModal(false);
            setActiveView('ai-duel');
          }}
        />
      )}

    </div>
  );
};
