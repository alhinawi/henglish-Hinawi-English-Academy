// ==============================================================================
// Henglish Academy (HENGLISH) - CAMERA & IMAGE OCR TRANSLATION TAB
// Real computer vision text extraction, reading order preservation, and translation
// ==============================================================================

import React, { useState } from 'react';
import { LanguageCode } from '../../types/translation';
import { performImageOcrTranslation } from '../../services/translationService';
import { playSound, speakMultilingualText } from '../../utils/audio';
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

interface CameraOcrTabProps {
  targetLang: LanguageCode;
}

export const CameraOcrTab: React.FC<CameraOcrTabProps> = ({ targetLang }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageCode>('en');
  const [confidence, setConfidence] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('يرجى اختيار ملف صورة صالح (PNG, JPEG, WEBP).');
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setErrorMsg('حجم الصورة كبير جداً (الحد الأقصى 12 ميجابايت).');
      return;
    }

    setErrorMsg(null);
    setExtractedText('');
    setTranslatedText('');

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImagePreview(dataUrl);
      processImage(dataUrl, file.type);
    };
    reader.readAsDataURL(file);
    playSound('click');
  };

  const processImage = async (dataUrl: string, mimeType: string) => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const base64 = dataUrl.split(',')[1];
      const result = await performImageOcrTranslation(base64, mimeType, targetLang);

      setExtractedText(result.extractedText);
      setTranslatedText(result.translatedText || '');
      setDetectedLanguage(result.detectedLang);
      setConfidence(result.confidence);
      playSound('fanfare');
    } catch (err) {
      console.error('OCR processing error:', err);
      setErrorMsg('تعذر استخراج النص من الصورة. يرجى التأكد من وضوح الإضاءة ودقة الحروف.');
      playSound('wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpeak = (text: string, lang: string) => {
    playSound('click');
    speakMultilingualText(text, lang);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      playSound('click');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-6 text-right">
      {/* OCR Banner */}
      <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-[#41e7ff]" />
            <span>الترجمة البصرية والتعرف الضوئي (OCR Vision Translation)</span>
          </h3>
          <p className="text-xs text-[#b9b6d5] mt-1">
            التقط أو ارفع صورة لكتاب، لوحة، مستند، أو لافتة. يستخرج الذكاء الاصطناعي النص بدقة مع ترتيب القراءة ويترجمه فوراً.
          </p>
        </div>

        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#41e7ff] to-[#7c3aed] text-black font-bold text-xs shadow-lg shadow-[#41e7ff]/20 hover:brightness-110 active:scale-95 cursor-pointer transition-all shrink-0">
          <Camera className="w-4 h-4" />
          <span>التقط أو ارفع صورة</span>
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
                    <span>جارٍ المسح البصري واستخراج الحروف...</span>
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-[#b9b6d5]/50">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-30 text-[#41e7ff]" />
              <p className="text-sm font-semibold text-white">لم يتم اختيار صورة بعد</p>
              <p className="text-xs text-[#b9b6d5]/40 mt-1">
                اختر صورة تحتوي على نصوص باللغة الإنجليزية أو العربية
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
                <span>النص المستخرج من الصورة (Extracted Text)</span>
              </span>
              {confidence && (
                <span className="text-[10px] text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded font-mono">
                  دقة: {Math.round(confidence * 100)}%
                </span>
              )}
            </div>

            <div
              dir={detectedLanguage === 'ar' ? 'rtl' : 'ltr'}
              className="p-3.5 rounded-xl bg-black/40 border border-white/5 min-h-[90px] text-sm text-slate-200 whitespace-pre-wrap select-text leading-relaxed"
            >
              {extractedText || (isProcessing ? 'جارٍ المسح...' : 'سيظهر النص المستخرج هنا...')}
            </div>

            {extractedText && (
              <div className="flex justify-end gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => handleSpeak(extractedText, detectedLanguage)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-[#41e7ff] transition-colors cursor-pointer"
                  title="استمع للنص المستخرج"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(extractedText)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-white transition-colors cursor-pointer"
                  title="نسخ النص"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* AI Translated Result */}
          <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#b9b6d5]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#ffb84d]" />
                <span>الترجمة السياقية الفورية (Translated Text)</span>
              </span>
            </div>

            <div
              dir={targetLang === 'ar' ? 'rtl' : 'ltr'}
              className="p-3.5 rounded-xl bg-black/40 border border-white/5 min-h-[90px] text-sm font-bold text-white whitespace-pre-wrap select-text leading-relaxed"
            >
              {translatedText || (isProcessing ? 'جارٍ الترجمة...' : 'ستظهر الترجمة الكاملة هنا...')}
            </div>

            {translatedText && (
              <div className="flex justify-end gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => handleSpeak(translatedText, targetLang)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#41e7ff] transition-colors cursor-pointer"
                  title="استمع للترجمة"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(translatedText)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-white transition-colors cursor-pointer"
                  title="نسخ الترجمة"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
