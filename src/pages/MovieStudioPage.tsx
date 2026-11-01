// ==============================================================================
// Henglish Academy (HENGLISH) - LEARN ENGLISH THROUGH MOVIES STUDIO PAGE
// Premium video-based language learning studio:
// Mode A: Search Movie Scene by Sentence / Expression
// Mode B: YouTube Video Discovery & Smart Embedded Player
// ==============================================================================

import React, { useState, useMemo } from 'react';
import { PageRoute, CEFRLevel } from '../types';
import {
  MOVIE_SCENES_CATALOG,
  MovieSceneItem,
} from '../data/movieScenesData';
import {
  searchMovieScenesBySentence,
  MovieSearchResult,
  searchYouTubeEducationalScenes,
} from '../services/movieSearchService';
import { MoviePlayerStudio } from '../components/MoviePlayerStudio';
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
} from 'lucide-react';

interface MovieStudioPageProps {
  onNavigate: (route: PageRoute) => void;
}

type DiscoveryMode = 'mode-a-sentence' | 'mode-b-youtube';

export const MovieStudioPage: React.FC<MovieStudioPageProps> = ({ onNavigate }) => {
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>('mode-a-sentence');
  const [sentenceQuery, setSentenceQuery] = useState('');
  const [youtubeSearchQuery, setYoutubeSearchQuery] = useState('');
  const [customYoutubeUrl, setCustomYoutubeUrl] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | 'all'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string | 'all'>('all');
  const [activeScene, setActiveScene] = useState<MovieSceneItem | null>(null);

  // Search Results for Mode A
  const searchResults: MovieSearchResult[] = useMemo(() => {
    const raw = searchMovieScenesBySentence(sentenceQuery);
    return raw.filter(r => {
      if (selectedCefr !== 'all' && r.scene.cefrLevel !== selectedCefr) return false;
      if (selectedGenre !== 'all' && !r.scene.genre.toLowerCase().includes(selectedGenre.toLowerCase())) return false;
      return true;
    });
  }, [sentenceQuery, selectedCefr, selectedGenre]);

  // Extract unique genres for filtering
  const allGenres = useMemo(() => {
    const set = new Set<string>();
    MOVIE_SCENES_CATALOG.forEach(s => {
      s.genre.split('/').forEach(g => set.add(g.trim()));
    });
    return Array.from(set);
  }, []);

  // Quick Preset Queries for Sentence Search
  const sampleSentenceSearches = [
    "I'll be right back",
    "Life was like a box of chocolates",
    "An offer he can't refuse",
    "Seize the day",
    "What I do that defines me",
    "You had me at hello",
    "You gotta protect it",
  ];

  // Handle selecting a scene to play
  const handleSelectScene = (scene: MovieSceneItem) => {
    playSound('click');
    setActiveScene(scene);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Handle custom YouTube URL submission
  const handleLoadCustomYouTube = () => {
    if (!customYoutubeUrl.trim()) return;
    playSound('click');

    // Extract Video ID from URL (e.g. watch?v=ID, youtu.be/ID, or direct ID)
    let extractedId = customYoutubeUrl.trim();
    const urlMatch = customYoutubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (urlMatch && urlMatch[1]) {
      extractedId = urlMatch[1];
    }

    const customScene: MovieSceneItem = {
      id: `custom-${extractedId}`,
      movieTitle: 'Custom YouTube Educational Video',
      releaseYear: new Date().getFullYear(),
      director: 'YouTube Creator',
      genre: 'Education / English',
      cefrLevel: 'B1',
      sceneTitle: 'Custom Video Lesson',
      sceneDescription: 'Interactive educational player with real-time tools.',
      youtubeId: extractedId,
      startTime: 0,
      endTime: 600,
      clipDuration: 'Custom',
      videoSource: 'YouTube Official Embed',
      dialogueQuote: 'Interactive English Learning Session',
      actorName: 'English Speaker',
      characterName: 'Speaker',
      thumbnailUrl: `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`,
      subtitles: [
        {
          id: 'sub-cust-1',
          start: 0,
          end: 15,
          en: 'Welcome to this interactive movie English lesson. Listen carefully to the pronunciation.',
          arEg: 'أهلاً بيك في الدرس التعليمي التفاعلي. ركز واسمع النطق كويس جداً.',
          arFusha: 'مرحباً بك في هذا الدرس التعليمي التفاعلي، استمع جيداً إلى مخارج الحروف.',
          keyWords: [
            { word: 'pronunciation', ipa: '/prəˌnʌnsiˈeɪʃən/', meaningAr: 'النطق السليم', meaningEn: 'how words are spoken' },
          ],
        },
      ],
      vocabulary: [
        {
          term: 'listen carefully',
          type: 'collocation',
          meaningAr: 'استمع بتركيز وانتباه',
          meaningEn: 'pay close attention audibly',
          egyptianEquivalent: 'اسمع بتركيز ودقة',
          exampleInScene: 'Listen carefully to the actor.',
        },
      ],
      quizzes: [],
      speakingLines: [
        { en: 'Listen carefully to the pronunciation.', arEg: 'اسمع النطق وركز معاه كويس.' },
      ],
    };

    setActiveScene(customScene);
  };

  return (
    <div className="space-y-8 pb-16 text-right selection:bg-purple-500/30">
      {/* 1. HERO HEADER: Learn English Through Movies */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-white/10 bg-gradient-to-br from-[#1a1236] via-[#130f26] to-[#0c0a17] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-500/30">
                <Film className="w-3.5 h-3.5" />
                <span>LEARN ENGLISH THROUGH MOVIES STUDIO • اتعلم الإنجليزي من الأفلام</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                <span>استوديو السينما والإنجليزية الحقيقية 🎬</span>
              </h1>
              <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed">
                اكتشف كيف يتحدث المتحدثون الأصليون في أعظم مشاهد السينما العالمية. ترجمة عامية مصرية متزامنة، وتحليل للمصطلحات، ونطق تفاعلي واختبارات مشهدية مباشرة.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-2xl font-black text-white block">{MOVIE_SCENES_CATALOG.length}</span>
                <span className="text-[11px] font-bold text-white/60">مشهد كلاسيكي معتمد</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                <span className="text-2xl font-black text-red-400 block">100%</span>
                <span className="text-[11px] font-bold text-white/60">ترجمة مصرية متزامنة</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center col-span-2 sm:col-span-1">
                <span className="text-2xl font-black text-purple-400 block">YouTube</span>
                <span className="text-[11px] font-bold text-white/60">مشغل رسمي متكامل</span>
              </div>
            </div>
          </div>

          {/* TWO MAIN DISCOVERY MODES SWITCHER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                playSound('click');
                setDiscoveryMode('mode-a-sentence');
                setActiveScene(null);
              }}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                discoveryMode === 'mode-a-sentence'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-xl shadow-purple-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs font-black uppercase tracking-wider text-purple-200">النمط الأول (MODE A)</div>
                <div className="text-base font-black">ابحث عن مشهد بجملة أو تعبير 🔍</div>
                <div className="text-xs opacity-75">اكتب أي جملة إنجليزية وستجد المشهد السينمائي الحقيقي لها</div>
              </div>
              <Search className="w-6 h-6 shrink-0 opacity-80" />
            </button>

            <button
              onClick={() => {
                playSound('click');
                setDiscoveryMode('mode-b-youtube');
                setActiveScene(null);
              }}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center justify-between ${
                discoveryMode === 'mode-b-youtube'
                  ? 'bg-red-600 text-white border-red-400 shadow-xl shadow-red-600/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10'
              }`}
            >
              <div className="space-y-0.5">
                <div className="text-xs font-black uppercase tracking-wider text-red-200">النمط الثاني (MODE B)</div>
                <div className="text-base font-black">اختر فيديو من YouTube أو ألصق رابطه 📺</div>
                <div className="text-xs opacity-75">شاهد أي فيديو يوتيوب تعليمي داخل المشغل الذكي لـ Henglish</div>
              </div>
              <Video className="w-6 h-6 shrink-0 opacity-80" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. ACTIVE SCENE PLAYER (IF A SCENE IS CURRENTLY OPENED) */}
      {activeScene ? (
        <section className="space-y-4">
          <MoviePlayerStudio
            scene={activeScene}
            onBackToSearch={() => setActiveScene(null)}
          />
        </section>
      ) : (
        <>
          {/* 3. MODE A: SEARCH FOR A MOVIE SCENE BY SENTENCE */}
          {discoveryMode === 'mode-a-sentence' && (
            <section className="space-y-6">
              {/* Search Bar & Filters */}
              <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 bg-[#141124]">
                <div className="relative">
                  <Search className="w-5 h-5 text-white/40 absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none" />
                  <input
                    type="text"
                    value={sentenceQuery}
                    onChange={e => setSentenceQuery(e.target.value)}
                    placeholder="اكتب جزءاً من جملة أو تعبير (مثال: 'I'll be right back' أو 'box of chocolates' أو 'defines me')..."
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-black/40 border border-white/15 text-white placeholder:text-white/40 text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-right"
                  />
                  {sentenceQuery && (
                    <button
                      onClick={() => setSentenceQuery('')}
                      className="absolute top-1/2 -translate-y-1/2 left-4 text-white/40 hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Sample Queries */}
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-white/50 font-bold">جرب جمل أيقونية شهيرة:</span>
                  {sampleSentenceSearches.map((sample, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => {
                        playSound('click');
                        setSentenceQuery(sample);
                      }}
                      className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    >
                      "{sample}"
                    </button>
                  ))}
                </div>

                {/* Level and Genre Filters */}
                <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/10 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-white/50 font-bold">مستوى الصعوبة:</span>
                    {['all', 'A1', 'A2', 'B1', 'B2', 'C1'].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedCefr(lvl as any)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedCefr === lvl
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                        }`}
                      >
                        {lvl.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-white/50 font-bold">التصنيف الفني:</span>
                    <button
                      onClick={() => setSelectedGenre('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedGenre === 'all'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                      }`}
                    >
                      الكل
                    </button>
                    {allGenres.slice(0, 4).map(g => (
                      <button
                        key={g}
                        onClick={() => setSelectedGenre(g)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          selectedGenre === g
                            ? 'bg-purple-600 text-white'
                            : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search Results Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-white/60 font-bold">
                  <span>المشاهد السينمائية المطابقة ({searchResults.length} مشهد):</span>
                  <span>مرتبة وفقاً لدقة التعبير والسياق اللغوي</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center space-y-3">
                    <AlertCircle className="w-12 h-12 text-amber-400/50 mx-auto" />
                    <h4 className="text-lg font-bold text-white">لم يتم العثور على مشهد موثق لهذه العبارة</h4>
                    <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
                      حرصاً على المصداقية الأكاديمية والتعليمية، لا نقوم باختلاق مشاهد غير موثقة. جرب كتابة جزء من التعبير أو البحث في مكتبة اليوتيوب في النمط الثاني.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((res, idx) => {
                      const scene = res.scene;
                      return (
                        <div
                          key={scene.id}
                          className="rounded-3xl glass-panel border border-white/10 hover:border-purple-500/50 transition-all overflow-hidden flex flex-col justify-between group shadow-xl bg-[#151228]"
                        >
                          {/* Thumbnail Box */}
                          <div
                            className="relative aspect-video w-full overflow-hidden bg-black/80 cursor-pointer"
                            onClick={() => handleSelectScene(scene)}
                          >
                            <img
                              src={scene.thumbnailUrl}
                              alt={scene.movieTitle}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                                <Play className="w-6 h-6 fill-current translate-x-0.5" />
                              </div>
                            </div>
                            <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-xs">
                              {scene.clipDuration}
                            </span>
                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-purple-600 text-white font-black text-xs shadow-md">
                              {scene.cefrLevel}
                            </span>
                          </div>

                          {/* Scene Metadata & Quote */}
                          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between text-right">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs text-white/50">
                                <span className="font-bold">{scene.genre}</span>
                                <span>{scene.releaseYear}</span>
                              </div>
                              <h3 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                                {scene.movieTitle}
                              </h3>
                              <p className="text-xs text-white/60 line-clamp-2">
                                {scene.sceneDescription}
                              </p>
                            </div>

                            {/* Dialogue Quote Spotlight */}
                            <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>الاقتباس المحوري:</span>
                              </span>
                              <p className="text-xs font-bold text-white text-left italic">
                                "{scene.dialogueQuote}"
                              </p>
                              <span className="text-[11px] text-white/40 block text-left">
                                — {scene.characterName} ({scene.actorName})
                              </span>
                            </div>

                            {/* Play Button */}
                            <button
                              onClick={() => handleSelectScene(scene)}
                              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer mt-2"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>ابدأ المشاهدة والتعلم التفاعلي</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 4. MODE B: CHOOSE A VIDEO FROM YOUTUBE & SMART EMBED */}
          {discoveryMode === 'mode-b-youtube' && (
            <section className="space-y-6">
              {/* Paste URL or Search YouTube */}
              <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6 bg-[#161228]">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-500/30">
                    YouTube IFrame Player Integration
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    ألصق رابط أي مقطع من يوتيوب، أو ابحث في المقاطع التعليمية الموصى بها:
                  </h3>
                  <p className="text-xs text-white/60">
                    يتم تشغيل الفيديو عبر المشغل الرسمي لـ YouTube مع الحفاظ التام على حقوق النشر وبناء أدوات Henglish الذكية حوله.
                  </p>
                </div>

                {/* Paste URL Input */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={customYoutubeUrl}
                      onChange={e => setCustomYoutubeUrl(e.target.value)}
                      placeholder="ألصق رابط فيديو من يوتيوب هنا (مثال: https://www.youtube.com/watch?v=fmX2Vzs84Z8)..."
                      className="w-full px-4 py-3.5 rounded-2xl bg-black/40 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-red-500 transition-all text-right font-mono"
                    />
                  </div>
                  <button
                    onClick={handleLoadCustomYouTube}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-sm transition-all shadow-lg shadow-red-600/30 shrink-0 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>تشغيل في الاستوديو الذكي</span>
                  </button>
                </div>
              </div>

              {/* Recommended Curated Movie Clips Directory */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-white/60 font-bold">
                  <span>مقاطع يوتيوب سينمائية وتعليمية منتقاة:</span>
                  <span>جاهزة للمشاهدة مع الترجمة المصرية الفورية</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOVIE_SCENES_CATALOG.map(scene => (
                    <div
                      key={scene.id}
                      onClick={() => handleSelectScene(scene)}
                      className="rounded-3xl glass-panel border border-white/10 hover:border-red-500/50 transition-all overflow-hidden cursor-pointer group shadow-xl bg-[#141124] flex flex-col justify-between"
                    >
                      <div className="relative aspect-video w-full bg-black/80">
                        <img
                          src={scene.thumbnailUrl}
                          alt={scene.movieTitle}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current translate-x-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[11px]">
                          {scene.clipDuration}
                        </span>
                      </div>

                      <div className="p-4 space-y-2 text-right">
                        <div className="flex items-center justify-between text-[11px] text-white/50">
                          <span className="font-bold text-red-400">{scene.videoSource}</span>
                          <span>{scene.releaseYear}</span>
                        </div>
                        <h4 className="text-base font-black text-white group-hover:text-red-300 transition-colors">
                          {scene.movieTitle}
                        </h4>
                        <p className="text-xs text-amber-300 font-bold truncate">
                          "{scene.dialogueQuote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
