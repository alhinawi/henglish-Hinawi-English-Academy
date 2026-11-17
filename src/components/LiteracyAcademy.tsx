import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Check, ChevronLeft, Clock, PenLine, Search, Trophy, Volume2 } from 'lucide-react';
import { LITERACY_LEVELS, LITERACY_READING, LITERACY_WRITING, type LiteracyReading, type LiteracyWriting } from '../data/literacyAcademyData';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { useLanguage } from '../i18n/LanguageContext';
import { literacyStorageKey, loadLiteracy, type LiteracySaved as Saved } from '../services/literacyStorage';
import { useAuth } from '../context/AuthContext';
import { speakEnglish } from '../utils/audio';

type Props = { kind: 'reading' | 'writing'; onCompleteActivity?: (id: string, score: number, total: number) => void };
const panel = 'rounded-3xl border border-white/10 bg-[#121629] p-5 sm:p-7';
const button = 'rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-300 disabled:opacity-50';
const normalise = (s: string) => s.trim().toLowerCase().replace(/[.!?,;:]/g, '').replace(/\s+/g, ' ');

export function LiteracyAcademy(props: Props) {
  const { user } = useAuth();
  const storageKey = literacyStorageKey(user?.id);
  return <LearnerLiteracyAcademy key={storageKey} {...props} storageKey={storageKey} />;
}
function LearnerLiteracyAcademy({ kind, onCompleteActivity, storageKey }: Props & { storageKey: string }) {
  const { t, dir, lang } = useLanguage();
  const reading = kind === 'reading';
  const [level, setLevel] = useState('A1');
  const appText = useAppTextMap('literacyAcademyData');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string | null>(null);
  const [saved, setSaved] = useState<Saved>(() => loadLiteracy(storageKey));
  const [storageError, setStorageError] = useState(false);
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(saved)); setStorageError(false); } catch { setStorageError(true); } }, [saved, storageKey]);
  const lessons: (LiteracyReading | LiteracyWriting)[] = reading ? LITERACY_READING : LITERACY_WRITING;
  const visible = lessons.filter(l => l.level === level && `${l.title} ${l.titleAr} ${txText(appText, l.titleAr)}`.toLowerCase().includes(query.toLowerCase()));
  const current = lessons.find(l => l.id === active);
  const completed = lessons.filter(l => saved.done.includes(l.id)).length;
  const complete = (id: string) => {
    if (saved.done.includes(id)) return;
    setSaved(p => ({ ...p, done: [...p.done, id] }));
    onCompleteActivity?.(id, 3, 3);
  };
  return <div dir={dir} className="space-y-6 pb-8 min-w-0 text-start">
    <section className="relative isolate overflow-hidden rounded-[28px] border border-white/10 bg-[#11182a]">
      <img src={lessons[0].image} alt={reading ? t('lit.readingAlt') : t('lit.writingAlt')} className="absolute inset-0 h-full w-full object-cover opacity-25" />
      <div className="absolute inset-0 bg-linear-to-l from-[#101626] via-[#101626]/90 to-[#101626]/40" />
      <div className="relative p-6 sm:p-10 max-w-3xl space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-200">{reading ? <BookOpen size={15} /> : <PenLine size={15} />} HENGLISH · {t(reading ? 'lit.readingBadge' : 'lit.writingBadge')}</span>
        <h1 className="text-3xl sm:text-5xl font-black leading-snug text-white">{reading ? t('lit.readingTitle') : t('lit.writingTitle')}</h1>
        <p className="text-sm leading-7 text-slate-300">{reading ? t('lit.readingIntro') : t('lit.writingIntro')}</p>
        <div className="flex flex-wrap gap-2 text-xs text-slate-200">{[t('lit.levels'), t(reading ? 'lit.readingCount' : 'lit.writingCount').replace('{count}', String(lessons.length)), t('lit.activityCount').replace('{count}', String(lessons.length * 3)), t('lit.images')].map(s => <span key={s} className="rounded-lg bg-white/10 px-3 py-2">{s}</span>)}</div>
      </div>
    </section>
    <section className="grid grid-cols-[auto_1fr] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
      <Trophy className="shrink-0 text-amber-300" size={20} /><span className="shrink-0">{t('lit.completed').replace('{done}', String(completed)).replace('{total}', String(lessons.length))}</span><div className="col-span-2 h-1.5 w-full rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-cyan-300" style={{ width: `${completed / lessons.length * 100}%` }} /></div><span className="col-span-2 text-xs">{t('lit.xp')}</span>
    </section>
    <p className="text-xs leading-6 text-slate-400">{t('lit.progressNote')} {storageError && <strong className="text-amber-200">{t('lit.storageError')}</strong>}</p>
    {current ? <>
      <button className={button} onClick={() => setActive(null)}><span className="flex items-center gap-2"><ArrowLeft size={16} className={dir === 'rtl' ? 'rotate-180' : ''} aria-hidden="true" />{t('lit.back').replace('{level}', current.level)}</span></button>
      <article className={panel}>
        <img src={current.image} alt={t('lit.lessonImage').replace('{title}', lang === 'en' ? current.title : txText(appText, current.titleAr))} className="h-48 w-full rounded-2xl object-cover sm:h-64" />
        <div className="mt-4 flex items-center gap-2 text-xs text-cyan-200"><span>{current.level}</span><span>·</span><span>{t('lit.lessonNumber').replace('{count}', String(lessons.indexOf(current) + 1))}</span></div>
        <h2 className="mt-2 text-2xl font-black text-white">{lang === 'en' ? current.title : txText(appText, current.titleAr)}</h2><p dir="ltr" lang="en" className="mt-1 text-left text-sm text-slate-400">{current.title}</p>
      </article>
      {reading ? <ReadingWorkshop key={current.id} lesson={current as LiteracyReading} done={saved.done.includes(current.id)} onComplete={() => complete(current.id)} /> : <WritingWorkshop key={current.id} lesson={current as LiteracyWriting} done={saved.done.includes(current.id)} draft={saved.drafts[current.id] || ''} onDraft={text => setSaved(p => ({ ...p, drafts: { ...p.drafts, [current.id]: text } }))} onComplete={() => complete(current.id)} />}
      <button className={`${button} w-full`} onClick={() => { const next = lessons[(lessons.indexOf(current) + 1) % lessons.length]; setLevel(next.level); setActive(next.id); window.scrollTo({ top: 0, behavior: 'instant' }); }}>{t('lit.next')} <ChevronLeft size={15} className={`inline ${dir === 'ltr' ? 'rotate-180' : ''}`} aria-hidden="true" /></button>
    </> : <>
      <nav aria-label={t('lit.learningLevel')} className="grid grid-cols-6 gap-1.5" dir="ltr">{LITERACY_LEVELS.map(l => <button key={l} onClick={() => { setLevel(l); setQuery(''); }} aria-pressed={level === l} className={`rounded-xl py-3 text-sm font-bold ${level === l ? 'bg-cyan-200 text-slate-950' : 'border border-white/10 bg-white/5 text-slate-300'}`}>{l}</button>)}</nav>
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black text-white">{level} · {reading ? t('lit.readingLibrary') : t('lit.writingLibrary')}</h2><p className="text-xs text-slate-400 mt-1">{t('lit.choose')}</p></div><label className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2"><Search size={16} className="text-slate-400" /><input aria-label={t('lit.search')} placeholder={t('lit.searchPlaceholder')} value={query} onChange={e => setQuery(e.target.value)} className="w-40 bg-transparent text-sm text-white outline-none" /></label></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visible.map((l, i) => <button key={l.id} onClick={() => { setActive(l.id); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="group overflow-hidden rounded-3xl border border-white/10 bg-[#121629] text-start hover:border-cyan-300/50 focus-visible:outline-2 focus-visible:outline-cyan-300">
        <div className="relative"><img loading="lazy" src={l.image} alt={t('lit.cardImage').replace('{title}', lang === 'en' ? l.title : txText(appText, l.titleAr))} className="h-40 w-full object-cover" /><span className="absolute left-3 top-3 rounded-lg bg-slate-950/85 px-2 py-1 text-xs text-white">{l.level} · {String(i + 1).padStart(2, '0')}</span>{saved.done.includes(l.id) && <span className="absolute right-3 top-3 rounded-full bg-emerald-300 p-1 text-slate-950"><Check size={16} /></span>}</div>
        <div className="p-5 space-y-2"><h3 className="text-lg font-bold text-white">{lang === 'en' ? l.title : txText(appText, l.titleAr)}</h3><p className="text-xs text-slate-400" dir="ltr" lang="en">{l.title}</p><div className="flex justify-between pt-3 text-xs text-cyan-200"><span>{t('lit.activities')}</span><span>{saved.done.includes(l.id) ? t('lit.review') : t('lit.start')} <ArrowLeft size={14} className={`inline ${dir === 'ltr' ? 'rotate-180' : ''}`} aria-hidden="true" /></span></div></div>
      </button>)}</div>{!visible.length && <p className={panel}>{t('lit.noResults')}</p>}
    </>}
    <details className="rounded-2xl border border-white/10 p-4 text-xs leading-6 text-slate-400"><summary className="cursor-pointer text-slate-200">{t('lit.about')}</summary><p>{t('lit.contentNote')}</p></details>
  </div>;
}
function Feedback({ correct, children }: { correct: boolean; children: React.ReactNode }) { return <div role="status" className={`rounded-xl p-4 text-sm leading-7 ${correct ? 'bg-emerald-300/10 text-emerald-200' : 'bg-amber-300/10 text-amber-200'}`}>{children}</div>; }

