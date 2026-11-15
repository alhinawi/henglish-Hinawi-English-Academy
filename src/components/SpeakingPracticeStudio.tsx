import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Volume2, RotateCcw, CheckCircle2 } from 'lucide-react';
import type { SpeakingLesson } from '../data/speakingAcademyData';
import { speakEnglish, stopSpeech } from '../utils/audio';

export function SpeakingRecorder({ prompt, description }: { prompt: string; description?: string }) {
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
      setError('التسجيل مش متاح في المتصفح ده. تقدر تتدرب بصوت عالي وتستخدم قائمة المراجعة.'); return;
    }
    setStarting(true);
    try {
      stopSpeech();
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) { media.getTracks().forEach(t => t.stop()); return; }
      stream.current = media;
      const r = new MediaRecorder(media); recorder.current = r;
      const chunks: Blob[] = [];
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
    } catch { if (mounted.current) setError('مقدرناش نفتح الميكروفون. راجع الإذن، أو كمل التدريب بصوت عالي من غير تسجيل.'); } finally { if (mounted.current) setStarting(false); }
  }
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-4">
    <p dir="ltr" className="text-left text-lg font-semibold leading-8 text-white">{prompt}</p>
    {description && <p className="text-sm text-slate-300">{description}</p>}
    <p className="text-xs leading-6 text-slate-400">تسجيل محلي لحد 90 ثانية للمراجعة الذاتية. مش بيتبعت لأي خادم، ومش تقييم آلي للنطق. التسجيل بيتمسح لما تقفل التدريب.</p>
    <button type="button" disabled={starting} onClick={() => recording ? recorder.current?.stop() : void start()} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-pink-300 px-5 font-bold text-slate-950">{recording ? <Square size={18}/> : <Mic size={18}/>} {starting ? 'فتح الميكروفون…' : recording ? 'إيقاف التسجيل' : 'سجّل إجابتك'}</button>
    {recording && <p role="status" className="text-pink-200">الميكروفون شغال. اضغط إيقاف لما تخلص.</p>}
    {url && <audio controls src={url} className="w-full" aria-label="اسمع تسجيلك"/>}
    {error && <p role="alert" className="text-sm text-amber-200">{error}</p>}
  </div>;
}
const clean = (s: string) => s.trim().toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ');

