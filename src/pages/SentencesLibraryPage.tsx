// ==============================================================================
// Henglish Academy (HENGLISH) - 5,500 ESSENTIAL ENGLISH SENTENCES LIBRARY PAGE
// Full-fledged educational platform featuring 15 learning modes, intelligent search,
// Egyptian Arabic translations, CEFR distribution, SRS review, and custom collections.
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { PageRoute, CEFRLevel } from '../types';
import {
  SentenceItem,
  loadSentences,
  searchSentences,
  getDailySentence,
  getSentenceOfTheWeek,
  getRandomSentence,
  SemanticExplanationMatch,
} from '../services/sentencesService';
import {
  getFavoriteSentenceIds,
  getDifficultSentenceIds,
  getRecentlyStudiedIds,
  getDueSentencesIds,
  getSentenceStats,
  SentenceLearningStats,
  getCollections,
  createCollection,
  deleteCollection,
  UserSentenceCollection,
} from '../services/sentenceSrsService';
import { SentenceCard } from '../components/SentenceCard';
import { playSound } from '../utils/audio';
import { speakText } from '../utils/voiceEngine';
import {
  BookA,
  Search,
  Filter,
  Layers,
  Sparkles,
  Calendar,
  Flame,
  Award,
  Heart,
  AlertCircle,
  Clock,
  Shuffle,
  Volume2,
  Mic,
  Languages,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Compass,
} from 'lucide-react';

interface SentencesLibraryPageProps {
  onNavigate: (route: PageRoute) => void;
}

type LearningMode =
  | 'browse'
  | 'cefr'
  | 'sections'
  | 'grammar'
  | 'random'
  | 'daily'
  | 'weekly'
  | 'favorites'
  | 'difficult'
  | 'recent'
  | 'practice'
  | 'listening'
  | 'speaking'
  | 'translation'
  | 'conversation'
  | 'srs';

const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const SECTIONS_METADATA = [
  { id: 'Section 1 — Everyday English', title: 'Everyday English', titleAr: 'الإنجليزية اليومية والتواصل الأساسي', icon: '☕', subCount: 20 },
  { id: 'Section 2 — Daily Activities', title: 'Daily Activities', titleAr: 'الأنشطة والروتين اليومي', icon: '⏰', subCount: 13 },
  { id: 'Section 3 — Social Conversations', title: 'Social Conversations', titleAr: 'المحادثات الاجتماعية وبناء العلاقات', icon: '🤝', subCount: 13 },
  { id: 'Section 4 — Travel and Tourism', title: 'Travel & Tourism', titleAr: 'السفر والسياحة والمطارات', icon: '✈️', subCount: 15 },
  { id: 'Section 5 — Shopping and Money', title: 'Shopping & Money', titleAr: 'التسوق والمعاملات المالية', icon: '💳', subCount: 11 },
  { id: 'Section 6 — Work and Business English', title: 'Work & Business', titleAr: 'الإنجليزية المهنية وبيئة العمل', icon: '💼', subCount: 14 },
  { id: 'Section 7 — Technology and Modern Life', title: 'Technology & AI', titleAr: 'التكنولوجيا والحياة الرقمية والذكاء الاصطناعي', icon: '💻', subCount: 10 },
  { id: 'Section 8 — Health and Lifestyle', title: 'Health & Lifestyle', titleAr: 'الصحة وأسلوب الحياة والاستشارات الطبية', icon: '🌿', subCount: 9 },
  { id: 'Section 9 — Academic and Intellectual English', title: 'Academic & Intellectual', titleAr: 'الإنجليزية الأكاديمية والبحث العلمي', icon: '🎓', subCount: 10 },
  { id: 'Section 10 — Advanced Natural English', title: 'Advanced Natural English', titleAr: 'التعبيرات المتقدمة والإنجليزية الفطرية', icon: '⚡', subCount: 10 },
  { id: 'Section 11 — Grammar-Based Sentences', title: 'Grammar Mastery', titleAr: 'جمل تطبيقية على كافة قواعد الجرامر والأزمنة', icon: '📐', subCount: 20 },
  { id: 'Section 12 — Real Conversation Expressions', title: 'Real Spoken English', titleAr: 'تعبيرات المحادثة الواقعية واللغة المحكية الدارجة', icon: '💬', subCount: 10 },
];

