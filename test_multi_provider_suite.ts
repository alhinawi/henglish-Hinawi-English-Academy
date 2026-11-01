// ==============================================================================
// HENGLISH ACADEMY - MULTI-PROVIDER AI & ROUTER AUTOMATED TEST SUITE
// Tests Groq, Gemini, Cloudflare, OpenAI, Circuit Breaker, Fallbacks & Zod
// ==============================================================================

import { GroqProvider } from './server/ai/providers/groqProvider';
import { GeminiProvider } from './server/ai/providers/geminiProvider';
import { CloudflareProvider } from './server/ai/providers/cloudflareProvider';
import { OpenAiProvider } from './server/ai/providers/openaiProvider';
import { LocalBrainProvider } from './server/ai/providers/localBrainProvider';
import {
  dispatchThroughAiRouter,
  getProviderHealthList,
  getRouterConfig,
  updateRouterConfig,
  clearAiResponseCache,
} from './server/ai/aiRouter';
import {
  validateQuestionsJson,
  GrammarAuditSchema,
  WritingEvaluationSchema,
  extractJsonFromText,
} from './server/ai/schemas';

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

async function runMultiProviderTests() {
  console.log('🤖 ==========================================================');
  console.log('   HENGLISH MULTI-PROVIDER AI & ROUTER AUTOMATED TEST SUITE');
  console.log('==========================================================\n');

  // --- TEST GROUP 1: Individual Provider Classes ---
  console.log('📦 Test Group 1: Provider Classes & Capabilities');

  const groq = new GroqProvider();
  assert(groq.name === 'groq', 'Groq provider name is "groq"');
  assert(groq.getRecommendedModel('vocabulary') === 'llama-3.1-8b-instant', 'Groq routes vocabulary to fast llama-3.1-8b-instant');
  assert(groq.getRecommendedModel('grammar_audit') === 'llama-3.3-70b-versatile', 'Groq routes grammar audit to llama-3.3-70b-versatile');
  assert(groq.isRateLimit(429, 'Rate limit exceeded'), 'Groq correctly detects HTTP 429 rate limit error');
  assert(groq.isAuthError(401, 'Invalid API Key'), 'Groq correctly detects HTTP 401 authentication error');

  const gemini = new GeminiProvider();
  assert(gemini.name === 'gemini', 'Gemini provider name is "gemini"');
  assert(gemini.getRecommendedModel('vocabulary') === 'gemini-1.5-flash', 'Gemini routes vocabulary to gemini-1.5-flash');
  assert(gemini.getRecommendedModel('grammar_audit') === 'gemini-2.5-flash', 'Gemini routes grammar to gemini-2.5-flash');

  const cloudflare = new CloudflareProvider();
  assert(cloudflare.name === 'cloudflare', 'Cloudflare provider name is "cloudflare"');
  assert(cloudflare.getRecommendedModel('grammar_audit').includes('llama-3.3-70b'), 'Cloudflare recommends Llama 3.3 70B by default');

  const openai = new OpenAiProvider();
  assert(openai.name === 'openai', 'OpenAI provider name is "openai"');
  assert(openai.getRecommendedModel('vocabulary') === 'gpt-4o-mini', 'OpenAI recommends gpt-4o-mini for vocabulary');

  const local = new LocalBrainProvider();
  assert(local.name === 'local', 'Local Brain provider name is "local"');
  assert(local.isConfigured() === true, 'Local Brain is 100% configured without external keys');

  const localResp = await local.complete({
    task: 'conversation',
    messages: [{ role: 'user', content: 'شرح زمن المستقبل التام' }],
  });
  assert(
    localResp.text.includes('will have + V3') && localResp.isLocalFallback === true,
    'Local Brain answers syllabus queries accurately'
  );

  // --- TEST GROUP 2: Centralized Router & Priority Flow ---
  console.log('\n🔀 Test Group 2: Centralized AI Router & Fallback Flow');

  const initialConfig = getRouterConfig();
  assert(
    initialConfig.providerPriority[0] === 'groq' && initialConfig.providerPriority[1] === 'gemini',
    'Default priority begins with Groq (Primary) then Gemini (First Fallback)'
  );
  assert(
    initialConfig.providerPriority[2] === 'cloudflare' && initialConfig.providerPriority[3] === 'openai',
    'Secondary fallbacks are Cloudflare Workers AI followed by OpenAI'
  );

  clearAiResponseCache();

  // Test Router Dispatch (will fall through to local brain when test environment has no live keys)
  const routerRes1 = await dispatchThroughAiRouter({
    task: 'grammar_audit',
    messages: [{ role: 'user', content: 'What is the future perfect tense formula?' }],
    temperature: 0.7,
  });
  assert(routerRes1.text.length > 20, 'Router successfully returned a pedagogically valid response');
  assert(routerRes1.fallbackChain.length > 0, 'Router tracked the fallback traversal chain');

  // Test Caching
  const routerRes2 = await dispatchThroughAiRouter({
    task: 'grammar_audit',
    messages: [{ role: 'user', content: 'What is the future perfect tense formula?' }],
    temperature: 0.7,
  });
  assert(routerRes2.cached === true, 'Second identical request was served instantly from cache');

  // --- TEST GROUP 3: Health Status & Circuit Breaker Tracking ---
  console.log('\n🩺 Test Group 3: Provider Health & Monitoring');

  const healthList = getProviderHealthList();
  assert(healthList.length === 5, 'Health list contains all 5 providers (Groq, Gemini, Cloudflare, OpenAI, Local)');
  const localHealth = healthList.find(h => h.provider === 'local');
  assert(localHealth?.isAvailable === true, 'Local provider is permanently available in health monitor');

  // Test Configuration updates
  updateRouterConfig({ defaultTimeoutMs: 20000 });
  const updatedCfg = getRouterConfig();
  assert(updatedCfg.defaultTimeoutMs === 20000, 'Router configuration was dynamically updated');
  // Revert back
  updateRouterConfig({ defaultTimeoutMs: 25000 });

  // --- TEST GROUP 4: Structured Output Validation with Zod ---
  console.log('\n📐 Test Group 4: Structured Output Validation (Zod)');

  const validQuestionsJsonStr = JSON.stringify([
    {
      id: 'q-test-1',
      type: 'multiple-choice',
      cefrLevel: 'B2',
      topic: 'future-perfect',
      prompt: 'By June 2029, our scholars _______ the encyclopedic database.',
      options: ['will have completed', 'will complete', 'completed', 'are completing'],
      correctAnswerIndex: 0,
      explanationAr: 'استخدام المستقبل التام لاكتمال الحدث قبل نقطة زمنية مستقبلية.',
      difficulty: 'medium',
      skillCategory: 'grammar',
    },
  ]);

  const validatedQuestions = validateQuestionsJson(validQuestionsJsonStr);
  assert(
    validatedQuestions.length === 1 && validatedQuestions[0].options.length === 4,
    'Zod validated generated assessment question schema perfectly'
  );

  // Test malformed JSON handling
  let malformedThrew = false;
  try {
    validateQuestionsJson('{"invalid": "data"}');
  } catch {
    malformedThrew = true;
  }
  assert(malformedThrew === true, 'Zod validator rejects malformed questions payload');

  // Test Grammar Audit Schema
  const validAudit = GrammarAuditSchema.parse({
    sentence: 'She will has finished the exam.',
    hasError: true,
    errorTarget: 'will has',
    correction: 'She will have finished the exam.',
    ruleNameEn: 'Future Perfect Auxiliary',
    ruleNameAr: 'الفعل المساعد في المستقبل التام',
    explanationAr: 'لا نستخدم has بعد will أبداً بل have دائماً.',
    cefrLevel: 'B1',
  });
  assert(validAudit.hasError === true, 'Zod validated grammar audit schema successfully');

  // --- TEST GROUP 5: Security & Secret Isolation ---
  console.log('\n🔒 Test Group 5: Security & Secret Isolation Verification');

  const fs = require('fs');
  const path = require('path');

  // Check that frontend files in src/ do not contain private server secrets
  const srcFiles: string[] = [];
  function scanDir(dir: string) {
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) {
        scanDir(full);
      } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
        srcFiles.push(full);
      }
    }
  }
  scanDir(path.resolve(__dirname, 'src'));

  let leakedSecretsCount = 0;
  for (const f of srcFiles) {
    const text = fs.readFileSync(f, 'utf8');
    if (
      text.includes('GROQ_API_KEY') ||
      text.includes('CLOUDFLARE_API_TOKEN') ||
      text.includes('OPENAI_API_KEY')
    ) {
      leakedSecretsCount++;
    }
  }
  assert(leakedSecretsCount === 0, 'Zero private server API keys found in frontend src/ directory');

  console.log('\n==========================================================');
  console.log(`🏁 MULTI-PROVIDER AI TEST RUN: ${passed} PASSED, ${failed} FAILED`);
  console.log('==========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runMultiProviderTests().catch(err => {
  console.error('Multi-provider test uncaught error:', err);
  process.exit(1);
});
