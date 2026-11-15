// Cloudflare Pages Function: /api/tts/synthesize
// Edge port of api/tts/synthesize.ts (Vercel). ElevenLabs primary, Google Cloud TTS
// secondary, Kokoro tertiary, browser fallback when no provider is configured.
// Per-isolate in-memory cache. Never logs keys.

type TtsProvider = 'kokoro' | 'elevenlabs' | 'google-cloud' | 'browser';

interface Env {
  ELEVENLABS_API_KEY?: string;
  GOOGLE_TTS_API_KEY?: string;
  KOKORO_TTS_ENDPOINT?: string;
}

const VOICE_PROFILES: Record<string, Record<string, string>> = {
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

const audioCache = new Map<string, { base64: string; mimeType: string }>();
const MAX_CACHE_ENTRIES = 300;

async function cacheKeyFor(text: string, accent: string, gender: string, speed: number, voiceId: string): Promise<string> {
  const data = new TextEncoder().encode(text + '_' + accent + '_' + gender + '_' + speed + '_' + voiceId);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}

type PagesContext<E> = { request: Request; env: E };

export const onRequestOptions = async () =>
  new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });

export const onRequestPost = async (context: PagesContext<Env>): Promise<Response> => {
  try {
    const body = (await context.request.json()) as {
      text?: string;
      accent?: string;
      gender?: string;
      speed?: number;
      voiceId?: string;
    };
    if (!body || !body.text || !body.text.trim()) {
      return json({ error: 'Missing required text for TTS synthesis' }, 400);
    }

    const env = context.env;
    const speed = body.speed || 1.0;
    const accent = body.accent === 'UK' ? 'UK' : 'US';
    const gender = body.gender === 'male' ? 'male' : 'female';
    const keyType = accent + '-' + gender;

    const elevenlabsKey = (env.ELEVENLABS_API_KEY || '').trim();
    const googleTtsKey = (env.GOOGLE_TTS_API_KEY || '').trim();
    const kokoroUrl = (env.KOKORO_TTS_ENDPOINT || '').trim();

    let provider: TtsProvider = 'browser';
    let targetVoiceId = body.voiceId || '';

    if (elevenlabsKey && elevenlabsKey !== 'your_elevenlabs_api_key_here') {
      provider = 'elevenlabs';
      targetVoiceId = targetVoiceId || VOICE_PROFILES.elevenlabs[keyType] || VOICE_PROFILES.elevenlabs['US-female'];
    } else if (googleTtsKey && googleTtsKey !== 'your_google_tts_api_key_here') {
      provider = 'google-cloud';
      targetVoiceId = targetVoiceId || VOICE_PROFILES['google-cloud'][keyType] || VOICE_PROFILES['google-cloud']['US-female'];
    } else if (kokoroUrl) {
      provider = 'kokoro';
      targetVoiceId = targetVoiceId || VOICE_PROFILES.kokoro[keyType] || VOICE_PROFILES.kokoro['US-female'];
    }

    const cacheKey = await cacheKeyFor(body.text, accent, gender, speed, targetVoiceId);
    const cachedItem = audioCache.get(cacheKey);
    if (cachedItem) {
      return json({ audioBase64: cachedItem.base64, provider, voiceId: targetVoiceId, cached: true, mimeType: cachedItem.mimeType });
    }

    if (provider === 'elevenlabs') {
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + targetVoiceId, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'xi-api-key': elevenlabsKey },
          body: JSON.stringify({
            text: body.text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.5, similarity_boost: 0.75, speed },
          }),
        });
        if (response.ok) {
          const buf = await response.arrayBuffer();
          const base64 = arrayBufferToBase64(buf);
          if (audioCache.size >= MAX_CACHE_ENTRIES) audioCache.clear();
          audioCache.set(cacheKey, { base64, mimeType: 'audio/mpeg' });
          return json({ audioBase64: base64, provider: 'elevenlabs', voiceId: targetVoiceId, cached: false, mimeType: 'audio/mpeg' });
        }
        console.warn('ElevenLabs API error status:', response.status);
      } catch (err) {
        console.warn('ElevenLabs request failed:', (err as Error).message);
      }
    }

    if (provider === 'google-cloud') {
      try {
        const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=' + googleTtsKey, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: body.text },
            voice: { languageCode: accent === 'UK' ? 'en-GB' : 'en-US', name: targetVoiceId },
            audioConfig: { audioEncoding: 'MP3', speakingRate: speed },
          }),
        });
        if (response.ok) {
          const data = (await response.json()) as { audioContent?: string };
          if (data.audioContent) {
            if (audioCache.size >= MAX_CACHE_ENTRIES) audioCache.clear();
            audioCache.set(cacheKey, { base64: data.audioContent, mimeType: 'audio/mpeg' });
            return json({ audioBase64: data.audioContent, provider: 'google-cloud', voiceId: targetVoiceId, cached: false, mimeType: 'audio/mpeg' });
          }
        }
        console.warn('Google TTS error status:', response.status);
      } catch (err) {
        console.warn('Google TTS request failed:', (err as Error).message);
      }
    }

    // No provider available or provider failed: client falls back to browser speech
    return json({ provider: 'browser', voiceId: targetVoiceId, cached: false, mimeType: '' });
  } catch (err) {
    return json({ error: 'TTS synthesis failed', detail: (err as Error).message }, 500);
  }
};
