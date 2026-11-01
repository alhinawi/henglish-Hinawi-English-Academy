// ==============================================================================
// Henglish Academy (HENGLISH) - INTERACTIVE SENTENCE CARD
// Rich multimedia card with Egyptian/Standard Arabic, TTS, Pronunciation assessment,
// grammar explanations, SRS buttons, vocabulary saving, and AI practice
// ==============================================================================

import React, { useState } from 'react';
import { SentenceItem } from '../services/sentencesService';
import {
  toggleFavoriteSentence,
  isFavoriteSentence,
  toggleDifficultSentence,
  isDifficultSentence,
  reviewSentence,
  getSentenceSrsRecord,
} from '../services/sentenceSrsService';
import { speakText, getSavedVoiceSettings } from '../utils/voiceEngine';
import { playSound } from '../utils/audio';
import {
  Volume2,
  Volume1,
  Heart,
  Bookmark,
  Sparkles,
  Copy,
  Check,
  Mic,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Bot,
  AlertCircle,
  HelpCircle,
  Clock,
  Award,
} from 'lucide-react';

interface SentenceCardProps {
  sentence: SentenceItem;
  onPracticeWithAi?: (sentence: SentenceItem) => void;
  onAddToCollection?: (sentence: SentenceItem) => void;
  compact?: boolean;
}

