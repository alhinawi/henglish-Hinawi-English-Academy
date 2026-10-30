import React, { useState } from 'react';
import { PageRoute } from '../types';
import { VOCABULARY_ACADEMY_WORDS, VocabWord } from '../data/vocabularyAcademyData';
import { VERB_TOOLKIT } from '../data/verbsData';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
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
} from 'lucide-react';

interface VocabularyAcademyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const VocabularyAcademyPage: React.FC<VocabularyAcademyPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'thematic' | 'verbs' | 'flashcards'>('thematic');

  // Flashcard mode state
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<string[]>([]);

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

  const handleNextCard = (known: boolean) => {
    playSound(known ? 'correct' : 'click');
    const currentWord = VOCABULARY_ACADEMY_WORDS[flashcardIdx];
    if (known && !knownWords.includes(currentWord.id)) {
      setKnownWords(prev => [...prev, currentWord.id]);
      fireCelebration();
    }
    setIsFlipped(false);
    setFlashcardIdx(prev => (prev + 1) % VOCABULARY_ACADEMY_WORDS.length);
  };

  const currentFlashcard = VOCABULARY_ACADEMY_WORDS[flashcardIdx] || VOCABULARY_ACADEMY_WORDS[0];

  return (
    <div className="space-y-10 pb-16 text-right">
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-gradient-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
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

      {/* TAB 2: SPACED REPETITION FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <section className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-[#b9b6d5]">
            <span>البطاقة {flashcardIdx + 1} من {VOCABULARY_ACADEMY_WORDS.length}</span>
            <span className="text-[#c4ff55]">الكلمات المحفوظة: {knownWords.length}</span>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => {
              playSound('click');
              setIsFlipped(prev => !prev);
            }}
            className="w-full min-h-[320px] rounded-3xl p-8 glass-panel border border-white/15 hover:border-[#ffd166]/50 cursor-pointer flex flex-col justify-between items-center text-center transition-all shadow-2xl relative select-none"
          >
            <div className="w-full flex items-center justify-between text-xs text-[#b9b6d5]">
              <span className="px-2.5 py-1 rounded-md bg-white/10 font-bold">{currentFlashcard.level}</span>
              <span className="text-[#ffd166] text-xs font-bold">اضغط لقلب البطاقة 🔄</span>
            </div>

            {!isFlipped ? (
              <div className="space-y-4 my-auto">
                <div className="en text-3xl sm:text-4xl font-black text-white">
                  {currentFlashcard.word}
                </div>
                <div className="en text-sm font-mono text-[#41e7ff]">
                  {currentFlashcard.ipa} • {currentFlashcard.partOfSpeech}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakEnglish(currentFlashcard.word);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs hover:bg-white/20"
                >
                  <Volume2 className="w-4 h-4 text-[#41e7ff]" />
                  <span>استمع للنطق</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4 my-auto">
                <div className="text-2xl font-black text-[#c4ff55]">
                  {currentFlashcard.meaningAr}
                </div>
                <div className="en text-sm text-[#dedbf4] max-w-md mx-auto leading-relaxed">
                  "{currentFlashcard.exampleEn}"
                </div>
                <div className="text-xs text-[#b9b6d5]">
                  {currentFlashcard.exampleAr}
                </div>
              </div>
            )}

            <div className="text-[11px] text-[#b9b6d5]/70">
              مجال: {categories.find(c => c.id === currentFlashcard.category)?.label}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleNextCard(false)}
              className="py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm cursor-pointer transition-all"
            >
              تحتاج مراجعة لاحقاً 🔄
            </button>
            <button
              onClick={() => handleNextCard(true)}
              className="py-3.5 rounded-2xl bg-gradient-to-r from-[#c4ff55] to-[#41e7ff] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer transition-all"
            >
              حفظتها تماماً! ✅
            </button>
          </div>
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
