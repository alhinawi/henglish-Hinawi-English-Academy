// ==============================================================================
// Henglish Academy (HENGLISH) - QUESTION BANK PANEL
// Random-draw quiz from the chunked practice question bank
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
import { useLanguage } from '../i18n/LanguageContext';

const SKILL_OPTIONS: Array<{ id: string; label?: string; labelKey?: string }> = [
  { id: 'all', labelKey: 'qb.skillAll' },
  { id: 'vocabulary', labelKey: 'qb.skillVocabulary' },
  { id: 'grammar', labelKey: 'qb.skillGrammar' },
  { id: 'usage', labelKey: 'qb.skillUsage' },
  { id: 'reading', labelKey: 'qb.skillReading' },
  { id: 'listening', labelKey: 'qb.skillListening' },
  { id: 'ielts', label: 'IELTS' },
  { id: 'toefl', label: 'TOEFL' },
];

const LEVEL_OPTIONS: Array<{ id: QuestionLevel | 'all'; label?: string; labelKey?: string }> = [
  { id: 'all', labelKey: 'so.allLevels' },
  { id: 'A1', label: 'A1' },
  { id: 'A2', label: 'A2' },
  { id: 'B1', label: 'B1' },
  { id: 'B2', label: 'B2' },
  { id: 'C1', label: 'C1' },
  { id: 'C2', label: 'C2' },
];

const TYPE_OPTIONS: Array<{ id: string; label?: string; labelKey?: string }> = [
  { id: 'all', labelKey: 'qb.typeAll' },
  { id: 'multiple-choice', labelKey: 'qb.typeMc' },
  { id: 'fill-blank', labelKey: 'qb.typeFill' },
  { id: 'true-false', labelKey: 'qb.typeTf' },
];

const COUNT_OPTIONS = [10, 20, 30];

function levelToDifficulty(level: string): QuizQuestion['difficulty'] {
  if (level === 'A1' || level === 'A2') return 'beginner';
  if (level === 'B1' || level === 'B2') return 'intermediate';
  return 'advanced';
}

function toQuizQuestion(q: BankQuestion, t: (k: string) => string): QuizQuestion {
  const parts: string[] = [];
  if (q.passage) parts.push(q.passage);
  if (q.audioText) parts.push(`${t('qb.listeningScript')}: ${q.audioText}`);
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

interface QuestionBankPanelProps {
  learnerId?: string;
  onRecordScore?: (quizId: string, score: number, total: number) => void;
}
export const QuestionBankPanel: React.FC<QuestionBankPanelProps> = ({ learnerId, onRecordScore }) => {
  const { t } = useLanguage();
  const qbText = useAppTextMap('massiveQuestionBank');
  const quizText = useAppTextMap('quizzesData');
  const tx = (s: string) => qbText?.[s] ?? quizText?.[s] ?? s;
  const [all, setAll] = useState<BankQuestion[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [skill, setSkill] = useState('all');
  const [level, setLevel] = useState<QuestionLevel | 'all'>('all');
  const [type, setType] = useState('all');
  const [count, setCount] = useState(10);
  const [drawn, setDrawn] = useState<BankQuestion[] | null>(null);
  const [historyError, setHistoryError] = useState(false);
  const [round, setRound] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoadError(false);
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
  }, [loadAttempt]);

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
    try {
      const questions = drawQuestions(all, drawOpts, learnerId);
      setDrawn(questions); setRound(r => r + 1); setHistoryError(false);
    } catch { setHistoryError(true); }
  };

  const handleResetHistory = () => {
    playSound('click');
    try {
      resetServedQuestions(drawOpts, learnerId);
      setDrawn(null); setHistoryError(false);
    } catch { setHistoryError(true); }
  };

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
      active
        ? 'bg-[#c4ff55]/20 text-[#c4ff55] border-[#c4ff55]/50 shadow-sm'
        : 'bg-white/5 text-white/70 hover:bg-white/10 border-white/5'
    }`;

  if (loadError) {
    return (
      <div role="alert" className="glass-panel p-10 rounded-3xl border border-white/10 text-center text-white/70 text-sm font-bold space-y-4">
        <p>{t('qb.loadError')}</p>
        <button onClick={() => setLoadAttempt(attempt => attempt + 1)} className="min-h-11 rounded-xl bg-white/10 px-4 text-[#41e7ff]">{t('sg.retry')}</button>
      </div>
    );
  }

  if (!all) {
    return (
      <div className="glass-panel p-16 rounded-3xl border border-white/10 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#41e7ff] animate-spin mx-auto" />
        <p className="text-white/80 font-bold text-sm">{t('qb.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-right">
      <div className="text-xs text-white/60 font-bold">
        {t('qb.bankInfoPre')} <strong className="text-[#c4ff55]">{all.length.toLocaleString()}</strong>{' '}
        {t('qb.bankInfoPost')}
      </div>

      {historyError && <p role="alert" className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-xs leading-7 text-amber-200">{t('vocab.saveError')}</p>}
      {/* Filters */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {SKILL_OPTIONS.map(o => (
            <button key={o.id} onClick={() => { playSound('click'); setSkill(o.id); setDrawn(null); }} className={chip(skill === o.id)}>
              {o.labelKey ? t(o.labelKey) : o.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {LEVEL_OPTIONS.map(o => (
            <button key={o.id} onClick={() => { playSound('click'); setLevel(o.id); setDrawn(null); }} className={chip(level === o.id)}>
              {o.labelKey ? t(o.labelKey) : o.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {TYPE_OPTIONS.map(o => (
            <button key={o.id} onClick={() => { playSound('click'); setType(o.id); setDrawn(null); }} className={chip(type === o.id)}>
              {o.labelKey ? t(o.labelKey) : o.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/60 font-bold">{t('qb.countLabel')}</span>
          {COUNT_OPTIONS.map(n => (
            <button key={n} onClick={() => { playSound('click'); setCount(n); setDrawn(null); }} className={chip(count === n)}>
              {n}
            </button>
          ))}
          <span className="text-[11px] text-white/40 font-bold mr-auto">
            {poolSize.toLocaleString()} {t('qb.matching')}
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
          {drawn ? t('qb.drawNew') : t('qb.startQuiz')}
        </button>
        <button
          onClick={handleResetHistory}
          title={t('qb.resetTitle')}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {poolSize === 0 && (
        <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center text-white/60 text-sm font-bold">
          {t('qb.noMatch')}
        </div>
      )}

      {drawn && drawn.length > 0 && (
        <QuizEngine
          key={`qbank-${round}`}
          questions={drawn.map(q => ({ ...toQuizQuestion(q, t), explanation: tx(q.explanationAr ?? '') }))}
          quizTitle={`${t('qb.quizTitle')} - ${drawn.length} ${t('qb.questions')}`}
          onComplete={(score, total) => onRecordScore?.(`question-bank:${skill}:${level}:${type}`, score, total)}
        />
      )}
    </div>
  );
};