export const SentenceCard: React.FC<SentenceCardProps> = ({
  sentence,
  onPracticeWithAi,
  onAddToCollection,
  compact = false,
}) => {
  const [showFusha, setShowFusha] = useState(false);
  const [showDetails, setShowDetails] = useState(!compact);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => isFavoriteSentence(sentence.id));
  const [isDifficult, setIsDifficult] = useState(() => isDifficultSentence(sentence.id));
  const [srsRecord, setSrsRecord] = useState(() => getSentenceSrsRecord(sentence.id));
  const [isRecording, setIsRecording] = useState(false);
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);
  const [speakingFeedback, setSpeakingFeedback] = useState<string | null>(null);

  // Play normal audio
  const handlePlayAudio = (slow: boolean = false) => {
    playSound('click');
    setIsPlayingAudio(true);
    const settings = getSavedVoiceSettings();
    speakText(sentence.english, {
      speed: slow ? 0.75 : settings.speed,
      gender: settings.gender,
      accent: settings.accent,
      onEnded: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  // Toggle favorite
  const handleToggleFavorite = () => {
    playSound('pop');
    const newState = toggleFavoriteSentence(sentence.id);
    setIsFavorite(newState);
  };

  // Toggle difficult
  const handleToggleDifficult = () => {
    playSound('click');
    const newState = toggleDifficultSentence(sentence.id);
    setIsDifficult(newState);
  };

  // Copy sentence text
  const handleCopy = () => {
    playSound('click');
    navigator.clipboard.writeText(sentence.english);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // SM-2 Review rating
  const handleRateSRS = (rating: 0 | 2 | 4 | 5) => {
    playSound('success');
    const rec = reviewSentence(sentence.id, rating);
    setSrsRecord(rec);
  };

  // Simulated / Web Speech Pronunciation Assessment
  const handleSimulatePronounce = () => {
    playSound('click');
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('ميزة الميكروفون والتعرف على الصوت تتطلب متصفحاً حديثاً يدعم Web Speech API.');
      return;
    }

    try {
      // @ts-expect-error - Web Speech API window fallback
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsRecording(true);
      setSpeakingFeedback('تحدث الآن بوضوح بالإنجليزية...');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const targetClean = sentence.english.toLowerCase().replace(/[^a-z0-9\s]/g, '');
        const transClean = transcript.replace(/[^a-z0-9\s]/g, '');

        setIsRecording(false);
        if (transClean === targetClean) {
          setSpeakingScore(100);
          setSpeakingFeedback('ممتاز! نطقك متطابق تماماً بنسبة 100% 🎯');
          playSound('success');
        } else {
          // Calculate rough word match
          const targetWords = targetClean.split(' ');
          const heardWords = transClean.split(' ');
          let matches = 0;
          targetWords.forEach(w => {
            if (heardWords.includes(w)) matches++;
          });
          const score = Math.round((matches / targetWords.length) * 100);
          setSpeakingScore(Math.max(60, score));
          setSpeakingFeedback(`سمعنا: "${transcript}" • دقة النطق: ${Math.max(60, score)}%`);
          playSound('click');
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setSpeakingFeedback('تعذر التقاط الصوت، يرجى التأكد من صلاحية الميكروفون والمحاولة مرة أخرى.');
      };

      recognition.start();
    } catch {
      setIsRecording(false);
      setSpeakingFeedback('تعذر بدء تشغيل الميكروفون في المتصفح.');
    }
  };

  // Level Badge Colors
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'A1': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'A2': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'B1': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'B2': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'C1': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'C2': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="rounded-3xl glass-panel border border-white/10 hover:border-white/20 transition-all p-5 sm:p-6 space-y-4 text-right group shadow-xl hover:shadow-2xl hover:shadow-purple-500/5 bg-[#151329]/80 backdrop-blur-xl">
      {/* Top Header: Level, Category, Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${getLevelBadgeColor(sentence.cefr)}`}>
            {sentence.cefr}
          </span>
          <span className="text-xs font-bold text-white/60 bg-white/5 px-2.5 py-1 rounded-xl border border-white/5">
            {sentence.subcategory}
          </span>
          <span className="text-[11px] font-semibold text-[#ffd166] bg-[#ffd166]/10 px-2 py-0.5 rounded-lg border border-[#ffd166]/20">
            {sentence.formality}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            title="حفظ في المفضلة"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'text-white/40 hover:text-rose-300 hover:bg-white/5'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Mark Difficult */}
          <button
            onClick={handleToggleDifficult}
            title="تمييز كجملة صعبة"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isDifficult
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-white/40 hover:text-amber-300 hover:bg-white/5'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
          </button>

          {/* Add to Collection */}
          {onAddToCollection && (
            <button
              onClick={() => onAddToCollection(sentence)}
              title="إضافة لمجموعة خاصة"
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="نسخ الجملة"
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Sentence Content */}
      <div className="space-y-3">
        {/* English Sentence */}
        <div className="flex items-start justify-between gap-3 text-left">
          <p className="text-lg sm:text-xl font-black text-white tracking-wide leading-relaxed selection:bg-purple-500/30">
            {sentence.english}
          </p>
          <div className="flex items-center gap-1 shrink-0 mt-1">
            {/* Play Normal Audio */}
            <button
              onClick={() => handlePlayAudio(false)}
              disabled={isPlayingAudio}
              title="استماع للنطق الطبيعي"
              className="w-10 h-10 rounded-xl bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center transition-all shadow-lg shadow-purple-500/25 cursor-pointer disabled:opacity-50"
            >
              <Volume2 className="w-5 h-5 fill-current" />
            </button>
            {/* Play Slow Audio (0.75x) */}
            <button
              onClick={() => handlePlayAudio(true)}
              disabled={isPlayingAudio}
              title="استماع بطيء (0.75x)"
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer disabled:opacity-50 text-xs font-bold"
            >
              <Volume1 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* IPA Pronunciation Guide */}
        <div className="text-left">
          <span className="text-xs font-mono text-purple-300/80 bg-purple-500/10 px-2.5 py-0.5 rounded-md inline-block border border-purple-500/20">
            {sentence.ipa}
          </span>
        </div>

        {/* Egyptian Arabic Translation */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span className="font-bold flex items-center gap-1.5 text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>المعنى بالعامية المصرية الدارجة:</span>
            </span>
            <button
              onClick={() => setShowFusha(!showFusha)}
              className="text-xs text-amber-300/80 hover:text-amber-200 underline cursor-pointer"
            >
              {showFusha ? 'إخفاء الفصحى' : 'عرض الفصحى'}
            </button>
          </div>
          <p className="text-base sm:text-lg font-bold text-white text-right leading-relaxed">
            {sentence.arabicEg}
          </p>

          {/* Standard Arabic (Fusha) Toggle */}
          {showFusha && (
            <div className="pt-2 border-t border-white/5 text-right">
              <span className="text-[11px] text-amber-300 block mb-0.5 font-bold">العربية الفصحى:</span>
              <p className="text-sm font-semibold text-white/80">{sentence.arabicFusha}</p>
            </div>
          )}
        </div>
      </div>

      {/* Speaking Pronunciation Record Feedback */}
      {speakingFeedback && (
        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1 text-right">
          <div className="flex items-center justify-between font-black text-blue-300">
            <span>تقييم النطق المباشر 🎙️</span>
            {speakingScore !== null && (
              <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white font-black">
                {speakingScore}%
              </span>
            )}
          </div>
          <p className="text-white/80">{speakingFeedback}</p>
        </div>
      )}

      {/* Expandable Details (Grammar, Vocabulary, Conversation Context) */}
      {showDetails && (
        <div className="space-y-3 pt-3 border-t border-white/10 text-xs">
          {/* Grammar Rule Highlight */}
          <div className="flex items-start gap-2 bg-purple-500/10 p-3 rounded-xl border border-purple-500/20 text-right">
            <BookOpen className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-black text-purple-300 block">القاعدة اللغوية:</span>
              <p className="text-white/80 font-medium">{sentence.grammar}</p>
            </div>
          </div>

          {/* Important Vocabulary Pills */}
          {sentence.vocabulary.length > 0 && (
            <div className="space-y-1.5 text-right">
              <span className="text-[11px] font-bold text-white/50 block">أهم المفردات اللغوية:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {sentence.vocabulary.map((vocab, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white/5 text-white/90 font-mono text-xs border border-white/10 hover:border-purple-400/50 transition-colors"
                  >
                    {vocab}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Example Conversation Dialogue */}
          {sentence.conversation && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2 text-left">
              <div className="flex items-center justify-between text-[11px] text-white/40 border-b border-white/5 pb-1">
                <span className="font-bold">CONVERSATION IN CONTEXT</span>
                <span>{sentence.conversation.context}</span>
              </div>
              <div className="space-y-1 font-mono text-xs">
                <p className="text-purple-300">
                  <span className="font-bold text-white/60">A: </span>
                  {sentence.conversation.speakerA}
                </p>
                <p className="text-cyan-300">
                  <span className="font-bold text-white/60">B: </span>
                  {sentence.conversation.speakerB}
                </p>
              </div>
            </div>
          )}

          {/* Related Alternative Sentences */}
          {sentence.relatedSentences && sentence.relatedSentences.length > 0 && (
            <div className="space-y-1 text-right">
              <span className="text-[11px] font-bold text-white/50 block">طرق بديلة للتعبير عن نفس المعنى:</span>
              <ul className="space-y-1 text-left">
                {sentence.relatedSentences.map((rel, idx) => (
                  <li key={idx} className="text-xs text-white/70 italic flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    <span>"{rel}"</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Card Footer: Interactive Actions & SRS Review */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10 flex-wrap">
        {/* Toggle Details Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-bold text-purple-300 hover:text-purple-200 flex items-center gap-1 cursor-pointer"
        >
          {showDetails ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>إخفاء التفاصيل</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              <span>إظهار الشرح والتفاصيل</span>
            </>
          )}
        </button>

        {/* Practice Tools */}
        <div className="flex items-center gap-2">
          {/* Record Microphone Button */}
          <button
            onClick={handleSimulatePronounce}
            disabled={isRecording}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isRecording ? 'استماع...' : 'تمرين نطق'}</span>
          </button>

          {/* Practice with AI */}
          {onPracticeWithAi && (
            <button
              onClick={() => onPracticeWithAi(sentence)}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>تدريب مع AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Spaced Repetition (SM-2) Quick Feedback Buttons */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs gap-1 flex-wrap">
        <span className="text-[11px] text-white/40 font-bold">مراجعة التكرار المتباعد (SM-2):</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleRateSRS(0)}
            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold cursor-pointer transition-colors"
          >
            نسيتها (0)
          </button>
          <button
            onClick={() => handleRateSRS(2)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold cursor-pointer transition-colors"
          >
            صعبة (2)
          </button>
          <button
            onClick={() => handleRateSRS(4)}
            className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-[11px] font-bold cursor-pointer transition-colors"
          >
            جيدة (4)
          </button>
          <button
            onClick={() => handleRateSRS(5)}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer transition-colors"
          >
            سهلة جداً (5)
          </button>
        </div>
      </div>
    </div>
  );
};
