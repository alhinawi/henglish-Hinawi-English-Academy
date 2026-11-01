// ==============================================================================
// Henglish Academy (HENGLISH) - COMPLETE AI TRANSLATION STUDIO PAGE
// Flagship contextual translation engine, grammar awareness, OCR, voice & practice
// ==============================================================================

import React, { useState, useEffect } from 'react';
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

interface TranslationStudioPageProps {
  userProfile?: UserProfile;
}

export const TranslationStudioPage: React.FC<TranslationStudioPageProps> = ({ userProfile }) => {
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
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [collections, setCollections] = useState<VocabularyCollection[]>(() => getVocabularyCollections());

  // User Level
  const currentLevel: CEFRLevel = userProfile?.currentLevel || 'B1';

  // Perform translation on mount or when requested
  const handleTranslate = async (textToTranslate?: string) => {
    const text = (textToTranslate || sourceText).trim();
    if (!text) return;

    setIsLoading(true);
    setError(null);
    playSound('click');

    try {
      const result = await executeTranslation({
        text,
        sourceLang,
        targetLang,
        mode,
        userLevel: currentLevel,
      });

      setTranslationResult(result);
      playSound('correct');
    } catch (err) {
      console.error('Translation execution error:', err);
      setError('تعذر إتمام الترجمة الذكية. تفضل بالمحاولة مجدداً.');
      playSound('wrong');
    } finally {
      setIsLoading(false);
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

    setSourceLang(prevTarget);
    setTargetLang(prevSource);

    // Swap texts if translation exists
    if (translationResult?.translatedText) {
      setSourceText(translationResult.translatedText);
      setTranslationResult(null);
      handleTranslate(translationResult.translatedText);
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

    if (found) {
      setSelectedWordDetail(found);
    } else {
      // Craft on-the-fly analysis card
      setSelectedWordDetail({
        word,
        cleanWord,
        meaningAr: `المعنى السياقي لكلمة "${word}"`,
        partOfSpeech: 'Word',
        partOfSpeechAr: 'كلمة معجمية',
        ipa: `/${cleanWord}/`,
        cefrLevel: cleanWord.length > 7 ? 'B2' : 'B1',
        exampleEn: `She pronounced the word "${word}" with great precision.`,
        exampleAr: `نطقت كلمة "${word}" بدقة بالغة.`,
        synonyms: [cleanWord + ' equivalent'],
        antonyms: [],
        collocations: [cleanWord + ' phrase'],
        relatedTerms: [],
      });
    }

    setIsWordModalOpen(true);
  };

  // Save to Vocabulary & bridge to SRS
  const handleSaveToVocabulary = (
    word: WordAnalysisDetail,
    collectionId?: string,
    notes?: string
  ) => {
    saveVocabularyCard({
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
    });
    setCollections(getVocabularyCollections());
  };

  return (
    <div className="min-h-screen bg-[#060417] text-white p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Studio Header & Brand Identity */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#0d0c24] via-[#120f38] to-[#0d0c24] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#41e7ff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1 text-right">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-br from-[#41e7ff]/20 to-[#a855f7]/20 border border-[#41e7ff]/30 text-[#41e7ff]">
              <Languages className="w-6 h-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>استوديو الترجمة والتحليل اللغوي AI</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#41e7ff] text-black">
                PRO STUDIO
              </span>
            </h1>
          </div>
          <p className="text-xs md:text-sm text-[#b9b6d5] max-w-2xl leading-relaxed">
            محرك ترجمة سياقي متقدم يجمع بين دقة الترجمة الذكية، الشرح النحوي الأكاديمي، تحليل الفونيتكس لكل كلمة، ونظام التكرار المتباعد.
          </p>
        </div>

        {/* Co-Pilot & Stats Widget */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              playSound('click');
              setIsAssistantOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-[#41e7ff]/20 border border-white/10 hover:border-[#41e7ff]/40 text-slate-200 hover:text-[#41e7ff] text-xs font-bold transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <Bot className="w-4 h-4 text-[#41e7ff]" />
            <span>اسأل مساعد الترجمة الذكي</span>
          </button>
        </div>
      </div>

      {/* Primary Studio Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: 'studio', label: 'المترجم الذكي والشرح', icon: Languages, badge: 'رئيسي' },
          { id: 'documents', label: 'ترجمة المستندات (DOCX/PDF)', icon: FileText },
          { id: 'voice', label: 'الترجمة الصوتية الحية', icon: Mic },
          { id: 'ocr', label: 'المسح البصري والصور (OCR)', icon: Camera },
          { id: 'practice', label: 'تحديات ومعمل الترجمة', icon: Target, badge: 'XP' },
          { id: 'vocab', label: 'المفردات والسجل (SRS)', icon: BookmarkCheck },
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
              onSourceChange={setSourceLang}
              onTargetChange={setTargetLang}
              onSwap={handleSwapLanguages}
            />

            <ModeSelector currentMode={mode} onSelectMode={setMode} />
          </div>

          {/* Responsive Split Editor / Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch min-h-[340px]">
            {/* Left/Right Source Editor */}
            <SourceEditor
              text={sourceText}
              sourceLang={sourceLang}
              detectedLang={translationResult?.detectedSourceLang}
              onChangeText={setSourceText}
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
          onReuseTranslation={(text, reuseMode) => {
            setSourceText(text);
            if (reuseMode) setMode(reuseMode as TranslationMode);
            setActiveTab('studio');
            handleTranslate(text);
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