function ReadingWorkshop({ lesson: l, done, onComplete }: { lesson: LiteracyReading; done: boolean; onComplete: () => void }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const appText = useAppTextMap('literacyAcademyData');
  const [gap, setGap] = useState('');
  const [gapChecked, setGapChecked] = useState(false);
  const [meaning, setMeaning] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => { if (!running) return; const id = window.setInterval(() => setSeconds(s => s + 1), 1000); return () => clearInterval(id); }, [running]);
  const gapCorrect = normalise(gap) === normalise(l.word);
  const allCorrect = chosen === l.answer && gapChecked && gapCorrect && meaning === 1;
  const sentence = l.content.split(/(?<=[.!?])\s+/).find(s => s.toLowerCase().includes(l.word.toLowerCase())) || l.content;
  const gapSentence = sentence.replace(new RegExp(l.word, 'i'), '______');
  const other = LITERACY_READING.find(x => x.meaning !== l.meaning && x.id !== l.id)!;
  return <>
    <section className={panel}><div className="flex flex-wrap gap-2 items-center justify-between"><span className="text-xs text-slate-400">نص تدريبي أصلي · {l.content.split(/\s+/).length} كلمة</span><button className={button} onClick={() => speakEnglish(l.content)}><Volume2 size={16} className="inline" /> نطق آلي</button></div><p dir="ltr" lang="en" className="my-6 text-left text-lg leading-9 text-slate-100">{l.content}</p><div className="flex flex-wrap items-center gap-3 text-xs text-slate-400"><Clock size={15} /><span dir="ltr">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</span><button className="underline text-cyan-200" onClick={() => setRunning(!running)}>{running ? 'إيقاف المؤقت' : 'ابدأ مؤقت القراءة'}</button><button className="underline" onClick={() => { setSeconds(0); setRunning(false); }}>تصفير</button></div></section>
    <section className={`${panel} space-y-4`}><h3 className="font-bold text-white">1 · فهم الفكرة والتفاصيل</h3><p dir="ltr" lang="en" className="text-slate-200 text-left">{l.question}</p>{l.options.map((o, i) => <button key={o} onClick={() => setChosen(i)} aria-pressed={chosen === i} className={`${button} w-full text-left ${chosen === i ? 'border-cyan-300 bg-cyan-300/10' : ''}`} dir="ltr" lang="en">{o}</button>)}{chosen !== null && <Feedback correct={chosen === l.answer}>{chosen === l.answer ? 'إجابة صحيحة. الدليل موجود في النص أعلاه.' : 'راجع النص ثم حاول مرة أخرى. لا تحتاج إلى تخمين معلومات من خارجه.'}</Feedback>}</section>
    <section className={`${panel} space-y-4`}><h3 className="font-bold text-white">2 · استرجع الكلمة من السياق</h3><p className="text-xs text-slate-400">أكمل بنفس الكلمة المستخدمة في النص. المعنى: {txText(appText, l.meaning)}.</p><p dir="ltr" lang="en" className="text-left leading-8 text-slate-200">{gapSentence}</p><input aria-label="الكلمة الناقصة" value={gap} onChange={e => { setGap(e.target.value); setGapChecked(false); }} dir="ltr" lang="en" className="w-full rounded-xl border border-white/20 bg-black/20 p-3 text-white" /><button className={button} onClick={() => setGapChecked(true)}>تحقق من الكلمة</button>{gapChecked && <Feedback correct={gapCorrect}>{gapCorrect ? 'صحيح. اربط الكلمة بالجملة التي قرأتها.' : `ابحث عن الكلمة في النص. تلميح: تبدأ بـ ${l.word[0]}، وتتكون من ${l.word.length} حروف أو رموز.`}</Feedback>}</section>
    <section className={`${panel} space-y-4`}><h3 className="font-bold text-white">3 · المعنى في هذا السياق</h3><p className="text-slate-200">ما معنى <b dir="ltr" lang="en">{l.word}</b> هنا؟</p>{[other.meaning, l.meaning, 'ليس لها معنى في هذا النص'].map((m, i) => <button className={`${button} w-full text-right ${meaning === i ? 'border-cyan-300' : ''}`} key={m} onClick={() => setMeaning(i)}>{txText(appText, m)}</button>)}{meaning !== null && <Feedback correct={meaning === 1}>{meaning === 1 ? `صحيح: ${l.word} تعني ${txText(appText, l.meaning)} في هذا الاستخدام.` : 'حاول ثانية. المعنى يتحدد من الجملة، لا من شكل الكلمة وحده.'}</Feedback>}</section>
    <button disabled={!allCorrect || done} className={`${button} w-full bg-cyan-300/15 text-cyan-100`} onClick={onComplete}>{done ? <><Check size={18} className="inline align-middle" aria-hidden="true" /> الدرس مكتمل ومحفوظ</> : allCorrect ? 'إتمام الدرس وإضافة 50 XP' : 'أكمل الأنشطة الثلاثة أولا'}</button>
  </>;
}

