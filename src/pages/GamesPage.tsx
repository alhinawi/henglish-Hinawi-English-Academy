// ==============================================================================
// HENGLISH ACADEMY (HENGLISH 2.0) - COMPLETE GAMEVERSE PLATFORM
// Real educational gaming arena with 30+ independently playable distinct games
// ==============================================================================

import React, { useState } from 'react';
import { GameVerseDashboard } from '../components/gameverse/GameVerseDashboard';
import { VocabularyRushGame } from '../components/gameverse/VocabularyRushGame';
import { WordDetectiveGame } from '../components/gameverse/WordDetectiveGame';
import { SentenceBuilderGame } from '../components/gameverse/SentenceBuilderGame';
import { ErrorHunterGame } from '../components/gameverse/ErrorHunterGame';
import { SpellingBeeGame } from '../components/gameverse/SpellingBeeGame';
import { AiDuelGame } from '../components/gameverse/AiDuelGame';
import { GrammarTowerGame } from '../components/gameverse/GrammarTowerGame';
import { V3BlitzGame } from '../components/gameverse/V3BlitzGame';
import { PassiveVoiceConverterGame } from '../components/gameverse/PassiveVoiceConverterGame';
import { ParagraphBuilderGame } from '../components/gameverse/ParagraphBuilderGame';
import { ReadingSpeedsterGame } from '../components/gameverse/ReadingSpeedsterGame';
import { DictationChallengeGame } from '../components/gameverse/DictationChallengeGame';
import { ListeningGapFillGame } from '../components/gameverse/ListeningGapFillGame';
import { StressDetectiveGame } from '../components/gameverse/StressDetectiveGame';
import { WordFormationLabGame } from '../components/gameverse/WordFormationLabGame';
import { ChoiceGameEngine } from '../components/gameverse/ChoiceGameEngine';
import { MultiplayerLobbyModal } from '../components/gameverse/MultiplayerLobbyModal';
import { FlashcardDeck } from '../components/FlashcardDeck';
import { FLASHCARD_DECK } from '../data/flashcardsData';
import { playSound } from '../utils/audio';
import {
  generateSynonymHunterRound,
  generateAntonymArenaRound,
  generateWordAssociationRound,
  generateContextMasterRound,
  generatePhrasalQuestRound,
  generateIdiomExplorerRound,
  generateCollocationRound,
  generateTenseSwitchRound,
  generateConditionalArchitectRound,
  generateGrammarDetectiveRound,
  generatePronunciationArenaRound,
  generateMinimalPairsRound,
  generatePhonemeMatchRound,
  generateListeningDetectiveRound,
  generateAccentDetectiveRound,
  generateStoryCompletionRound,
} from '../services/gameGenerationService';
import { Gamepad2, Swords, Layers } from 'lucide-react';

