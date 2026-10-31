import React, { useState } from "react";
import { PageRoute } from "../types";
import { FUTURE_PERFECT_LESSONS } from "../data/futurePerfectCourse";
import { TimelineVisualizer } from "../components/TimelineVisualizer";
import { SentenceBuilder } from "../components/SentenceBuilder";
import { FlashcardDeck } from "../components/FlashcardDeck";
import { FLASHCARD_DECK } from "../data/flashcardsData";
import { ONLINE_IMAGES } from "../data/imageAssets";
import { playSound, fireCelebration } from "../utils/audio";
import {
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Flame,
  Play,
  Gamepad2,
  ChevronDown,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";

interface HomePageProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  completionPercentage: number;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  completionPercentage,
}) => {
  // Daily Challenge state
  const [dailyAnswered, setDailyAnswered] = useState<number | null>(null);
  const dailyQuestion = {
    question:
      "By 2030, electric vehicles ______ the standard mode of transportation.",
    options: ["will have become", "will become", "became", "will has become"],
    correct: 0,
    explanation:
      "تحديد موعد مستقبلي By 2030 مع اكتمال التحول يتطلب will have become.",
  };

  const handleDailyAnswer = (idx: number) => {
    if (dailyAnswered !== null) return;
    setDailyAnswered(idx);
    if (idx === dailyQuestion.correct) {
      playSound("correct");
      fireCelebration();
    } else {
      playSound("wrong");
    }
  };

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "يعني إيه المستقبل التام في جملة واحدة مبسطة؟",
      a: 'المستقبل التام (Future Perfect) معناه إنك بتتخيل نفسك واقف في المستقبل وبتبص على حدث هيكون خلص وانتهى تماماً قبل موعد محدد، زي لما تقول: "قبل الساعة ٨، هكون خلصت واجبي" (By 8 p.m., I will have finished my homework).',
    },
    {
      q: "ليه بنقول She will have finished ومش She will has finished؟",
      a: "لأن will فعل ناقص (Modal auxiliary)، والقاعدة النحوية الصارمة في الإنجليزية تفرض عودة أي فعل بعد will إلى صيغة المصدر المجرد (Base Form). ومصدر أفعال have/has هو have دائماً وأبداً مع جميع الضمائر.",
    },
    {
      q: "إيه حكاية فخ By the time؟",
      a: "بعد By the time أو أي رابط زمني يدل على المستقبل، نستخدم المضارع البسيط (Present Simple) وليس will. فنقول: By the time dad arrives (وليس By the time dad will arrive). والجملة الرئيسية الأخرى هي التي تأخذ will have + V3.",
    },
    {
      q: "هل المنصة تحفظ تقدمي في الدروس والاختبارات؟",
      a: "نعم! المنصة تحفظ محلياً على متصفحك (LocalStorage) كافة الدروس التي أنهيتها، درجاتك في الكويزات، وسجل الأيام المتتالية، وشارات التميز التي حققتها.",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Glow Spheres */}
        <div
          className="absolute top-10 right-1/4 w-96 h-96 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />
        <div
          className="absolute top-40 left-10 w-96 h-96 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Right Text Content (RTL) */}
            <div className="lg:col-span-7 space-y-6 text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ff4f9a]/15 text-[#ff8bb9] border border-[#ff4f9a]/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MASTERCLASS • GRAMMAR THAT STICKS</span>
              </div>

              <h1 className="text-4xl sm:text-6xl 2xl:text-7xl font-black font-['Plus_Jakarta_Sans','Cairo',sans-serif] tracking-tight leading-[1.15]">
                Master the <br />
                <span className="bg-linear-to-r from-[#ffd166] via-[#ff4f9a] to-[#41e7ff] bg-clip-text text-transparent">
                  Future Perfect
                </span>{" "}
                <br />
                Tense.
              </h1>

              <p className="text-base sm:text-lg text-[#dedbf4] max-w-2xl leading-relaxed">
                تخيّل إنك بتبص من المستقبل على حاجة هتكون خلصت قبل وقت محدد. دي
                بالظبط فكرة المستقبل التام؛ مش مجرد حفظ قواعد، بل فهم عميق
                وتطبيق فوري بالمصري والإنجليزي.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("lesson", "lesson-1");
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black text-sm sm:text-base hover:brightness-110 shadow-[0_8px_25px_rgba(255,156,102,0.3)] transition-all hover:-translate-y-1 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>ابدأ الدرس الأول الآن</span>
                </button>

                <button
                  onClick={() => {
                    playSound("click");
                    onNavigate("practice");
                  }}
                  className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm sm:text-base border border-white/15 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                >
                  <Gamepad2 className="w-4 h-4 text-[#41e7ff]" />
                  <span>الألعاب والتمارين</span>
                </button>
              </div>

              {/* Value Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-4 text-xs font-bold text-[#b9b6d5]">
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c4ff55]" />
                  شرح مبسط بالمصري
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ffd166]" />
                  نطق صوتي حقيقي
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#41e7ff]" />
                  ألعاب واختبارات تفاعلية
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff4f9a]" />
                  مذكرات قابلة للطباعة
                </span>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <strong className="en block text-2xl font-black text-[#ffd166]">
                    08
                  </strong>
                  <span className="text-xs text-[#b9b6d5]">دروس شاملة</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <strong className="en block text-2xl font-black text-[#41e7ff]">
                    {completionPercentage}%
                  </strong>
                  <span className="text-xs text-[#b9b6d5]">إنجازك الشخصي</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <strong className="en block text-2xl font-black text-[#c4ff55]">
                    30+
                  </strong>
                  <span className="text-xs text-[#b9b6d5]">سؤال في البنك</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <strong className="en block text-2xl font-black text-[#ff4f9a]">
                    04
                  </strong>
                  <span className="text-xs text-[#b9b6d5]">ألعاب تعليمية</span>
                </div>
              </div>
            </div>

            {/* Right Visual PC Screen Mockup / 3D Display on Desktop */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[460px]">
              {/* Central Glowing 3D Orb & Eagle Logo */}
              <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-linear-to-br from-[#171632]/95 via-[#201d43]/90 to-[#0c0b20]/95 border-2 border-[#ffd166]/40 shadow-[0_0_100px_rgba(255,209,102,0.25)] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden group">
                {/* Background glow and rings */}
                <div className="absolute inset-0 bg-radial from-[#ffd166]/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute -inset-6 rounded-full border border-white/15 rotate-12 pointer-events-none" />
                <div className="absolute -inset-12 rounded-full border border-[#41e7ff]/30 -rotate-45 pointer-events-none" />

                {/* Prominent High-Res Hinawi Eagle Logo */}
                <div className="relative mb-2 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#ffd166]/40 via-[#ff4f9a]/30 to-[#41e7ff]/40 blur-xl animate-pulse" />
                  <img
                    src="/logo-clean.png"
                    alt="Henglish Academy Eagle Logo"
                    className="w-36 h-36 sm:w-44 sm:h-44 object-contain relative z-10 filter drop-shadow-[0_0_30px_rgba(255,209,102,0.65)] transition-transform duration-500 group-hover:scale-110"
                    loading="eager"
                  />
                </div>

                <strong className="en text-lg sm:text-2xl font-black text-[#ffd166] tracking-wider relative z-10">
                  Henglish Academy
                </strong>
                <span className="en text-[11px] sm:text-xs text-[#dedbf4] font-bold mt-0.5 relative z-10">
                  FUTURE PERFECT MASTERCLASS • 2026
                </span>
              </div>

              {/* Floating Badge 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-4 right-0 sm:right-4 p-3.5 rounded-2xl bg-[#171632]/95 border border-white/20 shadow-2xl text-xs backdrop-blur-md"
              >
                <span className="text-lg">📅</span>
                <b className="en block text-[#41e7ff] text-sm font-black">
                  BY 8 PM
                </b>
                <span className="text-[#b9b6d5]">موعد تسليم نهائي</span>
              </motion.div>

              {/* Floating Badge 2 */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-4 left-0 sm:left-4 p-3.5 rounded-2xl bg-[#171632]/95 border border-white/20 shadow-2xl text-xs backdrop-blur-md"
              >
                <span className="text-lg">✨</span>
                <b className="en block text-[#c4ff55] text-sm font-black">
                  WILL HAVE + V3
                </b>
                <span className="text-[#b9b6d5]">التركيبة الذهبية</span>
              </motion.div>

              {/* Floating Badge 3 */}
              <motion.div
                animate={{ x: [0, -6, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute top-1/2 -left-2 sm:-left-6 -translate-y-1/2 p-3 rounded-2xl bg-[#171632]/95 border border-white/20 shadow-2xl text-xs backdrop-blur-md hidden sm:block"
              >
                <span className="text-lg">🎯</span>
                <b className="en block text-[#ffd166] text-xs font-black">
                  FINISHED
                </b>
                <span className="text-[#b9b6d5]">الحدث اكتمل</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* DAILY GRAMMAR CHALLENGE WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 relative border-2 border-[#ffd166]/40 shadow-[0_0_35px_rgba(255,209,102,0.12)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black text-[#ffd166] uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 text-[#ff9c66]" />
                <span>تحدي اليوم السريع (DAILY GRAMMAR CHALLENGE)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                اختبر فهمك السريع للقاعدة اليوم
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/30">
              سؤال اليوم 🎯
            </span>
          </div>

          <p className="en text-lg sm:text-xl font-black text-white mb-6 p-4 rounded-2xl bg-[#09091a]">
            {dailyQuestion.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {dailyQuestion.options.map((opt, idx) => {
              const answered = dailyAnswered !== null;
              const isCorrect = idx === dailyQuestion.correct;
              const isSelected = dailyAnswered === idx;

              let btnStyle =
                "bg-[#171632] hover:bg-[#201d43] border-white/10 text-white";
              if (answered) {
                if (isCorrect) {
                  btnStyle =
                    "bg-[#c4ff55]/20 border-[#c4ff55] text-[#c4ff55] font-black";
                } else if (isSelected) {
                  btnStyle = "bg-[#ff4f9a]/20 border-[#ff4f9a] text-[#ff4f9a]";
                } else {
                  btnStyle = "opacity-40 bg-[#171632] border-white/5";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleDailyAnswer(idx)}
                  disabled={answered}
                  className={`en p-3.5 rounded-xl border font-bold text-sm text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {answered && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-[#c4ff55]" />
                  )}
                </button>
              );
            })}
          </div>

          {dailyAnswered !== null && (
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-[#dedbf4]">
              <strong className="text-[#ffd166]">توضيح هناوي: </strong>
              {dailyQuestion.explanation}
            </div>
          )}
        </div>
      </section>

      {/* GRAMMAR ACADEMY SPOTLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#ffd166]/40 p-8 sm:p-12 shadow-[0_0_40px_rgba(255,209,102,0.15)]">
          {/* Background Photo with Dark Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={ONLINE_IMAGES.modernClassroom}
              alt="Hinawi Grammar Academy Lecture Hall"
              className="w-full h-full object-cover filter brightness-[0.22]"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#0c0b20] via-[#0c0b20]/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40">
              <GraduationCap className="w-4 h-4" />
              <span>HINAWI GRAMMAR ACADEMY • المنهج الشامل المرتب</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              أكاديمية قواعد اللغة الإنجليزية بالكامل 🦅
            </h2>

            <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
              تحوّل من دراسة زمن واحد إلى أكاديمية متكاملة تشرح كافة قواعد
              الجرامر بالترتيب: أزمنة المضارع، الماضي، المستقبل، حالات الشرط،
              المبني للمجهول، والكلام المنقول مع النطق الصوتي والأمثلة الحية
              وكويزات الفهم.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  playSound("click");
                  onNavigate("courses/grammar");
                }}
                className="px-6 py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black text-sm sm:text-base hover:brightness-110 shadow-lg transition-transform hover:-translate-y-1 cursor-pointer flex items-center gap-2"
              >
                <span>استكشف الـ ١٦ قاعدة في الأكاديمية الآن</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FLAGSHIP COURSE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase text-[#41e7ff] tracking-widest block mb-1">
              THE FLAGSHIP MASTERCLASS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              الكورس الرائد: كورس المستقبل التام الكامل ⚡
            </h2>
          </div>

          <button
            onClick={() => {
              playSound("click");
              onNavigate("courses/grammar/future-perfect");
            }}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#ffd166] hover:underline cursor-pointer"
          >
            <span>عرض تفاصيل الكورس</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* 8 Lesson Cards Grid with Real Online Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FUTURE_PERFECT_LESSONS.map((lesson) => (
            <motion.div
              key={lesson.id}
              whileHover={{ y: -4 }}
              onClick={() => {
                playSound("click");
                onNavigate("lesson", lesson.id);
              }}
              className="glass-panel rounded-3xl border border-white/10 hover:border-[#41e7ff]/40 cursor-pointer flex flex-col justify-between group transition-all overflow-hidden"
            >
              {/* Real Online Image Thumbnail */}
              {lesson.imageUrl && (
                <div className="h-40 relative overflow-hidden shrink-0">
                  <img
                    src={lesson.imageUrl}
                    alt={lesson.imageAlt || lesson.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#171632] via-transparent to-transparent opacity-90" />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-[#09091a]/80 backdrop-blur-md text-[#ffd166] border border-white/15">
                    LESSON 0{lesson.number}
                  </span>
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#b9b6d5] mb-2">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.readTime}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#c4ff55] font-bold text-[11px]">
                      {lesson.level}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-white group-hover:text-[#41e7ff] transition-colors leading-snug">
                    {lesson.title}
                  </h4>

                  <span className="en block text-xs font-bold text-[#41e7ff]/90 mt-1 mb-2">
                    {lesson.subtitle}
                  </span>

                  <p className="text-xs text-[#b9b6d5] line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                  <span className="text-[#ffd166] group-hover:translate-x-[-3px] transition-transform inline-flex items-center gap-1">
                    <span>ادرس الدرس</span>
                    <span>←</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE TIMELINE DEMO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TimelineVisualizer />
      </section>

      {/* SENTENCE BUILDER GAME SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SentenceBuilder />
      </section>

      {/* FLASHCARD DECK SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FlashcardDeck cards={FLASHCARD_DECK} />
      </section>

      {/* REAL-LIFE VISUAL SCENARIOS GALLERY WITH REAL PHOTOGRAPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-black uppercase text-[#41e7ff] tracking-widest block">
            REAL-WORLD IMMERSION • معايشة بصرية واقعية
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            شاهد واستوعب القواعد في مواقف الحياة الحقيقية 📸
          </h2>
          <p className="text-sm text-[#b9b6d5] max-w-2xl mx-auto">
            القواعد مش مجرد معادلات في كشكول؛ دي لغة حية بيستخدمها المبرمجين،
            والطيارين، والباحثين، والمهندسين في مواقفهم اليومية ومواعيد تسليمهم.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ONLINE_IMAGES.scenariosGallery.map((item) => (
            <div
              key={item.id}
              className="glass-panel rounded-3xl border border-white/10 hover:border-[#41e7ff]/40 overflow-hidden group transition-all flex flex-col justify-between"
            >
              <div className="h-52 relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.sentence}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#171632] via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-xl text-xs font-black bg-[#09091a]/80 backdrop-blur-md text-[#ffd166] border border-white/15">
                  {item.tag}
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="en block text-xs font-bold text-[#41e7ff] mb-1">
                    {item.focusRule}
                  </span>
                  <p className="en text-base font-black text-white leading-snug">
                    "{item.sentence}"
                  </p>
                </div>
                <p className="text-xs text-[#dedbf4] leading-relaxed pt-3 border-t border-white/10">
                  {item.translationAr}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-black uppercase text-[#ffd166] tracking-widest block">
            COMMON QUESTIONS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            الأسئلة الشائعة حول المستقبل التام ❓
          </h2>
          <p className="text-sm text-[#b9b6d5]">
            إجابات واضحة ومباشرة لأكثر الأسئلة التي يطرحها الطلاب.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => {
                    playSound("click");
                    setOpenFaq(isOpen ? null : idx);
                  }}
                  className="w-full p-5 text-right font-black text-base text-white hover:text-[#41e7ff] transition-colors cursor-pointer flex items-center justify-between gap-4"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#ffd166] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-sm text-[#dedbf4] leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
