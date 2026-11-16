// ==============================================================================
// Henglish Academy (HENGLISH) - QUESTION BANK PANEL
// Random-draw quiz from the verified chunked question bank
// (public/data/questions). Every draw serves a different set per user; no
// question repeats until the matching pool is exhausted.
// ==============================================================================

import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Shuffle, RotateCcw } from 'lucide-react';
import {
  BankQuestion,
  DrawOptions,
  QuestionLevel,
  drawQuestions,
  loadAllQuestions,
  resetServedQuestions,
} from '../services/questionBankService';
import { useAppTextMap } from '../services/contentI18nService';
import { QuizQuestion } from '../types';
import { QuizEngine } from './QuizEngine';
import { playSound } from '../utils/audio';

const SKILL_OPTIONS: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'كل المهارات' },
  { id: 'vocabulary', label: 'مفردات' },
  { id: 'grammar', label: 'جرامر' },
  { id: 'usage', label: 'استخدام' },
  { id: 'reading', label: 'قراءة' },
  { id: 'listening', label: 'استماع' },
  { id: 'ielts', label: 'IELTS' },
  { id: 'toefl', label: 'TOEFL' },
];

const LEVEL_OPTIONS: Array<{ id: QuestionLevel | 'all'; label: string }> = [
  { id: 'all', label: 'كل المستويات' },
  { id: 'A1', label: 'A1' },
  { id: 'A2', label: 'A2' },
  { id: 'B1', label: 'B1' },
  { id: 'B2', label: 'B2' },
  { id: 'C1', label: 'C1' },
  { id: 'C2', label: 'C2' },
];

const TYPE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'كل الأنواع' },
  { id: 'multiple-choice', label: 'اختياري' },
  { id: 'fill-blank', label: 'أكمل الفراغ' },
  { id: 'true-false', label: 'صح أم خطأ' },
];

const COUNT_OPTIONS = [10, 20, 30];

function levelToDifficulty(level: string): QuizQuestion['difficulty'] {
  if (level === 'A1' || level === 'A2') return 'beginner';
  if (level === 'B1' || level === 'B2') return 'intermediate';
  return 'advanced';
}

function toQuizQuestion(q: BankQuestion): QuizQuestion {
  const parts: string[] = [];
  if (q.passage) parts.push(q.passage);
  if (q.audioText) parts.push(`نص الاستماع: ${q.audioText}`);
  parts.push(q.prompt);
  return {
    id: q.id,
    question: parts.join('\n\n'),
    options: q.options,
    answer: q.answerIndex,
    explanation: q.explanationAr,
    topic: q.topic,
    difficulty: levelToDifficulty(q.level),
  };
}

export const QuestionBankPanel: React.FC = () => {
  const qbText = useAppTextMap('massiveQuestionBank');
  const quizText = useAppTextMap('quizzesData');
  const tx = (s: string) => qbText?.[s] ?? quizText?.[s] ?? s;
  const [all, setAll] = useState<BankQuestion[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [skill, setSkill] = useState('all');
  const [level, setLevel] = useState<QuestionLevel | 'all'>('all');
  const [type, setType] = useState('all');
  const [count, setCount] = useState(10);
  const [drawn, setDrawn] = useState<BankQuestion[] | null>(null);
  const [round, setRound] = useState(0);

  useEffect(() => {
    let mounted = true;
    loadAllQuestions()
      .then(qs => {
        if (mounted) setAll(qs);
      })
      .catch(err => {
        console.error('Failed to load question bank:', err);
        if (mounted) setLoadError(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const drawOpts: DrawOptions = useMemo(
    () => ({
      count,
      skill: skill === 'all' ? undefined : skill,
      level,
      type: type === 'all' ? 'all' : (type as DrawOptions['type']),
    }),
    [count, skill, level, type]
  );

  const poolSize = useMemo(() => {
    if (!all) return 0;
    return all.filter(
      q =>
        (!drawOpts.skill || q.skill === drawOpts.skill) &&
        (drawOpts.level === 'all' || q.level === drawOpts.level) &&
        (drawOpts.type === 'all' || q.type === drawOpts.type)
    ).length;
  }, [all, drawOpts]);

  const handleDraw = () => {
    if (!all) return;
    playSound('click');
    setDrawn(drawQuestions(all, drawOpts));
    setRound(r => r + 1);
  };

  const handleResetHistory = () => {
    playSound('click');
    resetServedQuestions(drawOpts);
    setDrawn(null);
  };

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
      active
        ? 'bg-[#c4ff55]/20 text-[#c4ff55] border-[#c4ff55]/50 shadow-sm'
        : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/5'
    }`;

  if (loadError) {
    return (
      <div className="glass-panel p-10 rounded-3xl border border-white/10 text-center text-white/70 text-sm font-bold">
        حصل خطأ في تحميل بنك الأسئلة. جرّب تحديث الصفحة.
      </div>
    );
  }

  if (!all) {
    return (
      <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#41e7ff] animate-spin mx-auto" />
        <p className="text-white/80 font-bold text-sm">جارٍ تحميل بنك الأسئلة الكامل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-right">
      <div className="text-xs text-white/60 font-bold">
        البنك فيه <strong className="text-[#c4ff55]">{all.length.toLocaleString()}</strong> سؤال
        محقق - كل سحبة بتطلع أسئلة مختلفة، ومفيش سؤال بيتكرر لحد ما تخلّص كل أسئلة الفلتر.
      </div>

      {/* Filters */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {SKILL_OPTIONS.map(o => (
            <button key={o.id} onClick={() => { playSound('click'); setSkill(o.id); setDrawn(null); }} className={chip(skill === o.id)}>
              {o.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {LEVEL_OPTIONS.map(o => (
            <button key={o.id} onClick={() => { playSound('click'); setLevel(o.id); setDrawn(null); }} className={chip(level === o.id)}>
              {o.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {TYPE_OPTIONS.map(o => (
            <button key={o.id} onClick={() => { playSound('click'); setType(o.id); setDrawn(null); }} className={chip(type === o.id)}>
              {o.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/60 font-bold">عدد الأسئلة:</span>
          {COUNT_OPTIONS.map(n => (
            <button key={n} onClick={() => { playSound('click'); setCount(n); setDrawn(null); }} className={chip(count === n)}>
              {n}
            </button>
          ))}
          <span className="text-[11px] text-white/40 font-bold mr-auto">
            {poolSize.toLocaleString()} سؤال مطابق للفلتر
          </span>
        </div>
      </div>

      {/* Draw / redraw */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDraw}
          disabled={poolSize === 0}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#41e7ff] text-[#09091a] text-sm font-black hover:bg-[#70efff] transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
        >
          <Shuffle className="w-4 h-4" />
          {drawn ? 'اسحب أسئلة جديدة' : 'ابدأ الكويز'}
        </button>
        <button
          onClick={handleResetHistory}
          title="صفّر الأسئلة المسحوبة قبل كده للفلتر ده"
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {poolSize === 0 && (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center text-white/60 text-sm font-bold">
          مفيش أسئلة مطابقة للفلتر ده لسه - جرّب فلتر تاني.
        </div>
      )}

      {drawn && drawn.length > 0 && (
        <QuizEngine
          key={`qbank-${round}`}
          questions={drawn.map(q => ({ ...toQuizQuestion(q), explanation: tx(q.explanationAr ?? '') }))}
          quizTitle={`بنك الأسئلة الشامل - ${drawn.length} سؤال`}
        />
      )}
    </div>
  );
};
