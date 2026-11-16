// سباق الإملاء - see the Arabic meaning, spell the English word.
import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { ArcadeIntro, ArcadeHud, ArcadeEnd, ArcadeGameMeta } from '../ArcadeShell';
import { allWordPairs, sample, normalizeTyped, WordPair } from '../arcadeContent';
import { recordGameResult, useArcadeProgress } from '../../../services/arcadeProgressService';
import { playSound, speakEnglish } from '../../../utils/audio';

const META: ArcadeGameMeta = {
  id: 'spelling-dash',
  title: 'سباق الإملاء',
  tagline: 'المعنى بالعربي قدامك.. اكتب الكلمة الإنجليزية بحروفها الصح. ممكن تسمعها كمان. 10 كلمات.',
};

const ROUNDS = 10;

export const SpellingDashGame: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const progress = useArcadeProgress();
  const [phase, setPhase] = useState<'intro' | 'play' | 'end'>('intro');
  const [rounds, setRounds] = useState<WordPair[]>([]);
  const [round, setRound] = useState(0);
  const [typed, setTyped] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'ok' | 'no' | null>(null);
  const [end, setEnd] = useState<{ xpEarned: number; newBest: boolean } | null>(null);

  const start = () => {
    const words = sample(
      allWordPairs().filter((w) => /^[a-z][a-z'\- ]*$/i.test(w.en) && w.en.split(' ').length <= 2),
      ROUNDS,
    );
    setRounds(words);
    setScore(0);
    setRound(0);
    setTyped('');
    setFeedback(null);
    setPhase('play');
  };

  const submit = () => {
    if (feedback || !typed.trim()) return;
    const ok = normalizeTyped(typed) === normalizeTyped(rounds[round].en);
    setFeedback(ok ? 'ok' : 'no');
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
        setRound((r) => r + 1);
        setTyped('');
        setFeedback(null);
      }
    }, ok ? 700 : 1600);
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
      <div className="p-6 rounded-3xl bg-[#121124] border border-white/10 space-y-5 text-center">
        <div className="text-xl font-black text-white">{r?.ar}</div>
        <button
          onClick={() => {
            playSound('click');
            speakEnglish(r.en);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9b7bff]/15 border border-[#9b7bff]/40 text-[#9b7bff] text-xs font-black cursor-pointer hover:bg-[#9b7bff]/25"
        >
          <Volume2 className="w-3.5 h-3.5" /> اسمع الكلمة
        </button>
        <input
          dir="ltr"
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          disabled={!!feedback}
          placeholder="Spell it in English..."
          autoCapitalize="off"
          autoCorrect="off"
          className={`w-full py-3 px-4 rounded-2xl bg-white/5 border text-white text-center text-lg font-black tracking-wider outline-none transition-colors disabled:opacity-60 ${
            feedback === 'ok' ? 'border-[#c4ff55] text-[#c4ff55]' : feedback === 'no' ? 'border-rose-500 text-rose-300' : 'border-white/15 focus:border-[#41e7ff]/60'
          }`}
        />
        {feedback === 'no' && (
          <div dir="ltr" className="text-sm font-black text-[#c4ff55]">
            الصح: {r.en}
          </div>
        )}
        <button
          onClick={submit}
          disabled={!!feedback || !typed.trim()}
          className="w-full py-3 rounded-2xl bg-[#c4ff55] text-[#0c0b20] font-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer hover:brightness-110 transition-all"
        >
          تأكد
        </button>
      </div>
    </div>
  );
};
