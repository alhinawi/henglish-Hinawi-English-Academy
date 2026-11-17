// True or False - is this Arabic translation really this English sentence's?
import React, { useState } from 'react';
import { ArcadeIntro, ArcadeHud, ArcadeEnd, ArcadeGameMeta } from '../ArcadeShell';
import { Check, X } from 'lucide-react';
import { allSentencePairs, shuffle, SentencePair } from '../arcadeContent';
import { useArcadeProgress } from '../../../services/arcadeProgressService';
import { playSound } from '../../../utils/audio';
import { useLanguage } from '../../../i18n/LanguageContext';

const META: ArcadeGameMeta = {
  id: 'true-false',
  title: '', // filled from tf.title inside the component
  tagline: '', // filled from tf.tagline inside the component
};

const ROUNDS = 10;

interface TFRound {
  en: string;
  ar: string;
  truth: boolean;
}

export const TrueFalseGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { t } = useLanguage();
  const meta = { ...META, title: t('tf.title'), tagline: t('tf.tagline') };
  const progress = useArcadeProgress();
  const { recordGameResult } = progress;
  const [phase, setPhase] = useState<'intro' | 'play' | 'end' | 'loading'>('intro');
  const [rounds, setRounds] = useState<TFRound[]>([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'ok' | 'no' | null>(null);
  const [end, setEnd] = useState<{ xpEarned: number; newBest: boolean } | null>(null);

  const start = async () => {
    setPhase('loading');
    const pairs = await allSentencePairs(2, 10);
    const picks = shuffle(pairs).slice(0, ROUNDS);
    const list: TFRound[] = picks.map((p, i) => {
      const truth = Math.random() < 0.5;
      if (truth) return { en: p.en, ar: p.ar, truth };
      const others = picks.filter((_, j) => j !== i);
      const fake = others[Math.floor(Math.random() * others.length)];
      return { en: p.en, ar: fake.ar, truth: false };
    });
    setRounds(list);
    setScore(0);
    setRound(0);
    setFeedback(null);
    setPhase('play');
  };

  const answer = (sayTrue: boolean) => {
    if (feedback) return;
    const ok = sayTrue === rounds[round].truth;
    playSound(ok ? 'correct' : 'wrong');
    setFeedback(ok ? 'ok' : 'no');
    const gained = ok ? 1 : 0;
    setTimeout(() => {
      if (round + 1 >= ROUNDS) {
        setEnd(recordGameResult(META.id, score + gained));
        setScore((s) => s + gained);
        setPhase('end');
        playSound('fanfare');
      } else {
        setScore((s) => s + gained);
        setRound((r) => r + 1);
        setFeedback(null);
      }
    }, 800);
  };

  if (phase === 'intro')
    return <ArcadeIntro meta={meta} best={progress.best[META.id] ?? 0} plays={progress.plays[META.id] ?? 0} onStart={start} onBack={onExit} />;
  if (phase === 'loading') return <div className="text-center text-[#b9b6d5] py-16 font-black">{t('tf.loading')}</div>;
  if (phase === 'end' && end)
    return (
      <ArcadeEnd
        meta={meta}
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
      <ArcadeHud title={meta.title} round={round + 1} totalRounds={ROUNDS} score={score} onQuit={onExit} />
      <div
        className={`p-6 sm:p-8 rounded-3xl border text-center space-y-5 transition-colors ${
          feedback === 'ok'
            ? 'bg-[#c4ff55]/10 border-[#c4ff55]/50'
            : feedback === 'no'
              ? 'bg-rose-500/10 border-rose-500/50'
              : 'bg-[#121124] border-white/10'
        }`}
      >
        <div className="text-xl sm:text-2xl font-black text-white" dir="ltr">
          {r?.en}
        </div>
        <div className="w-12 h-px bg-white/15 mx-auto" />
        <div className="text-base text-[#b9b6d5]">{r?.ar}</div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={() => answer(true)}
            disabled={!!feedback}
            className="py-3.5 rounded-2xl bg-[#c4ff55]/15 border border-[#c4ff55]/40 text-[#c4ff55] font-black hover:bg-[#c4ff55]/25 transition-all cursor-pointer disabled:opacity-40"
          >
            <span className="inline-flex items-center gap-1.5">{t('tf.trueBtn')} <Check className="w-4 h-4" /></span>
          </button>
          <button
            onClick={() => answer(false)}
            disabled={!!feedback}
            className="py-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 font-black hover:bg-rose-500/25 transition-all cursor-pointer disabled:opacity-40"
          >
            <span className="inline-flex items-center gap-1.5">{t('tf.falseBtn')} <X className="w-4 h-4" /></span>
          </button>
        </div>
      </div>
    </div>
  );
};
