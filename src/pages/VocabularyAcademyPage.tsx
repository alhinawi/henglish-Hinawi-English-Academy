import React, { useState } from 'react';
import { PageRoute } from '../types';
import { VOCABULARY_ACADEMY_WORDS, VocabWord } from '../data/vocabularyAcademyData';
import { VERB_TOOLKIT } from '../data/verbsData';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
import {
  calculateSM2,
  getDueSrsCards,
  loadSrsCardsFromStorage,
  saveSrsCardsToStorage,
  VocabularyCard,
  ReviewRating,
} from '../services/spacedRepetitionService';
import {
  BookA,
  Search,
  Volume2,
  Sparkles,
  Layers,
  Repeat,
  CheckCircle2,
  BookOpen,
  Filter,
  Flame,
  ArrowRight,
  Brain,
  Award,
  Clock,
  RotateCcw,
} from 'lucide-react';

interface VocabularyAcademyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const VocabularyAcademyPage: React.FC<VocabularyAcademyPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'thematic' | 'verbs' | 'flashcards'>('thematic');

  // Spaced Repetition (SM-2) state
  const [srsCards, setSrsCards] = useState<VocabularyCard[]>(() => {
    const loaded = loadSrsCardsFromStorage();
    if (loaded && loaded.length > 0) return loaded;
    return VOCABULARY_ACADEMY_WORDS.map(w => ({
      id: w.id,
      word: w.word,
      ipa: w.ipa,
      translationAr: w.meaningAr,
      category: w.category,
      cefrLevel: w.level,
      exampleEn: w.exampleEn,
      exampleAr: w.exampleAr,
      repetitionCount: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      nextReviewAt: new Date().toISOString(),
    }));
  });

  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewMode, setReviewMode] = useState<'due' | 'all'>('due');

  const categories = [
    { id: 'all', label: 'جميع الكلمات' },
    { id: 'business', label: 'الأعمال والشركات' },
    { id: 'tech', label: 'التكنولوجيا والبرمجة' },
    { id: 'workplace', label: 'بيئة العمل' },
    { id: 'travel', label: 'السفر والمطارات' },
    { id: 'hotel', label: 'الفنادق والضيافة' },
    { id: 'food', label: 'المطاعم والأطعمة' },
    { id: 'medical', label: 'المجال الطبي' },
    { id: 'phrasal_verbs', label: 'الأفعال المركبة (Phrasal)' },
    { id: 'idioms', label: 'التعبيرات الاصطلاحية (Idioms)' },
    { id: 'academic', label: 'الكلمات الأكاديمية' },
  ];

  const filteredWords = VOCABULARY_ACADEMY_WORDS.filter(w => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      w.word.toLowerCase().includes(term) ||
      w.meaningAr.toLowerCase().includes(term) ||
      w.exampleEn.toLowerCase().includes(term);

    const matchesCat = selectedCategory === 'all' || w.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const dueCards = getDueSrsCards(srsCards);
  const activeDeck = reviewMode === 'due' && dueCards.length > 0 ? dueCards : srsCards;
  const currentCard = activeDeck[flashcardIdx % activeDeck.length] || srsCards[0];

  const masteredCount = srsCards.filter(c => c.repetitionCount >= 3).length;
  const learningCount = srsCards.filter(c => c.repetitionCount > 0 && c.repetitionCount < 3).length;

  const handleRateCard = (rating: ReviewRating) => {
    if (!currentCard) return;

    if (rating >= 3) {
      playSound('correct');
      if (rating === 5) {
        fireCelebration();
      }
    } else {
      playSound('wrong');
    }

    const updatedStats = calculateSM2(currentCard, rating);
    const updatedCard: VocabularyCard = {
      ...currentCard,
      ...updatedStats,
      lastReviewedAt: new Date().toISOString(),
    };

    const nextSrsCards = srsCards.map(c => (c.id === currentCard.id ? updatedCard : c));
    setSrsCards(nextSrsCards);
    saveSrsCardsToStorage(nextSrsCards);

    setIsFlipped(false);
    setFlashcardIdx(prev => (prev + 1) % activeDeck.length);
  };

  return (
    <div className="space-y-10 pb-16 text-right">
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 left-10 w-80 h-80 bg-[#c4ff55]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#c4ff55]/20 text-[#c4ff55] border border-[#c4ff55]/40 shadow-sm">
            <BookA className="w-4 h-4" />
            <span>HINAWI VOCABULARY ACADEMY • بنك الكلمات والمصطلحات التفاعلي</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            أكاديمية المفردات والكلمات الذكية 📚
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            منظومة متكاملة لحفظ الكلمات وسياقاتها بالصوت والنطق الصحيح (IPA)، مصنفة حسب مجالات الحياة الحقيقية، مع تدريبات التكرار المتباعد (Spaced Repetition) وقاموس تصريفات الأفعال V1/V2/V3.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('thematic');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === 'thematic'
                  ? 'bg-[#c4ff55] text-[#0c0b20] shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              المفردات المصنفة ({VOCABULARY_ACADEMY_WORDS.length} كلمة)
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('flashcards');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'flashcards'
                  ? 'bg-[#ffd166] text-[#0c0b20] shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <Repeat className="w-4 h-4" />
              <span>مراجعة الفلاش كارد التفاعلية</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('verbs');
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === 'verbs'
                  ? 'bg-[#41e7ff] text-[#0c0b20] shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              أفعال التصريف الثالث V3 ({VERB_TOOLKIT.length} فعلاً)
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: THEMATIC VOCABULARY */}
      {activeTab === 'thematic' && (
        <section className="space-y-6">
          {/* Search & Categories */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-[#41e7ff] absolute right-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                dir="auto"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="ابحث عن أي كلمة بالإنجليزي أو العربي أو مثال..."
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#09091a] border border-white/15 text-white placeholder-[#b9b6d5]/50 text-sm focus:outline-none focus:border-[#c4ff55]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedCategory(c.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-[#c4ff55]/20 text-[#c4ff55] border border-[#c4ff55]/40'
                      : 'bg-white/5 text-[#dedbf4] hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Words Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWords.map(w => (
              <div
                key={w.id}
                className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/10 text-[#ffd166]">
                      {w.level}
                    </span>
                    <button
                      onClick={() => speakEnglish(w.word)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#41e7ff] cursor-pointer"
                      title="استمع للنطق الإنجليزي"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <div className="en text-xl font-black text-white">{w.word}</div>
                    <div className="en text-xs font-mono text-[#41e7ff]">{w.ipa} • {w.partOfSpeech}</div>
                  </div>

                  <p className="text-sm font-bold text-[#c4ff55] pt-1">
                    {w.meaningAr}
                  </p>

                  {w.collocation && (
                    <div className="text-[11px] text-[#ffd166] bg-white/5 px-2.5 py-1 rounded-lg">
                      <strong>متلازمة شائعة: </strong> <span className="en">{w.collocation}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <p className="en text-xs text-[#dedbf4] leading-relaxed">
                      "{w.exampleEn}"
                    </p>
                    <p className="text-[11px] text-[#b9b6d5]">
                      {w.exampleAr}
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-[#b9b6d5] flex items-center justify-between border-t border-white/10">
                  <span>المجال: {categories.find(c => c.id === w.category)?.label || w.category}</span>
                  <button
                    onClick={() => speakEnglish(w.exampleEn)}
                    className="text-[#41e7ff] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>نطق الجملة</span>
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 2: SPACED REPETITION FLASHCARDS (SUPERMEMO SM-2) */}
      {activeTab === 'flashcards' && (
        <section className="max-w-3xl mx-auto space-y-6">
          {/* SRS Progress Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl glass-panel border border-white/10 text-center space-y-0.5">
              <span className="text-[11px] text-[#b9b6d5] block">مستحقة اليوم (Due)</span>
              <span className="text-xl sm:text-2xl font-black text-[#ffd166]">
                {dueCards.length}
              </span>
              <span className="text-[10px] text-[#b9b6d5] block">تحتاج تثبيت</span>
            </div>

            <div className="p-3.5 rounded-2xl glass-panel border border-white/10 text-center space-y-0.5">
              <span className="text-[11px] text-[#b9b6d5] block">قيد التكرار (Learning)</span>
              <span className="text-xl sm:text-2xl font-black text-[#41e7ff]">
                {learningCount}
              </span>
              <span className="text-[10px] text-[#b9b6d5] block">في الذاكرة النشطة</span>
            </div>

            <div className="p-3.5 rounded-2xl glass-panel border border-white/10 text-center space-y-0.5">
              <span className="text-[11px] text-[#b9b6d5] block">متقنة تماماً (Mastered)</span>
              <span className="text-xl sm:text-2xl font-black text-[#c4ff55]">
                {masteredCount}
              </span>
              <span className="text-[10px] text-[#b9b6d5] block">الذاكرة طويلة المدى</span>
            </div>
          </div>

          {/* Mode Toggle & Counter */}
          <div className="flex items-center justify-between text-xs font-bold text-[#b9b6d5] flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => {
                  playSound('click');
                  setReviewMode('due');
                  setFlashcardIdx(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  reviewMode === 'due' ? 'bg-[#ffd166] text-[#0c0b20]' : 'text-white hover:text-[#ffd166]'
                }`}
              >
                المستحقة فقط ({dueCards.length})
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  setReviewMode('all');
                  setFlashcardIdx(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  reviewMode === 'all' ? 'bg-[#41e7ff] text-[#0c0b20]' : 'text-white hover:text-[#41e7ff]'
                }`}
              >
                جميع البطاقات ({srsCards.length})
              </button>
            </div>

            <span className="text-[#dedbf4]">
              البطاقة {(flashcardIdx % activeDeck.length) + 1} من {activeDeck.length}
            </span>
          </div>

          {/* If all due cards are finished and in due mode */}
          {reviewMode === 'due' && dueCards.length === 0 ? (
            <div className="p-8 rounded-3xl glass-panel border border-[#c4ff55]/30 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#c4ff55]/20 flex items-center justify-center text-2xl text-[#c4ff55]">
                🎉
              </div>
              <h3 className="text-xl font-black text-white">
                أحسنت! أتممت مراجعة جميع بطاقات اليوم بنجاح!
              </h3>
              <p className="text-xs text-[#dedbf4] max-w-md mx-auto leading-relaxed">
                خوارزمية التكرار المتباعد (SM-2) قامت بجدولة المراجعات القادمة في المواعيد المثلى لتثبيتها في ذاكرتك الدائمة.
              </p>
              <button
                onClick={() => {
                  playSound('click');
                  setReviewMode('all');
                }}
                className="px-6 py-2.5 rounded-xl bg-linear-to-r from-[#ffd166] to-[#c4ff55] text-[#0c0b20] font-black text-xs hover:brightness-110 shadow-lg cursor-pointer"
              >
                متابعة مراجعة بنك الكلمات بالكامل 📚
              </button>
            </div>
          ) : (
            <>
              {/* Flashcard Box */}
              <div
                onClick={() => {
                  playSound('click');
                  setIsFlipped(prev => !prev);
                }}
                className="w-full min-h-[340px] rounded-3xl p-8 glass-panel border border-white/15 hover:border-[#ffd166]/50 cursor-pointer flex flex-col justify-between items-center text-center transition-all shadow-2xl relative select-none"
              >
                <div className="w-full flex items-center justify-between text-xs text-[#b9b6d5]">
                  <span className="px-2.5 py-1 rounded-md bg-white/10 font-bold text-[#ffd166]">
                    {currentCard.cefrLevel}
                  </span>
                  <span className="text-[#ffd166] text-xs font-bold flex items-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5" />
                    اضغط لقلب البطاقة
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/5 font-mono text-[11px]">
                    تكرار: {currentCard.repetitionCount || 0}
                  </span>
                </div>

                {!isFlipped ? (
                  <div className="space-y-4 my-auto">
                    <div className="en text-3xl sm:text-5xl font-black text-white font-['Outfit',sans-serif]">
                      {currentCard.word}
                    </div>
                    <div className="en text-sm font-mono text-[#41e7ff]">
                      {currentCard.ipa}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakEnglish(currentCard.word);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs hover:bg-white/20 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4 text-[#41e7ff]" />
                      <span>استمع للنطق الإنجليزي</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 my-auto">
                    <div className="text-2xl sm:text-3xl font-black text-[#c4ff55]">
                      {currentCard.translationAr}
                    </div>
                    <div className="en text-sm text-[#dedbf4] max-w-lg mx-auto leading-relaxed font-['Outfit',sans-serif]" dir="ltr">
                      "{currentCard.exampleEn}"
                    </div>
                    <div className="text-xs text-[#b9b6d5]">
                      {currentCard.exampleAr}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakEnglish(currentCard.exampleEn);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[#41e7ff] text-xs"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>نطق جملة المثال</span>
                    </button>
                  </div>
                )}

                <div className="w-full pt-3 flex items-center justify-between text-[11px] text-[#b9b6d5]/70 border-t border-white/5">
                  <span>المجال: {categories.find(c => c.id === currentCard.category)?.label || currentCard.category}</span>
                  <span>معامل الصعوبة: {currentCard.easeFactor || 2.5}</span>
                </div>
              </div>

              {/* SM-2 Spaced Repetition Rating Controls */}
              {isFlipped ? (
                <div className="space-y-2">
                  <div className="text-xs text-center font-bold text-[#dedbf4]">
                    كيف كان تذكرك للكلمة؟ (خوارزمية SM-2 تحدد موعد المراجعة القادمة)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <button
                      onClick={() => handleRateCard(1)}
                      className="p-3 rounded-xl bg-[#ff4f9a]/15 hover:bg-[#ff4f9a]/30 border border-[#ff4f9a]/30 text-white text-xs font-bold transition-all cursor-pointer text-center space-y-1"
                    >
                      <span className="block text-sm text-[#ff4f9a]">نسيتها تماماً</span>
                      <span className="text-[10px] text-[#b9b6d5] block">غداً (1d)</span>
                    </button>

                    <button
                      onClick={() => handleRateCard(2)}
                      className="p-3 rounded-xl bg-[#ff9c66]/15 hover:bg-[#ff9c66]/30 border border-[#ff9c66]/30 text-white text-xs font-bold transition-all cursor-pointer text-center space-y-1"
                    >
                      <span className="block text-sm text-[#ff9c66]">صعبة جداً</span>
                      <span className="text-[10px] text-[#b9b6d5] block">غداً (1d)</span>
                    </button>

                    <button
                      onClick={() => handleRateCard(3)}
                      className="p-3 rounded-xl bg-[#ffd166]/15 hover:bg-[#ffd166]/30 border border-[#ffd166]/30 text-white text-xs font-bold transition-all cursor-pointer text-center space-y-1"
                    >
                      <span className="block text-sm text-[#ffd166]">تذكرتها بجهد</span>
                      <span className="text-[10px] text-[#b9b6d5] block">بعد 3 أيام</span>
                    </button>

                    <button
                      onClick={() => handleRateCard(4)}
                      className="p-3 rounded-xl bg-[#41e7ff]/15 hover:bg-[#41e7ff]/30 border border-[#41e7ff]/30 text-white text-xs font-bold transition-all cursor-pointer text-center space-y-1"
                    >
                      <span className="block text-sm text-[#41e7ff]">سهلة</span>
                      <span className="text-[10px] text-[#b9b6d5] block">بعد 6 أيام</span>
                    </button>

                    <button
                      onClick={() => handleRateCard(5)}
                      className="p-3 rounded-xl bg-[#c4ff55]/15 hover:bg-[#c4ff55]/30 border border-[#c4ff55]/30 text-white text-xs font-black transition-all cursor-pointer text-center space-y-1 col-span-2 sm:col-span-1"
                    >
                      <span className="block text-sm text-[#c4ff55]">متقنة تماماً 👑</span>
                      <span className="text-[10px] text-[#b9b6d5] block">بعد أسبوعين+</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={() => {
                      playSound('click');
                      setIsFlipped(true);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm cursor-pointer transition-all"
                  >
                    عرض المعنى وأزرار التقييم 🔄
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* TAB 3: VERBS V1, V2, V3 */}
      {activeTab === 'verbs' && (
        <section className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#171632] border border-white/10 text-xs text-[#dedbf4]">
            💡 <strong className="text-[#ffd166]">ملاحظة أكاديمية: </strong>
            التصريف الثالث (Past Participle - V3) هو الركيزة الأساسية لكافة أزمنة التام في اللغة الإنجليزية: المستقبل التام (will have + V3)، المضارع التام (have/has + V3)، والماضي التام (had + V3).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VERB_TOOLKIT.map((verb, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-white/20 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-[#ffd166]">{verb.meaningAr}</span>
                  <button
                    onClick={() => speakEnglish(`${verb.v1}, ${verb.v2}, ${verb.v3}`)}
                    className="p-1 rounded bg-white/5 text-[#41e7ff] hover:text-white"
                    title="استمع لتصريفات الفعل الثلاثة"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="en grid grid-cols-3 gap-1 bg-black/40 p-2 rounded-xl text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#b9b6d5] block">V1</span>
                    <span className="font-bold text-white">{verb.v1}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#b9b6d5] block">V2</span>
                    <span className="font-bold text-[#41e7ff]">{verb.v2}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#b9b6d5] block">V3</span>
                    <span className="font-bold text-[#c4ff55]">{verb.v3}</span>
                  </div>
                </div>

                <div className="en text-[11px] text-[#dedbf4] truncate pt-1">
                  Ex: {verb.example}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
