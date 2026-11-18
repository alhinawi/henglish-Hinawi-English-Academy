import { quizHistoryTitle } from '../utils/quizHistoryTitle';
import { futurePerfectProgress } from '../services/courseProgress';
import { BadgeCollection } from '../components/BadgeCollection';
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
  NotebookPen,
  BookOpen,
  Sparkles,
  Trash2,
  Calendar,
  Clock,
  Target,
  ExternalLink,
  Flame,
  FileCheck2,
} from "lucide-react";
import { useLanguage } from '../i18n/LanguageContext';

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
  const { t, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookmarks" | "notes" | "quizzes" | "certificate"
  >("overview");

  const bookmarks = progress.bookmarks || [];
  const notes = progress.notes || [];
  const quizScores = Object.entries(progress.quizScores || {});

  return (
    <div dir={dir} className="space-y-10 pb-16 text-start">
      {/* Page Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#ffd166]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#ffd166]/20 text-[#ffd166] border border-[#ffd166]/40 shadow-sm">
            <BookmarkCheck className="w-4 h-4" />
            <span>{t('ml.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            {t('ml.title')}
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            {t('ml.blurb')}
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
              {t('ml.tabOverview')}
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
              {t('ml.tabBookmarks')} ({bookmarks.length})
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
              {t('ml.tabNotes')} ({notes.length})
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
              {t('ml.tabQuizzes')} ({quizScores.length})
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
              {t('ml.tabCerts')}
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: OVERVIEW & PROGRESS */}
      {activeTab === "overview" && (
        <section className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
              <div className="text-xs text-[#b9b6d5]">{t('ml.level')}</div>
              <div className="text-2xl font-black text-[#ffd166]">
                {userProfile.currentLevel} ({t(`lv.${userProfile.currentLevel}`)})
              </div>
              <div className="text-[11px] text-[#41e7ff]">
                {t('ml.nextGoal')} {userProfile.targetLevel}
                <p>{t('ml.levelNote')}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
              <div className="text-xs text-[#b9b6d5]">{t('ml.xp')}</div>
              <div className="text-2xl font-black text-[#c4ff55]">
                {userProfile.xp.toLocaleString()} XP
              </div>
              <div className="text-[11px] text-[#b9b6d5]">
                {t('ml.practiceNote')}
              </div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
              <div className="text-xs text-[#b9b6d5]">
                {t('ml.streakDays')}
              </div>
              <div className="text-2xl font-black text-[#ff8bb9]">
                {userProfile.streakDays} {t('ml.daysUnit')}
              </div>
              <div className="text-[11px] text-[#b9b6d5]">{t('ml.streakNote')}</div>
            </div>

            <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
              <div className="text-xs text-[#b9b6d5]">{t('ml.fpAchievement')}</div>
              <div className="text-2xl font-black text-[#41e7ff]">
                {completionPercentage}%
              </div>
              <div className="text-[11px] text-[#c4ff55]">
                {futurePerfectProgress(progress.completedLessons).count} {t('ml.lessonsComplete')}
              </div>
            </div>
          </div>

          <BadgeCollection badges={badges} compact onNavigate={onNavigate} />
        </section>
      )}

      {/* TAB 2: BOOKMARKS */}
      {activeTab === "bookmarks" && (
        <section className="space-y-4">
          <h2 className="text-xl font-black text-white">
            {t('ml.bookmarksTitle')}
          </h2>
          {bookmarks.length === 0 ? (
            <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center space-y-3">
              <BookmarkCheck className="w-10 h-10 mx-auto text-[#ffd166]" />
              <p className="text-sm text-[#b9b6d5]">
                {t('ml.noBookmarks')}
              </p>
              <button
                onClick={() => onNavigate("grammar")}
                className="px-6 py-2.5 rounded-xl bg-[#ffd166] text-[#0c0b20] font-black text-xs cursor-pointer"
              >
                {t('ml.browseGrammar')}
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
                      {t('ml.savedAt')} {bm.savedAt}
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
            {t('ml.notesTitle')}
          </h2>
          {notes.length === 0 ? (
            <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center space-y-3">
              <NotebookPen className="w-10 h-10 mx-auto text-[#41e7ff]" />
              <p className="text-sm text-[#b9b6d5]">
                {t('ml.noNotes')}
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
                      <span>{t('ml.lessonPrefix')} {note.lessonTitle}</span>
                      <button
                        onClick={() => {
                          playSound("click");
                          onDeleteNote(note.id);
                        }}
                        className="p-1 rounded text-[#ff4f9a] hover:bg-[#ff4f9a]/10 cursor-pointer"
                        title={t('ml.deleteNote')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-white leading-relaxed bg-[#09091a] p-3 rounded-xl border border-white/5">
                      {note.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#b9b6d5] pt-2 border-t border-white/5">
                    <span>{t('ml.editedAt')} {note.updatedAt}</span>
                    <button
                      onClick={() => onNavigate("lesson", note.lessonId)}
                      className="text-[#41e7ff] hover:underline cursor-pointer"
                    >
                      {t('ml.openLesson')}
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
            {t('ml.quizTitle')}
          </h2>

          {quizScores.length === 0 ? (
            <p className="text-sm text-[#b9b6d5] text-center py-8">
              {t('ml.noQuizzes')}
            </p>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[#b9b6d5]">
                    <th className="py-3 px-4">{t('ml.thQuiz')}</th>
                    <th className="py-3 px-4">{t('ml.thScore')}</th>
                    <th className="py-3 px-4">{t('ml.thPercent')}</th>
                    <th className="py-3 px-4">{t('ml.thDate')}</th>
                    <th className="py-3 px-4">{t('ml.thGrade')}</th>
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
                        <td className="py-3.5 px-4 font-bold"><span dir="auto">{quizHistoryTitle(qId, t)}</span></td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#ffd166]">
                          <span dir="ltr" className="inline-block whitespace-nowrap tabular-nums">{data.score} / {data.total}</span>
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
                            {percent >= 80 ? t('ml.excellent') : t('ml.reviewNeeded')}
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

      {/* Certificates are issued and verified by the certificate service only. */}
      {activeTab === "certificate" && (
        <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-[#ffd166]/40 space-y-4">
          <h2 className="text-2xl font-black text-white">{t('ml.certificateCenter')}</h2>
          <p className="text-sm text-[#dedbf4] leading-relaxed">{t('ml.certificateNote')}</p>
          <button onClick={() => onNavigate('certificates')}
            className="px-6 py-3 rounded-xl bg-[#ffd166] text-[#0c0b20] font-bold text-sm">
            {t('ml.openCertificates')}
          </button>
        </section>
      )}
    </div>
  );
};