export const SentencesLibraryPage: React.FC<SentencesLibraryPageProps> = ({ onNavigate }) => {
  // Main state
  const [allSentences, setAllSentences] = useState<SentenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMode, setActiveMode] = useState<LearningMode>('browse');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | 'all'>('all');
  const [selectedSection, setSelectedSection] = useState<string | 'all'>('all');
  const [selectedGrammar, setSelectedGrammar] = useState<string | 'all'>('all');
  const [semanticMatches, setSemanticMatches] = useState<SemanticExplanationMatch[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Highlights state (Daily, Weekly, Random)
  const [dailySentence, setDailySentence] = useState<SentenceItem | null>(null);
  const [weeklySentence, setWeeklySentence] = useState<SentenceItem | null>(null);
  const [randomSentence, setRandomSentence] = useState<SentenceItem | null>(null);

  // SRS and Stats
  const [stats, setStats] = useState<SentenceLearningStats>(getSentenceStats());
  const [collections, setCollections] = useState<UserSentenceCollection[]>(getCollections());
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);

  // Interactive Quiz / Practice mode state
  const [practiceSentence, setPracticeSentence] = useState<SentenceItem | null>(null);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [selectedWordIndices, setSelectedWordIndices] = useState<number[]>([]);
  const [practiceStatus, setPracticeStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Listening mode state
  const [isListeningRevealed, setIsListeningRevealed] = useState(false);

  // Load database once on mount
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const data = await loadSentences();
      setAllSentences(data);
      const daily = await getDailySentence();
      setDailySentence(daily);
      const weekly = await getSentenceOfTheWeek();
      setWeeklySentence(weekly);
      const rand = await getRandomSentence();
      setRandomSentence(rand);
      setStats(getSentenceStats());
      setCollections(getCollections());
      setIsLoading(false);
    }
    init();
  }, []);

  // Sync search results
  useEffect(() => {
    let isCancelled = false;
    async function runSearch() {
      if (activeMode !== 'browse' && activeMode !== 'cefr' && activeMode !== 'sections' && activeMode !== 'grammar') {
        return;
      }
      const res = await searchSentences(searchQuery, {
        cefr: selectedCefr,
        section: selectedSection,
        grammar: selectedGrammar,
        limit: 100,
        offset: 0,
      });
      if (!isCancelled) {
        setSemanticMatches(res.semanticMatches || []);
      }
    }
    runSearch();
    return () => {
      isCancelled = true;
    };
  }, [searchQuery, selectedCefr, selectedSection, selectedGrammar, activeMode]);

  // Filtered Sentences calculation based on active mode
  const currentSentencesPool = useMemo(() => {
    if (isLoading || allSentences.length === 0) return [];

    switch (activeMode) {
      case 'browse': {
        return allSentences.filter(s => {
          if (selectedCefr !== 'all' && s.cefr !== selectedCefr) return false;
          if (selectedSection !== 'all' && s.section !== selectedSection) return false;
          if (selectedGrammar !== 'all' && !s.grammar.toLowerCase().includes(selectedGrammar.toLowerCase())) return false;
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase().trim();
          return (
            s.english.toLowerCase().includes(q) ||
            s.arabicEg.includes(q) ||
            s.arabicFusha.includes(q) ||
            s.grammar.toLowerCase().includes(q) ||
            s.subcategory.toLowerCase().includes(q)
          );
        });
      }
      case 'cefr': {
        const targetLevel = selectedCefr === 'all' ? 'A1' : selectedCefr;
        return allSentences.filter(s => s.cefr === targetLevel);
      }
      case 'sections': {
        const targetSec = selectedSection === 'all' ? SECTIONS_METADATA[0].id : selectedSection;
        return allSentences.filter(s => s.section === targetSec);
      }
      case 'grammar': {
        if (selectedGrammar === 'all') {
          return allSentences.filter(s => s.section.includes('Grammar'));
        }
        return allSentences.filter(s => s.grammar.toLowerCase().includes(selectedGrammar.toLowerCase()));
      }
      case 'favorites': {
        const favIds = new Set(getFavoriteSentenceIds());
        return allSentences.filter(s => favIds.has(s.id));
      }
      case 'difficult': {
        const diffIds = new Set(getDifficultSentenceIds());
        return allSentences.filter(s => diffIds.has(s.id));
      }
      case 'recent': {
        const recIds = getRecentlyStudiedIds();
        const map = new Map(allSentences.map(s => [s.id, s]));
        return recIds.map(id => map.get(id)).filter(Boolean) as SentenceItem[];
      }
      case 'srs': {
        const dueIds = new Set(getDueSentencesIds());
        return allSentences.filter(s => dueIds.has(s.id));
      }
      default:
        return allSentences;
    }
  }, [allSentences, activeMode, selectedCefr, selectedSection, selectedGrammar, searchQuery, isLoading]);

  // Pagination slice
  const paginatedSentences = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return currentSentencesPool.slice(startIndex, startIndex + itemsPerPage);
  }, [currentSentencesPool, page]);

  const totalPages = Math.ceil(currentSentencesPool.length / itemsPerPage) || 1;

  // Switch learning mode
  const handleSelectMode = (mode: LearningMode) => {
    playSound('click');
    setActiveMode(mode);
    setPage(1);

    if (mode === 'practice') {
      setupNewPractice();
    } else if (mode === 'listening') {
      setIsListeningRevealed(false);
      setupNewRandom();
    }
  };

  // Fetch new random sentence
  const setupNewRandom = async () => {
    playSound('click');
    const r = await getRandomSentence();
    setRandomSentence(r);
  };

  // Setup word scramble practice
  const setupNewPractice = () => {
    const rand = allSentences[Math.floor(Math.random() * allSentences.length)] || allSentences[0];
    if (!rand) return;
    setPracticeSentence(rand);
    const words = rand.english.replace(/[.,!?;:]/g, '').split(' ');
    const scrambled = [...words].sort(() => Math.random() - 0.5);
    setScrambledWords(scrambled);
    setSelectedWordIndices([]);
    setPracticeStatus('idle');
  };

  // Handle clicking a word in scramble
  const handleSelectWord = (idx: number) => {
    playSound('click');
    if (selectedWordIndices.includes(idx)) {
      setSelectedWordIndices(selectedWordIndices.filter(i => i !== idx));
    } else {
      setSelectedWordIndices([...selectedWordIndices, idx]);
    }
  };

  // Check scramble answer
  const handleCheckPractice = () => {
    if (!practiceSentence) return;
    const userBuilt = selectedWordIndices.map(i => scrambledWords[i]).join(' ');
    const targetClean = practiceSentence.english.replace(/[.,!?;:]/g, '').trim();

    if (userBuilt.toLowerCase() === targetClean.toLowerCase()) {
      setPracticeStatus('correct');
      playSound('success');
    } else {
      setPracticeStatus('wrong');
      playSound('error');
    }
  };

  // Create Collection
  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) return;
    playSound('success');
    createCollection(newCollectionName.trim(), '#8b5cf6');
    setNewCollectionName('');
    setIsCreatingCollection(false);
    setCollections(getCollections());
  };

  // Delete Collection
  const handleDeleteCollection = (colId: string) => {
    playSound('click');
    deleteCollection(colId);
    setCollections(getCollections());
  };

  return (
    <div className="space-y-8 pb-16 text-right selection:bg-purple-500/30">
      {/* 1. HERO HEADER: The 5,500 Sentences Crown */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-white/10 bg-gradient-to-br from-[#1b153b] via-[#151228] to-[#0f0e1a] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <BookA className="w-3.5 h-3.5" />
                <span>مكتبة الـ 5,500 جملة الإنجليزية القياسية • CEFR A1 - C2</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                <span>موسوعة التحدث الإنجليزي الذكية 🌟</span>
              </h1>
              <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed">
                5,500 جملة واقعية مصنفة بدقة طبقاً للإطار الأوروبي المشترك (CEFR)، ومترجمة للعامية المصرية الفطرية والفصحى مع نطق صوتي فوري وتكرار متباعد SM-2.
              </p>
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-xl sm:text-2xl font-black text-white block">5,500</span>
                <span className="text-[11px] font-bold text-white/60">إجمالي الجمل</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-xl sm:text-2xl font-black text-emerald-400 block">{stats.totalStudied}</span>
                <span className="text-[11px] font-bold text-white/60">تمت دراستها</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-xl sm:text-2xl font-black text-amber-400 block flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 text-amber-400 fill-current" />
                  <span>{stats.streakDays}</span>
                </span>
                <span className="text-[11px] font-bold text-white/60">أيام حماس</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-xl sm:text-2xl font-black text-purple-400 block">{stats.masteryScore}%</span>
                <span className="text-[11px] font-bold text-white/60">نسبة الإتقان</span>
              </div>
            </div>
          </div>

          {/* CEFR Level Distribution Bar */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-white/60 font-bold">
              <span>توزيع مستويات الـ CEFR المعتمدة:</span>
              <span>100% تغطية شاملة لجميع المراحل</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              <button
                onClick={() => {
                  setSelectedCefr('A1');
                  handleSelectMode('cefr');
                }}
                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  selectedCefr === 'A1' && activeMode === 'cefr'
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/25'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                }`}
              >
                <div className="text-xs font-black">A1 • مبتدئ</div>
                <div className="text-[11px] opacity-80">800 جملة</div>
              </button>

              <button
                onClick={() => {
                  setSelectedCefr('A2');
                  handleSelectMode('cefr');
                }}
                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  selectedCefr === 'A2' && activeMode === 'cefr'
                    ? 'bg-cyan-500 text-white border-cyan-400 shadow-lg shadow-cyan-500/25'
                    : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/20'
                }`}
              >
                <div className="text-xs font-black">A2 • أساسي</div>
                <div className="text-[11px] opacity-80">1,000 جملة</div>
              </button>

              <button
                onClick={() => {
                  setSelectedCefr('B1');
                  handleSelectMode('cefr');
                }}
                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  selectedCefr === 'B1' && activeMode === 'cefr'
                    ? 'bg-blue-500 text-white border-blue-400 shadow-lg shadow-blue-500/25'
                    : 'bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/20'
                }`}
              >
                <div className="text-xs font-black">B1 • متوسط</div>
                <div className="text-[11px] opacity-80">1,100 جملة</div>
              </button>

              <button
                onClick={() => {
                  setSelectedCefr('B2');
                  handleSelectMode('cefr');
                }}
                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  selectedCefr === 'B2' && activeMode === 'cefr'
                    ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/25'
                    : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20'
                }`}
              >
                <div className="text-xs font-black">B2 • فوق متوسط</div>
                <div className="text-[11px] opacity-80">1,100 جملة</div>
              </button>

              <button
                onClick={() => {
                  setSelectedCefr('C1');
                  handleSelectMode('cefr');
                }}
                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  selectedCefr === 'C1' && activeMode === 'cefr'
                    ? 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/25'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20'
                }`}
              >
                <div className="text-xs font-black">C1 • متقدم</div>
                <div className="text-[11px] opacity-80">900 جملة</div>
              </button>

              <button
                onClick={() => {
                  setSelectedCefr('C2');
                  handleSelectMode('cefr');
                }}
                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  selectedCefr === 'C2' && activeMode === 'cefr'
                    ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/25'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20'
                }`}
              >
                <div className="text-xs font-black">C2 • طلاقة تامة</div>
                <div className="text-[11px] opacity-80">600 جملة</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LEARNING MODES NAVIGATION BAR (15 MODES) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-white/70">
          <span className="flex items-center gap-1.5 text-purple-300">
            <Compass className="w-4 h-4" />
            <span>أنماط الدراسة والممارسة التفاعلية (15 نمطاً):</span>
          </span>
          <span className="text-white/40">{allSentences.length} جملة متوفرة</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'browse', label: 'تصفح الكل', icon: Layers },
            { id: 'cefr', label: 'المستويات CEFR', icon: Award },
            { id: 'sections', label: 'الأقسام والمواضيع', icon: Compass },
            { id: 'grammar', label: 'القواعد والأزمنة', icon: BookA },
            { id: 'daily', label: 'جملة اليوم 📅', icon: Calendar },
            { id: 'weekly', label: 'جملة الأسبوع 🌟', icon: Sparkles },
            { id: 'random', label: 'جملة عشوائية 🎲', icon: Shuffle },
            { id: 'favorites', label: 'المفضلة ❤️', icon: Heart },
            { id: 'difficult', label: 'الجمل الصعبة ⚠️', icon: AlertCircle },
            { id: 'recent', label: 'دُرست حديثاً 🕒', icon: Clock },
            { id: 'srs', label: 'مراجعة SM-2 🧠', icon: Flame },
            { id: 'practice', label: 'معمل الترتيب 🧩', icon: HelpCircle },
            { id: 'listening', label: 'تحدي الاستماع 🎧', icon: Volume2 },
            { id: 'speaking', label: 'تحدي النطق 🎙️', icon: Mic },
            { id: 'translation', label: 'تحدي الترجمة 🔄', icon: Languages },
          ].map(m => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleSelectMode(m.id as LearningMode)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. DEDICATED VIEW SWITCHER ACCORDING TO ACTIVE MODE */}

      {/* --- MODE: DAILY SENTENCE --- */}
      {activeMode === 'daily' && dailySentence && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-amber-300">
            <span className="font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>جملة اليوم المختارة بعناية لجميع طلاب المنصة:</span>
            </span>
            <span className="text-xs font-mono">{new Date().toLocaleDateString('ar-EG')}</span>
          </div>
          <SentenceCard
            sentence={dailySentence}
            onPracticeWithAi={() => onNavigate('ai-tutor')}
          />
        </div>
      )}

      {/* --- MODE: WEEKLY SENTENCE --- */}
      {activeMode === 'weekly' && weeklySentence && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-purple-300">
            <span className="font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>جملة الأسبوع الذهبية المتقدمة:</span>
            </span>
            <span className="text-xs font-mono">Mastery Expression</span>
          </div>
          <SentenceCard
            sentence={weeklySentence}
            onPracticeWithAi={() => onNavigate('ai-tutor')}
          />
        </div>
      )}

      {/* --- MODE: RANDOM SENTENCE --- */}
      {activeMode === 'random' && randomSentence && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-white/70">توليد جمل عشوائية للتدريب السريع:</span>
            <button
              onClick={setupNewRandom}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-purple-600/30"
            >
              <Shuffle className="w-4 h-4" />
              <span>جملة عشوائية أخرى</span>
            </button>
          </div>
          <SentenceCard
            sentence={randomSentence}
            onPracticeWithAi={() => onNavigate('ai-tutor')}
          />
        </div>
      )}

      {/* --- MODE: PRACTICE (WORD SCRAMBLE) --- */}
      {activeMode === 'practice' && practiceSentence && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6 text-center">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
              معمل ترتيب الكلمات • Word Scramble
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              رتّب الكلمات الإنجليزية لتكوين هذه الجملة:
            </h3>
            <p className="text-base text-amber-300 font-bold max-w-xl mx-auto">
              "{practiceSentence.arabicEg}"
            </p>
          </div>

          {/* User's Assembled Sentence */}
          <div className="min-h-16 p-4 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-center gap-2 flex-wrap">
            {selectedWordIndices.length === 0 ? (
              <span className="text-white/30 text-sm italic">اضغط على الكلمات بالترتيب الصحيح بالأسفل...</span>
            ) : (
              selectedWordIndices.map((wordIdx, order) => (
                <button
                  key={order}
                  onClick={() => handleSelectWord(wordIdx)}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-black text-sm shadow-md transition-transform hover:scale-105 cursor-pointer"
                >
                  {scrambledWords[wordIdx]}
                </button>
              ))
            )}
          </div>

          {/* Word Bank */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {scrambledWords.map((word, idx) => {
              const isUsed = selectedWordIndices.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectWord(idx)}
                  disabled={isUsed}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isUsed
                      ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15 shadow-sm'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {/* Result Feedback & Actions */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            {practiceStatus === 'correct' && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-sm font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>إجابة نموذجية صحيحة 100%! أحسنت يا بطل! 🎉</span>
              </div>
            )}
            {practiceStatus === 'wrong' && (
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-sm font-bold flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                <span>الترتيب غير دقيق. حاول مجدداً أو استمع للجملة!</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleCheckPractice}
                className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                تحقق من الإجابة
              </button>
              <button
                onClick={setupNewPractice}
                className="px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-all border border-white/10 cursor-pointer"
              >
                جملة تالية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODE: LISTENING CHALLENGE --- */}
      {activeMode === 'listening' && randomSentence && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6 text-center">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
              تحدي الاستماع الحقيقي • Listening Mode
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              استمع أولاً دون قراءة النص، وحاول تخمين المعنى:
            </h3>
          </div>

          {/* Big Audio Play Button */}
          <div className="py-6 flex items-center justify-center gap-4">
            <button
              onClick={() => speakText(randomSentence.english, { speed: 1.0 })}
              className="w-20 h-20 rounded-3xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 transition-all hover:scale-105 cursor-pointer"
            >
              <Volume2 className="w-10 h-10 fill-current" />
            </button>
            <button
              onClick={() => speakText(randomSentence.english, { speed: 0.75 })}
              className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
              title="نطق بطيء 0.75x"
            >
              <span className="font-bold text-xs">0.75x</span>
            </button>
          </div>

          {/* Reveal Card */}
          {!isListeningRevealed ? (
            <button
              onClick={() => setIsListeningRevealed(true)}
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-sm border border-white/15 cursor-pointer transition-all"
            >
              كشف النص والترجمة الآن 👁️
            </button>
          ) : (
            <div className="max-w-2xl mx-auto text-right">
              <SentenceCard sentence={randomSentence} />
            </div>
          )}

          <div className="pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setIsListeningRevealed(false);
                setupNewRandom();
              }}
              className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              استمع لجملة أخرى 🎧
            </button>
          </div>
        </div>
      )}

      {/* --- MODE: SECTIONS & TOPICS DIRECTORY --- */}
      {activeMode === 'sections' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS_METADATA.map(sec => {
              const isSelected = selectedSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedSection(sec.id);
                  }}
                  className={`p-5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-400 shadow-xl shadow-purple-600/30'
                      : 'bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{sec.icon}</span>
                    <span className="text-xs font-mono font-bold opacity-75">{sec.subCount} تصنيف فرعي</span>
                  </div>
                  <div>
                    <h4 className="text-base font-black">{sec.title}</h4>
                    <p className="text-xs opacity-80 mt-0.5">{sec.titleAr}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MAIN BROWSE / SEARCH / FILTER INTERFACE */}
      {(activeMode === 'browse' ||
        activeMode === 'cefr' ||
        activeMode === 'sections' ||
        activeMode === 'grammar' ||
        activeMode === 'favorites' ||
        activeMode === 'difficult' ||
        activeMode === 'recent' ||
        activeMode === 'srs') && (
        <div className="space-y-6">
          {/* Intelligent Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-white/40 absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="ابحث بالإنجليزية، أو العامية المصرية (مثال: 'أنا كنت مستنيك')، أو القاعدة اللغوية، أو المفردات..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#16132b] border border-white/15 text-white placeholder:text-white/40 text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-right"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1/2 -translate-y-1/2 left-4 text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Semantic Nuance Explanation Banner (when user searches in Arabic) */}
          {semanticMatches.length > 0 && semanticMatches[0].nuanceExplanationAr && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1 text-right">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>إضاءة لغوية حول نتائج البحث:</span>
              </span>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                {semanticMatches[0].nuanceExplanationAr}
              </p>
            </div>
          )}

          {/* Results Counter & Pagination Controls */}
          <div className="flex items-center justify-between text-xs text-white/60 font-bold flex-wrap gap-2">
            <span>
              عرض {paginatedSentences.length} من أصل {currentSentencesPool.length} جملة
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 cursor-pointer"
                >
                  السابق
                </button>
                <span>صفحة {page} من {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 border border-white/10 cursor-pointer"
                >
                  التالي
                </button>
              </div>
            )}
          </div>

          {/* Sentence Cards Grid */}
          {paginatedSentences.length === 0 ? (
            <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-white/30 mx-auto" />
              <h4 className="text-lg font-bold text-white">لم يتم العثور على جمل مطابقة</h4>
              <p className="text-xs text-white/60">
                جرب تغيير خيارات التصفية أو استخدام كلمات بحث مختلفة.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedSentences.map(sentence => (
                <SentenceCard
                  key={sentence.id}
                  sentence={sentence}
                  onPracticeWithAi={() => onNavigate('ai-tutor')}
                />
              ))}
            </div>
          )}

          {/* Bottom Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-6 border-t border-white/10">
              <button
                onClick={() => {
                  setPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold text-xs cursor-pointer"
              >
                الصفحة السابقة
              </button>
              <span className="text-xs font-bold text-white/70">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => {
                  setPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold text-xs cursor-pointer"
              >
                الصفحة التالية
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
