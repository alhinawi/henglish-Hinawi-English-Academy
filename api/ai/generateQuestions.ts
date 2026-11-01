// ==============================================================================
// Henglish Academy (HENGLISH) - DYNAMIC AI QUESTION GENERATION ENGINE
// Provider-independent question generation with validation & distractor analysis
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import dns from 'node:dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

export interface GeneratedQuestion {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'error-correction' | 'sentence-ordering' | 'translation';
  cefrLevel: string;
  topic: string;
  prompt: string;
  promptAr?: string;
  options: string[];
  correctAnswerIndex: number;
  explanationAr: string;
  distractorNotesAr?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

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

function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

// High-quality static fallback question bank when AI keys are unconfigured
const FALLBACK_BANK: GeneratedQuestion[] = [
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
  },
];

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = await parseBody(req);
    const cefrLevel = (body.cefrLevel as string) || 'B1';
    const topic = (body.topic as string) || 'future-perfect';
    const count = Math.min(10, Math.max(1, Number(body.count) || 3));

    const geminiKey = process.env.GEMINI_API_KEY || '';

    if (geminiKey && geminiKey !== 'your_ai_api_key_here') {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 20000);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`;

        const promptInstruction = `You are a professional Cambridge/Oxford English Exam Author.
Generate ${count} high-quality, pedagogically accurate English questions for CEFR Level ${cefrLevel} on the topic "${topic}".
Output ONLY valid JSON array adhering to this schema:
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
    "difficulty": "medium"
  }
]`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: promptInstruction }] },
            contents: [{ role: 'user', parts: [{ text: 'Generate questions now.' }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          }),
        });

        clearTimeout(timer);

        if (response.ok) {
          const data = await response.json();
          const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const parsedQuestions = JSON.parse(candidateText) as GeneratedQuestion[];
            if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
              sendJson(res, 200, {
                questions: parsedQuestions,
                source: 'ai-gemini',
                count: parsedQuestions.length,
              });
              return;
            }
          }
        }
      } catch (aiErr) {
        console.warn('AI question generation call failed, using verified bank:', aiErr);
      }
    }

    // High quality fallback
    sendJson(res, 200, {
      questions: FALLBACK_BANK.slice(0, count),
      source: 'verified-bank',
      count: Math.min(count, FALLBACK_BANK.length),
    });
  } catch (err) {
    console.error('API /api/ai/generateQuestions error:', err);
    sendJson(res, 500, { error: 'Question generation error', message: String(err) });
  }
}
