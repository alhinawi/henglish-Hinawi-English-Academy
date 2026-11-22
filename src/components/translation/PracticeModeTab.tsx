import { TRANSLATION_PRACTICE_PHOTOS, TRANSLATION_PRACTICE_THEMES } from '../../data/translationPracticePhotos';
import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { CEFRLevel } from '../../types';
import { TRANSLATION_PRACTICE_CHALLENGES } from '../../services/translationService';
import { LessonSpeechButton } from '../LessonSpeechButton';

interface PracticeModeTabProps { userLevel?: CEFRLevel; onAwardXp?: (amount: number) => void }

// Self-study only. No free-text scoring, claimed proficiency or automatic XP.
export const PracticeModeTab: React.FC<PracticeModeTabProps> = () => {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [level, setLevel] = useState('all');
  const [direction, setDirection] = useState('all');
  const [revealed, setRevealed] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Record<string, string[]>>({});
  const challenges = TRANSLATION_PRACTICE_CHALLENGES.filter(item => (level === 'all' || item.difficulty === level) && (direction === 'all' || item.direction === direction));
  const challenge = challenges[index] || challenges[0];
  if (!challenge) return null;
  const photo = TRANSLATION_PRACTICE_PHOTOS[TRANSLATION_PRACTICE_THEMES[challenge.id] || 'study'];
  return <section className="rounded-3xl border border-white/10 bg-[#0e0c26] p-5 space-y-5 text-right">
    <h3 className="font-bold text-xl text-white">{t('tpr.title')}</h3>
    <p className="text-sm text-slate-300 leading-7">{t('tpr.intro')}</p>
    <div className="grid gap-3 sm:grid-cols-2"><label htmlFor="translation-practice-level" className="space-y-2 text-start text-sm"><span>{t('tpr.filter.level')}</span><select id="translation-practice-level" aria-label={t('tpr.filter.level')} value={level} onChange={event => { setLevel(event.target.value); setIndex(0); setRevealed(false); }} className="min-h-11 w-full rounded-xl border border-white/20 bg-[#080619] px-3"><option value="all">{t('tpr.filter.all')}</option>{['A1','A2','B1','B2','C1','C2'].map(value => <option key={value} value={value}>{value}</option>)}</select></label><label htmlFor="translation-practice-direction" className="space-y-2 text-start text-sm"><span>{t('tpr.filter.direction')}</span><select id="translation-practice-direction" aria-label={t('tpr.filter.direction')} value={direction} onChange={event => { setDirection(event.target.value); setIndex(0); setRevealed(false); }} className="min-h-11 w-full rounded-xl border border-white/20 bg-[#080619] px-3"><option value="all">{t('tpr.filter.all')}</option><option value="ar-to-en">{t('tpr.arEn')}</option><option value="en-to-ar">{t('tpr.enAr')}</option></select></label></div>
    <p role="status" className="text-xs leading-7 text-slate-400">{t('tpr.filter.position').replace('{current}', String(index+1)).replace('{total}', String(challenges.length))} {t('tpr.filter.note')}</p>
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-start"><img key={photo.src} src={photo.src} alt={t(photo.caption)} width={640} height={360} loading="lazy" className="h-44 w-full object-cover sm:h-56"/><figcaption className="space-y-2 p-4"><p className="text-sm leading-7 text-cyan-100">{t(photo.caption)}</p><p className="text-xs leading-6 text-slate-400">{t('tpr.photo.note')}</p></figcaption></figure>
    <div className="flex items-center justify-between text-xs text-cyan-200"><span>{challenge.direction === 'en-to-ar' ? t('tpr.enAr') : t('tpr.arEn')}</span><bdi>{challenge.difficulty}</bdi></div>
    <p dir={challenge.direction === 'en-to-ar' ? 'ltr' : 'rtl'} className="text-xl leading-9 rounded-2xl p-5 bg-white/5 text-white">{challenge.sourceSentence}</p>
    <LessonSpeechButton key={challenge.id} text={challenge.sourceSentence} language={challenge.direction === 'en-to-ar' ? 'en' : 'ar'} label={t('tpr.listen')} className="min-h-11 px-4 rounded-xl bg-white/10 text-white" />
    <div className="space-y-2 text-start"><label htmlFor="translation-practice-draft" className="block text-sm font-bold text-cyan-100">{t('tpr.draft')}</label><textarea id="translation-practice-draft" aria-describedby="translation-practice-privacy" dir={challenge.direction === 'ar-to-en' ? 'ltr' : 'rtl'} lang={challenge.direction === 'ar-to-en' ? 'en' : 'ar'} rows={4} maxLength={3000} value={drafts[challenge.id] || ''} onChange={event => { setDrafts(value => ({ ...value, [challenge.id]: event.target.value })); setReviews(value => ({ ...value, [challenge.id]: [] })); }} className="w-full rounded-2xl border border-cyan-200/25 bg-[#080619] p-4 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-200" /><p id="translation-practice-privacy" className="text-xs leading-6 text-slate-400">{t('tpr.draftNote')}</p></div>
    <button aria-expanded={revealed} className="block min-h-12 px-5 rounded-xl bg-cyan-200 text-slate-950 font-bold" onClick={() => setRevealed(value => !value)}>{revealed ? t('tpr.hide') : t('tpr.show')}</button>
    {revealed && <div className="rounded-2xl p-5 bg-white/5 space-y-3"><h4 className="text-cyan-100 font-bold">{t('tpr.answers')}</h4>{challenge.modelTranslations.map(answer => <p key={answer} dir={challenge.direction === 'ar-to-en' ? 'ltr' : 'rtl'} className="text-white leading-8">{answer}</p>)}<fieldset className="space-y-3 border-t border-white/15 pt-4 text-start"><legend className="pt-4 text-sm font-bold text-cyan-100">{t('tpr.checkTitle')}</legend>{['meaning','tense','natural'].map(item => <label key={item} className="flex min-h-11 items-start gap-3 text-sm leading-7 text-slate-200"><input type="checkbox" className="mt-1.5 h-5 w-5 shrink-0 accent-cyan-200" checked={(reviews[challenge.id] || []).includes(item)} onChange={event => setReviews(value => ({ ...value, [challenge.id]: event.target.checked ? [...(value[challenge.id] || []), item] : (value[challenge.id] || []).filter(check => check !== item) }))} />{t(`tpr.check.${item}`)}</label>)}<p className="text-xs leading-7 text-slate-400">{t('tpr.checkNote')}</p></fieldset></div>}
    <div className="flex gap-3"><button className="min-h-11 px-4 rounded-xl bg-white/10 text-white" onClick={() => { setIndex(value => (value - 1 + challenges.length) % challenges.length); setRevealed(false); }}>{t('tpr.previous')}</button><button className="min-h-11 px-4 rounded-xl bg-white/10 text-white" onClick={() => { setIndex(value => (value + 1) % challenges.length); setRevealed(false); }}>{t('tpr.next')}</button></div>
  </section>;
};