export function SpeakingPracticeStudio({ lesson, completed, onComplete }: {lesson: SpeakingLesson; completed: boolean; onComplete: () => void}) {
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
      <div className="flex items-center justify-between gap-3"><h3 className="font-bold text-xl">1. اسمع وبدّل الأدوار</h3><button onClick={() => setShowAr(v => !v)} className="min-h-11 text-xs text-cyan-200">{showAr ? 'إخفاء العربي' : 'إظهار العربي'}</button></div>
      <p className="text-sm leading-7 text-slate-400">حوار تعليمي أصلي. زر الصوت بيستخدم صوت القراءة المتاح، مش تسجيل متحدث أصلي.</p>
      {lesson.dialogue.map((line, i) => <div key={i} className={`rounded-2xl p-4 ${line.role === 'B' ? 'bg-pink-300/10 border border-pink-300/20' : 'bg-white/5'}`}>
        <div className="flex items-center justify-between gap-3"><span className="text-xs text-pink-200">{line.role === 'A' ? 'الطرف الأول' : 'دورك'}</span><button onClick={() => speakEnglish(line.en)} aria-label={`استمع للجملة ${i+1}`} className="p-3 rounded-xl bg-white/5"><Volume2 size={18}/></button></div>
        <p dir="ltr" className="text-left text-base leading-8 font-medium">{line.en}</p>{showAr && line.ar && <p className="text-sm text-slate-300 leading-7 mt-2">{line.ar}</p>}
      </div>)}
    </section>
    <section className="rounded-3xl border border-white/10 bg-[#12152b] p-4 sm:p-6 space-y-4">
      <h3 className="font-bold text-xl">2. اختار الرد المناسب</h3><p dir="ltr" className="text-left leading-8">{lesson.dialogue[0].en}</p>
      {[1, 0, 2].map(i => <button key={i} onClick={() => {setChoice(i); setAnswers(p => ({...p, choice: i === lesson.answer}));}} className={`w-full text-left rounded-xl border p-4 min-h-14 ${choice === i ? i === lesson.answer ? 'border-emerald-300 bg-emerald-300/10' : 'border-rose-300 bg-rose-300/10' : 'border-white/10 bg-white/5'}`} dir="ltr">{lesson.options[i]}</button>)}
      {choice !== null && <p role="status" className="text-sm leading-7 text-cyan-100">{choice === lesson.answer ? `صح. ${lesson.dialogue[1].ar}` : `حاول تاني. ${lesson.tip}`}</p>}
    </section>
    <section className="rounded-3xl border border-white/10 bg-[#12152b] p-4 sm:p-6 space-y-4">
      <h3 className="font-bold text-xl">3. كمّل العبارة</h3><p dir="ltr" className="text-left leading-8">{lesson.gapPrompt}</p>
      <input aria-label="الكلمة الناقصة" dir="ltr" value={gap} onChange={e => {setGap(e.target.value);setGapChecked(false);setAnswers(p=>({...p,gap:false}));}} className="w-full rounded-xl border border-white/20 bg-black/20 p-4" autoComplete="off" placeholder="Type the missing word"/>
      <button onClick={() => {setGapChecked(true);setAnswers(p=>({...p,gap:clean(gap)===clean(lesson.gap)}));}} className="min-h-12 rounded-xl bg-cyan-200 text-slate-950 px-5 font-bold">راجع الإجابة</button>
      {gapChecked && <p role="status" className="text-sm text-cyan-100">{answers.gap ? 'صح، العبارة اكتملت.' : `لسه محتاجة تعديل. تلميح: الكلمة بتبدأ بحرف ${lesson.gap[0]}، وعدد حروفها ${lesson.gap.length}. راجع الحوار وجرب تاني.`}</p>}
    </section>
    <section className="rounded-3xl border border-white/10 bg-[#12152b] p-4 sm:p-6 space-y-4">
      <h3 className="font-bold text-xl">4. رتّب الرد</h3><p className="text-sm text-slate-400">اضغط الكلمات بالترتيب. كل كلمة لها مكان مستقل حتى لو اتكررت.</p>
      <div dir="ltr" className="flex flex-wrap gap-2">{tiles.map(t => <button key={t.index} disabled={selected.includes(t.index)} onClick={() => {setSelected(p=>[...p,t.index]);setOrderChecked(false);setAnswers(p=>({...p,order:false}));}} className="min-h-11 rounded-xl px-3 bg-white/10 disabled:opacity-25">{t.word}</button>)}</div>
      <p dir="ltr" className="min-h-16 rounded-xl bg-black/20 p-4 text-left leading-8">{ordered || '…'}</p>
      <div className="flex gap-2 flex-wrap"><button onClick={() => {setOrderChecked(true);setAnswers(p=>({...p,order:ordered===lesson.phrase}));}} className="min-h-12 rounded-xl bg-cyan-200 text-slate-950 px-5 font-bold">راجع الترتيب</button><button onClick={() => {setSelected([]);setOrderChecked(false);setAnswers(p=>({...p,order:false}));}} className="min-h-12 px-4 rounded-xl bg-white/10 flex gap-2 items-center"><RotateCcw size={16}/>من الأول</button></div>
      {orderChecked && <p role="status" className="text-sm text-cyan-100">{answers.order ? 'ممتاز. ترتيب العبارة صحيح.' : 'الترتيب لسه مختلف. اسمع جملة الدور B وجرّب تاني.'}</p>}
    </section>
    <section className="rounded-3xl border border-pink-300/20 bg-[#12152b] p-4 sm:p-6 space-y-4">
      <h3 className="font-bold text-xl">5. دلوقتي احكي عن نفسك</h3><SpeakingRecorder prompt={lesson.prompt}/>
      <p className="text-sm text-slate-300 leading-7">جاوب بصوتك أو اتدرب بصوت عالي. اسمع نفسك وعلّم اللي نفذته. دي مراجعة ذاتية، مش درجة نطق.</p>
      {['جاوبت السؤال برد كامل ومناسب للموقف.','أضفت معلومة شخصية أو سبب بدل حفظ النموذج فقط.','سمعت نفسي أو كررت الرد وراجعت وضوحه.'].map((label,i)=><label key={label} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 text-sm leading-7"><input type="checkbox" checked={checks[i]} onChange={e=>setChecks(p=>p.map((v,j)=>i===j?e.target.checked:v))} className="mt-2 w-5 h-5 accent-pink-300 shrink-0"/>{label}</label>)}
      <button disabled={!ready || completed} onClick={onComplete} className="min-h-14 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-200 px-4 font-bold text-slate-950 disabled:bg-white/10 disabled:text-slate-400"><CheckCircle2 size={20}/>{completed ? 'الدرس مكتمل ومحفوظ' : 'احفظ إكمال الدرس + 50 XP'}</button>
      {!ready && !completed && <p className="text-xs text-slate-400 leading-6">حل الأنشطة 3 صح، وكمل مراجعتك الذاتية عشان تحفظ الدرس. تكرار الدرس مش بيضيف XP تاني.</p>}
    </section>
  </div>;
}
