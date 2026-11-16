import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { splitLessonCorrection } from '../utils/lessonCorrection';

/** Isolate English runs without changing the source sentence or its punctuation. */
export function MixedLessonText({ text }: { text: string }) {
  return <>{text.split(/([A-Za-z][^\u0600-\u06ff]*)/g).map((part, i) => /[A-Za-z]/.test(part)
    ? <bdi key={i} dir="ltr">{part}</bdi> : <React.Fragment key={i}>{part}</React.Fragment>)}</>;
}

export function LessonCorrection({ wrong, correct }: { wrong: string; correct: string }) {
  const { t, dir } = useLanguage();
  return <div className="space-y-3 w-full min-w-0">
    {([{ label: t('lc.wrong'), text: wrong, style: 'border-red-400/25 bg-red-400/10 text-red-200' },
      { label: t('lc.correct'), text: correct, style: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200' }]).map(row => (
      <div key={row.label} className={`rounded-xl border p-3 sm:p-4 space-y-2 ${row.style}`}>
        <div dir={dir} className="text-start text-xs font-black">{row.label}</div>
        <p dir={/^[\s"'(]*[A-Za-z]/.test(row.text) ? 'ltr' : 'rtl'} className="text-sm leading-7 font-semibold break-words whitespace-pre-line" style={{ textAlign: 'start' }}><MixedLessonText text={row.text} /></p>
      </div>
    ))}
  </div>;
}

export function LessonTrap({ text }: { text: string }) {
  const pair = splitLessonCorrection(text);
  if (!pair) return <p dir="rtl" className="text-xs sm:text-sm text-red-100 leading-7"><MixedLessonText text={text} /></p>;
  return <div className="min-w-0 w-full space-y-4">
    {pair.intro && <p dir="rtl" className="text-xs sm:text-sm text-[#dedbf4] leading-7"><MixedLessonText text={pair.intro} /></p>}
    <LessonCorrection wrong={pair.wrong} correct={pair.correct} />
  </div>;
}
