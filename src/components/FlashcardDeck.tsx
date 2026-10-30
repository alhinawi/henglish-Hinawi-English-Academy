import React, { useState } from 'react';
import { FlashcardItem } from '../types';
import { playSound, speakEnglish } from '../utils/audio';
import { RotateCw, Volume2, Check, RefreshCw, Shuffle, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface FlashcardDeckProps {
  cards: FlashcardItem[];
  onMarkCard?: (cardId: string, status: 'known' | 'review') => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  onMarkCard,
}) => {
  const [deck, setDeck] = useState<FlashcardItem[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Formulas', 'Traps', 'Verbs V3', 'Time Clues'];

  const filteredDeck = selectedCategory === 'All' 
    ? deck 
    : deck.filter(c => c.category === selectedCategory);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredDeck.length - 1));
  const currentCard = filteredDeck[safeIndex];

  const handleFlip = () => {
    playSound('flip');
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    playSound('click');
    setIsFlipped(false);
    setCurrentIndex((safeIndex + 1) % filteredDeck.length);
  };

  const handlePrev = () => {
    playSound('click');
    setIsFlipped(false);
    setCurrentIndex((safeIndex - 1 + filteredDeck.length) % filteredDeck.length);
  };

  const handleShuffle = () => {
    playSound('click');
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleMark = (status: 'known' | 'review') => {
    if (!currentCard) return;
    if (status === 'known') {
      playSound('correct');
    } else {
      playSound('click');
    }
    onMarkCard?.(currentCard.id, status);
    handleNext();
  };

  if (!currentCard) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center text-[#b9b6d5]">
        لا توجد بطاقات في هذا التصنيف حالياً.
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Header & Category Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ff4f9a]/15 text-[#ff4f9a] border border-[#ff4f9a]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>3D INTERACTIVE FLASHCARDS</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            بطاقات المراجعة الذكية ⚡
          </h3>
          <p className="text-sm text-[#b9b6d5] mt-0.5">
            اضغط على البطاقة لقلبها واكتشاف القاعدة والأمثلة ونطقها الصوتي.
          </p>
        </div>

        {/* Shuffle & Count */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#ffd166] border border-white/10 transition-colors cursor-pointer"
            title="خلط عشوائي للبطاقات"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>خلط</span>
          </button>
          <span className="text-xs font-bold text-[#b9b6d5] px-3 py-1.5 rounded-xl bg-black/40 border border-white/10">
            {safeIndex + 1} / {filteredDeck.length}
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              playSound('click');
              setSelectedCategory(cat);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black shadow-md'
                : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
            }`}
          >
            {cat === 'All' ? 'جميع البطاقات' : cat}
          </button>
        ))}
      </div>

      {/* 3D Flipping Card Container */}
      <div 
        onClick={handleFlip}
        className="w-full min-h-[320px] sm:min-h-[350px] relative cursor-pointer select-none perspective-1000 my-4"
        title="اضغط لقلب البطاقة"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full min-h-[320px] sm:min-h-[350px] rounded-3xl transform-style-3d relative"
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#1b1939] to-[#13122b] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:border-[#41e7ff]/40 transition-colors">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
                {currentCard.category}
              </span>
              <span className="text-xs text-[#b9b6d5] flex items-center gap-1 font-semibold">
                <RotateCw className="w-3.5 h-3.5" />
                اضغط للقلب
              </span>
            </div>

            <div className="text-center my-auto py-6">
              <p className="text-xl sm:text-3xl font-black text-white whitespace-pre-line leading-relaxed">
                {currentCard.front}
              </p>
              {currentCard.formulaHint && (
                <div className="mt-4 inline-block px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-[#41e7ff] font-bold">
                  تلميح: {currentCard.formulaHint}
                </div>
              )}
            </div>

            <div className="text-center text-xs text-[#b9b6d5]/70">
              بطاقة تعليمية تفاعلية من منصة هناوي
            </div>
          </div>

          {/* BACK SIDE (Rotated 180deg) */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-[#201d43] to-[#12102b] border border-[#41e7ff]/40 shadow-[0_20px_50px_rgba(65,231,255,0.15)]">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/40">
                الحل والشرح الذهبي ✨
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSound('click');
                  speakEnglish(currentCard.exampleEn);
                }}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#41e7ff] transition-colors cursor-pointer"
                title="استمع للمثال الإنجليزي"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center my-auto py-4 space-y-4">
              <div>
                <h4 className="en text-xl sm:text-2xl font-black text-[#c4ff55] whitespace-pre-line text-center" dir="ltr" lang="en">
                  {currentCard.back}
                </h4>
                {currentCard.subBack && (
                  <p className="text-xs sm:text-sm text-[#ffd166] font-bold mt-1">
                    {currentCard.subBack}
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-right">
                <span className="text-[11px] text-[#41e7ff] font-bold block mb-1">
                  مثال تطبيقي:
                </span>
                <p className="en text-sm sm:text-base font-bold text-white text-left" dir="ltr" lang="en">
                  {currentCard.exampleEn}
                </p>
                <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1 text-right">
                  {currentCard.exampleAr}
                </p>
              </div>
            </div>

            <div className="text-center text-xs text-[#b9b6d5]/70">
              اضغط للعودة إلى واجهة البطاقة
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons: Known / Review / Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleMark('known')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#c4ff55]/15 hover:bg-[#c4ff55]/25 border border-[#c4ff55]/30 text-[#c4ff55] font-black text-xs sm:text-sm transition-all hover:scale-105 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>حفظتها تماماً</span>
          </button>

          <button
            onClick={() => handleMark('review')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ff4f9a]/15 hover:bg-[#ff4f9a]/25 border border-[#ff4f9a]/30 text-[#ff4f9a] font-black text-xs sm:text-sm transition-all hover:scale-105 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>محتاجة مراجعة</span>
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={handlePrev}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#dedbf4] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <button
            onClick={handleNext}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black text-white transition-colors cursor-pointer"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
