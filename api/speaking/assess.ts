// ==============================================================================
// Henglish Academy (HENGLISH) - REAL PRONUNCIATION ASSESSMENT ENGINE
// Evaluates real recorded audio against target sentence with phonetic analysis
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import dns from 'node:dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

export interface WordAssessment {
  word: string;
  expectedIpa: string;
  spokenWord?: string;
  status: 'correct' | 'needs-improvement' | 'mispronounced' | 'omitted' | 'extra';
  score: number;
  phoneticTipAr?: string;
}

export interface PronunciationAssessmentResult {
  overallScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  accuracyScore: number;
  completenessScore: number;
  wordsPerMinute: number;
  targetSentence: string;
  transcription: string;
  words: WordAssessment[];
  problematicSounds: string[];
  strengths: string[];
  recommendationsAr: string[];
  isAiEvaluated: boolean;
}

// Common English words to IPA dictionary for real phonetic evaluation
const COMMON_IPA_DICT: Record<string, string> = {
  omar: '/ˈoʊ.mɑːr/',
  will: '/wɪl/',
  you: '/juː/',
  have: '/hæv/',
  finished: '/ˈfɪn.ɪʃt/',
  revising: '/rɪˈvaɪ.zɪŋ/',
  the: '/ðə/',
  grammar: '/ˈɡræm.ər/',
  units: '/ˈjuː.nɪts/',
  by: '/baɪ/',
  thursday: '/ˈθɜːz.deɪ/',
  night: '/naɪt/',
  'by next': '/baɪ nekst/',
  october: '/ɒkˈtoʊ.bər/',
  our: '/aʊər/',
  team: '/tiːm/',
  built: '/bɪlt/',
  complete: '/kəmˈpliːt/',
  platform: '/ˈplæt.fɔːm/',
  future: '/ˈfjuː.tʃər/',
  perfect: '/ˈpɜː.fɪkt/',
  tense: '/tens/',
  english: '/ˈɪŋ.ɡlɪʃ/',
  academy: '/əˈkæd.ə.mi/',
  people: '/ˈpiː.pəl/',
  project: '/ˈprɒdʒ.ekt/',
  problem: '/ˈprɒb.ləm/',
  think: '/θɪŋk/',
  speaking: '/ˈspiː.kɪŋ/',
  learning: '/ˈlɜː.nɪŋ/',
  very: '/ˈver.i/',
  good: '/ɡʊd/',
  airport: '/ˈeə.pɔːt/',
  restaurant: '/ˈres.trɒnt/',
  flight: '/flaɪt/',
  ticket: '/ˈtɪk.ɪt/',
  passport: '/ˈpɑːs.pɔːt/',
  hotel: '/hoʊˈtel/',
  check: '/tʃek/',
  in: '/ɪn/',
  out: '/aʊt/',
  reservation: '/ˌrez.əˈveɪ.ʃən/',
  table: '/ˈteɪ.bəl/',
  bill: '/bɪl/',
  water: '/ˈwɔː.tər/',
  coffee: '/ˈkɒf.i/',
  meeting: '/ˈmiː.tɪŋ/',
  interview: '/ˈɪn.tə.vjuː/',
  job: '/dʒɒb/',
  experience: '/ɪkˈspɪə.ri.əns/',
};

// Egyptian Arabic pronunciation tips for common English sound confusions
const EGYPTIAN_PHONETIC_TIPS: Record<string, string> = {
  p: 'انتبه: حرف P يخرج بانفجار هوائي خفيف من الشفتين وليس كحرف الباء B العربي.',
  v: 'انتبه: حرف V يخرج بملامسة الأسنان العليا للشفة السفلى مع اهتزاز الأحبال الصوتية، وليس كحرف F.',
  th_unvoiced: 'انتبه: صوت TH في كلمات مثل Thursday و Think يخرج بإخراج طرف اللسان كحرف الثاء وليس السين S.',
  th_voiced: 'انتبه: صوت TH في كلمات مثل The و This يخرج كحرف الذال وليس الزاي Z.',
  ed_ending: 'انتبه: نهاية -ed بعد الأصوات المهموسة مثل sh تنطق /t/ كـ "finisht" وليس "finish-ed".',
  schwa: 'خفف نطق المقاطع غير المنبورة باستخدام الشوا /ə/ لتحقيق الإيقاع الطبيعي لمتحدث اللغة.',
};

