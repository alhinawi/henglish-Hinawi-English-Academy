// ==============================================================================
// HENGLISH ACADEMY (HENGLISH 2.0) - DYNAMIC AI QUESTION GENERATION ENGINE
// Multi-Provider Routed & Zod-Validated Assessment Question Generator
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import dns from 'node:dns';
import { dispatchThroughAiRouter } from '../../server/ai/aiRouter';
import { validateQuestionsJson, ValidatedGeneratedQuestion } from '../../server/ai/schemas';
import { applyCorsHeaders, sendJson } from '../../server/auth/serverAuth';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const ipRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 20, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const record = ipRateLimits.get(ip);
  if (!record || now > record.resetAt) {
    ipRateLimits.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (record.count >= limit) return false;
  record.count++;
  return true;
}

export type { ValidatedGeneratedQuestion as GeneratedQuestion };

async function parseBody(req: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown>> {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    if (typeof req.body === 'object' && req.body !== null) {
      return req.body as Record<string, unknown>;
    }
  }

  return new Promise(resolve => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1024 * 1024) resolve({});
    });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

// High-quality static fallback question bank when AI keys are unconfigured
const FALLBACK_BANK: ValidatedGeneratedQuestion[] = [
  {
    id: 'ai-q-fp-1',
    type: 'multiple-choice',
    cefrLevel: 'B2',
    topic: 'future-perfect',
    prompt: 'By 10 PM tonight, the engineering team _______ the entire platform upgrade.',
    options: ['will have completed', 'will complete', 'has completed', 'is completing'],
    correctAnswerIndex: 0,
    explanationAr: 'نستخدم المستقبل التام (will have + V3) لوجود الرابط الزمني By متبوعاً بنقطة زمنية مستقبلية تدل على اكتمال الفعل قبلها.',
    distractorNotesAr: [
      'will complete: مستقبل بسيط لا يعبر عن اكتمال الفعل قبل موعد محدد',
      'has completed: مضارع تام يعبر عن حدث ماضٍ متصل بالحاضر وليس مستقبلاً',
      'is completing: مضارع مستمر يعبر عن حدث لحظي وليس اكتمالاً مستقبلياً',
    ],
    difficulty: 'medium',
    skillCategory: 'grammar',
  },
  {
    id: 'ai-q-cond-1',
    type: 'multiple-choice',
    cefrLevel: 'B1',
    topic: 'conditionals',
    prompt: 'If you _______ daily speaking exercises, your English fluency will improve drastically.',
    options: ['practice', 'will practice', 'practiced', 'had practiced'],
    correctAnswerIndex: 0,
    explanationAr: 'في الحالة الشرطية الأولى (First Conditional)، جملة الشرط بعد If تأتي في زمن المضارع البسيط (Present Simple) وليس المستقبل.',
    distractorNotesAr: [
      'will practice: خطأ شائع، لا نضع will بعد أداة الشرط If مباشرة في الحالة الأولى',
      'practiced: ماضي بسيط خاص بالحالة الشرطية الثانية للتخيل',
      'had practiced: ماضي تام خاص بالحالة الشرطية الثالثة المستحيلة',
    ],
    difficulty: 'easy',
    skillCategory: 'grammar',
  },
  {
    id: 'ai-q-pp-1',
    type: 'multiple-choice',
    cefrLevel: 'B1',
    topic: 'present-perfect',
    prompt: 'Sarah has lived in Alexandria _______ over ten years.',
    options: ['for', 'since', 'during', 'from'],
    correctAnswerIndex: 0,
    explanationAr: 'نستخدم for مع المدة الزمنية المحسوبة والمجملة (a period of time مثل ten years)، بينما since تأتي مع نقطة بداية الزمن.',
    difficulty: 'easy',
    skillCategory: 'grammar',
  },
];

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  // CORS & Preflight handling
  if (applyCorsHeaders(req, res)) return;

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed. Use POST.' });
  }

  const clientIp = (
    (req.headers['x-forwarded-for'] as string) ||
    req.socket.remoteAddress ||
    'anonymous'
  ).split(',')[0].trim();

  if (!checkRateLimit(clientIp, 20)) {
    return sendJson(res, 429, {
      error: 'Rate limit exceeded: Too many question generation requests. Please slow down.',
    });
  }

  try {
    const body = await parseBody(req);

    // M-1 Input Sanitization & Allowlisting (Anti Prompt-Injection)
    const ALLOWED_CEFR = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
    const rawCefr = String(body.cefrLevel || '').toUpperCase();
    const cefrLevel = ALLOWED_CEFR.has(rawCefr) ? rawCefr : 'B1';

    const ALLOWED_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);
    const rawDiff = String(body.difficulty || '').toLowerCase();
    const difficulty = ALLOWED_DIFFICULTIES.has(rawDiff) ? rawDiff : 'medium';

    // Strict topic sanitization: strip script/markdown/delimiters, max 60 chars
    const rawTopic = String(body.topic || 'future-perfect').slice(0, 60);
    const topic = rawTopic.replace(/[^a-zA-Z0-9\s\-_]/g, '').trim() || 'grammar-foundations';

    const count = Math.min(10, Math.max(1, Number(body.count) || 3));

    const promptInstruction = `You are a professional Cambridge/Oxford English Exam Author.
Generate ${count} high-quality, pedagogically accurate English questions for CEFR Level ${cefrLevel} on the topic "${topic}".
Output ONLY a valid JSON array adhering to this schema:
[
  {
    "id": "gen-${Date.now()}-1",
    "type": "multiple-choice",
    "cefrLevel": "${cefrLevel}",
    "topic": "${topic}",
    "prompt": "Question text with blank...",
    "options": ["Correct option", "Distractor 1", "Distractor 2", "Distractor 3"],
    "correctAnswerIndex": 0,
    "explanationAr": "Clear Arabic explanation of the grammar rule and why this answer is correct in Egyptian educational context.",
    "distractorNotesAr": ["Why option 2 is wrong...", "Why option 3 is wrong...", "Why option 4 is wrong..."],
    "difficulty": "${difficulty}",
    "skillCategory": "grammar"
  }
]`;

    try {
      // Route through centralized Multi-Provider Router (Groq -> Gemini -> Cloudflare -> OpenAI -> Local)
      const routerResult = await dispatchThroughAiRouter({
        task: 'question_generation',
        messages: [{ role: 'user', content: `Generate ${count} questions for ${topic} at ${cefrLevel}.` }],
        systemPrompt: promptInstruction,
        responseFormat: 'json',
        temperature: 0.7,
      });

      // Zod Validation & Schema Enforcement
      const validatedQuestions = validateQuestionsJson(routerResult.text);

      if (validatedQuestions.length > 0) {
        sendJson(res, 200, {
          questions: validatedQuestions,
          source: routerResult.provider,
          model: routerResult.model,
          fallbackChain: routerResult.fallbackChain,
          isLocalFallback: routerResult.isLocalFallback,
          count: validatedQuestions.length,
        });
        return;
      }
    } catch (routerErr) {
      console.warn('[AI Question Generation] Router call failed or validation failed, using verified bank:', routerErr);
    }

    // High quality verified bank fallback
    sendJson(res, 200, {
      questions: FALLBACK_BANK.slice(0, count),
      source: 'verified-bank',
      isLocalFallback: true,
      count: Math.min(count, FALLBACK_BANK.length),
    });
  } catch (err) {
    console.error('API /api/ai/generateQuestions error:', err);
    sendJson(res, 500, { error: 'Question generation error', message: String(err) });
  }
}
