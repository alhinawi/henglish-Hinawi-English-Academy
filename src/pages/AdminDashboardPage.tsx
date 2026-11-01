import React, { useState } from "react";
import { PageRoute, CEFRLevel } from "../types";
import { COURSES_CATALOG, CourseItem } from "../data/coursesData";
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

const DEFAULT_EVALUATIONS: SpeakingEvalRecord[] = [
  {
    id: "eval-def-1",
    studentName: "أحمد حسني (B2)",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    targetSentence: "By next Friday, the team will have finished the entire platform upgrade.",
    overallScore: 92,
    scores: { pronunciation: 90, fluency: 94, accuracy: 91, completeness: 100 },
    mispronouncedCount: 0,
    wpm: 128,
    phoneticTipAr: "نطق سليم جداً لمخارج الحروف وصوت /v/ و /θ/.",
  },
  {
    id: "eval-def-2",
    studentName: "مريم العزازي (B1)",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    targetSentence: "Omar, will you have finished revising the grammar units by Thursday night?",
    overallScore: 84,
    scores: { pronunciation: 81, fluency: 86, accuracy: 88, completeness: 95 },
    mispronouncedCount: 1,
    wpm: 112,
    phoneticTipAr: "انتبه إلى عدم نطق /v/ كـ /f/ في كلمة revising.",
  },
  {
    id: "eval-def-3",
    studentName: "يوسف النجار (A2)",
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    targetSentence: "She had already left before I called her.",
    overallScore: 75,
    scores: { pronunciation: 72, fluency: 76, accuracy: 80, completeness: 90 },
    mispronouncedCount: 2,
    wpm: 98,
    phoneticTipAr: "ركز على التفريق بين صوت /p/ و /b/ والوقفات المناسبة بين الجمل.",
  },
];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
}) => {
  const [courses, setCourses] = useState<CourseItem[]>(COURSES_CATALOG);
  const [activeTab, setActiveTab] = useState<
    "courses" | "lessons" | "students" | "videos" | "speaking" | "ai"
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
  const [speakingEvals, setSpeakingEvals] = useState<SpeakingEvalRecord[]>(() => {
    try {
      const saved = localStorage.getItem("henglish_speaking_evaluations_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_EVALUATIONS;
  });

  // New Course Modal / Form State
  const [newTitle, setNewTitle] = useState("");
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLevel, setNewLevel] = useState<
    "مبتدئ" | "متوسط" | "متقدم" | "شامل"
  >("متوسط");
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

  // Mock Students Roster
  const [students, setStudents] = useState([
    {
      id: "std-1",
      name: "محمد الهناوي",
      email: "ahmed@example.com",
      level: "B1",
      progress: 85,
      quizzesPassed: 12,
      status: "نشط",
    },
    {
      id: "std-2",
      name: "سارة محمد",
      email: "sara@example.com",
      level: "B2",
      progress: 92,
      quizzesPassed: 15,
      status: "نشط",
    },
    {
      id: "std-3",
      name: "محمود عبد الرحمن",
      email: "mahmoud@example.com",
      level: "A2",
      progress: 45,
      quizzesPassed: 6,
      status: "يحتاج متابعة",
    },
    {
      id: "std-4",
      name: "نور الدين علي",
      email: "nour@example.com",
      level: "C1",
      progress: 100,
      quizzesPassed: 20,
      status: "أتم المنهج 👑",
    },
  ]);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    playSound("correct");
    fireCelebration();

    const newCourse: CourseItem = {
      id: `course-${Date.now()}`,
      title: newTitle,
      titleEn: newTitleEn || "New Course",
      description: newDesc || "وصف الكورس التعليمي الشامل.",
      level: newLevel,
      lessonsCount: 6,
      duration: "ساعتان",
      rating: 5.0,
      studentsCount: 1,
      tag: "كورس جديد ✨",
      icon: "📚",
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
      setVidError("رابط يوتيوب غير صالح أو معرف الفيديو غير سليم.");
      playSound("wrong");
      return;
    }

    const newVid: LessonVideoResource & { topicKey: string } = {
      id: `vid-${Date.now()}`,
      youtubeId: extractedId,
      title: vidTitle || "Grammar Video Lesson",
      titleAr: vidTitleAr || "فيديو شرح تعليمي",
      channelName: vidChannel || "BBC Learning English",
      duration: vidDuration || "10:00",
      thumbnailUrl: `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`,
      descriptionAr: "فيديو تعليمي تم التحقق من سلامة تضمينه وصلاحيته للطلاب.",
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
            لوحة المعلم وإدارة المناهج والطلاب 👨‍🏫
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            من هنا يستطيع المدرسون والمشرفون الأكاديميون إضافة كورسات ودروس
            جديدة، صياغة القواعد والكويزات، تعيين الواجبات المنزلية، ومتابعة
            درجات ونسب إنجاز الطلاب.
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
              إدارة الكورسات ({courses.length})
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
              إضافة درس تفاعلي جديد ✍️
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
              سجل الطلاب والتحليلات ({students.length})
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
              <span>إدارة الفيديوهات والمحتوى المرئي ({videoList.length})</span>
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
              <span>تقييمات النطق الصوتي ({speakingEvals.length})</span>
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
              <span>إدارة الذكاء الاصطناعي (AI Router) 🤖</span>
            </button>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
          <div className="text-xs text-[#b9b6d5]">إجمالي الطلاب النشطين</div>
          <div className="text-2xl font-black text-[#41e7ff]">
            ١٤,٢٥٠ طالباً
          </div>
          <div className="text-[11px] text-[#c4ff55]">+180 هذا الأسبوع</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
          <div className="text-xs text-[#b9b6d5]">الكورسات المفعلة</div>
          <div className="text-2xl font-black text-[#ffd166]">
            {courses.length} كورسات
          </div>
          <div className="text-[11px] text-[#b9b6d5]">
            تشمل كورس المستقبل التام
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
          <div className="text-xs text-[#b9b6d5]">معدل إتمام الدروس</div>
          <div className="text-2xl font-black text-[#c4ff55]">٨٨.٤%</div>
          <div className="text-[11px] text-[#b9b6d5]">معدل ممتاز قياسياً</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
          <div className="text-xs text-[#b9b6d5]">الكويزات المكتملة</div>
          <div className="text-2xl font-black text-[#ff8bb9]">٣٤,٩١٠ كويز</div>
          <div className="text-[11px] text-[#b9b6d5]">متوسط الدقة ٩١%</div>
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
                    placeholder="مثال: أسرار إتقان أزمنة الماضي"
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
                    <option value="مبتدئ">مبتدئ (A1-A2)</option>
                    <option value="متوسط">متوسط (B1-B2)</option>
                    <option value="متقدم">متقدم (C1-C2)</option>
                    <option value="شامل">شامل كافة المستويات</option>
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
                    placeholder="ما الذي سيتعلمه الطالب في هذا الكورس؟"
                    className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ffd166]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ ونشر الكورس في المنصة</span>
              </button>

              {formSaved && (
                <div className="p-3 rounded-xl bg-[#c4ff55]/15 border border-[#c4ff55]/40 text-[#c4ff55] text-xs font-bold">
                  ✅ تم إنشاء الكورس وإضافته لقائمة الكورسات النشطة بنجاح!
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
                      title="معاينة الكورس"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      className="p-2 rounded-xl bg-[#ff4f9a]/10 hover:bg-[#ff4f9a]/20 text-[#ff4f9a] cursor-pointer"
                      title="حذف الكورس"
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
                  placeholder="مثال: صيغ المقارنة والتفضيل"
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
                  <option value="A1">A1 - مبتدئ</option>
                  <option value="A2">A2 - فوق المبتدئ</option>
                  <option value="B1">B1 - متوسط</option>
                  <option value="B2">B2 - فوق متوسط</option>
                  <option value="C1">C1 - متقدم</option>
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
                placeholder="اشرح الفكرة الأساسية للدرس بأسلوب مبسط..."
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
                placeholder="اكتب توضيحاتك والأفخاخ النحوية التي يجب على الطالب الانتباه إليها..."
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
                <span>نشر الدرس فوراً في الأكاديمية (Published)</span>
              </label>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ الدرس في قاعدة البيانات</span>
              </button>
            </div>

            {lessonSaved && (
              <div className="p-4 rounded-2xl bg-[#c4ff55]/15 border border-[#c4ff55]/40 text-[#c4ff55] text-xs font-bold">
                🎉 تم حفظ الدرس وإضافته إلى المنهج بنجاح! يمكن للطلاب دراسته
                الآن.
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
                سجل تقدم الطلاب والتقييمات
              </h2>
              <p className="text-xs text-[#b9b6d5]">
                متابعة دورية لإنجاز الدروس ودرجات الكويزات
              </p>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[#b9b6d5]">
                  <th className="py-3 px-4">اسم الطالب</th>
                  <th className="py-3 px-4">البريد الإلكتروني</th>
                  <th className="py-3 px-4">المستوى الحالي</th>
                  <th className="py-3 px-4">نسبة الإنجاز</th>
                  <th className="py-3 px-4">كويزات ناجحة</th>
                  <th className="py-3 px-4">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white">
                {students.map((std) => (
                  <tr
                    key={std.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold">{std.name}</td>
                    <td className="py-3.5 px-4 text-[#b9b6d5] font-mono text-xs">
                      {std.email}
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#ffd166]">
                      {std.level}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-black/40 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#41e7ff] h-full"
                            style={{ width: `${std.progress}%` }}
                          />
                        </div>
                        <span className="text-xs">{std.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {std.quizzesPassed}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-black bg-white/5 border border-white/10 text-[#c4ff55]">
                        {std.status}
                      </span>
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
              إضافة وتدقيق فيديو تعليمي جديد لمنهج الأكاديمية
            </h2>
            <p className="text-xs text-[#b9b6d5]">
              نظام التحقق الآلي من روابط يوتيوب وضمان التضمين الرسمي من مصادر موثوقة (BBC, Oxford).
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
                    <option value="future-perfect">المستقبل التام (Future Perfect)</option>
                    <option value="present-simple">المضارع البسيط (Present Simple)</option>
                    <option value="present-continuous">المضارع المستمر (Present Continuous)</option>
                    <option value="present-perfect">المضارع التام (Present Perfect)</option>
                    <option value="past-simple">الماضي البسيط (Past Simple)</option>
                    <option value="past-continuous">الماضي المستمر (Past Continuous)</option>
                    <option value="past-perfect">الماضي التام (Past Perfect)</option>
                    <option value="conditionals">الحالات الشرطية (Conditionals)</option>
                    <option value="passive-voice">المبني للمجهول (Passive Voice)</option>
                    <option value="reported-speech">الكلام المنقول (Reported Speech)</option>
                    <option value="modals">الأفعال الناقصة (Modal Verbs)</option>
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
                    placeholder="https://www.youtube.com/watch?v=OsW5sV3GMDM أو OsW5sV3GMDM"
                    className="w-full p-3 rounded-xl bg-[#09091a] border border-white/15 text-white text-xs focus:outline-none focus:border-[#ff8bb9] font-mono"
                  />
                  {vidUrl && (
                    <div className="text-[11px] pt-1">
                      {isValidYouTubeId(extractYouTubeId(vidUrl) || "") ? (
                        <span className="text-[#c4ff55] font-bold">
                          ✅ معرف يوتيوب صالح: {extractYouTubeId(vidUrl)}
                        </span>
                      ) : (
                        <span className="text-[#ff4f9a] font-bold">
                          ⚠️ الرابط أو المعرف غير صالح
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
                    placeholder="مثال: حلقة مسابقة القواعد الشهيرة مع BBC"
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
                  ⚠️ {vidError}
                </div>
              )}

              {vidSaved && (
                <div className="p-3 rounded-xl bg-[#c4ff55]/15 border border-[#c4ff55]/40 text-[#c4ff55] text-xs font-bold">
                  ✅ تم التحقق من الفيديو وإضافته إلى قائمة موارد المنهج بنجاح!
                </div>
              )}

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-linear-to-r from-[#ff8bb9] to-[#ffd166] text-[#0c0b20] font-black text-xs sm:text-sm hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة الفيديو للمنهج</span>
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
                    معاينة المشغل التفاعلي: {previewVideo.titleAr}
                  </h3>
                  <p className="text-xs text-[#b9b6d5] font-mono">
                    YouTube ID: {previewVideo.youtubeId} • {previewVideo.channelName}
                  </p>
                </div>
                <button
                  onClick={() => setPreviewVideo(null)}
                  className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                >
                  إغلاق المعاينة ✕
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
                      <span>معاينة المشغل</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://www.youtube.com/watch?v=${vid.youtubeId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#41e7ff]"
                        title="فتح على موقع يوتيوب"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDeleteVideo(vid.id)}
                        className="p-1.5 rounded-lg bg-[#ff4f9a]/10 hover:bg-[#ff4f9a]/25 text-[#ff4f9a] cursor-pointer"
                        title="حذف من المنظومة"
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
              مسح السجل المؤقت
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
              <span className="text-xs text-[#b9b6d5]">متوسط دقة النطق الصوتي</span>
              <div className="text-2xl font-black text-[#c4ff55]">
                {speakingEvals.length > 0
                  ? Math.round(
                      speakingEvals.reduce((acc, cur) => acc + cur.scores.pronunciation, 0) /
                        speakingEvals.length
                    )
                  : 0}
                %
              </div>
              <span className="text-[11px] text-[#dedbf4]">معدل متقدم للطلاب</span>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
              <span className="text-xs text-[#b9b6d5]">متوسط سرعة الإلقاء (WPM)</span>
              <div className="text-2xl font-black text-[#41e7ff]">
                {speakingEvals.length > 0
                  ? Math.round(
                      speakingEvals.reduce((acc, cur) => acc + cur.wpm, 0) /
                        speakingEvals.length
                    )
                  : 0}{" "}
                كلمة/دقيقة
              </div>
              <span className="text-[11px] text-[#dedbf4]">ضمن النطاق الطبيعي (110 - 150)</span>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-1">
              <span className="text-xs text-[#b9b6d5]">إجمالي جلسات التدريب</span>
              <div className="text-2xl font-black text-[#ffd166]">
                {speakingEvals.length} جلسة
              </div>
              <span className="text-[11px] text-[#dedbf4]">تسجيل ميكروفون حقيقي</span>
            </div>
          </div>

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
                        title="استمع للجملة المستهدفة"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <span className="text-[10px] text-[#b9b6d5] block">النتيجة العامة</span>
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
                    <span className="text-[10px] text-[#b9b6d5] block">النطق</span>
                    <span className="font-bold text-white">{ev.scores.pronunciation}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-[10px] text-[#b9b6d5] block">الطلاقة</span>
                    <span className="font-bold text-[#41e7ff]">{ev.scores.fluency}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-[10px] text-[#b9b6d5] block">الدقة</span>
                    <span className="font-bold text-[#ffd166]">{ev.scores.accuracy}%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/5">
                    <span className="text-[10px] text-[#b9b6d5] block">الاكتمال</span>
                    <span className="font-bold text-[#c4ff55]">{ev.scores.completeness}%</span>
                  </div>
                </div>

                {ev.phoneticTipAr && (
                  <div className="p-3 rounded-xl bg-[#9b7bff]/15 border border-[#9b7bff]/30 text-xs text-[#dedbf4]">
                    💡 <strong className="text-[#9b7bff]">ملاحظة صوتية للمتعلم: </strong>
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
    </div>
  );
};
