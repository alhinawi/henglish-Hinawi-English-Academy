import type { IncomingMessage, ServerResponse } from 'node:http';
import crypto from 'node:crypto';
import dns from 'node:dns';
import { applyCorsHeaders, sendJson } from '../../server/auth/serverAuth';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const ipRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 60, windowMs = 60 * 60 * 1000): boolean {
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

export type TtsProvider = 'kokoro' | 'elevenlabs' | 'google-cloud' | 'browser';
export type VoiceAccent = 'US' | 'UK';
export type VoiceGender = 'female' | 'male';

export interface TtsSynthesisRequest {
  text: string;
  accent?: VoiceAccent;
  gender?: VoiceGender;
  speed?: number;
  voiceId?: string;
}

export interface TtsSynthesisResponse {
  audioBase64?: string;
  audioUrl?: string;
  provider: TtsProvider;
  voiceId: string;
  cached: boolean;
  mimeType: string;
}

// In-Memory Audio Cache (key -> base64 audio)
const audioCache = new Map<string, { base64: string; mimeType: string }>();

function generateAudioCacheKey(text: string, accent: string, gender: string, speed: number, voiceId: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(`${text}_${accent}_${gender}_${speed}_${voiceId}`);
  return hash.digest('hex');
}

export const VOICE_PROFILES = {
  elevenlabs: {
    'US-female': 'EXAVITQu4vr4xnSDxMaL',
    'US-male': 'CwhRBWXzGAHq8TQ4Fs17',
    'UK-female': 'Xb7hH8MSUJpSbSDYk0k2',
    'UK-male': 'JBFqnCBsd6RMkjVDRZzb',
  },
  'google-cloud': {
    'US-female': 'en-US-Neural2-F',
    'US-male': 'en-US-Neural2-D',
    'UK-female': 'en-GB-Neural2-A',
    'UK-male': 'en-GB-Neural2-B',
  },
  kokoro: {
    'US-female': 'af_heart',
    'US-male': 'am_adam',
    'UK-female': 'bf_emma',
    'UK-male': 'bm_george',
  },
};

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
      if (raw.length > 64 * 1024) resolve({}); // 64KB max payload (Finding H-5)
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

  if (!checkRateLimit(clientIp, 60)) {
    return sendJson(res, 429, {
      error: 'Rate limit exceeded: Too many TTS synthesis requests. Please wait.',
    });
  }

  try {
    const body = (await parseBody(req)) as unknown as TtsSynthesisRequest;
    if (!body || !body.text) {
      return sendJson(res, 400, { error: 'Missing required text for TTS synthesis' });
    }

    if (typeof body.text === 'string' && body.text.length > 1000) {
      return sendJson(res, 400, {
        error: 'Text length exceeds maximum permitted limit for synthesis (1,000 characters).',
      });
    }

    const env = process.env;
    const speed = body.speed || 1.0;
    const accent = body.accent || 'US';
    const gender = body.gender || 'female';
    const keyType = `${accent}-${gender}` as const;

    const elevenlabsKey = env.ELEVENLABS_API_KEY || '';
    const googleTtsKey = env.GOOGLE_TTS_API_KEY || '';
    const kokoroUrl = env.KOKORO_TTS_ENDPOINT || '';

    let provider: TtsProvider = 'browser';
    let targetVoiceId = body.voiceId || '';

    if (elevenlabsKey && elevenlabsKey !== 'your_elevenlabs_api_key_here') {
      provider = 'elevenlabs';
      const elProfiles = VOICE_PROFILES.elevenlabs as Record<string, string>;
      targetVoiceId = targetVoiceId || elProfiles[keyType] || elProfiles['US-female'];
    } else if (googleTtsKey && googleTtsKey !== 'your_google_tts_api_key_here') {
      provider = 'google-cloud';
      const gcProfiles = VOICE_PROFILES['google-cloud'] as Record<string, string>;
      targetVoiceId = targetVoiceId || gcProfiles[keyType] || gcProfiles['US-female'];
    } else if (kokoroUrl) {
      provider = 'kokoro';
      const koProfiles = VOICE_PROFILES.kokoro as Record<string, string>;
      targetVoiceId = targetVoiceId || koProfiles[keyType] || koProfiles['US-female'];
    }

    // Cache check
    const cacheKey = generateAudioCacheKey(body.text, accent, gender, speed, targetVoiceId);
    const cachedItem = audioCache.get(cacheKey);
    if (cachedItem) {
      sendJson(res, 200, {
        audioBase64: cachedItem.base64,
        provider,
        voiceId: targetVoiceId,
        cached: true,
        mimeType: cachedItem.mimeType,
      });
      return;
    }

    // ElevenLabs provider
    if (provider === 'elevenlabs') {
      try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': elevenlabsKey,
          },
          body: JSON.stringify({
            text: body.text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              speed: speed,
            },
          }),
        });

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          audioCache.set(cacheKey, { base64, mimeType: 'audio/mpeg' });

          sendJson(res, 200, {
            audioBase64: base64,
            provider: 'elevenlabs',
            voiceId: targetVoiceId,
            cached: false,
            mimeType: 'audio/mpeg',
          });
          return;
        } else {
          const errText = await response.text();
          console.warn('ElevenLabs API returned error:', response.status, errText);
        }
      } catch (err) {
        console.warn('ElevenLabs request failed:', err);
      }
    }

    // Google Cloud TTS provider
    if (provider === 'google-cloud') {
      try {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleTtsKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: body.text },
            voice: {
              languageCode: accent === 'UK' ? 'en-GB' : 'en-US',
              name: targetVoiceId,
              ssmlGender: gender.toUpperCase(),
            },
            audioConfig: {
              audioEncoding: 'MP3',
              speakingRate: speed,
            },
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as { audioContent?: string };
          if (data.audioContent) {
            audioCache.set(cacheKey, { base64: data.audioContent, mimeType: 'audio/mpeg' });
            sendJson(res, 200, {
              audioBase64: data.audioContent,
              provider: 'google-cloud',
              voiceId: targetVoiceId,
              cached: false,
              mimeType: 'audio/mpeg',
            });
            return;
          }
        }
      } catch (err) {
        console.warn('Google Cloud TTS request failed:', err);
      }
    }

    // Fallback indicator
    sendJson(res, 200, {
      provider: 'browser',
      voiceId: targetVoiceId || 'browser-native',
      cached: false,
      mimeType: 'audio/native-speech',
    });
  } catch (err) {
    console.error('API /api/tts/synthesize error:', err);
    sendJson(res, 500, { error: 'TTS synthesis error', message: String(err) });
  }
}
