// ==============================================================================
// Henglish Academy (HENGLISH) - REAL PRONUNCIATION ASSESSMENT VIEWER
// Phase 17: Genuine Microphone Audio Recording, Live Waveform, Phonetic Feedback
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { RealAudioRecorder, RecordingState, RecordedAudioData } from '../utils/audioRecorder';
import { WordAssessment, PronunciationAssessmentResult } from '../../api/speaking/assess';
import { speakEnglish, playSound, fireCelebration } from '../utils/audio';
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  Volume2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  X,
  Gauge,
  Activity,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface PronunciationAssessmentViewerProps {
  targetSentence: string;
  targetSentenceAr?: string;
  onAssessmentComplete?: (result: PronunciationAssessmentResult) => void;
}

export const PronunciationAssessmentViewer: React.FC<PronunciationAssessmentViewerProps> = ({
  targetSentence,
  targetSentenceAr,
  onAssessmentComplete,
}) => {
  const [recorder] = useState(() => new RealAudioRecorder());
  const [recordingState, setRecordingState] = useState<RecordingState>('IDLE');
  const [duration, setDuration] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<RecordedAudioData | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<PronunciationAssessmentResult | null>(null);
  const [selectedWord, setSelectedWord] = useState<WordAssessment | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [userAudioPlaying, setUserAudioPlaying] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    recorder.onStateChange = state => {
      setRecordingState(state);
    };

    recorder.onDurationTick = sec => {
      setDuration(sec);
    };

    recorder.onWaveformData = dataArray => {
      drawWaveform(dataArray);
    };

    return () => {
      recorder.cleanup();
      if (userAudioRef.current) {
        userAudioRef.current.pause();
      }
    };
  }, [recorder]);

  const drawWaveform = (dataArray: Uint8Array) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const barWidth = (width / dataArray.length) * 2.5;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
      const barHeight = (dataArray[i] / 255) * height;

      // Gradient color from cyan to pink
      const grad = ctx.createLinearGradient(0, height, 0, 0);
      grad.addColorStop(0, '#41e7ff');
      grad.addColorStop(1, '#ff4f9a');

      ctx.fillStyle = grad;
      ctx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

      x += barWidth;
      if (x > width) break;
    }
  };

  const handleStartRecording = async () => {
    playSound('click');
    setRecordedAudio(null);
    setAssessmentResult(null);
    setSelectedWord(null);

    const success = await recorder.start();
    if (!success) {
      playSound('wrong');
    }
  };

  const handleStopRecording = async () => {
    playSound('click');
    const audioData = await recorder.stop();
    if (!audioData) return;

    setRecordedAudio(audioData);
    await submitForAssessment(audioData);
  };

  const submitForAssessment = async (audioData: RecordedAudioData) => {
    setRecordingState('EVALUATING');
    try {
      const response = await fetch('/api/speaking/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: audioData.base64,
          mimeType: audioData.mimeType,
          targetSentence,
          durationSeconds: audioData.durationSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error(`Assessment API error: ${response.status}`);
      }

      const result: PronunciationAssessmentResult = await response.json();
      setAssessmentResult(result);
      setRecordingState('COMPLETED');
      playSound('correct');

      // Persist student evaluation record for analytics & teacher review
      try {
        const historyItem = {
          id: `eval-${Date.now()}`,
          studentName: 'الطالب الحالي (Current Learner)',
          timestamp: new Date().toISOString(),
          targetSentence,
          overallScore: result.overallScore,
          scores: {
            pronunciation: result.pronunciationScore,
            fluency: result.fluencyScore,
            accuracy: result.accuracyScore,
            completeness: result.completenessScore,
          },
          mispronouncedCount: result.problematicSounds?.length || 0,
          wpm: result.wordsPerMinute,
          phoneticTipAr: result.recommendationsAr?.[0] || 'استمر في التكرار والمحاكاة لضبط مخارج الحروف.',
        };
        const existing = JSON.parse(localStorage.getItem('henglish_speaking_evaluations_v2') || '[]');
        localStorage.setItem('henglish_speaking_evaluations_v2', JSON.stringify([historyItem, ...existing.slice(0, 49)]));
      } catch {}

      if (result.overallScore >= 80) {
        fireCelebration();
      }
      if (onAssessmentComplete) {
        onAssessmentComplete(result);
      }
    } catch (err) {
      console.error('Assessment failed:', err);
      setRecordingState('EVALUATION_FAILED');
      playSound('wrong');
    }
  };

  const handlePlayUserAudio = () => {
    if (!recordedAudio) return;
    if (userAudioRef.current) {
      userAudioRef.current.pause();
    }

    const audio = new Audio(recordedAudio.blobUrl);
    userAudioRef.current = audio;
    audio.playbackRate = playbackSpeed;

    setUserAudioPlaying(true);
    audio.play();
    audio.onended = () => setUserAudioPlaying(false);
    audio.onerror = () => setUserAudioPlaying(false);
  };

  const handlePlayNativeAudio = (slow: boolean = false) => {
    playSound('click');
    speakEnglish(targetSentence);
  };

  const handleReset = () => {
    playSound('click');
    recorder.cleanup();
    setRecordingState('IDLE');
    setRecordedAudio(null);
    setAssessmentResult(null);
    setSelectedWord(null);
    setDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 space-y-6 text-right">
      
      {/* Target Sentence Banner */}
      <div className="p-5 rounded-2xl bg-linear-to-r from-[#171632] via-[#121128] to-[#0c0b20] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#ffd166] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            الجملة المستهدفة للتدريب والنطق:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePlayNativeAudio(false)}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="استمع لصوت المعلم الأصلي"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#41e7ff]" />
              <span>استمع للأصل</span>
            </button>
            <button
              onClick={() => handlePlayNativeAudio(true)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-[#dedbf4] text-xs font-bold cursor-pointer transition-colors"
              title="استمع ببطء 0.75x"
            >
              <span>0.75x</span>
            </button>
          </div>
        </div>

        <p dir="ltr" className="text-xl sm:text-2xl font-black text-white text-left font-['Outfit',sans-serif] tracking-wide leading-relaxed">
          "{targetSentence}"
        </p>

        {targetSentenceAr && (
          <p className="text-xs sm:text-sm text-[#b9b6d5] leading-relaxed">
            💡 المعنى: {targetSentenceAr}
          </p>
        )}
      </div>

      {/* Recording Control & Waveform Station */}
      <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center space-y-4 text-center">
        
        {/* Waveform Canvas */}
        <div className="relative w-full max-w-md h-16 bg-[#0c0b20] rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
          {recordingState === 'RECORDING' ? (
            <canvas ref={canvasRef} width={400} height={64} className="w-full h-full" />
          ) : (
            <div className="text-xs font-bold text-[#b9b6d5] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#41e7ff]" />
              <span>
                {recordingState === 'IDLE' && 'الميكروفون في وضع الاستعداد - اضغط الزر للتسجيل'}
                {recordingState === 'REQUESTING_PERMISSION' && 'جاري طلب إذن الميكروفون من المتصفح...'}
                {recordingState === 'PROCESSING' && 'جاري تجهيز مقطع الصوت المسجل...'}
                {recordingState === 'EVALUATING' && 'الذكاء الاصطناعي يحلل الصوت ويقيّم مخارج الحروف...'}
                {recordingState === 'COMPLETED' && 'اكتمل التحليل الصوتي بنجاح!'}
                {recordingState === 'PERMISSION_DENIED' && '⚠️ تم رفض إذن الميكروفون. يرجى تفعيله من إعدادات المتصفح.'}
                {recordingState === 'MICROPHONE_UNAVAILABLE' && '⚠️ لم يتم العثور على ميكروفون متصل بالجهاز.'}
              </span>
            </div>
          )}
        </div>

        {/* Live Timer */}
        {recordingState === 'RECORDING' && (
          <div className="flex items-center gap-2 text-rose-400 font-mono font-bold text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span>{formatTime(duration)}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {recordingState !== 'RECORDING' ? (
            <button
              onClick={handleStartRecording}
              disabled={recordingState === 'REQUESTING_PERMISSION' || recordingState === 'EVALUATING'}
              className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-[#ff4f9a] to-[#9b7bff] text-white font-black text-sm shadow-xl hover:brightness-110 flex items-center gap-2.5 cursor-pointer transition-all duration-300"
            >
              <Mic className="w-5 h-5" />
              <span>{recordingState === 'COMPLETED' ? 'تسجيل محاولة جديدة 🎙️' : 'اضغط وسجّل بصوتك الآن 🎙️'}</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-xl flex items-center gap-2.5 cursor-pointer transition-all duration-300 animate-pulse"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>إنهاء التسجيل وتقييم النطق ⏹️</span>
            </button>
          )}

          {recordedAudio && recordingState !== 'RECORDING' && (
            <>
              <button
                onClick={handlePlayUserAudio}
                disabled={userAudioPlaying}
                className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                title="استمع لتسجيلك الصوتي"
              >
                <Play className={`w-4 h-4 ${userAudioPlaying ? 'text-[#c4ff55]' : 'text-white'}`} />
                <span>{userAudioPlaying ? 'جاري التشغيل...' : 'صوتك المسجل'}</span>
              </button>

              <button
                onClick={handleReset}
                className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-[#b9b6d5] hover:text-white border border-white/10 cursor-pointer transition-colors"
                title="إعادة التعيين"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Real Assessment Report & Word-by-Word Interactive Feedback */}
      {assessmentResult && (
        <div className="space-y-6 pt-2">
          
          {/* Score Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-linear-to-br from-[#1b193d] to-[#121128] border border-[#ffd166]/40 text-center space-y-1">
              <span className="text-[11px] font-bold text-[#ffd166]">الدرجة الكلية</span>
              <div className="text-3xl font-black text-white font-mono">{assessmentResult.overallScore}%</div>
              <span className="text-[10px] text-[#c4ff55] font-bold">
                {assessmentResult.overallScore >= 85 ? 'ممتاز جداً 🌟' : assessmentResult.overallScore >= 70 ? 'جيد جداً 👍' : 'يحتاج تدريب 💪'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <span className="text-[11px] font-bold text-[#b9b6d5]">النطق (Pronunciation)</span>
              <div className="text-xl font-bold text-[#41e7ff] font-mono">{assessmentResult.pronunciationScore}%</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <span className="text-[11px] font-bold text-[#b9b6d5]">الطلاقة (Fluency)</span>
              <div className="text-xl font-bold text-[#ff4f9a] font-mono">{assessmentResult.fluencyScore}%</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <span className="text-[11px] font-bold text-[#b9b6d5]">الدقة (Accuracy)</span>
              <div className="text-xl font-bold text-[#c4ff55] font-mono">{assessmentResult.accuracyScore}%</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
              <span className="text-[11px] font-bold text-[#b9b6d5]">السرعة (Pace)</span>
              <div className="text-xl font-bold text-[#ffd166] font-mono">{assessmentResult.wordsPerMinute} <span className="text-xs font-normal">WPM</span></div>
            </div>
          </div>

          {/* Word-by-Word Interactive Pills */}
          <div className="p-5 rounded-2xl bg-[#0e0d24] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#c4ff55]" />
                التحليل الصوتي التفصيلي لكل كلمة (اضغط على أي كلمة لمعاينة مخارج الحروف):
              </span>
              <div className="flex items-center gap-3 text-[11px] text-[#b9b6d5]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> ممتاز</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> مقبول</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> يحتاج تصحيح</span>
              </div>
            </div>

            <div dir="ltr" className="flex flex-wrap gap-2 text-left pt-2 font-['Outfit',sans-serif]">
              {assessmentResult.words.map((w, idx) => {
                const isCorrect = w.status === 'correct';
                const isWarning = w.status === 'needs-improvement';
                const isSelected = selectedWord?.word === w.word;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      playSound('click');
                      setSelectedWord(w);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-sm sm:text-base border transition-all cursor-pointer flex items-center gap-1.5 ${
                      isCorrect
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                        : isWarning
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                    } ${isSelected ? 'ring-2 ring-white scale-105' : ''}`}
                  >
                    <span>{w.word}</span>
                    <span className="text-[10px] opacity-75 font-mono">{w.expectedIpa}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Word Deep Phonetic Modal / Card */}
          {selectedWord && (
            <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-[#171632] to-[#1a1738] border border-[#ffd166]/40 space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span dir="ltr" className="text-lg font-black text-white font-['Outfit',sans-serif]">
                    {selectedWord.word}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-[#ffd166]">
                    {selectedWord.expectedIpa}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="p-1 rounded text-[#b9b6d5] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[#b9b6d5]">تقييم الكلمة:</span>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${selectedWord.score >= 85 ? 'bg-emerald-400' : selectedWord.score >= 65 ? 'bg-amber-400' : 'bg-rose-400'}`} />
                    <span>{selectedWord.score >= 85 ? 'نطق متقن وأصيل' : selectedWord.score >= 65 ? 'نطق مفهوم مع لكنة خفيفة' : 'يحتاج تكرار وتدريب مخارج'} ({selectedWord.score}%)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-start sm:justify-end">
                  <button
                    onClick={() => {
                      playSound('click');
                      speakEnglish(selectedWord.word);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[#41e7ff]" />
                    <span>استمع لنطق الكلمة منفرداً</span>
                  </button>
                </div>
              </div>

              {selectedWord.phoneticTipAr && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-[#ffd166] leading-relaxed">
                  💡 <strong>نصيحة هناوي للنطق بالمصري:</strong> {selectedWord.phoneticTipAr}
                </div>
              )}
            </div>
          )}

          {/* Recommendations List */}
          {assessmentResult.recommendationsAr.length > 0 && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-bold text-[#ffd166] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                توصيات مخصصة لتحسين نطقك في المحاولة القادمة:
              </span>
              <ul className="text-xs text-[#dedbf4] space-y-1.5 pr-4 list-disc">
                {assessmentResult.recommendationsAr.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
