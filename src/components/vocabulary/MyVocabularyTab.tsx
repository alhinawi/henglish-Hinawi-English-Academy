// ==============================================================================
// Henglish Academy (HENGLISH) - MY VOCABULARY & SM-2 SPACED REPETITION TAB
// Personal vocabulary memory engine with mastery tracking and review queue
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Repeat,
  CheckCircle2,
  Clock,
  Sparkles,
  Bookmark,
  Volume2,
  Trash2,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Flame,
} from 'lucide-react';
import {
  SavedWordItem,
  getSavedWords,
  removeSavedWord,
  rateSavedWord,
  LexicalEntry,
} from '../../services/vocabularyService';
import { ReviewRating } from '../../services/spacedRepetitionService';
import { PronunciationButton } from './PronunciationButton';
import { WordDetailModal } from './WordDetailModal';
import { playSound, fireCelebration } from '../../utils/audio';

interface MyVocabularyTabProps {
  onExploreWords: () => void;
}

export const MyVocabularyTab: React.FC<MyVocabularyTabProps> = ({ onExploreWords }) => {
  const [savedWords, setSavedWords] = useState<SavedWordItem[]>(() => getSavedWords());
  const [reviewFilter, setReviewFilter] = useState<'all' | 'due' | 'learning' | 'mastered'>('all');
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Inspector modal state
  const [detailWord, setDetailWord] = useState<LexicalEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setSavedWords(getSavedWords());
  }, []);

  const now = new Date();
  const dueWords = savedWords.filter(w => new Date(w.nextReviewAt) <= now);
  const masteredWords = savedWords.filter(w => w.repetitionCount >= 3);
  const learningWords = savedWords.filter(w => w.repetitionCount > 0 && w.repetitionCount < 3);

  const filteredWords = savedWords.filter(w => {
    if (reviewFilter === 'due') return new Date(w.nextReviewAt) <= now;
    if (reviewFilter === 'mastered') return w.repetitionCount >= 3;
    if (reviewFilter === 'learning') return w.repetitionCount > 0 && w.repetitionCount < 3;
    return true;
  });

  const activeReviewDeck = dueWords.length > 0 ? dueWords : savedWords;
  const currentReviewItem = activeReviewDeck[reviewIdx % Math.max(1, activeReviewDeck.length)];

  const handleRate = (rating: ReviewRating) => {
    if (!currentReviewItem) return;

    if (rating >= 3) {
      playSound('correct');
      if (rating === 5) fireCelebration();
    } else {
      playSound('wrong');
    }

    const updated = rateSavedWord(currentReviewItem.word, rating);
    setSavedWords(updated);
    setIsFlipped(false);
    setReviewIdx(prev => prev + 1);
  };

  const handleRemove = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    const updated = removeSavedWord(word);
    setSavedWords(updated);
  };

  return (
    <div className="space-y-8 text-right">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-white/60 font-bold flex items-center justify-between">
            <span>إجمالي المحفوظات</span>
            <Bookmark className="w-4 h-4 text-[#41e7ff]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {savedWords.length}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-white/60 font-bold flex items-center justify-between">
            <span>مستحقة للمراجعة الآن</span>
            <Clock className="w-4 h-4 text-[#ffd166]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#ffd166]">
            {dueWords.length}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-white/60 font-bold flex items-center justify-between">
            <span>قيد التثبيت</span>
            <Brain className="w-4 h-4 text-[#c4ff55]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#c4ff55]">
            {learningWords.length}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-1">
          <div className="text-xs text-white/60 font-bold flex items-center justify-between">
            <span>تم إتقانها تماماً</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {masteredWords.length}
          </div>
        </div>
      </div>

      {/* Review Mode Banner & Actions */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-right">
          <h3 className="text-lg font-black text-white flex items-center gap-2 justify-center sm:justify-start">
            <Repeat className="w-5 h-5 text-[#ffd166]" />
            <span>جلسة التكرار المتباعد الخوارزمية (SM-2 Spaced Repetition)</span>
          </h3>
          <p className="text-xs sm:text-sm text-white/60">
            راجع الكلمات في المواعيد المحددة بدقة لتنتقل من الذاكرة قصيرة المدى إلى الذاكرة الدائمة.
          </p>
        </div>

        <button
          onClick={() => {
            playSound('click');
            setIsReviewMode(!isReviewMode);
          }}
          disabled={savedWords.length === 0}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
            isReviewMode
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
              : 'bg-[#ffd166] text-[#09091a] hover:bg-[#ffe18d] shadow-lg shadow-[#ffd166]/20'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>{isReviewMode ? 'إنهاء جلسة المراجعة' : 'ابدأ جلسة المراجعة الآن'}</span>
        </button>
      </div>

      {/* FLASHCARD REVIEW SESSION */}
      {isReviewMode && currentReviewItem && (
        <section className="glass-panel p-6 sm:p-10 rounded-3xl border border-[#ffd166]/30 bg-linear-to-b from-[#18162e] to-[#0c0b1a] space-y-6 max-w-2xl mx-auto shadow-2xl">
          <div className="flex items-center justify-between text-xs text-white/60 font-bold">
            <span>بطاقة {reviewIdx + 1} من {activeReviewDeck.length}</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white/80">
              {currentReviewItem.entry.cefr} • {currentReviewItem.entry.pos}
            </span>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => {
              playSound('flip');
              setIsFlipped(!isFlipped);
            }}
            className="min-h-[220px] p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-4 select-none"
          >
            <div className="en text-3xl sm:text-4xl font-black text-white tracking-tight">
              {currentReviewItem.word}
            </div>

            <div className="flex items-center gap-2">
              <PronunciationButton
                wordId={currentReviewItem.entry.id}
                wordText={currentReviewItem.word}
                accent="US"
                ipa={currentReviewItem.entry.ipaUs}
                audioUrl={currentReviewItem.entry.audioUsUrl}
                size="sm"
              />
              <PronunciationButton
                wordId={currentReviewItem.entry.id}
                wordText={currentReviewItem.word}
                accent="UK"
                ipa={currentReviewItem.entry.ipaUk}
                audioUrl={currentReviewItem.entry.audioUkUrl}
                size="sm"
              />
            </div>

            {isFlipped ? (
              <div className="space-y-2 pt-2 border-t border-white/10 w-full animate-fadeIn">
                <div className="text-xl font-black text-[#c4ff55]">
                  {currentReviewItem.entry.meaningAr}
                </div>
                <p className="text-xs text-white/70 max-w-md mx-auto font-sans" dir="ltr">
                  "{currentReviewItem.entry.exampleEn}"
                </p>
                {currentReviewItem.notes && (
                  <p className="text-[11px] text-[#ffd166] italic">
                    ملاحظتك: {currentReviewItem.notes}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-white/40 pt-2">
                انقر على البطاقة لإظهار المعنى والمثال العربي
              </p>
            )}
          </div>

          {/* SM-2 Rating Controls */}
          {isFlipped && (
            <div className="space-y-2">
              <p className="text-xs text-center text-white/60 font-bold">
                ما مدى سهولة تذكرك لهذه الكلمة؟
              </p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleRate(1)}
                  className="p-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-bold transition-all cursor-pointer"
                >
                  نسيتها (Again)
                </button>
                <button
                  onClick={() => handleRate(3)}
                  className="p-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all cursor-pointer"
                >
                  صعبة (Hard)
                </button>
                <button
                  onClick={() => handleRate(4)}
                  className="p-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-400 text-xs font-bold transition-all cursor-pointer"
                >
                  جيدة (Good)
                </button>
                <button
                  onClick={() => handleRate(5)}
                  className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-all cursor-pointer"
                >
                  سهلة جداً (Easy)
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: `جميع المحفوظات (${savedWords.length})` },
          { id: 'due', label: `المستحقة للمراجعة (${dueWords.length})` },
          { id: 'learning', label: `قيد التعلم (${learningWords.length})` },
          { id: 'mastered', label: `المتقنة (${masteredWords.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              playSound('click');
              setReviewFilter(tab.id as any);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
              reviewFilter === tab.id
                ? 'bg-[#c4ff55]/20 text-[#c4ff55] border-[#c4ff55]/50'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SAVED WORDS LIST */}
      {filteredWords.length === 0 ? (
        <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4">
          <Bookmark className="w-10 h-10 text-white/30 mx-auto" />
          <h4 className="text-lg font-black text-white">لا توجد كلمات محفوظة في هذا القسم</h4>
          <p className="text-xs text-white/60 max-w-sm mx-auto">
            استكشف بنك المفردات الذكي واحفظ الكلمات التي تود تثبيتها في جدول مراجعاتك.
          </p>
          <button
            onClick={onExploreWords}
            className="px-4 py-2 rounded-xl bg-[#c4ff55] text-[#09091a] text-xs font-black hover:bg-[#d4ff75] transition-all cursor-pointer"
          >
            استكشف بنك الكلمات الآن
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map(item => (
            <div
              key={item.id}
              onClick={() => {
                setDetailWord(item.entry);
                setIsModalOpen(true);
              }}
              className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={e => handleRemove(item.word, e)}
                  className="p-1 rounded-lg hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                  title="حذف من المحفوظات"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-white/10 text-[#ffd166]">
                    {item.entry.cefr}
                  </span>
                  <span className="text-[10px] text-white/50">
                    تكرار: {item.repetitionCount}x
                  </span>
                </div>
              </div>

              <div>
                <div className="en text-xl font-black text-white group-hover:text-[#41e7ff] transition-colors">
                  {item.word}
                </div>
                <div className="text-sm font-bold text-[#c4ff55] mt-0.5">
                  {item.entry.meaningAr}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <PronunciationButton
                  wordId={item.entry.id}
                  wordText={item.word}
                  accent="US"
                  ipa={item.entry.ipaUs}
                  audioUrl={item.entry.audioUsUrl}
                  size="sm"
                />
                <PronunciationButton
                  wordId={item.entry.id}
                  wordText={item.word}
                  accent="UK"
                  ipa={item.entry.ipaUk}
                  audioUrl={item.entry.audioUkUrl}
                  size="sm"
                />
              </div>

              {item.notes && (
                <div className="p-2 rounded-lg bg-white/5 text-[11px] text-[#ffd166]/90 border border-white/5">
                  ملاحظة: {item.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <WordDetailModal
        entry={detailWord}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWordSavedChange={() => setSavedWords(getSavedWords())}
      />
    </div>
  );
};

