// ==============================================================================
// Henglish Academy - Arcade Hub
// Fast arcade games built from real platform content + browser-side XP, daily
// streak and best scores (Phase 1: localStorage until D1 tables are approved).
// ==============================================================================

import { ArcadeIcon } from './ArcadeIcon';
import React, { useState, useEffect } from 'react';
import { Gamepad2, Zap, Flame, Trophy, Info } from 'lucide-react';
import { useArcadeProgress } from '../../services/arcadeProgressService';
import { playSound } from '../../utils/audio';
import { WordSprintGame } from './games/WordSprintGame';
import { SentenceScrambleGame } from './games/SentenceScrambleGame';
import { WordMatchGame } from './games/WordMatchGame';
import { TrueFalseGame } from './games/TrueFalseGame';
import { GapFillGame } from './games/GapFillGame';
import { ListeningChallengeGame } from './games/ListeningChallengeGame';
import { SpellingDashGame } from './games/SpellingDashGame';
import { MovieMemoryGame } from './games/MovieMemoryGame';
import { PUZZLE_GAMES, PuzzleGame } from './games/PuzzleGames';
import { LAB_GAMES, WordLabGame } from './games/WordLabGames';
import { WordRaceGame } from './games/WordRaceGame';
import { useLanguage } from '../../i18n/LanguageContext';

interface ArcadeEntry {
  id: string;
  title: string;
  blurb: string;
  hot?: boolean;
  render: (onExit: () => void) => React.ReactNode;
}

const GAMES: ArcadeEntry[] = [
  ...PUZZLE_GAMES.map(g => ({ ...g, blurb: g.tagline, render: (x: () => void) => <PuzzleGame id={g.id} onExit={x}/> })),
  ...LAB_GAMES.map(g => ({ ...g, blurb: g.tagline, hot: g.id === 'daily-quest' || g.id === 'boss-run', render: (x: () => void) => <WordLabGame id={g.id} onExit={x}/> })),
  { id: 'word-sprint', title: 'ah.gameWordSprint', blurb: 'ah.gameWordSprintBlurb', hot: true, render: (x) => <WordSprintGame onExit={x} /> },
  { id: 'sentence-scramble', title: 'ah.gameSentenceScramble', blurb: 'ah.gameSentenceScrambleBlurb' , render: (x) => <SentenceScrambleGame onExit={x} /> },
  { id: 'word-match', title: 'ah.gameWordMatch', blurb: 'ah.gameWordMatchBlurb', render: (x) => <WordMatchGame onExit={x} /> },
  { id: 'true-false', title: 'ah.gameTrueFalse', blurb: 'ah.gameTrueFalseBlurb', render: (x) => <TrueFalseGame onExit={x} /> },
  { id: 'gap-fill', title: 'ah.gameGapFill', blurb: 'ah.gameGapFillBlurb', render: (x) => <GapFillGame onExit={x} /> },
  { id: 'listening-challenge', title: 'ah.gameListeningChallenge', blurb: 'ah.gameListeningChallengeBlurb', render: (x) => <ListeningChallengeGame onExit={x} /> },
  { id: 'spelling-dash', title: 'ah.gameSpellingDash', blurb: 'ah.gameSpellingDashBlurb', render: (x) => <SpellingDashGame onExit={x} /> },
  { id: 'movie-memory', title: 'ah.gameMovieMemory', blurb: 'ah.gameMovieMemoryBlurb', render: (x) => <MovieMemoryGame onExit={x} /> },
  { id: 'word-race', title: 'ah.gameWordRace', blurb: 'ah.gameWordRaceBlurb', render: (x) => <WordRaceGame onExit={x} /> },
];

