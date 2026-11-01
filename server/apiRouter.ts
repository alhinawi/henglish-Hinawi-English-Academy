// ==============================================================================
// Henglish Academy (HENGLISH) - SERVER API ROUTER & MIDDLEWARE
// Integrates with Vite dev server and Node / Serverless runtimes
// ==============================================================================

import type { IncomingMessage, ServerResponse } from 'node:http';
import { dispatchAiChat, streamAiChat, checkRateLimit, getAiConfig, ChatRequestBody } from './aiService';
import { synthesizeSpeech, TtsSynthesisRequest } from './ttsService';
import {
  dispatchTranslation,
  dispatchTranslationAssistant,
  dispatchPracticeEvaluation,
  dispatchImageOcr,
  dispatchVoiceTranscription,
} from './translationService';
import type { TranslationRequest } from '../src/types/translation';

function parseJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 15 * 1024 * 1024) { // 15MB limit for images & audio
        reject(new Error('Request payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
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

export async function handleApiRoute(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const url = req.url || '';

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return true;
  }

  // Health check
  if (url === '/api/health') {
    const config = getAiConfig();
    sendJson(res, 200, {
      status: 'ok',
      service: 'Henglish AI & TTS Engine',
      provider: config.provider,
      model: config.model,
      timestamp: new Date().toISOString(),
    });
    return true;
  }

  // AI Chat endpoint (Non-streaming)
  if (url === '/api/ai/chat' && req.method === 'POST') {
    const clientIp = req.socket.remoteAddress || 'client';
    if (!checkRateLimit(clientIp)) {
      sendJson(res, 429, { error: 'Too many requests. Please slow down.' });
      return true;
    }

    try {
      const body = (await parseJsonBody(req)) as ChatRequestBody;
      if (!body.message || !body.mode) {
        sendJson(res, 400, { error: 'Missing required fields: message, mode' });
        return true;
      }

      const result = await dispatchAiChat(body);
      sendJson(res, 200, result);
    } catch (err) {
      console.error('API /api/ai/chat error:', err);
      sendJson(res, 500, { error: 'Internal AI service error', message: String(err) });
    }
    return true;
  }

  // AI Stream endpoint (Server-Sent Events)
  if (url === '/api/ai/stream' && req.method === 'POST') {
    const clientIp = req.socket.remoteAddress || 'client';
    if (!checkRateLimit(clientIp)) {
      sendJson(res, 429, { error: 'Too many requests. Please slow down.' });
      return true;
    }

    try {
      const body = (await parseJsonBody(req)) as ChatRequestBody;
      if (!body.message || !body.mode) {
        sendJson(res, 400, { error: 'Missing required fields: message, mode' });
        return true;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');

      const result = await streamAiChat(body, chunk => {
        res.write(`event: token\ndata: ${JSON.stringify({ text: chunk })}\n\n`);
      });

      res.write(`event: done\ndata: ${JSON.stringify(result)}\n\n`);
      res.end();
    } catch (err) {
      console.error('API /api/ai/stream error:', err);
      res.write(`event: error\ndata: ${JSON.stringify({ error: String(err) })}\n\n`);
      res.end();
    }
    return true;
  }

  // TTS Synthesis endpoint
  if (url === '/api/tts/synthesize' && req.method === 'POST') {
    try {
      const body = (await parseJsonBody(req)) as TtsSynthesisRequest;
      if (!body.text) {
        sendJson(res, 400, { error: 'Missing required text for TTS synthesis' });
        return true;
      }

      const result = await synthesizeSpeech(body);
      sendJson(res, 200, result);
    } catch (err) {
      console.error('API /api/tts/synthesize error:', err);
      sendJson(res, 500, { error: 'TTS synthesis error', message: String(err) });
    }
    return true;
  }

  // Dynamic AI Question Generation endpoint
  if (url === '/api/ai/generateQuestions') {
    try {
      const qHandler = (await import('../api/ai/generateQuestions')).default;
      await qHandler(req, res);
      return true;
    } catch (err) {
      console.error('API /api/ai/generateQuestions error:', err);
      sendJson(res, 500, { error: 'Question generation service error', message: String(err) });
      return true;
    }
  }

  // Speaking Pronunciation Assessment endpoint
  if (url === '/api/speaking/assess') {
    try {
      const assessHandler = (await import('../api/speaking/assess')).default;
      await assessHandler(req, res);
      return true;
    } catch (err) {
      console.error('API /api/speaking/assess error:', err);
      sendJson(res, 500, { error: 'Pronunciation evaluation service error', message: String(err) });
      return true;
    }
  }

  // AI Translation endpoint
  if (url === '/api/ai/translate' && req.method === 'POST') {
    const clientIp = req.socket.remoteAddress || 'client';
    if (!checkRateLimit(clientIp)) {
      sendJson(res, 429, { error: 'Too many requests. Please slow down.' });
      return true;
    }

    try {
      const body = (await parseJsonBody(req)) as TranslationRequest;
      if (!body.text) {
        sendJson(res, 400, { error: 'Missing required translation text' });
        return true;
      }

      const result = await dispatchTranslation(body);
      sendJson(res, 200, result);
    } catch (err) {
      console.error('API /api/ai/translate error:', err);
      sendJson(res, 500, { error: 'Translation engine failure', message: String(err) });
    }
    return true;
  }

  // AI Translation Assistant Chat endpoint
  if (url === '/api/ai/assistant' && req.method === 'POST') {
    try {
      const body = (await parseJsonBody(req)) as {
        question: string;
        context: {
          originalText: string;
          translatedText: string;
          sourceLang: string;
          targetLang: string;
          mode: string;
        };
      };

      if (!body.question) {
        sendJson(res, 400, { error: 'Missing assistant question' });
        return true;
      }

      const result = await dispatchTranslationAssistant(body.question, body.context);
      sendJson(res, 200, result);
    } catch (err) {
      console.error('API /api/ai/assistant error:', err);
      sendJson(res, 500, { error: 'Assistant service error', message: String(err) });
    }
    return true;
  }

  // Educational Practice Mode Translation Evaluation
  if (url === '/api/ai/evaluate-practice' && req.method === 'POST') {
    try {
      const body = (await parseJsonBody(req)) as {
        direction: 'ar-to-en' | 'en-to-ar';
        difficulty: import('../src/types').CEFRLevel;
        sourceSentence: string;
        userTranslation: string;
        expectedTranslations: string[];
      };

      if (!body.sourceSentence || !body.userTranslation) {
        sendJson(res, 400, { error: 'Missing required evaluation fields' });
        return true;
      }

      const result = await dispatchPracticeEvaluation(body);
      sendJson(res, 200, result);
    } catch (err) {
      console.error('API /api/ai/evaluate-practice error:', err);
      sendJson(res, 500, { error: 'Practice evaluation error', message: String(err) });
    }
    return true;
  }

  // Camera & Image OCR Translation endpoint
  if (url === '/api/ai/ocr-translate' && req.method === 'POST') {
    try {
      const body = (await parseJsonBody(req)) as {
        imageBase64: string;
        mimeType: string;
        targetLang?: import('../src/types/translation').LanguageCode;
      };

      if (!body.imageBase64) {
        sendJson(res, 400, { error: 'Missing imageBase64 payload' });
        return true;
      }

      const result = await dispatchImageOcr(body.imageBase64, body.mimeType, body.targetLang || 'ar');
      sendJson(res, 200, result);
    } catch (err) {
      console.error('API /api/ai/ocr-translate error:', err);
      sendJson(res, 500, { error: 'OCR processing error', message: String(err) });
    }
    return true;
  }

  // Voice Speech Transcription endpoint
  if (url === '/api/ai/voice-transcribe' && req.method === 'POST') {
    try {
      const body = (await parseJsonBody(req)) as {
        audioBase64: string;
        mimeType: string;
      };

      if (!body.audioBase64) {
        sendJson(res, 400, { error: 'Missing audioBase64 payload' });
        return true;
      }

      const result = await dispatchVoiceTranscription(body.audioBase64, body.mimeType);
      sendJson(res, 200, result);
    } catch (err) {
      console.error('API /api/ai/voice-transcribe error:', err);
      sendJson(res, 500, { error: 'Audio transcription error', message: String(err) });
    }
    return true;
  }

  return false;
}

