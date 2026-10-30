import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, HelpCircle, ArrowRight, GraduationCap } from 'lucide-react';
import { FUTURE_PERFECT_LESSONS } from '../data/futurePerfectCourse';
import { COMPREHENSIVE_QUIZ_BANK } from '../data/quizzesData';
import { VERB_TOOLKIT } from '../data/verbsData';
import { ALL_GRAMMAR_RULES } from '../data/allGrammarRules';
import { VOCABULARY_ACADEMY_WORDS } from '../data/vocabularyAcademyData';
import { PageRoute } from '../types';
import { playSound } from '../utils/audio';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: PageRoute, lessonId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search results
  const matchedGrammar = trimmed
    ? ALL_GRAMMAR_RULES.filter(
        r =>
          r.titleAr.toLowerCase().includes(trimmed) ||
          r.titleEn.toLowerCase().includes(trimmed) ||
          r.summaryAr.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const matchedLessons = trimmed
    ? FUTURE_PERFECT_LESSONS.filter(
        l =>
          l.title.toLowerCase().includes(trimmed) ||
          l.subtitle.toLowerCase().includes(trimmed) ||
          l.description.toLowerCase().includes(trimmed) ||
          l.kicker.toLowerCase().includes(trimmed)
      )
    : FUTURE_PERFECT_LESSONS.slice(0, 4);

  const matchedVocab = trimmed
    ? VOCABULARY_ACADEMY_WORDS.filter(
        w =>
          w.word.toLowerCase().includes(trimmed) ||
          w.meaningAr.toLowerCase().includes(trimmed) ||
          w.exampleEn.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const matchedVerbs = trimmed
    ? VERB_TOOLKIT.filter(
        v =>
          v.v1.toLowerCase().includes(trimmed) ||
          v.v3.toLowerCase().includes(trimmed) ||
          v.meaningAr.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : [];

  const matchedQuestions = trimmed
    ? COMPREHENSIVE_QUIZ_BANK.filter(
        q =>
          q.question.toLowerCase().includes(trimmed) ||
          q.explanation.toLowerCase().includes(trimmed) ||
          q.topic.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const handleSelectLesson = (lessonId: string) => {
    playSound('click');
    onNavigate('lesson', lessonId);
    onClose();
  };

  const handleSelectRoute = (route: PageRoute) => {
    playSound('click');
    onNavigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#171632] border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-[#0c0b20]">
          <Search className="w-5 h-5 text-[#41e7ff] shrink-0" />
          <input
            type="text"
            dir="auto"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن درس، قاعدة، فعل V3، سؤال، أو مذكرة..."
            className="w-full bg-transparent text-white placeholder-[#b9b6d5] text-base focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#b9b6d5] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs bg-white/10 hover:bg-white/20 text-[#dedbf4] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Grammar Rules */}
          {matchedGrammar.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#41e7ff] uppercase tracking-wider mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>أكاديمية الجرامر (قواعد الإنجليزية)</span>
              </div>
              <div className="space-y-1.5">
                {matchedGrammar.map(g => (
                  <button
                    key={g.id}
                    onClick={() => handleSelectRoute('grammar')}
                    className="w-full text-right p-3 rounded-xl bg-white/5 hover:bg-[#41e7ff]/10 border border-white/5 hover:border-[#41e7ff]/30 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs text-[#41e7ff] font-bold block en">
                        {g.titleEn} • {g.level}
                      </span>
                      <h5 className="text-sm font-black text-white group-hover:text-[#ffd166]">
                        {g.titleAr}
                      </h5>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#b9b6d5] group-hover:text-[#41e7ff] rotate-180 transition-transform group-hover:-translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lessons */}
          {matchedLessons.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#ffd166] uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>دروس كورس المستقبل التام</span>
              </div>
              <div className="space-y-1.5">
                {matchedLessons.map(l => (
                  <button
                    key={l.id}
                    onClick={() => handleSelectLesson(l.id)}
                    className="w-full text-right p-3 rounded-xl bg-white/5 hover:bg-[#41e7ff]/10 border border-white/5 hover:border-[#41e7ff]/30 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <span className="text-xs text-[#41e7ff] font-bold block">
                        الدرس 0{l.number}: {l.subtitle}
                      </span>
                      <h5 className="text-sm font-black text-white group-hover:text-[#ffd166]">
                        {l.title}
                      </h5>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#b9b6d5] group-hover:text-[#41e7ff] rotate-180 transition-transform group-hover:-translate-x-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Verbs */}
          {matchedVerbs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#c4ff55] uppercase tracking-wider mb-2">
                <span>أفعال التصريف الثالث (Verbs V3)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedVerbs.map(v => (
                  <button
                    key={v.v1}
                    onClick={() => handleSelectRoute('vocabulary')}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-right transition-all cursor-pointer"
                  >
                    <div className="en font-bold text-sm text-[#41e7ff]">
                      {v.v1} → <span className="text-[#c4ff55]">{v.v3}</span>
                    </div>
                    <div className="text-xs text-[#b9b6d5] mt-0.5">
                      {v.meaningAr}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Questions */}
          {matchedQuestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#ff4f9a] uppercase tracking-wider mb-2">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>أسئلة مطابقة من بنك الاختبارات</span>
              </div>
              <div className="space-y-1.5">
                {matchedQuestions.map(q => (
                  <button
                    key={q.id}
                    onClick={() => handleSelectRoute('quizzes')}
                    className="w-full text-right p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-pointer"
                  >
                    <p className="en text-xs font-bold text-white">
                      {q.question}
                    </p>
                    <span className="text-[11px] text-[#ffd166] mt-1 block">
                      {q.explanation}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty search state */}
          {trimmed && matchedLessons.length === 0 && matchedVerbs.length === 0 && matchedQuestions.length === 0 && (
            <div className="text-center py-10 text-[#b9b6d5]">
              <p className="text-base font-bold">لم نجد نتائج مطابقة لـ "{query}"</p>
              <p className="text-xs mt-1">جرّب البحث بكلمة مختلفة مثل: finish, by the time, will have, V3...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
