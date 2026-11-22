import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Optional in-memory rehearsal. Existing scored choices are passed unchanged.
export function ScenarioReplyPractice({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  return <section aria-label={t('rle.draft.title')} className="space-y-4">
    <div className="rounded-2xl border border-cyan-200/25 bg-cyan-200/5 p-4 space-y-3">
      <h3 className="font-bold text-cyan-100">{t('rle.draft.title')}</h3>
      <p className="text-xs leading-7 text-slate-300">{t('rle.draft.intro')}</p>
      <button type="button" aria-expanded={open} onClick={() => { setOpen(value => !value); setDraft(''); setRevealed(false); setReviewed(false); }} className="min-h-11 rounded-xl border border-cyan-200/40 px-4 text-sm font-bold text-cyan-100">{t(open ? 'rle.draft.close' : 'rle.draft.open')}</button>
      {open && <div className="space-y-3"><label htmlFor="scenario-reply-draft" className="block text-sm font-bold text-white">{t('rle.draft.label')}</label><textarea id="scenario-reply-draft" aria-describedby="scenario-reply-privacy" dir="ltr" lang="en" rows={4} maxLength={2000} value={draft} onChange={event => { setDraft(event.target.value); setReviewed(false); }} className="w-full rounded-xl border border-cyan-200/30 bg-[#0c0b20] p-4 text-base leading-8 text-white focus:outline-none focus:ring-2 focus:ring-cyan-200"/><p id="scenario-reply-privacy" className="text-xs leading-7 text-slate-400">{t('rle.draft.privacy')}</p><button type="button" aria-expanded={revealed} onClick={() => setRevealed(value => !value)} className="min-h-11 rounded-xl bg-cyan-200 px-4 text-sm font-bold text-slate-950">{t(revealed ? 'rle.draft.hide' : 'rle.draft.compare')}</button>{revealed && <label className="flex min-h-11 gap-3 items-start text-sm leading-7 text-slate-200"><input type="checkbox" checked={reviewed} onChange={event => setReviewed(event.target.checked)} className="mt-1.5 h-5 w-5 shrink-0 accent-cyan-200"/>{t('rle.draft.review')}</label>}</div>}
    </div>
    {(!open || revealed) && children}
  </section>;
}
