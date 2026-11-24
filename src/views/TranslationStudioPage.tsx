// ==============================================================================
// Henglish Academy (HENGLISH) - COMPLETE AI TRANSLATION STUDIO PAGE
// Flagship contextual translation engine, grammar awareness, OCR, voice & practice
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  LanguageCode,
  TranslationMode,
  TranslationResponse,
  WordAnalysisDetail,
  VocabularyCollection,
} from '../types/translation';
import { UserProfile, CEFRLevel } from '../types';
import {
  executeTranslation,
  saveVocabularyCard,
  getVocabularyCollections,
} from '../services/translationService';
import { LanguageSelector } from '../components/translation/LanguageSelector';
import { ModeSelector } from '../components/translation/ModeSelector';
import { SourceEditor } from '../components/translation/SourceEditor';
import { TranslationOutput } from '../components/translation/TranslationOutput';
import { TranslationAlternatives } from '../components/translation/TranslationAlternatives';
import { ExplanationPanel } from '../components/translation/ExplanationPanel';
import { WordAnalysisModal } from '../components/translation/WordAnalysisModal';
import { SmartAssistantDrawer } from '../components/translation/SmartAssistantDrawer';
import { DocumentTranslatorTab } from '../components/translation/DocumentTranslatorTab';
import { VoiceTranslatorTab } from '../components/translation/VoiceTranslatorTab';
import { CameraOcrTab } from '../components/translation/CameraOcrTab';
import { PracticeModeTab } from '../components/translation/PracticeModeTab';
import { VocabularyHistoryTab } from '../components/translation/VocabularyHistoryTab';
import { playSound } from '../utils/audio';
import {
  Languages,
  FileText,
  Mic,
  Camera,
  Target,
  BookmarkCheck,
  Bot,
  Sparkles,
  Trophy,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { isAiServiceUnavailable } from '../services/aiAvailability';

interface TranslationStudioPageProps {
  userProfile?: UserProfile;
  learnerId?: string;
}

export const TranslationStudioPage: React.FC<TranslationStudioPageProps> = ({ userProfile, learnerId }) => {
  const { t } = useLanguage();
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'studio' | 'documents' | 'voice' | 'ocr' | 'practice' | 'vocab'>('studio');

  // Translation Parameters
  const [sourceLang, setSourceLang] = useState<LanguageCode>('en');
  const [targetLang, setTargetLang] = useState<LanguageCode>('ar');
  const [mode, setMode] = useState<TranslationMode>('natural');

  // Editor State
  const [sourceText, setSourceText] = useState('I am looking forward to hearing from you.');
  const [translationResult, setTranslationResult] = useState<TranslationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals & Drawers
  const [selectedWordDetail, setSelectedWordDetail] = useState<WordAnalysisDetail | null>(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [wordAnalysisUnavailable, setWordAnalysisUnavailable] = useState(false);
  const [vocabularySaveMessage, setVocabularySaveMessage] = useState('');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [collections, setCollections] = useState<VocabularyCollection[]>(() => getVocabularyCollections(learnerId));

  // User Level
  const currentLevel: CEFRLevel = userProfile?.currentLevel || 'B1';

  const requestVersion = useRef(0);
  const translationController = useRef<AbortController | null>(null);
  const invalidateTranslation = () => {
    requestVersion.current += 1;
    translationController.current?.abort();
    setIsLoading(false);
    setError(null);
    setTranslationResult(null);
    setSelectedWordDetail(null);
    setIsWordModalOpen(false);
    setWordAnalysisUnavailable(false);
    setVocabularySaveMessage('');
  };
  useEffect(() => () => { requestVersion.current += 1; translationController.current?.abort(); }, []);

  // Perform translation on mount or when requested
  const handleTranslate = async (textToTranslate?: string, parameters?: { sourceLang?: LanguageCode; targetLang?: LanguageCode; mode?: TranslationMode }) => {
    invalidateTranslation();
    const version = requestVersion.current;
    const isCurrent = () => version === requestVersion.current;
    const text = (textToTranslate ?? sourceText).trim();
    if (!text) return;
    const controller = new AbortController();
    translationController.current = controller;
    const deadline = setTimeout(() => controller.abort(), 60000);

    setIsLoading(true);
    setError(null);
    playSound('click');

    try {
      const result = await executeTranslation({
        text,
        sourceLang: parameters?.sourceLang ?? sourceLang,
        targetLang: parameters?.targetLang ?? targetLang,
        mode: parameters?.mode ?? mode,
        userLevel: currentLevel,
      }, learnerId, controller.signal);

      if (!isCurrent()) return;
      setTranslationResult(result);
      playSound('correct');
    } catch (err) {
      if (!isCurrent()) return;
      if (isAiServiceUnavailable(err)) {
        setError(t('ai.unavailable'));
      } else {
        console.error('Translation execution error:', err);
        setError(t('ai.translateFailed'));
      }
      playSound('wrong');
    } finally {
      clearTimeout(deadline);
      if (isCurrent()) { translationController.current = null; setIsLoading(false); }
    }
  };

  // Run initial translation once on mount
  useEffect(() => {
    handleTranslate(sourceText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Language Swap
  const handleSwapLanguages = () => {
    const prevSource = sourceLang === 'auto' ? (translationResult?.detectedSourceLang || 'en') : sourceLang;
    const prevTarget = targetLang;
    const swappedText = translationResult?.translatedText;

    invalidateTranslation();
    setSourceLang(prevTarget);
    setTargetLang(prevSource);

    // Swap texts if translation exists
    if (swappedText) {
      setSourceText(swappedText);
      setTranslationResult(null);
      void handleTranslate(swappedText, { sourceLang: prevTarget, targetLang: prevSource });
    }
  };

  // Interactive Word Click
  const handleWordClick = (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z\u0600-\u06FF]/g, '');
    if (!cleanWord) return;

    // Search in existing word tokens from translation result
    const found = translationResult?.wordTokens?.find(
      w => w.cleanWord.toLowerCase() === cleanWord || w.word.toLowerCase() === cleanWord
    );

    if (!found) {
      setSelectedWordDetail(null);
      setIsWordModalOpen(false);
      setWordAnalysisUnavailable(true);
      return;
    }
    setWordAnalysisUnavailable(false);
    setSelectedWordDetail(found);

    setIsWordModalOpen(true);
  };

  // Save to Vocabulary & bridge to SRS
  const handleSaveToVocabulary = (
    word: WordAnalysisDetail,
    collectionId?: string,
    notes?: string
  ): 'saved' | 'review-failed' | 'failed' => {
    try {
      const saved = saveVocabularyCard({
        wordOrPhrase: word.word,
        translationAr: word.meaningAr,
        definition: word.exampleEn,
        partOfSpeech: word.partOfSpeechAr || word.partOfSpeech,
        ipa: word.ipa,
        exampleEn: word.exampleEn,
        exampleAr: word.exampleAr,
        personalNotes: notes,
        cefrLevel: word.cefrLevel || currentLevel,
        collectionId,
      }, learnerId);
      setCollections(getVocabularyCollections(learnerId));
      setVocabularySaveMessage(t(saved.reviewSynced ? 'wam.saved' : 'ts.vocabReviewPartial'));
      return saved.reviewSynced ? 'saved' : 'review-failed';
    } catch {
      setVocabularySaveMessage(t('vocab.saveError'));
      return 'failed';
    }
  };

  return (
    <div className={`min-h-screen bg-[#060417] text-white ${activeTab === 'practice' ? 'px-1 py-4 sm:p-4' : 'p-4'} md:p-8 space-y-6 max-w-7xl mx-auto`}>
      {activeTab === 'studio' && translationResult?.historySaved === false && <p role="status" className="rounded-xl border border-amber-400/30 p-4 text-sm leading-7 text-amber-200">{t('vocab.saveError')}</p>}
      {wordAnalysisUnavailable && (
        <p role="status" className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          {t('ts.analysisUnavailable')}
        </p>
      )}
      {vocabularySaveMessage && <p role="status" className="rounded-xl border border-white/15 p-4 text-sm leading-7 text-cyan-100">{vocabularySaveMessage}</p>}
      {/* Studio Header & Brand Identity */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0d0c24] via-[#120f38] to-[#0d0c24] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 min-w-0 w-full md:w-auto space-y-2 text-start">
          <div className="flex flex-col min-[360px]:flex-row items-start gap-2 min-w-0">
            <span className="shrink-0 p-2 rounded-xl bg-gradient-to-br from-[#41e7ff]/20 to-[#a855f7]/20 border border-[#41e7ff]/30 text-[#41e7ff]">
              <Languages className="w-6 h-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight min-w-0 flex flex-wrap items-center gap-2">
              <span className="min-w-0 break-words [overflow-wrap:anywhere]">{t('ts.badge')}</span>
              <span className="shrink-0 whitespace-nowrap text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#41e7ff] text-black">
                PRO STUDIO
              </span>
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#b9b6d5] max-w-2xl leading-relaxed break-words">
            {t('ts.blurb')}
          </p>
        </div>

        {/* Co-Pilot & Stats Widget */}
        <div className="relative z-10 min-w-0 max-w-full flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setIsAssistantOpen(true);
            }}
            className="flex min-w-0 max-w-full items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-[#41e7ff]/20 border border-white/10 hover:border-[#41e7ff]/40 text-slate-200 hover:text-[#41e7ff] text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <Bot className="w-4 h-4 shrink-0 text-[#41e7ff]" />
            <span>{t('ts.assistant')}</span>
          </button>
        </div>
      </div>

      {/* Primary Studio Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: 'studio', label: t('ts.studio'), icon: Languages, badge: t('ts.main') },
          { id: 'documents', label: t('ts.documents'), icon: FileText },
          { id: 'voice', label: t('ts.voice'), icon: Mic },
          { id: 'ocr', label: t('ts.ocr'), icon: Camera },
          { id: 'practice', label: t('ts.practice'), icon: Target },
          { id: 'vocab', label: t('ts.vocab'), icon: BookmarkCheck },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                playSound('click');
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-[#41e7ff] to-[#7c3aed] text-black shadow-lg shadow-[#41e7ff]/20 font-black'
                  : 'bg-[#0d0c24] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-normal ${isActive ? 'bg-black/30 text-white' : 'bg-white/10 text-[#41e7ff]'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. STUDIO TAB: MAIN TRANSLATOR INTERFACE                                  */}
      {/* ========================================================================= */}
      {activeTab === 'studio' && (
        <div className="space-y-6">
          {/* Controls Bar: Language Selector & Mode Selector */}
          <div className="space-y-4">
            <LanguageSelector
              sourceLang={sourceLang}
              targetLang={targetLang}
              detectedLang={translationResult?.detectedSourceLang}
              onSourceChange={lang => { invalidateTranslation(); setSourceLang(lang); }}
              onTargetChange={lang => { invalidateTranslation(); setTargetLang(lang); }}
              onSwap={handleSwapLanguages}
            />

            <ModeSelector currentMode={mode} onSelectMode={nextMode => { invalidateTranslation(); setMode(nextMode); }} />
          </div>

          {/* Responsive Split Editor / Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch min-h-[340px]">
            {/* Left/Right Source Editor */}
            <SourceEditor
              text={sourceText}
              sourceLang={sourceLang}
              detectedLang={translationResult?.detectedSourceLang}
              onChangeText={text => { invalidateTranslation(); setSourceText(text); }}
              onTranslate={() => handleTranslate()}
              isLoading={isLoading}
              onStartVoiceInput={() => setActiveTab('voice')}
            />

            {/* Right/Left Translation Output */}
            <TranslationOutput
              translatedText={translationResult?.translatedText || ''}
              targetLang={targetLang}
              isLoading={isLoading}
              error={error}
              onRetry={() => handleTranslate()}
              onWordClick={handleWordClick}
              onExplainClick={() => {
                const el = document.getElementById('pedagogical-explanation-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>

          {/* Multiple Translation Alternatives Section */}
          {translationResult?.alternatives && translationResult.alternatives.length > 0 && (
            <TranslationAlternatives
              alternatives={translationResult.alternatives}
              targetLang={targetLang}
              onSelectAlternative={alt => {
                if (translationResult) {
                  setTranslationResult({
                    ...translationResult,
                    translatedText: alt,
                  });
                }
              }}
            />
          )}

          {/* AI Translation Explanation Section */}
          {translationResult?.explanation && (
            <div id="pedagogical-explanation-section">
              <ExplanationPanel
                explanation={translationResult.explanation}
                onWordClick={handleWordClick}
                onSaveWord={handleSaveToVocabulary}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DOCUMENTS TAB                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'documents' && (
        <DocumentTranslatorTab
          learnerId={learnerId}
          sourceLang={sourceLang}
          targetLang={targetLang}
          mode={mode}
        />
      )}

      {/* ========================================================================= */}
      {/* 3. VOICE TAB                                                              */}
      {/* ========================================================================= */}
      {activeTab === 'voice' && (
        <VoiceTranslatorTab
          learnerId={learnerId}
          sourceLang={sourceLang}
          targetLang={targetLang}
          mode={mode}
        />
      )}

      {/* ========================================================================= */}
      {/* 4. OCR & CAMERA TAB                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'ocr' && <CameraOcrTab targetLang={targetLang} />}

      {/* ========================================================================= */}
      {/* 5. PRACTICE LAB TAB                                                       */}
      {/* ========================================================================= */}
      {activeTab === 'practice' && (
        <PracticeModeTab
          userLevel={currentLevel}
          onAwardXp={xp => {
            if (userProfile) userProfile.xp += xp;
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* 6. VOCABULARY & HISTORY TAB                                               */}
      {/* ========================================================================= */}
      {activeTab === 'vocab' && (
        <VocabularyHistoryTab
          learnerId={learnerId}
          onReuseTranslation={(text, reuseMode) => {
            setSourceText(text);
            if (reuseMode) setMode(reuseMode as TranslationMode);
            setActiveTab('studio');
            void handleTranslate(text, { mode: reuseMode as TranslationMode | undefined });
          }}
        />
      )}

      {/* Interactive Word Analysis Modal */}
      <WordAnalysisModal
        word={selectedWordDetail}
        isOpen={isWordModalOpen}
        onClose={() => setIsWordModalOpen(false)}
        onSaveToVocabulary={handleSaveToVocabulary}
        collections={collections}
      />

      {/* Smart Translation Assistant Drawer */}
      <SmartAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        originalText={sourceText}
        translatedText={translationResult?.translatedText || ''}
        sourceLang={sourceLang}
        targetLang={targetLang}
        mode={mode}
      />
    </div>
  );
};
