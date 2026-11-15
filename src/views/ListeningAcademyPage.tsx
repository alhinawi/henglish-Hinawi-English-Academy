import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { PageRoute } from '../types';
import { ALL_LISTENING_LESSONS, normalizeListeningAnswer, type ListeningLesson } from '../data/listeningAcademyData';
import { speakEnglish, stopSpeech, subscribeSpeechState, type SpeechSpeed } from '../utils/audio';
import { ArrowRight, CheckCircle2, Headphones, Play, Search, Square, Volume2, X } from 'lucide-react';

type Saved = { solved: Record<string, string[]>; awarded: string[] };
const KEY = 'henglish-listening-studio-v1';
function load(key: string): Saved {
  try { const p = JSON.parse(localStorage.getItem(key) || '{}'); return { solved: p.solved && typeof p.solved === 'object' ? p.solved : {}, awarded: Array.isArray(p.awarded) ? p.awarded : [] }; } catch { return { solved: {}, awarded: [] }; }
}
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
  const [saved, setSaved] = useState<Saved>(() => load(storageKey));
  const savedRef = useRef(saved);
  const [storageWarning, setStorageWarning] = useState(false);
  const [level, setLevel] = useState('All');
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
  const panel = useRef<HTMLElement>(null);
  useEffect(() => { const next = load(storageKey); savedRef.current = next; setSaved(next); }, [storageKey]);
  useEffect(() => subscribeSpeechState((active) => setPlaying(active)), []);
  useEffect(() => () => stopSpeech(), []);
  const visible = useMemo(() => ALL_LISTENING_LESSONS.filter(t => (level === 'All' || (level === 'Legacy' ? !t.original : t.level === level && t.original)) && `${t.title} ${t.titleAr} ${t.focusAr}`.toLowerCase().includes(query.toLowerCase()) && (!reviewOnly || !(saved.solved[t.id]?.length >= taskIds(t).length))), [level, query, reviewOnly, saved]);
  const completed = ALL_LISTENING_LESSONS.filter(t => saved.solved[t.id]?.length >= taskIds(t).length).length;
  const totalActivities = ALL_LISTENING_LESSONS.reduce((n, t) => n + taskIds(t).length, 0);
  const solved = selected ? saved.solved[selected.id] || [] : [];
  const gap = selected ? gapFor(selected) : null;
  const tokens = selected?.dictationSentence.split(' ') || [];
  const shuffled = useMemo(() => tokens.map((word, index) => ({ word, index })).reverse(), [selected?.id]);
  function persist(next: Saved) {
    savedRef.current = next; setSaved(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { setStorageWarning(true); }
  }
  function solve(task: string) {
    if (!selected) return;
    const prev = savedRef.current;
    const done = Array.from(new Set([...(prev.solved[selected.id] || []), task]));
    const next = { ...prev, solved: { ...prev.solved, [selected.id]: done } };
    if (taskIds(selected).every(id => done.includes(id)) && !prev.awarded.includes(selected.id) && onCompleteActivity) {
      next.awarded = [...prev.awarded, selected.id];
      persist(next);
      onCompleteActivity(`listening:${selected.id}`, 1, 1);
      setNotice('اكتمل الدرس! أضفنا 50 XP إلى تقدمك. المكافأة مرة واحدة لكل درس في هذا المتصفح.');
    } else persist(next);
  }
  function open(lesson: ListeningLesson) {
    stopSpeech(); setPlaying(false); setSelected(lesson); setTranscript(false); setAnswers({}); setDictation(''); setDictationFeedback(null); setGapAnswer(null); setOrder([]); setOrderFeedback(null); setNotice(''); setAudioError('');
    requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: 'instant', block: 'start' }));
  }
  function play(text: string) {
    stopSpeech(); setAudioError(''); setPlaying(true);
    speakEnglish(text, { speed, accent: selected?.accent === 'British' ? 'UK' : 'US', onEnd: () => setPlaying(false), onError: () => { setPlaying(false); setAudioError('تعذر تشغيل الصوت. جرّب مرة أخرى أو راجع إعدادات الصوت في جهازك.'); } });
  }
  const button = 'rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300 disabled:opacity-40';
  const box = 'rounded-3xl border border-white/10 bg-[#12162b] p-5 sm:p-7';
  return <div dir="rtl" className="mx-auto max-w-6xl space-y-6 pb-16 text-white">
    <header className="relative isolate overflow-hidden rounded-[28px] border border-white/15 bg-[#10172c] px-6 py-9 sm:p-12">
      <img src="/images/listening/classroom.webp" alt="فصل دراسي" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 -z-10 bg-linear-to-l from-[#10172c] via-[#10172c]/85 to-[#10172c]/50" />
      <p dir="ltr" className="mb-4 text-right text-xs font-bold tracking-[0.2em] text-cyan-200">HENGLISH / LISTENING STUDIO</p>
      <h1 className="text-3xl font-black leading-tight sm:text-5xl">اسمع المعنى.<br /><span className="text-cyan-200">مش الكلمات وبس.</span></h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">من أول طلب قهوة لفهم التحفظ والسخرية في نقاش متقدم. استماع، فهم، كلمات ناقصة، إملاء وترتيب جمل، مع تصحيح فوري.</p>
      <div className="mt-7 grid grid-cols-3 gap-2 text-center">
        {[[String(ALL_LISTENING_LESSONS.length),'درسا مصورا'],['6','مسارات مستوى'],[String(totalActivities),'تدريبا تفاعليا']].map(([n,l]) => <div key={l} className="rounded-2xl border border-white/10 bg-black/20 p-3"><strong dir="ltr" className="block text-2xl text-white">{n}</strong><span className="text-[11px] text-slate-300">{l}</span></div>)}
      </div>
    </header>
    <section className={box} aria-label="تقدم الاستماع">
      <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-bold">رحلتك في الاستماع</p><p className="mt-1 text-xs text-slate-300">{completed} / {ALL_LISTENING_LESSONS.length} درسا مكتملا</p></div><Headphones className="text-cyan-200" /></div>
      <progress aria-label="نسبة الدروس المكتملة" value={completed} max={ALL_LISTENING_LESSONS.length} className="mt-4 h-2 w-full accent-cyan-300" />
      <p className="mt-2 text-xs leading-6 text-slate-400">إتقان كل تدريبات الدرس يكسبك 50 XP مرة واحدة. تفاصيل التدريب محفوظة على هذا المتصفح لكل حساب. المستويات إرشادية وليست اختبار اعتماد. الصوت مولّد من النص، وليس تسجيلا لمتحدثين حقيقيين.</p>
      {storageWarning && <p role="alert" className="mt-2 text-sm text-amber-200">المتصفح منع الحفظ. تقدم هذه الجلسة مؤقت.</p>}
    </section>
    <section ref={panel} className="scroll-mt-24" aria-label="استوديو الدرس">
      {selected && <div className="space-y-5">
        <div className="overflow-hidden rounded-3xl border border-cyan-300/25 bg-[#11182e]">
          <div className="relative"><img src={selected.image} alt={selected.imageAlt} className="h-44 w-full object-cover sm:h-64" /><button onClick={() => { stopSpeech(); setSelected(null); }} aria-label="إغلاق الدرس" className="absolute left-3 top-3 rounded-full bg-black/80 p-3"><X size={18} /></button><span className="absolute bottom-3 right-3 rounded-lg bg-black/80 px-3 py-1 text-xs">{selected.level} · {solved.length}/{taskIds(selected).length} مكتمل</span></div>
          <div className="space-y-4 p-5 sm:p-7">
            <h2 className="text-2xl font-black">{selected.titleAr}</h2><p dir="ltr" className="text-right text-sm text-slate-300">{selected.title}</p>
            <p className="text-xs text-cyan-200">{selected.focusAr}</p>
            <div className="flex flex-wrap gap-2"><button className={`${button} inline-flex grow items-center justify-center gap-2 bg-cyan-300/15`} onClick={() => playing ? (stopSpeech(), setPlaying(false)) : play(selected.transcript)}>{playing ? <Square size={18} /> : <Play size={18} />}{playing ? 'إيقاف الصوت' : 'استمع إلى المقطع'}</button><select aria-label="سرعة الاستماع" value={speed} onChange={e => { stopSpeech(); setPlaying(false); setSpeed(Number(e.target.value) as SpeechSpeed); }} className={`${button} bg-[#12162b]`}><option value={0.75}>0.75x بطيء</option><option value={0.92}>0.92x واضح</option><option value={1}>1x عادي</option><option value={1.25}>1.25x سريع</option></select></div>
            {audioError && <p role="alert" className="text-sm text-amber-200">{audioError}</p>}
            <button onClick={() => setTranscript(!transcript)} aria-expanded={transcript} className={button}>{transcript ? 'إخفاء النص والمعنى' : 'اكشف النص والمعنى بعد الاستماع'}</button>
            {transcript && <div className="space-y-4 rounded-2xl bg-black/25 p-4"><p dir="ltr" lang="en" className="text-left text-base leading-8">{selected.transcript}</p><p className="text-sm leading-7 text-slate-300">{selected.transcriptAr}</p><p className="text-xs leading-6 text-slate-400">سيناريو تعليمي مكتوب، وليس خبرا أو نصيحة طبية أو توثيقا لحدث حقيقي. المعنى العربي شرح مختصر. صورة توضيحية: <a href={selected.imageSource} target="_blank" rel="noreferrer" className="underline">Unsplash / المصدر الأصلي للصورة</a>.</p></div>}
          </div>
        </div>
        <div className="grid items-start gap-5 lg:grid-cols-2">
          {selected.comprehensionQuiz.map((q,i) => <section key={q.id} className={box}><p className="mb-2 text-xs text-cyan-200">فهم المسموع · {i+1}{solved.includes(q.id) ? ' · متقن ✓' : ''}</p><h3 dir="ltr" className="mb-4 text-left text-lg font-bold">{q.question}</h3><div className="space-y-2">{q.options.map((option,n) => <button key={option} disabled={answers[q.id] !== undefined} dir="ltr" onClick={() => { setAnswers(a => ({...a,[q.id]:n})); if(n === q.answer) solve(q.id); }} className={`${button} w-full text-left ${answers[q.id] === n ? n === q.answer ? 'border-emerald-300! bg-emerald-400/15!' : 'border-rose-300! bg-rose-400/15!' : ''}`}>{option}</button>)}</div>{answers[q.id] !== undefined && <div aria-live="polite" className="mt-4 text-sm leading-7"><p className={answers[q.id] === q.answer ? 'text-emerald-200' : 'text-amber-200'}>{answers[q.id] === q.answer ? 'صحيح! ' : 'مش الإجابة المقصودة. '}{q.explanation}</p>{answers[q.id] !== q.answer && <button className={`${button} mt-2`} onClick={() => setAnswers(a => { const next = {...a}; delete next[q.id]; return next; })}>حاول تاني</button>}</div>}</section>)}
          <section className={box}><h3 className="text-lg font-bold">الكلمة الناقصة {solved.includes('gap') && '✓'}</h3><p className="mt-2 text-xs text-slate-300">اسمع جملة الإملاء واختار الكلمة الناقصة.</p><button aria-label="استمع لجملة الكلمة الناقصة" className={`${button} my-4`} onClick={() => play(selected.dictationSentence)}><Volume2 size={18} /></button><p dir="ltr" className="mb-4 text-left leading-8">{gap?.sentence}</p><div className="flex flex-wrap gap-2" dir="ltr">{gap?.options.map(w => <button key={w} className={`${button} ${gapAnswer === w ? w === gap.answer ? 'border-emerald-300!' : 'border-rose-300!' : ''}`} onClick={() => { setGapAnswer(w); if(w === gap.answer) solve('gap'); }}>{w}</button>)}</div>{gapAnswer && <p aria-live="polite" className="mt-4 text-sm text-cyan-200">{gapAnswer === gap?.answer ? 'بالضبط! الكلمة صحيحة.' : 'اسمع مرة تانية وجرب كلمة مختلفة.'}</p>}</section>
          <section className={box}><h3 className="text-lg font-bold">اكتب اللي سمعته {solved.includes('dictation') && '✓'}</h3><p className="mt-2 text-xs leading-6 text-slate-300">بنقارن الجملة كاملة. حالة الحروف وعلامات الترقيم لا تؤثر.</p><button className={`${button} my-4 inline-flex items-center gap-2`} onClick={() => play(selected.dictationSentence)}><Volume2 size={18} />جملة الإملاء</button><textarea aria-label="إجابتك في الإملاء" dir="ltr" lang="en" value={dictation} onChange={e => { setDictation(e.target.value); setDictationFeedback(null); }} rows={3} placeholder="Type the whole sentence..." className="w-full rounded-xl border border-white/20 bg-black/25 p-4 text-left text-base" /><button className={`${button} mt-3 w-full`} disabled={!dictation.trim()} onClick={() => { const correct = normalizeListeningAnswer(dictation) === normalizeListeningAnswer(selected.dictationSentence); setDictationFeedback(correct); if(correct) solve('dictation'); }}>تحقق من الجملة</button>{dictationFeedback !== null && <div aria-live="polite" className="mt-4 text-sm leading-7"><p className={dictationFeedback ? 'text-emerald-200' : 'text-amber-200'}>{dictationFeedback ? 'إملاء كامل وصحيح.' : 'لسه فيه فرق. قارن بالنص، وبعدها اسمع واكتب من جديد.'}</p>{!dictationFeedback && <p dir="ltr" className="mt-2 text-left">{selected.dictationSentence}</p>}</div>}</section>
          <section className={box}><h3 className="text-lg font-bold">ركّب الجملة {solved.includes('order') && '✓'}</h3><p className="my-3 text-xs leading-6 text-slate-300">رتب الكلمات زي ما سمعتها. اضغط على كلمة فوق عشان ترجعها.</p><div dir="ltr" className="mb-4 flex min-h-20 flex-wrap gap-2 rounded-xl border border-dashed border-cyan-300/40 p-3">{order.map((n,i) => <button key={`${n}-${i}`} className={button} onClick={() => { setOrder(o => o.filter((_,k) => k !== i)); setOrderFeedback(null); }}>{tokens[n]}</button>)}</div><div dir="ltr" className="flex flex-wrap gap-2">{shuffled.map(({word,index}) => <button key={index} disabled={order.includes(index)} className={button} onClick={() => {setOrder(o => [...o,index]); setOrderFeedback(null);}}>{word}</button>)}</div><div className="mt-4 flex gap-2"><button className={`${button} grow`} disabled={order.length !== tokens.length} onClick={() => { const ok = normalizeListeningAnswer(order.map(n => tokens[n]).join(' ')) === normalizeListeningAnswer(selected.dictationSentence); setOrderFeedback(ok); if(ok) solve('order'); }}>تحقق من الترتيب</button><button aria-label="إعادة ترتيب الكلمات من البداية" className={button} onClick={() => {setOrder([]); setOrderFeedback(null);}}>إعادة</button></div>{orderFeedback !== null && <p aria-live="polite" className="mt-4 text-sm text-cyan-200">{orderFeedback ? 'ترتيب سليم!' : 'راجع الترتيب واسمع الجملة تاني.'}</p>}</section>
        </div>
        {notice && <p role="status" className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 p-5 text-sm leading-7 text-emerald-100">{notice}</p>}
        <div className="flex flex-wrap gap-2"><button className={`${button} inline-flex items-center gap-2`} onClick={() => { const i = ALL_LISTENING_LESSONS.findIndex(t => t.id === selected.id); open(ALL_LISTENING_LESSONS[(i+1)%ALL_LISTENING_LESSONS.length]); }}>الدرس التالي<ArrowRight size={16} /></button><button className={button} onClick={() => {stopSpeech();setSelected(null);}}>ارجع للمكتبة</button></div>
      </div>}
    </section>
    <section className="space-y-5" aria-label="مكتبة دروس الاستماع">
      <div><h2 className="text-2xl font-black">اختار محطة جديدة</h2><p className="mt-2 text-sm text-slate-300">36 سيناريو جديدا + 6 دروس من المكتبة الأصلية، بدون حذف أي درس.</p></div>
      <label className="flex items-center gap-3 rounded-2xl border border-white/15 bg-[#12162b] px-4"><Search size={19} className="shrink-0 text-slate-400" /><input aria-label="ابحث عن درس" value={query} onChange={e => setQuery(e.target.value)} placeholder="دور على موقف أو مهارة..." className="min-w-0 grow bg-transparent py-4 text-sm outline-none" /></label>
      <div className="flex flex-wrap gap-2">{[['All','الكل'],['A1','A1 · البداية'],['A2','A2 · الحياة اليومية'],['B1','B1 · الحكاية والسياق'],['B2','B2 · الأفكار والحجج'],['C1','C1 · المعنى الضمني'],['C2','C2 · دقة الخطاب'],['Legacy','المكتبة الأصلية']].map(([v,l]) => <button key={v} aria-pressed={level===v} onClick={() => setLevel(v)} className={`${button} px-3! text-xs! ${level===v ? 'border-cyan-300! bg-cyan-300/15! text-cyan-100!' : ''}`}>{l}</button>)}</div>
      <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={reviewOnly} onChange={e => setReviewOnly(e.target.checked)} className="accent-cyan-300" />اعرض الدروس غير المكتملة بس</label>
      <p className="text-xs text-slate-400" role="status">{visible.length} درس ظاهر</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{visible.map((t,i) => { const done = saved.solved[t.id]?.length || 0; const full = done >= taskIds(t).length; return <button key={t.id} onClick={() => open(t)} className="group overflow-hidden rounded-3xl border border-white/10 bg-[#12162b] text-right hover:border-cyan-300/50 focus-visible:outline-2 focus-visible:outline-cyan-300"><div className="relative"><img src={t.image} alt={t.imageAlt} loading={i<3 ? 'eager' : 'lazy'} className="h-44 w-full object-cover" /><span className="absolute bottom-3 right-3 rounded-lg bg-[#090f23]/90 px-3 py-1 text-xs font-bold text-cyan-100">{t.level} · {t.original ? `مسار ${t.unit}` : 'الأصلية'}</span><span className="absolute left-3 top-3 rounded-full bg-black/70 p-2">{full ? <CheckCircle2 size={19} className="text-emerald-300" /> : <Headphones size={19} className="text-white" />}</span></div><div className="space-y-3 p-5"><h3 className="text-lg font-black">{t.titleAr}</h3><p dir="ltr" className="text-right text-xs text-slate-400">{t.title}</p><p className="text-xs leading-6 text-slate-300">{t.focusAr}</p><div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs"><span className="font-bold text-cyan-200">{full ? 'راجع الدرس' : done ? 'كمّل التدريب' : 'ابدأ الاستماع'}</span><span className="text-slate-400">{done}/{taskIds(t).length} تدريب</span></div></div></button>; })}</div>
      {visible.length === 0 && <p className={`${box} text-sm text-slate-300`}>مفيش دروس مطابقة. جرّب مستوى أو كلمة مختلفة.</p>}
    </section>
    <footer className="space-y-3 border-t border-white/10 pt-6 text-xs leading-6 text-slate-400"><p>المحتوى الجديد سيناريوهات أصلية للتدريب. الصور توضيحية من Unsplash، ورابط مصدر كل صورة داخل نص الدرس. الصوت يستخدم محرك النطق المتاح بالموقع؛ توافر الصوت واللكنة يعتمد على المحرك والجهاز.</p><button onClick={() => onNavigate('dashboard')} className={button}>ارجع للرئيسية</button></footer>
  </div>;
};
