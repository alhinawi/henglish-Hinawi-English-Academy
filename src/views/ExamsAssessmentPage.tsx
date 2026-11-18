import { LessonSpeechButton } from '../components/LessonSpeechButton';
import { loadPlacementHistory, placementHistoryKey, savePlacementAttempt, PlacementAttempt } from '../services/placementHistory';
import React, { useState, useEffect, useRef } from 'react';
import { PageRoute, CEFRLevel } from '../types';
import { 
  generateAdaptivePlacementSession, 
  evaluateAssessmentSession, 
  AssessmentQuestion, 
  AssessmentResultBreakdown,
  QuestionSkill
} from '../data/massiveQuestionBank';
import { txText, useAppTextMap } from '../services/contentI18nService';
import { generatePlacementSessionFromBank } from '../services/placementService';
import { useLanguage } from '../i18n/LanguageContext';
import { playSound, fireCelebration, stopSpeech } from '../utils/audio';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  RotateCcw,
  BookOpen,
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Compass,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExamsAssessmentPageProps {
  learnerId?: string;
  onNavigate: (route: PageRoute) => void;
  onRecordScore?: (quizId: string, score: number, total: number) => void;
}


export const ExamsAssessmentPage: React.FC<ExamsAssessmentPageProps> = ({
  onNavigate,
  onRecordScore,
  learnerId,
}) => {
  // Adaptive test session generated dynamically on mount or restart
  const appText = useAppTextMap('massiveQuestionBank');
  const { t, dir } = useLanguage();
  const storageKey = placementHistoryKey(learnerId);
  const loadVersion = useRef(0);
  const finished = useRef(false);
  const [sessionQuestions, setSessionQuestions] = useState<AssessmentQuestion[]>([]);
  const [loadingSession, setLoadingSession] = useState(true);

  const loadSession = async () => {
    const version = ++loadVersion.current;
    stopSpeech();
    setLoadingSession(true);
    try {
      const fromBank = await generatePlacementSessionFromBank(learnerId);
      if (version !== loadVersion.current) return;
      // Fall back to the small built-in set only if the bank could not supply a full test.
      setSessionQuestions(fromBank.length >= 10 ? fromBank : generateAdaptivePlacementSession());
    } catch {
      if (version !== loadVersion.current) return;
      setSessionQuestions(generateAdaptivePlacementSession());
    } finally {
      if (version === loadVersion.current) setLoadingSession(false);
    }
  };

  useEffect(() => {
    void loadSession();
    return () => { loadVersion.current += 1; stopSpeech(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [testFinished, setTestFinished] = useState(false);
  const [result, setResult] = useState<AssessmentResultBreakdown | null>(null);
  const [pastAttempts, setPastAttempts] = useState(() => loadPlacementHistory(storageKey));

  const [historySaveFailed, setHistorySaveFailed] = useState(false);
  const pendingAttempt = useRef<PlacementAttempt | null>(null);
  const savePendingAttempt = () => {
    if (!pendingAttempt.current) return;
    try {
      const saved = savePlacementAttempt(storageKey, pendingAttempt.current);
      setPastAttempts(saved);
      pendingAttempt.current = null;
      setHistorySaveFailed(false);
    } catch { setHistorySaveFailed(true); }
  };

  const currentQ = sessionQuestions[currentQIdx];

  const handleSelectOption = (optIdx: number) => {
    playSound('click');
    setSelectedAnswers(prev => ({ ...prev, [currentQIdx]: optIdx }));
  };

  const handleNext = () => {
    if (!currentQ || selectedAnswers[currentQIdx] === undefined || finished.current) return;
    stopSpeech();
    playSound('click');
    if (currentQIdx < sessionQuestions.length - 1) {
      setCurrentQIdx(prev => prev + 1);
    } else {
      finished.current = true;
      // Evaluate test session dynamically
      const evalResult = evaluateAssessmentSession(sessionQuestions, selectedAnswers);
      setResult(evalResult);
      setTestFinished(true);
      playSound('correct');
      fireCelebration();

      if (onRecordScore) {
        onRecordScore('cefr-placement', evalResult.score, evalResult.total);
      }

      // Save to local test history
      const newAttempt = {
        date: new Date().toLocaleDateString('ar-EG-u-nu-latn'),
        level: evalResult.estimatedLevel,
        score: evalResult.score,
        total: evalResult.total,
      };
      pendingAttempt.current = newAttempt;
      savePendingAttempt();
    }
  };

  const handleRestart = () => {
    pendingAttempt.current = null;
    setHistorySaveFailed(false);
    finished.current = false;
    playSound('click');
    void loadSession();
    setCurrentQIdx(0);
    setSelectedAnswers({});
    setTestFinished(false);
    setResult(null);
  };

  return (
    <div dir={dir} className="space-y-10 pb-16 text-start">
      
      {/* Academy Hero Header */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 sm:p-12 bg-linear-to-br from-[#121128] via-[#171632] to-[#0c0b20] shadow-2xl">
        <div className="absolute top-0 left-10 w-80 h-80 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#41e7ff]/20 text-[#41e7ff] border border-[#41e7ff]/40 shadow-sm">
            <FileCheck2 className="w-4 h-4" />
            <span>{t('exa.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            {t('exa.title')}
          </h1>

          <p className="text-sm sm:text-base text-[#dedbf4] leading-relaxed">
            {t('exa.blurb')}
          </p>
        </div>
      </section>

      {/* 1. PLACEMENT TEST IN PROGRESS */}
      {loadingSession ? (
        <section className="glass-panel rounded-3xl p-10 border border-white/10 max-w-3xl mx-auto text-center text-[#b9b6d5] font-bold">
          {t('exams.loadingSession')}
        </section>
      ) : !testFinished && currentQ ? (
        <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 max-w-3xl mx-auto shadow-2xl">
          {/* Header & Progress Indicator */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3 text-xs font-bold text-[#b9b6d5]">
              <span>{t('exa.questionN').replace('{n}', String(currentQIdx + 1)).replace('{m}', String(sessionQuestions.length))}</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#ffd166]/15 text-[#ffd166] font-mono">
                  {currentQ.level}
                </span>
                <span dir="ltr" className="text-[#41e7ff] font-semibold">{currentQ.topic}</span>
              </div>
            </div>

            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-linear-to-r from-[#ffd166] via-[#41e7ff] to-[#c4ff55] h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentQIdx + 1) / sessionQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Reading or Listening Passage Card if exists */}
          {(currentQ.passage || currentQ.audioText) && (
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex flex-wrap items-start justify-between gap-3 text-xs font-bold text-[#ffd166]">
                <span>{currentQ.skill === 'listening' ? t('exa.listeningText') : t('exa.readingText')}</span>
                {currentQ.audioText && (
                  <LessonSpeechButton key={currentQ.id} text={currentQ.audioText!} label={t('exa.playAudio')} className="p-1.5 rounded-lg bg-[#41e7ff]/20 text-[#41e7ff] hover:bg-[#41e7ff] hover:text-[#0c0b20] transition-colors cursor-pointer flex items-center gap-1 text-[11px]" />
                )}
              </div>
              {currentQ.passage ? (
                <p dir="ltr" className="text-left font-sans text-sm sm:text-base text-[#dedbf4] leading-relaxed italic bg-black/30 p-3.5 rounded-xl border border-white/5">
                  "{currentQ.passage}"
                </p>
              ) : (
                <p className="text-right text-xs text-[#b9b6d5]">{t('exams.listenHint')}</p>
              )}
            </div>
          )}

          {/* Question Prompt */}
          <div className="p-6 rounded-2xl bg-[#09091a] border border-white/10 space-y-3">
            {currentQ.promptAr && (
              <div className="text-xs font-bold text-[#ffd166]">{txText(appText, currentQ.promptAr)}</div>
            )}
            <p dir="ltr" className="text-left font-sans text-lg sm:text-xl font-black text-white leading-relaxed">
              {currentQ.prompt}
            </p>
            {/* Quick Audio for Prompt */}
            <LessonSpeechButton key={currentQ.id} text={currentQ.prompt} label={t('exa.listenHint')} className="inline-flex items-center gap-1 text-xs text-[#41e7ff] hover:underline cursor-pointer pt-1" />
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedAnswers[currentQIdx] === optIdx;

              return (
                <button
                  key={optIdx}
                  aria-pressed={isSelected}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`p-4 rounded-xl border text-left font-sans text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-linear-to-r from-[#41e7ff]/25 to-[#ffd166]/15 border-[#41e7ff] text-white shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white/10 text-xs font-mono flex items-center justify-center text-[#ffd166]">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span dir="ltr" className="text-left">{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-[#41e7ff]" />}
                </button>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-white/10">
            <button
              onClick={() => {
                if (currentQIdx > 0) setCurrentQIdx(prev => prev - 1);
              }}
              disabled={currentQIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#b9b6d5] hover:text-white disabled:opacity-30 cursor-pointer"
            >
              {t('exa.prevQuestion')}
            </button>

            <button
              onClick={handleNext}
              disabled={selectedAnswers[currentQIdx] === undefined}
              className="px-8 py-3 rounded-2xl bg-linear-to-r from-[#ffd166] via-[#ff9c66] to-[#41e7ff] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-lg cursor-pointer disabled:opacity-40 transition-all"
            >
              {currentQIdx < sessionQuestions.length - 1 ? t('exa.nextQuestion') : t('exa.showReport')}
            </button>
          </div>
        </section>
      ) : (
        /* 2. COMPREHENSIVE RESULT REPORT & DIAGNOSTICS */
        result && (
          <section className="glass-panel rounded-3xl p-6 sm:p-12 border border-[#ffd166]/40 max-w-4xl mx-auto space-y-10 shadow-2xl">
            {/* Header Badge */}
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-3xl bg-[#ffd166]/20 border border-[#ffd166]/40 text-[#ffd166] shadow-xl">
                <Award className="w-12 h-12" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">{t('exa.reportTitle')}</h2>
              <p className="text-xs sm:text-sm text-[#b9b6d5]">{t('exa.reportSubtitle')}</p>
            </div>

            {historySaveFailed && (
              <div role="alert" className="rounded-2xl border border-rose-500/30 p-4 space-y-3 text-sm text-rose-200">
                <p>{t('sa.saveError')}</p>
                <button type="button" onClick={savePendingAttempt} className="rounded-xl border border-rose-300/30 px-4 py-2 font-bold hover:bg-white/5">
                  {t('listen.tryAgain')}
                </button>
              </div>
            )}

            {/* Level Score Card */}
            <div className="p-8 rounded-3xl bg-linear-to-br from-[#171632] via-[#0c0b20] to-[#1a1438] border border-white/15 max-w-lg mx-auto text-center space-y-3 shadow-2xl">
              <div className="text-xs text-[#b9b6d5] font-semibold">{t('exa.currentLevel')}</div>
              <div className="text-5xl sm:text-6xl font-black bg-linear-to-r from-[#ffd166] via-[#ff9c66] to-[#41e7ff] bg-clip-text text-transparent">
                {result.estimatedLevel}
              </div>
              <div className="text-base sm:text-lg font-bold text-white">{result.levelTitleAr}</div>
              <div className="text-xs text-[#c4ff55] font-mono font-bold">
                {t('exa.totalScore').replace('{n}', String(result.score)).replace('{m}', String(result.total)).replace('{p}', String(result.overallPercentage))}
              </div>
            </div>

            {/* Skill-by-Skill Breakdown Bars */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#41e7ff]" />
                <span>{t('exa.skillAnalysis')}</span>
              </h4>

              <div className="space-y-3">
                {(Object.entries(result.skillBreakdown) as [QuestionSkill, { score: number; total: number; percentage: number }][]).map(([skillKey, stat]) => (
                  <div key={skillKey} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex flex-wrap items-start justify-between gap-3 text-xs font-bold">
                      <span className="text-[#dedbf4] capitalize">{skillKey}</span>
                      <span className="text-[#ffd166] font-mono">{stat.percentage}% ({stat.score}/{stat.total})</span>
                    </div>
                    <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-linear-to-r from-[#ffd166] to-[#41e7ff] h-full rounded-full transition-all duration-500"
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths and Weaknesses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Check className="w-4 h-4" />
                  <span>{t('exa.strengths')}</span>
                </div>
                <ul className="text-xs text-[#dedbf4] space-y-1">
                  {result.strengths.map((str, idx) => (
                    <li key={idx}>• {str}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-5 rounded-2xl bg-[#ff4f9a]/10 border border-[#ff4f9a]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#ff8bb9]">
                  <TrendingUp className="w-4 h-4" />
                  <span>{t('exa.improvements')}</span>
                </div>
                <ul className="text-xs text-[#dedbf4] space-y-1">
                  {result.weaknesses.map((w, idx) => (
                    <li key={idx}>• {w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Personalized Recommended Learning Path */}
            <div className="p-6 rounded-3xl bg-linear-to-br from-[#ffd166]/10 to-[#41e7ff]/10 border border-[#ffd166]/40 max-w-2xl mx-auto space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#ffd166]">
                <Compass className="w-4 h-4" />
                <span>{t('exa.personalizedPath')}</span>
              </div>
              <h4 className="text-lg font-black text-white">{result.recommendedPath.startAcademy}</h4>
              <p className="text-xs text-[#dedbf4]">
                {t('exa.recommendedIntro')}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {result.recommendedPath.focusTopics.map((top, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-white/10 text-[#ffd166] text-xs font-bold border border-white/10">
                    {top}
                  </span>
                ))}
              </div>
            </div>

            {/* Official Academic Disclaimer */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 max-w-2xl mx-auto flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#ffd166] shrink-0 mt-0.5" />
              <p className="text-xs text-[#b9b6d5] leading-relaxed">
                {result.disclaimerAr}
              </p>
            </div>

            {/* Past Attempts History */}
            {pastAttempts.length > 1 && (
              <div className="max-w-2xl mx-auto space-y-2 pt-2">
                <h5 className="text-xs font-bold text-[#b9b6d5]">{t('exa.historyTitle')}</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pastAttempts.map((att, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center text-xs">
                      <div className="text-[#ffd166] font-bold">{t('exa.levelLabel')} {att.level}</div>
                      <div className="text-[10px] text-[#b9b6d5]">{att.date} • {att.score}/{att.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate(result.recommendedPath.startRoute as PageRoute)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-linear-to-r from-[#ffd166] to-[#41e7ff] text-[#0c0b20] font-black text-sm hover:brightness-110 shadow-xl cursor-pointer"
              >
                {t('exa.startPath')}
              </button>

              <button
                onClick={handleRestart}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('exa.retake')}</span>
              </button>
            </div>
          </section>
        )
      )}

    </div>
  );
};
