import { useOwnedClipboard } from '../../hooks/useOwnedClipboard';
import { LessonSpeechButton } from '../LessonSpeechButton';
// ==============================================================================
// Henglish Academy (HENGLISH) - VOICE & SPEECH TRANSLATION TAB
// Real microphone recording with waveform analyzer, audio upload, and live playback
// ==============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { LanguageCode, TranslationMode } from '../../types/translation';
import { RealAudioRecorder, RecordedAudioData } from '../../utils/audioRecorder';
import { transcribeAudioRecording, executeTranslation } from '../../services/translationService';
import { playSound, stopSpeech } from '../../utils/audio';
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
import { useLanguage } from '../../i18n/LanguageContext';
import { isAiServiceUnavailable } from '../../services/aiAvailability';

interface VoiceTranslatorTabProps {
  learnerId?: string;
  sourceLang: LanguageCode;
  targetLang: LanguageCode;
  mode: TranslationMode;
}

export const VoiceTranslatorTab: React.FC<VoiceTranslatorTabProps> = ({
  learnerId,
  sourceLang,
  targetLang,
  mode,
}) => {
  const { t } = useLanguage();
  const [recorder] = useState(() => new RealAudioRecorder());
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const [recognizedText, setRecognizedText] = useState('');
  const [translatedVoiceText, setTranslatedVoiceText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [historySaveFailed, setHistorySaveFailed] = useState(false);

  const { copy, copiedKey, copyFailed } = useOwnedClipboard(JSON.stringify([translatedVoiceText, targetLang, learnerId]));

  const uploadVersion = useRef(0);
  const requestController = useRef<AbortController | null>(null);
  const uploadReader = useRef<FileReader | null>(null);
  useEffect(() => () => {
    uploadVersion.current += 1;
    requestController.current?.abort();
    uploadReader.current?.abort();
    stopSpeech();
  }, []);

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
      recorder.cleanup();
    };
  }, [recorder]);

  const handleToggleRecord = async () => {
    const version = ++uploadVersion.current;
    requestController.current?.abort();
    const isCurrent = () => version === uploadVersion.current;
    setErrorMsg(null);
    setHistorySaveFailed(false);

    if (isRecording) {
      // Stop and evaluate
      setIsRecording(false);
      setIsTranscribing(true);
      playSound('click');

      const controller = new AbortController();
      requestController.current = controller;
      const deadline = setTimeout(() => controller.abort(), 120000);
      try {
        const audioData: RecordedAudioData | null = await recorder.stop();
        if (!isCurrent()) return;
        if (audioData && audioData.base64) {
          // Send to speech transcription engine
          const { transcription, detectedLang } = await transcribeAudioRecording(
            audioData.base64,
            audioData.mimeType, controller.signal
          );

          if (!isCurrent()) return;
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
            }, learnerId, controller.signal);
            if (!isCurrent()) return;
            setTranslatedVoiceText(res.translatedText);
            if (res.historySaved === false) setHistorySaveFailed(true);
            playSound('correct');

            // The keyed result speech control owns automatic playback.
          }
        }
      } catch (err) {
        if (!isCurrent()) return;
        console.error('Audio transcription error:', err);
        setErrorMsg(isAiServiceUnavailable(err) ? t('ai.unavailable') : t('vt.errTranscribe'));
        playSound('wrong');
      } finally {
        clearTimeout(deadline);
        if (isCurrent()) { requestController.current = null; setIsTranscribing(false); setIsTranslating(false); }
      }
    } else {
      // Start recording without capturing playback or a previous upload.
      uploadReader.current?.abort();
      stopSpeech();
      setRecognizedText('');
      setTranslatedVoiceText('');
      setRecordDuration(0);
      playSound('click');

      const success = await recorder.start();
      if (!isCurrent()) { if (success) recorder.cancel(); return; }
      if (success) {
        setIsRecording(true);
      } else {
        setErrorMsg(t('vt.errMic'));
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const version = ++uploadVersion.current;
    requestController.current?.abort();
    recorder.cancel();
    setIsRecording(false);
    setRecordDuration(0);
    setWaveformData([]);
    uploadReader.current?.abort();
    stopSpeech();
    const isCurrent = () => uploadVersion.current === version;
    let stage: 'file' | 'transcribe' = 'file';

    setErrorMsg(null);
    setHistorySaveFailed(false);
    setIsTranscribing(true);
    setIsTranslating(false);
    setRecognizedText('');
    setTranslatedVoiceText('');
    playSound('click');

    const controller = new AbortController();
    requestController.current = controller;
    const deadline = setTimeout(() => controller.abort(), 120000);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        uploadReader.current = reader;
        reader.onload = () => {
          const content = typeof reader.result === 'string' ? reader.result.split(',')[1] : '';
          if (content) resolve(content);
          else reject(new Error('Empty audio file'));
        };
        reader.onerror = () => reject(reader.error || new Error('Audio file read failed'));
        reader.onabort = () => reject(new Error('Audio file read cancelled'));
        reader.readAsDataURL(file);
      });
      if (!isCurrent()) return;
      uploadReader.current = null;
      stage = 'transcribe';
      const { transcription, detectedLang } = await transcribeAudioRecording(base64, file.type || 'audio/mp3', controller.signal);
      if (!isCurrent()) return;
      setRecognizedText(transcription);
      setIsTranscribing(false);
      if (transcription) {
        setIsTranslating(true);
        const res = await executeTranslation({
          text: transcription,
          sourceLang: sourceLang === 'auto' ? detectedLang : sourceLang,
          targetLang,
          mode,
        }, learnerId, controller.signal);
        if (!isCurrent()) return;
        setTranslatedVoiceText(res.translatedText);
            if (res.historySaved === false) setHistorySaveFailed(true);
        playSound('correct');
        // The keyed result speech control owns automatic playback.
      }
    } catch (err) {
      if (!isCurrent()) return;
      setErrorMsg(isAiServiceUnavailable(err) ? t('ai.unavailable') : t(stage === 'file' ? 'vt.errFile' : 'vt.errTranscribe'));
      playSound('wrong');
    } finally {
      clearTimeout(deadline);
      if (isCurrent()) {
        requestController.current = null;
        uploadReader.current = null;
        setIsTranscribing(false);
        setIsTranslating(false);
      }
    }
  };



  const handleCopy = async () => {
    if (await copy(translatedVoiceText)) playSound('click');
  };

  return (
    <div className="space-y-6 text-right">
      {copyFailed && <p role="status" className="rounded-xl border border-amber-400/30 p-4 text-sm text-amber-200">{t('lw.copyFailed')}</p>}
      {historySaveFailed && <p role="status" className="rounded-xl border border-amber-400/30 p-4 text-sm leading-7 text-amber-200">{t('vocab.saveError')}</p>}
      {/* Voice Banner */}
      <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#41e7ff]" />
            <span>{t('vt.title')}</span>
          </h3>
          <p className="text-xs text-[#b9b6d5] mt-1">
            {t('vt.blurb')}
          </p>
        </div>

        <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white cursor-pointer transition-colors shrink-0">
          <Upload className="w-4 h-4 text-[#ffb84d]" />
          <span>{t('vt.upload')}</span>
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
          aria-label={isRecording ? t('vt.stopRecording') : t('vt.startRecording')}
        >
          {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        <span className="text-sm font-bold text-white mt-4 z-10">
          {isRecording ? `${t('vt.listening')} (${recordDuration} ${t('vt.seconds')})` : t('vt.tapToSpeak')}
        </span>
        <span className="text-xs text-[#b9b6d5]/60 mt-1 z-10">
          {isRecording ? t('vt.tapWhenDone') : t('vt.autoDetect')}
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
            <div className="flex flex-wrap items-start justify-between gap-3 text-xs text-[#b9b6d5]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>{t('vt.transcribedTitle')}</span>
              </span>
              <span className="text-[11px] text-[#41e7ff] bg-[#41e7ff]/10 px-2 py-0.5 rounded">
                {t('vt.speechSource')}
              </span>
            </div>

            {isTranscribing ? (
              <div className="py-6 text-center text-xs text-[#41e7ff] flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-[#ffb84d]" />
                <span>{t('vt.transcribing')}</span>
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
            <div className="flex flex-wrap items-start justify-between gap-3 text-xs text-[#b9b6d5]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>{t('vt.translatedTitle')}</span>
              </span>

              <div className="flex flex-wrap items-start gap-1">
                <LessonSpeechButton key={translatedVoiceText + targetLang} text={translatedVoiceText} language={targetLang} label={t('vt.listenTranslation')} iconOnly autoPlay disabled={!translatedVoiceText}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#41e7ff] transition-colors cursor-pointer disabled:opacity-30" />
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!translatedVoiceText}
                  title={t('vt.copyTranslation')}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#b9b6d5] hover:text-white transition-colors cursor-pointer disabled:opacity-30"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isTranslating ? (
              <div className="py-6 text-center text-xs text-[#a855f7] flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-[#41e7ff]" />
                <span>{t('vt.translating')}</span>
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
