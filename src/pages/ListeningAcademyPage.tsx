import React, { useState } from 'react';
import { PageRoute } from '../types';
import { LISTENING_TRACKS, ListeningTrack } from '../data/skillsAcademyData';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Sparkles,
  FileText,
  HelpCircle,
  PenTool,
} from 'lucide-react';

interface ListeningAcademyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ListeningAcademyPage: React.FC<ListeningAcademyPageProps> = ({ onNavigate }) => {
  const [selectedTrackIdx, setSelectedTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Dictation state
  const [dictationInput, setDictationInput] = useState('');
  const [dictationSubmitted, setDictationSubmitted] = useState(false);
  const [dictationCorrect, setDictationCorrect] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const track = LISTENING_TRACKS[selectedTrackIdx] || LISTENING_TRACKS[0];

  const handlePlayAudio = () => {
    playSound('click');
    setIsPlaying(true);
    speakEnglish(track.transcript);
    // Approximate duration
    setTimeout(() => {
      setIsPlaying(false);
    }, 12000);
  };

  const handleCheckDictation = () => {
    playSound('click');
    const cleanedInput = dictationInput.trim().toLowerCase().replace(/[.,!]/g, '');
    const cleanedTarget = track.dictationSentence.trim().toLowerCase().replace(/[.,!]/g, '');

    const isMatch = cleanedInput === cleanedTarget || cleanedTarget.includes(cleanedInput);
    setDictationSubmitted(true);
    setDictationCorrect(isMatch);

    if (isMatch) {
      playSound('correct');
      fireCelebration();
    } else {
      playSound('wrong');
    }
  };

  const handleAnswerQuiz = (qId: string, optIdx: number, correctIdx: number) => {
    if (quizAnswers[qId] !== undefined) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
    if (optIdx === correctIdx) {
      playSound('correct');
      fireCelebration();
    } else {
      playSound('wrong');
    }
  };

  return (
    <div className="space-y-10 pb-16 text-right">
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-gradient-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 left-10 w-80 h-80 bg-[#9b7bff]/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#9b7bff]/20 text-[#9b7bff] border border-[#9b7bff]/40 shadow-sm">
            <Headphones className="w-4 h-4" />
            <span>HINAWI LISTENING ACADEMY • استوديو الفهم السمعي والإملاء</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            أكاديمية الاستماع وفهم لكنات الإنجليزية 🎧
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            عوّد أذنك على الاستماع إلى الإنجليزية الحقيقية باللكنات البريطانية والأمريكية، مع تمارين الفهم والاستيعاب، وتحديات الإملاء (Dictation) لكتابة ما تسمعه بدقة متناهية.
          </p>
        </div>
      </section>

      {/* 1. TRACK SELECTOR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {LISTENING_TRACKS.map((t, idx) => (
          <button
            key={t.id}
            onClick={() => {
              playSound('click');
              setSelectedTrackIdx(idx);
              setShowTranscript(false);
              setDictationInput('');
              setDictationSubmitted(false);
              setQuizAnswers({});
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
              selectedTrackIdx === idx
                ? 'bg-gradient-to-r from-[#9b7bff] to-[#41e7ff] text-white font-black shadow-lg'
                : 'bg-white/5 text-[#dedbf4] hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>{t.titleAr}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 font-mono">
              {t.accent} • {t.level}
            </span>
          </button>
        ))}
      </div>

      {/* 2. AUDIO PLAYER & TRANSCRIPT CONTROLS */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ffd166] mb-1">
              <span>{track.category}</span>
              <span>•</span>
              <span className="en">{track.accent} Accent</span>
              <span>•</span>
              <span>مستوى {track.level}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{track.title}</h2>
          </div>

          {/* Speed & Transcript buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                playSound('click');
                setShowTranscript(prev => !prev);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#dedbf4] flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#41e7ff]" />
              <span>{showTranscript ? 'إخفاء النص المكتوب' : 'عرض النص الإنجليزي'}</span>
            </button>
          </div>
        </div>

        {/* Audio Visualizer & Player Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#09091a] to-[#121128] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={handlePlayAudio}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 shadow-xl shrink-0 ${
                isPlaying
                  ? 'bg-[#ff4f9a] text-white animate-pulse'
                  : 'bg-gradient-to-r from-[#41e7ff] to-[#9b7bff] text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>

            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{isPlaying ? 'جارٍ تشغيل المقطع الصوتي... 🔊' : 'جاهز للاستماع'}</span>
                {isPlaying && (
                  <span className="flex gap-1">
                    <span className="w-1 h-3 bg-[#41e7ff] animate-bounce" />
                    <span className="w-1 h-5 bg-[#9b7bff] animate-bounce delay-100" />
                    <span className="w-1 h-2 bg-[#ffd166] animate-bounce delay-200" />
                  </span>
                )}
              </div>
              <div className="text-xs text-[#b9b6d5]">المدة: {track.duration} • جودة استوديو واضحة</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                speakEnglish(track.transcript);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              إعادة التشغيل 🔄
            </button>
          </div>
        </div>

        {/* Transcript Accordion */}
        {showTranscript && (
          <div className="p-5 rounded-2xl bg-black/40 border border-[#41e7ff]/30 space-y-3">
            <div className="text-xs font-bold text-[#41e7ff] flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>النص الكامل للمقطع الصوتي (Transcript)</span>
            </div>
            <p className="en text-sm text-white leading-relaxed font-semibold">
              {track.transcript}
            </p>
            <p className="text-xs text-[#b9b6d5] leading-relaxed pt-2 border-t border-white/5">
              {track.transcriptAr}
            </p>
          </div>
        )}
      </section>

      {/* 3. DICTATION CHALLENGE & COMPREHENSION QUIZ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Dictation Box */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <PenTool className="w-5 h-5 text-[#ffd166]" />
              تحدي الإملاء الصوتي (Dictation Lab)
            </h3>
            <p className="text-xs text-[#b9b6d5]">
              استمع للجملة التالية واكتب ما سمعته بدقة لاختبار قدرتك على التقاط الكلمات:
            </p>
          </div>

          <button
            onClick={() => speakEnglish(track.dictationSentence)}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#ffd166] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>الاستماع إلى جملة الإملاء</span>
          </button>

          <div className="space-y-3">
            <textarea
              rows={3}
              value={dictationInput}
              onChange={e => {
                setDictationInput(e.target.value);
                setDictationSubmitted(false);
              }}
              placeholder="اكتب هنا الجملة الإنجليزية التي سمعتها..."
              className="en w-full p-3.5 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-[#b9b6d5]/50 text-sm focus:outline-none focus:border-[#ffd166]"
            />

            <button
              onClick={handleCheckDictation}
              disabled={!dictationInput.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer disabled:opacity-50"
            >
              فحص الإملاء والتحقق ✅
            </button>
          </div>

          {dictationSubmitted && (
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${
              dictationCorrect
                ? 'bg-[#c4ff55]/10 border-[#c4ff55]/40 text-[#c4ff55]'
                : 'bg-[#ff4f9a]/10 border-[#ff4f9a]/40 text-[#ff8bb9]'
            }`}>
              <div className="font-black text-sm">
                {dictationCorrect ? '🎉 إملاء سليم ومطابق تماماً!' : '💡 أوشكت على الحل الصحيح!'}
              </div>
              <div className="en font-bold text-white pt-1">
                الصواب: "{track.dictationSentence}"
              </div>
            </div>
          )}
        </div>

        {/* Listening Comprehension Quiz */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#41e7ff]" />
              أسئلة فهم المسموع (Comprehension)
            </h3>
            <p className="text-xs text-[#b9b6d5]">
              أجب عن الأسئلة المعتمدة على تفاصيل المقطع الصوتي:
            </p>
          </div>

          <div className="space-y-4">
            {track.comprehensionQuiz.map((q, qIdx) => {
              const answered = quizAnswers[q.id] !== undefined;
              const chosen = quizAnswers[q.id];

              return (
                <div key={q.id} className="p-4 rounded-2xl bg-[#09091a] border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-[#b9b6d5]">سؤال 0{qIdx + 1}:</div>
                  <p className="en text-sm font-bold text-white">{q.question}</p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = 'bg-white/5 hover:bg-white/10 border-white/10 text-white';
                      if (answered) {
                        if (optIdx === q.answer) {
                          btnStyle = 'bg-[#c4ff55]/20 border-[#c4ff55] text-[#c4ff55] font-black';
                        } else if (chosen === optIdx) {
                          btnStyle = 'bg-[#ff4f9a]/20 border-[#ff4f9a] text-[#ff4f9a]';
                        } else {
                          btnStyle = 'opacity-40 bg-white/5 border-white/5 text-[#b9b6d5]';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={answered}
                          onClick={() => handleAnswerQuiz(q.id, optIdx, q.answer)}
                          className={`en w-full p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {answered && optIdx === q.answer && (
                            <CheckCircle2 className="w-4 h-4 text-[#c4ff55]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {answered && (
                    <div className="p-2.5 rounded-xl bg-white/5 text-[11px] text-[#dedbf4]">
                      <strong className="text-[#ffd166]">التفسير: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </section>

    </div>
  );
};