function WritingWorkshop({ lesson: l, draft, onDraft, done, onComplete }: { lesson: LiteracyWriting; draft: string; onDraft: (s: string) => void; done: boolean; onComplete: () => void }) {
  const first = l.model.match(/.*?[.!?](?:\s|$)/)?.[0].trim() || l.model;
  const tokens = first.split(/\s+/);
  const [order, setOrder] = useState<number[]>([]);
  const appText = useAppTextMap('literacyAcademyData');
  const [orderCheck, setOrderCheck] = useState(false);
  const [edit, setEdit] = useState('');
  const [editCheck, setEditCheck] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [review, setReview] = useState<boolean[]>([false, false, false]);
  const [copyMessage, setCopyMessage] = useState('');
  const wordCount = draft.trim().split(/\s+/).filter(Boolean).length;
  const target = l.level === 'A1' ? 15 : l.level === 'A2' ? 25 : 40;
  const ordered = order.map(i => tokens[i]).join(' ');
  const orderCorrect = ordered === first;
  // Controlled editing task: exact target shown for reliable deterministic feedback.
  const editTarget = l.model.match(/[^.!?]+[.!?]/g)?.at(-1)?.trim() || first;
  const editPrompt = editTarget[0].toLowerCase() + editTarget.slice(1).replace(/[.!?]$/, '');
  const editCorrect = edit.trim() === editTarget;
  const allCorrect = orderCheck && orderCorrect && editCheck && editCorrect && wordCount >= target && review.every(Boolean);
  return <>
    <section className={`${panel} space-y-4`}><h3 className="text-white font-bold">المهمة · {txText(appText, l.titleAr)}</h3><p dir="ltr" lang="en" className="text-left text-slate-200 leading-8">{l.prompt}</p><button className={button} onClick={() => setShowModel(!showModel)}>{showModel ? 'إخفاء النموذج' : 'اقرأ نموذجا واكتشف بنيته'}</button>{showModel && <div className="rounded-2xl bg-white/5 p-4 space-y-3"><p dir="ltr" lang="en" className="text-left leading-8 text-slate-200">{l.model}</p><p className="text-xs leading-6 text-slate-400">نموذج تدريبي أصلي، وليس رسالة مرسلة أو بيانات عن شخص حقيقي. لاحظ الغرض وترتيب الأفكار ونبرة الخطاب.</p><button className={button} onClick={() => speakEnglish(l.model)}><Volume2 size={15} className="inline" /> نطق آلي للنموذج</button></div>}</section>
    <section className={`${panel} space-y-4`}><h3 className="font-bold text-white">1 · ابن الجملة الافتتاحية</h3><p className="text-xs text-slate-400">اضغط الكلمات بالترتيب. يمكنك فتح النموذج للمساعدة.</p><div dir="ltr" className="flex flex-wrap gap-2">{tokens.map((_, i) => tokens.length - 1 - i).map(i => <button key={i} disabled={order.includes(i)} className={button} onClick={() => { setOrder(p => [...p, i]); setOrderCheck(false); }}>{tokens[i]}</button>)}</div><p dir="ltr" lang="en" className="min-h-14 rounded-xl bg-black/20 p-3 text-left text-slate-200">{ordered || '...'}</p><div className="flex flex-wrap gap-2"><button className={button} onClick={() => setOrderCheck(true)}>تحقق من الترتيب</button><button className={button} onClick={() => { setOrder([]); setOrderCheck(false); }}>ابدأ من جديد</button><button className={button} onClick={() => { setOrder(p => p.slice(0, -1)); setOrderCheck(false); }}>تراجع عن كلمة</button></div>{orderCheck && <Feedback correct={orderCorrect}>{orderCorrect ? 'ترتيب صحيح. لاحظ مكان الحرف الكبير وعلامة النهاية.' : 'لم يكتمل الترتيب الصحيح. قارن بالجملة الأولى في النموذج ثم أعد المحاولة.'}</Feedback>}</section>
    <section className={`${panel} space-y-4`}><h3 className="font-bold text-white">2 · مراجعة الحروف والترقيم</h3><p className="text-xs leading-6 text-slate-400">أعد كتابة الجملة الأخيرة من النموذج بعد استعادة الحرف الكبير وعلامة النهاية. حافظ على باقي الكلمات كما هي. هذا تدريب تحرير محدد، لا تقييم شامل.</p><p dir="ltr" lang="en" className="text-left text-amber-100">{editPrompt}</p><input value={edit} onChange={e => { setEdit(e.target.value); setEditCheck(false); }} aria-label="الجملة بعد التحرير" dir="ltr" lang="en" className="w-full rounded-xl border border-white/20 bg-black/20 p-3 text-white" /><button className={button} onClick={() => setEditCheck(true)}>تحقق من التحرير</button>{editCheck && <Feedback correct={editCorrect}>{editCorrect ? 'صحيح. استعدت الحرف الكبير وعلامة النهاية دون تغيير المعنى.' : `راجع النموذج. الصياغة المستهدفة: ${editTarget}`}</Feedback>}</section>
    <section className={`${panel} space-y-4`}><h3 className="font-bold text-white">3 · مسودتك ومراجعتك الذاتية</h3><label className="block text-xs leading-6 text-slate-400" htmlFor="literacy-draft">اكتب إجابتك للمهمة. استهدف {target} كلمة على الأقل. لا تُرسل المسودة لأي جهة من هذا المحرر.</label><textarea id="literacy-draft" rows={9} value={draft} onChange={e => { onDraft(e.target.value); setReview([false, false, false]); }} dir="ltr" lang="en" placeholder="Write your draft here..." className="w-full rounded-2xl border border-white/20 bg-black/20 p-4 text-left text-slate-100 leading-8 focus:border-cyan-300 focus:outline-none" /><div className="flex flex-wrap justify-between gap-2 text-xs text-slate-400"><span>{wordCount} / {target} كلمة</span><button className="text-cyan-200 underline" onClick={async () => { try { await navigator.clipboard.writeText(draft); setCopyMessage('تم نسخ المسودة.'); } catch { setCopyMessage('تعذر النسخ. حدد النص وانسخه يدويا.'); } }}>انسخ مسودتك</button></div><p role="status" className="text-xs text-cyan-200">{copyMessage}</p>{['أجبت عن المطلوب وربطت الأفكار بوضوح.', 'راجعت الحروف الكبيرة وعلامات الترقيم.', 'راجعت النموذج، وتأكدت من عدم اختراع حقائق أو إنجازات.'].map((r, i) => <label className="flex items-start gap-3 rounded-xl bg-white/5 p-3 text-sm leading-7 text-slate-300" key={r}><input type="checkbox" className="mt-2 accent-cyan-200" checked={review[i]} onChange={e => setReview(p => p.map((v, j) => i === j ? e.target.checked : v))} />{r}</label>)}<p className="text-xs text-amber-100/80 leading-6">هذه قائمة مراجعة ذاتية وليست تصحيحا آليا للقواعد أو المعنى. عدد الكلمات وحده لا يثبت جودة النص.</p></section>
    <button disabled={!allCorrect || done} className={`${button} w-full bg-cyan-300/15 text-cyan-100`} onClick={onComplete}>{done ? <><Check size={18} className="inline align-middle" aria-hidden="true" /> الورشة مكتملة ومحفوظة</> : allCorrect ? 'إتمام التدريب والمراجعة الذاتية · 50 XP' : 'أكمل الترتيب والتحرير والمسودة والمراجعة'}</button>
  </>;
}
