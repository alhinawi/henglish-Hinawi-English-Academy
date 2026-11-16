// تحدي الاستماع - hear a real sentence and type what you heard.
import React, { useState } from 'react';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Volume2 } from 'lucide-react';
import { ArcadeIntro, ArcadeHud, ArcadeEnd, ArcadeGameMeta } from '../ArcadeShell';
import { allSentencePairs, shuffle, wordAccuracy, SentencePair } from '../arcadeContent';
import { recordGameResult, useArcadeProgress } from '../../../services/arcadeProgressService';
import { playSound, speakEnglish } from '../../../utils/audio';

const META: ArcadeGameMeta = {
  id: 'listening-challenge',
  title: '',
  tagline: '',
};

const ROUNDS = 8;

export const ListeningChallengeGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const { t } = useLanguage();
  const meta = { ...META, title: t('lc.title'), tagline: t('lc.tagline') };
  const progress = useArcadeProgress();
  const [phase, setPhase] = useState<'intro' | 'play' | 'end' | 'loading'>('intro');
  const [rounds, setRounds] = useState<SentencePair[]>([]);
  const [round, setRound] = useState(0);
  const [typed, setTyped] = useState('');
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<{ acc: number } | null>(null);
  const [end, setEnd] = useState<{ xpEarned: number; newBest: boolean } | null>(null);

  const speak = (text: string) => speakEnglish(text);

  const start = async () => {
    setPhase('loading');
    const pairs = await allSentencePairs(3, 8);
    const list = shuffle(pairs).slice(0, ROUNDS);
    setRounds(list);
    setScore(0);
    setRound(0);
    setTyped('');
    setResult(null);
    setPhase('play');
    setTimeout(() => speak(list[0].en), 400);
  };

  const submit = () => {
    if (result || !typed.trim()) return;
    const acc = wordAccuracy(rounds[round].en, typed);
    const ok = acc >= 0.8;
    setResult({ acc });
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
        setTyped('');
        setResult(null);
        setTimeout(() => speak(rounds[n].en), 350);
      }
    }, 1800);
  };

  if (phase === 'intro')
    return <ArcadeIntro meta={meta} best={progress.best[META.id] ?? 0} plays={progress.plays[META.id] ?? 0} onStart={start} onBack={onExit} />;
  if (phase === 'loading') return <div className="text-center text-[#b9b6d5] py-16 font-black">{t('lc.loading')}</div>;
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
      <div className="p-6 rounded-3xl bg-[#121124] border border-white/10 space-y-5 text-center">
        <button
          onClick={() => {
            playSound('click');
            speak(r.en);
          }}
          className="w-20 h-20 rounded-full bg-[#9b7bff]/20 border border-[#9b7bff]/50 text-[#9b7bff] inline-flex items-center justify-center hover:bg-[#9b7bff]/30 transition-all cursor-pointer"
          title={t('lc.listenAgain')}
        >
          <Volume2 className="w-9 h-9" />
        </button>
        <p className="text-xs text-[#8f8cb0]">{t('lc.hint')}</p>
        <input
          dir="ltr"
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          disabled={!!result}
          placeholder={t('lc.placeholder')}
          aria-label={t('lc.hint')}
          className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-white/15 text-white text-center font-bold outline-none focus:border-[#41e7ff]/60 disabled:opacity-50"
        />
        {result && (
          <div className={`text-sm font-black ${result.acc >= 0.8 ? 'text-[#c4ff55]' : 'text-rose-300'}`}>
            <div dir="ltr" className="mb-1 text-white font-bold">{r.en}</div>
            <div>{result.acc >= 0.8 ? t('lc.excellent') : t('lc.accuracy').replace('{percent}', String(Math.round(result.acc * 100)))}</div>
            <div dir="rtl" className="mt-1">{r.ar}</div>
          </div>
        )}
        <button
          onClick={submit}
          disabled={!!result || !typed.trim()}
          className="w-full py-3 rounded-2xl bg-[#c4ff55] text-[#0c0b20] font-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:brightness-110 transition-all"
        >
          {t('lc.check')}
        </button>
      </div>
    </div>
  );
};
