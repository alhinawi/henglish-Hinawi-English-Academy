// ==============================================================================
// Henglish Academy (HENGLISH) - DOCUMENT TRANSLATION TAB (TXT, PDF, DOCX)
// Format-aware document parsing, section chunking, progress tracking & download
// ==============================================================================

import React, { useState } from 'react';
import { LanguageCode, TranslationMode } from '../../types/translation';
import { extractTextFromDocument, executeTranslation } from '../../services/translationService';
import { playSound } from '../../utils/audio';
import {
  FileText,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FileCheck,
} from 'lucide-react';

interface DocumentTranslatorTabProps {
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  mode: TranslationMode;
}

export const DocumentTranslatorTab: React.FC<DocumentTranslatorTabProps> = ({
  sourceLang,
  targetLang,
  mode,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [originalDocumentText, setOriginalDocumentText] = useState<string>('');
  const [translatedDocumentText, setTranslatedDocumentText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate size (max 10MB)
    if (selected.size > 10 * 1024 * 1024) {
      setErrorMessage('حجم الملف كبير جداً (الحد الأقصى 10 ميجابايت).');
      return;
    }

    // Validate extension
    const ext = selected.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'pdf', 'docx'].includes(ext || '')) {
      setErrorMessage('صيغة الملف غير مدعومة. يرجى اختيار ملف TXT أو PDF أو DOCX.');
      return;
    }

    setFile(selected);
    setErrorMessage(null);
    setTranslatedDocumentText('');
    playSound('click');
  };

  const handleStartTranslation = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProgressPercent(10);
    setStatusMessage('جارٍ فك ترميز المستند واستخراج الفقرات المنظمة...');

    try {
      const { text, chunks } = await extractTextFromDocument(file);
      setOriginalDocumentText(text);

      const totalChunks = chunks.length;
      const translatedChunks: string[] = [];

      for (let i = 0; i < totalChunks; i++) {
        const chunk = chunks[i];
        setStatusMessage(`جارٍ ترجمة القسم ${i + 1} من أصل ${totalChunks}...`);
        setProgressPercent(Math.round(15 + ((i + 1) / totalChunks) * 80));

        const res = await executeTranslation({
          text: chunk,
          sourceLang,
          targetLang,
          mode,
          includeAlternatives: false,
          includeExplanation: false,
        });

        translatedChunks.push(res.translatedText);
      }

      const fullTranslation = translatedChunks.join('\n\n');
      setTranslatedDocumentText(fullTranslation);
      setProgressPercent(100);
      setStatusMessage('تمت ترجمة المستند بنجاح مع الحفاظ على التنسيق والفقرات!');
      playSound('fanfare');
    } catch (err) {
      console.error('Document translation error:', err);
      setErrorMessage('تعذر إكمال ترجمة المستند. يرجى التأكد من اتصال الإنترنت وصلاحية الملف.');
      playSound('wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!translatedDocumentText) return;
    playSound('click');

    const blob = new Blob([translatedDocumentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = file?.name.replace(/\.[^/.]+$/, '') || 'translated_document';
    a.download = `${baseName}_translated_${targetLang}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-right">
      {/* Tab Header Banner */}
      <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#41e7ff]" />
            <span>ترجمة المستندات الكاملة (Document Translation Studio)</span>
          </h3>
          <p className="text-xs text-[#b9b6d5] mt-1">
            ارفع ملفات TXT، PDF، أو DOCX. يقوم النظام باستخراج المحتوى وترجمته بالكامل مع الحفاظ على ترتيب الفقرات.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
            الصيغ المدعومة: TXT, PDF, DOCX
          </span>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="p-8 rounded-2xl bg-[#0e0c26] border-2 border-dashed border-white/15 hover:border-[#41e7ff]/50 transition-colors flex flex-col items-center justify-center text-center">
        <div className="p-4 rounded-2xl bg-[#41e7ff]/10 text-[#41e7ff] mb-3">
          <Upload className="w-8 h-8" />
        </div>

        <label className="cursor-pointer">
          <span className="text-sm font-bold text-white hover:text-[#41e7ff] transition-colors underline block mb-1">
            {file ? file.name : 'انقر لاختيار مستند من جهازك'}
          </span>
          <span className="text-xs text-[#b9b6d5]/70 block">
            {file ? `${(file.size / 1024).toFixed(1)} كيلوبايت` : 'أو اسحب الملف وأفلته هنا مباشرة (الحد الأقصى 10MB)'}
          </span>
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileChange}
            disabled={isProcessing}
            className="hidden"
          />
        </label>

        {file && !isProcessing && !translatedDocumentText && (
          <button
            type="button"
            onClick={handleStartTranslation}
            className="mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#41e7ff] to-[#7c3aed] text-black font-bold text-sm shadow-lg shadow-[#41e7ff]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>بدء ترجمة المستند الآن</span>
          </button>
        )}
      </div>

      {/* Progress & Status Indicator */}
      {isProcessing && (
        <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#41e7ff]">{statusMessage}</span>
            <span className="font-mono text-white">{progressPercent}%</span>
          </div>

          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#41e7ff] to-[#a855f7] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Translated Document Preview & Download */}
      {translatedDocumentText && (
        <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#10b981]" />
              <h4 className="text-sm font-bold text-white">معاينة المستند المترجم:</h4>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10b981] hover:bg-[#10b981]/90 text-black font-bold text-xs shadow-md shadow-[#10b981]/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>تحميل المستند المترجم (.txt)</span>
            </button>
          </div>

          <div
            dir={targetLang === 'ar' ? 'rtl' : 'ltr'}
            className="p-4 rounded-xl bg-black/40 border border-white/5 max-h-96 overflow-y-auto text-sm text-slate-200 leading-relaxed whitespace-pre-wrap select-text scrollbar-thin"
          >
            {translatedDocumentText}
          </div>
        </div>
      )}
    </div>
  );
};
