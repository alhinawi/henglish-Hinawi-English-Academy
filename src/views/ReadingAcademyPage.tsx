import { LessonSpeechButton } from '../components/LessonSpeechButton';
import { LiteracyAcademy } from '../components/LiteracyAcademy';
import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { PageRoute } from '../types';
import { LITERACY_READING } from '../data/literacyAcademyData';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { playSound, fireCelebration } from '../utils/audio';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Eye,
  Languages,
} from 'lucide-react';

interface ReadingAcademyPageProps {
  onNavigate: (route: PageRoute) => void;
  onCompleteActivity?: (id: string, score: number, total: number) => void;
}

export const ReadingAcademyPage: React.FC<ReadingAcademyPageProps> = ({ onNavigate, onCompleteActivity }) => {
  const { t } = useLanguage();
  const READING_PASSAGES = LITERACY_READING.filter(p => p.level === 'B1').slice(0, 4).map(p => ({ ...p, wordCount: p.content.split(/\s+/).length, estimatedTime: t('ra.free'), category: t('ra.category'), contentAr: t('ra.note'), comprehensionQuestions: [{ id: p.id + '-legacy', question: p.question, options: p.options, answer: p.answer, explanation: t('ra.answer') + p.options[p.answer] }] }));
  const [selectedPassageIdx, setSelectedPassageIdx] = useState(0);
  const appText = useAppTextMap('literacyAcademyData');
  const [showArabic, setShowArabic] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const passage = READING_PASSAGES[selectedPassageIdx] || READING_PASSAGES[0];

  const handleToggleTimer = () => {
    playSound('click');
    setTimerActive(prev => !prev);
  };

  const handleAnswerQuiz = (qId: string, optIdx: number, correctIdx: number) => {
    if (quizAnswers[qId] !== undefined) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
    if (optIdx === correctIdx) {
      playSound('correct');
      fireCelebration();
    } else {
      playSound('wrong');
    }
  };

  return (
    <div className="space-y-10 pb-16 text-right">
      <LiteracyAcademy kind="reading" onCompleteActivity={onCompleteActivity} />
      <details className="rounded-3xl border border-white/10 p-4"><summary className="cursor-pointer font-bold text-slate-200">{t('ra.extras')}</summary>
      <div className="mt-6 space-y-8">
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/40 shadow-sm">
            <BookOpen className="w-4 h-4" />
            <span>{t('ra.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            {t('ra.title')}
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            {t('ra.intro')}
          </p>
        </div>
      </section>

      {/* 1. PASSAGE SELECTOR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {READING_PASSAGES.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => {
              playSound('click');
              setSelectedPassageIdx(idx);
              setShowArabic(false);
              setQuizAnswers({});
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
              selectedPassageIdx === idx
                ? 'bg-linear-to-r from-[#41e7ff] to-[#ffd166] text-[#0c0b20] font-black shadow-lg'
                : 'bg-white/5 text-[#dedbf4] hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>{txText(appText, p.titleAr)}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/70 text-white font-mono">
              {p.level} • {p.estimatedTime}
            </span>
          </button>
        ))}
      </div>

      {/* 2. READING PASSAGE VIEWER */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ffd166] mb-1">
              <span>{txText(appText, passage.category)}</span>
              <span>•</span>
              <span className="en">{t('ra.wordCount').replace('{count}', String(passage.wordCount))}</span>
              <span>•</span>
              <span>{t('ra.level')} {passage.level}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{txText(appText, passage.title)}</h2>
          </div>

          <div className="flex flex-wrap items-start gap-3 self-start sm:self-auto">
            <button
              onClick={() => {
                playSound('click');
                setShowArabic(prev => !prev);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#dedbf4] flex items-center gap-1.5 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-[#ffd166]" />
              <span>{showArabic ? t('ra.hideNote') : t('ra.showNote')}</span>
            </button>

            <LessonSpeechButton key={passage.id} text={passage.content} label={t('ra.listen')} iconOnly className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#41e7ff] cursor-pointer" />
          </div>
        </div>

        {/* Text Body */}
        <div className="space-y-6 text-left">
          <div className="en text-base sm:text-lg text-white leading-relaxed font-serif bg-black/30 p-6 sm:p-8 rounded-2xl border border-white/5">
            {passage.content}
          </div>

          {showArabic && (
            <div className="text-right text-sm text-[#dedbf4] leading-relaxed bg-[#171632] p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs font-bold text-[#ffd166]">{t('ra.noteTitle')}</span>
              <p>{txText(appText, passage.contentAr)}</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. READING COMPREHENSION QUESTIONS */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#ffd166]" />
            {t('ra.quiz')}
          </h3>
          <span className="shrink-0 text-xs text-[#b9b6d5]">{t('ra.questionCount').replace('{count}', String(passage.comprehensionQuestions.length))}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {passage.comprehensionQuestions.map((q, qIdx) => {
            const answered = quizAnswers[q.id] !== undefined;
            const chosen = quizAnswers[q.id];

            return (
              <div key={q.id} className="p-5 rounded-2xl bg-[#09091a] border border-white/10 space-y-4">
                <div className="text-xs font-bold text-[#ffd166]">{t('ra.question')} {qIdx + 1}</div>
                <p className="en text-sm sm:text-base font-bold text-white">{q.question}</p>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    let btnStyle = 'bg-white/5 hover:bg-white/10 border-white/10 text-white';
                    if (answered) {
                      if (optIdx === q.answer) {
                        btnStyle = 'bg-[#c4ff55]/20 border-[#c4ff55] text-[#c4ff55] font-black';
                      } else if (chosen === optIdx) {
                        btnStyle = 'bg-[#ff4f9a]/20 border-[#ff4f9a] text-[#ff4f9a]';
                      } else {
                        btnStyle = 'opacity-40 bg-white/5 border-white/5 text-[#b9b6d5]';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={answered}
                        onClick={() => handleAnswerQuiz(q.id, optIdx, q.answer)}
                        className={`en w-full p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
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
                  <div className="p-3 rounded-xl bg-white/5 text-xs text-[#dedbf4]">
                    <strong className="text-[#ffd166]">{t('ra.explanation')} </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      </div></details>
    </div>
  );
};
