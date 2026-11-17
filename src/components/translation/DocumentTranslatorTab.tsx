import { NoSelectablePdfTextError } from '../../services/documentTextExtraction';
// ==============================================================================
// Henglish Academy (HENGLISH) - DOCUMENT TRANSLATION TAB (TXT, PDF, DOCX)
// Format-aware document parsing, section chunking, progress tracking & download
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
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
import { useLanguage } from '../../i18n/LanguageContext';
import { isAiServiceUnavailable } from '../../services/aiAvailability';

interface DocumentTranslatorTabProps {
  learnerId?: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  mode: TranslationMode;
}

export const DocumentTranslatorTab: React.FC<DocumentTranslatorTabProps> = ({
  learnerId,
  sourceLang,
  targetLang,
  mode,
}) => {
  const { t } = useLanguage();
  const requestVersion = useRef(0);
  useEffect(() => () => { requestVersion.current += 1; }, []);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [originalDocumentText, setOriginalDocumentText] = useState<string>('');
  const [translatedDocumentText, setTranslatedDocumentText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [historySaveFailed, setHistorySaveFailed] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    // Allow the same document to be picked again after an error or result.
    e.target.value = '';

    // Validate size (max 10MB)
    if (selected.size > 10 * 1024 * 1024) {
      setErrorMessage(t('dt.errTooLarge'));
      return;
    }

    // Validate extension
    const ext = selected.name.split('.').pop()?.toLowerCase();
    if (!['txt', 'pdf', 'docx'].includes(ext || '')) {
      setErrorMessage(t('dt.errFormat'));
      return;
    }

    setFile(selected);
    setErrorMessage(null);
    setHistorySaveFailed(false);
    setTranslatedDocumentText('');
    setOriginalDocumentText('');
    playSound('click');
  };

  const handleStartTranslation = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setHistorySaveFailed(false);
    setProgressPercent(10);
    setStatusMessage(t('dt.decoding'));

    const version = ++requestVersion.current;
    try {
      const { text, chunks } = await extractTextFromDocument(file);
      if (version !== requestVersion.current) return;
      setOriginalDocumentText(text);

      const totalChunks = chunks.length;
      const translatedChunks: string[] = [];

      for (let i = 0; i < totalChunks; i++) {
        const chunk = chunks[i];
        setStatusMessage(t('dt.translatingChunk').replace('{n}', String(i + 1)).replace('{m}', String(totalChunks)));
        setProgressPercent(Math.round(15 + ((i + 1) / totalChunks) * 80));

        const res = await executeTranslation({
          text: chunk,
          sourceLang,
          targetLang,
          mode,
          includeAlternatives: false,
          includeExplanation: false,
        }, learnerId);

        if (version !== requestVersion.current) return;
        if (res.historySaved === false) setHistorySaveFailed(true);
        translatedChunks.push(res.translatedText);
      }

      const fullTranslation = translatedChunks.join('\n\n');
      setTranslatedDocumentText(fullTranslation);
      setProgressPercent(100);
      setStatusMessage(t('dt.done'));
      playSound('fanfare');
    } catch (err) {
      if (version !== requestVersion.current) return;
      console.error('Document translation error:', err);
      setErrorMessage(err instanceof NoSelectablePdfTextError ? t('dt.errNoPdfText') : isAiServiceUnavailable(err) ? t('ai.unavailable') : t('dt.errTranslate'));
      playSound('wrong');
    } finally {
      if (version === requestVersion.current) setIsProcessing(false);
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
      {historySaveFailed && <p role="status" className="rounded-xl border border-amber-400/30 p-4 text-sm leading-7 text-amber-200">{t('vocab.saveError')}</p>}
      {/* Tab Header Banner */}
      <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#41e7ff]" />
            <span>{t('dt.title')}</span>
          </h3>
          <p className="text-xs text-[#b9b6d5] mt-1">
            {t('dt.blurb')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
            {t('dt.formats')}
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
            {file ? file.name : t('dt.pickFile')}
          </span>
          <span className="text-xs text-[#b9b6d5]/70 block">
            {file ? `${(file.size / 1024).toFixed(1)} ${t('dt.kb')}` : t('dt.dropHint')}
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
            <span>{t('dt.start')}</span>
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
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-2">
              <FileCheck className="w-5 h-5 shrink-0 text-[#10b981]" />
              <h4 className="min-w-0 break-words text-sm font-bold leading-6 text-white">{t('dt.preview')}</h4>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="flex min-h-11 w-full items-center justify-center gap-2 px-4 py-2 sm:w-auto sm:shrink-0 rounded-xl bg-[#10b981] hover:bg-[#10b981]/90 text-black font-bold text-xs shadow-md shadow-[#10b981]/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="min-w-0 break-words">{t('dt.download')}</span>
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
