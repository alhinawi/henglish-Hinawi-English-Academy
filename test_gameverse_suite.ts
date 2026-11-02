// ==============================================================================
// HENGLISH ACADEMY - GAMEVERSE AUTOMATED VERIFICATION SUITE
// Tests catalog integrity, 30+ game generators, routing completeness, and session scoring
// ==============================================================================

import { COMPLETE_GAMES_CATALOG, GameDefinition } from './src/data/gamesCatalogData';
import {
  generateVocabularyRushRound,
  generateWordDetectiveRound,
  generateSynonymHunterRound,
  generateAntonymArenaRound,
  generateWordAssociationRound,
  generateContextMasterRound,
  generatePhrasalQuestRound,
  generateIdiomExplorerRound,
  generateWordFormationRound,
  generateCollocationRound,
  generateSentenceBuilderRound,
  generateErrorHunterRound,
  generateGrammarTowerRound,
  generateTenseSwitchRound,
  generatePassiveVoiceRound,
  generateConditionalArchitectRound,
  generateGrammarDetectiveRound,
  generateSpellingBeeRound,
  generatePronunciationArenaRound,
  generateMinimalPairsRound,
  generateStressDetectiveRound,
  generatePhonemeMatchRound,
  generateListeningDetectiveRound,
  generateDictationRound,
  generateListeningGapFillRound,
  generateAccentDetectiveRound,
  generateReadingSpeedsterRound,
  generateParagraphBuilderRound,
  generateStoryCompletionRound,
  generateDuelQuestions,
} from './src/services/gameGenerationService';
import { submitGameSession } from './src/services/gameverseService';
import * as fs from 'fs';
import * as path from 'path';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

