import React from "react";
import {
  PageRoute,
  UserProfile,
  UserProgressState,
  AchievementBadge,
} from "../types";
import { playSound, fireCelebration } from "../utils/audio";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  BookA,
  Mic,
  Headphones,
  BookOpen,
  PenTool,
  Volume2,
  Compass,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  TrendingUp,
  Target,
  Play,
  Calendar,
  AlertCircle,
  BarChart3,
  ChevronLeft,
} from "lucide-react";

interface DashboardPageProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  userProfile: UserProfile;
  progress: UserProgressState;
  badges: AchievementBadge[];
  onToggleGoal: (goalId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  userProfile,
  progress,
  badges,
  onToggleGoal,
}) => {
  const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
  const currentIdx = cefrLevels.indexOf(userProfile.currentLevel as any);
  const nextLevel =
    currentIdx < cefrLevels.length - 1 ? cefrLevels[currentIdx + 1] : "C2";
  const levelProgressPercent = 72; // 72% towards next level

  const academies = [
    {
      id: "grammar",
      title: "أكاديمية الجرامر",
      titleEn: "Grammar Academy",
      desc: "١٦ قاعدة أساسية من أزمنة المضارع والماضي وحتى المستقبل التام وحالات الشرط.",
      icon: GraduationCap,
      route: "grammar" as PageRoute,
      color: "from-[#41e7ff]/20 to-[#ffd166]/10",
      badge: "A1 - C1",
      lessonsCount: "١٦ درساً تفاعلياً",
      accentColor: "#41e7ff",
    },
    {
      id: "future-perfect",
      title: "المستقبل التام ⚡",
      titleEn: "Future Perfect Masterclass",
      desc: "الكورس الشامل: ٨ دروس تفاعلية، خطوط زمنية، كويزات ومحادثات حية.",
      icon: Sparkles,
      route: "courses/grammar/future-perfect" as PageRoute,
      color: "from-[#ffd166]/20 to-[#ff4f9a]/20",
      badge: "الكورس الرائد 👑",
      lessonsCount: "٨ موديولات",
      accentColor: "#ffd166",
    },
    {
      id: "vocabulary",
      title: "أكاديمية الكلمات والأفعال",
      titleEn: "Vocabulary Academy",
      desc: "كلمات الأعمال والتكنولوجيا والسفر والتصريف الثالث للأفعال الشاذة (V3).",
      icon: BookA,
      route: "vocabulary" as PageRoute,
      color: "from-[#c4ff55]/20 to-[#41e7ff]/10",
      badge: "Spaced Repetition",
      lessonsCount: "٥٠+ فعلاً ومصطلحاً",
      accentColor: "#c4ff55",
    },
    {
      id: "speaking",
      title: "أكاديمية المحادثة والطلاقة",
      titleEn: "Speaking Academy",
      desc: "سيناريوهات يومية، مقابلات عمل، تقنية التظليل (Shadowing)، وتسجيل الصوت.",
      icon: Mic,
      route: "speaking" as PageRoute,
      color: "from-[#ff4f9a]/20 to-[#9b7bff]/20",
      badge: "Interactive Dialogues",
      lessonsCount: "٥ سيناريوهات واقعية",
      accentColor: "#ff4f9a",
    },
    {
      id: "listening",
      title: "أكاديمية الاستماع",
      titleEn: "Listening Academy",
      desc: "تطوير الأذن الإنجليزية: لكنات بريطانية وأمريكية، بودكاست واختبارات إملاء.",
      icon: Headphones,
      route: "listening" as PageRoute,
      color: "from-[#9b7bff]/20 to-[#41e7ff]/10",
      badge: "Audio Lab",
      lessonsCount: "تمارين فهم صوتي",
      accentColor: "#9b7bff",
    },
    {
      id: "reading",
      title: "أكاديمية القراءة والفهم",
      titleEn: "Reading Academy",
      desc: "نصوص متدرجة، قصص قصيرة، تقنيات القراءة السريعة والمسح البصري (Scanning).",
      icon: BookOpen,
      route: "reading" as PageRoute,
      color: "from-[#41e7ff]/20 to-[#c4ff55]/10",
      badge: "Reading Hub",
      lessonsCount: "مقالات وقصص متدرجة",
      accentColor: "#41e7ff",
    },
    {
      id: "writing",
      title: "أكاديمية الكتابة",
      titleEn: "Writing Academy",
      desc: "صياغة الإيميلات المهنية، المقالات الأكاديمية، وتصحيح الأخطاء الشائعة.",
      icon: PenTool,
      route: "writing" as PageRoute,
      color: "from-[#ffd166]/20 to-[#41e7ff]/10",
      badge: "Formal & Casual",
      lessonsCount: "نماذج وتدريبات كتابة",
      accentColor: "#ffd166",
    },
    {
      id: "pronunciation",
      title: "أكاديمية النطق والفونيتكس",
      titleEn: "Pronunciation Academy",
      desc: "أبجدية الأصوات IPA، الأزواج الصغرى (Minimal Pairs)، ونبرات الكلمات.",
      icon: Volume2,
      route: "pronunciation" as PageRoute,
      color: "from-[#c4ff55]/20 to-[#ff4f9a]/15",
      badge: "IPA & Accents",
      lessonsCount: "مقارنات US vs UK",
      accentColor: "#c4ff55",
    },
    {
      id: "real-life",
      title: "إنجليزي المواقف الحقيقية",
      titleEn: "Real-Life English",
      desc: "في المطار، الفندق، المطعم، المستشفى، البنك، والتسوق.",
      icon: Compass,
      route: "real-life" as PageRoute,
      color: "from-[#ff4f9a]/20 to-[#ffd166]/20",
      badge: "Practical Survival",
      lessonsCount: "١٢ موديول واقعي",
      accentColor: "#ff4f9a",
    },
  ];

  const weeklyActivity = [
    { day: "السبت", hours: 1.2, completed: true },
    { day: "الأحد", hours: 0.8, completed: true },
    { day: "الإثنين", hours: 1.5, completed: true },
    { day: "الثلاثاء", hours: 2.1, completed: true },
    { day: "الأربعاء", hours: 0.5, completed: false, isToday: true },
    { day: "الخميس", hours: 0.0, completed: false },
    { day: "الجمعة", hours: 0.0, completed: false },
  ];

  return (
    <div className="space-y-10 pb-12 text-right">
      {/* 1. PERSONALIZED WELCOME & CEFR BANNER */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-10 bg-gradient-to-br from-[#171632] via-[#121128] to-[#0c0b20] shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Henglish Academy • منصتك التعليمية المتكاملة</span>
            </div>

            <h1 className="text-2xl sm:text-4xl 2xl:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
              أهلاً بك مجدداً، {userProfile.nameAr}! 🦅
            </h1>

            <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed max-w-2xl">
              أنت تسير بخطى ثابتة نحو إتقان اللغة الإنجليزية. حافظت على
              استمرارية التعلم لمدة{" "}
              <strong className="text-[#ffd166]">
                {userProfile.streakDays} أيام متتالية
              </strong>
              ، وجمعت{" "}
              <strong className="text-[#41e7ff]">
                {userProfile.xp.toLocaleString()} نقطة خبرة XP
              </strong>
              !
            </p>

            {/* CEFR Level Bar */}
            <div className="pt-3 max-w-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#ffd166] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  مستواك الحالي: {userProfile.currentLevel} (Intermediate)
                </span>
                <span className="text-[#b9b6d5]">
                  المستوى التالي:{" "}
                  <strong className="text-white">{nextLevel}</strong> (
                  {levelProgressPercent}%)
                </span>
              </div>

              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ffd166] via-[#ff4f9a] to-[#41e7ff] transition-all duration-1000 shadow-[0_0_12px_rgba(65,231,255,0.4)]"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-[#b9b6d5]/70 font-mono">
                {cefrLevels.map((lvl) => (
                  <span
                    key={lvl}
                    className={
                      lvl === userProfile.currentLevel
                        ? "text-[#ffd166] font-black"
                        : ""
                    }
                  >
                    {lvl}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick CTA Card */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="text-xs font-black uppercase text-[#41e7ff] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ff4f9a]" />
              <span>متابعة التعلم فوراً</span>
            </div>

            <div className="space-y-1">
              <div className="text-base font-black text-white">
                المستقبل التام الشامل
              </div>
              <div className="text-xs text-[#b9b6d5]">
                الدرس 03: صيغ النفي واختصارات Won't have
              </div>
            </div>

            <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#41e7ff] h-full rounded-full"
                style={{ width: "40%" }}
              />
            </div>

            <button
              onClick={() => {
                playSound("click");
                onNavigate("lesson", "lesson-3");
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>استكمال الدرس الآن</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. DAILY GOALS & WEEKLY STATS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daily Goals Checklist */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#ffd166]" />
                أهداف اليوم التعليمية
              </h2>
              <p className="text-xs text-[#b9b6d5]">
                أكمل أهدافك اليومية لتحصل على 150 نقطة XP إضافية
              </p>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#c4ff55]/20 text-[#c4ff55] border border-[#c4ff55]/30">
              {(progress.dailyGoals || []).filter((g) => g.completed).length} /{" "}
              {(progress.dailyGoals || []).length} منجز
            </span>
          </div>

          <div className="space-y-3">
            {(progress.dailyGoals || []).map((goal) => (
              <div
                key={goal.id}
                onClick={() => {
                  playSound("click");
                  onToggleGoal(goal.id);
                  if (!goal.completed) fireCelebration();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  goal.completed
                    ? "bg-[#c4ff55]/10 border-[#c4ff55]/40 text-[#c4ff55]"
                    : "bg-white/5 border-white/10 hover:border-white/25 text-[#dedbf4]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                      goal.completed
                        ? "bg-[#c4ff55] border-[#c4ff55] text-[#0c0b20]"
                        : "border-white/30 text-transparent"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <div
                      className={`text-xs sm:text-sm font-bold ${goal.completed ? "line-through opacity-80" : "text-white"}`}
                    >
                      {goal.titleAr}
                    </div>
                    <div className="text-[10px] text-[#b9b6d5]/70 font-mono en">
                      {goal.title}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold">
                  {goal.current}/{goal.target} {goal.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Learning Stats */}
        <div className="lg:col-span-6 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#41e7ff]" />
                إحصائيات الأسبوع التعليمي
              </h2>
              <p className="text-xs text-[#b9b6d5]">
                ساعات الدراسة ونسبة الإتقان التراكمية
              </p>
            </div>
            <div className="text-xs font-black text-[#ffd166] flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>٦.١ ساعات هذا الأسبوع</span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
            {weeklyActivity.map((d, idx) => {
              const maxH = 2.5;
              const heightPercent = Math.min(
                100,
                Math.round((d.hours / maxH) * 100),
              );

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <span className="text-[10px] font-mono text-[#b9b6d5]">
                    {d.hours > 0 ? `${d.hours}h` : "—"}
                  </span>

                  <div className="w-full max-w-[28px] h-28 bg-white/5 rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5 border border-white/5">
                    <div
                      className={`w-full rounded-t-md transition-all duration-700 ${
                        d.isToday
                          ? "bg-gradient-to-t from-[#41e7ff] to-[#ffd166] shadow-[0_0_10px_rgba(65,231,255,0.4)]"
                          : d.completed
                            ? "bg-[#c4ff55]/80"
                            : "bg-white/10"
                      }`}
                      style={{ height: `${Math.max(8, heightPercent)}%` }}
                    />
                  </div>

                  <span
                    className={`text-[11px] font-bold ${d.isToday ? "text-[#ffd166]" : "text-[#b9b6d5]"}`}
                  >
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center border-t border-white/10">
            <div className="p-2 rounded-xl bg-white/5">
              <div className="text-[10px] text-[#b9b6d5]">الدروس المكتملة</div>
              <div className="text-base font-black text-[#41e7ff]">
                {progress.completedLessons.length} دروس
              </div>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <div className="text-[10px] text-[#b9b6d5]">دقة الكويزات</div>
              <div className="text-base font-black text-[#c4ff55]">٩٤%</div>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <div className="text-[10px] text-[#b9b6d5]">أيام متتالية</div>
              <div className="text-base font-black text-[#ffd166]">
                {userProfile.streakDays} أيام 🔥
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ACADEMIES HUB (THE 8 CORE ACADEMIES + FUTURE PERFECT) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <GraduationCap className="w-6 h-6 text-[#ffd166]" />
              أكاديميات هناوي المتخصصة (Curriculum Hubs)
            </h2>
            <p className="text-xs sm:text-sm text-[#dedbf4]">
              منهج تعليمي شامل يغطي كافة المهارات من المبتدئ (A1) وحتى الاحتراف
              (C2)
            </p>
          </div>

          <button
            onClick={() => {
              playSound("click");
              onNavigate("courses");
            }}
            className="text-xs font-bold text-[#41e7ff] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>عرض كل الكورسات والمسارات</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {academies.map((acad) => {
            const Icon = acad.icon;
            return (
              <div
                key={acad.id}
                onClick={() => {
                  playSound("click");
                  onNavigate(acad.route);
                }}
                className="glass-panel glass-panel-hover rounded-3xl p-6 border border-white/10 hover:border-white/30 transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                {/* Accent glow corner */}
                <div
                  className="absolute -top-12 -left-12 w-28 h-28 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40 pointer-events-none"
                  style={{ backgroundColor: acad.accentColor }}
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/15 shadow-md"
                      style={{ backgroundColor: `${acad.accentColor}18` }}
                    >
                      <Icon
                        className="w-6 h-6"
                        style={{ color: acad.accentColor }}
                      />
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white">
                      {acad.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-[#ffd166] transition-colors">
                      {acad.title}
                    </h3>
                    <div className="text-xs font-mono text-[#b9b6d5] en">
                      {acad.titleEn}
                    </div>
                  </div>

                  <p className="text-xs text-[#dedbf4] leading-relaxed">
                    {acad.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                  <span className="text-[#b9b6d5]">{acad.lessonsCount}</span>
                  <span className="text-[#41e7ff] flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                    <span>دخول الأكاديمية</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. UPCOMING ASSIGNMENTS & BADGES SHOWCASE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Badges and Trophies */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#ffd166]" />
              شارات التميز والإنجازات الأكاديمية
            </h2>
            <button
              onClick={() => {
                playSound("click");
                onNavigate("my-learning");
              }}
              className="text-xs text-[#41e7ff] hover:underline cursor-pointer"
            >
              عرض الكل ({badges.length})
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {badges.map((b) => (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  b.unlocked
                    ? "bg-gradient-to-b from-[#ffd166]/10 to-transparent border-[#ffd166]/40 shadow-sm"
                    : "bg-white/5 border-white/5 opacity-50 grayscale"
                }`}
              >
                <div className="text-3xl mb-1.5 filter drop-shadow">
                  {b.icon}
                </div>
                <div className="text-xs font-bold text-white mb-0.5">
                  {b.title}
                </div>
                <div className="text-[10px] text-[#b9b6d5] line-clamp-2 leading-tight">
                  {b.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Lab & Placement Test Promotion */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#1b1939] to-[#121128] border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>اختبار تحديد المستوى المعتمد</span>
            </div>

            <h3 className="text-xl font-black text-white leading-snug">
              هل تعرف مستواك الحقيقي وفق المعيار الأوروبي (CEFR)؟
            </h3>

            <p className="text-xs text-[#dedbf4] leading-relaxed">
              اختبر مهاراتك في الجرامر والكلمات وفهم المقروء من خلال اختبار
              تقييم تشخيصي مكون من ٢٠ سؤالاً مع تقرير مفصل بنقاط القوة
              والموضوعات المقترحة.
            </p>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                playSound("click");
                onNavigate("exams");
              }}
              className="w-full py-3 rounded-xl bg-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <span>بدء اختبار تحديد المستوى (CEFR Placement)</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>

            <button
              onClick={() => {
                playSound("click");
                onNavigate("practice");
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>دخول معمل الألعاب والتمارين التفاعلية</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
