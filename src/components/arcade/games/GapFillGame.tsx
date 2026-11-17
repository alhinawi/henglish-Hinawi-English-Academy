// املأ الفراغ - pick the missing word in real example sentences.
import React, { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ArcadeIntro, ArcadeHud, ArcadeEnd, ArcadeGameMeta } from '../ArcadeShell';
import { gapFillItems, shuffle, GapItem } from '../arcadeContent';
import { useArcadeProgress } from '../../../services/arcadeProgressService';
import { playSound } from '../../../utils/audio';

const ROUNDS = 10;

export const GapFillGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { t } = useLanguage();
  const META: ArcadeGameMeta = { id: 'gap-fill', title: t('ah.gameGapFill'), tagline: t('arc.gapIntro') };
  const progress = useArcadeProgress();
  const { recordGameResult } = progress;
  const [phase, setPhase] = useState<'intro' | 'play' | 'end'>('intro');
  const [rounds, setRounds] = useState<GapItem[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [end, setEnd] = useState<{ xpEarned: number; newBest: boolean } | null>(null);

  const start = () => {
    const list = gapFillItems(ROUNDS);
    setRounds(list);
    setOptions(shuffle([list[0].answer, ...list[0].distractors]));
    setScore(0);
    setRound(0);
    setPicked(null);
    setPhase('play');
  };

  const pick = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    const ok = opt === rounds[round].answer;
    playSound(ok ? 'correct' : 'wrong');
    const gained = ok ? 1 : 0;
    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        setScore((s) => s + gained);
        setEnd(recordGameResult(META.id, score + gained));
        setPhase('end');
        playSound('fanfare');
      } else {
        setScore((s) => s + gained);
        const n = round + 1;
        setRound(n);
        setOptions(shuffle([rounds[n].answer, ...rounds[n].distractors]));
        setPicked(null);
      }
    }, ok ? 700 : 1500);
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
      />
    );

  const r = rounds[round];
  return (
    <div className="max-w-lg mx-auto">
      <ArcadeHud title={META.title} round={round + 1} totalRounds={ROUNDS} score={score} onQuit={onExit} />
      <div className="p-6 rounded-3xl bg-[#121124] border border-white/10 space-y-5">
        <p dir="ltr" className="text-lg sm:text-xl font-bold text-white leading-relaxed text-center">
          {r?.sentence.split('_____').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className={`inline-block min-w-16 border-b-2 font-black px-1 ${picked ? (picked === r.answer ? 'text-[#c4ff55] border-[#c4ff55]' : 'text-rose-400 border-rose-400') : 'text-[#41e7ff] border-[#41e7ff]'}`}>
                  {picked ?? '?'}
                </span>
              )}
            </span>
          ))}
        </p>
        <p className="text-center text-[#8f8cb0] text-xs">{r?.translationAr}</p>
        <div className="grid grid-cols-2 gap-2" dir="ltr">
          {options.map((o) => {
            const isRight = picked && o === r.answer;
            const isWrongPick = picked === o && o !== r.answer;
            return (
              <button
                key={o}
                onClick={() => pick(o)}
                disabled={!!picked}
                className={`py-3 px-3 rounded-2xl font-black text-sm border transition-all cursor-pointer ${
                  isRight
                    ? 'bg-[#c4ff55]/20 border-[#c4ff55] text-[#c4ff55]'
                    : isWrongPick
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
