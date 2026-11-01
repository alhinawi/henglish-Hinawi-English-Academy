import React, { useState } from 'react';
import { PageRoute } from '../types';
import { FUTURE_PERFECT_LESSONS } from '../data/futurePerfectCourse';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
import { 
  Clock, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Lightbulb
} from 'lucide-react';

interface LessonPageProps {
  lessonId: string;
  onNavigate: (route: PageRoute, lessonId?: string) => void;
  onMarkComplete: (lessonId: string) => void;
  isCompleted: boolean;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  lessonId,
  onNavigate,
  onMarkComplete,
  isCompleted,
}) => {
  const currentLesson = FUTURE_PERFECT_LESSONS.find(l => l.id === lessonId) || FUTURE_PERFECT_LESSONS[0];
  const currentIndex = FUTURE_PERFECT_LESSONS.findIndex(l => l.id === currentLesson.id);

  const prevLesson = currentIndex > 0 ? FUTURE_PERFECT_LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < FUTURE_PERFECT_LESSONS.length - 1 ? FUTURE_PERFECT_LESSONS[currentIndex + 1] : null;

  // Personal notes textarea state
  const [personalNote, setPersonalNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Mini quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const handleSelectQuiz = (qId: string, optIdx: number, correctIdx: number) => {
    if (selectedAnswers[qId] !== undefined) return;
    setSelectedAnswers({ ...selectedAnswers, [qId]: optIdx });
    if (optIdx === correctIdx) {
      playSound('correct');
    } else {
      playSound('wrong');
    }
  };

  const handleCompleteLesson = () => {
    playSound('correct');
    fireCelebration();
    onMarkComplete(currentLesson.id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#b9b6d5] font-semibold flex-wrap">
        <button 
          onClick={() => { playSound('click'); onNavigate('home'); }} 
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
        <button 
          onClick={() => { playSound('click'); onNavigate('courses/grammar/future-perfect'); }} 
          className="hover:text-white transition-colors cursor-pointer"
        >
          أزمنة المستقبل: المستقبل التام
        </button>
        <span>/</span>
        <span className="text-[#ffd166] font-bold">الدرس 0{currentLesson.number}</span>
      </nav>

      {/* Lesson Header Banner with Online Photo Hero */}
      <header className="glass-panel rounded-3xl border border-white/10 overflow-hidden relative">
        {currentLesson.imageUrl && (
          <div className="h-56 sm:h-72 w-full relative overflow-hidden">
            <img 
              src={currentLesson.imageUrl} 
              alt={currentLesson.imageAlt || currentLesson.title} 
              className="w-full h-full object-cover filter brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0c0b20] via-[#0c0b20]/60 to-transparent" />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/90 text-[#21132c] shadow-md">
                {currentLesson.kicker}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#09091a]/80 text-[#c4ff55] border border-white/10 backdrop-blur-md">
                {currentLesson.level}
              </span>
            </div>
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-white/90 bg-[#09091a]/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#ffd166]" />
              <span>{currentLesson.readTime}</span>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-4 relative z-10 -mt-6">
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            {currentLesson.title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="en text-sm sm:text-base font-bold text-[#41e7ff]">
              {currentLesson.subtitle}
            </span>
            <button
              onClick={() => speakEnglish(currentLesson.subtitle)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#41e7ff] transition-colors cursor-pointer"
              title="استمع للعنوان بالإنجليزي"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed pt-2">
            {currentLesson.description}
          </p>

          {/* Key Takeaway Callout */}
          <div className="mt-4 p-4 rounded-2xl bg-linear-to-r from-[#ffd166]/10 to-[#ff4f9a]/10 border border-[#ffd166]/30 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#ffd166] shrink-0 mt-0.5" />
            <div className="text-sm text-white leading-relaxed">
              <strong className="text-[#ffd166]">الخلاصة الجوهرية: </strong>
              {currentLesson.keyTakeaway}
            </div>
          </div>
        </div>
      </header>

      {/* Formula Section (if present) */}
      {currentLesson.formula && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-[#41e7ff] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>THE GOLDEN FORMULA • التركيبة الذهبية</span>
          </div>
          
          <div className="en flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 p-4 sm:p-6 rounded-2xl bg-black/40 border border-white/10 text-center">
            {currentLesson.formula.tokens.map((token, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-xl text-[#b9b6d5] font-black">+</span>}
                <div className="flex flex-col items-center">
                  <span className={`px-4 py-2.5 rounded-xl font-black text-base sm:text-xl border shadow-md ${
                    token.color === 'subject'
                      ? 'bg-white/10 text-white border-white/20'
                      : token.color === 'will'
                      ? 'bg-[#41e7ff]/15 text-[#41e7ff] border-[#41e7ff]/40 shadow-[0_0_15px_rgba(65,231,255,0.2)]'
                      : token.color === 'have'
                      ? 'bg-[#ffd166]/15 text-[#ffd166] border-[#ffd166]/40 shadow-[0_0_15px_rgba(255,209,102,0.2)]'
                      : token.color === 'v3'
                      ? 'bg-[#c4ff55]/15 text-[#c4ff55] border-[#c4ff55]/40 shadow-[0_0_15px_rgba(196,255,85,0.2)]'
                      : 'bg-[#ff4f9a]/15 text-[#ff4f9a] border-[#ff4f9a]/40'
                  }`}>
                    {token.text}
                  </span>
                  <span className="text-[10px] text-[#b9b6d5] font-semibold mt-1.5 font-['Cairo']">
                    {token.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-[#b9b6d5] bg-white/5 p-3 rounded-xl border border-white/10">
            💡 {currentLesson.formula.notes}
          </p>
        </section>
      )}

      {/* Egyptian Arabic Tips & Mindset */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <span>شرح بطريقة سهلة وبالمصري 🧠</span>
        </h3>
        <div className="space-y-3">
          {currentLesson.egyptianArabicTips.map((tip, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-[#09091a]/80 border border-white/10 text-sm text-[#dedbf4] leading-relaxed flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-lg bg-[#41e7ff]/20 text-[#41e7ff] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real-Life Examples Section */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>أمثلة واقعية مع النطق الصوتي 💬</span>
          </h3>
          <span className="text-xs text-[#b9b6d5]">اضغط على أيقونة الصوت للاستماع</span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {currentLesson.examples.map((ex, idx) => (
            <div 
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-[#171632] border border-white/10 hover:border-white/20 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#ffd166]">
                  {ex.context || `مثال 0${idx + 1}`}
                </span>
                <button
                  onClick={() => {
                    playSound('click');
                    speakEnglish(ex.en);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#41e7ff] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                  title="استمع للمثال الإنجليزي"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استماع</span>
                </button>
              </div>

              <p className="en text-base sm:text-lg font-bold text-white leading-relaxed">
                {ex.en}
              </p>
              <p className="text-xs sm:text-sm text-[#b9b6d5] border-t border-white/5 pt-2">
                {ex.ar}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tense Showdown Section (if present) */}
      {currentLesson.contrastSection && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>🥊 {currentLesson.contrastSection.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
              {currentLesson.contrastSection.description}
            </p>
          </div>

          <div className="space-y-3">
            {currentLesson.contrastSection.comparisons.map((c, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-[#09091a] border border-white/10 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#41e7ff]/15 text-[#41e7ff]">
                    {c.tense}
                  </span>
                  <button
                    onClick={() => speakEnglish(c.sentence)}
                    className="p-1 text-[#b9b6d5] hover:text-white"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="en text-base font-bold text-white">
                  {c.sentence}
                </p>
                <p className="text-xs sm:text-sm text-[#ffd166] font-semibold">
                  المعنى: {c.meaning}
                </p>
                <p className="text-xs text-[#b9b6d5]">
                  {c.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Common Traps & Mistakes */}
      {currentLesson.commonMistakes.length > 0 && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="text-lg font-black text-[#ff4f9a] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>احذر من هذه الأخطاء الشائعة ⚠️</span>
          </h3>

          <div className="space-y-3">
            {currentLesson.commonMistakes.map((m, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-[#09091a] border border-[#ff4f9a]/20 space-y-2 text-sm"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                  <div className="en text-[#ff4f9a] font-bold">
                    ❌ غلط: {m.wrong}
                  </div>
                  <div className="en text-[#c4ff55] font-bold">
                    ✅ صح: {m.correct}
                  </div>
                </div>
                <p className="text-xs text-[#dedbf4]">
                  <strong className="text-[#ffd166]">السبب: </strong>
                  {m.reason}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mini Quiz */}
      {currentLesson.miniQuiz.length > 0 && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center gap-2 text-xs font-black text-[#ffd166] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>MINI KNOWLEDGE CHECK • اختبار سريع على الدرس</span>
          </div>

          <div className="space-y-6">
            {currentLesson.miniQuiz.map((q, qIdx) => {
              const answered = selectedAnswers[q.id] !== undefined;
              const chosen = selectedAnswers[q.id];
              const isCorrect = chosen === q.answer;

              return (
                <div key={q.id} className="p-5 rounded-2xl bg-[#09091a] border border-white/10 space-y-3">
                  <p className="en text-base font-black text-white">
                    {qIdx + 1}. {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = 'bg-[#171632] hover:bg-[#201d43] border-white/10 text-white';
                      if (answered) {
                        if (optIdx === q.answer) {
                          btnStyle = 'bg-[#c4ff55]/20 border-[#c4ff55] text-[#c4ff55] font-black';
                        } else if (chosen === optIdx) {
                          btnStyle = 'bg-[#ff4f9a]/20 border-[#ff4f9a] text-[#ff4f9a]';
                        } else {
                          btnStyle = 'opacity-40 bg-[#171632] border-white/5 text-[#b9b6d5]';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectQuiz(q.id, optIdx, q.answer)}
                          disabled={answered}
                          className={`en p-3 rounded-xl border text-sm text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {answered && optIdx === q.answer && (
                            <CheckCircle2 className="w-4 h-4 text-[#c4ff55]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {answered && (
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-[#dedbf4]">
                      <strong className={isCorrect ? 'text-[#c4ff55]' : 'text-[#ff4f9a]'}>
                        {isCorrect ? '✅ إجابة صحيحة! ' : '❌ إجابة غير صحيحة. '}
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Homework Notebook Area */}
      {currentLesson.homeworkPrompt && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>تحدي التطبيق الشخصي (Notebook) ✍️</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#b9b6d5]">
            {currentLesson.homeworkPrompt}
          </p>
          <textarea
            rows={3}
            dir="ltr"
            lang="en"
            value={personalNote}
            onChange={e => {
              setPersonalNote(e.target.value);
              setNoteSaved(false);
            }}
            placeholder="Write your English practice sentence here..."
            className="english-input en w-full p-4 rounded-2xl bg-[#09091a] border border-white/15 text-white placeholder-[#b9b6d5]/50 text-sm focus:outline-none focus:border-[#41e7ff]"
          />
          <div className="flex items-center justify-between text-xs">
            <button
              onClick={() => {
                playSound('click');
                setNoteSaved(true);
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#41e7ff] font-bold cursor-pointer transition-colors"
            >
              حفظ الملاحظة
            </button>
            {noteSaved && <span className="text-[#c4ff55] font-bold">تم الحفظ بنجاح! ✨</span>}
          </div>
        </section>
      )}

      {/* Lesson Complete Button & Nav Controls */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {isCompleted ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c4ff55]/15 border border-[#c4ff55]/30 text-[#c4ff55] text-sm font-black">
              <CheckCircle2 className="w-4 h-4" />
              <span>أكملت هذا الدرس بنجاح! 🎉</span>
            </div>
          ) : (
            <button
              onClick={handleCompleteLesson}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer transition-all hover:scale-105"
            >
              تحديد كدرس مكتمل ✅
            </button>
          )}
        </div>

        {/* Prev / Next Lesson Navigation */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {prevLesson && (
            <button
              onClick={() => {
                playSound('click');
                onNavigate('lesson', prevLesson.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-bold text-[#dedbf4] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الدرس السابق (0{prevLesson.number})</span>
            </button>
          )}

          {nextLesson && (
            <button
              onClick={() => {
                playSound('click');
                onNavigate('lesson', nextLesson.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm hover:brightness-110 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>الدرس التالي (0{nextLesson.number})</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
