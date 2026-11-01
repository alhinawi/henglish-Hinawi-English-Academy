// ==============================================================================
// Henglish Academy (HENGLISH) - TRANSLATION PEDAGOGICAL EXPLANATION PANEL
// Comprehensive analysis: Meaning, Grammar, Vocabulary, Idioms, Culture & Traps
// ==============================================================================

import React, { useState } from 'react';
import { TranslationExplanation, WordAnalysisDetail } from '../../types/translation';
import { playSound } from '../../utils/audio';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  Globe2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookmarkPlus,
} from 'lucide-react';

interface ExplanationPanelProps {
  explanation: TranslationExplanation;
  onWordClick?: (word: string) => void;
  onSaveWord?: (word: WordAnalysisDetail) => void;
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  explanation,
  onWordClick,
  onSaveWord,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'meaning' | 'grammar' | 'vocab' | 'idioms' | 'traps'>('all');
  const [isExpanded, setIsExpanded] = useState(true);

  if (!explanation) return null;

  return (
    <div className="bg-[#0e0c26] rounded-2xl border border-white/10 shadow-xl overflow-hidden transition-all text-right">
      {/* Panel Header */}
      <div
        onClick={() => {
          playSound('click');
          setIsExpanded(prev => !prev);
        }}
        className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/10"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#41e7ff]/20 to-[#a855f7]/20 border border-[#41e7ff]/30 text-[#41e7ff]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>الشرح والتحليل اللغوي الأكاديمي</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#41e7ff]/20 text-[#41e7ff] font-semibold border border-[#41e7ff]/30">
                مستوى {explanation.cefrLevel || 'B1'}
              </span>
            </h3>
            <span className="text-xs text-[#b9b6d5]">
              فهم عميق لقواعد الجملة، أسرار الصياغة، والمفردات والتحذيرات اللغوية
            </span>
          </div>
        </div>

        <button
          type="button"
          className="p-1 rounded-lg text-[#b9b6d5] hover:text-white"
          aria-label={isExpanded ? 'طي الشرح' : 'عرض الشرح'}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="p-5 space-y-6">
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'meaning', label: 'المعنى والسبب السياقي' },
              { id: 'grammar', label: 'التراكيب القواعدية' },
              { id: 'vocab', label: 'أهم الكلمات' },
              { id: 'idioms', label: 'التعبيرات الاصطلاحية' },
              { id: 'traps', label: 'فخاخ الترجمة الشائعة' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playSound('click');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#41e7ff] text-black font-bold shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 1. Sentence Meaning & Translation Rationale */}
          {(activeTab === 'all' || activeTab === 'meaning') && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="text-sm font-bold text-[#41e7ff] flex items-center gap-2">
                  <Globe2 className="w-4 h-4" />
                  <span>المعنى الكلي والدلالة الثقافية (Meaning & Context):</span>
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {explanation.summaryMeaningAr}
                </p>
                {explanation.culturalContextAr && (
                  <div className="mt-3 p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-[#b9b6d5] leading-relaxed">
                    <span className="font-semibold text-[#ffb84d] ml-1">الأبعاد الثقافية والمجتمعية:</span>
                    {explanation.culturalContextAr}
                  </div>
                )}
                {explanation.translationRationaleAr && (
                  <div className="mt-2 text-xs text-[#b9b6d5]/90 flex items-start gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#10b981] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white ml-1">لماذا اختيرت هذه الترجمة؟</strong>
                      {explanation.translationRationaleAr}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Grammar Structures Analysis */}
          {(activeTab === 'all' || activeTab === 'grammar') && explanation.grammarNotes?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#a855f7]" />
                <span>التحليل النحوي والتراكيب القواعدية (Grammar Breakdown):</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {explanation.grammarNotes.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#a855f7]/40 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{rule.structureNameAr}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30">
                        {rule.structureName}
                      </span>
                    </div>

                    {rule.ruleFormula && (
                      <div className="px-2.5 py-1.5 rounded-lg bg-black/50 text-[11px] font-mono text-[#41e7ff] text-left ltr border border-white/5">
                        {rule.ruleFormula}
                      </div>
                    )}

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {rule.explanationAr}
                    </p>

                    {rule.targetContrastAr && (
                      <div className="text-[11px] text-[#ffb84d] bg-[#ffb84d]/10 p-2 rounded-lg border border-[#ffb84d]/20">
                        <strong>الفرق بين الإنجليزية والعربية:</strong> {rule.targetContrastAr}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Important Vocabulary Breakdown */}
          {(activeTab === 'all' || activeTab === 'vocab') && explanation.importantVocabulary?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ffb84d]" />
                <span>المفردات الجوهرية في الجملة (Key Vocabulary):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {explanation.importantVocabulary.map((wordItem, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <button
                          type="button"
                          onClick={() => onWordClick && onWordClick(wordItem.cleanWord || wordItem.word)}
                          className="text-sm font-bold text-[#41e7ff] hover:underline cursor-pointer"
                        >
                          {wordItem.word}
                        </button>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                          {wordItem.partOfSpeechAr || wordItem.partOfSpeech}
                        </span>
                      </div>

                      <p className="text-xs text-white mb-1 font-medium">{wordItem.meaningAr}</p>
                      {wordItem.ipa && (
                        <span className="text-[11px] text-[#b9b6d5] font-mono block mb-1.5">
                          {wordItem.ipa}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                      <span className="text-[#a855f7] font-semibold">{wordItem.cefrLevel}</span>
                      {onSaveWord && (
                        <button
                          type="button"
                          onClick={() => {
                            playSound('click');
                            onSaveWord(wordItem);
                          }}
                          className="flex items-center gap-1 text-[#41e7ff] hover:text-white transition-colors cursor-pointer"
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                          <span>حفظ للمفردات</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Idioms & Expressions */}
          {(activeTab === 'all' || activeTab === 'idioms') && explanation.idiomsAndExpressions?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ec4899]" />
                <span>التعبيرات الاصطلاحية والمجازية (Idioms & Expressions):</span>
              </h4>

              <div className="space-y-2">
                {explanation.idiomsAndExpressions.map((idiomItem, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#ec4899] font-mono">
                        "{idiomItem.idiom}"
                      </span>
                      <span className="text-xs text-[#10b981] font-semibold">
                        المعنى الحقيقي: {idiomItem.actualMeaningAr}
                      </span>
                    </div>
                    {idiomItem.literalMeaningAr && (
                      <p className="text-xs text-[#b9b6d5]">
                        <span className="text-red-400 ml-1">الترجمة الحرفية الخاطئة:</span>
                        {idiomItem.literalMeaningAr}
                      </p>
                    )}
                    {idiomItem.example && (
                      <p className="text-xs text-slate-300 italic pt-1 border-t border-white/5">
                        مثال: {idiomItem.example}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Common Translation Traps */}
          {(activeTab === 'all' || activeTab === 'traps') && explanation.commonTrapsAr?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#ff4f9a]" />
                <span>فخاخ الترجمة الشائعة وكيفية تجنبها (Common Translation Traps):</span>
              </h4>

              <div className="space-y-2">
                {explanation.commonTrapsAr.map((trap, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs space-y-1 text-slate-200"
                  >
                    <div className="flex items-center gap-2 font-bold text-red-300">
                      <span>❌ الخطأ الشائع:</span>
                      <span>{trap.wrongAr}</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold text-[#10b981]">
                      <span>✅ الصواب البليغ:</span>
                      <span>{trap.correctAr}</span>
                    </div>
                    <p className="text-[#b9b6d5] pt-1">
                      <strong className="text-white ml-1">لماذا هذا فخ؟</strong> {trap.whyTrapAr}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
