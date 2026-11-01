// ==============================================================================
// Henglish Academy (HENGLISH) - TRANSLATION PRACTICE & CHALLENGE LAB
// Educational translation challenges (Ar<->En) with multi-criteria AI grading & XP
// ==============================================================================

import React, { useState } from 'react';
import { CEFRLevel } from '../../types';
import { PracticeChallenge, PracticeEvaluationResult } from '../../types/translation';
import {
  TRANSLATION_PRACTICE_CHALLENGES,
  evaluatePracticeAnswer,
} from '../../services/translationService';
import { playSound, fireCelebration, speakMultilingualText } from '../../utils/audio';
import {
  Target,
  Trophy,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Flame,
  Volume2,
  RefreshCw,
  Award,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface PracticeModeTabProps {
  userLevel?: CEFRLevel;
  onAwardXp?: (amount: number) => void;
}

export const PracticeModeTab: React.FC<PracticeModeTabProps> = ({
  userLevel = 'B1',
  onAwardXp,
}) => {
  const [directionFilter, setDirectionFilter] = useState<'all' | 'ar-to-en' | 'en-to-ar'>('all');
  const [levelFilter, setLevelFilter] = useState<CEFRLevel | 'all'>('all');

  const filteredChallenges = TRANSLATION_PRACTICE_CHALLENGES.filter(c => {
    if (directionFilter !== 'all' && c.direction !== directionFilter) return false;
    if (levelFilter !== 'all' && c.difficulty !== levelFilter) return false;
    return true;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const activeChallenge: PracticeChallenge | undefined = filteredChallenges[currentIndex];

  const [userTranslation, setUserTranslation] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<PracticeEvaluationResult | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  const handleSubmit = async () => {
    if (!activeChallenge || !userTranslation.trim() || isEvaluating) return;

    setIsEvaluating(true);
    playSound('click');

    try {
      const result = await evaluatePracticeAnswer(activeChallenge, userTranslation.trim());
      setEvaluationResult(result);

      if (result.overallScore >= 70) {
        playSound('correct');
        fireCelebration();
      } else {
        playSound('wrong');
      }

      setCompletedCount(prev => prev + 1);
      setTotalXpEarned(prev => prev + result.earnedXp);
      if (onAwardXp) {
        onAwardXp(result.earnedXp);
      }
    } catch (err) {
      console.error('Practice evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextChallenge = () => {
    playSound('click');
    setEvaluationResult(null);
    setUserTranslation('');
    setCurrentIndex(prev => (prev + 1) % filteredChallenges.length);
  };

  const handlePrevChallenge = () => {
    playSound('click');
    setEvaluationResult(null);
    setUserTranslation('');
    setCurrentIndex(prev => (prev - 1 + filteredChallenges.length) % filteredChallenges.length);
  };

  const handleSpeakPrompt = () => {
    if (!activeChallenge) return;
    playSound('click');
    const lang = activeChallenge.direction === 'en-to-ar' ? 'en' : 'ar';
    speakMultilingualText(activeChallenge.sourceSentence, lang);
  };

  return (
    <div className="space-y-6 text-right">
      {/* Practice Header Stats */}
      <div className="p-5 rounded-2xl bg-[#0e0c26] border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-[#41e7ff]" />
            <span>معمل التحدي والتدريب التفاعلي (Translation Practice Arena)</span>
          </h3>
          <p className="text-xs text-[#b9b6d5] mt-1">
            ترجم الجمل الحقيقية واحصل على تقييم فوري من الذكاء الاصطناعي مع احتساب نقاط الخبرة XP وتصحيح الأخطاء.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-[#ffb84d] font-bold">
            <Trophy className="w-4 h-4" />
            <span>{totalXpEarned} XP</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5 text-[#10b981] font-semibold">
            <CheckCircle className="w-4 h-4" />
            <span>{completedCount} تحديات مكتملة</span>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 text-xs">
        {/* Direction Switch */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#b9b6d5] ml-1">الاتجاه:</span>
          {[
            { id: 'all', label: 'الكل' },
            { id: 'ar-to-en', label: 'عربي ⬅️ إنجليزي' },
            { id: 'en-to-ar', label: 'إنجليزي ⬅️ عربي' },
          ].map(d => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                playSound('click');
                setDirectionFilter(d.id as typeof directionFilter);
                setCurrentIndex(0);
                setEvaluationResult(null);
                setUserTranslation('');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                directionFilter === d.id
                  ? 'bg-[#41e7ff] text-black font-bold'
                  : 'bg-black/30 hover:bg-white/10 text-slate-300'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* CEFR Level Filter */}
        <div className="flex items-center gap-1">
          <span className="text-[#b9b6d5] ml-1">المستوى:</span>
          {(['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const).map(lvl => (
            <button
              key={lvl}
              type="button"
              onClick={() => {
                playSound('click');
                setLevelFilter(lvl);
                setCurrentIndex(0);
                setEvaluationResult(null);
                setUserTranslation('');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                levelFilter === lvl
                  ? 'bg-[#a855f7] text-white font-bold'
                  : 'bg-black/30 hover:bg-white/10 text-slate-400'
              }`}
            >
              {lvl === 'all' ? 'الكل' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Card */}
      {activeChallenge ? (
        <div className="p-6 rounded-3xl bg-[#0e0c26] border border-white/15 shadow-2xl space-y-6">
          {/* Challenge Header Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-[#41e7ff]/20 text-[#41e7ff] font-bold border border-[#41e7ff]/30">
                مستوى {activeChallenge.difficulty}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                {activeChallenge.category}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#b9b6d5]">
              <span>
                تحدي {currentIndex + 1} من {filteredChallenges.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevChallenge}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                  title="السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                  title="التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Source Prompt Sentence */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-[#b9b6d5] block">
                {activeChallenge.direction === 'ar-to-en'
                  ? 'ترجم الجملة العربية التالية إلى لغة إنجليزية طبيعية:'
                  : 'ترجم الجملة الإنجليزية التالية إلى لغة عربية فصيحة وسلسة:'}
              </span>
              <h2
                dir={activeChallenge.direction === 'ar-to-en' ? 'rtl' : 'ltr'}
                className="text-xl md:text-2xl font-bold text-white leading-relaxed"
              >
                "{activeChallenge.sourceSentence}"
              </h2>
              {activeChallenge.contextHintAr && (
                <p className="text-xs text-[#41e7ff]/80 pt-1">
                  💡 تلميح: {activeChallenge.contextHintAr}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSpeakPrompt}
              title="استمع للنطق"
              className="p-3 rounded-2xl bg-white/10 hover:bg-[#41e7ff] text-[#41e7ff] hover:text-black transition-all cursor-pointer shrink-0"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {/* User Input Textarea */}
          <div className="space-y-2">
            <label className="text-xs text-[#b9b6d5] font-medium block">
              صياغتك وترجمتك المقترحة:
            </label>
            <textarea
              value={userTranslation}
              onChange={e => setUserTranslation(e.target.value)}
              disabled={isEvaluating}
              dir={activeChallenge.direction === 'ar-to-en' ? 'ltr' : 'rtl'}
              placeholder={
                activeChallenge.direction === 'ar-to-en'
                  ? 'Type your English translation here...'
                  : 'اكتب ترجمتك العربية هنا...'
              }
              className="w-full h-32 p-4 rounded-2xl bg-black/40 border border-white/15 text-white text-base leading-relaxed focus:outline-none focus:border-[#41e7ff] placeholder-[#b9b6d5]/40 resize-none"
            />
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#b9b6d5]/60">
              يقبل الذكاء الاصطناعي كافة الصياغات الصحيحة المتنوعة دون خصم درجات
            </span>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!userTranslation.trim() || isEvaluating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#41e7ff] to-[#7c3aed] text-black font-bold text-sm shadow-lg shadow-[#41e7ff]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isEvaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ التقييم والتحليل...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>إرسال للتقييم الأكاديمي</span>
                </>
              )}
            </button>
          </div>

          {/* AI Evaluation Results Panel */}
          {evaluationResult && (
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-5 animate-in fade-in duration-300">
              {/* Overall Score Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-[#41e7ff]/10 to-[#a855f7]/10 border border-[#41e7ff]/20">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#41e7ff] text-black font-black text-2xl font-mono">
                    {evaluationResult.overallScore}%
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      {evaluationResult.overallScore >= 80 ? 'إتقان ممتاز جداً!' : 'محاولة جيدة وقابلة للتحسين'}
                    </h4>
                    <p className="text-xs text-[#b9b6d5]">{evaluationResult.feedbackAr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-[#ffb84d] bg-black/40 px-3.5 py-1.5 rounded-xl border border-white/10">
                  <Flame className="w-4 h-4 text-[#ff3366]" />
                  <span>+{evaluationResult.earnedXp} XP مكتسبة</span>
                </div>
              </div>

              {/* 5-Criteria Score Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                {[
                  { label: 'دقة المعنى', score: evaluationResult.meaningScore },
                  { label: 'القواعد النحوية', score: evaluationResult.grammarScore },
                  { label: 'المفردات', score: evaluationResult.vocabularyScore },
                  { label: 'الطبيعية والانسياب', score: evaluationResult.naturalnessScore },
                  { label: 'الاكتمال', score: evaluationResult.completenessScore },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                    <span className="text-[11px] text-[#b9b6d5] block mb-1">{item.label}</span>
                    <span className="text-sm font-bold font-mono text-[#41e7ff]">{item.score}%</span>
                  </div>
                ))}
              </div>

              {/* Strengths & Corrections */}
              {evaluationResult.mistakesAndCorrections?.length > 0 && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-white block">ملاحظات دقيقة لتطوير الصياغة:</span>
                  {evaluationResult.mistakesAndCorrections.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-slate-200 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-bold">صياغتك: "{m.userPart}"</span>
                        <span className="text-[#10b981] font-bold">⬅️ الأنسب: "{m.correction}"</span>
                      </div>
                      <p className="text-[#b9b6d5]">{m.reasonAr}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Model Answers Reference */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                <span className="font-bold text-[#41e7ff] block">الصياغات المعتمدة لدى أهل اللغة:</span>
                <div className="space-y-1">
                  {evaluationResult.alternativeValidAnswers?.map((ans, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-white font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                      <span>{ans}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleNextChallenge}
                  className="px-5 py-2 rounded-xl bg-[#41e7ff] text-black font-bold text-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>التحدي التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center text-[#b9b6d5]">
          <p>لا توجد تحديات مطابقة للفلتر المحدد.</p>
        </div>
      )}
    </div>
  );
};
