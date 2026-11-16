import { ArcadeIcon } from '../ArcadeIcon';
import React, { useState } from 'react';
import { VOCABULARY_ACADEMY_WORDS as WORDS } from '../../../data/vocabularyAcademyData';
import { VERB_TOOLKIT } from '../../../data/verbsData';
import { MISTAKE_HUNTER_CASES } from '../../../data/gamesData';
import { useAppTextMap } from '../../../services/contentI18nService';
import { ArcadeHud, ArcadeEnd, ArcadeGameMeta } from '../ArcadeShell';
import { useLanguage } from '../../../i18n/LanguageContext';
import { shuffle, normalizeTyped, uniqueAcademyWords } from '../arcadeContent';
import { recordGameResult, useArcadeProgress } from '../../../services/arcadeProgressService';
import { playSound, speakEnglish } from '../../../utils/audio';

export const LAB_GAMES = [
  { id: 'letter-rescue', title: 'wl.game.letter-rescue.title', icon: '🛟', tagline: 'wl.game.letter-rescue.tagline' },
  { id: 'letter-shuffle', title: 'wl.game.letter-shuffle.title', icon: '🔤', tagline: 'wl.game.letter-shuffle.tagline' },
  { id: 'missing-letters', title: 'wl.game.missing-letters.title', icon: '🔎', tagline: 'wl.game.missing-letters.tagline' },
  { id: 'verb-workshop', title: 'wl.game.verb-workshop.title', icon: '🔧', tagline: 'wl.game.verb-workshop.tagline' },
  { id: 'mistake-lab', title: 'wl.game.mistake-lab.title', icon: '🕵️', tagline: 'wl.game.mistake-lab.tagline' },
  { id: 'word-class', title: 'wl.game.word-class.title', icon: '🏷️', tagline: 'wl.game.word-class.tagline' },
  { id: 'context-clues', title: 'wl.game.context-clues.title', icon: '📖', tagline: 'wl.game.context-clues.tagline' },
  { id: 'daily-quest', title: 'wl.game.daily-quest.title', icon: '☀️', tagline: 'wl.game.daily-quest.tagline' },
  { id: 'boss-run', title: 'wl.game.boss-run.title', icon: '🐉', tagline: 'wl.game.boss-run.tagline' },
] as const;
export type LabId = typeof LAB_GAMES[number]['id'];
interface Round { prompt: string; clue: string; answer: string; options?: string[]; detail: string; extra?: string; kind: 'letters' | 'rescue' | 'type' | 'verb' | 'choice'; level: string; }
const button = 'rounded-xl border border-white/15 bg-white/5 p-3 font-bold text-white disabled:opacity-40';
function seeded<T>(items: T[], seed: number): T[] {
  const a = [...items]; let s = seed;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 1664525 + 1013904223) >>> 0; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export function buildWordLabRounds(id: LabId, level: string, tr: (s: string) => string = (s) => s): Round[] {
  const pool = uniqueAcademyWords(WORDS.filter(w => (level === 'all' || w.level === level) && /^[a-z]{3,16}$/i.test(w.word) && (!['context-clues', 'daily-quest', 'boss-run'].includes(id) || new RegExp(`\\b${w.word}\\b`, 'i').test(w.exampleEn))));
  const today = new Date();
  const seed = Number(`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`);
  const arrange = <T,>(arr: T[]) => id === 'daily-quest' ? seeded(arr, seed) : shuffle(arr);
  if (id === 'verb-workshop') return shuffle(VERB_TOOLKIT).slice(0, 10).map(v => ({ kind: 'verb', prompt: v.v1, clue: v.meaningAr, answer: v.v2, extra: v.v3, detail: v.example, level: 'V2 + V3' }));
  if (id === 'mistake-lab') return shuffle(MISTAKE_HUNTER_CASES).map(q => ({ kind: 'choice', prompt: q.sentence, clue: tr('wl.clue.sentenceCorrect'), answer: q.hasError ? tr('wl.opt.hasError') : tr('wl.opt.valid'), options: [tr('wl.opt.valid'), tr('wl.opt.hasError')], detail: `${q.correction} • ${q.explanationAr}`, level: 'Future perfect' }));
  return arrange(pool).slice(0, id === 'boss-run' ? 15 : id === 'letter-rescue' ? 5 : 10).map((w, i) => {
    const base = { prompt: w.word, clue: w.meaningAr, answer: w.word.toLowerCase(), detail: `${w.exampleEn} • ${w.exampleAr}`, level: w.level };
    if (id === 'letter-rescue') return { ...base, kind: 'rescue' };
    if (id === 'letter-shuffle') return { ...base, kind: 'letters' };
    if (id === 'missing-letters') return { ...base, kind: 'type', prompt: w.word.split('').map((c, j) => j % 2 === 0 ? c : '_').join(' ') };
    const mode = id === 'daily-quest' || id === 'boss-run' ? i % 3 : id === 'word-class' ? 2 : 1;
    if (mode === 2) return { ...base, kind: 'choice', prompt: w.word, clue: w.meaningAr, answer: w.partOfSpeech, options: arrange(Array.from(new Set(WORDS.map(x => x.partOfSpeech)))), detail: `${w.partOfSpeech} • ${w.exampleEn}` };
    const escaped = w.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'ig');
    const hasContext = re.test(w.exampleEn);
    const options = arrange([w.word, ...arrange(pool.filter(x => x.word !== w.word)).slice(0, 3).map(x => x.word)]);
    return { ...base, kind: 'choice', prompt: mode === 0 || !hasContext ? w.meaningAr : w.exampleEn.replace(re, '_____'), clue: mode === 0 || !hasContext ? tr('wl.clue.pickEnglish') : tr('wl.clue.pickContext'), options };
  });
}
export function WordLabGame({ id, onExit }: { id: LabId; onExit: () => void }) {
  const vocabText = useAppTextMap('vocabularyAcademyData');
  const verbsText = useAppTextMap('verbsData');
  const gamesText = useAppTextMap('gamesData');
  const tx = (s: string) => vocabText?.[s] ?? verbsText?.[s] ?? gamesText?.[s] ?? s;
  const { t } = useLanguage();
  const metaRaw = LAB_GAMES.find(g => g.id === id)!;
  const meta: ArcadeGameMeta = { ...metaRaw, title: t(metaRaw.title), tagline: t(metaRaw.tagline) };
  const progress = useArcadeProgress();
  const [level, setLevel] = useState('all');
  const [phase, setPhase] = useState<'intro' | 'play' | 'end'>('intro');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [index, setIndex] = useState(0); const [score, setScore] = useState(0); const [hearts, setHearts] = useState(3);
  const [typed, setTyped] = useState(''); const [third, setThird] = useState('');
  const [tiles, setTiles] = useState<string[]>([]); const [selected, setSelected] = useState<number[]>([]);
  const [guessed, setGuessed] = useState<string[]>([]); const [feedback, setFeedback] = useState<boolean | null>(null);
  const [result, setResult] = useState<{ xpEarned: number; newBest: boolean } | null>(null);
  const [review, setReview] = useState<Round[]>([]);
  const loadRound = (r: Round) => { setTyped(''); setThird(''); setSelected([]); setGuessed([]); setFeedback(null); setTiles(shuffle(r.answer.split(''))); };
  const start = () => { const list = buildWordLabRounds(id, level, t); if (!list.length) return; setRounds(list); setIndex(0); setScore(0); setHearts(3); setReview([]); loadRound(list[0]); setPhase('play'); };
  const r = rounds[index];
  const check = (answer: string, override?: boolean) => {
    if (feedback !== null) return;
    const ok = override ?? (r.kind === 'verb' ? r.answer.split(' / ').some(x => normalizeTyped(x) === normalizeTyped(answer)) && (r.extra || '').split(' / ').some(x => normalizeTyped(x) === normalizeTyped(third)) : answer.trim().toLowerCase() === r.answer.trim().toLowerCase());
    setFeedback(ok); playSound(ok ? 'correct' : 'wrong'); if (ok) setScore(s => s + 1); else { setHearts(h => h - 1); setReview(list => [...list, r]); }
  };
  const next = () => { if (index + 1 === rounds.length || (id === 'boss-run' && hearts <= 0)) { setResult(recordGameResult(id, score)); setPhase('end'); } else { setIndex(i => i + 1); loadRound(rounds[index + 1]); } };
  const guess = (letter: string) => { if (feedback !== null || guessed.includes(letter)) return; const letters = [...guessed, letter]; setGuessed(letters); if (r.answer.split('').every(c => letters.includes(c))) check(r.answer, true); else if (letters.filter(c => !r.answer.includes(c)).length >= 6) check('', false); };
  if (phase === 'intro') return <section className="max-w-lg mx-auto space-y-5 rounded-3xl border border-white/10 bg-[#121124] p-5 text-center">
    <ArcadeIcon id={id} large/><h2 className="text-2xl font-black text-white">{meta.title}</h2><p className="text-sm leading-7 text-[#b9b6d5]">{meta.tagline}</p>
    {!['verb-workshop', 'mistake-lab'].includes(id) && <label className="block text-sm text-white">{t('wl.levelLabel')} <select aria-label={t('wl.levelLabel')} value={level} onChange={e => setLevel(e.target.value)} className="mt-2 w-full rounded-xl bg-[#211d38] p-3"><option value="all">{t('wl.allLevels')}</option>{['A1','A2','B1','B2','C1'].map(l => <option key={l}>{l}</option>)}</select></label>}
    <p className="text-xs text-[#ffd166]">{t('wl.bestScore')}: {progress.best[id] ?? 0} • {t('wl.localProgress')}</p>
    <button onClick={start} className="w-full rounded-2xl bg-[#c4ff55] py-4 font-black text-[#0c0b20]">{t('wl.start')}</button><button onClick={onExit} className={button}>{t('wl.back')}</button>
  </section>;
  if (phase === 'end' && result) return <ArcadeEnd meta={meta} score={score} {...result} best={progress.best[id] ?? score} onReplay={start} onBack={onExit} extra={<div className="space-y-3 text-sm text-[#b9b6d5]"><p>{t('wl.resultCorrect')} {score} {t('wl.resultOf')} {index + 1} • {Math.round(score / (index + 1) * 100)}%</p>{review.length > 0 && <details className="rounded-2xl border border-white/10 p-3 text-right"><summary>{t('wl.review')} {review.length} {t('wl.reviewUnit')}</summary>{review.map((x,i) => <p key={i} dir="auto" className="mt-3 border-t border-white/10 pt-3">{x.prompt}<br/><b className="text-[#c4ff55]">{x.answer}{x.extra ? ` / ${x.extra}` : ''}</b><br/>{x.detail}</p>)}</details>}</div>} />;
  if (!r) return null;
  const shown = r.kind === 'rescue' ? r.answer.split('').map(c => guessed.includes(c) || feedback !== null ? c : '_').join(' ') : r.prompt;
  return <section className="max-w-lg mx-auto space-y-4">
    <ArcadeHud title={meta.title} round={index + 1} totalRounds={rounds.length} score={score} onQuit={onExit}/>
    <div className="flex justify-between text-xs text-[#9b7bff]"><span>{r.level}</span>{id === 'boss-run' && <span>{t('wl.gate')} {Math.floor(index / 5) + 1} • {'♥'.repeat(Math.max(0, hearts))}</span>}</div>
    <div className="rounded-3xl border border-white/10 bg-[#121124] p-5 space-y-5 text-center">
      <p className="text-sm leading-7 text-[#b9b6d5]">{tx(r.clue)}</p><h3 dir="auto" className="text-xl font-bold leading-9 text-white break-words">{shown}</h3>
      {r.kind === 'rescue' && <><p className="text-xs text-[#ffd166]">{t('wl.triesLeft')}: {6 - guessed.filter(c => !r.answer.includes(c)).length}</p><div dir="ltr" className="grid grid-cols-6 gap-1.5">{'abcdefghijklmnopqrstuvwxyz'.split('').map(c => <button key={c} disabled={guessed.includes(c) || feedback !== null} className={button + ' !p-2'} onClick={() => guess(c)}>{c.toUpperCase()}</button>)}</div></>}
      {r.kind === 'letters' && <><div dir="ltr" className="min-h-12 rounded-xl border border-[#41e7ff]/30 p-3 text-xl text-[#41e7ff]">{selected.map(i => tiles[i]).join('')}</div><div dir="ltr" className="flex flex-wrap justify-center gap-2">{tiles.map((c,i) => <button key={i} disabled={selected.includes(i) || feedback !== null} className={button} onClick={() => setSelected(s => [...s,i])}>{c}</button>)}</div><button disabled={feedback !== null} onClick={() => setSelected(s => s.slice(0,-1))} className={button}>{t('wl.undoLetter')}</button></>}
      {(r.kind === 'type' || r.kind === 'verb') && <div className="space-y-2"><input aria-label={r.kind === 'verb' ? 'V2' : t('wl.typeWordAria')} placeholder={r.kind === 'verb' ? 'Past simple (V2)' : t('wl.typeWordPh')} dir="ltr" spellCheck={false} autoComplete="off" autoCapitalize="none" value={typed} disabled={feedback !== null} onChange={e => setTyped(e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/5 p-3 text-white"/>{r.kind === 'verb' && <input aria-label="V3" placeholder="Past participle (V3)" dir="ltr" spellCheck={false} autoComplete="off" value={third} disabled={feedback !== null} onChange={e => setThird(e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/5 p-3 text-white"/>}</div>}
      {r.kind === 'choice' && <div className="grid grid-cols-2 gap-2">{r.options?.map(o => <button key={o} dir="auto" disabled={feedback !== null} className={button + (feedback !== null && o.trim().toLowerCase() === r.answer.trim().toLowerCase() ? ' !border-[#c4ff55] !text-[#c4ff55]' : '')} onClick={() => check(o)}>{o}</button>)}</div>}
      {feedback === null && !['choice', 'rescue'].includes(r.kind) && <button disabled={r.kind === 'letters' ? selected.length !== tiles.length : !typed.trim() || (r.kind === 'verb' && !third.trim())} onClick={() => check(r.kind === 'letters' ? selected.map(i => tiles[i]).join('') : typed)} className="w-full rounded-xl bg-[#c4ff55] p-3 font-black text-[#0c0b20] disabled:opacity-40">{t('wl.confirm')}</button>}
      {feedback !== null && <div role="status" className="space-y-3 rounded-2xl border border-white/15 p-4"><p className={feedback ? 'text-[#c4ff55]' : 'text-[#ffd166]'}>{feedback ? t('wl.correct') : t('wl.correctAnswer')}</p><p dir="auto" className="font-bold text-white">{r.answer}{r.extra ? ` / ${r.extra}` : ''}</p><p dir="auto" className="text-sm leading-7 text-[#b9b6d5]">{r.detail}</p><button onClick={() => speakEnglish(r.answer)} className={button}>{t('wl.listen')}</button><button onClick={next} className="w-full rounded-xl bg-[#41e7ff] p-3 font-black text-[#0c0b20]">{index + 1 === rounds.length || (id === 'boss-run' && hearts <= 0) ? t('wl.seeResult') : t('wl.nextQuestion')}</button></div>}
    </div>
  </section>;
}
