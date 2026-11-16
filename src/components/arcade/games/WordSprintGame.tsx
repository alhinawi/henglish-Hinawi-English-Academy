// سباق الكلمات - translate as many words as you can in 60 seconds.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArcadeIntro, ArcadeHud, ArcadeEnd, ArcadeGameMeta } from '../ArcadeShell';
import { Flame } from 'lucide-react';
import { allWordPairs, sample, shuffle, WordPair } from '../arcadeContent';
import { recordGameResult, useArcadeProgress } from '../../../services/arcadeProgressService';
import { playSound } from '../../../utils/audio';

const META: ArcadeGameMeta = {
  id: 'word-sprint',
  title: 'سباق الكلمات',
  tagline: 'كلمة إنجليزية و4 اختيارات بالعربي.. ترجم أكبر عدد في 60 ثانية. إجابة صح = نقطة، وكل 3 ورا بعض بونص!',
};

const DURATION = 60;

export const WordSprintGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const progress = useArcadeProgress();
  const [phase, setPhase] = useState<'intro' | 'play' | 'end'>('intro');
  const [pool, setPool] = useState<WordPair[]>([]);
  const [current, setCurrent] = useState<WordPair | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [picked, setPicked] = useState<string | null>(null);
  const [end, setEnd] = useState<{ xpEarned: number; newBest: boolean } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextRound = (words: WordPair[]) => {
    const c = words[Math.floor(Math.random() * words.length)];
    const wrongs = sample(words.filter((w) => w.ar !== c.ar), 3).map((w) => w.ar);
    setCurrent(c);
    setOptions(shuffle([c.ar, ...wrongs]));
    setPicked(null);
  };

  const start = () => {
    const words = allWordPairs();
    setPool(words);
    setScore(0);
    setCombo(0);
    setTimeLeft(DURATION);
    setPhase('play');
    nextRound(words);
  };

  useEffect(() => {
    if (phase !== 'play') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setEnd(recordGameResult(META.id, score));
          setPhase('end');
          playSound('fanfare');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, score]);

  const pick = (opt: string) => {
    if (picked || !current) return;
    setPicked(opt);
    const ok = opt === current.ar;
    if (ok) {
      playSound('correct');
      const bonus = (combo + 1) % 3 === 0 ? 1 : 0;
      setScore((s) => s + 1 + bonus);
      setCombo((c) => c + 1);
    } else {
      playSound('wrong');
      setCombo(0);
    }
    setTimeout(() => nextRound(pool), ok ? 250 : 700);
  };

  const quit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onExit();
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
        best={Math.max(progress.best[META.id] ?? 0, score)}
        onReplay={start}
        onBack={onExit}
      />
    );

  return (
    <div className="max-w-lg mx-auto">
      <ArcadeHud title={META.title} score={score} timeLeft={timeLeft} onQuit={quit} />
      {combo >= 2 && (
        <div className="text-center text-[#ffd166] text-xs font-black mb-2 flex items-center justify-center gap-1"><Flame className="w-3.5 h-3.5" /> {combo} ورا بعض! الجاية بونص</div>
      )}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121124] border border-white/10 text-center space-y-6">
        <div className="text-3xl sm:text-4xl font-black text-white" dir="ltr">
          {current?.en}
        </div>
        <div className="grid grid-cols-1 gap-2">
          {options.map((o) => {
            const isRight = picked && o === current?.ar;
            const isWrongPick = picked === o && o !== current?.ar;
            return (
              <button
                key={o}
                onClick={() => pick(o)}
                disabled={!!picked}
                className={`py-3 px-4 rounded-2xl font-black text-sm transition-all cursor-pointer border ${
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
