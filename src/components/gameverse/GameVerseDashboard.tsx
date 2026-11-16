// ==============================================================================
// HENGLISH ACADEMY - GAMEVERSE EXPANDABLE DASHBOARD
// Complete educational gaming arena with 30+ verified playable challenges
// ==============================================================================

import React, { useState } from 'react';
import {
  Gamepad2,
  Swords,
  Users,
  Search,
  Sparkles,
  Trophy,
  Zap,
  Timer,
  Layers,
  ChevronLeft,
  Flame,
  Shield,
  ArrowRight,
  Target,
  Scale,
  Link2,
  Drama,
  Compass,
  Gem,
  FlaskConical,
  Handshake,
  Puzzle,
  Crosshair,
  Building2,
  RefreshCw,
  Repeat2,
  HardHat,
  ScanSearch,
  Bug,
  Mic,
  Headphones,
  Music4,
  AudioLines,
  Ear,
  PenLine,
  ListMusic,
  Globe2,
  BookOpen,
  Newspaper,
} from 'lucide-react';
import { playSound } from '../../utils/audio';
import { COMPLETE_GAMES_CATALOG, GameDefinition, GameCategory } from '../../data/gamesCatalogData';
import { txText, useAppTextMap } from '../../services/contentI18nService';

interface GameVerseDashboardProps {
  onSelectGame: (gameId: string) => void;
  onOpenMultiplayer: () => void;
}

const GAME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'vocab-rush': Zap,
  'word-detective': Search,
  'synonym-hunter': Target,
  'antonym-arena': Scale,
  'word-association': Link2,
  'context-master': Drama,
  'phrasal-quest': Compass,
  'idiom-explorer': Gem,
  'word-formation': FlaskConical,
  'collocation-challenge': Handshake,
  'sentence-builder': Puzzle,
  'error-hunter': Crosshair,
  'v3-blitz': Zap,
  'grammar-tower': Building2,
  'tense-switch': RefreshCw,
  'passive-converter': Repeat2,
  'conditional-architect': HardHat,
  'grammar-detective': ScanSearch,
  'spelling-bee': Bug,
  'pronunciation-arena': Mic,
  'minimal-pairs': Headphones,
  'stress-detective': Music4,
  'phoneme-match': AudioLines,
  'listening-detective': Ear,
  'dictation-challenge': PenLine,
  'listening-gap-fill': ListMusic,
  'accent-detective': Globe2,
  'reading-speedster': BookOpen,
  'paragraph-builder': Newspaper,
  'story-completion': Compass,
  'ai-duel': Swords,
  'flashcards': Layers,
};

