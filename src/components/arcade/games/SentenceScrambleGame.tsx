// رتّب الجملة - rebuild real platform sentences from shuffled words.
import React, { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { ArcadeIntro, ArcadeHud, ArcadeEnd, ArcadeGameMeta } from '../ArcadeShell';
import { allSentencePairs, shuffle, SentencePair } from '../arcadeContent';
import { useArcadeProgress } from '../../../services/arcadeProgressService';
import { useArcadeTimeout } from '../../../hooks/useArcadeTimeout';
import { playSound } from '../../../utils/audio';

const ROUNDS = 8;

export const SentenceScrambleGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { t, lang } = useLanguage();
  const META: ArcadeGameMeta = {
    id: 'sentence-scramble',
    title: t('ss.title'),
    tagline: t('ss.intro'),
  };

  const { scheduleTransition, cancelTransition } = useArcadeTimeout();
  const progress = useArcadeProgress();
  const { recordGameResult } = progress;
  const [phase, setPhase] = useState<'intro' | 'play' | 'end' | 'loading'>('intro');
  const [rounds, setRounds] = useState<SentencePair[]>([]);
  const [round, setRound] = useState(0);
  const [pool, setPool] = useState<string[]>([]);
  const [built, setBuilt] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'ok' | 'no' | null>(null);
  const [end, setEnd] = useState<{ xpEarned: number; newBest: boolean } | null>(null);

  const prepRound = (list: SentencePair[], idx: number) => {
    setPool(shuffle(list[idx].en.split(/\s+/)));
    setBuilt([]);
    setFeedback(null);
  };

  const start = async () => {
    cancelTransition();
    setPhase('loading');
    const pairs = await allSentencePairs(3, 8);
    const list = shuffle(pairs).slice(0, ROUNDS);
    setRounds(list);
    setScore(0);
    setRound(0);
    setPhase('play');
    prepRound(list, 0);
  };

  const addWord = (w: string, i: number) => {
    if (feedback) return;
    playSound('flip');
    setBuilt((b) => [...b, w]);
    setPool((p) => p.filter((_, j) => j !== i));
  };

  const removeWord = (w: string, i: number) => {
    if (feedback) return;
    playSound('click');
    setPool((p) => [...p, w]);
    setBuilt((b) => b.filter((_, j) => j !== i));
  };

  const check = () => {
    const sentence = rounds[round];
    const ok = built.join(' ') === sentence.en;
    setFeedback(ok ? 'ok' : 'no');
    playSound(ok ? 'correct' : 'wrong');
    if (ok) setScore((s) => s + 1);
    scheduleTransition(() => {
      if (round + 1 >= ROUNDS) {
        const finalScore = score + (ok ? 1 : 0);
        setEnd(recordGameResult(META.id, finalScore));
        setPhase('end');
        playSound('fanfare');
      } else {
        const n = round + 1;
        setRound(n);
        prepRound(rounds, n);
      }
    }, ok ? 900 : 1600);
  };

  if (phase === 'intro')
    return <ArcadeIntro meta={META} best={progress.best[META.id] ?? 0} plays={progress.plays[META.id] ?? 0} onStart={start} onBack={onExit} />;
  if (phase === 'loading') return <div className="text-center text-[#b9b6d5] py-16 font-black">{t('ss.loading')}</div>;
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

  const sentence = rounds[round];
  return (
    <div className="max-w-lg mx-auto">
      <ArcadeHud title={META.title} round={round + 1} totalRounds={ROUNDS} score={score} onQuit={onExit} />
      <div className="p-5 sm:p-6 rounded-3xl bg-[#121124] border border-white/10 space-y-5">
        <p dir="rtl" className="text-center text-[#b9b6d5] text-sm">{sentence?.ar}</p>
        <div
          dir="ltr"
          className={`min-h-14 p-3 rounded-2xl border-2 border-dashed flex flex-wrap gap-1.5 items-center justify-center transition-colors ${
            feedback === 'ok' ? 'border-[#c4ff55] bg-[#c4ff55]/10' : feedback === 'no' ? 'border-rose-500 bg-rose-500/10' : 'border-white/15 bg-white/5'
          }`}
        >
          {built.length === 0 && <span dir={lang === 'ar' ? 'rtl' : 'ltr'} className="text-[#5a5878] text-xs font-bold">{t('ss.empty')}</span>}
          {built.map((w, i) => (
            <button
              key={`${w}-${i}`}
              onClick={() => removeWord(w, i)}
              className="px-2.5 py-1.5 rounded-xl bg-[#9b7bff]/25 border border-[#9b7bff]/50 text-white text-sm font-bold cursor-pointer hover:bg-[#9b7bff]/40"
            >
              {w}
            </button>
          ))}
        </div>
        {feedback === 'no' && (
          <p dir="ltr" className="text-center text-rose-300 text-xs font-bold">
            {t('ss.correct')} {sentence?.en}
          </p>
        )}
        <div dir="ltr" className="flex flex-wrap gap-1.5 justify-center">
          {pool.map((w, i) => (
            <button
              key={`${w}-${i}`}
              onClick={() => addWord(w, i)}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm font-bold cursor-pointer hover:bg-white/15"
            >
              {w}
            </button>
          ))}
        </div>
        <button
          onClick={check}
          disabled={pool.length > 0 || !!feedback}
          className="w-full py-3 rounded-2xl bg-[#c4ff55] text-[#0c0b20] font-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:brightness-110 transition-all"
        >
          {t('ss.check')}
        </button>
      </div>
    </div>
  );
};
