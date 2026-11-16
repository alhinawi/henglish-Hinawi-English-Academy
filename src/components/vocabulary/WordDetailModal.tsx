// ==============================================================================
// Henglish Academy (HENGLISH) - COMPREHENSIVE WORD DETAIL MODAL
// Full-depth lexical inspector with inflections, dual pronunciation, senses, and SRS
// ==============================================================================

import React, { useState, useEffect, useRef, useId } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  X,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  BookOpen,
  Layers,
  ArrowRight,
  ExternalLink,
  Tag,
  CheckCircle2,
  Brain,
  Quote,
} from 'lucide-react';
import { LexicalEntry, isWordSaved, saveWord, removeSavedWord, getSavedWords } from '../../services/vocabularyService';
import { txExample, txMeaning, useContentMap } from '../../services/contentI18nService';
import { PronunciationButton } from './PronunciationButton';
import { playSound } from '../../utils/audio';

interface WordDetailModalProps {
  entry: LexicalEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onWordSavedChange?: () => void;
}

const CEFR_COLORS: Record<string, string> = {
  A1: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  A2: 'bg-teal-500/15 text-teal-400 border-teal-500/30',
  B1: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  B2: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  C1: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  C2: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Unclassified: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  entry,
  isOpen,
  onClose,
  onWordSavedChange,
}) => {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [userNote, setUserNote] = useState('');
  const [persistedNote, setPersistedNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const txMap = useContentMap('vocab');
  const shownMeaning = entry ? txMeaning(txMap, entry.id, entry.meaningAr) : '';
  const shownExample = entry ? txExample(txMap, entry.id, entry.exampleAr) : '';

  useEffect(() => {
    if (entry) {
      setSaveError(false);
      const isSaved = isWordSaved(entry.headword);
      setSaved(isSaved);
      const savedItems = getSavedWords();
      const current = savedItems.find(w => w.word.toLowerCase() === entry.headword.toLowerCase());
      setUserNote(current?.notes || '');
      setPersistedNote(current?.notes || '');
      setNoteSaved(false);
    }
  }, [entry, isOpen]);

  useEffect(() => {
    if (!isOpen || !entry) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    const focusable = () => Array.from(dialog?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]'
    ) ?? []).filter(el => el.getClientRects().length > 0);
    focusable()[0]?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusable(), first = items[0], last = items[items.length - 1];
      if (!first) { event.preventDefault(); dialog?.focus(); return; }
      if (!dialog?.contains(document.activeElement) || event.shiftKey && document.activeElement === first) {
        event.preventDefault(); (event.shiftKey ? last : first).focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', trap);
    return () => { document.removeEventListener('keydown', trap); if (opener?.isConnected) opener.focus(); };
  }, [isOpen, entry?.id]);

  const requestClose = () => {
    if (userNote !== persistedNote && !window.confirm(t('wdm.discardNote'))) return;
    onClose();
  };

  useEffect(() => {
    if (!isOpen || userNote === persistedNote) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isOpen, userNote, persistedNote]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        requestClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, userNote, persistedNote, t]);

  if (!isOpen || !entry) return null;

  const handleToggleSave = () => {
    setSaveError(false);
    try {
      playSound('click');
      if (saved) {
        removeSavedWord(entry.headword);
        setSaved(false);
      } else {
        saveWord(entry, userNote);
        setPersistedNote(userNote);
        setNoteSaved(true);
        setSaved(true);
        playSound('success');
      }
      if (onWordSavedChange) onWordSavedChange();
    } catch { setSaveError(true); playSound('wrong'); }
  };

  const handleSaveNote = () => {
    setSaveError(false);
    try {
      saveWord(entry, userNote);
      setPersistedNote(userNote);
      setNoteSaved(true);
      setSaved(true);
      playSound('success');
      if (onWordSavedChange) onWordSavedChange();
    } catch { setSaveError(true); playSound('wrong'); }
  };

  const cefrStyle = CEFR_COLORS[entry.cefr] || CEFR_COLORS.Unclassified;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-linear-to-b from-[#14132b] via-[#100f24] to-[#0a0918] p-6 sm:p-8 shadow-2xl text-right space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            onClick={requestClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
            title={t('wdm.close')}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSave}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                saved
                  ? 'bg-[#c4ff55]/20 text-[#c4ff55] border-[#c4ff55]/40'
                  : 'bg-white/5 text-white/80 hover:bg-white/10 border-white/10'
              }`}
            >
              {saved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-[#c4ff55]" />
                  <span>{t('wdm.saved')}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>{t('wdm.save')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {saveError && <p role="alert" className="text-xs text-red-300">{t('vocab.saveError')}</p>}
        {/* Word Title & Pronunciation Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 id={titleId} className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
                  {entry.headword}
                </h2>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase border ${cefrStyle}`}>
                  {entry.cefr}
                </span>
                {entry.pos && <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-white/10 text-white/80">
                  {entry.pos}
                </span>}
              </div>
              <p className="text-xl sm:text-2xl font-black text-[#c4ff55] mt-2 font-['Cairo',sans-serif]">
                {shownMeaning}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {entry.frequencyTier && <span className="text-[11px] font-bold px-2 py-1 rounded bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
                {entry.frequencyTier.toUpperCase()}
              </span>}
              <span className="text-[11px] font-bold px-2 py-1 rounded bg-white/10 text-white/70">
                {entry.domain}
              </span>
            </div>
          </div>

          {/* Dual Pronunciation Bar */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center gap-4">
            <span className="text-xs font-black text-[#dedbf4]">{t('wdm.pronunciation')}</span>
            <div className="flex items-center gap-3">
              <PronunciationButton
                wordId={entry.id}
                wordText={entry.headword}
                accent="US"
                ipa={entry.ipaUs}
                audioUrl={entry.audioUsUrl}
                size="md"
              />
              <PronunciationButton
                wordId={entry.id}
                wordText={entry.headword}
                accent="UK"
                ipa={entry.ipaUk}
                audioUrl={entry.audioUkUrl}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Alternative Meanings if available */}
        {entry.otherMeaningsAr && entry.otherMeaningsAr.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black text-white/70 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#ffd166]" />
              <span>{t('wdm.other')}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {entry.otherMeaningsAr.map((m, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white/90"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* English definition */}
        {entry.definitionEn?.trim() && <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="text-xs font-black text-[#41e7ff] flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('wdm.definition')}</span>
          </h4>
          <p className="text-sm text-white/90 leading-relaxed font-sans" dir="ltr">
            {entry.definitionEn}
          </p>
        </div>}

        {/* Grammatical Inflections */}
        {entry.inflections && Object.keys(entry.inflections).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black text-[#ffd166] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{t('wdm.forms')}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5" dir="ltr">
              {Object.entries(entry.inflections).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase font-mono text-white/50">{key}</div>
                  <div className="text-sm font-bold text-white font-sans mt-0.5">{String(val)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example Sentence */}
        {(entry.exampleEn?.trim() || shownExample?.trim()) && <div className="space-y-3 p-4 rounded-2xl bg-[#c4ff55]/5 border border-[#c4ff55]/20">
          <h4 className="text-xs font-black text-[#c4ff55] flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5" />
            <span>{t('wdm.example')}</span>
          </h4>
          <div className="space-y-1.5">
            <p className="text-sm sm:text-base font-bold text-white font-sans" dir="ltr">
              {entry.exampleEn ? `"${entry.exampleEn}"` : ''}
            </p>
            <p className="text-xs sm:text-sm text-[#dedbf4]">
              {shownExample}
            </p>
          </div>
        </div>}

        {/* Collocations */}
        {entry.collocations && entry.collocations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black text-white/70">
              {t('wdm.collocations')}
            </h4>
            <div className="flex flex-wrap gap-2" dir="ltr">
              {entry.collocations.map((col, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-white/5 border border-white/10 text-[#41e7ff]"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Personal Note & SRS Review Box */}
        <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="text-xs font-black text-[#ffd166] flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            <span>{t('wdm.notes')}</span>
          </h4>
          <form onSubmit={e => { e.preventDefault(); handleSaveNote(); }} className="flex gap-2">
            <input
              type="text"
              value={userNote}
              onChange={e => { setUserNote(e.target.value); setNoteSaved(false); setSaveError(false); }}
              placeholder={t('wdm.placeholder')}
              className="min-w-0 flex-1 px-3 py-2 rounded-xl bg-[#09091a] border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#ffd166]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#ffd166] text-[#09091a] text-xs font-black hover:bg-[#ffe18d] transition-all cursor-pointer"
            >
              {t('wdm.saveNote')}
            </button>
          </form>
          {userNote !== persistedNote && <p role="status" className="text-xs text-amber-200">{t('wdm.noteUnsaved')}</p>}
          {noteSaved && userNote === persistedNote && <p role="status" className="text-xs text-emerald-300">{t('wdm.noteSaved')}</p>}
        </div>
      </div>
    </div>
  );
};

