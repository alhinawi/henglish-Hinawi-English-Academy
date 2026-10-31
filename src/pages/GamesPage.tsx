import React, { useState, useEffect } from 'react';
import { SentenceBuilder } from '../components/SentenceBuilder';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { FLASHCARD_DECK } from '../data/flashcardsData';
import { VERB_TOOLKIT } from '../data/verbsData';
import { playSound, fireCelebration } from '../utils/audio';
import { Gamepad2, Timer } from 'lucide-react';

export const GamesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'builder' | 'blitz' | 'cards'>('builder');

  // V3 Blitz Game State
  const [blitzRunning, setBlitzRunning] = useState(false);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzTime, setBlitzTime] = useState(20);
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const [blitzOptions, setBlitzOptions] = useState<string[]>([]);

  const startBlitz = () => {
    playSound('click');
    setBlitzScore(0);
    setBlitzTime(20);
    setBlitzRunning(true);
    setupNextVerb();
  };

  const setupNextVerb = () => {
    const randomIdx = Math.floor(Math.random() * VERB_TOOLKIT.length);
    setCurrentVerbIndex(randomIdx);
    const target = VERB_TOOLKIT[randomIdx];

    // Pick 3 wrong options
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

  const activeVerb = VERB_TOOLKIT[currentVerbIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/15 text-[#41e7ff] border border-[#41e7ff]/30">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>HINAWI GRAMMAR ARCADE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          ألعاب القواعد التعليمية 🎮
        </h1>
        <p className="text-base text-[#b9b6d5] max-w-3xl leading-relaxed">
          تعلم واستمتع في نفس الوقت! اختبر سرعتك في تصريفات الأفعال، ركّب الجمل السليمة، واكتشف القواعد بطريقة تفاعلية مسلية.
        </p>
      </div>

      {/* Game Selector Tabs */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          onClick={() => { playSound('click'); setActiveTab('builder'); }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'builder'
              ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🧩 معمل تركيب الجمل (Sentence Builder)
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('blitz'); }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'blitz'
              ? 'bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          ⚡ تحدي سرعة التصريف (V3 Blitz)
        </button>

        <button
          onClick={() => { playSound('click'); setActiveTab('cards'); }}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'cards'
              ? 'bg-linear-to-r from-[#ff4f9a] to-[#9b7bff] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🃏 بطاقات الذاكرة (Flashcards)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'builder' && <SentenceBuilder />}

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

          {!blitzRunning && blitzTime === 20 && (
            <div className="py-8 space-y-4">
              <span className="text-5xl block">⚡</span>
              <h3 className="text-2xl font-black text-white">تحدي الـ ٢٠ ثانية لتصريف الأفعال V3!</h3>
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

          {blitzRunning && activeVerb && (
            <div className="py-6 space-y-6">
              <div className="p-6 rounded-2xl bg-[#09091a] border border-white/10">
                <span className="text-xs text-[#ffd166] font-bold block mb-1">
                  ما هو التصريف الثالث (V3) للفعل:
                </span>
                <span className="en text-3xl sm:text-4xl font-black text-white">
                  {activeVerb.v1.toUpperCase()}
                </span>
                <span className="text-xs text-[#b9b6d5] block mt-1">
                  ({activeVerb.meaningAr})
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {blitzOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBlitzChoice(opt)}
                    className="en p-4 rounded-2xl bg-[#171632] hover:bg-[#41e7ff]/20 border border-white/15 hover:border-[#41e7ff] text-white hover:text-[#41e7ff] font-black text-lg transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'cards' && <FlashcardDeck cards={FLASHCARD_DECK} />}

    </div>
  );
};
