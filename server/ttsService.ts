// ==============================================================================
// Henglish Academy (HENGLISH) - MULTI-TIER CLOUD TTS SERVICE
// Tier 1: ElevenLabs (Primary / Original Default)
// Tier 2: Deepgram Aura-2 / Flux (1st Cloud Fallback)
// Tier 3: Cartesia Sonic-3.6 (2nd Cloud Fallback with Commercial License Check)
// Tier 4: Browser SpeechSynthesis (Final Client-Side Fallback)
// ==============================================================================

import crypto from 'node:crypto';
import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';

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

loadEnvFile();

export type TtsProvider = 'elevenlabs' | 'deepgram' | 'cartesia' | 'browser';
export type VoiceAccent = 'US' | 'UK';
export type VoiceGender = 'female' | 'male';

export interface TtsSynthesisRequest {
  text: string;
  accent: VoiceAccent;
  gender: VoiceGender;
  speed?: number;
  voiceId?: string;
  providerOverride?: TtsProvider;
}

export interface TtsSynthesisResponse {
  audioBase64?: string;
  audioUrl?: string;
  provider: TtsProvider;
  voiceId: string;
  cached: boolean;
  mimeType: string;
  fallbackChain?: Array<{ provider: TtsProvider; status: 'attempted' | 'failed' | 'success'; reason?: string }>;
  latencyMs?: number;
}

export interface ProviderHealth {
  id: TtsProvider;
  name: string;
  role: 'primary' | 'fallback_1' | 'fallback_2' | 'final_fallback';
  status: 'healthy' | 'degraded' | 'disabled' | 'unconfigured';
  hasApiKey: boolean;
  totalRequests: number;
  successCount: number;
  failureCount: number;
  consecutiveFailures: number;
  lastFailureAt?: string;
  lastSuccessAt?: string;
  averageLatencyMs: number;
  commercialLicenseStatus: 'licensed' | 'evaluation_only' | 'unrestricted';
  notes: string;
}

// ------------------------------------------------------------------------------
// Official Voice Profiles across Providers (Preserving Exact US/UK Accents)
// ------------------------------------------------------------------------------
export const VOICE_PROFILES = {
  elevenlabs: {
    'US-female': 'EXAVITQu4vr4xnSDxMaL', // Sarah (Original default, mature, reassuring)
    'US-male': 'CwhRBWXzGAHq8TQ4Fs17',   // Roger (Laid-Back, Casual, Resonant)
    'UK-female': 'Xb7hH8MSUJpSbSDYk0k2', // Alice (Clear, Engaging Educator)
    'UK-male': 'JBFqnCBsd6RMkjVDRZzb',   // George (Warm, Captivating Storyteller)
  },
  deepgram: {
    'US-female': 'aura-2-asteria-en',    // Asteria (Clear, natural American female)
    'US-male': 'aura-2-orion-en',        // Orion (Warm, professional American male)
    'UK-female': 'aura-2-pandora-en',    // Pandora (British feminine, smooth, articulate)
    'UK-male': 'aura-2-draco-en',        // Draco (British masculine, crisp, engaging)
  },
  cartesia: {
    // Sonic-3.6 official default UUIDs from Cartesia Library
    'US-female': 'db6b0ed5-d5d3-463d-ae85-518a07d3c2b4', // Skylar (Natural, conversational US female)
    'US-male': '47c38ca4-5f35-497b-b1a3-415245fb35e1',   // Daniel (Warm, articulate US male)
    'UK-female': '62ae83ad-4f6a-430b-af41-a9bede9286ca', // Gemma (Decisive, clear British female)
    'UK-male': '71a7ad14-091c-4e8e-a314-022ece01c121',   // Archie/Reading (Composed British male)
  },
};

// ------------------------------------------------------------------------------
// In-Memory Audio Cache & Provider Telemetry
// ------------------------------------------------------------------------------
const audioCache = new Map<string, { base64: string; mimeType: string; provider: TtsProvider; createdAt: number }>();
const inflightRequests = new Map<string, Promise<TtsSynthesisResponse>>();

