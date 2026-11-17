// ذاكرة الأفلام - flip cards and match each movie line with its Egyptian meaning.
import React, { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ArcadeIntro, ArcadeHud, ArcadeEnd, ArcadeGameMeta } from '../ArcadeShell';
import { allSentencePairs, sample, shuffle, SentencePair } from '../arcadeContent';
import { useArcadeProgress } from '../../../services/arcadeProgressService';
import { playSound } from '../../../utils/audio';

const PAIRS = 6;

interface Card {
  key: string;
  pairId: number;
  text: string;
  kind: 'en' | 'ar';
}

export const MovieMemoryGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { t, lang } = useLanguage();
  const META: ArcadeGameMeta = { id: 'movie-memory', title: t('mm.title'), tagline: t('mm.intro') };
  const progress = useArcadeProgress();
  const { recordGameResult } = progress;
  const [phase, setPhase] = useState<'intro' | 'play' | 'end' | 'loading'>('intro');
  const [cards, setCards] = useState<Card[]>([]);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [end, setEnd] = useState<{ xpEarned: number; newBest: boolean } | null>(null);

  const start = async () => {
    setPhase('loading');
    const pairs: SentencePair[] = sample(await allSentencePairs(2, 7), PAIRS);
    const deck: Card[] = shuffle(
      pairs.flatMap((p, i) => [
        { key: `${i}-en`, pairId: i, text: p.en, kind: 'en' as const },
        { key: `${i}-ar`, pairId: i, text: p.ar, kind: 'ar' as const },
      ]),
    );
    setCards(deck);
    setOpen([]);
    setMatched(new Set());
    setMoves(0);
    setScore(0);
    setPhase('play');
  };

  const flip = (idx: number) => {
    if (open.length === 2 || open.includes(idx) || matched.has(cards[idx].pairId)) return;
    playSound('flip');
    const no = [...open, idx];
    setOpen(no);
    if (no.length === 2) {
      const nm = moves + 1;
      setMoves(nm);
      const [a, b] = no;
      if (cards[a].pairId === cards[b].pairId && cards[a].kind !== cards[b].kind) {
        playSound('correct');
        const nmatched = new Set(matched);
        nmatched.add(cards[a].pairId);
        setMatched(nmatched);
        setOpen([]);
        if (nmatched.size === PAIRS) {
          const finalScore = Math.max(1, PAIRS * 2 + PAIRS - nm); // perfect run = 3/pair
          setScore(finalScore);
          setTimeout(() => {
            setEnd(recordGameResult(META.id, finalScore));
            setPhase('end');
            playSound('fanfare');
          }, 600);
        }
      } else {
        playSound('wrong');
        setTimeout(() => setOpen([]), 900);
      }
    }
  };

  if (phase === 'intro')
    return <ArcadeIntro meta={META} best={progress.best[META.id] ?? 0} plays={progress.plays[META.id] ?? 0} onStart={start} onBack={onExit} />;
  if (phase === 'loading') return <div className="text-center text-[#b9b6d5] py-16 font-black">{t('mm.loading')}</div>;
  if (phase === 'end' && end)
    return (
      <ArcadeEnd
        meta={META}
        score={score}
        xpEarned={end.xpEarned}
        newBest={end.newBest}
        best={progress.best[META.id] ?? score}
        onReplay={start}
        onBack={onExit}
        extra={<p className="text-xs text-[#8f8cb0]">{t('mm.result').replace('{count}', String(moves))}</p>}
      />
    );

  return (
    <div className="max-w-lg mx-auto">
      <ArcadeHud title={META.title} score={matched.size} onQuit={onExit} />
      <div className="grid grid-cols-3 gap-2">
        {cards.map((c, i) => {
          const isOpen = open.includes(i) || matched.has(c.pairId);
          return (
            <button
              key={c.key}
              onClick={() => flip(i)}
              className={`min-h-20 p-2 rounded-xl border text-[11px] font-bold leading-snug transition-all cursor-pointer ${
                matched.has(c.pairId)
                  ? 'bg-[#c4ff55]/15 border-[#c4ff55]/50 text-[#c4ff55]'
                  : isOpen
                    ? 'bg-[#41e7ff]/15 border-[#41e7ff]/60 text-white'
                    : 'bg-[#1a1832] border-white/10 text-transparent hover:border-[#9b7bff]/50'
              }`}
              dir={c.kind === 'en' ? 'ltr' : 'rtl'}
            >
              {isOpen || matched.has(c.pairId) ? c.text : (lang === 'ar' ? '؟' : '?')}
            </button>
          );
        })}
      </div>
      <p className="text-center text-[10px] text-[#8f8cb0] mt-3">{t('mm.moves').replace('{count}', String(moves))}</p>
    </div>
  );
};