async function runGameVerseSuite() {
  console.log('\n======================================================');
  console.log('🎮 HENGLISH GAMEVERSE COMPREHENSIVE TEST SUITE');
  console.log('======================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: CATALOG SIZE AND DIVERSITY
  // --------------------------------------------------------------------------
  console.log('--- TEST 1: Catalog Integrity & Quantity ---');
  assert(COMPLETE_GAMES_CATALOG.length >= 30, `Catalog contains at least 30 games (found ${COMPLETE_GAMES_CATALOG.length})`);

  const ids = new Set<string>();
  let hasDuplicateId = false;
  COMPLETE_GAMES_CATALOG.forEach(g => {
    if (ids.has(g.id)) {
      hasDuplicateId = true;
      console.error(`Duplicate game ID found: ${g.id}`);
    }
    ids.add(g.id);
  });
  assert(!hasDuplicateId, 'All game IDs are strictly unique without collisions');

  // Verify all fields populated
  const allFieldsPopulated = COMPLETE_GAMES_CATALOG.every(g =>
    g.id &&
    g.titleEn &&
    g.titleAr &&
    g.category &&
    g.cefrLevel &&
    g.descriptionAr &&
    g.icon &&
    g.durationSeconds > 0 &&
    g.xpReward > 0 &&
    g.badge
  );
  assert(allFieldsPopulated, 'Every game has complete metadata (titles, CEFR, XP, duration, badge, icon)');

  // --------------------------------------------------------------------------
  // TEST 2: CATEGORY DISTRIBUTION
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 2: Category Distribution ---');
  const vocabCount = COMPLETE_GAMES_CATALOG.filter(g => g.category === 'vocabulary').length;
  const grammarCount = COMPLETE_GAMES_CATALOG.filter(g => g.category === 'grammar').length;
  const spellingCount = COMPLETE_GAMES_CATALOG.filter(g => g.category === 'spelling').length;
  const listeningCount = COMPLETE_GAMES_CATALOG.filter(g => g.category === 'listening').length;
  const readingCount = COMPLETE_GAMES_CATALOG.filter(g => g.category === 'reading').length;

  console.log(`  Categories: Vocab=${vocabCount}, Grammar=${grammarCount}, Spelling=${spellingCount}, Listening=${listeningCount}, Reading=${readingCount}`);
  assert(vocabCount >= 10, `Vocabulary category has >= 10 games (has ${vocabCount})`);
  assert(grammarCount >= 8, `Grammar category has >= 8 games (has ${grammarCount})`);
  assert(spellingCount >= 5, `Spelling & Sound category has >= 5 games (has ${spellingCount})`);
  assert(listeningCount >= 4, `Listening category has >= 4 games (has ${listeningCount})`);
  assert(readingCount >= 3, `Reading & Writing category has >= 3 games (has ${readingCount})`);

  // --------------------------------------------------------------------------
  // TEST 3: DYNAMIC QUESTION GENERATORS (PHASE 5 AUDIT)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 3: Dynamic Question Generators ---');

  const generators = [
    { name: 'VocabularyRush', fn: () => generateVocabularyRushRound('all', 3) },
    { name: 'WordDetective', fn: () => generateWordDetectiveRound(2) },
    { name: 'SynonymHunter', fn: () => generateSynonymHunterRound(3) },
    { name: 'AntonymArena', fn: () => generateAntonymArenaRound(3) },
    { name: 'WordAssociation', fn: () => generateWordAssociationRound(2) },
    { name: 'ContextMaster', fn: () => generateContextMasterRound(2) },
    { name: 'PhrasalQuest', fn: () => generatePhrasalQuestRound(3) },
    { name: 'IdiomExplorer', fn: () => generateIdiomExplorerRound(2) },
    { name: 'WordFormation', fn: () => generateWordFormationRound(3) },
    { name: 'Collocation', fn: () => generateCollocationRound(3) },
    { name: 'SentenceBuilder', fn: () => generateSentenceBuilderRound('all', 2) },
    { name: 'ErrorHunter', fn: () => generateErrorHunterRound(3) },
    { name: 'GrammarTower', fn: () => generateGrammarTowerRound(4) },
    { name: 'TenseSwitch', fn: () => generateTenseSwitchRound(2) },
    { name: 'PassiveVoice', fn: () => generatePassiveVoiceRound(2) },
    { name: 'ConditionalArchitect', fn: () => generateConditionalArchitectRound(2) },
    { name: 'GrammarDetective', fn: () => generateGrammarDetectiveRound(2) },
    { name: 'SpellingBee', fn: () => generateSpellingBeeRound(2) },
    { name: 'PronunciationArena', fn: () => generatePronunciationArenaRound(3) },
    { name: 'MinimalPairs', fn: () => generateMinimalPairsRound(3) },
    { name: 'StressDetective', fn: () => generateStressDetectiveRound(2) },
    { name: 'PhonemeMatch', fn: () => generatePhonemeMatchRound(2) },
    { name: 'ListeningDetective', fn: () => generateListeningDetectiveRound(2) },
    { name: 'Dictation', fn: () => generateDictationRound(2) },
    { name: 'ListeningGapFill', fn: () => generateListeningGapFillRound(2) },
    { name: 'AccentDetective', fn: () => generateAccentDetectiveRound(2) },
    { name: 'ReadingSpeedster', fn: () => generateReadingSpeedsterRound(2) },
    { name: 'ParagraphBuilder', fn: () => generateParagraphBuilderRound(2) },
    { name: 'StoryCompletion', fn: () => generateStoryCompletionRound(2) },
    { name: 'DuelQuestions', fn: () => generateDuelQuestions(4) },
  ];

  for (const gen of generators) {
    try {
      const questions = await gen.fn();
      const valid =
        Array.isArray(questions) &&
        questions.length > 0 &&
        questions.every(q => q.id && q.prompt && q.correctAnswer && q.explanationAr);
      assert(valid, `Generator: ${gen.name} yielded ${questions.length} valid questions with explanations`);
    } catch (err: any) {
      assert(false, `Generator: ${gen.name} threw error: ${err?.message || err}`);
    }
  }

  // --------------------------------------------------------------------------
  // TEST 4: ROUTING AUDIT (GAMESPAGE.TSX ZERO SILENT FALLBACKS)
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 4: GamesPage.tsx Routing Audit ---');
  const gamesPageSource = fs.readFileSync(path.join(process.cwd(), 'src/pages/GamesPage.tsx'), 'utf-8');

  let allGamesRouted = true;
  for (const game of COMPLETE_GAMES_CATALOG) {
    // Check if the game id has an explicit case or view in GamesPage
    const hasView = gamesPageSource.includes(`activeView === '${game.id}'`);
    if (!hasView) {
      console.error(`Game ID "${game.id}" is not explicitly handled in GamesPage.tsx`);
      allGamesRouted = false;
    }
  }
  assert(allGamesRouted, `Every single game ID (${COMPLETE_GAMES_CATALOG.length}) has an explicit view in GamesPage.tsx`);

  // Verify handleLaunchGame does not have a silent fallback to vocab-rush
  const handleLaunchGameMatch = gamesPageSource.match(/const handleLaunchGame = [\s\S]*?};/);
  const handleLaunchGameBody = handleLaunchGameMatch ? handleLaunchGameMatch[0] : '';
  const hasSilentFallback = handleLaunchGameBody.includes("setActiveView('vocab-rush')");
  assert(!hasSilentFallback, 'No silent fallback routing to vocab-rush in handleLaunchGame');

  // --------------------------------------------------------------------------
  // TEST 5: PERSISTENT SESSION & ANTI-CHEAT XP SUBMISSION
  // --------------------------------------------------------------------------
  console.log('\n--- TEST 5: Persistent Session Submission ---');
  const mockSubmission = {
    gameId: 'grammar-tower',
    score: 120,
    maxScore: 160,
    accuracy: 85,
    durationSeconds: 38,
    answersSummary: [
      { questionId: 'q1', isCorrect: true, userAnswer: 'goes', timeSpentSeconds: 4 },
      { questionId: 'q2', isCorrect: true, userAnswer: 'ate', timeSpentSeconds: 5 },
    ],
    idempotencyKey: `test_sess_${Date.now()}`,
  };

  const sessionResult = await submitGameSession(mockSubmission);
  assert(sessionResult.status === 'success', 'Session submission succeeded');
  assert(sessionResult.xpAwarded > 0, `XP awarded correctly: ${sessionResult.xpAwarded} XP`);
  assert(sessionResult.baseXp > 0, `Base XP calculated: ${sessionResult.baseXp} XP`);
  assert(sessionResult.speedBonus >= 0, `Speed bonus calculated: ${sessionResult.speedBonus} XP`);

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runGameVerseSuite().catch(err => {
  console.error('Test suite failed unexpectedly:', err);
  process.exit(1);
});
