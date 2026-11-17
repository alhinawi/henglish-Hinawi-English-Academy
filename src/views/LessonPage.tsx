import { LessonSpeechButton } from '../components/LessonSpeechButton';
import { LessonNoteEditor } from '../components/LessonNoteEditor';
import { LessonCorrection, MixedLessonText } from '../components/LessonCorrection';
import { LESSON_PHOTOGRAPHY } from '../data/lessonPhotography';
import React, { useState } from 'react';
import { PageRoute } from '../types';
import { FUTURE_PERFECT_LESSONS } from '../data/futurePerfectCourse';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { useLanguage } from '../i18n/LanguageContext';
import { playSound, fireCelebration } from '../utils/audio';
import { 
  Clock, 
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
  /** Rendered inside the single-page course view: anchor id, no breadcrumb. */
  embedded?: boolean;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  lessonId,
  onNavigate,
  onMarkComplete,
  isCompleted,
  embedded = false,
}) => {
  const { t } = useLanguage();
  const currentLesson = FUTURE_PERFECT_LESSONS.find(l => l.id === lessonId) || FUTURE_PERFECT_LESSONS[0];
  const currentIndex = FUTURE_PERFECT_LESSONS.findIndex(l => l.id === currentLesson.id);

  const prevLesson = currentIndex > 0 ? FUTURE_PERFECT_LESSONS[currentIndex - 1] : null;
  const nextLesson = currentIndex < FUTURE_PERFECT_LESSONS.length - 1 ? FUTURE_PERFECT_LESSONS[currentIndex + 1] : null;

  const appText = useAppTextMap('futurePerfectCourse');

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

  const scrollToLesson = (id: string) => {
    document.getElementById(`fp-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      id={embedded ? `fp-${currentLesson.id}` : undefined}
      className={embedded
        ? 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 scroll-mt-24'
        : 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10'}
    >

      {/* Breadcrumb Navigation */}
      {!embedded && (
      <nav className="flex items-center gap-2 text-xs text-[#b9b6d5] font-semibold flex-wrap">
        <button 
          onClick={() => { playSound('click'); onNavigate('home'); }} 
          className="hover:text-white transition-colors cursor-pointer"
        >
          {t('lp.home')}
        </button>
        <span>/</span>
        <button 
          onClick={() => { playSound('click'); onNavigate('grammar'); }} 
          className="hover:text-white transition-colors cursor-pointer"
        >
          {t('lp.grammarAcademy')}
        </button>
        <span>/</span>
        <button 
          onClick={() => { playSound('click'); onNavigate('courses/grammar/future-perfect'); }} 
          className="hover:text-white transition-colors cursor-pointer"
        >
          {t('lp.courseName')}
        </button>
        <span>/</span>
        <span className="text-[#ffd166] font-bold">{t('lp.lesson')} 0{currentLesson.number}</span>
      </nav>
      )}

      {/* Lesson Header Banner with Online Photo Hero */}
      <header className="glass-panel rounded-3xl border border-white/10 overflow-hidden relative">
        {currentLesson.imageUrl && (
          <div className="h-56 sm:h-72 w-full relative overflow-hidden">
            <img 
              src={LESSON_PHOTOGRAPHY[currentLesson.id][0].src}
              alt={LESSON_PHOTOGRAPHY[currentLesson.id][0].alt}
              width={1100} height={733} loading="eager" fetchPriority="high"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0c0b20]/50 via-transparent to-transparent" />
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#ffd166]/90 text-[#21132c] shadow-md">
                {txText(appText, currentLesson.kicker)}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#09091a]/80 text-[#c4ff55] border border-white/10 backdrop-blur-md">
                {txText(appText, currentLesson.level)}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-white/90 bg-[#09091a]/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
              <Clock className="w-3.5 h-3.5 text-[#ffd166]" />
              <span>{txText(appText, currentLesson.readTime)}</span>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-4 relative z-10 -mt-6">
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
            <MixedLessonText text={txText(appText, currentLesson.title)} />
          </h1>
          <div className="flex flex-wrap items-start gap-3">
            <span className="en text-sm sm:text-base font-bold text-[#41e7ff]">
              {txText(appText, currentLesson.subtitle)}
            </span>
            <LessonSpeechButton key={currentLesson.subtitle} text={currentLesson.subtitle} label={t('lp.listenTitle')} iconOnly className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#41e7ff] transition-colors cursor-pointer" />
          </div>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed pt-2">
            <MixedLessonText text={txText(appText, currentLesson.description)} />
          </p>

          {/* Key Takeaway Callout */}
          <div className="mt-4 p-4 rounded-2xl bg-linear-to-r from-[#ffd166]/10 to-[#ff4f9a]/10 border border-[#ffd166]/30 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#ffd166] shrink-0 mt-0.5" />
            <div className="text-sm text-white leading-relaxed">
              <strong className="text-[#ffd166]">{t('lp.keyTakeaway')} </strong>
              <MixedLessonText text={txText(appText, currentLesson.keyTakeaway)} />
            </div>
          </div>
        </div>
      </header>

      {/* Formula Section (if present) */}
      {currentLesson.formula && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-black text-[#41e7ff] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>THE GOLDEN FORMULA • {t('lp.goldenFormula')}</span>
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
           {txText(appText, currentLesson.formula.notes)}
          </p>
        </section>
      )}

      {/* Egyptian Arabic Tips & Mindset */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <span>{t('lp.easyExplain')}</span>
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
              <p>{txText(appText, tip)}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Real-Life Examples Section */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>{t('lp.examplesTitle')}</span>
          </h3>
          <span className="text-xs text-[#b9b6d5]">{t('lp.tapToListen')}</span>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {currentLesson.examples.map((ex, idx) => (
            <div 
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-[#171632] border border-white/10 hover:border-white/20 transition-all space-y-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="text-xs font-bold text-[#ffd166]">
                  {ex.context ? txText(appText, ex.context) : `${t('lp.example')} 0${idx + 1}`}
                </span>
                <LessonSpeechButton key={ex.en} text={ex.en} label={`${t('lp.listenExample')}: ${idx + 1}`} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#41e7ff] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold" />
              </div>

              <p className="en text-base sm:text-lg font-bold text-white leading-relaxed">
                {ex.en}
              </p>
              <p className="text-xs sm:text-sm text-[#b9b6d5] border-t border-white/5 pt-2">
                {txText(appText, ex.ar)}
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
              <span>{txText(appText, currentLesson.contrastSection.title)}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#b9b6d5] mt-1">
              {txText(appText, currentLesson.contrastSection.description)}
            </p>
          </div>

          <div className="space-y-3">
            {currentLesson.contrastSection.comparisons.map((c, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-[#09091a] border border-white/10 space-y-1.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-[#41e7ff]/15 text-[#41e7ff]">
                    {c.tense}
                  </span>
                  <LessonSpeechButton key={c.sentence} text={c.sentence} label={`${t('lp.listenExample')}: ${c.sentence}`} iconOnly className="p-1 text-[#b9b6d5] hover:text-white" />
                </div>
                <p className="en text-base font-bold text-white">
                  {c.sentence}
                </p>
                <p className="text-xs sm:text-sm text-[#ffd166] font-semibold">
                  {t('lp.meaning')} {txText(appText, c.meaning)}
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
            <span>{t('lp.trapsTitle')}</span>
          </h3>

          <div className="space-y-3">
            {currentLesson.commonMistakes.map((m, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-[#09091a] border border-[#ff4f9a]/20 space-y-2 text-sm"
              >
                <LessonCorrection wrong={m.wrong} correct={m.correct} />
                <p className="text-xs text-[#dedbf4]">
                  <strong className="text-[#ffd166]">{t('lp.reason')} </strong>
                  {txText(appText, m.reason)}
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
            <span>MINI KNOWLEDGE CHECK • {t('lp.miniQuiz')}</span>
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
                        {isCorrect ? t('lp.correct') + ' ' : t('lp.incorrect') + ' '}
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
            <span>{t('lp.homeworkTitle')}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#b9b6d5]">
            {txText(appText, currentLesson.homeworkPrompt)}
          </p>
          <LessonNoteEditor lessonId={currentLesson.id} />
        </section>
      )}

      {/* Lesson Complete Button & Nav Controls */}
      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {isCompleted ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c4ff55]/15 border border-[#c4ff55]/30 text-[#c4ff55] text-sm font-black">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('lp.completed')}</span>
            </div>
          ) : (
            <button
              onClick={handleCompleteLesson}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer transition-all hover:scale-105"
            >
              {t('lp.markComplete')}
            </button>
          )}
        </div>

        {/* Prev / Next Lesson Navigation */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {prevLesson && (
            <button
              onClick={() => {
                playSound('click');
                if (embedded) scrollToLesson(prevLesson.id);
                else {
                  onNavigate('lesson', prevLesson.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-bold text-[#dedbf4] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ChevronRight className="w-4 h-4" />
              <span>{t('lp.prevLesson')} (0{prevLesson.number})</span>
            </button>
          )}

          {nextLesson && (
            <button
              onClick={() => {
                playSound('click');
                if (embedded) scrollToLesson(nextLesson.id);
                else {
                  onNavigate('lesson', nextLesson.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-white font-black text-xs sm:text-sm hover:brightness-110 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{t('lp.nextLesson')} (0{nextLesson.number})</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
