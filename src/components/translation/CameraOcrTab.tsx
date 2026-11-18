import { useOwnedClipboard } from '../../hooks/useOwnedClipboard';
import { LessonSpeechButton } from '../LessonSpeechButton';
// ==============================================================================
// Henglish Academy (HENGLISH) - CAMERA & IMAGE OCR TRANSLATION TAB
// Real computer vision text extraction, reading order preservation, and translation
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { LanguageCode } from '../../types/translation';
import { performImageOcrTranslation } from '../../services/translationService';
import { playSound } from '../../utils/audio';
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  Volume2,
  Copy,
  Check,
  AlertCircle,
  ScanText,
  FileCheck2,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { isAiServiceUnavailable } from '../../services/aiAvailability';

interface CameraOcrTabProps {
  targetLang: LanguageCode;
}

export const CameraOcrTab: React.FC<CameraOcrTabProps> = ({ targetLang }) => {
  const { t } = useLanguage();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageCode>('en');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { copy, copiedKey, copyFailed } = useOwnedClipboard(JSON.stringify([extractedText, translatedText, targetLang]));

  const version = useRef(0);
  const readerRef = useRef<FileReader | null>(null);
  const requestController = useRef<AbortController | null>(null);
  useEffect(() => () => { version.current += 1; readerRef.current?.abort(); requestController.current?.abort(); }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(t('ocr.errInvalidFile'));
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setErrorMsg(t('ocr.errTooLarge'));
      return;
    }

    const request = ++version.current;
    requestController.current?.abort();
    readerRef.current?.abort();
    setImagePreview(null);
    setConfidence(null);
    setIsProcessing(true);
    setErrorMsg(null);
    setExtractedText('');
    setTranslatedText('');

    const reader = new FileReader();
    readerRef.current = reader;
    reader.onerror = () => { if (request !== version.current) return; setErrorMsg(t('ocr.errExtract')); setIsProcessing(false); };
    reader.onload = () => {
      if (request !== version.current) return;
      readerRef.current = null;
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      void processImage(dataUrl, file.type, request);
    };
    reader.readAsDataURL(file);
    playSound('click');
  };

  const processImage = async (dataUrl: string, mimeType: string, request: number) => {
    setIsProcessing(true);
    setErrorMsg(null);

    const controller = new AbortController();
    requestController.current = controller;
    const deadline = setTimeout(() => controller.abort(), 60000);
    try {
      const base64 = dataUrl.split(',')[1];
      const result = await performImageOcrTranslation(base64, mimeType, targetLang, controller.signal);

      if (request !== version.current) return;
      setExtractedText(result.extractedText);
      setTranslatedText(result.translatedText || '');
      setDetectedLanguage(result.detectedLang);
      setConfidence(result.confidence);
      playSound('fanfare');
    } catch (err) {
      if (request !== version.current) return;
      console.error('OCR processing error:', err);
      setErrorMsg(isAiServiceUnavailable(err) ? t('ai.unavailable') : t('ocr.errExtract'));
      playSound('wrong');
    } finally {
      clearTimeout(deadline);
      if (request === version.current) { requestController.current = null; setIsProcessing(false); }
    }
  };



  const handleCopy = async (text: string, key: string) => {
    if (await copy(text, key)) playSound('click');
  };

  return (
    <div className="space-y-6 text-right">
      {copyFailed && <p role="status" className="rounded-xl border border-amber-400/30 p-4 text-sm text-amber-200">{t('lw.copyFailed')}</p>}
      {/* OCR Banner */}
      <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#41e7ff]" />
            <span>{t('ocr.title')}</span>
          </h3>
          <p className="text-xs text-[#b9b6d5] mt-1">
            {t('ocr.blurb')}
          </p>
        </div>

        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#41e7ff] to-[#7c3aed] text-black font-bold text-xs shadow-lg shadow-[#41e7ff]/20 hover:brightness-110 active:scale-95 cursor-pointer transition-all shrink-0">
          <Camera className="w-4 h-4" />
          <span>{t('ocr.capture')}</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Content Split: Image Preview vs Text Extraction & Translation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left/Right: Image Dropzone / Preview */}
        <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 flex flex-col items-center justify-center min-h-[300px]">
          {imagePreview ? (
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 shadow-lg group">
              <img
                src={imagePreview}
                alt="Uploaded source"
                className="w-full h-auto max-h-[420px] object-contain mx-auto bg-black/40"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
                  <div className="w-10 h-10 border-3 border-[#41e7ff] border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="text-sm font-bold text-white flex items-center gap-2">
                    <ScanText className="w-4 h-4 text-[#ffb84d]" />
                    <span>{t('ocr.scanning')}</span>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-[#b9b6d5]/50">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30 text-[#41e7ff]" />
              <p className="text-sm font-semibold text-white">{t('ocr.noImage')}</p>
              <p className="text-xs text-[#b9b6d5]/40 mt-1">
                {t('ocr.noImageHint')}
              </p>
            </div>
          )}
        </div>

        {/* Right/Left: Extraction & Translation Results */}
        <div className="space-y-4">
          {/* Extracted Original Text */}
          <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#b9b6d5]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-[#41e7ff]" />
                <span>{t('ocr.extractedTitle')}</span>
              </span>
              {confidence && (
                <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded font-mono">
                  {t('ocr.confidence')} {Math.round(confidence * 100)}%
                </span>
              )}
            </div>

            <div
              dir={detectedLanguage === 'ar' ? 'rtl' : 'ltr'}
              className="p-3.5 rounded-xl bg-black/40 border border-white/5 min-h-[90px] text-sm text-slate-200 whitespace-pre-wrap select-text leading-relaxed"
            >
              {extractedText || (isProcessing ? t('ocr.scanningShort') : t('ocr.extractedPlaceholder'))}
            </div>

            {extractedText && (
              <div className="flex flex-wrap items-start justify-end gap-2 pt-1">
                <LessonSpeechButton key={extractedText + detectedLanguage} text={extractedText} language={detectedLanguage} label={t('ocr.listenExtracted')} iconOnly
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-[#41e7ff] transition-colors cursor-pointer" />
                <button
                  type="button"
                  onClick={() => handleCopy(extractedText, 'source')}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-white transition-colors cursor-pointer"
                  title={t('ocr.copyText')}
                >
                  {copiedKey === 'source' ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* AI Translated Result */}
          <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#b9b6d5]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#ffb84d]" />
                <span>{t('ocr.translatedTitle')}</span>
              </span>
            </div>

            <div
              dir={targetLang === 'ar' ? 'rtl' : 'ltr'}
              className="p-3.5 rounded-xl bg-black/40 border border-white/5 min-h-[90px] text-sm font-bold text-white whitespace-pre-wrap select-text leading-relaxed"
            >
              {translatedText || (isProcessing ? t('ocr.translating') : t('ocr.translatedPlaceholder'))}
            </div>

            {translatedText && (
              <div className="flex flex-wrap items-start justify-end gap-2 pt-1">
                <LessonSpeechButton key={translatedText + targetLang} text={translatedText} language={targetLang} label={t('ocr.listenTranslation')} iconOnly
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#41e7ff] transition-colors cursor-pointer" />
                <button
                  type="button"
                  onClick={() => handleCopy(translatedText, 'translation')}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-white transition-colors cursor-pointer"
                  title={t('ocr.copyTranslation')}
                >
                  {copiedKey === 'translation' ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
