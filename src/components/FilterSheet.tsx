// ==============================================================================
// Henglish Academy (HENGLISH) - FILTER SHEET
// Shared slim bottom-sheet filter UI for the banks (phrase banks, exam vocab).
// One "Filters" button opens the sheet; active selections show as small
// removable chips on a single scrollable line next to the result count.
// ==============================================================================

import React, { useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSection {
  key: string;
  title: string;
  options: FilterOption[];
  selected: string;
  onSelect: (value: string) => void;
}

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  sections: FilterSection[];
  onClearAll: () => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({ open, onClose, sections, onClearAll }) => {
  const { t } = useLanguage();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <button
        aria-label={t('fs.close')}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg bg-[#16142e] border-t border-white/15 rounded-t-3xl max-h-[75vh] overflow-y-auto pb-8 animate-[slideUp_.25s_ease-out]">
        <div className="sticky top-0 bg-[#16142e] pt-3 pb-2 px-5 flex items-center justify-between border-b border-white/10">
          <span className="w-10 h-1 rounded-full bg-white/20 absolute top-2 left-1/2 -translate-x-1/2" />
          <h2 className="text-base font-black text-white flex items-center gap-2 mt-1">
            <SlidersHorizontal className="w-4 h-4 text-[#ffd166]" />
            {t('fs.title')}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={onClearAll}
              className="text-xs font-bold text-[#b9b6d5] hover:text-[#ff4f9a] transition-colors"
            >
              {t('fs.clearAll')}
            </button>
            <button
              onClick={onClose}
              aria-label={t('fs.close')}
              className="p-1.5 rounded-full bg-white/5 text-white hover:bg-white/15 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="px-5 py-4 space-y-5">
          {sections.map((section) => (
            <div key={section.key} className="space-y-2">
              <p className="text-xs font-black text-[#b9b6d5]">{section.title}</p>
              <div className="flex flex-wrap gap-2">
                {section.options.map((opt) => {
                  const active = section.selected === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => section.onSelect(opt.value)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        active
                          ? 'bg-[#ffd166] text-[#1a1836] border-[#ffd166]'
                          : 'bg-white/5 text-[#b9b6d5] border-white/10 hover:border-[#ffd166]/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="px-5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#ffd166] text-[#1a1836] text-sm font-black hover:brightness-110 transition-all"
          >
            {t('fs.done')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ActiveChipsProps {
  chips: { key: string; label: string; onRemove: () => void }[];
  resultCount: number;
}

/** One horizontally-scrollable line of removable active-filter chips + count. */
export const ActiveFilterChips: React.FC<ActiveChipsProps> = ({ chips, resultCount }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 -mb-1">
      <span className="shrink-0 text-xs font-black text-[#b9b6d5]">
        {resultCount.toLocaleString('en')} {t('fs.results')}
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          onClick={chip.onRemove}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30 text-[11px] font-bold hover:bg-[#ffd166]/25 transition-colors"
        >
          {chip.label}
          <X className="w-3 h-3" />
        </button>
      ))}
    </div>
  );
};
