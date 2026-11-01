// ==============================================================================
// Henglish Academy (HENGLISH) - LEARN ENGLISH THROUGH MOVIES & VIDEOS STUDIO
// Unlimited dynamic video catalog, 20 video categories, YouTube API discovery,
// verified player, bilingual Egyptian subtitles, and educational importer
// ==============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { PageRoute, CEFRLevel } from '../types';
import {
  MOVIE_SCENES_CATALOG,
  MovieSceneItem,
} from '../data/movieScenesData';
import {
  searchMovieScenesBySentence,
  MovieSearchResult,
} from '../services/movieSearchService';
import {
  EducationalVideoItem,
  queryVideoCatalog,
  VIDEO_20_CATEGORIES,
  VideoCategoryType,
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory,
  getSavedVideos,
  toggleSaveVideo,
  isVideoSaved,
  getRecentlyWatched,
  addRecentlyWatched,
  getStoredVideos,
} from '../../src/services/videoLibraryService';
import { searchYouTubeVideos, SearchDiscoveryResponse, YouTubeApiSearchResult } from '../services/youtubeSearchService';
import { MoviePlayerStudio } from '../components/MoviePlayerStudio';
import { EducationalVideoImportModal } from '../components/video/EducationalVideoImportModal';
import { AdminVideoManagementModal } from '../components/video/AdminVideoManagementModal';
import { playSound } from '../utils/audio';
import {
  Film,
  Search,
  Sparkles,
  Play,
  Clock,
  Award,
  Video,
  Languages,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  Flame,
  CheckCircle2,
  X,
  Compass,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Plus,
  RefreshCw,
  Globe,
  Loader2,
  History,
  Tv,
  Smile,
  Mic,
  MessageCircle,
  Users,
  Headphones,
  Briefcase,
  Plane,
  GraduationCap,
  Volume2,
  BookOpen,
  Zap,
  Ear,
} from 'lucide-react';

interface MovieStudioPageProps {
  onNavigate: (route: PageRoute) => void;
}

type MainTab = 'catalog' | 'youtube_search' | 'sentence_search' | 'saved_and_history';