export const ArcadeHub: React.FC<{ onPlayingChange?: (playing: boolean) => void }> = ({ onPlayingChange }) => {
  const { t } = useLanguage();
  const progress = useArcadeProgress();
  const [search, setSearch] = useState('');
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => { onPlayingChange?.(!!active); window.scrollTo({ top: 0, behavior: 'instant' }); }, [active, onPlayingChange]);

  const storageNotice = (progress.storageFailed || progress.storageUnreadable) && <div role="status" className="mb-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-7 text-amber-200"><p>{t(progress.storageUnreadable ? 'ap.unreadable' : 'ap.storageError')}</p>{!progress.storageUnreadable && <button type="button" onClick={progress.retrySave} className="mt-3 rounded-xl border border-amber-200/30 px-4 py-2 font-bold">{t('to.retry')}</button>}</div>;

  if (active) {
    const game = GAMES.find((g) => g.id === active)!;
    return <div>{storageNotice}{game.render(() => setActive(null))}</div>;
  }

  return (
    <div className="space-y-6">
      {storageNotice}
      {/* XP / streak strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3.5 rounded-2xl bg-[#121124] border border-[#41e7ff]/25 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xl font-black text-[#41e7ff]">
            <Zap className="w-5 h-5" />
            {progress.xp.toLocaleString('en-US')}
          </div>
          <div className="text-[10px] font-bold text-[#8f8cb0] mt-1">{t('ah.xpPoints')}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#121124] border border-[#ffd166]/25 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xl font-black text-[#ffd166]">
            <Flame className="w-5 h-5" />
            {progress.streakDays}
          </div>
          <div className="text-[10px] font-bold text-[#8f8cb0] mt-1">{t('ah.streakDays')}</div>
        </div>
        <div className="p-3.5 rounded-2xl bg-[#121124] border border-[#c4ff55]/25 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xl font-black text-[#c4ff55]">
            <Trophy className="w-5 h-5" />
            {progress.totalPlays}
          </div>
          <div className="text-[10px] font-bold text-[#8f8cb0] mt-1">{t('ah.plays')}</div>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-2xl bg-[#9b7bff]/10 border border-[#9b7bff]/25 text-[11px] text-[#cfc9f5] leading-relaxed">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#9b7bff]" />
        <span>
          {t('ah.localNote')}
        </span>
      </div>

      <div className="space-y-3"><div className="flex items-center justify-between"><h2 className="text-xl font-black text-white">{t('ah.pickGame')}</h2><span className="rounded-full bg-[#c4ff55]/10 px-3 py-1 text-xs text-[#c4ff55]">{GAMES.length} {t('ah.gameUnit')}</span></div><input aria-label={t('ah.searchAria')} placeholder={t('ah.searchPh')} value={search} onChange={e => setSearch(e.target.value)} className="w-full rounded-2xl border border-white/15 bg-[#121124] p-3 text-white"/></div>
      {/* Game cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {GAMES.filter(g => `${t(g.title)} ${t(g.blurb)}`.toLowerCase().includes(search.trim().toLowerCase())).map((g) => {
          const best = progress.best[g.id] ?? 0;
          return (
            <div
              key={g.id}
              className={`p-4 rounded-3xl border transition-all space-y-2.5 ${
                g.hot ? 'bg-linear-to-b from-[#ff4f9a]/15 to-[#121124] border-[#ff4f9a]/40' : 'bg-[#121124] border-white/10 hover:border-white/25'
              }`}
            >
              <ArcadeIcon id={g.id}/>
              <h3 className="text-base font-black text-white">{t(g.title)}</h3>
              <p className="text-[11px] text-[#8f8cb0] leading-relaxed min-h-8">{t(g.blurb)}</p>
              <div className="text-[10px] font-black text-[#ffd166]">{t('ah.bestResult')} {best}</div>
              <button
                onClick={() => {
                  playSound('click');
                  setActive(g.id);
                }}
                className={`w-full py-2.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
                  g.hot ? 'bg-[#ff4f9a] text-white hover:brightness-110' : 'bg-[#c4ff55] text-[#0c0b20] hover:brightness-110'
                }`}
              >
                {t('ah.playNow')}
              </button>
            </div>
          );
        })}
      </div>

      <section className="rounded-3xl border border-[#ffd166]/20 bg-[#121124] p-4 space-y-3"><h2 className="font-black text-white flex items-center gap-1.5"><Trophy className="w-4 h-4 text-[#ffd166]" /> {t('ah.weeklyTitle')}</h2><p className="text-xs text-[#8f8cb0]">{t('ah.weeklyNote')}</p>{progress.history.filter(r => Date.now() - r.at < 7 * 86400000).sort((a,b) => b.xp - a.xp).slice(0,5).map((r,i) => <div key={r.at + '-' + i} className="flex justify-between border-t border-white/5 pt-2 text-xs text-[#b9b6d5]"><span>{i+1}. {t(GAMES.find(g => g.id === r.id)?.title || r.id)}</span><span dir="ltr">{r.xp} XP · {new Date(r.at).toLocaleDateString('en-GB')}</span></div>)}{!progress.history.length && <p className="text-sm text-[#b9b6d5]">{t('ah.emptyHistory')}</p>}</section>
      <p className="text-center text-[10px] text-[#5a5878] flex items-center justify-center gap-1">
        <Gamepad2 className="w-3 h-3" /> {t('ah.footerNote')}
      </p>
    </div>
  );
};
