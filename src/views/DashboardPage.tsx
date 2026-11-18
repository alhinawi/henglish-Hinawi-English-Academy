import { Award } from 'lucide-react';
import { BadgeCollection } from '../components/BadgeCollection';
import React from "react";
import {
  PageRoute,
  UserProfile,
  UserProgressState,
  AchievementBadge,
} from "../types";
import { playSound } from "../utils/audio";
import { deriveDailyGoals } from "../utils/useProgress";
import { useLanguage } from "../i18n/LanguageContext";
import {
  CEFR_LEVELS,
  levelProgressPercent,
  xpToNextLevel,
  nextLevelOf,
} from "../utils/levels";
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
  TrendingUp,
  Target,
  Play,
  Calendar,
  AlertCircle,
  BarChart3,
  ChevronLeft,
  Film,
  BookText,
  Library,
} from "lucide-react";

interface DashboardPageProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  userProfile: UserProfile;
  progress: UserProgressState;
  badges: AchievementBadge[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  userProfile,
  progress,
  badges,
}) => {
  const { t, lang } = useLanguage();
  const dailyGoals = deriveDailyGoals(progress, t);
  const dailyGoalsDone = dailyGoals.filter((g) => g.completed).length;
  const currentLevel = userProfile.currentLevel;
  const nextLevel = nextLevelOf(currentLevel);
  const progressPercent = levelProgressPercent(userProfile.xp || 0, currentLevel);
  const xpRemaining = xpToNextLevel(userProfile.xp || 0, currentLevel);

  const academies = [
    {
      id: "grammar",
      title: t("dash.acad.grammar.title"),
      titleEn: "Grammar Academy",
      desc: t("dash.acad.grammar.desc"),
      icon: GraduationCap,
      route: "grammar" as PageRoute,
      color: "from-[#41e7ff]/20 to-[#ffd166]/10",
      badge: t("dash.acad.grammar.badge"),
      lessonsCount: t("dash.acad.grammar.lessons"),
      accentColor: "#41e7ff",
    },
    {
      id: "vocabulary",
      title: t("dash.acad.vocabulary.title"),
      titleEn: "Vocabulary Academy",
      desc: t("dash.acad.vocabulary.desc"),
      icon: BookA,
      route: "vocabulary" as PageRoute,
      color: "from-[#c4ff55]/20 to-[#41e7ff]/10",
      badge: "Spaced Repetition",
      lessonsCount: t("dash.acad.vocabulary.lessons"),
      accentColor: "#c4ff55",
    },
    {
      id: "speaking",
      title: t("dash.acad.speaking.title"),
      titleEn: "Speaking Academy",
      desc: t("dash.acad.speaking.desc"),
      icon: Mic,
      route: "speaking" as PageRoute,
      color: "from-[#ff4f9a]/20 to-[#9b7bff]/20",
      badge: "Interactive Dialogues",
      lessonsCount: t("dash.acad.speaking.lessons"),
      accentColor: "#ff4f9a",
    },
    {
      id: "listening",
      title: t("dash.acad.listening.title"),
      titleEn: "Listening Academy",
      desc: t("dash.acad.listening.desc"),
      icon: Headphones,
      route: "listening" as PageRoute,
      color: "from-[#9b7bff]/20 to-[#41e7ff]/10",
      badge: "Audio Lab",
      lessonsCount: t("dash.acad.listening.lessons"),
      accentColor: "#9b7bff",
    },
    {
      id: "reading",
      title: t("dash.acad.reading.title"),
      titleEn: "Reading Academy",
      desc: t("dash.acad.reading.desc"),
      icon: BookOpen,
      route: "reading" as PageRoute,
      color: "from-[#41e7ff]/20 to-[#c4ff55]/10",
      badge: "Reading Hub",
      lessonsCount: t("dash.acad.reading.lessons"),
      accentColor: "#41e7ff",
    },
    {
      id: "writing",
      title: t("dash.acad.writing.title"),
      titleEn: "Writing Academy",
      desc: t("dash.acad.writing.desc"),
      icon: PenTool,
      route: "writing" as PageRoute,
      color: "from-[#ffd166]/20 to-[#41e7ff]/10",
      badge: "Formal & Casual",
      lessonsCount: t("dash.acad.writing.lessons"),
      accentColor: "#ffd166",
    },
    {
      id: "pronunciation",
      title: t("dash.acad.pronunciation.title"),
      titleEn: "Pronunciation Academy",
      desc: t("dash.acad.pronunciation.desc"),
      icon: Volume2,
      route: "pronunciation" as PageRoute,
      color: "from-[#c4ff55]/20 to-[#ff4f9a]/15",
      badge: "IPA & Accents",
      lessonsCount: t("dash.acad.pronunciation.lessons"),
      accentColor: "#c4ff55",
    },
    {
      id: "real-life",
      title: t("dash.acad.realLife.title"),
      titleEn: "Real-Life English",
      desc: t("dash.acad.realLife.desc"),
      icon: Compass,
      route: "real-life" as PageRoute,
      color: "from-[#ff4f9a]/20 to-[#ffd166]/20",
      badge: "Practical Survival",
      lessonsCount: t("dash.acad.realLife.lessons"),
      accentColor: "#ff4f9a",
    },
    {
      id: "sources",
      title: t("home.sources.title"),
      titleEn: "Resources",
      desc: t("home.sources.desc"),
      icon: Library,
      route: "sources" as PageRoute,
      color: "from-[#ffd166]/20 to-[#41e7ff]/10",
      badge: t("home.sources.badge"),
      lessonsCount: t("home.sources.lessons"),
      accentColor: "#ffd166",
    },
  ];

  // Real quiz stats from actual recorded scores
  const quizEntries = Object.entries(progress.quizScores || {});
  const totalQuizScore = quizEntries.reduce((acc, [, q]) => acc + q.score, 0);
  const totalQuizMax = quizEntries.reduce((acc, [, q]) => acc + q.total, 0);
  const quizAccuracy =
    totalQuizMax > 0 ? Math.round((totalQuizScore / totalQuizMax) * 100) : null;
  const recentQuizzes = [...quizEntries]
    .sort(([, a], [, b]) => (a.date < b.date ? 1 : -1))
    .slice(0, 4);

  return (
    <div className="space-y-10 pb-12 text-right">
      {/* 1. PERSONALIZED WELCOME & CEFR BANNER */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-10 bg-linear-to-br from-[#171632] via-[#121128] to-[#0c0b20] shadow-2xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('dash.heroBadge')}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl 2xl:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
              {userProfile.id === 'guest-learner' ? (
                t('dash.welcomeGuest')
              ) : (
                <>
                  {t('dash.welcomeBack')}{' '}
                  <bdi dir="auto" className="whitespace-nowrap">
                    {userProfile.nameAr}!
                  </bdi>
                </>
              )}
            </h1>

            <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed max-w-2xl">
              {t('dash.heroTextA')}{" "}
              <strong className="text-[#ffd166]">
                {t('dash.streakValue').replace('{n}', String(userProfile.streakDays))}
              </strong>
              {' '}{t('dash.heroTextB')}{" "}
              <strong className="text-[#41e7ff]">
                {t('dash.heroXp').replace('{n}', userProfile.xp.toLocaleString())}
              </strong>
              !
            </p>

            {/* CEFR Level Bar */}
            <div className="pt-3 max-w-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#ffd166] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  {t('dash.currentLevel').replace('{level}', currentLevel).replace('{label}', t('sl.level.' + currentLevel.toLowerCase()))}
                </span>
                <span className="text-[#b9b6d5]">
                  {nextLevel ? (
                    <>
                      {t('dash.nextLevel').replace('{level}', nextLevel).replace('{pct}', String(progressPercent)).replace('{xp}', xpRemaining.toLocaleString())}
                    </>
                  ) : (
                    <>{t('dash.maxLevel')}</>
                  )}
                </span>
              </div>

              <div
                dir="rtl"
                className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10"
              >
                <div
                  className="h-full rounded-full bg-linear-to-l from-[#ffd166] via-[#ff4f9a] to-[#41e7ff] transition-all duration-1000 shadow-[0_0_12px_rgba(65,231,255,0.4)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-[#b9b6d5]/70 font-mono">
                {CEFR_LEVELS.map((lvl) => (
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
              <span>{t('dash.continueCta')}</span>
            </div>

            <div className="space-y-1">
              <div className="text-base font-black text-white">
                {t('dash.pickSkill')}
              </div>
              <div className="text-xs text-[#b9b6d5]">
                {t('dash.pickSkillSub')}
              </div>
            </div>


            <button
              onClick={() => {
                playSound("click");
                onNavigate("courses");
              }}
              className="w-full py-3 rounded-xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t('dash.explorePaths')}</span>
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
                {t('dash.goalsTitle')}
              </h2>
              <p className="text-xs text-[#b9b6d5]">
                {t('dash.goalsSub')}
              </p>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#c4ff55]/20 text-[#c4ff55] border border-[#c4ff55]/30">
              <span dir="ltr" className="tabular-nums">{dailyGoalsDone}/{dailyGoals.length}</span>{" "}{t('dash.done')}
            </span>
          </div>

          <div className="space-y-3">
            {dailyGoals.map((goal) => (
              <div
                key={goal.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  goal.completed
                    ? "bg-[#c4ff55]/10 border-[#c4ff55]/40 text-[#c4ff55]"
                    : "bg-white/5 border-white/10 hover:border-white/25 text-[#dedbf4]"
                }`}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div
                    className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center border ${
                      goal.completed
                        ? "bg-[#c4ff55] border-[#c4ff55] text-[#0c0b20]"
                        : "border-white/30 text-transparent"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-3" />
                  </div>
                  <div className="min-w-0">
                    <div
                      className={`text-xs sm:text-sm font-bold ${goal.completed ? "line-through opacity-80" : "text-white"}`}
                    >
                      {goal.titleAr}
                    </div>
                    {lang !== 'en' && <div className="text-[10px] text-[#b9b6d5]/70 font-mono en">
                      {goal.title}
                    </div>}
                  </div>
                </div>

                <span className="inline-flex shrink-0 flex-col items-center whitespace-nowrap text-[10px] sm:text-xs font-mono font-bold">
                  <span dir="ltr" className="tabular-nums">{goal.current}/{goal.target}</span>
                  <span>{goal.unit}</span>
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
                {t('dash.weekTitle')}
              </h2>
              <p className="text-xs text-[#b9b6d5]">
                {t('dash.weekSub')}
              </p>
            </div>
            <div className="text-xs font-black text-[#ffd166] flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{t('dash.totalXp').replace('{n}', (userProfile.xp || 0).toLocaleString())}</span>
            </div>
          </div>

          {/* Real recent quiz results */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-[#b9b6d5]">{t('dash.recentQuizzes')}</div>
            {recentQuizzes.length === 0 ? (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-xs text-[#b9b6d5] leading-relaxed">
                {t('dash.noQuiz')}
              </div>
            ) : (
              recentQuizzes.map(([quizId, q]) => (
                <div
                  key={quizId}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black border ${
                        q.total > 0 && q.score / q.total >= 0.7
                          ? "bg-[#c4ff55]/15 text-[#c4ff55] border-[#c4ff55]/30"
                          : "bg-[#ff9c66]/15 text-[#ff9c66] border-[#ff9c66]/30"
                      }`}
                    >
                      {q.total > 0 ? Math.round((q.score / q.total) * 100) : 0}%
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {t('dash.correctAnswers').replace('{score}', String(q.score)).replace('{total}', String(q.total))}
                      </div>
                      <div className="text-[10px] text-[#b9b6d5]/70">
                        {new Date(q.date).toLocaleDateString("ar-EG-u-nu-latn", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </div>
                    </div>
                  </div>
                  <Award
                    className={`w-4 h-4 ${
                      q.total > 0 && q.score / q.total >= 0.7
                        ? "text-[#c4ff55]"
                        : "text-[#b9b6d5]/40"
                    }`}
                  />
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center border-t border-white/10">
            <div className="p-2 rounded-xl bg-white/5">
              <div className="text-[10px] text-[#b9b6d5]">{t('dash.completedLessons')}</div>
              <div className="text-base font-black text-[#41e7ff]">
                {t('dash.lessonsCount').replace('{n}', String(progress.completedLessons.length))}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <div className="text-[10px] text-[#b9b6d5]">{t('dash.quizAccuracy')}</div>
              <div className="text-base font-black text-[#c4ff55]">
                {quizAccuracy === null ? "—" : `${quizAccuracy}%`}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <div className="text-[10px] text-[#b9b6d5]">{t('dash.streakDays')}</div>
              <div className="text-base font-black text-[#ffd166]">
                {t('dash.daysValue').replace('{n}', String(userProfile.streakDays))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 FLAGSHIP LEARNING SYSTEMS: 5,000 SENTENCES & MOVIE STUDIO */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: 5,000 Essential English Sentences Library */}
        <div
          onClick={() => {
            playSound("click");
            onNavigate("sentences");
          }}
          className="relative rounded-3xl p-6 sm:p-8 bg-linear-to-br from-[#1d1b40] via-[#14122d] to-[#0c0b20] border border-[#ffd166]/30 hover:border-[#ffd166] transition-all duration-300 cursor-pointer shadow-xl group overflow-hidden flex flex-col justify-between space-y-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none group-hover:opacity-100 transition-opacity" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#ffd166]/20 border border-[#ffd166]/40 flex items-center justify-center text-[#ffd166] shadow-md">
                <BookText className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('dash.libBadge')}</span>
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#ffd166] transition-colors">
                {t('dash.libTitle')}
              </h3>
              <p className="text-xs font-mono text-[#ffd166]/80 en mt-0.5">
                5,000 Essential English Sentences Library
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#dedbf4] leading-relaxed">
              {t('dash.libDesc')}
            </p>

            {/* CEFR mini pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {CEFR_LEVELS.map(lvl => (
                <span key={lvl} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-[#b9b6d5]">
                  <strong className="text-white">{lvl}</strong>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
            <span className="text-xs text-[#b9b6d5] font-bold">{t('dash.libFoot')}</span>
            <span className="text-xs font-black text-[#ffd166] flex items-center gap-1 group-hover:-translate-x-1.5 transition-transform">
              <span>{t('dash.libCta')}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </span>
          </div>
        </div>

        {/* Card 2: Learn English Through Movies Studio */}
        <div
          onClick={() => {
            playSound("click");
            onNavigate("movies");
          }}
          className="relative rounded-3xl p-6 sm:p-8 bg-linear-to-br from-[#241334] via-[#170e28] to-[#0c0b20] border border-[#ff4f9a]/30 hover:border-[#ff4f9a] transition-all duration-300 cursor-pointer shadow-xl group overflow-hidden flex flex-col justify-between space-y-6"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff4f9a]/10 rounded-full blur-3xl pointer-events-none group-hover:opacity-100 transition-opacity" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#ff4f9a]/20 border border-[#ff4f9a]/40 flex items-center justify-center text-[#ff4f9a] shadow-md">
                <Film className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#ff4f9a]/20 text-[#ff4f9a] border border-[#ff4f9a]/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('dash.movieBadge')}</span>
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#ff4f9a] transition-colors">
                {t('dash.movieTitle')}
              </h3>
              <p className="text-xs font-mono text-[#ff4f9a]/80 en mt-0.5">
                Learn English Through Movies Studio
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#dedbf4] leading-relaxed">
              {t('dash.movieDesc')}
            </p>

            {/* Feature mini pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['dash.movieFeat.search', 'dash.movieFeat.translation', 'dash.movieFeat.inspect', 'dash.movieFeat.quizzes', 'dash.movieFeat.repeat', 'dash.movieFeat.echo'].map(f => (
                <span key={f} className="px-2 py-0.5 rounded-md bg-[#ff4f9a]/10 border border-[#ff4f9a]/20 text-[10px] text-[#ffd166]">
                  {t(f)}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
            <span className="text-xs text-[#b9b6d5] font-bold">The Godfather • Forrest Gump • The Dark Knight...</span>
            <span className="text-xs font-black text-[#ff4f9a] flex items-center gap-1 group-hover:-translate-x-1.5 transition-transform">
              <span>{t('dash.movieCta')}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </span>
          </div>
        </div>
      </section>

      {/* 3. ACADEMIES HUB (THE 8 CORE ACADEMIES) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <GraduationCap className="w-6 h-6 text-[#ffd166]" />
              {t('dash.hubsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#dedbf4]">
              {t('dash.hubsSub')}
            </p>
          </div>

          <button
            onClick={() => {
              playSound("click");
              onNavigate("courses");
            }}
            className="text-xs font-bold text-[#41e7ff] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto py-2 -my-2"
          >
            <span>{t('dash.viewAllCourses')}</span>
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
                    <span>{t('dash.enterAcademy')}</span>
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
        <div className="lg:col-span-7 min-w-0">
          <BadgeCollection badges={badges} compact onNavigate={onNavigate} />
        </div>

        {/* Practice Lab & Placement Test Promotion */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-7 bg-linear-to-br from-[#1b1939] to-[#121128] border border-white/10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('dash.placementBadge')}</span>
            </div>

            <h3 className="text-xl font-black text-white leading-snug">
              {t('dash.placementTitle')}
            </h3>

            <p className="text-xs text-[#dedbf4] leading-relaxed">
              {t('dash.placementDesc')}
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
              <span>{t('dash.placementCta')}</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>

            <button
              onClick={() => {
                playSound("click");
                onNavigate("practice");
              }}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t('dash.practiceCta')}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