export const MovieStudioPage: React.FC<MovieStudioPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('catalog');
  const [activeScene, setActiveScene] = useState<MovieSceneItem | null>(null);

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Dynamic Catalog State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VideoCategoryType | 'all'>('all');
  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | 'all'>('all');
  const [selectedAccent, setSelectedAccent] = useState<'all' | 'American' | 'British' | 'International'>('all');
  const [catalogPage, setCatalogPage] = useState(1);
  const catalogPageSize = 9;

  // Search History State
  const [searchHistory, setSearchHistory] = useState<string[]>(() => getSearchHistory());

  // Saved and Watched State
  const [savedVideos, setSavedVideos] = useState<EducationalVideoItem[]>(() => getSavedVideos());
  const [recentlyWatched, setRecentlyWatched] = useState<EducationalVideoItem[]>(() => getRecentlyWatched());

  // YouTube API Search State
  const [ytQuery, setYtQuery] = useState('');
  const [ytResults, setYtResults] = useState<SearchDiscoveryResponse | null>(null);
  const [isYtSearching, setIsYtSearching] = useState(false);
  const [ytNextPageToken, setYtNextPageToken] = useState<string | undefined>(undefined);
  const [ytPrevPageToken, setYtPrevPageToken] = useState<string | undefined>(undefined);

  // Sentence Search (Mode A)
  const [sentenceQuery, setSentenceQuery] = useState('');

  // Catalog update counter for reactivity
  const [catalogUpdateCounter, setCatalogUpdateCounter] = useState(0);

  // Refresh user lists
  const refreshUserLists = () => {
    setSavedVideos(getSavedVideos());
    setRecentlyWatched(getRecentlyWatched());
    setSearchHistory(getSearchHistory());
  };

  // Reset page when filters change
  useEffect(() => {
    setCatalogPage(1);
  }, [searchQuery, selectedCategory, selectedCefr, selectedAccent]);

  // Execute Catalog Query
  const catalogResults = useMemo(() => {
    return queryVideoCatalog({
      query: searchQuery,
      category: selectedCategory,
      cefr: selectedCefr,
      accent: selectedAccent,
      page: catalogPage,
      pageSize: catalogPageSize,
    });
  }, [searchQuery, selectedCategory, selectedCefr, selectedAccent, catalogPage, catalogUpdateCounter]);

  // Execute Sentence Search
  const sentenceResults: MovieSearchResult[] = useMemo(() => {
    return searchMovieScenesBySentence(sentenceQuery);
  }, [sentenceQuery]);

  // Handle Search Submission
  const handlePerformSearch = (q: string) => {
    if (q.trim()) {
      addSearchHistory(q);
      setSearchHistory(getSearchHistory());
    }
    setSearchQuery(q);
  };

  // Handle YouTube Search
  const handleSearchYouTube = async (token?: string) => {
    if (!ytQuery.trim()) return;
    setIsYtSearching(true);
    playSound('click');
    addSearchHistory(ytQuery);
    setSearchHistory(getSearchHistory());

    try {
      const res = await searchYouTubeVideos(ytQuery, token);
      setYtResults(res);
      setYtNextPageToken(res.nextPageToken);
      setYtPrevPageToken(res.prevPageToken);
      playSound('success');
    } catch (err) {
      console.error('YouTube search error:', err);
    } finally {
      setIsYtSearching(false);
    }
  };

  // Handle Playing a Video in the Studio Player
  const handleSelectScene = (scene: MovieSceneItem) => {
    playSound('click');
    setActiveScene(scene);
    addRecentlyWatched(scene as EducationalVideoItem);
    refreshUserLists();
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Play a YouTube result on the fly
  const handlePlayYouTubeResult = (item: YouTubeApiSearchResult) => {
    playSound('click');
    const tempScene: EducationalVideoItem = {
      id: `live-${item.youtubeId}`,
      movieTitle: item.title,
      releaseYear: new Date(item.publishedAt).getFullYear() || 2024,
      director: item.channelTitle,
      genre: 'YouTube Learning',
      cefrLevel: 'B1',
      sceneTitle: item.title,
      sceneDescription: item.description,
      youtubeId: item.youtubeId,
      startTime: 0,
      endTime: 120,
      clipDuration: 'Live',
      videoSource: item.channelTitle,
      dialogueQuote: item.title,
      actorName: item.channelTitle,
      characterName: 'Speaker',
      thumbnailUrl: item.thumbnailUrl,
      category: 'interviews',
      accent: 'American',
      verificationStatus: 'verified_playable',
      lastVerifiedAt: new Date().toISOString(),
      isEmbeddable: true,
      contentSource: 'YouTube Discovery',
      subtitles: [],
      vocabulary: [],
      quizzes: [],
      speakingLines: [],
    };

    setActiveScene(tempScene);
    addRecentlyWatched(tempScene);
    refreshUserLists();
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleToggleBookmark = (v: EducationalVideoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    playSound('click');
    const res = toggleSaveVideo(v);
    setSavedVideos(res.list);
    if (res.isSaved) playSound('success');
  };

  return (
    <div className="space-y-10 pb-16 text-right">
      {/* 1. ACADEMY HERO & STUDIO BANNER */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#1a1233] via-[#120e25] to-[#090715] shadow-2xl">
        <div className="absolute top-0 left-10 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-red-600/20 text-red-300 border border-red-500/30">
              <Film className="w-4 h-4 text-red-400" />
              <span>HINAWI CINEMA & VIDEO STUDIO • استوديو الفيديو والسينما الذكي</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('click');
                  setIsImportModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-[#c4ff55] text-[#09091a] hover:bg-[#d5ff78] transition-all cursor-pointer shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>استيراد مقطع تعليمي</span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setIsAdminModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white/90 border border-white/10 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#ffd166]" />
                <span>إدارة وتدقيق الروابط</span>
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            استوديو الفيديو والأفلام الإنجليزية المفتوح 🎬
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            مكتبة سينمائية وتعليمية غير محدودة تغطي <strong>20 تخصصاً ومجالاً حوارياً</strong> (مشاهد هوليوود، مسلسلات كوميدية، محادثات شارع، بودكاست، وخطابات تيد)، مع ترجمة مصرية سياقية متزامنة، وتحليل للكلمات الصعبة وتمارين استماع تفاعلية.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('catalog');
                setActiveScene(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'catalog'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>المكتبة الذكية المتوسعة ({catalogResults.totalMatches} مقطع)</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('youtube_search');
                setActiveScene(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'youtube_search'
                  ? 'bg-[#41e7ff] text-[#09091a] shadow-lg shadow-[#41e7ff]/20'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>البحث والاستكشاف عبر YouTube API</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('sentence_search');
                setActiveScene(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'sentence_search'
                  ? 'bg-[#ffd166] text-[#09091a] shadow-lg shadow-[#ffd166]/20'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>البحث بجمل واقتباسات الأفلام</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                setActiveTab('saved_and_history');
                setActiveScene(null);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'saved_and_history'
                  ? 'bg-[#c4ff55] text-[#09091a] shadow-lg shadow-[#c4ff55]/20'
                  : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>المحفوظات وسجل المشاهدة ({savedVideos.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. ACTIVE VIDEO PLAYER STUDIO VIEW */}
      {activeScene ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveScene(null)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لتصفح مكتبة المقاطع</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60 font-bold">المقطع النشط:</span>
              <span className="font-black text-[#c4ff55] text-xs sm:text-sm">
                {activeScene.movieTitle} — {activeScene.sceneTitle}
              </span>
            </div>
          </div>

          <MoviePlayerStudio
            scene={activeScene}
            onBackToSearch={() => setActiveScene(null)}
          />
        </section>
      ) : (
        <>
          {/* TAB 1: DYNAMIC EXPANDABLE VIDEO CATALOG ACROSS 20 CATEGORIES */}
          {activeTab === 'catalog' && (
            <section className="space-y-8">
              {/* Category Selector Pills (20 Categories) */}
              <div className="space-y-3 glass-panel p-5 rounded-3xl border border-white/10">
                <div className="flex items-center justify-between text-xs text-white/60 font-bold">
                  <span>تصفح حسب فئات الاستوديو العشرين (20 Learning Categories):</span>
                  <span className="text-[#41e7ff]">اختر الفئة للتصفية الفورية</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  <button
                    onClick={() => {
                      playSound('click');
                      setSelectedCategory('all');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer border ${
                      selectedCategory === 'all'
                        ? 'bg-red-600 text-white border-red-500 shadow-md'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/5'
                    }`}
                  >
                    جميع الفئات (All Categories)
                  </button>

                  {VIDEO_20_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        playSound('click');
                        setSelectedCategory(cat.id);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? 'bg-[#c4ff55]/20 text-[#c4ff55] border-[#c4ff55]/50 shadow-sm'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/5'
                      }`}
                    >
                      <span>{cat.nameAr}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar & Multi-Filters */}
              <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-red-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    dir="auto"
                    value={searchQuery}
                    onChange={e => handlePerformSearch(e.target.value)}
                    placeholder="ابحث بالعنوان، الممثل، الحوار، الإيديوم، أو الاقتباس (Godfather, chocolate, Will Smith...)"
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-white/40 text-sm font-sans focus:outline-none focus:border-red-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handlePerformSearch('')}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 text-white/70 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Search History Chips */}
                {searchHistory.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto text-xs text-white/60">
                    <History className="w-3.5 h-3.5 shrink-0 text-white/40" />
                    <span className="shrink-0 text-[11px]">عمليات بحث سابقة:</span>
                    {searchHistory.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handlePerformSearch(item)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 shrink-0 text-[11px] font-sans"
                      >
                        {item}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        clearSearchHistory();
                        setSearchHistory([]);
                      }}
                      className="text-[10px] text-red-400 hover:underline shrink-0 mr-2"
                    >
                      مسح السجل
                    </button>
                  </div>
                )}

                {/* Filter Dropdowns (CEFR, Accent) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/10">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/60">المستوى الأوروبي (CEFR Level)</label>
                    <select
                      value={selectedCefr}
                      onChange={e => setSelectedCefr(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="all">جميع المستويات (A1 - C2)</option>
                      <option value="A1">A1 - مبتدئ</option>
                      <option value="A2">A2 - أساسي</option>
                      <option value="B1">B1 - متوسط</option>
                      <option value="B2">B2 - فوق المتوسط</option>
                      <option value="C1">C1 - متقدم</option>
                      <option value="C2">C2 - طلاقة تامة</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-white/60">اللكنة والأسلوب (Accent)</label>
                    <select
                      value={selectedAccent}
                      onChange={e => setSelectedAccent(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-xs font-bold text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="all">جميع اللكنات</option>
                      <option value="American">American 🇺🇸 (أمريكية)</option>
                      <option value="British">British 🇬🇧 (بريطانية)</option>
                      <option value="International">International 🌐 (دولية)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Videos Grid */}
              {catalogResults.videos.length === 0 ? (
                <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4">
                  <Film className="w-12 h-12 text-white/30 mx-auto" />
                  <h4 className="text-xl font-black text-white">لم يتم العثور على مقاطع مطابقة</h4>
                  <p className="text-xs text-white/60 max-w-md mx-auto">
                    جرّب البحث بكلمات أخرى أو تغيير الفلاتر، أو استخدم ميزة "استيراد مقطع تعليمي" لإضافة أي فيديو ترغب فيه فوراً.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catalogResults.videos.map(scene => {
                      const isSaved = isVideoSaved(scene.youtubeId);
                      return (
                        <div
                          key={scene.id}
                          onClick={() => handleSelectScene(scene)}
                          className="glass-panel rounded-3xl border border-white/10 hover:border-red-500/50 transition-all overflow-hidden cursor-pointer group shadow-xl bg-[#141124] flex flex-col justify-between"
                        >
                          {/* Video Thumbnail with Badges */}
                          <div className="relative aspect-video w-full bg-black/80 overflow-hidden">
                            <img
                              src={scene.thumbnailUrl || `https://img.youtube.com/vi/${scene.youtubeId}/hqdefault.jpg`}
                              alt={scene.movieTitle}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 fill-current translate-x-0.5" />
                              </div>
                            </div>

                            {/* Top Badges */}
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[#ffd166] text-[10px] font-black uppercase border border-white/10">
                                {scene.cefrLevel}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                                {scene.accent === 'American' ? 'US 🇺🇸' : scene.accent === 'British' ? 'UK 🇬🇧' : '🌐'}
                              </span>
                            </div>

                            {/* Bookmark Button */}
                            <button
                              onClick={e => handleToggleBookmark(scene, e)}
                              className="absolute top-2.5 left-2.5 p-1.5 rounded-lg bg-black/75 backdrop-blur-md text-white/80 hover:text-white transition-colors"
                              title={isSaved ? 'إزالة من المحفوظات' : 'حفظ المقطع'}
                            >
                              {isSaved ? (
                                <BookmarkCheck className="w-4 h-4 text-[#c4ff55]" />
                              ) : (
                                <Bookmark className="w-4 h-4" />
                              )}
                            </button>

                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px]">
                              {scene.clipDuration}
                            </span>
                          </div>

                          {/* Scene Meta Info */}
                          <div className="p-5 space-y-3 text-right">
                            <div className="flex items-center justify-between text-[11px] text-white/50">
                              <span className="font-bold text-red-400">{scene.videoSource}</span>
                              <span>{scene.releaseYear}</span>
                            </div>

                            <div>
                              <h4 className="text-base font-black text-white group-hover:text-red-300 transition-colors line-clamp-1">
                                {scene.movieTitle} — {scene.sceneTitle}
                              </h4>
                              <p className="text-xs text-white/60 line-clamp-1 mt-0.5">
                                {scene.sceneDescription}
                              </p>
                            </div>

                            {/* Dialogue Spotlight Quote */}
                            {scene.dialogueQuote && (
                              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                                <span className="text-[10px] font-black text-amber-300 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>الاقتباس المحوري:</span>
                                </span>
                                <p className="text-xs font-bold text-white text-left italic font-sans" dir="ltr">
                                  "{scene.dialogueQuote}"
                                </p>
                              </div>
                            )}

                            {/* Start Interactive Learning */}
                            <button
                              onClick={() => handleSelectScene(scene)}
                              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>ابدأ المشاهدة والتعلم التفاعلي</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {catalogResults.totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/10">
                      <span className="text-xs text-white/60 font-bold">
                        صفحة <strong className="text-white">{catalogResults.page}</strong> من{' '}
                        <strong className="text-white">{catalogResults.totalPages}</strong> ({catalogResults.totalMatches} مقطع)
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            playSound('click');
                            setCatalogPage(p => Math.max(1, p - 1));
                          }}
                          disabled={catalogResults.page <= 1}
                          className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white disabled:opacity-30 cursor-pointer flex items-center gap-1"
                        >
                          <ChevronRight className="w-4 h-4" />
                          <span>السابق</span>
                        </button>

                        <button
                          onClick={() => {
                            playSound('click');
                            setCatalogPage(p => Math.min(catalogResults.totalPages, p + 1));
                          }}
                          disabled={catalogResults.page >= catalogResults.totalPages}
                          className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white disabled:opacity-30 cursor-pointer flex items-center gap-1"
                        >
                          <span>التالي</span>
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* TAB 2: YOUTUBE DATA API DYNAMIC SEARCH */}
          {activeTab === 'youtube_search' && (
            <section className="space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4 bg-linear-to-b from-[#18122a] to-[#0f0b1c]">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/30">
                    <Globe className="w-3.5 h-3.5" />
                    <span>YouTube Data API v3 Dynamic Discovery</span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    ابحث في بحر فيديوهات يوتيوب العالمية واستورد أي مشهد أو مقابلة فوراً
                  </h3>
                  <p className="text-xs text-white/60">
                    محرك بحث آمن يتحقق تلقائياً من قابلية التضمين والتشغيل ويمنع ظهور الروابط المعطلة.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-[#41e7ff] absolute right-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={ytQuery}
                      onChange={e => setYtQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearchYouTube()}
                      placeholder="ابحث عن مشهد، ممثل، موضوع، أو بودكاست (e.g. Steve Jobs speech, Friends pivot, London interview...)"
                      className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#41e7ff]"
                    />
                  </div>
                  <button
                    onClick={() => handleSearchYouTube()}
                    disabled={isYtSearching || !ytQuery.trim()}
                    className="px-6 py-3.5 rounded-2xl bg-[#41e7ff] text-[#09091a] font-black text-sm hover:bg-[#6eefff] transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
                  >
                    {isYtSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    <span>بحث YouTube</span>
                  </button>
                </div>

                {ytResults?.message && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#ffd166] shrink-0" />
                    <span>{ytResults.message}</span>
                  </div>
                )}
              </div>

              {/* YouTube Search Results Grid */}
              {ytResults && ytResults.items.length > 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ytResults.items.map(item => (
                      <div
                        key={item.youtubeId}
                        className="glass-panel rounded-3xl border border-white/10 hover:border-[#41e7ff]/50 transition-all overflow-hidden flex flex-col justify-between"
                      >
                        <div className="relative aspect-video w-full bg-black">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handlePlayYouTubeResult(item)}
                            className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-colors group cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-full bg-[#41e7ff] text-[#09091a] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current translate-x-0.5" />
                            </div>
                          </button>
                        </div>

                        <div className="p-5 space-y-3 text-right">
                          <div className="text-[11px] text-white/50">{item.channelTitle}</div>
                          <h4 className="text-sm font-black text-white line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="text-xs text-white/60 line-clamp-2">
                            {item.description}
                          </p>

                          <div className="flex gap-2 pt-2 border-t border-white/10">
                            <button
                              onClick={() => handlePlayYouTubeResult(item)}
                              className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>تشغيل فوري</span>
                            </button>

                            <button
                              onClick={() => {
                                setIsImportModalOpen(true);
                              }}
                              className="px-3 py-2 rounded-xl bg-[#c4ff55]/20 hover:bg-[#c4ff55]/30 text-[#c4ff55] border border-[#c4ff55]/40 font-bold text-xs transition-colors cursor-pointer"
                              title="استيراد للمكتبة مع إضافة الترجمة والتصنيف"
                            >
                              استيراد تعليمي
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* YouTube Pagination */}
                  {(ytNextPageToken || ytPrevPageToken) && (
                    <div className="flex items-center justify-center gap-3">
                      {ytPrevPageToken && (
                        <button
                          onClick={() => handleSearchYouTube(ytPrevPageToken)}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1"
                        >
                          <ChevronRight className="w-4 h-4" />
                          <span>الصفحة السابقة</span>
                        </button>
                      )}
                      {ytNextPageToken && (
                        <button
                          onClick={() => handleSearchYouTube(ytNextPageToken)}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1"
                        >
                          <span>الصفحة التالية</span>
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* TAB 3: SEARCH BY SENTENCE / QUOTE (MODE A) */}
          {activeTab === 'sentence_search' && (
            <section className="space-y-6">
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30">
                    Sentence & Idiom Matcher
                  </span>
                  <h3 className="text-xl font-black text-white">
                    ابحث عن الجملة أو التعبير لمشاهدة الممثلين ينطقونها في السينما
                  </h3>
                </div>

                <div className="relative">
                  <Search className="w-5 h-5 text-[#ffd166] absolute right-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={sentenceQuery}
                    onChange={e => setSentenceQuery(e.target.value)}
                    placeholder="اكتب أي جملة بالإنجليزي أو العربي (e.g. Seize the day, I'll be back, عرض لا يمكن رفضه...)"
                    className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#ffd166]"
                  />
                </div>

                {/* Preset Suggestions */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-white/50">اقتراحات شهيرة:</span>
                  {[
                    "I'll be back",
                    "Life was like a box of chocolates",
                    "An offer he can't refuse",
                    "Seize the day",
                    "What I do that defines me",
                    "You had me at hello",
                    "Stay hungry, stay foolish",
                  ].map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setSentenceQuery(preset)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-xs font-sans"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Matched Scenes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sentenceResults.map(res => (
                  <div
                    key={res.scene.id}
                    onClick={() => handleSelectScene(res.scene)}
                    className="glass-panel rounded-3xl border border-white/10 hover:border-[#ffd166]/50 p-5 space-y-3 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#ffd166]">{res.scene.movieTitle}</span>
                        <span className="text-white/40">{res.matchType}</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#ffd166]/10 border border-[#ffd166]/20 text-xs">
                        <span className="text-white/50 block text-[10px]">الجملة المطابقة في المشهد:</span>
                        <strong className="text-white block font-sans mt-0.5" dir="ltr">
                          "{res.matchedQuote || res.scene.dialogueQuote}"
                        </strong>
                      </div>

                      <p className="text-xs text-white/70 line-clamp-2">
                        {res.scene.sceneDescription}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectScene(res.scene)}
                      className="w-full py-2.5 rounded-xl bg-[#ffd166] text-[#09091a] font-black text-xs hover:bg-[#ffe18d] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>مشاهدة نطق الجملة في المشهد</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 4: SAVED BOOKMARKS & RECENTLY WATCHED */}
          {activeTab === 'saved_and_history' && (
            <section className="space-y-8">
              {/* Saved Videos Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <BookmarkCheck className="w-5 h-5 text-[#c4ff55]" />
                    <span>مقاطعي المفضلة والمحفوظة ({savedVideos.length})</span>
                  </h3>
                </div>

                {savedVideos.length === 0 ? (
                  <div className="p-8 rounded-2xl glass-panel border border-white/10 text-center text-xs text-white/50">
                    لم تقم بحفظ أي مقاطع بعد. انقر على أيقونة الإشارة المرجعية (Bookmark) على أي فيديو لحفظه هنا.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedVideos.map(video => (
                      <div
                        key={video.id}
                        onClick={() => handleSelectScene(video)}
                        className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-[#c4ff55]/50 transition-all cursor-pointer flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                            alt={video.sceneTitle}
                            className="w-24 h-16 object-cover rounded-xl shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-white text-xs line-clamp-1">{video.sceneTitle}</h4>
                            <p className="text-[11px] text-white/50">{video.movieTitle}</p>
                            <span className="text-[10px] text-[#c4ff55] font-bold">{video.cefrLevel}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSelectScene(video)}
                          className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                        >
                          متابعة المشاهدة
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recently Watched Section */}
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#ffd166]" />
                    <span>سجل المشاهدة الأخير ({recentlyWatched.length})</span>
                  </h3>
                </div>

                {recentlyWatched.length === 0 ? (
                  <div className="p-8 rounded-2xl glass-panel border border-white/10 text-center text-xs text-white/50">
                    لا يوجد سجل مشاهدات سابقة حتى الآن.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentlyWatched.map(video => (
                      <div
                        key={video.id}
                        onClick={() => handleSelectScene(video)}
                        className="p-3 rounded-2xl glass-panel border border-white/10 hover:border-white/25 transition-all cursor-pointer flex items-center gap-3"
                      >
                        <img
                          src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                          alt={video.sceneTitle}
                          className="w-16 h-12 object-cover rounded-xl shrink-0"
                        />
                        <div className="space-y-0.5 overflow-hidden">
                          <h5 className="font-bold text-white text-xs truncate">{video.sceneTitle}</h5>
                          <p className="text-[10px] text-white/50 truncate">{video.movieTitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* MODAL 1: SMART EDUCATIONAL VIDEO IMPORT MODAL */}
      <EducationalVideoImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={newVideo => {
          setCatalogUpdateCounter(c => c + 1);
          handleSelectScene(newVideo);
        }}
      />

      {/* MODAL 2: ADMIN VIDEO MANAGEMENT CONSOLE */}
      <AdminVideoManagementModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onCatalogChanged={() => setCatalogUpdateCounter(c => c + 1)}
      />
    </div>
  );
};
