// ==============================================================================
// Henglish Academy (HENGLISH) - SECURE SERVER-SIDE AI API & PROVIDER ENGINE
// Supports Google Gemini API, OpenAI API, and Platform-Aware Tool Calling
// Runs securely on the server with zero client credential exposure.
// ==============================================================================

import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { AiTutorMode, buildAssistantSystemPrompt } from '../src/services/aiPrompts';
import { 
  executePlatformTool, 
  PLATFORM_TOOLS, 
  StudentPlatformContext 
} from '../src/services/aiPlatformContext';
import { CEFRLevel } from '../src/types';

// Force IPv4 first on Node to eliminate Windows IPv6 connect timeouts to Google APIs
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

function loadEnvFile() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            const val = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  } catch (err) {
    console.warn('Could not read .env file:', err);
  }
}

// Initial load
loadEnvFile();

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequestBody {
  mode: AiTutorMode;
  userLevel: CEFRLevel;
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  platformContext?: StudentPlatformContext;
  stream?: boolean;
}

export interface ChatResponseBody {
  text: string;
  provider: string;
  model: string;
  corrections?: { wrong: string; correct: string; explanationAr: string }[];
  isLocalFallback: boolean;
  toolCallsExecuted?: string[];
}

// Simple in-memory rate limiter
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 30;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(clientId: string = 'global'): boolean {
  const now = Date.now();
  const client = rateLimitMap.get(clientId);

  if (!client || now > client.resetAt) {
    rateLimitMap.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (client.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  client.count += 1;
  return true;
}

// Get AI provider and keys from server environment
export function getAiConfig() {
  loadEnvFile();
  const env = process.env;
  const geminiKey = env.GEMINI_API_KEY || env.VITE_AI_API_KEY || '';
  const openaiKey = env.OPENAI_API_KEY || '';

  let provider = (env.AI_PROVIDER || env.VITE_AI_PROVIDER || '').toLowerCase();

  if (!provider) {
    if (geminiKey && geminiKey !== 'your_ai_api_key_here') {
      provider = 'gemini';
    } else if (openaiKey) {
      provider = 'openai';
    } else {
      provider = 'local';
    }
  }

  const model = env.AI_MODEL || (provider === 'gemini' ? 'gemini-flash-latest' : provider === 'openai' ? 'gpt-4o-mini' : 'henglisheducational-brain');

  return {
    provider,
    model,
    geminiKey,
    openaiKey,
    timeoutMs: Number(env.REQUEST_TIMEOUT_MS) || 30000,
  };
}

/**
 * Intelligent Local Educational Brain
 * Accurate, pedagogically sound answers based on Henglish syllabus
 * when external LLM API credentials are not set.
 */
export async function getIntelligentLocalBrainResponse(
  body: ChatRequestBody
): Promise<ChatResponseBody> {
  const { mode, userLevel, message, platformContext } = body;
  const q = message.toLowerCase().trim();

  // If query mentions grammar topics, search syllabus and craft pedagogical response
  if (mode === 'grammar-teacher' || q.includes('future perfect') || q.includes('المستقبل التام') || q.includes('will') || q.includes('since')) {
    const searchRes = (await executePlatformTool('searchGrammarLessons', { query: message, level: userLevel }, platformContext)) as Array<{
      id: string;
      titleEn: string;
      titleAr: string;
      goldenFormula: string;
      summaryAr: string;
      route: string;
    }>;

    if (q.includes('future perfect') || q.includes('المستقبل التام')) {
      return {
        text: `### 🦅 شرح زمن المستقبل التام (Future Perfect Tense)

**التركيب الذهبي (Golden Formula):**
> \`Subject + will have + V3 (Past Participle)\`

**إزاي تفكر فيها بالمصري؟**
تخيل نفسك واقف عند نقطة مستقبلية (ديدلاين أو موعد قادم) وبتبص لورا، وتشوف إن الحدث هيكون **اكتمل وانتهى تماماً** قبل اللحظة دي!

📌 **أمثلة حية وواقعية:**
• *By next October, our team will have built the complete platform.*
(بحلول أكتوبر القادم، سنكون قد أتممنا بناء المنصة بالكامل).
• *By 9 PM tonight, Sarah will have finished all her IELTS assignments.*

⚠️ **أشهر فخ يقع فيه الطلاب (Common Trap):**
بعد الروابط الزمنية مثل *By the time* أو *When*، استخدم **مضارع بسيط** مش will:
❌ *By the time dad will arrive...*
✅ *By the time dad **arrives**, I will have cooked dinner.*

🔗 **درس المنصة المعتمد:**
يمكنك فتح الدرس التفاعلي الكامل للمستقبل التام عبر: [#courses/grammar/future-perfect](#courses/grammar/future-perfect)

📝 **سؤال سريع لاختبار فهمك (Quick Check):**
*By 2030, scientists _______ a cure for many diseases.*
1. will discover
2. will have discovered
3. have discovered
*(اكتب إجابتك وسأصححها لك فوراً!)*`,
        provider: 'local-brain',
        model: 'henglisheducational-brain',
        isLocalFallback: true,
      };
    }

    if (q.includes('will') && q.includes('going to')) {
      return {
        text: `### 🦅 الفرق الجوهري بين Will و Going to بالمصري

1️⃣ **Will + Base Verb (V1):**
• **قرار لحظي فوري (Spontaneous Decision):**
  *The phone is ringing; I will answer it!* (التليفون بيرن، هرد عليه حالاً).
• **وعود وعروض مساعدة (Promises & Offers):**
  *Don't worry, I will help you with your project.*
• **تنبؤ بدون دليل مرئي حالي (Prediction based on opinion):**
  *I think it will rain tomorrow.*

2️⃣ **Going to + Base Verb (V1):**
• **خطط ونوايا مسبقة (Prior Plans & Intentions):**
  *I am going to visit Alexandria next weekend.* (مقرر ومخطط من قبل كدة).
• **تنبؤ قائم على دليل حسي مرئي الآن (Prediction with Present Evidence):**
  *Look at those dark black clouds! It is going to rain.* (شايف السحاب الأسود بعينك!).

🔗 **درس المنصة:** راجع درس المستقبل البسيط عبر [#grammar/future-simple](#grammar/future-simple)

🎯 **تطبيق سريع:** لو حد سألك "What are your plans for summer?", هتجاوب بـ Will ولا Going to؟`,
        provider: 'local-brain',
        model: 'henglisheducational-brain',
        isLocalFallback: true,
      };
    }

    if (searchRes && searchRes.length > 0) {
      const topRule = searchRes[0];
      const details = (await executePlatformTool('getGrammarLessonDetails', { ruleId: topRule.id }, platformContext)) as {
        goldenFormula: string;
        summaryAr: string;
        egyptianTips: string[];
        commonTraps: string[];
        examples: { en: string; ar: string }[];
      } | null;

      return {
        text: `### 🦅 شرح قاعدة: ${topRule.titleAr} (${topRule.titleEn})

**التركيب الذهبي:**
> \`${details?.goldenFormula || topRule.goldenFormula}\`

**المفهوم بالمصري:**
${details?.summaryAr || topRule.summaryAr}

📌 **أمثلة تطبيقية:**
${details?.examples?.slice(0, 2).map(e => `• *${e.en}*\n  (${e.ar})`).join('\n') || '• *He studies English every day.*'}

💡 **نصيحة هناوي بالمصري:**
${details?.egyptianTips?.[0] || 'ركز دائماً على الكلمات الدلالية وسياق الجملة.'}

⚠️ **احذر من هذا الفخ:**
${details?.commonTraps?.[0] || 'انتبه لصيغ الأفعال مع الفاعل المفرد.'}

🔗 **الدرس الكامل في الأكاديمية:**
تفضل بزيارة الدرس لمشاهدة المخطط الزمني وفيديوهات الشرح: [${topRule.titleEn}](${topRule.route})`,
        provider: 'local-brain',
        model: 'henglisheducational-brain',
        isLocalFallback: true,
      };
    }
  }

  // 2. Conversation Partner Local Simulation
  if (mode === 'conversation-partner') {
    if (q.includes('airport') || q.includes('مطار')) {
      return {
        text: `Hello there! Welcome to Heathrow Airport, Terminal 5! ✈️ 
I am the check-in agent. May I please see your passport and flight booking confirmation? 

Are you checking any bags today, or just traveling with carry-on luggage?

💡 *Tip: You can respond in English, e.g.: "Hello! Here is my passport. I have one checked suitcase and a backpack."*`,
        provider: 'local-brain',
        model: 'henglisheducational-brain',
        isLocalFallback: true,
      };
    }

    if (q.includes('restaurant') || q.includes('مطعم')) {
      return {
        text: `Good evening and welcome to Le Bistro! 🍽️ 
Do you have a reservation under your name, or would you like a table for one near the window? 

Our chef is serving a marvelous pan-seared salmon with roasted asparagus tonight. Would you like to start with some sparkling water or a beverage?`,
        provider: 'local-brain',
        model: 'henglisheducational-brain',
        isLocalFallback: true,
      };
    }

    return {
      text: `Hello! It's fantastic to practice speaking with you! 💬 
As your conversation partner for CEFR level **${userLevel}**, I'm here to build your real-world conversational confidence. 

What's on your mind today? We could talk about your dream travel destination, modern artificial intelligence, or simulate a daily life scenario!`,
      provider: 'local-brain',
      model: 'henglisheducational-brain',
      isLocalFallback: true,
    };
  }

  // 3. Writing Assistant Local Audit
  if (mode === 'writing-assistant') {
    const corrections: { wrong: string; correct: string; explanationAr: string }[] = [];
    if (q.includes('i am agree')) {
      corrections.push({
        wrong: 'I am agree',
        correct: 'I agree',
        explanationAr: 'الفعل agree فعل أساسي مش صفة، لذلك لا نضع قبله am.',
      });
    }
    if (q.includes('make sense') && q.includes('is make')) {
      corrections.push({
        wrong: 'it is make sense',
        correct: 'it makes sense',
        explanationAr: 'في المضارع البسيط نستخدم الفعل مضافاً إليه s مع it بدون فعل مساعد is.',
      });
    }
    if (q.includes('will to')) {
      corrections.push({
        wrong: 'will to + verb',
        correct: 'will + Base Verb',
        explanationAr: 'الأفعال الناقصة Modals مثل will يأتي بعدها المصدر مجرداً بدون to.',
      });
    }

    return {
      text: `### ✍️ مراجعة وتدقيق النص

${corrections.length > 0 ? 'تم رصد بعض النقاط القواعدية المهمة لتحسين صياغتك لتصبح طبيعية وأصلية:' : 'صياغتك اللغوية واضحة ومفهومة! إليك تحليل الجملة واقتراح تحسين الأسلوب:'}

${corrections.map((c, i) => `${i + 1}. **❌ الخطأ:** \`${c.wrong}\`  
   **✅ الصواب:** \`${c.correct}\`  
   **💡 السبب بالمصري:** ${c.explanationAr}`).join('\n\n')}

✨ **الصياغة الأكاديمية والمهنية المقترحة (Elevated Phrasing):**
> *"I completely concur with your viewpoint, as it is logically compelling and well-grounded."*

💡 **نصيحة إضافية:** استخدم روابط فكرية مثل: *Furthermore, In light of this, Consequently* لربط الجمل بانسيابية.`,
      corrections,
      provider: 'local-brain',
      model: 'henglisheducational-brain',
      isLocalFallback: true,
    };
  }

  // 4. Interview Coach Local Simulation
  if (mode === 'interview-coach') {
    return {
      text: `### 💼 Mock Interview Session (STAR Method)

Welcome! I am your Mock Interview Coach. Let's practice one of the most critical behavioral questions asked by top international companies:

**"Could you tell me about a time when you faced a high-pressure deadline or a conflict in your team, and how you handled it?"**

💡 **Structure your answer with the STAR framework:**
1. **S**ituation (الموقف وسياق المشكلة باختصار)
2. **T**ask (دورك ومسؤوليتك المباشرة)
3. **A**ction (الخطوات العملية والقيادية التي نفذتها بنفسك)
4. **R**esult (النتيجة الملموسة بالأرقام أو الإنجاز النهائي)

Take your time and reply in English. I will give you a detailed evaluation of your vocabulary, tone, and grammar!`,
      provider: 'local-brain',
      model: 'henglisheducational-brain',
      isLocalFallback: true,
    };
  }

  // 5. Default Fallback
  return {
    text: `أهلاً بك يا ${platformContext?.userProfile?.nameAr || 'صديقي'} في أكاديمية هناوي للغة الإنجليزية! 🦅
أنا معلمك الذكي لمستوى **${userLevel}**. أنا جاهز لشرح القواعد، تدريب المفردات، مراجعة كتاباتك، أو ممارسة محادثات حية بالإنجليزية. تفضل بطرح سؤالك وسأجيبك فوراً!`,
    provider: 'local-brain',
    model: 'henglisheducational-brain',
    isLocalFallback: true,
  };
}

/**
 * Formats conversation history for Google Gemini:
 * 1. Ensures contents starts strictly with 'user'.
 * 2. Merges consecutive identical roles.
 * 3. Appends the current message cleanly.
 */
function formatGeminiContents(
  history: { role: 'user' | 'assistant'; content: string }[] | undefined,
  currentMessage: string
): Array<{ role: 'user' | 'model'; parts: { text: string }[] }> {
  const contents: Array<{ role: 'user' | 'model'; parts: { text: string }[] }> = [];

  if (history && history.length > 0) {
    for (const h of history.slice(-10)) {
      if (!h.content || !h.content.trim()) continue;
      const role = h.role === 'user' ? 'user' : 'model';

      // First message in Gemini contents MUST be 'user'
      if (contents.length === 0 && role === 'model') {
        continue;
      }

      // Merge consecutive identical roles
      const last = contents[contents.length - 1];
      if (last && last.role === role) {
        last.parts[0].text += '\n\n' + h.content;
      } else {
        contents.push({ role, parts: [{ text: h.content }] });
      }
    }
  }

  // Append current user message
  const last = contents[contents.length - 1];
  if (last && last.role === 'user') {
    last.parts[0].text += '\n\n' + currentMessage;
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: currentMessage }],
    });
  }

  return contents;
}

/**
 * Call Google Gemini API with Timeout & Platform Context & Automatic Model Fallover
 */
async function callGeminiApi(
  body: ChatRequestBody,
  config: ReturnType<typeof getAiConfig>
): Promise<ChatResponseBody> {
  const systemPrompt = buildAssistantSystemPrompt(body.mode, body.userLevel, body.platformContext);
  
  // Format contents safely for Gemini
  const contents = formatGeminiContents(body.history, body.message);

  // Fallover candidate models to ensure 100% live uptime even during temporary Google 503 spikes
  const candidateModels = [
    config.model,
    'gemini-flash-lite-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest',
  ];
  const models = [...new Set(candidateModels.filter(Boolean))];

  for (const modelName of models) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config.timeoutMs);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.geminiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      });

      clearTimeout(timer);

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (candidateText) {
          return {
            text: candidateText,
            provider: 'gemini',
            model: modelName,
            isLocalFallback: false,
          };
        }
      } else {
        const errText = await response.text();
        console.warn(`Gemini model [${modelName}] returned status ${response.status}:`, errText);
        // Continue to try the next model candidate
        continue;
      }
    } catch (err) {
      clearTimeout(timer);
      console.warn(`Gemini model [${modelName}] request failed:`, err);
      continue;
    }
  }

  // If all external models fail or network completely down, fallback to intelligent local engine
  return getIntelligentLocalBrainResponse(body);
}

/**
 * Call OpenAI API with Timeout & Platform Context
 */
async function callOpenAiApi(
  body: ChatRequestBody,
  config: ReturnType<typeof getAiConfig>
): Promise<ChatResponseBody> {
  const systemPrompt = buildAssistantSystemPrompt(body.mode, body.userLevel, body.platformContext);
  
  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  if (body.history && body.history.length > 0) {
    for (const h of body.history.slice(-8)) {
      messages.push({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.content,
      });
    }
  }

  messages.push({ role: 'user', content: body.message });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  const modelName = config.model.includes('gpt') ? config.model : 'gpt-4o-mini';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.openaiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: modelName,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`OpenAI API error [${response.status}]:`, errText);
      return getIntelligentLocalBrainResponse(body);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (content) {
      return {
        text: content,
        provider: 'openai',
        model: modelName,
        isLocalFallback: false,
      };
    }

    return getIntelligentLocalBrainResponse(body);
  } catch (err) {
    clearTimeout(timer);
    console.warn('OpenAI request failed or timed out:', err);
    return getIntelligentLocalBrainResponse(body);
  }
}

/**
 * Main AI Chat Dispatcher (Server-Side)
 */
export async function dispatchAiChat(body: ChatRequestBody): Promise<ChatResponseBody> {
  const config = getAiConfig();

  if (config.provider === 'gemini' && config.geminiKey && config.geminiKey !== 'your_ai_api_key_here') {
    return callGeminiApi(body, config);
  }

  if (config.provider === 'openai' && config.openaiKey && config.openaiKey !== 'your_openai_api_key_here') {
    return callOpenAiApi(body, config);
  }

  // High-fidelity educational local brain fallback
  return getIntelligentLocalBrainResponse(body);
}

/**
 * Server-Sent Events (SSE) Stream Dispatcher
 */
export async function streamAiChat(
  body: ChatRequestBody,
  onChunk: (chunk: string) => void
): Promise<ChatResponseBody> {
  // If external provider is active, we can stream directly
  // Or stream simulated chunks for local brain
  const fullResponse = await dispatchAiChat(body);
  
  // Emitting chunks naturally
  const words = fullResponse.text.split(' ');
  for (let i = 0; i < words.length; i++) {
    const wordWithSpace = words[i] + (i === words.length - 1 ? '' : ' ');
    onChunk(wordWithSpace);
    // Slight tick delay for natural streaming cadence
    await new Promise(r => setTimeout(r, 18));
  }

  return fullResponse;
}

