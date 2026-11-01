// ==============================================================================
// Henglish Academy (HENGLISH) - TRANSLATION SOURCE TEXT EDITOR
// Responsive multi-lingual editor with character count, speech, and dynamic RTL/LTR
// ==============================================================================

import React, { useRef, useState } from 'react';
import { LanguageCode } from '../../types/translation';
import { playSound, speakMultilingualText } from '../../utils/audio';
import {
  Volume2,
  Trash2,
  Copy,
  Check,
  ClipboardPaste,
  Sparkles,
  Mic,
  MicOff,
  CornerDownLeft,
} from 'lucide-react';

interface SourceEditorProps {
  text: string;
  sourceLang: LanguageCode;
  detectedLang?: LanguageCode;
  onChangeText: (text: string) => void;
  onTranslate: () => void;
  isLoading: boolean;
  onStartVoiceInput?: () => void;
  isListening?: boolean;
}

const SAMPLE_SENTENCES = [
  'I am looking forward to hearing from you.',
  'By next October, our team will have built the complete platform.',
  'Break a leg at your presentation today!',
  'إن المثابرة والتدريب اليومي هما السبيل الوحيد لإتقان المحادثة.',
];

export const SourceEditor: React.FC<SourceEditorProps> = ({
  text,
  sourceLang,
  detectedLang,
  onChangeText,
  onTranslate,
  isLoading,
  onStartVoiceInput,
  isListening = false,
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Dynamic Direction & Alignment Determination
  const effectiveLang = sourceLang === 'auto' ? (detectedLang || 'en') : sourceLang;
  const isRtl = effectiveLang === 'ar' || effectiveLang === 'fa';
  const textDirection = isRtl ? 'rtl' : 'ltr';
  const textAlign = isRtl ? 'text-right' : 'text-left';

  const handleCopy = async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      playSound('click');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        playSound('click');
        onChangeText(clipboardText);
      }
    } catch {
      // Permission not granted or empty
    }
  };

  const handleClear = () => {
    playSound('click');
    onChangeText('');
    textareaRef.current?.focus();
  };

  const handleSpeak = () => {
    if (!text.trim()) return;
    playSound('click');
    speakMultilingualText(text, effectiveLang);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl + Enter or Cmd + Enter to translate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (text.trim() && !isLoading) {
        onTranslate();
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0c26] rounded-2xl border border-white/10 shadow-xl overflow-hidden focus-within:border-[#41e7ff]/60 transition-colors">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10 text-xs text-[#b9b6d5]">
        <span className="font-medium text-white flex items-center gap-1.5">
          <span>النص الأصلي (Source Text)</span>
          {sourceLang === 'auto' && (
            <span className="text-[10px] text-[#41e7ff] bg-[#41e7ff]/10 px-2 py-0.5 rounded-md">
              كشف تلقائي
            </span>
          )}
        </span>

        <div className="flex items-center gap-1">
          {/* Paste */}
          <button
            type="button"
            onClick={handlePaste}
            title="لصق من الحافظة"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-white transition-colors cursor-pointer"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
          </button>

          {/* Copy */}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!text.trim()}
            title="نسخ النص الأصلي"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Text-to-Speech */}
          <button
            type="button"
            onClick={handleSpeak}
            disabled={!text.trim()}
            title="استمع للنطق الأصلي"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-[#41e7ff] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* Clear */}
          {text.trim() && (
            <button
              type="button"
              onClick={handleClear}
              title="مسح النص"
              className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-red-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Textarea Area */}
      <div className="relative flex-1 p-4 flex flex-col">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          dir={textDirection}
          placeholder={isRtl ? 'اكتب أو الصق النص هنا للترجمة الفورية...' : 'Type or paste text here to translate...'}
          className={`w-full flex-1 min-h-[160px] bg-transparent resize-none text-white text-base md:text-lg leading-relaxed focus:outline-none placeholder-[#b9b6d5]/40 ${textAlign}`}
        />

        {/* Sample Sentences Chips when empty */}
        {!text && (
          <div className="pt-2 border-t border-white/5">
            <span className="text-[11px] text-[#b9b6d5]/70 block mb-2 text-right">
              جرب نماذج تعليمية مميزة بنقرة واحدة:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_SENTENCES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    onChangeText(sample);
                  }}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#41e7ff]/20 hover:text-[#41e7ff] border border-white/10 text-slate-300 transition-colors cursor-pointer text-right flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#ffb84d]" />
                  <span className="truncate max-w-[220px]">{sample}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Editor Footer Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-t border-white/10">
        <div className="flex items-center gap-3">
          {/* Microphone speech-to-text toggle */}
          {onStartVoiceInput && (
            <button
              type="button"
              onClick={() => {
                playSound('click');
                onStartVoiceInput();
              }}
              title="إدخال صوتي عبر الميكروفون"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                isListening
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse font-semibold'
                  : 'bg-white/5 hover:bg-white/10 text-[#b9b6d5] hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#41e7ff]" />}
              <span>{isListening ? 'جارٍ الاستماع...' : 'تحدث الآن'}</span>
            </button>
          )}

          {/* Character counter */}
          <span className="text-xs text-[#b9b6d5]/70">
            {text.length} حرف
          </span>
        </div>

        {/* Translate Action Button */}
        <button
          type="button"
          onClick={() => {
            playSound('click');
            onTranslate();
          }}
          disabled={!text.trim() || isLoading}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#41e7ff] to-[#7c3aed] text-black font-bold text-xs md:text-sm shadow-lg shadow-[#41e7ff]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>جارٍ الترجمة الذكية...</span>
            </>
          ) : (
            <>
              <span>ترجم الآن</span>
              <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
