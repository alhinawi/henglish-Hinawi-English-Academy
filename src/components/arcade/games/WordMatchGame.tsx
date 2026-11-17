// اقتران الكلمات - match every English word with its Arabic meaning.
import React, { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ArcadeIntro, ArcadeHud, ArcadeEnd, ArcadeGameMeta } from '../ArcadeShell';
import { allWordPairs, sample, shuffle, WordPair } from '../arcadeContent';
import { useArcadeProgress } from '../../../services/arcadeProgressService';
import { playSound } from '../../../utils/audio';

const PAIRS = 8;

export const WordMatchGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { t } = useLanguage();
  const META: ArcadeGameMeta = { id: 'word-match', title: t('ah.gameWordMatch'), tagline: t('arc.matchIntro') };
  const progress = useArcadeProgress();
  const { recordGameResult } = progress;
  const [phase, setPhase] = useState<'intro' | 'play' | 'end'>('intro');
  const [left, setLeft] = useState<WordPair[]>([]);
  const [right, setRight] = useState<string[]>([]);
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);
  const [end, setEnd] = useState<{ xpEarned: number; newBest: boolean } | null>(null);

  const start = () => {
    const pairs = sample(allWordPairs(), PAIRS);
    setLeft(shuffle(pairs));
    setRight(shuffle(pairs.map((p) => p.ar)));
    setDone(new Set());
    setSelL(null);
    setSelR(null);
    setMistakes(0);
    setScore(0);
    setPhase('play');
  };

  const finish = (finalScore: number) => {
    setEnd(recordGameResult(META.id, finalScore));
    setPhase('end');
    playSound('fanfare');
  };

  const tryMatch = (en: string | null, ar: string | null, pairs: WordPair[], m: number, matched: Set<string>) => {
    if (!en || !ar) return;
    const pair = pairs.find((p) => p.en === en);
    if (pair && pair.ar === ar) {
      playSound('correct');
      const nd = new Set(matched);
      nd.add(en);
      setDone(nd);
      setSelL(null);
      setSelR(null);
      if (nd.size === PAIRS) {
        const finalScore = Math.max(1, PAIRS * 2 - m);
        setScore(finalScore);
        setTimeout(() => finish(finalScore), 600);
      }
    } else {
      playSound('wrong');
      setWrongPair([en, ar]);
      const nm = m + 1;
      setMistakes(nm);
      setTimeout(() => {
        setWrongPair(null);
        setSelL(null);
        setSelR(null);
      }, 550);
    }
  };

  if (phase === 'intro')
    return <ArcadeIntro meta={META} best={progress.best[META.id] ?? 0} plays={progress.plays[META.id] ?? 0} onStart={start} onBack={onExit} />;
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
        extra={<p className="text-xs text-[#8f8cb0]">{t('arc.mistakes').replace('{count}', String(mistakes))}</p>}
      />
    );

  const liveScore = Math.max(0, done.size * 2 - mistakes);
  return (
    <div className="max-w-lg mx-auto">
      <ArcadeHud title={META.title} score={liveScore} onQuit={onExit} />
      <div className="grid grid-cols-2 gap-3" dir="ltr">
        <div className="space-y-2">
          {left.map((p) => {
            const isDone = done.has(p.en);
            const isSel = selL === p.en;
            const isWrong = wrongPair?.[0] === p.en;
            return (
              <button
                key={p.en}
                disabled={isDone}
                onClick={() => {
                  playSound('flip');
                  const n = isSel ? null : p.en;
                  setSelL(n);
                  tryMatch(n, selR, left, mistakes, done);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                  isDone
                    ? 'opacity-25 border-[#c4ff55]/40 text-[#c4ff55]'
                    : isWrong
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : isSel
                        ? 'bg-[#41e7ff]/20 border-[#41e7ff] text-[#41e7ff]'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {p.en}
              </button>
            );
          })}
        </div>
        <div className="space-y-2" dir="rtl">
          {right.map((ar) => {
            const owner = left.find((p) => p.ar === ar);
            const isDone = owner ? done.has(owner.en) : false;
            const isSel = selR === ar;
            const isWrong = wrongPair?.[1] === ar;
            return (
              <button
                key={ar}
                disabled={isDone}
                onClick={() => {
                  playSound('flip');
                  const n = isSel ? null : ar;
                  setSelR(n);
                  tryMatch(selL, n, left, mistakes, done);
                }}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-10 ${
                  isDone
                    ? 'opacity-25 border-[#c4ff55]/40 text-[#c4ff55]'
                    : isWrong
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : isSel
                        ? 'bg-[#41e7ff]/20 border-[#41e7ff] text-[#41e7ff]'
                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {ar}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
