// ==============================================================================
// Henglish Academy (HENGLISH) - AUTOMATED TEST SUITE FOR AI ACADEMY
// Tests Platform Context, Search, Tool Dispatcher, Sessions, and System Prompts
// ==============================================================================

import { 
  searchGrammarLessons, 
  getGrammarLessonDetails, 
  searchVocabulary, 
  getExamQuestions, 
  getRealLifeScenarios,
  getStudentLearningSummary,
  executePlatformTool
} from './src/services/aiPlatformContext';
import { 
  buildAssistantSystemPrompt, 
  ASSISTANTS_REGISTRY, 
  AiTutorMode 
} from './src/services/aiPrompts';
import { 
  dispatchAiChat, 
  checkRateLimit, 
  getAiConfig 
} from './server/aiService';
import { 
  createNewSession, 
  getSessionsForAssistant, 
  updateSession, 
  renameSession, 
  deleteSession 
} from './src/services/aiConversationManager';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: unknown) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`, details || '');
    failed++;
  }
}

async function runTestSuite() {
  console.log('🦅 ==========================================================');
  console.log('   HENGLISH AI ACADEMY AUTOMATED TEST SUITE');
  console.log('==========================================================\n');

  // --- TEST GROUP 1: Platform Context & Search ---
  console.log('📦 Test Group 1: Platform Context & Curriculum Search Engine');

  const futurePerfectRules = searchGrammarLessons('future perfect');
  assert(
    futurePerfectRules.length > 0 && futurePerfectRules[0].id === 'future-perfect',
    'searchGrammarLessons finds Future Perfect rule by name'
  );
  assert(
    futurePerfectRules[0].route === '#courses/grammar/future-perfect',
    'Future Perfect links to flagship route #courses/grammar/future-perfect'
  );

  const presentSimpleDetails = getGrammarLessonDetails('present-simple');
  assert(
    presentSimpleDetails !== null && presentSimpleDetails.goldenFormula.includes('V1'),
    'getGrammarLessonDetails retrieves valid Present Simple formula'
  );
  assert(
    presentSimpleDetails?.egyptianTips.length! > 0,
    'Present Simple contains authentic Egyptian Arabic pedagogical tips'
  );

  const vocabWords = searchVocabulary('deadline');
  assert(
    vocabWords.length > 0 && vocabWords[0].word.toLowerCase() === 'deadline',
    'searchVocabulary retrieves matching target word'
  );

  const examQuestions = getExamQuestions('grammar', 'A1', 2);
  assert(
    examQuestions.length > 0 && examQuestions[0].skill === 'grammar' && examQuestions[0].level === 'A1',
    'getExamQuestions retrieves level-appropriate A1 grammar questions'
  );

  const scenarios = getRealLifeScenarios('travel');
  assert(
    scenarios.length > 0 && scenarios[0].category === 'travel',
    'getRealLifeScenarios filters authentic travel simulations'
  );

  // --- TEST GROUP 2: Student Progress Isolation & Weak Areas ---
  console.log('\n📊 Test Group 2: Student Progress & Weak Learning Area Detection');

  const mockProgress = {
    userProfile: {
      id: 'usr-sarah',
      nameAr: 'سارة عبد الرحمن',
      currentLevel: 'B1' as const,
      streakDays: 7,
    },
    progress: {
      completedLessons: ['lesson-1', 'lesson-2'],
      quizScores: {
        'present-perfect-quiz': { score: 4, total: 10, date: '2026-10-29' }, // 40% (weak)
        'future-perfect-quiz': { score: 9, total: 10, date: '2026-10-30' },  // 90% (mastered)
      },
    },
  };

  const studentSummary = getStudentLearningSummary(mockProgress);
  assert(
    studentSummary.completedLessonsCount === 2,
    'Student summary calculates completed lesson count accurately'
  );
  assert(
    studentSummary.verifiedWeakAreas.includes('present-perfect-quiz'),
    'Weak learning areas detected from verified quiz scores < 70%'
  );
  assert(
    !studentSummary.verifiedWeakAreas.includes('future-perfect-quiz'),
    'Mastered quizzes (90%) are not flagged as weak areas'
  );

  // --- TEST GROUP 3: Tool Dispatcher ---
  console.log('\n🛠️ Test Group 3: Universal Platform Tool Dispatcher');

  const toolResult = (await executePlatformTool('searchGrammarLessons', { query: 'conditionals' })) as any[];
  assert(
    Array.isArray(toolResult) && toolResult.some(r => r.id.includes('conditional')),
    'Universal tool dispatcher executes searchGrammarLessons correctly'
  );

  // --- TEST GROUP 4: 7 Specialized System Prompts & CEFR Adaptation ---
  console.log('\n🧠 Test Group 4: 7 Specialized Assistant Prompts & Dynamic Levels');

  const modes: AiTutorMode[] = [
    'grammar-teacher',
    'conversation-partner',
    'vocabulary-coach',
    'writing-assistant',
    'pronunciation-coach',
    'exam-trainer',
    'interview-coach',
  ];

  for (const mode of modes) {
    const meta = ASSISTANTS_REGISTRY[mode];
    assert(
      meta !== undefined && meta.suggestedQuestions.length >= 3,
      `Assistant [${mode}] is registered with full metadata & quick suggestions`
    );

    const a1Prompt = buildAssistantSystemPrompt(mode, 'A1', mockProgress);
    assert(
      a1Prompt.includes('Beginner (A1)') && a1Prompt.includes('سارة عبد الرحمن'),
      `Assistant [${mode}] generates personalized A1 prompt for student`
    );

    const c1Prompt = buildAssistantSystemPrompt(mode, 'C1', mockProgress);
    assert(
      c1Prompt.includes('Advanced (C1)'),
      `Assistant [${mode}] generates elevated C1 prompt with native styling`
    );
  }

  // --- TEST GROUP 5: AI Dispatcher & Local Brain ---
  console.log('\n⚡ Test Group 5: AI Dispatcher, Rate Limiting & Local Brain');

  const localGrammarResp = await dispatchAiChat({
    mode: 'grammar-teacher',
    userLevel: 'B1',
    message: 'إمتى بستخدم المستقبل التام Future Perfect؟',
    platformContext: mockProgress,
  });

  assert(
    localGrammarResp.text.includes('will have + V3') && localGrammarResp.text.includes('courses/grammar/future-perfect'),
    'Local educational brain explains Future Perfect and links to official course'
  );

  const localWritingResp = await dispatchAiChat({
    mode: 'writing-assistant',
    userLevel: 'B1',
    message: 'I am agree with your decision.',
  });

  assert(
    localWritingResp.corrections !== undefined &&
    localWritingResp.corrections.some(c => c.wrong.includes('I am agree') && c.correct.includes('I agree')),
    'Writing assistant identifies and explains grammar errors with corrections'
  );

  const isAllowed = checkRateLimit('test-client-1');
  assert(isAllowed === true, 'Rate limiter permits legitimate requests');

  console.log('\n==========================================================');
  console.log(`🏁 TEST RUN FINISHED: ${passed} PASSED, ${failed} FAILED`);
  console.log('==========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});

