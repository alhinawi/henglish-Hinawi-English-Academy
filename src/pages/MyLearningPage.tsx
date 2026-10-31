import React, { useState } from "react";
import {
  PageRoute,
  UserProfile,
  UserProgressState,
  AchievementBadge,
  PersonalNote,
  BookmarkItem,
} from "../types";
import { playSound, fireCelebration } from "../utils/audio";
import {
  BookmarkCheck,
  BookOpen,
  Award,
  Sparkles,
  Trash2,
  Calendar,
  Clock,
  Target,
  ExternalLink,
  Flame,
  FileCheck2,
  Printer,
} from "lucide-react";

interface MyLearningPageProps {
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  userProfile: UserProfile;
  progress: UserProgressState;
  badges: AchievementBadge[];
  onDeleteNote: (noteId: string) => void;
  completionPercentage: number;
}

export const MyLearningPage: React.FC<MyLearningPageProps> = ({
  onNavigate,
  userProfile,
  progress,
  badges,
  onDeleteNote,
  completionPercentage,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookmarks" | "notes" | "quizzes" | "certificate"
  >("overview");
  const [showCertificate, setShowCertificate] = useState(false);

  const bookmarks = progress.bookmarks || [];
  const notes = progress.notes || [];
  const quizScores = Object.entries(progress.quizScores || {});

  return (
    <div className="space-y-10 pb-16 text-right">
      {/* Page Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-sm">
            <BookmarkCheck className="w-4 h-4" />
            <span>MY LEARNING HUB • ملف الطالب وسجل الإنجازات</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            مساحتي الخاصة وسجل التعلم 🎓
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            مرحباً بك في مساحتك التعليمية الشخصية. هنا تجد دروسك المحفوظة،
            ملاحظاتك المدونة أثناء الشرح، نتائج اختباراتك التراكمية، وشهادات
            إتمام الكورسات.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={() => {
                playSound("click");
                setActiveTab("overview");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#ffd166] text-[#0c0b20] shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              نظرة عامة والتقدم
            </button>

            <button
              onClick={() => {
                playSound("click");
                setActiveTab("bookmarks");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "bookmarks"
                  ? "bg-[#41e7ff] text-[#0c0b20] shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              الدروس المحفوظة ({bookmarks.length})
            </button>

            <button
              onClick={() => {
                playSound("click");
                setActiveTab("notes");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "notes"
                  ? "bg-[#c4ff55] text-[#0c0b20] shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              ملاحظاتي الشخصية ({notes.length})
            </button>

            <button
              onClick={() => {
                playSound("click");
                setActiveTab("quizzes");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "quizzes"
                  ? "bg-[#ff4f9a] text-white shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              سجل الاختبارات ({quizScores.length})
            </button>

            <button
              onClick={() => {
                playSound("click");
                setActiveTab("certificate");
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "certificate"
                  ? "bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              🏆 الشهادات المعتمدة
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: OVERVIEW & PROGRESS */}
      {activeTab === "overview" && (
        <section className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
              <div className="text-xs text-[#b9b6d5]">المستوى الأكاديمي</div>
              <div className="text-2xl font-black text-[#ffd166]">
                {userProfile.currentLevel} (Intermediate)
              </div>
              <div className="text-[11px] text-[#41e7ff]">
                الهدف القادم: {userProfile.targetLevel}
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
              <div className="text-xs text-[#b9b6d5]">نقاط الخبرة (XP)</div>
              <div className="text-2xl font-black text-[#c4ff55]">
                {userProfile.xp.toLocaleString()} XP
              </div>
              <div className="text-[11px] text-[#b9b6d5]">
                المرتبة: بطل الأكاديمية ⚡
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
              <div className="text-xs text-[#b9b6d5]">
                أيام التعلم المتتالية
              </div>
              <div className="text-2xl font-black text-[#ff8bb9]">
                {userProfile.streakDays} أيام 🔥
              </div>
              <div className="text-[11px] text-[#b9b6d5]">آخر جلسة: اليوم</div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
              <div className="text-xs text-[#b9b6d5]">إنجاز المستقبل التام</div>
              <div className="text-2xl font-black text-[#41e7ff]">
                {completionPercentage}%
              </div>
              <div className="text-[11px] text-[#c4ff55]">
                {progress.completedLessons.length} من 8 دروس مكتملة
              </div>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#ffd166]" />
              شارات التميز والإنجازات الحاصل عليها
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    b.unlocked
                      ? "bg-linear-to-b from-[#ffd166]/15 to-transparent border-[#ffd166]/40 shadow-sm"
                      : "bg-white/5 border-white/5 opacity-40 grayscale"
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
        </section>
      )}

      {/* TAB 2: BOOKMARKS */}
      {activeTab === "bookmarks" && (
        <section className="space-y-4">
          <h2 className="text-xl font-black text-white">
            الدروس والصفحات المحفوظة في المفضلة
          </h2>
          {bookmarks.length === 0 ? (
            <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center space-y-3">
              <div className="text-4xl">🔖</div>
              <p className="text-sm text-[#b9b6d5]">
                لم تقم بحفظ أي دروس في المفضلة بعد.
              </p>
              <button
                onClick={() => onNavigate("grammar")}
                className="px-6 py-2.5 rounded-xl bg-[#ffd166] text-[#0c0b20] font-black text-xs cursor-pointer"
              >
                تصفح أكاديمية الجرامر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  onClick={() => {
                    playSound("click");
                    onNavigate(bm.route, bm.lessonId);
                  }}
                  className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#ffd166]/50 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#ffd166] px-2 py-0.5 rounded bg-white/5">
                      {bm.category}
                    </span>
                    <h3 className="text-base font-black text-white group-hover:text-[#ffd166] transition-colors">
                      {bm.title}
                    </h3>
                    <p className="text-xs text-[#b9b6d5]">{bm.subtitle}</p>
                    <span className="text-[10px] text-[#b9b6d5]/70">
                      تاريخ الحفظ: {bm.savedAt}
                    </span>
                  </div>

                  <ExternalLink className="w-5 h-5 text-[#41e7ff] group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 3: PERSONAL NOTES */}
      {activeTab === "notes" && (
        <section className="space-y-4">
          <h2 className="text-xl font-black text-white">
            ملاحظاتي الشخصية المدونة أثناء الدروس
          </h2>
          {notes.length === 0 ? (
            <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center space-y-3">
              <div className="text-4xl">📝</div>
              <p className="text-sm text-[#b9b6d5]">
                لم تقم بتدوين أي ملاحظات شخصية بعد.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#ffd166]">
                      <span>درس: {note.lessonTitle}</span>
                      <button
                        onClick={() => {
                          playSound("click");
                          onDeleteNote(note.id);
                        }}
                        className="p-1 rounded text-[#ff4f9a] hover:bg-[#ff4f9a]/10 cursor-pointer"
                        title="حذف الملاحظة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-white leading-relaxed bg-[#09091a] p-3 rounded-xl border border-white/5">
                      {note.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#b9b6d5] pt-2 border-t border-white/5">
                    <span>تاريخ التعديل: {note.updatedAt}</span>
                    <button
                      onClick={() => onNavigate("lesson", note.lessonId)}
                      className="text-[#41e7ff] hover:underline cursor-pointer"
                    >
                      فتح الدرس ⬅️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB 4: QUIZ SCORES HISTORY */}
      {activeTab === "quizzes" && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h2 className="text-xl font-black text-white">
            سجل نتائج الاختبارات والتقييمات
          </h2>

          {quizScores.length === 0 ? (
            <p className="text-sm text-[#b9b6d5] text-center py-8">
              لم تسجل درجات اختبارات حتى الآن.
            </p>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[#b9b6d5]">
                    <th className="py-3 px-4">اسم الاختبار</th>
                    <th className="py-3 px-4">الدرجة المحققة</th>
                    <th className="py-3 px-4">النسبة المئوية</th>
                    <th className="py-3 px-4">التاريخ</th>
                    <th className="py-3 px-4">التقييم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white">
                  {quizScores.map(([qId, data]) => {
                    const percent = Math.round(
                      (data.score / Math.max(1, data.total)) * 100,
                    );
                    return (
                      <tr
                        key={qId}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-bold">{qId}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#ffd166]">
                          {data.score} / {data.total}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#c4ff55]">
                          {percent}%
                        </td>
                        <td className="py-3.5 px-4 text-[#b9b6d5] text-xs">
                          {data.date.split("T")[0]}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-black ${
                              percent >= 80
                                ? "bg-[#c4ff55]/20 text-[#c4ff55]"
                                : "bg-[#ffd166]/20 text-[#ffd166]"
                            }`}
                          >
                            {percent >= 80 ? "ممتاز 🌟" : "جيد جداً 👍"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* TAB 5: CERTIFICATE */}
      {activeTab === "certificate" && (
        <section className="glass-panel rounded-3xl p-6 sm:p-12 border border-[#ffd166]/40 max-w-3xl mx-auto space-y-8 text-center shadow-2xl relative overflow-hidden">
          {/* Certificate Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="text-9xl font-black">HINAWI</span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-black uppercase text-[#ffd166] tracking-widest">
              OFFICIAL CERTIFICATE OF MASTERY
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-serif">
              شهادة إتمام معتمدة • أكاديمية هناوي
            </h2>
            <p className="text-xs text-[#b9b6d5]">
              Henglish Academy Academic Credential
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-black/40 border border-[#ffd166]/40 space-y-4 max-w-xl mx-auto">
            <p className="text-xs text-[#dedbf4]">
              تُشهد أكاديمية هناوي للغة الإنجليزية بأن الطالب المتميز:
            </p>
            <div className="text-2xl sm:text-3xl font-black text-[#ffd166] font-['Cairo',sans-serif]">
              {userProfile.nameAr} ({userProfile.name})
            </div>
            <p className="text-xs text-[#dedbf4] leading-relaxed">
              قد أتم بنجاح متطلبات دراسة واجتياز كورس:
              <br />
              <strong className="text-white text-base">
                المستقبل التام الشامل (Future Perfect Masterclass)
              </strong>
              <br />
              بتقدير امتياز وتفوق في كافة الاختبارات التحريرية والشفهية.
            </p>

            <div className="pt-4 flex items-center justify-between text-xs text-[#b9b6d5] border-t border-white/10">
              <span>المشرف الأكاديمي: أ. د. هناوي</span>
              <span>رقم التحقق: HNW-{userProfile.id}-2026</span>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="px-8 py-3 rounded-xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة أو حفظ الشهادة بصيغة PDF</span>
          </button>
        </section>
      )}
    </div>
  );
};