export const GamesPage: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [showMultiplayerModal, setShowMultiplayerModal] = useState<boolean>(false);

  const handleLaunchGame = (gameId: string) => {
    playSound('click');
    if (gameId === 'multiplayer-arena') {
      setShowMultiplayerModal(true);
    } else {
      setActiveView(gameId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-right">
      
      {/* Primary Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#41e7ff]/15 text-[#41e7ff] border border-[#41e7ff]/30">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>HENGLISH GAMEVERSE • كبرى ساحات الألعاب التعليمية الموثقة</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Cairo',sans-serif]">
          ساحة الألعاب والمبارزات اللغوية 🎮
        </h1>
        <p className="text-sm sm:text-base text-[#b9b6d5] max-w-3xl leading-relaxed">
          أكثر من 30 لعبة تعليمية تفاعلية حقيقية مبنية على 55,000 كلمة و 10,000 تعبير و 5,500 جملة وقواعد اللغة الشاملة. تدرّب بالسرعة القصوى، أو ادخل في مواجهة 1v1 ضد الذكاء الاصطناعي، أو أنشئ غرفة تحدٍ جماعية بالوقت الحقيقي!
        </p>
      </div>

      {/* Quick Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar border-b border-white/10">
        <button
          onClick={() => {
            playSound('click');
            setActiveView('dashboard');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeView === 'dashboard'
              ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#21132c] shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>الساحة الرئيسية (GameVerse Arena)</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('ai-duel');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeView === 'ai-duel'
              ? 'bg-linear-to-r from-[#ff4f9a] to-[#9b7bff] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          <Swords className="w-4 h-4 text-[#ffd166]" />
          <span>مبارزة الذكاء الاصطناعي ⚔️</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('grammar-tower');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'grammar-tower'
              ? 'bg-linear-to-r from-[#ffd166] to-[#ff9c66] text-[#0c0b20] shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🏰 برج القواعد
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('v3-blitz');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'v3-blitz'
              ? 'bg-linear-to-r from-[#41e7ff] to-[#9b7bff] text-[#0c0b20] shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          ⚡ سباق V3
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('vocab-rush');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'vocab-rush'
              ? 'bg-linear-to-r from-[#41e7ff] to-[#c4ff55] text-[#0c0b20] shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          ⚡ سباق المفردات
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('error-hunter');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'error-hunter'
              ? 'bg-linear-to-r from-[#ff4f9a] to-[#ffd166] text-[#0c0b20] shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🎯 صائد الأخطاء
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('spelling-bee');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'spelling-bee'
              ? 'bg-linear-to-r from-[#ffd166] to-[#c4ff55] text-[#0c0b20] shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          ✍️ تحدي التهجئة
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('word-detective');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'word-detective'
              ? 'bg-linear-to-r from-[#9b7bff] to-[#41e7ff] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🕵️ المحقق اللغوي
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('sentence-builder');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'sentence-builder'
              ? 'bg-linear-to-r from-[#c4ff55] to-[#41e7ff] text-[#0c0b20] shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🧩 تركيب الجمل
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveView('flashcards');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 ${
            activeView === 'flashcards'
              ? 'bg-linear-to-r from-[#9b7bff] to-[#ff4f9a] text-white shadow-lg'
              : 'bg-white/5 text-[#dedbf4] hover:bg-white/10'
          }`}
        >
          🃏 بطاقات الذاكرة
        </button>
      </div>

      {/* ==================================================================== */}
      {/* 1. DASHBOARD & BESPOKE GAME VIEWS */}
      {/* ==================================================================== */}

      {/* VIEW: MAIN DASHBOARD */}
      {activeView === 'dashboard' && (
        <GameVerseDashboard
          onSelectGame={handleLaunchGame}
          onOpenMultiplayer={() => setShowMultiplayerModal(true)}
        />
      )}

      {/* VIEW: VOCABULARY RUSH */}
      {activeView === 'vocab-rush' && (
        <VocabularyRushGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: WORD DETECTIVE */}
      {activeView === 'word-detective' && (
        <WordDetectiveGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: SENTENCE BUILDER */}
      {activeView === 'sentence-builder' && (
        <SentenceBuilderGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: ERROR HUNTER */}
      {activeView === 'error-hunter' && (
        <ErrorHunterGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: SPELLING BEE */}
      {activeView === 'spelling-bee' && (
        <SpellingBeeGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: AI DUEL */}
      {activeView === 'ai-duel' && (
        <AiDuelGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: GRAMMAR TOWER */}
      {activeView === 'grammar-tower' && (
        <GrammarTowerGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: V3 BLITZ */}
      {activeView === 'v3-blitz' && (
        <V3BlitzGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: PASSIVE CONVERTER */}
      {activeView === 'passive-converter' && (
        <PassiveVoiceConverterGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: PARAGRAPH BUILDER */}
      {activeView === 'paragraph-builder' && (
        <ParagraphBuilderGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: READING SPEEDSTER */}
      {activeView === 'reading-speedster' && (
        <ReadingSpeedsterGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: DICTATION CHALLENGE */}
      {activeView === 'dictation-challenge' && (
        <DictationChallengeGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: LISTENING GAP FILL */}
      {activeView === 'listening-gap-fill' && (
        <ListeningGapFillGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: STRESS DETECTIVE */}
      {activeView === 'stress-detective' && (
        <StressDetectiveGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: WORD FORMATION LAB */}
      {activeView === 'word-formation' && (
        <WordFormationLabGame onExit={() => setActiveView('dashboard')} />
      )}

      {/* VIEW: FLASHCARDS */}
      {activeView === 'flashcards' && (
        <FlashcardDeck cards={FLASHCARD_DECK} />
      )}

      {/* ==================================================================== */}
      {/* 2. DYNAMIC CHOICE-ENGINE VIEWS */}
      {/* ==================================================================== */}

      {/* Synonym Arena */}
      {activeView === 'synonym-hunter' && (
        <ChoiceGameEngine
          gameId="synonym-hunter"
          title="Synonym Arena"
          titleAr="معركة المترادفات 🏹"
          category="vocabulary"
          icon="🏹"
          badge="Synonym Champion"
          durationSeconds={40}
          questionCount={6}
          generator={generateSynonymHunterRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Antonym Arena */}
      {activeView === 'antonym-arena' && (
        <ChoiceGameEngine
          gameId="antonym-arena"
          title="Antonym Arena"
          titleAr="حلبة الأضداد والمعكوسات ⚖️"
          category="vocabulary"
          icon="⚖️"
          badge="Polarity Master"
          durationSeconds={35}
          questionCount={6}
          generator={generateAntonymArenaRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Word Association */}
      {activeView === 'word-association' && (
        <ChoiceGameEngine
          gameId="word-association"
          title="Word Association"
          titleAr="الروابط الذهنية والدلالية 🔗"
          category="vocabulary"
          icon="🔗"
          badge="Semantic Linker"
          durationSeconds={40}
          questionCount={5}
          generator={generateWordAssociationRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Context Master */}
      {activeView === 'context-master' && (
        <ChoiceGameEngine
          gameId="context-master"
          title="Context Master"
          titleAr="سيد السياق والمواقف 🎭"
          category="vocabulary"
          icon="🎭"
          badge="Context Sensei"
          durationSeconds={45}
          questionCount={5}
          generator={generateContextMasterRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Phrasal Verb Quest */}
      {activeView === 'phrasal-quest' && (
        <ChoiceGameEngine
          gameId="phrasal-quest"
          title="Phrasal Verb Quest"
          titleAr="متاهة الأفعال المركبة 🧭"
          category="vocabulary"
          icon="🧭"
          badge="Phrasal Conqueror"
          durationSeconds={50}
          questionCount={6}
          generator={generatePhrasalQuestRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Idiom Explorer */}
      {activeView === 'idiom-explorer' && (
        <ChoiceGameEngine
          gameId="idiom-explorer"
          title="Idiom Explorer"
          titleAr="مستكشف الأمثال والتعبيرات 🔮"
          category="vocabulary"
          icon="🔮"
          badge="Idiom Sage"
          durationSeconds={45}
          questionCount={5}
          generator={generateIdiomExplorerRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Collocation Challenge */}
      {activeView === 'collocation-challenge' && (
        <ChoiceGameEngine
          gameId="collocation-challenge"
          title="Collocation Challenge"
          titleAr="تحدي المتلازمات اللفظية 🤝"
          category="vocabulary"
          icon="🤝"
          badge="Natural Collocator"
          durationSeconds={40}
          questionCount={6}
          generator={generateCollocationRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Tense Switch */}
      {activeView === 'tense-switch' && (
        <ChoiceGameEngine
          gameId="tense-switch"
          title="Tense Switch"
          titleAr="محوّل الأزمنة القواعدية ⏳"
          category="grammar"
          icon="⏳"
          badge="Tense Shifter"
          durationSeconds={45}
          questionCount={5}
          generator={generateTenseSwitchRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Conditional Architect */}
      {activeView === 'conditional-architect' && (
        <ChoiceGameEngine
          gameId="conditional-architect"
          title="Conditional Architect"
          titleAr="مهندس الجمل الشرطية 🏗️"
          category="grammar"
          icon="🏗️"
          badge="Condition Builder"
          durationSeconds={45}
          questionCount={5}
          generator={generateConditionalArchitectRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Grammar Detective */}
      {activeView === 'grammar-detective' && (
        <ChoiceGameEngine
          gameId="grammar-detective"
          title="Grammar Detective"
          titleAr="محقق أجزاء الكلام والأفخاخ 🔍"
          category="grammar"
          icon="🔍"
          badge="Syntax Sleuth"
          durationSeconds={45}
          questionCount={5}
          generator={generateGrammarDetectiveRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Pronunciation Arena */}
      {activeView === 'pronunciation-arena' && (
        <ChoiceGameEngine
          gameId="pronunciation-arena"
          title="Pronunciation Arena"
          titleAr="ساحة الرموز الصوتية IPA 🗣️"
          category="spelling"
          icon="🗣️"
          badge="Phonetics Pro"
          durationSeconds={40}
          questionCount={6}
          generator={generatePronunciationArenaRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Minimal Pairs */}
      {activeView === 'minimal-pairs' && (
        <ChoiceGameEngine
          gameId="minimal-pairs"
          title="Minimal Pairs Challenge"
          titleAr="تحدي الأزواج الصوتية الدقيقة 🎧"
          category="spelling"
          icon="🎧"
          badge="Audio Discriminator"
          durationSeconds={35}
          questionCount={6}
          generator={generateMinimalPairsRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Phoneme Match */}
      {activeView === 'phoneme-match' && (
        <ChoiceGameEngine
          gameId="phoneme-match"
          title="Phoneme Match"
          titleAr="مطابقة الفونيمات والأصوات 🔤"
          category="spelling"
          icon="🔤"
          badge="Phoneme Wizard"
          durationSeconds={40}
          questionCount={5}
          generator={generatePhonemeMatchRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Listening Detective */}
      {activeView === 'listening-detective' && (
        <ChoiceGameEngine
          gameId="listening-detective"
          title="Listening Detective"
          titleAr="محقق الاستماع الصوتي 🕵️‍♂️"
          category="listening"
          icon="🕵️‍♂️"
          badge="Golden Ear"
          durationSeconds={45}
          questionCount={4}
          generator={generateListeningDetectiveRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Accent Detective */}
      {activeView === 'accent-detective' && (
        <ChoiceGameEngine
          gameId="accent-detective"
          title="Accent Detective"
          titleAr="محقق اللهجات الأمريكية والبريطانية 🌍"
          category="listening"
          icon="🌍"
          badge="Accent Sleuth"
          durationSeconds={40}
          questionCount={5}
          generator={generateAccentDetectiveRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* Story Completion */}
      {activeView === 'story-completion' && (
        <ChoiceGameEngine
          gameId="story-completion"
          title="Story Completion"
          titleAr="إكمال القصة التفاعلية 🧭"
          category="reading"
          icon="🧭"
          badge="Narrative Master"
          durationSeconds={50}
          questionCount={4}
          generator={generateStoryCompletionRound}
          onExit={() => setActiveView('dashboard')}
        />
      )}

      {/* MULTIPLAYER LOBBY MODAL */}
      {showMultiplayerModal && (
        <MultiplayerLobbyModal
          onClose={() => setShowMultiplayerModal(false)}
          onStartMultiplayerGame={roomCode => {
            setShowMultiplayerModal(false);
            setActiveView('ai-duel');
          }}
        />
      )}

    </div>
  );
};