export const GameVerseDashboard: React.FC<GameVerseDashboardProps> = ({
  onSelectGame,
  onOpenMultiplayer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const appText = useAppTextMap('gamesCatalogData');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const counts: Record<string, number> = {
    all: COMPLETE_GAMES_CATALOG.length,
    vocabulary: COMPLETE_GAMES_CATALOG.filter(g => g.category === 'vocabulary').length,
    grammar: COMPLETE_GAMES_CATALOG.filter(g => g.category === 'grammar').length,
    spelling: COMPLETE_GAMES_CATALOG.filter(g => g.category === 'spelling').length,
    listening: COMPLETE_GAMES_CATALOG.filter(g => g.category === 'listening').length,
    reading: COMPLETE_GAMES_CATALOG.filter(g => g.category === 'reading').length,
    competitive: COMPLETE_GAMES_CATALOG.filter(g => g.category === 'competitive').length,
  };

  const categories = [
    { id: 'all', label: `جميع الألعاب (${counts.all})`, icon: '' },
    { id: 'vocabulary', label: `المفردات (${counts.vocabulary})`, icon: '' },
    { id: 'grammar', label: `القواعد (${counts.grammar})`, icon: '' },
    { id: 'spelling', label: `التهجئة والأصوات (${counts.spelling})`, icon: '' },
    { id: 'listening', label: `الاستماع (${counts.listening})`, icon: '' },
    { id: 'reading', label: `القراءة والتعبير (${counts.reading})`, icon: '' },
    { id: 'competitive', label: `المبارزة والمنافسة (${counts.competitive})`, icon: '' },
  ];

  const filteredGames = COMPLETE_GAMES_CATALOG.filter(game => {
    const matchesCat = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      game.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 text-right">
      
      {/* Featured Arena Banner */}
      <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl bg-linear-to-r from-[#171632] via-[#211b47] to-[#121124] border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HENGLISH GAMEVERSE • كبرى ساحات الألعاب التعليمية المستقلة ({COMPLETE_GAMES_CATALOG.length} لعبة موثقة)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Cairo',sans-serif] leading-tight">
              ألعاب تفاعلية حقيقية مبنية على أقوى قواعد البيانات اللغوية
            </h2>
            <p className="text-xs sm:text-sm text-[#b9b6d5] leading-relaxed">
              تحديات لغوية ونحوية حقيقية غير مكررة مولدة ديناميكياً من 5,000 كلمة و 10,000 تعبير و 5,000 جملة وقواعد اللغة الشاملة. العب بمفردك، أو بارز الروبوتات، أو تحدَّ زملاءك في غرف جماعية بالوقت الحقيقي!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => {
                playSound('click');
                onSelectGame('ai-duel');
              }}
              className="py-3 px-6 rounded-2xl bg-linear-to-r from-[#ff4f9a] to-[#9b7bff] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition-transform hover:scale-105"
            >
              <Swords className="w-4 h-4 text-[#ffd166]" />
              <span>مبارزة الروبوتات</span>
            </button>

            <button
              onClick={() => {
                playSound('click');
                onOpenMultiplayer();
              }}
              className="py-3 px-6 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#121124] font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:brightness-110 transition-transform hover:scale-105"
            >
              <Users className="w-4 h-4" />
              <span>الغرفة الجماعية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Category Filter */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Categories Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  playSound('click');
                  setSelectedCategory(cat.id);
                }}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#41e7ff] text-[#0c0b20] font-black shadow-md'
                    : 'bg-white/5 text-[#b9b6d5] hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابحث عن لعبة أو مهارة..."
              className="w-full py-2 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:border-[#41e7ff] outline-none transition-colors"
            />
          </div>

        </div>
      </div>

      {/* Games Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredGames.map(game => (
          <div
            key={game.id}
            onClick={() => {
              playSound('click');
              onSelectGame(game.id);
            }}
            className="p-5 rounded-3xl bg-linear-to-b from-[#171632] to-[#121124] border border-white/10 hover:border-[#ffd166]/40 transition-all cursor-pointer space-y-4 group hover:scale-[1.02] shadow-xl flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header Icon & Badges */}
              <div className="flex items-center justify-between">
                <span className="p-2.5 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform inline-flex">
                  {(() => { const GameIcon = GAME_ICONS[game.id] || Gamepad2; return <GameIcon className="w-7 h-7 text-[#ffd166]" />; })()}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/5 text-[#ffd166] border border-white/10">
                    {game.cefrLevel}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#41e7ff]/10 text-[#41e7ff] border border-[#41e7ff]/30">
                    +{game.xpReward} XP
                  </span>
                </div>
              </div>

              {/* Titles */}
              <div className="space-y-1">
                <h3 className="text-base font-black text-white group-hover:text-[#41e7ff] transition-colors">
                  {txText(appText, game.titleAr)}
                </h3>
                <span dir="ltr" className="text-xs text-white/50 block font-['Outfit',sans-serif]">
                  {game.titleEn}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#b9b6d5] leading-relaxed line-clamp-2">
                {txText(appText, game.descriptionAr)}
              </p>
            </div>

            {/* Bottom Metadata & Play Trigger */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#b9b6d5] flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                <span>{game.durationSeconds} ثانية</span>
              </span>

              <span className="text-[#ffd166] font-black flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
                <span>العب الآن</span>
                <ChevronLeft className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