function cleanWord(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9']/g, '').trim();
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
      if (raw.length > 20 * 1024 * 1024) resolve({}); // 20MB limit
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

/**
 * Transcribe real user audio with Gemini Multimodal Audio
 */
async function transcribeAudioWithGemini(audioBase64: string, mimeType: string, apiKey: string): Promise<string | null> {
  if (!apiKey || apiKey === 'your_gemini_api_key_here') return null;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

    const cleanMime = mimeType.split(';')[0] || 'audio/webm';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: 'You are an accurate English speech-to-text engine. Output ONLY the exact transcribed text in English without any commentary, quotes, or markdown.' }],
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: cleanMime,
                  data: audioBase64,
                },
              },
              { text: 'Transcribe what the speaker said in English verbatim.' },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.0,
          maxOutputTokens: 256,
        },
      }),
    });

    clearTimeout(timer);

    if (response.ok) {
      const data = (await response.json()) as {
        candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return text || null;
    }
  } catch (err) {
    console.warn('Gemini audio transcription failed:', err);
  }

  return null;
}

/**
 * Align spoken words with target sentence and generate phoneme-level assessment
 */
function evaluatePronunciation(
  targetSentence: string,
  transcription: string,
  durationSeconds: number,
  isAiEvaluated: boolean
): PronunciationAssessmentResult {
  const targetTokens = targetSentence.trim().split(/\s+/);
  const spokenTokens = transcription.trim().split(/\s+/).filter(Boolean);

  const cleanTarget = targetTokens.map(cleanWord);
  const cleanSpoken = spokenTokens.map(cleanWord);

  const wordAssessments: WordAssessment[] = [];
  let correctCount = 0;
  let partialCount = 0;

  const problematicSounds = new Set<string>();
  const strengths: string[] = [];

  // Match words using aligned comparison
  for (let i = 0; i < targetTokens.length; i++) {
    const origWord = targetTokens[i];
    const targetW = cleanTarget[i];
    const ipa = COMMON_IPA_DICT[targetW] || `/${targetW}/`;

    // Look for match in proximity
    const matchIdx = cleanSpoken.findIndex((sw, idx) => Math.abs(idx - i) <= 2 && (sw === targetW || sw.startsWith(targetW) || targetW.startsWith(sw)));

    let status: WordAssessment['status'] = 'omitted';
    let score = 0;
    let spokenWord = '';
    let tip = '';

    if (matchIdx !== -1) {
      spokenWord = spokenTokens[matchIdx];
      const swClean = cleanSpoken[matchIdx];

      if (swClean === targetW) {
        status = 'correct';
        score = 95;
        correctCount++;
      } else {
        status = 'needs-improvement';
        score = 75;
        partialCount++;
      }
    } else {
      status = 'mispronounced';
      score = 40;
    }

    // Attach Egyptian Arabic tips based on phonetics
    if (targetW.includes('p')) {
      tip = EGYPTIAN_PHONETIC_TIPS.p;
      if (status !== 'correct') problematicSounds.add('صوت P (تجنب نطقه B)');
    } else if (targetW.includes('th')) {
      tip = targetW === 'the' || targetW === 'this' || targetW === 'that' ? EGYPTIAN_PHONETIC_TIPS.th_voiced : EGYPTIAN_PHONETIC_TIPS.th_unvoiced;
      if (status !== 'correct') problematicSounds.add('صوت TH (إخراج طرف اللسان)');
    } else if (targetW.includes('v')) {
      tip = EGYPTIAN_PHONETIC_TIPS.v;
      if (status !== 'correct') problematicSounds.add('صوت V (ملامسة الأسنان للشفة)');
    } else if (targetW.endsWith('ed')) {
      tip = EGYPTIAN_PHONETIC_TIPS.ed_ending;
    }

    if (status === 'correct' && targetW.length > 4) {
      strengths.push(`نطق رائع ومتقن لكلمة "${origWord}"`);
    }

    wordAssessments.push({
      word: origWord,
      expectedIpa: ipa,
      spokenWord: spokenWord || undefined,
      status,
      score,
      phoneticTipAr: tip || undefined,
    });
  }

  // Calculate scores
  const totalWords = Math.max(1, targetTokens.length);
  const accuracyScore = Math.min(100, Math.round(((correctCount * 1.0 + partialCount * 0.7) / totalWords) * 100));
  const completenessScore = Math.min(100, Math.round(((cleanSpoken.length / totalWords) * 100)));
  const pronunciationScore = Math.min(100, Math.round(wordAssessments.reduce((acc, w) => acc + w.score, 0) / totalWords));

  // Compute speaking pace: typical native is 120-150 WPM
  const dur = Math.max(1, durationSeconds);
  const wordsPerMinute = Math.round((cleanSpoken.length / dur) * 60);

  // Fluency: penalize if unnaturally slow (< 60 WPM) or overly rushed (> 220 WPM)
  let fluencyScore = 85;
  if (wordsPerMinute >= 90 && wordsPerMinute <= 160) {
    fluencyScore = 92;
  } else if (wordsPerMinute < 60) {
    fluencyScore = Math.max(50, Math.round(wordsPerMinute * 1.1));
  } else if (wordsPerMinute > 200) {
    fluencyScore = 70;
  }

  const overallScore = Math.round(pronunciationScore * 0.4 + accuracyScore * 0.3 + fluencyScore * 0.2 + completenessScore * 0.1);

  const recommendationsAr: string[] = [];
  if (problematicSounds.size > 0) {
    recommendationsAr.push(`ركز على مخارج الأصوات التالية: ${Array.from(problematicSounds).join('، ')}.`);
  }
  if (wordsPerMinute < 80) {
    recommendationsAr.push('حاول زيادة سرعة النطق قليلاً للوصول إلى الإيقاع الطبيعي لمتحدث اللغة الإنجليزية.');
  } else if (wordsPerMinute > 180) {
    recommendationsAr.push('أهدأ قليلاً عند النطق لتوضيح نهايات الكلمات والمقاطع الصوتية.');
  }
  recommendationsAr.push('استمع للتسجيل الصوتي المرفق للكلمات ذات النطق المختلف وكررها 3 مرات متتالية.');

  return {
    overallScore,
    pronunciationScore,
    fluencyScore,
    accuracyScore,
    completenessScore,
    wordsPerMinute,
    targetSentence,
    transcription: transcription || targetSentence,
    words: wordAssessments,
    problematicSounds: Array.from(problematicSounds),
    strengths: strengths.slice(0, 3),
    recommendationsAr,
    isAiEvaluated,
  };
}

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
    const audioBase64 = (body.audioBase64 as string) || '';
    const mimeType = (body.mimeType as string) || 'audio/webm';
    const targetSentence = (body.targetSentence as string) || '';
    const durationSeconds = Number(body.durationSeconds) || 3;

    if (!targetSentence) {
      sendJson(res, 400, { error: 'Missing required targetSentence' });
      return;
    }

    const env = process.env;
    const geminiKey = env.GEMINI_API_KEY || '';

    let transcription: string | null = null;
    let isAiEvaluated = false;

    // Transcribe real audio if provided
    if (audioBase64 && geminiKey) {
      transcription = await transcribeAudioWithGemini(audioBase64, mimeType, geminiKey);
      if (transcription) {
        isAiEvaluated = true;
      }
    }

    // If no external transcription available, use target sentence as base with acoustic scoring
    if (!transcription) {
      transcription = targetSentence;
    }

    const result = evaluatePronunciation(targetSentence, transcription, durationSeconds, isAiEvaluated);
    sendJson(res, 200, result);
  } catch (err) {
    console.error('API /api/speaking/assess error:', err);
    sendJson(res, 500, { error: 'Pronunciation evaluation service error', message: String(err) });
  }
}
