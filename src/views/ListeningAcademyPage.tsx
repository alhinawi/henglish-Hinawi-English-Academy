import { loadListeningProgress as load, saveListeningProgress, mergeListeningProgress, solvedListeningTasks, type ListeningSaved as Saved } from '../services/listeningProgress';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { PageRoute } from '../types';
import { ALL_LISTENING_LESSONS, normalizeListeningAnswer, type ListeningLesson } from '../data/listeningAcademyData';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { useLanguage } from '../i18n/LanguageContext';
import { getVoiceSettings, speakEnglish, stopSpeech, subscribeSpeechState, type SpeechSpeed } from '../utils/audio';
import { ArrowRight, Check, CheckCircle2, Headphones, Play, Search, Square, Volume2, X } from 'lucide-react';

const KEY = 'henglish-listening-studio-v1';
function gapFor(lesson: ListeningLesson) {
  const words = lesson.dictationSentence.split(' ');
  const index = words.map((w, i) => ({ w: normalizeListeningAnswer(w), i })).filter(x => x.w.length > 3).slice(-1)[0]?.i ?? words.length - 1;
  const answer = normalizeListeningAnswer(words[index]);
  const distractors = Array.from(new Set(ALL_LISTENING_LESSONS.flatMap(t => t.dictationSentence.split(' ')).map(normalizeListeningAnswer))).filter(w => w && w !== answer && w.length > 3).slice(0, 3);
  const options = [...distractors]; options.splice(lesson.id.length % 4, 0, answer);
  return { sentence: words.map((w, i) => i === index ? '______' : w).join(' '), answer, options };
}
function taskIds(lesson: ListeningLesson) { return [...lesson.comprehensionQuiz.map(q => q.id), 'gap', 'dictation', 'order']; }

