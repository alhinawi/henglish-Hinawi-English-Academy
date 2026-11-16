import React, { useEffect, useState } from "react";
import { PageRoute, CEFRLevel } from "../types";
import { COURSES_CATALOG, COURSE_LEVELS, CourseItem } from "../data/coursesData";
import {
  GRAMMAR_VIDEO_RESOURCES,
  LessonVideoResource,
  extractYouTubeId,
  isValidYouTubeId,
} from "../data/videoResourcesData";
import { YouTubeVideoPlayer } from "../components/YouTubeVideoPlayer";
import { playSound, fireCelebration, speakEnglish } from "../utils/audio";
import {
  ShieldCheck,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  Eye,
  EyeOff,
  BookOpen,
  Users,
  BarChart3,
  Sparkles,
  Save,
  Video,
  Mic,
  ExternalLink,
  RefreshCw,
  Play,
  Volume2,
  AlertTriangle,
  Award,
  Activity,
  Cpu,
} from "lucide-react";
import { AdminAiManagementSection } from "../components/admin/AdminAiManagementSection";
import { AdminTtsManagementSection } from "../components/admin/AdminTtsManagementSection";
import { useLanguage } from "../i18n/LanguageContext";
import { getSavedAuthSession } from "../services/authService";
import { apiAdminOverview, AdminOverview } from "../services/henglishApi";

interface AdminDashboardPageProps {
  onNavigate: (route: PageRoute) => void;
}

interface SpeakingEvalRecord {
  id: string;
  studentName: string;
  timestamp: string;
  targetSentence: string;
  overallScore: number;
  scores: {
    pronunciation: number;
    fluency: number;
    accuracy: number;
    completeness: number;
  };
  mispronouncedCount: number;
  wpm: number;
  phoneticTipAr?: string;
}

