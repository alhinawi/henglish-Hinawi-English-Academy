import { LessonSpeechButton } from './LessonSpeechButton';
import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, RotateCcw, CheckCircle2 } from 'lucide-react';
import type { SpeakingLesson } from '../data/speakingAcademyData';
import { stopSpeech } from '../utils/audio';
import { useLanguage } from '../i18n/LanguageContext';

export function SpeakingRecorder({ prompt, description }: { prompt: string; description?: string }) {
  const { t } = useLanguage();
  const [recording, setRecording] = useState(false);
  const [starting, setStarting] = useState(false);
  const mounted = useRef(true);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const objectUrl = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { mounted.current = true; return () => {
    mounted.current = false;
    if (timer.current) clearTimeout(timer.current);
    if (recorder.current?.state === 'recording') recorder.current.stop();
    stream.current?.getTracks().forEach(t => t.stop());
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }; }, []);
  async function start() {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError(t('sp.rec.unavailable')); return;
    }
    setStarting(true);
    let acquiredMedia: MediaStream | null = null;
    try {
      stopSpeech();
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      acquiredMedia = media;
      if (!mounted.current) { media.getTracks().forEach(t => t.stop()); return; }
      stream.current = media;
      const r = new MediaRecorder(media); recorder.current = r;
      const chunks: Blob[] = [];
      r.onerror = () => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        // Failed output must not replace the last usable recording.
        r.ondataavailable = null;
        r.onstop = null;
        r.onerror = null;
        try { if (r.state === 'recording') r.stop(); } catch { /* Tracks are released below. */ }
        media.getTracks().forEach(track => track.stop());
        if (recorder.current === r) { recorder.current = null; stream.current = null; }
        if (mounted.current) { setRecording(false); setStarting(false); setError(t('sp.rec.micError')); }
      };
      r.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      r.onstop = () => {
        if (timer.current) clearTimeout(timer.current);
        media.getTracks().forEach(t => t.stop());
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        if (!mounted.current) return;
        const next = URL.createObjectURL(new Blob(chunks, { type: r.mimeType }));
        objectUrl.current = next; setUrl(next); setRecording(false);
      };
      r.start(); setRecording(true);
      timer.current = setTimeout(() => { if (r.state === 'recording') r.stop(); }, 90000);
    } catch {
      // Permission may succeed before recorder construction or start throws.
      // Release that stream immediately, even when no recorder ever started.
      acquiredMedia?.getTracks().forEach(track => track.stop());
      if (stream.current === acquiredMedia) {
        if (recorder.current) {
          recorder.current.ondataavailable = null;
          recorder.current.onstop = null;
          recorder.current.onerror = null;
        }
        recorder.current = null;
        stream.current = null;
      }
      if (mounted.current) {
        setRecording(false);
        setError(t('sp.rec.micError'));
      }
    } finally { if (mounted.current) setStarting(false); }
  }
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-4">
    <p dir="ltr" className="text-left text-lg font-semibold leading-8 text-white">{prompt}</p>
    {description && <p className="text-sm text-slate-300">{description}</p>}
    <p className="text-xs leading-6 text-slate-400">{t('sp.rec.note')}</p>
    <button type="button" disabled={starting} onClick={() => recording ? recorder.current?.stop() : void start()} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-pink-300 px-5 font-bold text-slate-950">{recording ? <Square size={18}/> : <Mic size={18}/>} {starting ? t('sp.rec.starting') : recording ? t('sp.rec.stop') : t('sp.rec.start')}</button>
    {recording && <p role="status" className="text-pink-200">{t('sp.rec.live')}</p>}
    {url && <audio controls src={url} className="w-full" aria-label={t('sp.rec.listenAria')}/>}
    {error && <p role="alert" className="text-sm text-amber-200">{error}</p>}
  </div>;
}
const clean = (s: string) => s.trim().toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ');

