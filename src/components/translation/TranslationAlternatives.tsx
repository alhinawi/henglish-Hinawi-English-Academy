import { useOwnedClipboard } from '../../hooks/useOwnedClipboard';
import { LessonSpeechButton } from '../LessonSpeechButton';
// ==============================================================================
// Henglish Academy (HENGLISH) - TRANSLATION ALTERNATIVES PANEL
// Displays alternative translations with style tags and pedagogical guidance
// ==============================================================================

import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { TranslationAlternative } from '../../types/translation';
import { playSound } from '../../utils/audio';
import { Check, Copy, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

interface TranslationAlternativesProps {
  alternatives: TranslationAlternative[];
  targetLang: string;
  onSelectAlternative?: (altText: string) => void;
}

export const TranslationAlternatives: React.FC<TranslationAlternativesProps> = ({
  alternatives,
  targetLang,
  onSelectAlternative,
}) => {
  const { t, lang } = useLanguage();
  const { copy, copiedKey, copyFailed } = useOwnedClipboard(JSON.stringify(alternatives) + targetLang);

  if (!alternatives || alternatives.length === 0) return null;

  const handleCopy = async (text: string, index: number) => {
    if (await copy(text, String(index))) playSound('click');
  };



  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="bg-[#0e0c26] rounded-2xl border border-white/10 p-4 shadow-lg space-y-3">
      {copyFailed && <p role="status" className="text-sm text-amber-200">{t('lw.copyFailed')}</p>}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-between text-start">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ffb84d]" />
          <span>{t('ta.title')}</span>
        </h4>
        <span className="text-xs text-[#b9b6d5]/70">
          {t('ta.intro')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {alternatives.map((alt, idx) => {
          const isCopied = copiedKey === String(idx);

          return (
            <div
              key={idx}
              className="flex flex-col justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#41e7ff]/40 transition-all duration-200 group text-start"
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30">
                    {lang === 'ar' ? (alt.styleLabelAr || alt.styleLabel) : (alt.styleLabel || alt.styleLabelAr)}
                  </span>
                  <span className="text-[10px] text-[#b9b6d5]/60 font-mono">
                    #{idx + 1}
                  </span>
                </div>

                {/* Translation Text */}
                <p dir="auto" className="text-sm font-medium text-white mb-2 leading-relaxed">
                  "{alt.translation}"
                </p>

                {/* Pedagogical Usage Context */}
                {alt.whenToUseAr && (
                  <p className="text-xs text-[#b9b6d5] bg-black/30 p-2 rounded-lg border border-white/5 leading-normal mb-3">
                    <span className="block font-semibold text-[#41e7ff] mb-1">{t('ta.when')}</span>
                    <span dir="auto" className="block">{alt.whenToUseAr}</span>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-start justify-between gap-3 pt-2 border-t border-white/5">
                {onSelectAlternative && (
                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      onSelectAlternative(alt.translation);
                    }}
                    className="flex items-center gap-1 text-xs text-[#41e7ff] hover:text-white transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('ta.select')}</span>
                  </button>
                )}

                <div className="flex flex-wrap items-start gap-1 ms-auto">
                  <LessonSpeechButton key={alt.translation + targetLang} text={alt.translation} language={targetLang} label={`${t('ta.listen')} ${idx + 1}`} iconOnly
              className="p-1 rounded-md text-[#b9b6d5] hover:text-[#41e7ff] hover:bg-white/5 transition-colors cursor-pointer" />
                  <button
                    type="button"
                    onClick={() => handleCopy(alt.translation, idx)}
                    title={t('ta.copy')}
                    className="p-1 rounded-md text-[#b9b6d5] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
