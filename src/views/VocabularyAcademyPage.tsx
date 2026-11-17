import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { PageRoute } from '../types';
import { VOCABULARY_ACADEMY_WORDS, VocabWord } from '../data/vocabularyAcademyData';
import { VERB_TOOLKIT } from '../data/verbsData';
import { txText, useAppTextMap } from '../services/contentI18nService';
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
  Compass,
  Bookmark,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { VocabularyExplorer } from '../components/vocabulary/VocabularyExplorer';
import { MyVocabularyTab } from '../components/vocabulary/MyVocabularyTab';
import { ExpressionsTab } from '../components/vocabulary/ExpressionsTab';
import { AdminVocabularyModal } from '../components/vocabulary/AdminVocabularyModal';

interface VocabularyAcademyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const VocabularyAcademyPage: React.FC<VocabularyAcademyPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const appText = useAppTextMap('vocabularyAcademyData');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'explorer' | 'my-vocab' | 'expressions' | 'thematic' | 'verbs' | 'flashcards'>('explorer');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [savedVersion, setSavedVersion] = useState(0);

  // Original Flashcards / Spaced Repetition (SM-2) state
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
    { id: 'all', label: t('va.catAll') },
    { id: 'business', label: t('va.catBusiness') },
    { id: 'tech', label: t('va.catTech') },
    { id: 'workplace', label: t('va.catWorkplace') },
    { id: 'travel', label: t('va.catTravel') },
    { id: 'hotel', label: t('va.catHotel') },
    { id: 'food', label: t('va.catFood') },
    { id: 'medical', label: t('va.catMedical') },
    { id: 'phrasal_verbs', label: t('va.catPhrasal') },
    { id: 'idioms', label: t('va.catIdioms') },
    { id: 'academic', label: t('va.catAcademic') },
    { id: 'everyday', label: t('va.catEveryday') },
    { id: 'collocations', label: t('va.catCollocations') },
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
  const currentCard = activeDeck[flashcardIdx % Math.max(1, activeDeck.length)] || srsCards[0];

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
        
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#c4ff55]/20 text-[#c4ff55] border border-[#c4ff55]/40 shadow-sm">
              <BookA className="w-4 h-4" />
              <span>{t('va.badge')}</span>
            </div>

            <button
              onClick={() => {
                playSound('click');
                setIsAdminOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white/90 border border-white/10 transition-all cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#ffd166]" />
              <span>{t('va.adminBtn')}</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            {t('va.heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            {t('va.heroBodyA')} <strong>{t('va.heroBodyStrong')}</strong> {t('va.heroBodyB')}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('explorer');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'explorer'
                  ? 'bg-[#41e7ff] text-[#0c0b20] shadow-lg shadow-[#41e7ff]/20'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{t('va.tabExplorer')}</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('my-vocab');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'my-vocab'
                  ? 'bg-[#c4ff55] text-[#0c0b20] shadow-lg shadow-[#c4ff55]/20'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>{t('va.tabSrs')}</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('expressions');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'expressions'
                  ? 'bg-[#ffd166] text-[#0c0b20] shadow-lg shadow-[#ffd166]/20'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('va.tabPhrases')}</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('verbs');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'verbs'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
              }`}
            >
              {t('va.tabVerbs')}
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('thematic');
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'thematic'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
              }`}
            >
              {t('va.topicsTitle')}
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: INTELLIGENT VOCABULARY EXPLORER (5,000+ WORDS) */}
      {activeTab === 'explorer' && <VocabularyExplorer />}

      {/* TAB 2: MY SAVED VOCABULARY & SM-2 REVIEW */}
      {activeTab === 'my-vocab' && (
        <MyVocabularyTab savedVersion={savedVersion} onExploreWords={() => setActiveTab('explorer')} />
      )}

      {/* TAB 3: 10,000+ EXPRESSIONS, IDIOMS & PHRASAL VERBS */}
      {activeTab === 'expressions' && <ExpressionsTab />}

      {/* TAB 4: THEMATIC VOCABULARY */}
      {activeTab === 'thematic' && (
        <section className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-[#41e7ff] absolute right-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                dir="auto"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={t('va.searchPh')}
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-[#09091a] border border-white/15 text-white placeholder-[#b9b6d5]/50 text-sm focus:outline-none focus:border-[#c4ff55]"
              />
            </div>

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
                      title={t('va.listenTitle')}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <div className="en text-xl font-black text-white">{w.word}</div>
                    <div className="en text-xs font-mono text-[#41e7ff]">{w.ipa} • {w.partOfSpeech}</div>
                  </div>

                  <p className="text-sm font-bold text-[#c4ff55] pt-1">
                    {txText(appText, w.meaningAr)}
                  </p>

                  <div className="pt-2 text-xs space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="en text-white/90 font-medium" dir="ltr">
                      "{w.exampleEn}"
                    </p>
                    <p className="text-white/60 text-[11px]">
                      {txText(appText, w.exampleAr)}
                    </p>
                  </div>
                </div>

                {w.collocation && (
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#dedbf4]/80">
                    <span className="font-bold text-[#ffd166]">{t('va.collocation')}</span>
                    <span className="en font-mono">{w.collocation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 5: VERBS V1, V2, V3 */}
      {activeTab === 'verbs' && (
        <section className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#171632] border border-white/10 text-xs text-[#dedbf4]">
           <strong className="text-[#ffd166]">{t('va.academicNote')} </strong>
            {t('va.v3Note')}
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
                    title={t('va.listenFormsTitle')}
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

      {/* Admin Management Modal */}
      <AdminVocabularyModal
        onWordAdded={() => setSavedVersion(version => version + 1)}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

    </div>
  );
};
