import React, { useState } from 'react';
import { PageRoute } from '../types';
import { READING_PASSAGES, ReadingPassage } from '../data/skillsAcademyData';
import { playSound, speakEnglish, fireCelebration } from '../utils/audio';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Sparkles,
  Volume2,
  HelpCircle,
  Eye,
  Languages,
} from 'lucide-react';

interface ReadingAcademyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ReadingAcademyPage: React.FC<ReadingAcademyPageProps> = ({ onNavigate }) => {
  const [selectedPassageIdx, setSelectedPassageIdx] = useState(0);
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
      
      {/* Academy Hero */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-gradient-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/40 shadow-sm">
            <BookOpen className="w-4 h-4" />
            <span>HINAWI READING ACADEMY • نصوص متدرجة وتقنيات القراءة السريعة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo',sans-serif]">
            أكاديمية القراءة والفهم السريع 📖
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            طوّر قدرتك على القراءة الاستيعابية باللغة الإنجليزية، وتدرّب على مهارات المسح البصري (Scanning) والقراءة الخاطفة (Skimming) لاستخلاص الأفكار الرئيسية دون توقف عند كل كلمة مجهولة.
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
                ? 'bg-gradient-to-r from-[#41e7ff] to-[#ffd166] text-[#0c0b20] font-black shadow-lg'
                : 'bg-white/5 text-[#dedbf4] hover:bg-white/10 border border-white/10'
            }`}
          >
            <span>{p.titleAr}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 font-mono">
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
              <span>{passage.category}</span>
              <span>•</span>
              <span className="en">{passage.wordCount} words</span>
              <span>•</span>
              <span>مستوى CEFR: {passage.level}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{passage.title}</h2>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => {
                playSound('click');
                setShowArabic(prev => !prev);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-[#dedbf4] flex items-center gap-1.5 cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-[#ffd166]" />
              <span>{showArabic ? 'إخفاء الترجمة العربية' : 'إظهار الترجمة العربية'}</span>
            </button>

            <button
              onClick={() => speakEnglish(passage.content)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#41e7ff] cursor-pointer"
              title="الاستماع للنص كاملاً بصوت واضح"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Text Body */}
        <div className="space-y-6 text-left">
          <div className="en text-base sm:text-lg text-white leading-relaxed font-serif bg-black/30 p-6 sm:p-8 rounded-2xl border border-white/5">
            {passage.content}
          </div>

          {showArabic && (
            <div className="text-right text-sm text-[#dedbf4] leading-relaxed bg-[#171632] p-5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-xs font-bold text-[#ffd166]">الترجمة العربية السياقية:</span>
              <p>{passage.contentAr}</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. READING COMPREHENSION QUESTIONS */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#ffd166]" />
            اختبار فهم واستيعاب المقروء (Comprehension Check)
          </h3>
          <span className="text-xs text-[#b9b6d5]">{passage.comprehensionQuestions.length} أسئلة</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {passage.comprehensionQuestions.map((q, qIdx) => {
            const answered = quizAnswers[q.id] !== undefined;
            const chosen = quizAnswers[q.id];

            return (
              <div key={q.id} className="p-5 rounded-2xl bg-[#09091a] border border-white/10 space-y-4">
                <div className="text-xs font-bold text-[#ffd166]">سؤال 0{qIdx + 1}</div>
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
                    <strong className="text-[#ffd166]">التفسير: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
