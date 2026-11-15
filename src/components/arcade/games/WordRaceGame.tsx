// سباق الترجمة - which English word matches this Arabic meaning? (reverse sprint)
import React, { useEffect, useRef, useState } from 'react';
import { ArcadeIntro, ArcadeHud, ArcadeEnd, ArcadeGameMeta } from '../ArcadeShell';
import { allWordPairs, sample, shuffle, WordPair } from '../arcadeContent';
import { recordGameResult, useArcadeProgress } from '../../../services/arcadeProgressService';
import { playSound } from '../../../utils/audio';

const META: ArcadeGameMeta = {
  id: 'word-race',
  title: 'سباق الترجمة',
  icon: '🏁',
  tagline: 'المعنى بالعربي و4 كلمات إنجليزية.. اختار الصح قبل ما العد ينزل. كل إجابة صح بترجعلك وقت!',
};

const START_TIME = 10;
const MAX_TIME = 15;

export const WordRaceGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const progress = useArcadeProgress();
  const [phase, setPhase] = useState<'intro' | 'play' | 'end'>('intro');
  const [pool, setPool] = useState<WordPair[]>([]);
  const [current, setCurrent] = useState<WordPair | null>(null);
  const [options, setOptions] = useState<WordPair[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(START_TIME);
  const [picked, setPicked] = useState<string | null>(null);
  const [end, setEnd] = useState<{ xpEarned: number; newBest: boolean } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const gameOver = () => {
    stopTimer();
    setEnd(recordGameResult(META.id, scoreRef.current));
    setPhase('end');
    playSound('fanfare');
  };

  const nextRound = (words: WordPair[]) => {
    const c = words[Math.floor(Math.random() * words.length)];
    const wrongs = sample(words.filter((w) => w.en !== c.en), 3);
    setCurrent(c);
    setOptions(shuffle([c, ...wrongs]));
    setPicked(null);
  };

  const start = () => {
    const words = allWordPairs();
    setPool(words);
    setScore(0);
    setTimeLeft(START_TIME);
    setPhase('play');
    nextRound(words);
  };

  useEffect(() => {
    if (phase !== 'play') return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          gameOver();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const pick = (w: WordPair) => {
    if (picked || !current) return;
    setPicked(w.en);
    const ok = w.en === current.en;
    if (ok) {
      playSound('correct');
      setScore((s) => s + 1);
      setTimeLeft((t) => Math.min(MAX_TIME, t + 3));
      setTimeout(() => nextRound(pool), 220);
    } else {
      playSound('wrong');
      setTimeout(() => gameOver(), 900);
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
      />
    );

  return (
    <div className="max-w-lg mx-auto">
      <ArcadeHud title={META.title} score={score} timeLeft={timeLeft} onQuit={() => { stopTimer(); onExit(); }} />
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121124] border border-white/10 text-center space-y-6">
        <div className="text-2xl sm:text-3xl font-black text-white">{current?.ar}</div>
        <div className="grid grid-cols-2 gap-2" dir="ltr">
          {options.map((o) => {
            const isRight = picked && o.en === current?.en;
            const isWrongPick = picked === o.en && o.en !== current?.en;
            return (
              <button
                key={o.en}
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
                {o.en}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