export const providerStats: Record<TtsProvider, ProviderHealth> = {
  elevenlabs: {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    role: 'primary',
    status: 'unconfigured',
    hasApiKey: false,
    totalRequests: 0,
    successCount: 0,
    failureCount: 0,
    consecutiveFailures: 0,
    averageLatencyMs: 0,
    commercialLicenseStatus: 'licensed',
    notes: 'المزود الرئيسي الأصلي والافتراضي لقراءة نصوص المنصة',
  },
  deepgram: {
    id: 'deepgram',
    name: 'Deepgram Aura-2',
    role: 'fallback_1',
    status: 'unconfigured',
    hasApiKey: false,
    totalRequests: 0,
    successCount: 0,
    failureCount: 0,
    consecutiveFailures: 0,
    averageLatencyMs: 0,
    commercialLicenseStatus: 'licensed',
    notes: 'بديل سحابي أول فائق السرعة بزمن استجابة فوري',
  },
  cartesia: {
    id: 'cartesia',
    name: 'Cartesia Sonic',
    role: 'fallback_2',
    status: 'unconfigured',
    hasApiKey: false,
    totalRequests: 0,
    successCount: 0,
    failureCount: 0,
    consecutiveFailures: 0,
    averageLatencyMs: 0,
    commercialLicenseStatus: 'evaluation_only', // Commercial license required for prod
    notes: 'بديل سحابي ثانٍ (Sonic-3.6) يتطلب تفعيل الترخيص التجاري للإنتاج',
  },
  browser: {
    id: 'browser',
    name: 'Browser SpeechSynthesis',
    role: 'final_fallback',
    status: 'healthy',
    hasApiKey: true,
    totalRequests: 0,
    successCount: 0,
    failureCount: 0,
    consecutiveFailures: 0,
    averageLatencyMs: 0,
    commercialLicenseStatus: 'unrestricted',
    notes: 'المحرك المحلي النهائي في المتصفح في حال انقطاع السحابة',
  },
};

// Cooldown tracking for circuit breaker
const providerCooldowns: Record<TtsProvider, number> = {
  elevenlabs: 0,
  deepgram: 0,
  cartesia: 0,
  browser: 0,
};

const COOLDOWN_DURATION_MS = 60_000; // 1 minute cooldown after 3 consecutive failures
const MAX_CONSECUTIVE_FAILURES = 3;

function updateProviderStatus() {
  loadEnvFile();
  const env = process.env;

  const elevenKey = env.ELEVENLABS_API_KEY || '';
  providerStats.elevenlabs.hasApiKey = Boolean(elevenKey && elevenKey.trim() !== 'your_elevenlabs_api_key_here');
  if (providerStats.elevenlabs.hasApiKey) {
    if (Date.now() < providerCooldowns.elevenlabs) {
      providerStats.elevenlabs.status = 'degraded';
    } else {
      providerStats.elevenlabs.status = 'healthy';
    }
  } else {
    providerStats.elevenlabs.status = 'unconfigured';
  }

  const deepgramKey = env.DEEPGRAM_API_KEY || '';
  providerStats.deepgram.hasApiKey = Boolean(deepgramKey && deepgramKey.trim() !== 'your_deepgram_api_key_here');
  if (providerStats.deepgram.hasApiKey) {
    if (Date.now() < providerCooldowns.deepgram) {
      providerStats.deepgram.status = 'degraded';
    } else {
      providerStats.deepgram.status = 'healthy';
    }
  } else {
    providerStats.deepgram.status = 'unconfigured';
  }

  const cartesiaKey = env.CARTESIA_API_KEY || '';
  providerStats.cartesia.hasApiKey = Boolean(cartesiaKey && cartesiaKey.trim() !== 'your_cartesia_api_key_here');
  const cartesiaCommercialLicense = env.CARTESIA_COMMERCIAL_LICENSE === 'true' || env.CARTESIA_COMMERCIAL_LICENSE === '1';
  providerStats.cartesia.commercialLicenseStatus = cartesiaCommercialLicense ? 'licensed' : 'evaluation_only';

  if (providerStats.cartesia.hasApiKey) {
    if (process.env.NODE_ENV === 'production' && !cartesiaCommercialLicense) {
      providerStats.cartesia.status = 'disabled';
      providerStats.cartesia.notes = 'معطل في الإنتاج نظراً لأن ترخيص Cartesia المجاني مخصص للتجربة فقط.';
    } else if (Date.now() < providerCooldowns.cartesia) {
      providerStats.cartesia.status = 'degraded';
    } else {
      providerStats.cartesia.status = 'healthy';
    }
  } else {
    providerStats.cartesia.status = 'unconfigured';
  }
}

export function generateTtsCacheKey(
  text: string,
  provider: TtsProvider,
  model: string,
  voiceId: string,
  accent: VoiceAccent,
  speed: number,
  format: string = 'mp3'
): string {
  const normalizedText = text.trim().toLowerCase().replace(/\s+/g, ' ');
  const hash = crypto.createHash('sha256');
  hash.update(`${normalizedText}_${provider}_${model}_${voiceId}_${accent}_${speed}_${format}`);
  return hash.digest('hex');
}

