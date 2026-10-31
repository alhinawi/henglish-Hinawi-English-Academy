import React from 'react';
import { UserProgressState, AchievementBadge, PageRoute } from '../types';
import { playSound } from '../utils/audio';
import { FUTURE_PERFECT_LESSONS } from '../data/futurePerfectCourse';
import { 
  Award, 
  CheckCircle2, 
  Flame, 
  RotateCcw, 
  BookOpen, 
  ShieldCheck
} from 'lucide-react';

interface ProgressPageProps {
  progress: UserProgressState;
  completionPercentage: number;
  badges: AchievementBadge[];
  onResetProgress: () => void;
  onNavigate: (route: PageRoute, lessonId?: string) => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  progress,
  completionPercentage,
  badges,
  onResetProgress,
  onNavigate,
}) => {
  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين كافة تقدمك في الكورس؟')) {
      playSound('wrong');
      onResetProgress();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/15 text-[#ffd166] border border-[#ffd166]/30">
            <Award className="w-3.5 h-3.5" />
            <span>LEARNER DASHBOARD & ANALYTICS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            لوحة المتابعة وتتبع الإنجاز 🏆
          </h1>
          <p className="text-sm sm:text-base text-[#b9b6d5] max-w-2xl leading-relaxed">
            شاهد تقدمك خطوة بخطوة في رحلة إتقان المستقبل التام، شارات التميز المكتسبة، وسجل درجاتك في الاختبارات.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة تعيين التقدم</span>
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Card */}
        <div className="glass-panel p-6 rounded-3xl border border-[#ffd166]/30 relative overflow-hidden">
          <span className="text-xs font-bold text-[#b9b6d5] block mb-2">
            نسبة إكمال الكورس
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#ffd166]">{completionPercentage}%</span>
            <span className="text-xs text-[#b9b6d5]">
              ({progress.completedLessons.length} من {FUTURE_PERFECT_LESSONS.length} دروس)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 mt-4 overflow-hidden">
            <div 
              className="h-full bg-linear-to-r from-[#ffd166] to-[#c4ff55] rounded-full transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Streak Card */}
        <div className="glass-panel p-6 rounded-3xl border border-[#ff4f9a]/30">
          <span className="text-xs font-bold text-[#b9b6d5] block mb-2">
            أيام الاستمرارية المتتالية
          </span>
          <div className="flex items-center gap-2">
            <Flame className="w-8 h-8 text-[#ff4f9a]" />
            <span className="text-4xl font-black text-white">{progress.studyStreakDays}</span>
            <span className="text-xs text-[#b9b6d5]">يوم استمرارية</span>
          </div>
          <p className="text-[11px] text-[#c4ff55] mt-3 font-semibold">
            استمر في التدرب يومياً لترقية شاراتك!
          </p>
        </div>

        {/* Flashcards Mastered */}
        <div className="glass-panel p-6 rounded-3xl border border-[#41e7ff]/30">
          <span className="text-xs font-bold text-[#b9b6d5] block mb-2">
            البطاقات المتقنة
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#41e7ff]">
              {progress.knownFlashcards.length}
            </span>
            <span className="text-xs text-[#b9b6d5]">بطاقة محفوظة</span>
          </div>
          <p className="text-[11px] text-[#b9b6d5] mt-3">
            {progress.reviewFlashcards.length} بطاقات بانتظار المراجعة
          </p>
        </div>

        {/* Quiz Attempts */}
        <div className="glass-panel p-6 rounded-3xl border border-[#c4ff55]/30">
          <span className="text-xs font-bold text-[#b9b6d5] block mb-2">
            الاختبارات المنجزة
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#c4ff55]">
              {Object.keys(progress.quizScores).length}
            </span>
            <span className="text-xs text-[#b9b6d5]">اختبار مكتمل</span>
          </div>
          <p className="text-[11px] text-[#b9b6d5] mt-3">
            جاهزية كاملة للامتحانات المتقدمة
          </p>
        </div>
      </div>

      {/* Achievement Badges Section */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#ffd166]" />
            <span>شارات التميز والإنجاز (Achievement Badges) 🏅</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
            أكمل الدروس والاختبارات لفتح جميع الشارات التقديرية.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border text-center transition-all ${
                badge.unlocked
                  ? 'bg-linear-to-b from-[#1b1939] to-[#13122b] border-[#ffd166]/50 shadow-[0_0_20px_rgba(255,209,102,0.15)]'
                  : 'bg-white/5 border-white/5 opacity-40'
              }`}
            >
              <span className="text-4xl block mb-2 filter drop-shadow">
                {badge.icon}
              </span>
              <h4 className="text-sm font-black text-white">
                {badge.title}
              </h4>
              <p className="text-[11px] text-[#b9b6d5] mt-1 leading-relaxed">
                {badge.description}
              </p>
              <span className={`inline-block mt-3 text-[10px] font-black px-2 py-0.5 rounded-full ${
                badge.unlocked
                  ? 'bg-[#c4ff55]/20 text-[#c4ff55]'
                  : 'bg-white/10 text-[#b9b6d5]'
              }`}>
                {badge.unlocked ? 'مكتسبة ✅' : 'مغلقة 🔒'}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Course Lessons Checklist */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <h3 className="text-xl font-black text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#41e7ff]" />
          <span>سجل الدروس ومراجعتها 📚</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {FUTURE_PERFECT_LESSONS.map(lesson => {
            const isCompleted = progress.completedLessons.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="p-4 rounded-2xl bg-[#09091a] border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isCompleted
                      ? 'bg-[#c4ff55]/20 text-[#c4ff55]'
                      : 'bg-white/5 text-[#b9b6d5]'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span>0{lesson.number}</span>}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">
                      {lesson.title}
                    </h5>
                    <span className="en text-xs text-[#b9b6d5]">
                      {lesson.subtitle}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    playSound('click');
                    onNavigate('lesson', lesson.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-bold text-[#41e7ff] hover:text-white cursor-pointer transition-colors shrink-0"
                >
                  {isCompleted ? 'مراجعة' : 'ابدأ'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Local Storage Privacy Note */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs text-[#b9b6d5]">
        <ShieldCheck className="w-5 h-5 text-[#c4ff55] shrink-0" />
        <p>
          <strong>خصوصية تامة: </strong>
          جميع بيانات دراستك ونقاطك وإنجازاتك محفوظة محلياً على متصفحك (Client-side LocalStorage) لضمان السرعة والخصوصية الفائقة دون الحاجة لبيانات شخصية أو كلمات مرور.
        </p>
      </div>

    </div>
  );
};
