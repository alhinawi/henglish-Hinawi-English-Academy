// ==============================================================================
// Henglish Academy (HENGLISH) - TRANSLATION OUTPUT PANEL
// Features interactive word clicking, multilingual audio playback, and copy action
// ==============================================================================

import React, { useState } from 'react';
import { LanguageCode } from '../../types/translation';
import { playSound, speakMultilingualText } from '../../utils/audio';
import { Volume2, Copy, Check, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface TranslationOutputProps {
  translatedText: string;
  targetLang: LanguageCode;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onWordClick?: (word: string) => void;
  onExplainClick?: () => void;
}

export const TranslationOutput: React.FC<TranslationOutputProps> = ({
  translatedText,
  targetLang,
  isLoading,
  error,
  onRetry,
  onWordClick,
  onExplainClick,
}) => {
  const [copied, setCopied] = useState(false);

  const isRtl = targetLang === 'ar' || targetLang === 'fa';
  const textDirection = isRtl ? 'rtl' : 'ltr';
  const textAlign = isRtl ? 'text-right' : 'text-left';

  const handleCopy = async () => {
    if (!translatedText.trim()) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      playSound('click');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleSpeak = () => {
    if (!translatedText.trim()) return;
    playSound('click');
    speakMultilingualText(translatedText, targetLang);
  };

  // Split words while preserving punctuation for interactive word analysis
  const words = translatedText.split(/(\s+)/);

  return (
    <div className="flex flex-col h-full bg-[#0e0c26] rounded-2xl border border-white/10 shadow-xl overflow-hidden">
      {/* Output Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 text-xs text-[#b9b6d5]">
        <span className="font-medium text-white flex items-center gap-1.5">
          <span>الترجمة الذكية (AI Translation)</span>
          {translatedText && !isLoading && (
            <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-md font-semibold">
              مكتملة
            </span>
          )}
        </span>

        <div className="flex items-center gap-1">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!translatedText.trim() || isLoading}
            title="نسخ الترجمة"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Text-to-Speech Button */}
          <button
            type="button"
            onClick={handleSpeak}
            disabled={!translatedText.trim() || isLoading}
            title="استمع لنطق الترجمة"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-[#41e7ff] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Output Content Area */}
      <div className="relative flex-1 p-4 flex flex-col justify-between">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3 animate-pulse my-auto">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="text-center pt-4">
              <span className="text-xs text-[#41e7ff] font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                يقوم المحرك الذكي بتحليل السياق وصياغة الترجمة المثالية...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="my-auto p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-right">
            <div className="flex items-center gap-2 text-red-400 font-semibold mb-1 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>تعذر إتمام الترجمة</span>
            </div>
            <p className="text-xs text-red-300/80 mb-3">{error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-medium cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>إعادة المحاولة</span>
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && !translatedText && (
          <div className="my-auto text-center py-8 text-[#b9b6d5]/50">
            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#41e7ff]" />
            <p className="text-sm">ستظهر الترجمة السياقية والتحليل اللغوي هنا فور الضغط على ترجمة.</p>
            <p className="text-xs text-[#b9b6d5]/30 mt-1">
              يمكنك النقر على أي كلمة لاحقاً لتحليل معناها وفونيتكس نطقها وحفظها!
            </p>
          </div>
        )}

        {/* Rendered Translation with Clickable Words */}
        {!isLoading && !error && translatedText && (
          <div
            dir={textDirection}
            className={`w-full flex-1 text-white text-base md:text-lg leading-relaxed select-text ${textAlign}`}
          >
            {words.map((chunk, index) => {
              const isWhitespace = /^\s+$/.test(chunk);
              if (isWhitespace) return <span key={index}>{chunk}</span>;

              const cleanWord = chunk.replace(/[.,!?;:()"«»]/g, '');

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    if (onWordClick && cleanWord) {
                      onWordClick(cleanWord);
                    }
                  }}
                  title="انقر لتحليل الكلمة، نطقها الفونيتكس، وحفظها للمفردات"
                  className="inline-block cursor-pointer hover:text-[#41e7ff] hover:bg-[#41e7ff]/10 rounded px-1 -mx-0.5 transition-colors active:scale-95"
                >
                  {chunk}
                </button>
              );
            })}
          </div>
        )}

        {/* Educational Hint Badge */}
        {translatedText && !isLoading && onExplainClick && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-[#b9b6d5]/60">💡 اضغط على أي كلمة لتحليلها أو احفظها</span>
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onExplainClick();
              }}
              className="text-[#41e7ff] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ffb84d]" />
              <span>شرح الترجمة والقواعد بالتفصيل</span>
            </button>
          </div>
        )}
      </div>

      {/* Output Footer Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-t border-white/10 text-xs text-[#b9b6d5]/70">
        <span>{translatedText ? `${translatedText.length} حرف` : '0 حرف'}</span>
        <span className="text-[11px] text-[#41e7ff]/80">ذكاء اصطناعي لغوي متقدم</span>
      </div>
    </div>
  );
};
