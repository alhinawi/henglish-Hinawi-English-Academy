// ==============================================================================
// Henglish Academy (HENGLISH) - VOICE & SPEECH TRANSLATION TAB
// Real microphone recording with waveform analyzer, audio upload, and live playback
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { LanguageCode, TranslationMode } from '../../types/translation';
import { RealAudioRecorder, RecordedAudioData } from '../../utils/audioRecorder';
import { transcribeAudioRecording, executeTranslation } from '../../services/translationService';
import { playSound, speakMultilingualText } from '../../utils/audio';
import {
  Mic,
  MicOff,
  Volume2,
  Upload,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';

interface VoiceTranslatorTabProps {
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  mode: TranslationMode;
}

export const VoiceTranslatorTab: React.FC<VoiceTranslatorTabProps> = ({
  sourceLang,
  targetLang,
  mode,
}) => {
  const [recorder] = useState(() => new RealAudioRecorder());
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [recognizedText, setRecognizedText] = useState('');
  const [translatedVoiceText, setTranslatedVoiceText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Setup RealAudioRecorder callbacks
  useEffect(() => {
    recorder.onDurationTick = sec => setRecordDuration(sec);
    recorder.onWaveformData = (data: Uint8Array) => {
      // Downsample to 24 waveform bars for visualization
      const step = Math.floor(data.length / 24);
      const bars: number[] = [];
      for (let i = 0; i < 24; i++) {
        bars.push(data[i * step] || 0);
      }
      setWaveformData(bars);
    };

    return () => {
      if (recorder.state === 'RECORDING') {
        recorder.cancel();
      }
    };
  }, [recorder]);

  const handleToggleRecord = async () => {
    setErrorMsg(null);

    if (isRecording) {
      // Stop and evaluate
      setIsRecording(false);
      setIsTranscribing(true);
      playSound('click');

      try {
        const audioData: RecordedAudioData | null = await recorder.stop();
        if (audioData && audioData.base64) {
          // Send to speech transcription engine
          const { transcription, detectedLang } = await transcribeAudioRecording(
            audioData.base64,
            audioData.mimeType
          );

          setRecognizedText(transcription);
          setIsTranscribing(false);

          // Now translate the recognized speech
          if (transcription) {
            setIsTranslating(true);
            const res = await executeTranslation({
              text: transcription,
              sourceLang: sourceLang === 'auto' ? detectedLang : sourceLang,
              targetLang,
              mode,
            });
            setTranslatedVoiceText(res.translatedText);
            playSound('correct');

            // Automatic speech playback of translation
            speakMultilingualText(res.translatedText, targetLang);
          }
        }
      } catch (err) {
        console.error('Audio transcription error:', err);
        setErrorMsg('تعذر تحويل الصوت إلى نص. يرجى التأكد من تشغيل الميكروفون بوضوح والمحاولة مجدداً.');
        playSound('wrong');
      } finally {
        setIsTranscribing(false);
        setIsTranslating(false);
      }
    } else {
      // Start recording
      setRecognizedText('');
      setTranslatedVoiceText('');
      setRecordDuration(0);
      playSound('click');

      const success = await recorder.start();
      if (success) {
        setIsRecording(true);
      } else {
        setErrorMsg('تعذر الوصول إلى الميكروفون. يرجى منح الإذن في المتصفح.');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsTranscribing(true);
    setRecognizedText('');
    setTranslatedVoiceText('');
    playSound('click');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        if (base64) {
          const { transcription } = await transcribeAudioRecording(base64, file.type || 'audio/mp3');
          setRecognizedText(transcription);
          setIsTranscribing(false);

          if (transcription) {
            setIsTranslating(true);
            const res = await executeTranslation({
              text: transcription,
              sourceLang,
              targetLang,
              mode,
            });
            setTranslatedVoiceText(res.translatedText);
            playSound('correct');
            speakMultilingualText(res.translatedText, targetLang);
          }
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setErrorMsg('تعذر قراءة الملف الصوتي.');
      playSound('wrong');
    } finally {
      setIsTranscribing(false);
      setIsTranslating(false);
    }
  };

  const handleSpeakTranslation = () => {
    if (!translatedVoiceText) return;
    playSound('click');
    speakMultilingualText(translatedVoiceText, targetLang);
  };

  const handleCopy = async () => {
    if (!translatedVoiceText) return;
    try {
      await navigator.clipboard.writeText(translatedVoiceText);
      playSound('click');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="space-y-6 text-right">
      {/* Voice Banner */}
      <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#41e7ff]" />
            <span>الترجمة الصوتية الحية (Real Voice Translation)</span>
          </h3>
          <p className="text-xs text-[#b9b6d5] mt-1">
            تحدث بحرية بصوتك، وسيقوم النظام بتفريغ كلامك بدقة، ترجمته سياقياً، ونطقه باللغة الهدف فوراً.
          </p>
        </div>

        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white cursor-pointer transition-colors shrink-0">
          <Upload className="w-4 h-4 text-[#ffb84d]" />
          <span>رفع ملف صوتي (MP3, WAV, M4A)</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Interactive Microphone & Waveform Center */}
      <div className="p-8 rounded-3xl bg-[#0e0c26] border border-white/15 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className={`absolute w-72 h-72 rounded-full blur-3xl -z-0 transition-opacity duration-500 ${isRecording ? 'bg-red-500/20 opacity-100' : 'bg-[#41e7ff]/10 opacity-60'}`} />

        {/* Live Audio Waveform Bars */}
        <div className="flex items-center justify-center gap-1 h-16 w-full max-w-md my-4 z-10">
          {waveformData.length > 0 ? (
            waveformData.map((val, idx) => (
              <span
                key={idx}
                className="w-1.5 rounded-full transition-all duration-75"
                style={{
                  height: `${Math.max(6, (val / 255) * 60)}px`,
                  backgroundColor: isRecording ? '#ff3366' : '#41e7ff',
                }}
              />
            ))
          ) : (
            <div className="flex items-center gap-1 opacity-20">
              {Array.from({ length: 24 }).map((_, i) => (
                <span key={i} className="w-1.5 h-2 bg-white rounded-full" />
              ))}
            </div>
          )}
        </div>

        {/* Record Button */}
        <button
          type="button"
          onClick={handleToggleRecord}
          className={`relative z-10 p-6 rounded-full font-bold shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 ${
            isRecording
              ? 'bg-red-500 text-white shadow-red-500/40 ring-4 ring-red-500/30 animate-pulse'
              : 'bg-gradient-to-r from-[#41e7ff] to-[#7c3aed] text-black shadow-[#41e7ff]/30 hover:scale-105'
          }`}
          aria-label={isRecording ? 'إيقاف التسجيل الصوتي' : 'بدء التسجيل الصوتي'}
        >
          {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        <span className="text-sm font-bold text-white mt-4 z-10">
          {isRecording ? `جارٍ الاستماع... (${recordDuration} ثانية)` : 'انقر على الميكروفون وابدأ في التحدث'}
        </span>
        <span className="text-xs text-[#b9b6d5]/60 mt-1 z-10">
          {isRecording ? 'انقر مرة أخرى عند الانتهاء لتفريغ الكلام وترجمته' : 'يدعم التعرف التلقائي على اللغة الإنجليزية والعربية'}
        </span>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Transcription & Translation Split Grid */}
      {(recognizedText || isTranscribing || isTranslating) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Step 1: Recognized Original Speech */}
          <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#b9b6d5]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>1. النص المنطوق المستخرج (Transcribed Speech)</span>
              </span>
              <span className="text-[11px] text-[#41e7ff] bg-[#41e7ff]/10 px-2 py-0.5 rounded">
                أصل الكلام
              </span>
            </div>

            {isTranscribing ? (
              <div className="py-6 text-center text-xs text-[#41e7ff] flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-[#ffb84d]" />
                <span>جارٍ تفريغ التسجيل الصوتي بدقة عالية...</span>
              </div>
            ) : (
              <p
                dir={sourceLang === 'ar' ? 'rtl' : 'ltr'}
                className="text-base text-white leading-relaxed min-h-[80px]"
              >
                "{recognizedText}"
              </p>
            )}
          </div>

          {/* Step 2: AI Voice Translation */}
          <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#b9b6d5]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>2. الترجمة السياقية والنطق (Translated Result)</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleSpeakTranslation}
                  disabled={!translatedVoiceText}
                  title="استمع للترجمة"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#41e7ff] transition-colors cursor-pointer disabled:opacity-30"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!translatedVoiceText}
                  title="نسخ الترجمة"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-white transition-colors cursor-pointer disabled:opacity-30"
                >
                  {copied ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isTranslating ? (
              <div className="py-6 text-center text-xs text-[#a855f7] flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-[#41e7ff]" />
                <span>جارٍ ترجمة الكلام وتجهيز النطق الطبيعي...</span>
              </div>
            ) : (
              <p
                dir={targetLang === 'ar' ? 'rtl' : 'ltr'}
                className="text-base text-white font-bold leading-relaxed min-h-[80px]"
              >
                "{translatedVoiceText}"
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
