// ==============================================================================
// Henglish Academy (HENGLISH) - LEARN ENGLISH THROUGH MOVIES SMART STUDIO PLAYER
// Official YouTube IFrame Player with synchronized bilingual Egyptian Arabic subtitles,
// interactive word lookup, scene-based quizzes, vocabulary extraction, and echo speaking mode.
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { MovieSceneItem, TimedSubtitle, SubtitleWord } from '../data/movieScenesData';
import { speakText } from '../utils/voiceEngine';
import { playSound } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Volume2,
  Mic,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Clock,
  Video,
  Languages,
  ChevronRight,
  Eye,
  EyeOff,
  Flame,
  Info,
} from 'lucide-react';

interface MoviePlayerStudioProps {
  scene: MovieSceneItem;
  onBackToSearch?: () => void;
}

export const MoviePlayerStudio: React.FC<MoviePlayerStudioProps> = ({ scene, onBackToSearch }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState<number>(scene.startTime);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 0.75 | 1.0>(1.0);
  const [isLoopingCurrentLine, setIsLoopingCurrentLine] = useState(false);
  const [activeSubtitleIndex, setActiveSubtitleIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'transcript' | 'vocabulary' | 'quizzes' | 'echo'>('transcript');
  const [selectedWord, setSelectedWord] = useState<SubtitleWord | null>(null);
  const [savedWords, setSavedWords] = useState<string[]>([]);
  const [showFushaSubtitles, setShowFushaSubtitles] = useState(false);

  // Quiz state
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Echo Speaking state
  const [echoLineIdx, setEchoLineIdx] = useState(0);
  const [isEchoRecording, setIsEchoRecording] = useState(false);
  const [echoFeedback, setEchoFeedback] = useState<string | null>(null);
  const [echoScore, setEchoScore] = useState<number | null>(null);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<number | null>(null);

  // Build secure YouTube embed URL with autoplay, start time, controls, enablejsapi
  const embedUrl = `https://www.youtube-nocookie.com/embed/${scene.youtubeId}?enablejsapi=1&autoplay=${
    isPlaying ? 1 : 0
  }&start=${Math.floor(currentTime)}&origin=${encodeURIComponent(
    typeof window !== 'undefined' ? window.location.origin : ''
  )}`;

  // Simulated player time tracker for subtitle sync
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.5 * playbackSpeed;

          // If looping active line
          if (isLoopingCurrentLine && scene.subtitles[activeSubtitleIndex]) {
            const curSub = scene.subtitles[activeSubtitleIndex];
            if (next >= curSub.end) {
              return curSub.start;
            }
          }

          // Stop at scene end
          if (next >= scene.endTime) {
            setIsPlaying(false);
            return scene.startTime;
          }
          return next;
        });
      }, 500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, isLoopingCurrentLine, activeSubtitleIndex, scene]);

  // Synchronize active subtitle line with current time
  useEffect(() => {
    const idx = scene.subtitles.findIndex(sub => currentTime >= sub.start && currentTime <= sub.end);
    if (idx !== -1 && idx !== activeSubtitleIndex) {
      setActiveSubtitleIndex(idx);
    }
  }, [currentTime, scene.subtitles, activeSubtitleIndex]);

  // Jump to specific subtitle time
  const handleJumpToSubtitle = (sub: TimedSubtitle, idx: number) => {
    playSound('click');
    setCurrentTime(sub.start);
    setActiveSubtitleIndex(idx);
    setIsPlaying(true);
  };

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    playSound('click');
    setIsPlaying(!isPlaying);
  };

  // Speed changer
  const handleSpeedChange = (speed: 0.5 | 0.75 | 1.0) => {
    playSound('click');
    setPlaybackSpeed(speed);
  };

  // Word Click Handler for interactive vocabulary lookup
  const handleWordClick = (word: SubtitleWord) => {
    playSound('pop');
    setSelectedWord(word);
    speakText(word.word, { speed: 0.92 });
  };

  // Save word to vocabulary deck
  const handleSaveWord = (wordStr: string) => {
    playSound('success');
    if (!savedWords.includes(wordStr)) {
      setSavedWords([...savedWords, wordStr]);
    }
  };

  // Echo Speaking Recorder
  const handleStartEcho = (targetSentence: string) => {
    playSound('click');
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('ميزة الميكروفون تتطلب متصفحاً حديثاً يدعم Web Speech API.');
      return;
    }

    try {
      // @ts-expect-error - Web Speech API window fallback
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsEchoRecording(true);
      setEchoFeedback('ردد الآن بصوتك وراء الممثل...');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const targetClean = targetSentence.toLowerCase().replace(/[^a-z0-9\s]/g, '');
        const transClean = transcript.replace(/[^a-z0-9\s]/g, '');

        setIsEchoRecording(false);
        if (transClean === targetClean) {
          setEchoScore(100);
          setEchoFeedback('رائع جداً! تقمصت نطق الممثل بنسبة 100% 🌟');
          playSound('success');
        } else {
          const targetWords = targetClean.split(' ');
          const heardWords = transClean.split(' ');
          let matches = 0;
          targetWords.forEach(w => {
            if (heardWords.includes(w)) matches++;
          });
          const score = Math.max(65, Math.round((matches / targetWords.length) * 100));
          setEchoScore(score);
          setEchoFeedback(`سمعنا: "${transcript}" • دقة النطق والمحاكاة: ${score}%`);
          playSound('click');
        }
      };

      recognition.onerror = () => {
        setIsEchoRecording(false);
        setEchoFeedback('تعذر التقاط الصوت، تأكد من عمل الميكروفون وحاول ثانية.');
      };

      recognition.start();
    } catch {
      setIsEchoRecording(false);
      setEchoFeedback('تعذر تشغيل الميكروفون في المتصفح.');
    }
  };

  return (
    <div className="space-y-6 text-right selection:bg-purple-500/30">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 flex-wrap">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Video className="w-3.5 h-3.5" />
            <span>LEARN FROM MOVIES STUDIO • ستوديو السينما التعليمي</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>{scene.movieTitle} ({scene.releaseYear}) 🎬</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/60">
            {scene.sceneTitle} • إخراج: {scene.director} • تصنيف: {scene.genre}
          </p>
        </div>

        {onBackToSearch && (
          <button
            onClick={onBackToSearch}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer flex items-center gap-2"
          >
            <span>العودة لنتائج البحث</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Studio Grid: Desktop Split (Video + Transcripts) / Mobile Stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main Column: Video Player & Controls (7 Cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Responsive 16:9 Video Box */}
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-black/80 border border-white/15 shadow-2xl">
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={`${scene.movieTitle} Scene`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* Interactive Player Controls Bar */}
          <div className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between gap-3 flex-wrap bg-[#151329]/90 backdrop-blur-xl">
            {/* Play/Pause & Replay */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlay}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'إيقاف مؤقت' : 'تشغيل المقطع'}</span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setCurrentTime(scene.startTime);
                  setIsPlaying(true);
                }}
                title="إعادة المشهد من البداية"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Loop Current Subtitle Line */}
              <button
                onClick={() => {
                  playSound('click');
                  setIsLoopingCurrentLine(!isLoopingCurrentLine);
                }}
                title="تكرار الجملة الحالية باستمرار للإتقان"
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isLoopingCurrentLine
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>تكرار الجملة</span>
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-white/40 ml-1 font-bold">السرعة:</span>
              {[0.5, 0.75, 1.0].map(s => (
                <button
                  key={s}
                  onClick={() => handleSpeedChange(s as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    playbackSpeed === s
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Current Subtitle Spotlight Card */}
          {scene.subtitles[activeSubtitleIndex] && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#181333] to-[#141226] border border-purple-500/30 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-xs text-purple-300">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>الجملة الجاري نطقها في المشهد:</span>
                </span>
                <span className="font-mono text-white/40">
                  {scene.subtitles[activeSubtitleIndex].start}s - {scene.subtitles[activeSubtitleIndex].end}s
                </span>
              </div>

              {/* English Dialogue with Interactive Clickable Words */}
              <div className="text-left leading-loose">
                <p className="text-lg sm:text-xl font-black text-white">
                  {scene.subtitles[activeSubtitleIndex].en.split(' ').map((wordRaw, wIdx) => {
                    const clean = wordRaw.toLowerCase().replace(/[^a-z]/g, '');
                    const kw = scene.subtitles[activeSubtitleIndex].keyWords.find(
                      k => k.word.toLowerCase() === clean
                    );
                    return (
                      <span
                        key={wIdx}
                        onClick={() =>
                          kw
                            ? handleWordClick(kw)
                            : handleWordClick({
                                word: clean,
                                ipa: `/${clean}/`,
                                meaningAr: 'كلمة في المشهد',
                                meaningEn: 'context word',
                              })
                        }
                        className={`inline-block mr-1.5 transition-all cursor-pointer hover:underline ${
                          kw
                            ? 'text-amber-300 font-black hover:text-amber-200 bg-amber-400/10 px-1 rounded'
                            : 'hover:text-purple-300'
                        }`}
                      >
                        {wordRaw}
                      </span>
                    );
                  })}
                </p>
              </div>

              {/* Egyptian Arabic Translation */}
              <div className="pt-2 border-t border-white/10 text-right space-y-1">
                <p className="text-base sm:text-lg font-bold text-white/95">
                  "{scene.subtitles[activeSubtitleIndex].arEg}"
                </p>
                {showFushaSubtitles && (
                  <p className="text-xs text-white/60 italic">
                    الفصحى: "{scene.subtitles[activeSubtitleIndex].arFusha}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Interactive Word Inspector Modal / Card */}
          {selectedWord && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-right flex-wrap">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-amber-300">{selectedWord.word}</span>
                  <span className="text-xs font-mono text-white/60">{selectedWord.ipa}</span>
                  <button
                    onClick={() => speakText(selectedWord.word, { speed: 0.92 })}
                    className="p-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs font-bold text-white/90">
                  المعنى بالعامية المصرية: {selectedWord.meaningAr}
                </p>
                <p className="text-[11px] text-white/60">English: {selectedWord.meaningEn}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSaveWord(selectedWord.word)}
                  disabled={savedWords.includes(selectedWord.word)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    savedWords.includes(selectedWord.word)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-500 text-white shadow-md shadow-amber-500/25 hover:bg-amber-400'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{savedWords.includes(selectedWord.word) ? 'محفوظة في الكلمات' : 'حفظ في المفردات'}</span>
                </button>
                <button
                  onClick={() => setSelectedWord(null)}
                  className="text-xs text-white/40 hover:text-white px-2 py-1 cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Tabs (Transcript, Vocabulary, Quizzes, Echo) (5 Cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tab Selector */}
          <div className="grid grid-cols-4 gap-1 p-1.5 rounded-2xl bg-white/5 border border-white/10">
            {[
              { id: 'transcript', label: 'السيناريو', icon: Languages },
              { id: 'vocabulary', label: 'المصطلحات', icon: Sparkles },
              { id: 'quizzes', label: 'الاختبار', icon: HelpCircle },
              { id: 'echo', label: 'تحدي النطق', icon: Mic },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSound('click');
                    setActiveTab(tab.id as any);
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: SYNCHRONIZED INTERACTIVE TRANSCRIPT */}
          {activeTab === 'transcript' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-white/50 px-1">
                <span>اضغط على أي جملة للانتقال إليها فوراً في الفيديو:</span>
                <button
                  onClick={() => setShowFushaSubtitles(!showFushaSubtitles)}
                  className="text-purple-300 hover:text-purple-200 underline cursor-pointer"
                >
                  {showFushaSubtitles ? 'إخفاء الفصحى' : 'عرض الفصحى'}
                </button>
              </div>

              <div className="max-h-[500px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
                {scene.subtitles.map((sub, idx) => {
                  const isActive = activeSubtitleIndex === idx;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => handleJumpToSubtitle(sub, idx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-right space-y-1.5 ${
                        isActive
                          ? 'bg-purple-600/25 border-purple-500 shadow-lg shadow-purple-500/10'
                          : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-white/40">
                        <span className="font-bold text-purple-300">{sub.speaker || 'Actor'}</span>
                        <span className="font-mono">{sub.start}s - {sub.end}s</span>
                      </div>
                      <p className="text-sm font-bold text-white text-left leading-relaxed">
                        {sub.en}
                      </p>
                      <p className="text-xs font-semibold text-white/80">
                        "{sub.arEg}"
                      </p>
                      {showFushaSubtitles && (
                        <p className="text-[11px] text-white/50 italic">
                          "{sub.arFusha}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: EXTRACTED SCENE VOCABULARY & IDIOMS */}
          {activeTab === 'vocabulary' && (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/70">
                المصطلحات والتعبيرات الدارجة المستخلصة من هذا المشهد مع المعادل المصري:
              </div>

              {scene.vocabulary.map((vocab, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#161329] border border-white/10 space-y-2 text-right"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {vocab.type.toUpperCase()}
                    </span>
                    <h4 className="text-base font-black text-white text-left">{vocab.term}</h4>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-white/90 font-bold">
                      المعنى: {vocab.meaningAr}
                    </p>
                    <p className="text-amber-300 font-semibold">
                      المعادل في العامية المصرية: "{vocab.egyptianEquivalent}"
                    </p>
                    <p className="text-white/50 text-left italic">
                      "{vocab.exampleInScene}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SCENE-BASED QUIZZES */}
          {activeTab === 'quizzes' && (
            <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-5 text-right bg-[#161329]">
              {scene.quizzes.length === 0 ? (
                <p className="text-xs text-white/60 text-center py-6">لا توجد اختبارات لهذا المشهد حالياً.</p>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs font-bold text-white/50 border-b border-white/10 pb-2">
                    <span>اختبار فهم المشهد السينمائي</span>
                    <span>سؤال {currentQuizIdx + 1} من {scene.quizzes.length}</span>
                  </div>

                  {(() => {
                    const q = scene.quizzes[currentQuizIdx] || scene.quizzes[0];
                    return (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h4 className="text-sm sm:text-base font-black text-white text-left">
                            {q.questionEn}
                          </h4>
                          <p className="text-xs text-amber-300 font-bold">
                            {q.questionAr}
                          </p>
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedQuizOption === oIdx;
                            const isCorrect = oIdx === q.correctIndex;
                            let style = 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10';

                            if (quizSubmitted) {
                              if (isCorrect) {
                                style = 'bg-emerald-500/25 text-emerald-200 border-emerald-500 font-black';
                              } else if (isSelected && !isCorrect) {
                                style = 'bg-rose-500/25 text-rose-200 border-rose-500 line-through';
                              }
                            } else if (isSelected) {
                              style = 'bg-purple-600 text-white border-purple-500 shadow-md';
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  if (!quizSubmitted) {
                                    playSound('click');
                                    setSelectedQuizOption(oIdx);
                                  }
                                }}
                                className={`w-full p-3 rounded-xl border text-xs sm:text-sm text-left transition-all cursor-pointer font-medium ${style}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation when submitted */}
                        {quizSubmitted && (
                          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs">
                            <span className="font-bold text-purple-300 block">شرح الإجابة النموذجية:</span>
                            <p className="text-white/80 leading-relaxed">{q.explanationAr}</p>
                          </div>
                        )}

                        {/* Submit / Next Button */}
                        <div className="pt-2 flex items-center justify-between">
                          {!quizSubmitted ? (
                            <button
                              onClick={() => {
                                if (selectedQuizOption === null) return;
                                setQuizSubmitted(true);
                                if (selectedQuizOption === q.correctIndex) {
                                  playSound('success');
                                  setQuizScore(s => s + 1);
                                } else {
                                  playSound('error');
                                }
                              }}
                              disabled={selectedQuizOption === null}
                              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all shadow-md cursor-pointer disabled:opacity-40"
                            >
                              تأكيد الإجابة
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                playSound('click');
                                setQuizSubmitted(false);
                                setSelectedQuizOption(null);
                                setCurrentQuizIdx(idx => (idx + 1) % scene.quizzes.length);
                              }}
                              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs transition-all shadow-md cursor-pointer"
                            >
                              السؤال التالي
                            </button>
                          )}
                          <span className="text-xs font-bold text-white/50">
                            النتيجة: {quizScore} / {scene.quizzes.length}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}

          {/* TAB 4: ECHO SPEAKING PRONUNCIATION MODE */}
          {activeTab === 'echo' && (
            <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-5 text-right bg-[#161329]">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  تحدي محاكاة نطق الممثل • Echo Speaking
                </span>
                <h4 className="text-sm font-bold text-white">
                  استمع للجملة الأيقونية من المشهد ثم اضغط على الميكروفون وسجل بصوتك لمحاكاتها:
                </h4>
              </div>

              {scene.speakingLines && scene.speakingLines.length > 0 && (
                <div className="space-y-4">
                  {/* Active target line */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-2">
                    <p className="text-base sm:text-lg font-black text-white text-left">
                      "{scene.speakingLines[echoLineIdx].en}"
                    </p>
                    <p className="text-xs text-amber-300 font-bold">
                      المعنى: "{scene.speakingLines[echoLineIdx].arEg}"
                    </p>
                  </div>

                  {/* Actions: Listen & Record */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => speakText(scene.speakingLines[echoLineIdx].en, { speed: 0.92 })}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/15 cursor-pointer flex items-center gap-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>استمع لنطق الجملة</span>
                    </button>

                    <button
                      onClick={() => handleStartEcho(scene.speakingLines[echoLineIdx].en)}
                      disabled={isEchoRecording}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                        isEchoRecording
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      <span>{isEchoRecording ? 'جاري الاستماع...' : 'سجل بصوتك الآن'}</span>
                    </button>
                  </div>

                  {/* Feedback Box */}
                  {echoFeedback && (
                    <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-1 text-xs">
                      <div className="flex items-center justify-between font-black text-blue-300">
                        <span>نتيجة المحاكاة الصوتية:</span>
                        {echoScore !== null && (
                          <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white font-black">
                            {echoScore}%
                          </span>
                        )}
                      </div>
                      <p className="text-white/80">{echoFeedback}</p>
                    </div>
                  )}

                  {/* Next Speaking Line Switcher */}
                  {scene.speakingLines.length > 1 && (
                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={() => {
                          playSound('click');
                          setEchoLineIdx(idx => (idx + 1) % scene.speakingLines.length);
                          setEchoFeedback(null);
                          setEchoScore(null);
                        }}
                        className="text-xs text-purple-300 hover:text-purple-200 underline cursor-pointer"
                      >
                        جملة أيقونية أخرى من المشهد ({echoLineIdx + 1}/{scene.speakingLines.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