export function SpeakingPracticeStudio({ lesson, completed, onComplete }: {lesson: SpeakingLesson; completed: boolean; onComplete: () => void}) {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [choice, setChoice] = useState<number | null>(null);
  const [gap, setGap] = useState('');
  const [gapChecked, setGapChecked] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [orderChecked, setOrderChecked] = useState(false);
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);
  const [showAr, setShowAr] = useState(true);
  const words = lesson.phrase.split(' ');
  // Stable reverse order avoids answer leakage and random reordering during a task.
  const tiles = words.map((word, index) => ({word, index})).reverse();
  const ordered = selected.map(i => words[i]).join(' ');
  const ready = answers.choice && answers.gap && answers.order && checks.every(Boolean);
  useEffect(() => () => stopSpeech(), []);
  return <div className="space-y-6">
    <section className="rounded-3xl border border-white/10 bg-[#12152b] p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3"><h3 className="font-bold text-xl">1. {t('sp.step1')}</h3><button onClick={() => setShowAr(v => !v)} className="min-h-11 text-xs text-cyan-200">{showAr ? t('sp.step1.hide') : t('sp.step1.show')}</button></div>
      <p className="text-sm leading-7 text-slate-400">{t('sp.step1.note')}</p>
      {lesson.dialogue.map((line, i) => <div key={i} className={`rounded-2xl p-4 ${line.role === 'B' ? 'bg-pink-300/10 border border-pink-300/20' : 'bg-white/5'}`}>
        <div className="flex flex-wrap items-start justify-between gap-3"><span className="text-xs text-pink-200">{line.role === 'A' ? t('sp.roleA') : t('sp.roleB')}</span><LessonSpeechButton key={line.en} text={line.en} label={`${t('sp.listenLineAria')} ${i+1}`} iconOnly className="p-3 rounded-xl bg-white/5" /></div>
        <p dir="ltr" className="text-left text-base leading-8 font-medium">{line.en}</p>{showAr && line.ar && <p dir="auto" className="text-sm text-slate-300 leading-7 mt-2">{line.ar}</p>}
      </div>)}
    </section>
    <section className="rounded-3xl border border-white/10 bg-[#12152b] p-4 sm:p-6 space-y-4">
      <h3 className="font-bold text-xl">2. {t('sp.step2')}</h3><p dir="ltr" className="text-left leading-8">{lesson.dialogue[0].en}</p>
      {[1, 0, 2].map(i => <button key={i} onClick={() => {setChoice(i); setAnswers(p => ({...p, choice: i === lesson.answer}));}} className={`w-full text-left rounded-xl border p-4 min-h-14 ${choice === i ? i === lesson.answer ? 'border-emerald-300 bg-emerald-300/10' : 'border-rose-300 bg-rose-300/10' : 'border-white/10 bg-white/5'}`} dir="ltr">{lesson.options[i]}</button>)}
      {choice !== null && <p role="status" className="text-sm leading-7 text-cyan-100">{choice === lesson.answer ? `${t('sp.step2.correct')} ${lesson.dialogue[1].ar}` : `${t('sp.step2.retry')} ${lesson.tip}`}</p>}
    </section>
    <section className="rounded-3xl border border-white/10 bg-[#12152b] p-4 sm:p-6 space-y-4">
      <h3 className="font-bold text-xl">3. {t('sp.step3')}</h3><p dir="ltr" className="text-left leading-8">{lesson.gapPrompt}</p>
      <input aria-label={t('sp.step3.aria')} dir="ltr" value={gap} onChange={e => {setGap(e.target.value);setGapChecked(false);setAnswers(p=>({...p,gap:false}));}} className="w-full rounded-xl border border-white/20 bg-black/20 p-4" autoComplete="off" placeholder="Type the missing word"/>
      <button onClick={() => {setGapChecked(true);setAnswers(p=>({...p,gap:clean(gap)===clean(lesson.gap)}));}} className="min-h-12 rounded-xl bg-cyan-200 text-slate-950 px-5 font-bold">{t('sp.step3.check')}</button>
      {gapChecked && <p role="status" className="text-sm text-cyan-100">{answers.gap ? t('sp.step3.correct') : `${t('sp.step3.hintA')} ${lesson.gap[0]}${t('sp.step3.hintB')} ${lesson.gap.length}. ${t('sp.step3.hintC')}`}</p>}
    </section>
    <section className="rounded-3xl border border-white/10 bg-[#12152b] p-4 sm:p-6 space-y-4">
      <h3 className="font-bold text-xl">4. {t('sp.step4')}</h3><p className="text-sm text-slate-400">{t('sp.step4.note')}</p>
      <div dir="ltr" className="flex flex-wrap gap-2">{tiles.map(tile => <button key={tile.index} disabled={selected.includes(tile.index)} onClick={() => {setSelected(p=>[...p,tile.index]);setOrderChecked(false);setAnswers(p=>({...p,order:false}));}} className="min-h-11 rounded-xl px-3 bg-white/10 disabled:opacity-25">{tile.word}</button>)}</div>
      <p dir="ltr" className="min-h-16 rounded-xl bg-black/20 p-4 text-left leading-8">{ordered || '…'}</p>
      <div className="flex gap-2 flex-wrap"><button onClick={() => {setOrderChecked(true);setAnswers(p=>({...p,order:ordered===lesson.phrase}));}} className="min-h-12 rounded-xl bg-cyan-200 text-slate-950 px-5 font-bold">{t('sp.step4.check')}</button><button onClick={() => {setSelected([]);setOrderChecked(false);setAnswers(p=>({...p,order:false}));}} className="min-h-12 px-4 rounded-xl bg-white/10 flex gap-2 items-center"><RotateCcw size={16}/>{t('sp.step4.reset')}</button></div>
      {orderChecked && <p role="status" className="text-sm text-cyan-100">{answers.order ? t('sp.step4.correct') : t('sp.step4.retry')}</p>}
    </section>
    <section className="rounded-3xl border border-pink-300/20 bg-[#12152b] p-4 sm:p-6 space-y-4">
      <h3 className="font-bold text-xl">5. {t('sp.step5')}</h3><SpeakingRecorder prompt={lesson.prompt}/>
      <p className="text-sm text-slate-300 leading-7">{t('sp.step5.note')}</p>
      {[t('sp.check1'),t('sp.check2'),t('sp.check3')].map((label,i)=><label key={label} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 text-sm leading-7"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(p=>p.map((v,j)=>i===j?e.target.checked:v))} className="mt-2 w-5 h-5 accent-pink-300 shrink-0"/>{label}</label>)}
      <button disabled={!ready || completed} onClick={onComplete} className="min-h-14 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-200 px-4 font-bold text-slate-950 disabled:bg-white/10 disabled:text-slate-400"><CheckCircle2 size={20}/>{completed ? t('sp.complete.done') : t('sp.complete.save')}</button>
      {!ready && !completed && <p className="text-xs text-slate-400 leading-6">{t('sp.complete.hint')}</p>}
    </section>
  </div>;
}
