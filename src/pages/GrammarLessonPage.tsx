import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ALL_GRAMMAR_RULES, GrammarRuleItem } from '../data/allGrammarRules';
import { GRAMMAR_VIDEO_RESOURCES } from '../data/videoResourcesData';
import { YouTubeVideoPlayer } from '../components/YouTubeVideoPlayer';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
import {
  GraduationCap,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  ArrowRight,
  Printer,
  Download,
  Flame,
  Check,
  X,
  Clock,
  Layers,
  MessageSquare,
  Award,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GrammarLessonPageProps {
  ruleId: string;
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  onMarkComplete?: (ruleId: string) => void;
  isCompleted?: boolean;
}

export const GrammarLessonPage: React.FC<GrammarLessonPageProps> = ({
  ruleId,
  onNavigate,
  onMarkComplete,
  isCompleted = false,
}) => {
  const rule: GrammarRuleItem = ALL_GRAMMAR_RULES.find(r => r.id === ruleId) || ALL_GRAMMAR_RULES[0];
  const ruleIndex = ALL_GRAMMAR_RULES.findIndex(r => r.id === rule.id);
  const prevRule = ruleIndex > 0 ? ALL_GRAMMAR_RULES[ruleIndex - 1] : null;
  const nextRule = ruleIndex < ALL_GRAMMAR_RULES.length - 1 ? ALL_GRAMMAR_RULES[ruleIndex + 1] : null;

  // State for active tab in detailed structures
  const [activeStructureTab, setActiveStructureTab] = useState<'affirmative' | 'negative' | 'question' | 'spelling'>('affirmative');

  // Guided practice interactive exercise state
  const [selectedExerciseAnswers, setSelectedExerciseAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});

  // Mini quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});

  // Personal notes
  const [userNote, setUserNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  const videoResources = GRAMMAR_VIDEO_RESOURCES[rule.id] || [];

  const handleSelectQuiz = (qIdx: number, optIdx: number, correctIdx: number) => {
    if (quizAnswers[qIdx] !== undefined) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    if (optIdx === correctIdx) {
      playSound('correct');
      fireCelebration();
    } else {
      playSound('wrong');
    }
  };

  const handleComplete = () => {
    playSound('correct');
    fireCelebration();
    if (onMarkComplete) {
      onMarkComplete(rule.id);
    }
  };

  const handlePrint = () => {
    playSound('click');
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-right">
      
      {/* 1. TOP BREADCRUMBS & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <nav aria-label="مسار التنقل" className="flex items-center gap-2 text-xs text-[#b9b6d5] font-semibold flex-wrap">
          <button
            onClick={() => { playSound('click'); onNavigate('dashboard'); }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            الرئيسية
          </button>
          <span>/</span>
          <button
            onClick={() => { playSound('click'); onNavigate('grammar'); }}
            className="hover:text-white transition-colors cursor-pointer"
          >
            أكاديمية الجرامر
          </button>
          <span>/</span>
          <span className="text-[#ffd166] font-bold">{rule.titleEn}</span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#dedbf4] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="طباعة أو حفظ ملخص الدرس كملف PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#ffd166]" />
            <span>طباعة الملخص</span>
          </button>

          {isCompleted && (
            <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              تم إنجاز الدرس
            </span>
          )}
        </div>
      </div>

      {/* 2. COMPREHENSIVE HERO HEADER BANNER */}
      <header className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-gradient-to-br from-[#171632] via-[#0c0b20] to-[#1a1438] shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30">
              {rule.category} • {rule.categoryEn}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-[#41e7ff] border border-white/10">
              {rule.level}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ff4f9a]/20 text-[#ff8bb9] border border-[#ff4f9a]/30">
              درس {rule.order} من 16
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {rule.titleAr}
          </h1>
          <div className="text-sm sm:text-base font-mono text-[#41e7ff] font-semibold">
            {rule.titleEn}
          </div>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed pt-2">
            {rule.summaryAr}
          </p>

          {/* Quick Voice Audio Pronunciation of Rule Title */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                playSound('click');
                speakEnglish(rule.titleEn);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffd166]/20 to-[#41e7ff]/20 hover:from-[#ffd166]/30 hover:to-[#41e7ff]/30 border border-[#ffd166]/40 text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-all"
            >
              <Volume2 className="w-4 h-4 text-[#ffd166]" />
              <span>استمع إلى النطق الصوتي لاسم القاعدة</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. LEARNING OBJECTIVES & TIMELINE VISUALIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectives */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-black text-[#ffd166]">
            <Sparkles className="w-4 h-4" />
            <span>الأهداف التعليمية ومخرجات الدرس</span>
          </div>
          <h3 className="text-lg font-black text-white">ماذا ستتقن بنهاية هذا الدرس؟</h3>
          <ul className="space-y-3 text-xs sm:text-sm text-[#dedbf4]">
            {rule.keyUsagePoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#c4ff55] shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Timeline Visualization Card */}
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-black text-[#41e7ff]">
            <Clock className="w-4 h-4" />
            <span>تخيل الخط الزمني (Timeline Visualizer)</span>
          </div>
          <h3 className="text-lg font-black text-white">أين يقع هذا الفعل على شريط الزمن؟</h3>
          <p className="text-xs sm:text-sm text-[#dedbf4] leading-relaxed">
            {rule.timelineDescription}
          </p>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono text-[#b9b6d5]">
            <div className="text-center">
              <span className="block text-[10px] text-white/50">الماضي</span>
              <span className="text-[#ffd166]">PAST</span>
            </div>
            <div className="flex-1 px-4 flex items-center justify-center">
              <div className="w-full h-1 bg-gradient-to-r from-[#ffd166] via-[#41e7ff] to-[#ff4f9a] relative">
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#41e7ff] border-2 border-white shadow-lg animate-ping opacity-75" />
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#41e7ff] border-2 border-white shadow-lg" />
              </div>
            </div>
            <div className="text-center">
              <span className="block text-[10px] text-white/50">المستقبل</span>
              <span className="text-[#ff4f9a]">FUTURE</span>
            </div>
          </div>
        </section>
      </div>

      {/* 4. THE GOLDEN SENTENCE FORMULAS (INTERACTIVE TABS) */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-bold text-[#ffd166]">التراكيب النحوية وقوالب الجمل</span>
            <h3 className="text-2xl font-black text-white">كيف تُصاغ الجملة بجميع حالاتها؟</h3>
          </div>

          {/* Structure Tabs */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveStructureTab('affirmative')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStructureTab === 'affirmative'
                  ? 'bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black'
                  : 'text-[#b9b6d5] hover:text-white'
              }`}
            >
              الإثبات (Affirmative)
            </button>
            <button
              onClick={() => setActiveStructureTab('negative')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStructureTab === 'negative'
                  ? 'bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black'
                  : 'text-[#b9b6d5] hover:text-white'
              }`}
            >
              النفي (Negative)
            </button>
            <button
              onClick={() => setActiveStructureTab('question')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStructureTab === 'question'
                  ? 'bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black'
                  : 'text-[#b9b6d5] hover:text-white'
              }`}
            >
              السؤال (Questions)
            </button>
          </div>
        </div>

        {/* Tab Content Cards */}
        <div className="p-6 rounded-2xl bg-black/30 border border-white/10 space-y-4">
          {activeStructureTab === 'affirmative' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#ffd166]">قالب الجملة المثبتة (Golden Formula):</div>
              <div className="p-4 rounded-xl bg-white/5 border border-[#ffd166]/30 text-base sm:text-xl font-mono text-[#ffd166] font-bold text-center tracking-wide">
                {rule.goldenFormula}
              </div>
              <p className="text-xs text-[#dedbf4] leading-relaxed">
                تطبق هذه الصيغة مع مراعاة الضمائر المفردة والجمع والتصريف المناسب للفعل.
              </p>
            </div>
          )}

          {activeStructureTab === 'negative' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#ff4f9a]">قالب جملة النفي (Negative Structure):</div>
              <div className="p-4 rounded-xl bg-white/5 border border-[#ff4f9a]/30 text-base sm:text-xl font-mono text-[#ff8bb9] font-bold text-center tracking-wide">
                {rule.negativeFormula}
              </div>
              <p className="text-xs text-[#dedbf4] leading-relaxed">
                لاحظ إرجاع الفعل إلى مصدره أو إدخال أداة النفي not مع الفعل المساعد المناسب.
              </p>
            </div>
          )}

          {activeStructureTab === 'question' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#41e7ff]">قالب السؤال بهل وأدوات الاستفهام (Questions & Short Answers):</div>
              <div className="p-4 rounded-xl bg-white/5 border border-[#41e7ff]/30 text-base sm:text-xl font-mono text-[#41e7ff] font-bold text-center tracking-wide">
                {rule.questionFormula}
              </div>
              <p className="text-xs text-[#dedbf4] leading-relaxed">
                للإجابة المختصرة: Yes, [Subject] + [Auxiliary] / No, [Subject] + [Auxiliary] + not.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. EGYPTIAN ARABIC EXPLANATION (شرح مبسط بالمصري وبدون فذلكة) */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-[#ffd166]/30 bg-gradient-to-br from-[#ffd166]/5 to-transparent space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-black text-[#ffd166]">
          <GraduationCap className="w-5 h-5 text-[#ffd166]" />
          <span>كلام من الآخر بالمصري • أسرار مستر هناوي 🧠</span>
        </div>
        <h3 className="text-2xl font-black text-white">إزاي تفهم القاعدة كأنها لغتك الأم؟</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rule.egyptianTips.map((tip, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#ffd166]/20 text-[#ffd166] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-[#dedbf4] leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. REAL-LIFE LIVING EXAMPLES WITH AUDIO PLAYBACK */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-xs font-bold text-[#41e7ff]">أمثلة عملية واقعية وسياقية</span>
            <h3 className="text-2xl font-black text-white">أمثلة من بيئة العمل والحياة اليومية 💬</h3>
          </div>
          <span className="text-xs text-[#b9b6d5] font-mono">{rule.examples.length} أمثلة حية</span>
        </div>

        <div className="space-y-4">
          {rule.examples.map((ex, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#41e7ff]/15 text-[#41e7ff] border border-[#41e7ff]/30">
                  سياق المثال: {ex.context}
                </span>

                <button
                  onClick={() => {
                    playSound('click');
                    speakEnglish(ex.en);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-[#ffd166] text-[#ffd166] hover:text-[#0c0b20] transition-colors cursor-pointer"
                  title="استمع إلى الجملة بنطق المتحدث الأصلي"
                  aria-label="استمع للجملة"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-left font-sans text-base sm:text-lg text-white font-semibold tracking-wide">
                {ex.en}
              </div>
              <div className="text-xs sm:text-sm text-[#b9b6d5] font-medium leading-relaxed">
                {ex.ar}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. COMMON TRAPS MADE BY ARABIC SPEAKERS (فخاخ شائعة وحلولها) */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-black text-red-400">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>أشهر الأخطاء الشائعة للمتحدثين بالعربية ⚠️</span>
        </div>
        <h3 className="text-2xl font-black text-white">إزاي تتجنب الأخطاء اللي بيقع فيها ٩٠٪ من الطلاب؟</h3>

        <div className="space-y-3">
          {rule.commonTraps.map((trap, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-red-500/20 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                !
              </div>
              <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
                {trap}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. EMBEDDED YOUTUBE VIDEO SECTION */}
      {videoResources.length > 0 && (
        <YouTubeVideoPlayer
          resources={videoResources}
          lessonTitle={rule.titleAr}
        />
      )}

      {/* 9. MINI ASSESSMENT QUIZ (اختبر فهمك الفوري للدرس) */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-xs font-bold text-[#c4ff55]">التقييم السريع وفحص الاستيعاب</span>
            <h3 className="text-2xl font-black text-white">اختبر نفسك فوراً في هذه القاعدة 🎯</h3>
          </div>
          <span className="text-xs font-mono text-[#ffd166]">{rule.miniQuiz.length} أسئلة قياسية</span>
        </div>

        <div className="space-y-6">
          {rule.miniQuiz.map((q, qIdx) => {
            const hasAnswered = quizAnswers[qIdx] !== undefined;
            const chosen = quizAnswers[qIdx];
            const isCorrect = chosen === q.correct;

            return (
              <div key={qIdx} className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#ffd166]">السؤال {qIdx + 1}</span>
                  {hasAnswered && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                      {isCorrect ? 'إجابة صحيحة ممتاز! 🎉' : 'إجابة غير صحيحة ❌'}
                    </span>
                  )}
                </div>

                <p className="text-left font-sans text-base sm:text-lg text-white font-semibold">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = 'bg-white/5 hover:bg-white/10 border-white/10 text-white';
                    if (hasAnswered) {
                      if (optIdx === q.correct) {
                        btnStyle = 'bg-emerald-500/30 border-emerald-500 text-emerald-200 font-bold';
                      } else if (optIdx === chosen) {
                        btnStyle = 'bg-red-500/30 border-red-500 text-red-200 font-bold';
                      } else {
                        btnStyle = 'bg-white/5 border-transparent opacity-50';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectQuiz(qIdx, optIdx, q.correct)}
                        className={`p-3.5 rounded-xl border text-left font-sans text-sm transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span className="font-mono text-xs opacity-60 ml-2">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#dedbf4] leading-relaxed">
                    <span className="font-bold text-[#ffd166]">شرح الإجابة: </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. LESSON COMPLETION & NAVIGATION CONTROLS */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevRule ? (
          <button
            onClick={() => {
              playSound('click');
              window.location.hash = `grammar/${prevRule.id}`;
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#ffd166]" />
            <div className="text-right">
              <span className="block text-[10px] text-[#b9b6d5]">الدرس السابق</span>
              <span>{prevRule.titleAr.split(':')[0]}</span>
            </div>
          </button>
        ) : <div />}

        <button
          onClick={handleComplete}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#ffd166] via-[#ff9c66] to-[#ff4f9a] text-[#121128] font-black text-sm flex items-center justify-center gap-2 hover:brightness-110 shadow-xl cursor-pointer transition-transform hover:-translate-y-0.5"
        >
          <Award className="w-5 h-5" />
          <span>تأكيد إكمال الدرس وتسجيل النقاط ⚡</span>
        </button>

        {nextRule ? (
          <button
            onClick={() => {
              playSound('click');
              window.location.hash = `grammar/${nextRule.id}`;
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <div className="text-left">
              <span className="block text-[10px] text-[#b9b6d5]">الدرس التالي</span>
              <span>{nextRule.titleAr.split(':')[0]}</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-[#41e7ff]" />
          </button>
        ) : <div />}
      </div>
    </div>
  );
};