// ------------------------------------------------------------------------------
// Individual Provider Synthesizers
// ------------------------------------------------------------------------------

async function synthesizeWithElevenLabs(
  text: string,
  voiceId: string,
  speed: number,
  apiKey: string
): Promise<{ base64: string; mimeType: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          speed,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`ElevenLabs HTTP ${response.status}: ${errText || response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return { base64, mimeType: 'audio/mpeg' };
  } finally {
    clearTimeout(timeout);
  }
}

async function synthesizeWithDeepgram(
  text: string,
  modelOrVoice: string,
  apiKey: string
): Promise<{ base64: string; mimeType: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const url = new URL('https://api.deepgram.com/v1/speak');
    url.searchParams.set('model', modelOrVoice);
    url.searchParams.set('encoding', 'mp3');

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'audio/mp3',
      },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Deepgram HTTP ${response.status}: ${errText || response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return { base64, mimeType: 'audio/mpeg' };
  } finally {
    clearTimeout(timeout);
  }
}

async function synthesizeWithCartesia(
  text: string,
  voiceId: string,
  modelId: string,
  apiKey: string
): Promise<{ base64: string; mimeType: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch('https://api.cartesia.ai/tts/bytes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Cartesia-Version': '2026-08-14',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: modelId || 'sonic-3.6',
        transcript: text,
        voice: voiceId,
        output_format: {
          container: 'mp3',
          sample_rate: 44100,
          bit_rate: 128000,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Cartesia HTTP ${response.status}: ${errText || response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return { base64, mimeType: 'audio/mpeg' };
  } finally {
    clearTimeout(timeout);
  }
}

// ------------------------------------------------------------------------------
// Multi-Tier Fallback Dispatcher
// ------------------------------------------------------------------------------

export async function synthesizeSpeech(req: TtsSynthesisRequest): Promise<TtsSynthesisResponse> {
  loadEnvFile();
  updateProviderStatus();

  const env = process.env;
  const startTime = Date.now();
  const speed = req.speed || 1.0;
  const keyType = `${req.accent}-${req.gender}` as const;
  const text = req.text.trim();

  // Deduplicate inflight requests for identical requests
  const flightKey = `${text}_${req.accent}_${req.gender}_${speed}_${req.voiceId || ''}`;
  const existingInflight = inflightRequests.get(flightKey);
  if (existingInflight) {
    return existingInflight;
  }

  const executionPromise: Promise<TtsSynthesisResponse> = (async (): Promise<TtsSynthesisResponse> => {
    const fallbackChain: Array<{ provider: TtsProvider; status: 'attempted' | 'failed' | 'success'; reason?: string }> = [];

    // --------------------------------------------------------------------------
    // TIER 1: ElevenLabs (Primary Reader)
    // --------------------------------------------------------------------------
    const elevenlabsKey = env.ELEVENLABS_API_KEY || '';
    const elevenlabsVoiceId = req.voiceId || env[`ELEVENLABS_${req.accent}_VOICE_ID`] || VOICE_PROFILES.elevenlabs[keyType] || VOICE_PROFILES.elevenlabs['US-female'];
    const elevenModel = 'eleven_multilingual_v2';

    if (elevenlabsKey && elevenlabsKey !== 'your_elevenlabs_api_key_here' && Date.now() >= providerCooldowns.elevenlabs) {
      const cacheKey = generateTtsCacheKey(text, 'elevenlabs', elevenModel, elevenlabsVoiceId, req.accent, speed);
      const cached = audioCache.get(cacheKey);
      if (cached) {
        return {
          audioBase64: cached.base64,
          provider: 'elevenlabs' as const,
          voiceId: elevenlabsVoiceId,
          cached: true,
          mimeType: cached.mimeType,
          latencyMs: Date.now() - startTime,
        };
      }

      fallbackChain.push({ provider: 'elevenlabs', status: 'attempted' });
      providerStats.elevenlabs.totalRequests++;

      try {
        const audio = await synthesizeWithElevenLabs(text, elevenlabsVoiceId, speed, elevenlabsKey);
        audioCache.set(cacheKey, { base64: audio.base64, mimeType: audio.mimeType, provider: 'elevenlabs', createdAt: Date.now() });

        providerStats.elevenlabs.successCount++;
        providerStats.elevenlabs.consecutiveFailures = 0;
        providerStats.elevenlabs.lastSuccessAt = new Date().toISOString();
        const latency = Date.now() - startTime;
        providerStats.elevenlabs.averageLatencyMs = Math.round((providerStats.elevenlabs.averageLatencyMs + latency) / 2);

        fallbackChain[fallbackChain.length - 1].status = 'success';
        return {
          audioBase64: audio.base64,
          provider: 'elevenlabs' as const,
          voiceId: elevenlabsVoiceId,
          cached: false,
          mimeType: audio.mimeType,
          fallbackChain,
          latencyMs: latency,
        };
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn('[TTS] ElevenLabs primary synthesis failed, transitioning to Deepgram fallback:', errMsg);
        fallbackChain[fallbackChain.length - 1].status = 'failed';
        fallbackChain[fallbackChain.length - 1].reason = errMsg;

        providerStats.elevenlabs.failureCount++;
        providerStats.elevenlabs.consecutiveFailures++;
        providerStats.elevenlabs.lastFailureAt = new Date().toISOString();
        if (providerStats.elevenlabs.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          providerCooldowns.elevenlabs = Date.now() + COOLDOWN_DURATION_MS;
        }
      }
    } else {
      fallbackChain.push({
        provider: 'elevenlabs',
        status: 'failed',
        reason: !elevenlabsKey ? 'Unconfigured API key' : 'Provider in cooldown',
      });
    }

    // --------------------------------------------------------------------------
    // TIER 2: Deepgram (1st Cloud Fallback)
    // --------------------------------------------------------------------------
    const deepgramKey = env.DEEPGRAM_API_KEY || '';
    const deepgramVoice = env[`DEEPGRAM_${req.accent}_VOICE`] || VOICE_PROFILES.deepgram[keyType] || VOICE_PROFILES.deepgram['US-female'];

    if (deepgramKey && deepgramKey !== 'your_deepgram_api_key_here' && Date.now() >= providerCooldowns.deepgram) {
      const cacheKey = generateTtsCacheKey(text, 'deepgram', 'aura-2', deepgramVoice, req.accent, speed);
      const cached = audioCache.get(cacheKey);
      if (cached) {
        return {
          audioBase64: cached.base64,
          provider: 'deepgram' as const,
          voiceId: deepgramVoice,
          cached: true,
          mimeType: cached.mimeType,
          fallbackChain,
          latencyMs: Date.now() - startTime,
        };
      }

      fallbackChain.push({ provider: 'deepgram', status: 'attempted' });
      providerStats.deepgram.totalRequests++;

      try {
        const audio = await synthesizeWithDeepgram(text, deepgramVoice, deepgramKey);
        audioCache.set(cacheKey, { base64: audio.base64, mimeType: audio.mimeType, provider: 'deepgram', createdAt: Date.now() });

        providerStats.deepgram.successCount++;
        providerStats.deepgram.consecutiveFailures = 0;
        providerStats.deepgram.lastSuccessAt = new Date().toISOString();
        const latency = Date.now() - startTime;
        providerStats.deepgram.averageLatencyMs = Math.round((providerStats.deepgram.averageLatencyMs + latency) / 2);

        fallbackChain[fallbackChain.length - 1].status = 'success';
        return {
          audioBase64: audio.base64,
          provider: 'deepgram' as const,
          voiceId: deepgramVoice,
          cached: false,
          mimeType: audio.mimeType,
          fallbackChain,
          latencyMs: latency,
        };
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn('[TTS] Deepgram fallback synthesis failed, transitioning to Cartesia fallback:', errMsg);
        fallbackChain[fallbackChain.length - 1].status = 'failed';
        fallbackChain[fallbackChain.length - 1].reason = errMsg;

        providerStats.deepgram.failureCount++;
        providerStats.deepgram.consecutiveFailures++;
        providerStats.deepgram.lastFailureAt = new Date().toISOString();
        if (providerStats.deepgram.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          providerCooldowns.deepgram = Date.now() + COOLDOWN_DURATION_MS;
        }
      }
    } else {
      fallbackChain.push({
        provider: 'deepgram',
        status: 'failed',
        reason: !deepgramKey ? 'Unconfigured API key' : 'Provider in cooldown',
      });
    }

    // --------------------------------------------------------------------------
    // TIER 3: Cartesia (2nd Cloud Fallback with Commercial License Check)
    // --------------------------------------------------------------------------
    const cartesiaKey = env.CARTESIA_API_KEY || '';
    const cartesiaModel = env.CARTESIA_TTS_MODEL || 'sonic-3.6';
    const cartesiaVoiceId = env[`CARTESIA_${req.accent}_VOICE_ID`] || VOICE_PROFILES.cartesia[keyType] || VOICE_PROFILES.cartesia['US-female'];
    const isCartesiaLicensed = env.CARTESIA_COMMERCIAL_LICENSE === 'true' || env.CARTESIA_COMMERCIAL_LICENSE === '1';

    // Commercial licensing guard: If running in production without commercial license, skip Cartesia
    const isProd = process.env.NODE_ENV === 'production';
    const canUseCartesia = cartesiaKey && cartesiaKey !== 'your_cartesia_api_key_here' && (!isProd || isCartesiaLicensed) && Date.now() >= providerCooldowns.cartesia;

    if (canUseCartesia) {
      const cacheKey = generateTtsCacheKey(text, 'cartesia', cartesiaModel, cartesiaVoiceId, req.accent, speed);
      const cached = audioCache.get(cacheKey);
      if (cached) {
        return {
          audioBase64: cached.base64,
          provider: 'cartesia' as const,
          voiceId: cartesiaVoiceId,
          cached: true,
          mimeType: cached.mimeType,
          fallbackChain,
          latencyMs: Date.now() - startTime,
        };
      }

      fallbackChain.push({ provider: 'cartesia', status: 'attempted' });
      providerStats.cartesia.totalRequests++;

      try {
        const audio = await synthesizeWithCartesia(text, cartesiaVoiceId, cartesiaModel, cartesiaKey);
        audioCache.set(cacheKey, { base64: audio.base64, mimeType: audio.mimeType, provider: 'cartesia', createdAt: Date.now() });

        providerStats.cartesia.successCount++;
        providerStats.cartesia.consecutiveFailures = 0;
        providerStats.cartesia.lastSuccessAt = new Date().toISOString();
        const latency = Date.now() - startTime;
        providerStats.cartesia.averageLatencyMs = Math.round((providerStats.cartesia.averageLatencyMs + latency) / 2);

        fallbackChain[fallbackChain.length - 1].status = 'success';
        return {
          audioBase64: audio.base64,
          provider: 'cartesia' as const,
          voiceId: cartesiaVoiceId,
          cached: false,
          mimeType: audio.mimeType,
          fallbackChain,
          latencyMs: latency,
        };
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn('[TTS] Cartesia fallback synthesis failed, falling back to browser synthesis:', errMsg);
        fallbackChain[fallbackChain.length - 1].status = 'failed';
        fallbackChain[fallbackChain.length - 1].reason = errMsg;

        providerStats.cartesia.failureCount++;
        providerStats.cartesia.consecutiveFailures++;
        providerStats.cartesia.lastFailureAt = new Date().toISOString();
        if (providerStats.cartesia.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          providerCooldowns.cartesia = Date.now() + COOLDOWN_DURATION_MS;
        }
      }
    } else {
      fallbackChain.push({
        provider: 'cartesia',
        status: 'failed',
        reason: !cartesiaKey
          ? 'Unconfigured API key'
          : (isProd && !isCartesiaLicensed)
          ? 'Disabled: Commercial license required for production'
          : 'Provider in cooldown',
      });
    }

    // --------------------------------------------------------------------------
    // TIER 4: Browser SpeechSynthesis (Final Client-Side Fallback)
    // --------------------------------------------------------------------------
    providerStats.browser.totalRequests++;
    providerStats.browser.successCount++;
    fallbackChain.push({ provider: 'browser', status: 'success', reason: 'Client-side SpeechSynthesis activation' });

    return {
      provider: 'browser' as const,
      voiceId: elevenlabsVoiceId || 'browser-native',
      cached: false,
      mimeType: 'audio/native-speech',
      fallbackChain,
      latencyMs: Date.now() - startTime,
    };
  })();

  inflightRequests.set(flightKey, executionPromise);
  try {
    return await executionPromise;
  } finally {
    inflightRequests.delete(flightKey);
  }
}

// ------------------------------------------------------------------------------
// Admin Health & Configuration Exports
// ------------------------------------------------------------------------------

export function getTtsProviderHealth(): ProviderHealth[] {
  loadEnvFile();
  updateProviderStatus();
  return Object.values(providerStats);
}

export function getTtsCacheStats(): { size: number; hitRate: number } {
  const total = Object.values(providerStats).reduce((acc, curr) => acc + curr.totalRequests, 0);
  const successes = Object.values(providerStats).reduce((acc, curr) => acc + curr.successCount, 0);
  return {
    size: audioCache.size,
    hitRate: total > 0 ? Math.round(((total - successes) / total) * 100) : 0,
  };
}

export function clearTtsAudioCache(): void {
  audioCache.clear();
}
