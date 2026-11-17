// ==============================================================================
// Henglish Academy (HENGLISH) - INTELLIGENT VOCABULARY WORD CARD
// Displays headword, dual audio (US Cyan / UK Purple), CEFR, Arabic meaning, and SRS save
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { LexicalEntry, isWordSaved, saveWord, removeSavedWord } from '../../services/vocabularyService';
import { txExample, txMeaning, useContentMap } from '../../services/contentI18nService';
import { PronunciationButton } from './PronunciationButton';
import { playSound } from '../../utils/audio';

interface WordCardProps {
  learnerId?: string;
  entry: LexicalEntry;
  onOpenDetails: (entry: LexicalEntry) => void;
  onSavedChange?: () => void;
  savedVersion: number;
  viewMode?: 'grid' | 'list';
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

export const WordCard: React.FC<WordCardProps> = ({
  learnerId,
  entry,
  onOpenDetails,
  onSavedChange,
  savedVersion,
  viewMode = 'grid',
}) => {
  const { t, dir } = useLanguage();
  const [saveError, setSaveError] = useState(false);
  const [saved, setSaved] = useState(() => isWordSaved(entry.headword, learnerId));
  // A detail-modal save/remove changes the same persisted word as this card.
  useEffect(() => {
    setSaved(isWordSaved(entry.headword, learnerId));
  }, [entry.headword, savedVersion, learnerId]);
  const txMap = useContentMap('vocab');
  const shownMeaning = txMeaning(txMap, entry.id, entry.meaningAr);
  const shownExample = txExample(txMap, entry.id, entry.exampleAr);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaveError(false);
    try {
      playSound('click');
      if (saved) {
        removeSavedWord(entry.headword, learnerId);
        setSaved(false);
      } else {
        saveWord(entry, undefined, learnerId);
        setSaved(true);
        playSound('success');
      }
      if (onSavedChange) onSavedChange();
    } catch { setSaveError(true); playSound('wrong'); }
  };

  const cefrStyle = CEFR_COLORS[entry.cefr] || CEFR_COLORS.Unclassified;

  // COMPACT LIST VIEW
  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onOpenDetails(entry)}
        className="glass-panel p-4 rounded-2xl border border-white/10 hover:border-white/25 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-right cursor-pointer group"
      >
        {saveError && <p role="alert" className="text-xs text-red-300">{t('vocab.saveError')}</p>}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSave}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all shrink-0 cursor-pointer"
            title={saved ? t('wc.remove') : t('wc.save')}
            aria-pressed={saved}
          >
            {saved ? (
              <BookmarkCheck className="w-4 h-4 text-[#c4ff55]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={e => { e.stopPropagation(); onOpenDetails(entry); }} className="en text-lg font-black text-white group-hover:text-[#41e7ff] transition-colors cursor-pointer">
                {entry.headword}
              </button>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${cefrStyle}`}>
                {entry.cefr}
              </span>
              {entry.pos && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-white/70">
                {entry.pos}
              </span>}
            </div>
            <p className="text-xs font-bold text-[#c4ff55] mt-0.5">
              {shownMeaning}
            </p>
          </div>
        </div>

        {/* Dual Pronunciation & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <PronunciationButton
            wordId={entry.id}
            wordText={entry.headword}
            accent="US"
            ipa={entry.ipaUs}
            audioUrl={entry.audioUsUrl}
            size="sm"
          />
          <PronunciationButton
            wordId={entry.id}
            wordText={entry.headword}
            accent="UK"
            ipa={entry.ipaUk}
            audioUrl={entry.audioUkUrl}
            size="sm"
          />
          <ChevronLeft className={`w-4 h-4 text-white/40 group-hover:text-white ${dir === 'ltr' ? 'rotate-180' : ''}`} />
        </div>
      </div>
    );
  }

  // GRID CARD VIEW
  return (
    <div
      onClick={() => onOpenDetails(entry)}
      className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between space-y-4 text-right cursor-pointer group hover:shadow-xl hover:shadow-black/40"
    >
      {saveError && <p role="alert" className="text-xs text-red-300">{t('vocab.saveError')}</p>}
      {/* Top row: Badges + Save Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleToggleSave}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-all cursor-pointer"
          title={saved ? t('wc.remove') : t('wc.save')}
            aria-pressed={saved}
        >
          {saved ? (
            <BookmarkCheck className="w-4 h-4 text-[#c4ff55]" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-white/60">
            {entry.domain}
          </span>
          {entry.pos && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/10 text-white/80">
            {entry.pos}
          </span>}
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${cefrStyle}`}>
            {entry.cefr}
          </span>
        </div>
      </div>

      {/* Headword & Arabic Translation */}
      <div className="space-y-1">
        <h3 className="en text-2xl font-black text-white group-hover:text-[#41e7ff] transition-colors tracking-tight">
          <button type="button" onClick={e => { e.stopPropagation(); onOpenDetails(entry); }} className="cursor-pointer">{entry.headword}</button>
        </h3>
        <p className="text-base font-black text-[#c4ff55] leading-snug">
          {shownMeaning}
        </p>
      </div>

      {/* Dual Pronunciation System (US Cyan, UK Purple) */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <PronunciationButton
          wordId={entry.id}
          wordText={entry.headword}
          accent="US"
          ipa={entry.ipaUs}
          audioUrl={entry.audioUsUrl}
          size="sm"
        />
        <PronunciationButton
          wordId={entry.id}
          wordText={entry.headword}
          accent="UK"
          ipa={entry.ipaUk}
          audioUrl={entry.audioUkUrl}
          size="sm"
        />
      </div>

      {/* English definition preview */}
      <p className="text-xs text-white/70 line-clamp-2 leading-relaxed font-sans" dir="ltr">
        {entry.definitionEn}
      </p>

      {/* Example preview */}
      {entry.exampleEn && (
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
          <p className="text-white/90 font-medium font-sans truncate" dir="ltr">
            "{entry.exampleEn}"
          </p>
          <p className="text-white/50 text-[11px] truncate">
            {shownExample}
          </p>
        </div>
      )}

      {/* Bottom Footer: Details Trigger */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-white/60 font-bold group-hover:text-white transition-colors">
        <div className="flex items-center gap-1 text-[#ffd166]">
          <Sparkles className="w-3.5 h-3.5" />
          {entry.frequencyTier && <span className="text-[10px] font-mono uppercase">{entry.frequencyTier}</span>}
        </div>
        <div className="flex items-center gap-1 text-[#41e7ff]">
          <span>{t('wc.details')}</span>
          <ChevronLeft className={`w-3.5 h-3.5 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </div>
  );
};