// Course level values are domain data (CourseItem.level), labels are i18n keys.
const COURSE_LEVEL_KEYS = ['admin.level.beginner', 'admin.level.intermediate', 'admin.level.advanced', 'admin.level.all'];
const COURSE_LEVEL_OPTIONS = COURSE_LEVELS.map((value, i) => [value, COURSE_LEVEL_KEYS[i]] as [CourseItem['level'], string]);

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
}) => {
  const [courses, setCourses] = useState<CourseItem[]>(COURSES_CATALOG);
  const [activeTab, setActiveTab] = useState<
    "courses" | "lessons" | "students" | "videos" | "speaking" | "ai" | "tts"
  >("courses");

  // Video Management State
  const initialVideos: (LessonVideoResource & { topicKey: string })[] = Object.entries(GRAMMAR_VIDEO_RESOURCES).flatMap(
    ([topicKey, vids]) => vids.map(v => ({ ...v, topicKey }))
  );
  const [videoList, setVideoList] = useState(initialVideos);
  const [previewVideo, setPreviewVideo] = useState<(LessonVideoResource & { topicKey: string }) | null>(null);

  // New Video Form State
  const [vidTopic, setVidTopic] = useState("future-perfect");
  const [vidUrl, setVidUrl] = useState("");
  const [vidTitle, setVidTitle] = useState("");
  const [vidTitleAr, setVidTitleAr] = useState("");
  const [vidChannel, setVidChannel] = useState("BBC Learning English");
  const [vidDuration, setVidDuration] = useState("10:00");
  const [vidSaved, setVidSaved] = useState(false);
  const [vidError, setVidError] = useState("");

  // Speaking Evaluations State
  const { t } = useLanguage();
  // Real speaking evaluations only (local log); no seeded demo records.
  const [speakingEvals, setSpeakingEvals] = useState<SpeakingEvalRecord[]>(() => {
    try {
      const saved = localStorage.getItem("henglish_speaking_evaluations_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Real admin overview from the server (no mock roster).
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [overviewState, setOverviewState] = useState<"loading" | "ready" | "unavailable">("loading");
  useEffect(() => {
    const token = getSavedAuthSession().accessToken;
    if (!token) { setOverviewState("unavailable"); return; }
    let live = true;
    apiAdminOverview(token).then(({ body }) => {
      if (!live) return;
      if (body) { setOverview(body); setOverviewState("ready"); }
      else setOverviewState("unavailable");
    });
    return () => { live = false; };
  }, []);

  // New Course Modal / Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLevel, setNewLevel] = useState<CourseItem["level"]>(COURSE_LEVELS[1]);
  const [formSaved, setFormSaved] = useState(false);

  // New Lesson Form State
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSubtitle, setLessonSubtitle] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  const [lessonKicker, setLessonKicker] = useState("MODULE 09 • ADVANCED");
  const [lessonLevel, setLessonLevel] = useState<CEFRLevel>("B2");
  const [lessonExplanation, setLessonExplanation] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [lessonSaved, setLessonSaved] = useState(false);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playSound("correct");
    fireCelebration();

    const newCourse: CourseItem = {
      id: `course-${Date.now()}`,
      title: newTitle,
      titleEn: newTitleEn || "New Course",
      description: newDesc || t("admin.defaultCourseDesc"),
      level: newLevel,
      lessonsCount: 6,
      duration: t("admin.defaultCourseDuration"),
      rating: 5.0,
      studentsCount: 1,
      tag: t("admin.newCourseTag"),
      icon: "",
    };

    setCourses((prev) => [newCourse, ...prev]);
    setNewTitle("");
    setNewTitleEn("");
    setNewDesc("");
    setFormSaved(true);
    setTimeout(() => setFormSaved(false), 3000);
  };

  const handleDeleteCourse = (id: string) => {
    playSound("click");
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    playSound("correct");
    fireCelebration();
    setLessonSaved(true);
    setTimeout(() => {
      setLessonSaved(false);
      setLessonTitle("");
      setLessonSubtitle("");
      setLessonDesc("");
      setLessonExplanation("");
    }, 2500);
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setVidError("");
    const extractedId = extractYouTubeId(vidUrl);
    if (!extractedId || !isValidYouTubeId(extractedId)) {
      setVidError(t("admin.invalidYouTube"));
      playSound("wrong");
      return;
    }

    const newVid: LessonVideoResource & { topicKey: string } = {
      id: `vid-${Date.now()}`,
      youtubeId: extractedId,
      title: vidTitle || "Grammar Video Lesson",
      titleAr: vidTitleAr || t("admin.defaultVideoTitleAr"),
      channelName: vidChannel || "BBC Learning English",
      duration: vidDuration || "10:00",
      thumbnailUrl: `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`,
      descriptionAr: t("admin.defaultVideoDescAr"),
      topicKey: vidTopic,
    };

    setVideoList((prev) => [newVid, ...prev]);
    playSound("correct");
    fireCelebration();
    setVidSaved(true);
    setVidUrl("");
    setVidTitle("");
    setVidTitleAr("");
    setTimeout(() => setVidSaved(false), 3000);
  };

  const handleDeleteVideo = (id: string) => {
    playSound("click");
    setVideoList((prev) => prev.filter((v) => v.id !== id));
  };

  const handleClearSpeakingEvals = () => {
    playSound("click");
    localStorage.removeItem("henglish_speaking_evaluations_v2");
    setSpeakingEvals([]);
  };

  return (
    <div className="space-y-10 pb-16 text-right">
      {/* Admin Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>
              TEACHER & CONTENT STUDIO • استوديو المعلم وإدارة المحتوى
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            {t('admin.heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            {t('admin.heroSub')}
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => {
                playSound("click");
                setActiveTab("courses");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === "courses"
                  ? "bg-[#ffd166] text-[#0c0b20] shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              {t('admin.tab.courses')} ({courses.length})
            </button>

            <button
              onClick={() => {
                playSound("click");
                setActiveTab("lessons");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === "lessons"
                  ? "bg-[#41e7ff] text-[#0c0b20] shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              {t('admin.tab.lessons')}
            </button>

            <button
              onClick={() => {
                playSound("click");
                setActiveTab("students");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === "students"
                  ? "bg-[#c4ff55] text-[#0c0b20] shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              {t('admin.tab.students')} ({overview ? overview.counts.users.toLocaleString('en-US') : '—'})
            </button>

            <button
              onClick={() => {
                playSound("click");
                setActiveTab("videos");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "videos"
                  ? "bg-[#ff8bb9] text-[#0c0b20] shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>{t('admin.tab.videos')} ({videoList.length})</span>
            </button>

            <button
              onClick={() => {
                playSound("click");
                setActiveTab("speaking");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "speaking"
                  ? "bg-[#9b7bff] text-white shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{t('admin.tab.speaking')} ({speakingEvals.length})</span>
            </button>

            <button
              onClick={() => {
                playSound("click");
                setActiveTab("ai");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "ai"
                  ? "bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-[#0c0b20] shadow-lg font-black"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{t('admin.tab.ai')}</span>
            </button>

            <button
              onClick={() => {
                playSound("click");
                setActiveTab("tts");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "tts"
                  ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-lg font-black"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{t('admin.tab.tts')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
          <div className="text-xs text-[#b9b6d5]">{t('admin.stats.users')}</div>
          <div className="text-2xl font-black text-[#41e7ff]">
            {overview ? overview.counts.users.toLocaleString('en-US') : '—'}
          </div>
          <div className="text-[11px] text-[#c4ff55]">{overview ? t('admin.stats.newThisWeek').replace('{n}', overview.counts.newUsers.toLocaleString('en-US')) : t('admin.overview.loading')}</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
          <div className="text-xs text-[#b9b6d5]">{t('admin.stats.courses')}</div>
          <div className="text-2xl font-black text-[#ffd166]">
            {courses.length.toLocaleString('en-US')}
          </div>
          <div className="text-[11px] text-[#b9b6d5]">
            {t('admin.stats.coursesSub')}
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
          <div className="text-xs text-[#b9b6d5]">{t('admin.stats.sessions')}</div>
          <div className="text-2xl font-black text-[#c4ff55]">{overview ? overview.counts.sessions.toLocaleString('en-US') : '—'}</div>
          <div className="text-[11px] text-[#b9b6d5]">{t('admin.stats.sessionsSub')}</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
          <div className="text-xs text-[#b9b6d5]">{t('admin.stats.progress')}</div>
          <div className="text-2xl font-black text-[#ff8bb9]">{overview ? overview.counts.progress.toLocaleString('en-US') : '—'}</div>
          <div className="text-[11px] text-[#b9b6d5]">{t('admin.stats.progressSub')}</div>
        </div>
      </div>

      {/* TAB 1: COURSES MANAGEMENT */}
      {activeTab === "courses" && (
        <section className="space-y-8">
          {/* Create New Course Form */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#ffd166]" />
              إضافة كورس أو مسار تعليمي جديد
            </h2>

            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#dedbf4]">
                    عنوان الكورس بالعربية:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t('admin.phCourseTitle')}
                    className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffd166]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#dedbf4]">
                    العنوان بالإنجليزية (Title En):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    lang="en"
                    value={newTitleEn}
                    onChange={(e) => setNewTitleEn(e.target.value)}
                    placeholder="e.g. Master All Past Tenses"
                    className="english-input en w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffd166]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#dedbf4]">
                    المستوى المستهدف:
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffd166]"
                  >
                    {COURSE_LEVEL_OPTIONS.map(([value, key]) => (
                      <option key={value} value={value}>{t(key)}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#dedbf4]">
                    الوصف التعليمي المختصر:
                  </label>
                  <input
                    type="text"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder={t('admin.phCourseOutcomes')}
                    className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffd166]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin.saveCourse')}</span>
              </button>

              {formSaved && (
                <div className="p-3 rounded-xl bg-[#c4ff55]/15 border border-[#c4ff55]/40 text-[#c4ff55] text-xs font-bold">
                 تم إنشاء الكورس وإضافته لقائمة الكورسات النشطة بنجاح!
                </div>
              )}
            </form>
          </div>

          {/* Active Courses List */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-white">
              قائمة الكورسات الحالية في المنصة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.icon}</span>
                      <h3 className="text-base font-black text-white">
                        {c.title}
                      </h3>
                    </div>
                    <p className="en text-xs font-mono text-[#41e7ff]">
                      {c.titleEn}
                    </p>
                    <div className="text-[11px] text-[#b9b6d5]">
                      {c.description}
                    </div>
                    <div className="flex items-center gap-2 pt-1 text-[10px] text-[#ffd166]">
                      <span>{c.level}</span>
                      <span>•</span>
                      <span>{c.lessonsCount} دروس</span>
                      <span>•</span>
                      <span>{c.duration}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() =>
                        onNavigate(
                          c.id === "future-perfect"
                            ? "courses/grammar/future-perfect"
                            : "courses",
                        )
                      }
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white cursor-pointer"
                      title={t('admin.previewCourse')}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      className="p-2 rounded-xl bg-[#ff4f9a]/10 hover:bg-[#ff4f9a]/20 text-[#ff4f9a] cursor-pointer"
                      title={t('admin.deleteCourse')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: LESSON MANAGEMENT */}
      {activeTab === "lessons" && (
        <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#41e7ff]" />
              محرر الدروس الأكاديمية (Lesson Studio)
            </h2>
            <p className="text-xs text-[#b9b6d5]">
              أضف درساً جديداً إلى المنظومة بمفاهيم الشرح، الأمثلة، والصيغة
              الذهبية:
            </p>
          </div>

          <form onSubmit={handleCreateLesson} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white">
                  عنوان الدرس بالعربية:
                </label>
                <input
                  type="text"
                  required
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder={t('admin.phLessonTitle')}
                  className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#41e7ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white">
                  العنوان بالإنجليزية (Subtitle):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  lang="en"
                  value={lessonSubtitle}
                  onChange={(e) => setLessonSubtitle(e.target.value)}
                  placeholder="e.g. Comparatives & Superlatives"
                  className="english-input en w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#41e7ff]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white">
                  المستوى المعياري CEFR:
                </label>
                <select
                  value={lessonLevel}
                  onChange={(e) => setLessonLevel(e.target.value as any)}
                  className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#41e7ff]"
                >
                  <option value="A1">{t('admin.cefr.a1')}</option>
                  <option value="A2">{t('admin.cefr.a2')}</option>
                  <option value="B1">{t('admin.cefr.b1')}</option>
                  <option value="B2">{t('admin.cefr.b2')}</option>
                  <option value="C1">{t('admin.cefr.c1')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white">
                مقدمة وفكرة الدرس:
              </label>
              <textarea
                rows={3}
                value={lessonDesc}
                onChange={(e) => setLessonDesc(e.target.value)}
                placeholder={t('admin.phLessonExpl')}
                className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#41e7ff]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-white">
                الشرح التفصيلي والنصائح بالمصري (Egyptian Tips):
              </label>
              <textarea
                rows={4}
                value={lessonExplanation}
                onChange={(e) => setLessonExplanation(e.target.value)}
                placeholder={t('admin.phLessonNotes')}
                className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#41e7ff]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#41e7ff]"
                />
                <span>{t('admin.publishNow')}</span>
              </label>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{t('admin.saveLesson')}</span>
              </button>
            </div>

            {lessonSaved && (
              <div className="p-4 rounded-2xl bg-[#c4ff55]/15 border border-[#c4ff55]/40 text-[#c4ff55] text-xs font-bold">
                {t('admin.lessonSaved')}
              </div>
            )}
          </form>
        </section>
      )}

      {/* TAB 3: STUDENTS ROSTER */}
      {activeTab === "students" && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-[#c4ff55]" />
                {t('admin.students.title')}
              </h2>
              <p className="text-xs text-[#b9b6d5]">
                {t('admin.students.desc')}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[#b9b6d5]">
                  <th className="py-3 px-4">{t('admin.th.name')}</th>
                  <th className="py-3 px-4">{t('admin.th.email')}</th>
                  <th className="py-3 px-4">{t('admin.th.joined')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {overviewState === 'loading' && (
                  <tr><td colSpan={3} className="py-6 px-4 text-center text-[#b9b6d5]">{t('admin.overview.loading')}</td></tr>
                )}
                {overviewState === 'unavailable' && (
                  <tr><td colSpan={3} className="py-6 px-4 text-center text-[#b9b6d5]">{t('admin.overview.unavailable')}</td></tr>
                )}
                {overviewState === 'ready' && overview && overview.recentUsers.length === 0 && (
                  <tr><td colSpan={3} className="py-6 px-4 text-center text-[#b9b6d5]">{t('admin.students.empty')}</td></tr>
                )}
                {overviewState === 'ready' && overview?.recentUsers.map((u) => (
                  <tr
                    key={u.email + u.createdAt}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold">{u.name}</td>
                    <td dir="ltr" className="py-3.5 px-4 text-[#b9b6d5] font-mono text-xs text-right">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-[#b9b6d5]">
                      {new Date(u.createdAt).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 4: VIDEOS MANAGEMENT */}
      {activeTab === "videos" && (
        <section className="space-y-8">
          {/* Add Video Form */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#ff8bb9]" />
              {t('admin.videoFormTitle')}
            </h2>
            <p className="text-xs text-[#b9b6d5]">
              {t('admin.videoFormDesc')}
            </p>

            <form onSubmit={handleAddVideo} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#dedbf4]">
                    الدرس / القاعدة المرتبطة:
                  </label>
                  <select
                    value={vidTopic}
                    onChange={(e) => setVidTopic(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ff8bb9]"
                  >
                    <option value="future-perfect">{t('admin.topic.futurePerfect')}</option>
                    <option value="present-simple">{t('admin.topic.presentSimple')}</option>
                    <option value="present-continuous">{t('admin.topic.presentContinuous')}</option>
                    <option value="present-perfect">{t('admin.topic.presentPerfect')}</option>
                    <option value="past-simple">{t('admin.topic.pastSimple')}</option>
                    <option value="past-continuous">{t('admin.topic.pastContinuous')}</option>
                    <option value="past-perfect">{t('admin.topic.pastPerfect')}</option>
                    <option value="conditionals">{t('admin.topic.conditionals')}</option>
                    <option value="passive-voice">{t('admin.topic.passiveVoice')}</option>
                    <option value="reported-speech">{t('admin.topic.reportedSpeech')}</option>
                    <option value="modals">{t('admin.topic.modalVerbs')}</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-[#dedbf4]">
                    رابط الفيديو على يوتيوب (URL or ID):
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={vidUrl}
                    onChange={(e) => setVidUrl(e.target.value)}
                    placeholder={t('admin.phYouTubeUrl')}
                    className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ff8bb9] font-mono"
                  />
                  {vidUrl && (
                    <div className="text-[11px] pt-1">
                      {isValidYouTubeId(extractYouTubeId(vidUrl) || "") ? (
                        <span className="text-[#c4ff55] font-bold">
                         معرف يوتيوب صالح: {extractYouTubeId(vidUrl)}
                        </span>
                      ) : (
                        <span className="text-[#ff4f9a] font-bold">
                         الرابط أو المعرف غير صالح
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#dedbf4]">
                    عنوان الفيديو بالإنجليزية:
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    required
                    value={vidTitle}
                    onChange={(e) => setVidTitle(e.target.value)}
                    placeholder="e.g. Present Simple and Continuous Gameshow"
                    className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ff8bb9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#dedbf4]">
                    العنوان والشرح بالعربية:
                  </label>
                  <input
                    type="text"
                    required
                    value={vidTitleAr}
                    onChange={(e) => setVidTitleAr(e.target.value)}
                    placeholder={t('admin.phVideoTitle')}
                    className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ff8bb9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#dedbf4]">
                    اسم القناة التعليمية:
                  </label>
                  <input
                    type="text"
                    value={vidChannel}
                    onChange={(e) => setVidChannel(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ff8bb9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#dedbf4]">
                    مدة الفيديو:
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={vidDuration}
                    onChange={(e) => setVidDuration(e.target.value)}
                    placeholder="9:40"
                    className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ff8bb9] font-mono"
                  />
                </div>
              </div>

              {vidError && (
                <div className="p-3 rounded-xl bg-[#ff4f9a]/15 border border-[#ff4f9a]/40 text-[#ff4f9a] text-xs font-bold">
                 {vidError}
                </div>
              )}

              {vidSaved && (
                <div className="p-3 rounded-xl bg-[#c4ff55]/15 border border-[#c4ff55]/40 text-[#c4ff55] text-xs font-bold">
                 تم التحقق من الفيديو وإضافته إلى قائمة موارد المنهج بنجاح!
                </div>
              )}

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-linear-to-r from-[#ff8bb9] to-[#ffd166] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin.addVideo')}</span>
              </button>
            </form>
          </div>

          {/* Video Preview Modal / Box if active */}
          {previewVideo && (
            <div className="glass-panel p-6 rounded-3xl border border-[#ff8bb9]/40 space-y-4 bg-[#141029]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Play className="w-4 h-4 text-[#ff8bb9]" />
                    {t('admin.previewPlayer')} التفاعلي: {previewVideo.titleAr}
                  </h3>
                  <p className="text-xs text-[#b9b6d5] font-mono">
                    YouTube ID: {previewVideo.youtubeId} • {previewVideo.channelName}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewVideo(null)}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                >
                  إغلاق المعاينة
                </button>
              </div>

              <div className="max-w-2xl mx-auto">
                <YouTubeVideoPlayer
                  resources={[previewVideo]}
                  lessonTitle={previewVideo.titleAr}
                />
              </div>
            </div>
          )}

          {/* Videos Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-white">
                مكتبة الفيديوهات المعتمدة ({videoList.length} فيديو تم التحقق منها)
              </h2>
              <span className="text-xs text-[#c4ff55] font-mono">100% Live & Embeddable</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {videoList.map((vid) => (
                <div
                  key={vid.id}
                  className="glass-panel rounded-2xl p-4 border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black/60 group">
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-white font-mono">
                        {vid.duration}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#ffd166]/90 text-[#0c0b20] text-[10px] font-bold">
                        {vid.topicKey}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">{vid.titleAr}</h4>
                      <p className="text-xs text-[#dedbf4] font-['Outfit',sans-serif] line-clamp-1" dir="ltr">
                        {vid.title}
                      </p>
                      <span className="text-[11px] text-[#ff8bb9] block pt-1">
                        قناة: {vid.channelName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      onClick={() => {
                        playSound("click");
                        setPreviewVideo(vid);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#ff8bb9]/20 hover:bg-[#ff8bb9]/30 text-[#ff8bb9] text-xs font-bold cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{t('admin.previewPlayer')}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#41e7ff]"
                        title={t('admin.openOnYouTube')}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="p-1.5 rounded-lg bg-[#ff4f9a]/10 hover:bg-[#ff4f9a]/25 text-[#ff4f9a] cursor-pointer"
                        title={t('admin.removeFromSystem')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TAB 5: SPEAKING ASSESSMENTS */}
      {activeTab === "speaking" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-[#9b7bff]" />
                سجل تقييمات التحدث الصوتي ومخارج الحروف
              </h2>
              <p className="text-xs text-[#b9b6d5]">
                نتائج التقييم الصوتي الحقيقي للطلاب ومعدلات الطلاقة وسرعة الكلمات بالدقيقة (WPM)
              </p>
            </div>

            <button
              onClick={handleClearSpeakingEvals}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold cursor-pointer"
            >
              {t('admin.speaking.clearLog')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
              <span className="text-xs text-[#b9b6d5]">{t('admin.speaking.avgPron')}</span>
              <div className="text-2xl font-black text-[#c4ff55]">
                {speakingEvals.length > 0
                  ? Math.round(
                      speakingEvals.reduce((acc, cur) => acc + cur.scores.pronunciation, 0) /
                        speakingEvals.length
                    )
                  : 0}
                %
              </div>
              <span className="text-[11px] text-[#dedbf4]">{t('admin.speaking.fromRecorded')}</span>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
              <span className="text-xs text-[#b9b6d5]">{t('admin.speaking.avgWpm')}</span>
              <div className="text-2xl font-black text-[#41e7ff]">
                {speakingEvals.length > 0
                  ? Math.round(
                      speakingEvals.reduce((acc, cur) => acc + cur.wpm, 0) /
                        speakingEvals.length
                    )
                  : 0}{" "}
                {t('admin.speaking.wpmUnit')}
              </div>
              <span className="text-[11px] text-[#dedbf4]">{t('admin.speaking.wpmRange')}</span>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
              <span className="text-xs text-[#b9b6d5]">{t('admin.speaking.total')}</span>
              <div className="text-2xl font-black text-[#ffd166]">
                {t('admin.speaking.sessions').replace('{n}', String(speakingEvals.length))}
              </div>
              <span className="text-[11px] text-[#dedbf4]">{t('admin.speaking.realMic')}</span>
            </div>
          </div>

          {speakingEvals.length === 0 && (
            <div className="p-8 rounded-2xl border border-dashed border-white/15 text-center text-sm text-[#b9b6d5]">
              {t('admin.speaking.empty')}
            </div>
          )}
          <div className="space-y-4">
            {speakingEvals.map((ev) => (
              <div
                key={ev.id}
                className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{ev.studentName}</span>
                      <span className="text-[11px] text-[#b9b6d5]">
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-[#dedbf4] bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2" dir="ltr">
                      <span>"{ev.targetSentence}"</span>
                      <button
                        onClick={() => speakEnglish(ev.targetSentence)}
                        className="text-[#41e7ff] hover:text-white"
                        title={t('admin.listenTarget')}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <span className="text-[10px] text-[#b9b6d5] block">{t('admin.speaking.overall')}</span>
                      <span
                        className={`text-xl font-black ${
                          ev.overallScore >= 85
                            ? "text-[#c4ff55]"
                            : ev.overallScore >= 70
                            ? "text-[#ffd166]"
                            : "text-[#ff4f9a]"
                        }`}
                      >
                        {ev.overallScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/5 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-[10px] text-[#b9b6d5] block">{t('admin.speaking.pron')}</span>
                    <span className="font-bold text-white">{ev.scores.pronunciation}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-[10px] text-[#b9b6d5] block">{t('admin.speaking.fluency')}</span>
                    <span className="font-bold text-[#41e7ff]">{ev.scores.fluency}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-[10px] text-[#b9b6d5] block">{t('admin.speaking.accuracy')}</span>
                    <span className="font-bold text-[#ffd166]">{ev.scores.accuracy}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-[10px] text-[#b9b6d5] block">{t('admin.speaking.completeness')}</span>
                    <span className="font-bold text-[#c4ff55]">{ev.scores.completeness}%</span>
                  </div>
                </div>

                {ev.phoneticTipAr && (
                  <div className="p-3 rounded-xl bg-[#9b7bff]/15 border border-[#9b7bff]/30 text-xs text-[#dedbf4]">
                   <strong className="text-[#9b7bff]">{t('admin.speaking.tip')} </strong>
                    {ev.phoneticTipAr}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 6: AI MULTI-PROVIDER MANAGEMENT */}
      {activeTab === "ai" && <AdminAiManagementSection />}

      {/* TAB 7: MULTI-TIER CLOUD TTS MANAGEMENT */}
      {activeTab === "tts" && <AdminTtsManagementSection />}
    </div>
  );
};