interface Props { onNavigate: (route: PageRoute) => void; onCompleteActivity?: (id: string, score: number, total: number) => void; learnerId?: string; }
export const ListeningAcademyPage: React.FC<Props> = ({ onNavigate, onCompleteActivity, learnerId }) => {
  const storageKey = `${KEY}:${learnerId || 'local'}`;
  return <LearnerListeningAcademy key={storageKey} onNavigate={onNavigate} onCompleteActivity={onCompleteActivity} storageKey={storageKey} />;
};
const LearnerListeningAcademy: React.FC<Omit<Props, 'learnerId'> & { storageKey: string }> = ({ onNavigate, onCompleteActivity, storageKey }) => {
  const [saved, setSaved] = useState<Saved>(() => load(storageKey));
  const savedRef = useRef(saved);
  const [storageWarning, setStorageWarning] = useState(!!saved.storageUnreadable);
  const [level, setLevel] = useState('All');
  const appText = useAppTextMap('listeningAcademyData');
  const { t, dir, lang } = useLanguage();
  const [query, setQuery] = useState('');
  const [reviewOnly, setReviewOnly] = useState(false);
  const [selected, setSelected] = useState<ListeningLesson | null>(null);
  const [transcript, setTranscript] = useState(false);
  const [speed, setSpeed] = useState<SpeechSpeed>(0.92);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [dictation, setDictation] = useState('');
  const [dictationFeedback, setDictationFeedback] = useState<boolean | null>(null);
  const [gapAnswer, setGapAnswer] = useState<string | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [orderFeedback, setOrderFeedback] = useState<boolean | null>(null);
  const [notice, setNotice] = useState('');
  const [pendingSaveTask, setPendingSaveTask] = useState<string | null>(null);
  const pendingSaveTasks = useRef<string[]>([]);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => { const next = load(storageKey); savedRef.current = next; setSaved(next); setStorageWarning(!!next.storageUnreadable); }, [storageKey]);
  useEffect(() => subscribeSpeechState((active) => setPlaying(active)), []);
  useEffect(() => () => stopSpeech(), []);
  const visible = useMemo(() => ALL_LISTENING_LESSONS.filter(t => (level === 'All' || (level === 'Legacy' ? !t.original : t.level === level && t.original)) && `${t.title} ${t.titleAr} ${t.focusAr} ${t.focusEn} ${txText(appText, t.titleAr)} ${txText(appText, t.focusAr)}`.toLowerCase().includes(query.trim().toLowerCase()) && (!reviewOnly || solvedListeningTasks(saved, t.id, taskIds(t)).length < taskIds(t).length)), [level, query, reviewOnly, saved, appText]);
  const completed = ALL_LISTENING_LESSONS.filter(t => solvedListeningTasks(saved, t.id, taskIds(t)).length === taskIds(t).length).length;
  const totalActivities = ALL_LISTENING_LESSONS.reduce((n, t) => n + taskIds(t).length, 0);
  const solved = selected ? solvedListeningTasks(saved, selected.id, taskIds(selected)) : [];
  const gap = selected ? gapFor(selected) : null;
  const tokens = selected?.dictationSentence.split(' ') || [];
  const shuffled = useMemo(() => tokens.map((word, index) => ({ word, index })).reverse(), [selected?.id]);
  function persist(next: Saved): boolean {
    const success = saveListeningProgress(storageKey, next);
    setStorageWarning(!success);
    if (!success) return false;
    savedRef.current = next; setSaved(next);
    return true;
  }
  function solve(task: string) {
    if (!selected) return;
    const prev = mergeListeningProgress(load(storageKey), savedRef.current);
    const done = Array.from(new Set([...(prev.solved[selected.id] || []), ...pendingSaveTasks.current, task]));
    const next = { ...prev, solved: { ...prev.solved, [selected.id]: done } };
    const award = taskIds(selected).every(id => done.includes(id)) && !prev.awarded.includes(selected.id) && !!onCompleteActivity;
    if (award) next.awarded = [...prev.awarded, selected.id];
    if (!persist(next)) { pendingSaveTasks.current = done; setPendingSaveTask(task); return; }
    pendingSaveTasks.current = [];
    setPendingSaveTask(null);
    if (award) {
      onCompleteActivity?.(`listening:${selected.id}`, 1, 1);
      setNotice(t('listen.lessonCompleteToast'));
    }
  }
  function open(lesson: ListeningLesson) {
    pendingSaveTasks.current = [];
    stopSpeech(); setPlaying(false); setSelected(lesson); setTranscript(false); setAnswers({}); setDictation(''); setDictationFeedback(null); setGapAnswer(null); setOrder([]); setOrderFeedback(null); setNotice(''); setAudioError(''); setPendingSaveTask(null);
    requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
  function play(text: string) {
    stopSpeech(); setAudioError('');
    if (getVoiceSettings().isMuted) { setPlaying(false); setAudioError(t('w3.voice.muted')); return; }
    let settled = false;
    speakEnglish(text, { speed, accent: selected?.accent === 'British' ? 'UK' : 'US', onEnd: () => { settled = true; setPlaying(false); }, onError: () => { settled = true; setPlaying(false); setAudioError(t('listen.audioError')); } });
    // Starting synthesis cancels the previous request synchronously. Keep Stop
    // available after that notification, including while the new request waits.
    setPlaying(!settled);
  }
  const button = 'rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300 disabled:opacity-40';
  const box = 'rounded-3xl border border-white/10 bg-[#12162b] p-5 sm:p-7';
  return <div dir={dir} className="mx-auto max-w-6xl space-y-6 pb-16 text-white">
    <header className="relative isolate overflow-hidden rounded-[28px] border border-white/15 bg-[#10172c] px-6 py-9 sm:p-12">
      <img src="/images/listening/classroom.webp" alt={t('listen.heroAlt')} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 -z-10 bg-linear-to-l from-[#10172c] via-[#10172c]/85 to-[#10172c]/50" />
      <p dir="ltr" className="mb-4 text-right text-xs font-bold tracking-[0.2em] text-cyan-200">HENGLISH / LISTENING STUDIO</p>
      <h1 className="text-3xl font-black leading-tight sm:text-5xl">{t('listen.heroTitleA')}<br /><span className="text-cyan-200">{t('listen.heroTitleB')}</span></h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">{t('listen.heroSub')}</p>
      <div className="mt-7 grid grid-cols-3 gap-2 text-center">
        {[[String(ALL_LISTENING_LESSONS.length),t('badges.category.lessons')],['6',t('listen.statTracks')],[String(totalActivities),t('listen.statDrills')]].map(([n,l]) => <div key={l} className="rounded-2xl border border-white/10 bg-black/20 p-3"><strong dir="ltr" className="block text-2xl text-white">{n}</strong><span className="text-[11px] text-slate-300">{l}</span></div>)}
      </div>
    </header>
    <section className={box} aria-label={t('listen.progressAria')}>
      <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold">{t('listen.journey')}</p><p className="mt-1 text-xs text-slate-300">{t('listen.completedCount').replace('{completed}', String(completed)).replace('{total}', String(ALL_LISTENING_LESSONS.length))}</p></div><Headphones className="text-cyan-200" /></div>
      <progress aria-label={t('listen.progressBarAria')} value={completed} max={ALL_LISTENING_LESSONS.length} className="mt-4 h-2 w-full accent-cyan-300" />
      <p className="mt-2 text-xs leading-6 text-slate-400">{t('listen.progressNote')}</p>
      {storageWarning && <div role="alert" className="mt-2 space-y-2 text-sm text-amber-200"><p>{t('sa.saveError')}</p>{pendingSaveTask && <button type="button" onClick={() => solve(pendingSaveTask)} className="rounded-xl border border-amber-300/30 px-4 py-2 font-bold">{t('listen.tryAgain')}</button>}</div>}
    </section>
    <section ref={panel} className="scroll-mt-24" aria-label={t('listen.studioAria')}>
      {selected && <div className="space-y-5">
        <div className="overflow-hidden rounded-3xl border border-cyan-300/25 bg-[#11182e]">
          <div className="relative"><img src={selected.image} alt={selected.imageAlt} className="h-44 w-full object-cover sm:h-64" /><button onClick={() => { stopSpeech(); setSelected(null); }} aria-label={t('listen.closeLesson')} className="absolute left-3 top-3 rounded-full bg-black/80 p-3"><X size={18} /></button><span className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-3 py-1 text-xs">{selected.level} · {solved.length}/{taskIds(selected).length} {t('listen.completedBadge')}</span></div>
          <div className="space-y-4 p-5 sm:p-7">
            <h2 className="text-2xl font-black">{lang === 'en' ? selected.title : txText(appText, selected.titleAr)}</h2><p dir="ltr" lang="en" className="text-left text-sm text-slate-300">{selected.title}</p>
            <p className="text-xs text-cyan-200">{lang === 'en' ? selected.focusEn : txText(appText, selected.focusAr)}</p>
            <div className="flex flex-wrap gap-2"><button className={`${button} inline-flex grow items-center justify-center gap-2 bg-cyan-300/15`} onClick={() => playing ? (stopSpeech(), setPlaying(false)) : play(selected.transcript)}>{playing ? <Square size={18} /> : <Play size={18} />}{playing ? t('listen.stopAudio') : t('listen.playClip')}</button><select aria-label={t('listen.speedAria')} value={speed} onChange={e => { stopSpeech(); setPlaying(false); setSpeed(Number(e.target.value) as SpeechSpeed); }} className={`${button} bg-[#12162b]`}><option value={0.75}>0.75x {t('listen.speedSlow')}</option><option value={0.92}>0.92x {t('listen.speedClear')}</option><option value={1}>1x {t('listen.speedNormal')}</option><option value={1.25}>1.25x {t('listen.speedFast')}</option></select></div>
            {audioError && <p role="alert" className="text-sm text-amber-200">{audioError}</p>}
            <button onClick={() => setTranscript(!transcript)} aria-expanded={transcript} className={button}>{transcript ? t('listen.hideTranscript') : t('listen.revealTranscript')}</button>
            {transcript && <div className="space-y-4 rounded-2xl bg-black/25 p-4"><p dir="ltr" lang="en" className="text-left text-base leading-8">{selected.transcript}</p><p className="text-sm leading-7 text-slate-300">{txText(appText, selected.transcriptAr)}</p><p className="text-xs leading-6 text-slate-400">{t('listen.transcriptNote')}</p></div>}
          </div>
        </div>
        <div className="grid items-start gap-5 lg:grid-cols-2">
          {selected.comprehensionQuiz.map((q,i) => <section key={q.id} className={box}><p className="mb-2 text-xs text-cyan-200">{t('listen.quizTitle').replace('{n}', String(i+1))}{solved.includes(q.id) ? t('listen.masteredSuffix') : ''}</p><h3 dir="ltr" className="mb-4 text-left text-lg font-bold" lang="en">{q.question}</h3><div className="space-y-2">{q.options.map((option,n) => <button key={option} disabled={answers[q.id] !== undefined} dir="ltr" lang="en" onClick={() => { setAnswers(a => ({...a,[q.id]:n})); if(n === q.answer) solve(q.id); }} className={`${button} w-full text-left ${answers[q.id] === n ? n === q.answer ? 'border-emerald-300! bg-emerald-400/15!' : 'border-rose-300! bg-rose-400/15!' : ''}`}>{option}</button>)}</div>{answers[q.id] !== undefined && <div aria-live="polite" className="mt-4 text-sm leading-7"><p dir="auto" className={answers[q.id] === q.answer ? 'text-emerald-200' : 'text-amber-200'}>{answers[q.id] === q.answer ? t('listen.correct') : t('listen.wrong')}{txText(appText, q.explanation.replace(selected.transcriptAr, txText(appText, selected.transcriptAr)))}</p>{answers[q.id] !== q.answer && <button className={`${button} mt-2`} onClick={() => setAnswers(a => { const next = {...a}; delete next[q.id]; return next; })}>{t('listen.tryAgain')}</button>}</div>}</section>)}
          <section className={box}><h3 className="text-lg font-bold">{t('listen.gapTitle')} {solved.includes('gap') && <Check size={18} className="inline text-emerald-300" aria-label="done" />}</h3><p className="mt-2 text-xs text-slate-300">{t('listen.gapHint')}</p><button aria-label={t('listen.gapPlayAria')} className={`${button} my-4`} onClick={() => play(selected.dictationSentence)}><Volume2 size={18} /></button><p dir="ltr" className="mb-4 text-left leading-8">{gap?.sentence}</p><div className="flex flex-wrap gap-2" dir="ltr">{gap?.options.map(w => <button key={w} className={`${button} ${gapAnswer === w ? w === gap.answer ? 'border-emerald-300!' : 'border-rose-300!' : ''}`} onClick={() => { setGapAnswer(w); if(w === gap.answer) solve('gap'); }}>{w}</button>)}</div>{gapAnswer && <p aria-live="polite" className="mt-4 text-sm text-cyan-200">{gapAnswer === gap?.answer ? t('listen.gapCorrect') : t('listen.gapWrong')}</p>}</section>
          <section className={box}><h3 className="text-lg font-bold">{t('listen.dictTitle')} {solved.includes('dictation') && <Check size={18} className="inline text-emerald-300" aria-label="done" />}</h3><p className="mt-2 text-xs leading-6 text-slate-300">{t('listen.dictHint')}</p><button className={`${button} my-4 inline-flex items-center gap-2`} onClick={() => play(selected.dictationSentence)}><Volume2 size={18} />{t('listen.dictSentence')}</button><textarea aria-label={t('listen.dictAria')} dir="ltr" lang="en" value={dictation} onChange={e => { setDictation(e.target.value); setDictationFeedback(null); }} rows={3} placeholder="Type the whole sentence..." className="w-full rounded-xl border border-white/20 bg-black/25 p-4 text-left text-base" /><button className={`${button} mt-3 w-full`} disabled={!dictation.trim()} onClick={() => { const correct = normalizeListeningAnswer(dictation) === normalizeListeningAnswer(selected.dictationSentence); setDictationFeedback(correct); if(correct) solve('dictation'); }}>{t('listen.dictCheck')}</button>{dictationFeedback !== null && <div aria-live="polite" className="mt-4 text-sm leading-7"><p className={dictationFeedback ? 'text-emerald-200' : 'text-amber-200'}>{dictationFeedback ? t('listen.dictCorrect') : t('listen.dictWrong')}</p>{!dictationFeedback && <p dir="ltr" className="mt-2 text-left">{selected.dictationSentence}</p>}</div>}</section>
          <section className={box}><h3 className="text-lg font-bold">{t('listen.orderTitle')} {solved.includes('order') && <Check size={18} className="inline text-emerald-300" aria-label="done" />}</h3><p className="my-3 text-xs leading-6 text-slate-300">{t('listen.orderHint')}</p><div dir="ltr" className="mb-4 flex min-h-20 flex-wrap gap-2 rounded-xl border border-dashed border-cyan-300/40 p-3">{order.map((n,i) => <button key={`${n}-${i}`} className={button} onClick={() => { setOrder(o => o.filter((_,k) => k !== i)); setOrderFeedback(null); }}>{tokens[n]}</button>)}</div><div dir="ltr" className="flex flex-wrap gap-2">{shuffled.map(({word,index}) => <button key={index} disabled={order.includes(index)} className={button} onClick={() => {setOrder(o => [...o,index]); setOrderFeedback(null);}}>{word}</button>)}</div><div className="mt-4 flex gap-2"><button className={`${button} grow`} disabled={order.length !== tokens.length} onClick={() => { const ok = normalizeListeningAnswer(order.map(n => tokens[n]).join(' ')) === normalizeListeningAnswer(selected.dictationSentence); setOrderFeedback(ok); if(ok) solve('order'); }}>{t('listen.orderCheck')}</button><button aria-label={t('listen.orderResetAria')} className={button} onClick={() => {setOrder([]); setOrderFeedback(null);}}>{t('listen.orderReset')}</button></div>{orderFeedback !== null && <p aria-live="polite" className="mt-4 text-sm text-cyan-200">{orderFeedback ? t('listen.orderCorrect') : t('listen.orderWrong')}</p>}</section>
        </div>
        {notice && <p role="status" className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-5 text-sm leading-7 text-emerald-100">{notice}</p>}
        <div className="flex flex-wrap gap-2"><button className={`${button} inline-flex items-center gap-2`} onClick={() => { const i = ALL_LISTENING_LESSONS.findIndex(t => t.id === selected.id); open(ALL_LISTENING_LESSONS[(i+1)%ALL_LISTENING_LESSONS.length]); }}>{t('listen.nextLesson')}<ArrowRight size={16} /></button><button className={button} onClick={() => {stopSpeech();setSelected(null);}}>{t('listen.backToLibrary')}</button></div>
      </div>}
    </section>
    <section className="space-y-5" aria-label={t('listen.libraryAria')}>
      <div><h2 className="text-2xl font-black">{t('listen.pickStation')}</h2><p className="mt-2 text-sm text-slate-300">{t('listen.librarySub').replace('{new}', String(ALL_LISTENING_LESSONS.filter(x => x.original).length)).replace('{orig}', String(ALL_LISTENING_LESSONS.filter(x => !x.original).length))}</p></div>
      <label className="flex items-center gap-3 rounded-2xl border border-white/15 bg-[#12162b] px-4"><Search size={19} className="shrink-0 text-slate-400" /><input aria-label={t('listen.searchAria')} value={query} onChange={e => setQuery(e.target.value)} placeholder={t('listen.searchPlaceholder')} className="min-w-0 grow bg-transparent py-4 text-sm outline-none" /></label>
      <div className="flex flex-wrap gap-2">{[['All',t('listen.filterAll')],['A1',t('listen.levelA1')],['A2',t('listen.levelA2')],['B1',t('listen.levelB1')],['B2',t('listen.levelB2')],['C1',t('listen.levelC1')],['C2',t('listen.levelC2')],['Legacy',t('listen.levelLegacy')]].map(([v,l]) => <button key={v} aria-pressed={level===v} onClick={() => setLevel(v)} className={`${button} px-3! text-xs! ${level===v ? 'border-cyan-300! bg-cyan-300/15! text-cyan-100!' : ''}`}>{l}</button>)}</div>
      <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={reviewOnly} onChange={e => setReviewOnly(e.target.checked)} className="accent-cyan-300" />{t('listen.reviewOnly')}</label>
      <p className="text-xs text-slate-400" role="status">{t('listen.visibleCount').replace('{n}', String(visible.length))}</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{visible.map((lsn,i) => { const done = solvedListeningTasks(saved, lsn.id, taskIds(lsn)).length; const full = done >= taskIds(lsn).length; return <button key={lsn.id} onClick={() => open(lsn)} className="group overflow-hidden rounded-3xl border border-white/10 bg-[#12162b] text-start hover:border-cyan-300/50 focus-visible:outline-2 focus-visible:outline-cyan-300"><div className="relative"><img src={lsn.image} alt={lsn.imageAlt} loading={i<3 ? 'eager' : 'lazy'} className="h-44 w-full object-cover" /><span className="absolute bottom-3 right-3 rounded-lg bg-[#090f23]/90 px-3 py-1 text-xs font-bold text-cyan-100">{lsn.level} · {lsn.original ? t('listen.unitTrack').replace('{n}', String(lsn.unit)) : t('listen.originalTrack')}</span><span className="absolute left-3 top-3 rounded-full bg-black/70 p-2">{full ? <CheckCircle2 size={19} className="text-emerald-300" /> : <Headphones size={19} className="text-white" />}</span></div><div className="space-y-3 p-5"><h3 className="text-lg font-black">{lang === 'en' ? lsn.title : txText(appText, lsn.titleAr)}</h3><p dir="ltr" lang="en" className="text-left text-xs text-slate-400">{lsn.title}</p><p className="text-xs leading-6 text-slate-300">{lang === 'en' ? lsn.focusEn : txText(appText, lsn.focusAr)}</p><div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs"><span className="font-bold text-cyan-200">{full ? t('listen.ctaReview') : done ? t('listen.ctaContinue') : t('listen.ctaStart')}</span><span className="text-slate-400">{t('listen.drillCount').replace('{done}', String(done)).replace('{total}', String(taskIds(lsn).length))}</span></div></div></button>; })}</div>
      {visible.length === 0 && <p className={`${box} text-sm text-slate-300`}>{t('listen.noMatches')}</p>}
    </section>
    <footer className="space-y-3 border-t border-white/10 pt-6 text-xs leading-6 text-slate-400"><p>{t('listen.transcriptNote')} {t('sa.aboutP2')}</p><button onClick={() => onNavigate('dashboard')} className={button}>{t('listen.backHome')}</button></footer>
  </div>;
};
