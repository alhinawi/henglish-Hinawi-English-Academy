import React, { useState } from 'react';
import { SENTENCE_BUILDER_CHALLENGES } from '../data/gamesData';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
import { Volume2, RotateCcw, Lightbulb, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SentenceBuilder: React.FC = () => {
  const [challengeIndex, setChallengeIndex] = useState(0);
  const current = SENTENCE_BUILDER_CHALLENGES[challengeIndex];

  const [availableWords, setAvailableWords] = useState<string[]>(() => [...current.scrambledWords]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  const resetCurrent = (newIndex = challengeIndex) => {
    const ch = SENTENCE_BUILDER_CHALLENGES[newIndex];
    setChallengeIndex(newIndex);
    setAvailableWords([...ch.scrambledWords]);
    setSelectedWords([]);
    setIsCorrect(null);
    setShowHint(false);
  };

  const handleSelectWord = (word: string, index: number) => {
    playSound('click');
    const newAvail = [...availableWords];
    newAvail.splice(index, 1);
    setAvailableWords(newAvail);

    const newSel = [...selectedWords, word];
    setSelectedWords(newSel);

    // Auto check if all words placed
    if (newSel.length === current.scrambledWords.length) {
      checkResult(newSel);
    }
  };

  const handleRemoveWord = (word: string, index: number) => {
    playSound('click');
    const newSel = [...selectedWords];
    newSel.splice(index, 1);
    setSelectedWords(newSel);

    setAvailableWords([...availableWords, word]);
    setIsCorrect(null);
  };

  const checkResult = (wordsToCheck = selectedWords) => {
    const constructed = wordsToCheck.join(' ').trim().toLowerCase().replace(/[.,?]/g, '');
    const target = current.correctSentence.trim().toLowerCase().replace(/[.,?]/g, '');

    if (constructed === target) {
      setIsCorrect(true);
      playSound('correct');
      fireCelebration();
    } else {
      setIsCorrect(false);
      playSound('wrong');
    }
  };

  const handleNextChallenge = () => {
    playSound('click');
    const nextIdx = (challengeIndex + 1) % SENTENCE_BUILDER_CHALLENGES.length;
    resetCurrent(nextIdx);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE SENTENCE BUILDER</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            معمل بناء الجملة (Sentence Construction) 🧩
          </h3>
          <p className="text-sm text-[#b9b6d5] mt-1">
            رتب الكلمات لبناء جملة مستقبل تام صحيحة نحوياً وسياقياً.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#b9b6d5] px-3 py-1 rounded-xl bg-white/5 border border-white/10">
            تحدي {challengeIndex + 1} من {SENTENCE_BUILDER_CHALLENGES.length}
          </span>
          <button
            onClick={() => resetCurrent()}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#dedbf4] hover:text-white transition-colors cursor-pointer"
            title="إعادة التحدي الحالي"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Audio Listen Button */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => {
            playSound('click');
            speakEnglish(current.audioText);
          }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#41e7ff]/15 hover:bg-[#41e7ff]/25 text-[#41e7ff] text-xs font-bold transition-colors cursor-pointer border border-[#41e7ff]/30"
        >
          <Volume2 className="w-4 h-4" />
          <span>استمع لنطق الجملة الصحيحة (Listen)</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setShowHint(!showHint);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#ffd166] text-xs font-bold transition-colors cursor-pointer border border-white/10"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{showHint ? 'إخفاء التلميح' : 'تلميح بالمصري'}</span>
        </button>
      </div>

      {/* Hint Box */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3.5 rounded-xl bg-[#ffd166]/10 border border-[#ffd166]/30 text-xs sm:text-sm text-[#ffd166]"
          >
            💡 {current.hintAr}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Construction Assembly Slot */}
      <div className={`min-h-[90px] p-4 rounded-2xl border-2 transition-all duration-300 flex flex-wrap items-center gap-2.5 mb-6 ${
        isCorrect === true
          ? 'bg-[#c4ff55]/10 border-[#c4ff55] shadow-[0_0_20px_rgba(196,255,85,0.2)]'
          : isCorrect === false
          ? 'bg-[#ff4f9a]/10 border-[#ff4f9a] shadow-[0_0_20px_rgba(255,79,154,0.2)]'
          : 'bg-[#09091a] border-dashed border-white/20'
      }`}>
        {selectedWords.length === 0 ? (
          <span className="text-sm text-[#b9b6d5]/60 italic mx-auto text-center">
            اضغط على الكلمات بالأسفل لترتيبها هنا بالترتيب الصحيح...
          </span>
        ) : (
          selectedWords.map((word, idx) => (
            <button
              key={`${word}-${idx}`}
              onClick={() => handleRemoveWord(word, idx)}
              className="en px-3.5 py-2 rounded-xl bg-[#201d43] hover:bg-[#ff4f9a]/20 border border-white/20 hover:border-[#ff4f9a]/50 text-white font-bold text-sm sm:text-base cursor-pointer transition-all hover:scale-95 group flex items-center gap-1.5"
            >
              <span>{word}</span>
              <span className="text-[10px] text-white/40 group-hover:text-[#ff4f9a]">✕</span>
            </button>
          ))
        )}
      </div>

      {/* Scrambled Word Pool */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
        {availableWords.map((word, idx) => (
          <button
            key={`${word}-${idx}`}
            onClick={() => handleSelectWord(word, idx)}
            className="en px-4 py-2.5 rounded-xl bg-[#171632] hover:bg-[#ffd166]/20 border border-white/15 hover:border-[#ffd166]/60 text-white hover:text-[#ffd166] font-bold text-sm sm:text-base transition-all hover:-translate-y-1 cursor-pointer shadow-md active:scale-95"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Result Status & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <div>
          {isCorrect === true && (
            <div className="flex items-center gap-2 text-[#c4ff55] font-black text-sm sm:text-base">
              <CheckCircle className="w-5 h-5" />
              <span>إجابة عبقرية وصحيحة تماماً! أحسنت 🎯</span>
            </div>
          )}
          {isCorrect === false && (
            <div className="text-[#ff4f9a] font-bold text-sm">
              ❌ الترتيب مش مظبوط تماماً. حاول تعدل ترتيب الكلمات أو راجع التلميح.
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {selectedWords.length > 0 && isCorrect === null && (
            <button
              onClick={() => checkResult()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black text-xs sm:text-sm hover:brightness-110 cursor-pointer shadow-lg transition-transform hover:-translate-y-0.5"
            >
              تحقق من الإجابة
            </button>
          )}

          {isCorrect === true && (
            <button
              onClick={handleNextChallenge}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm hover:brightness-110 cursor-pointer shadow-lg flex items-center gap-2 transition-transform hover:-translate-y-0.5"
            >
              <span>التحدي التالي</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
