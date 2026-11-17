import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { lessonNoteKey, readLessonNote, saveLessonNote } from '../services/lessonNoteStorage';

export function LessonNoteEditor({ lessonId }: { lessonId: string }) {
  const { user } = useAuth();
  const storageKey = lessonNoteKey(lessonId, user?.id);
  return <ScopedLessonNoteEditor key={storageKey} storageKey={storageKey} />;
}
function ScopedLessonNoteEditor({ storageKey }: { storageKey: string }) {
  const { t } = useLanguage();
  const [initial] = useState(() => readLessonNote(storageKey));
  const [text, setText] = useState(initial.text);
  const [status, setStatus] = useState<'idle' | 'saved' | 'failed'>(initial.failed ? 'failed' : 'idle');
  return <div className="space-y-3">
    <p className="text-xs leading-6 text-slate-400">{t('lp.noteStorage')}</p>
    <textarea aria-label={t('lp.homeworkTitle')} rows={3} dir="ltr" lang="en" value={text} onChange={e => { setText(e.target.value); setStatus('idle'); }} placeholder="Write your English practice sentence here..." className="english-input en w-full p-4 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-[#b9b6d5]/50 text-sm focus:outline-none focus:border-[#41e7ff]" />
    <div className="flex flex-wrap items-start gap-3 text-xs">
      <button type="button" onClick={() => setStatus(saveLessonNote(storageKey, text) ? 'saved' : 'failed')} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#41e7ff] font-bold cursor-pointer transition-colors">{t('lp.saveNote')}</button>
      <p role="status" className={`min-w-0 leading-6 ${status === 'failed' ? 'text-amber-200' : 'text-[#c4ff55]'}`}>{status === 'saved' ? t('lp.noteSavedLocal') : status === 'failed' ? t('lit.storageError') : ''}</p>
    </div>
  </div>;
}
