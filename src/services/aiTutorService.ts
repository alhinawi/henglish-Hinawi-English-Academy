import { getHenglishApiToken } from './henglishApi';
// ==============================================================================
// Henglish Academy (HENGLISH) - CLIENT AI TUTOR SERVICE
// Connects the learning helper to one bounded Worker request, without sending
// private learner profiles or progress to the text model.
// ==============================================================================

import { CEFRLevel } from '../types';
import { AiTutorMode, ASSISTANTS_REGISTRY } from './aiPrompts';
import { AiServiceUnavailableError, throwForAiResponse } from './aiAvailability';

export type { AiTutorMode };
export { ASSISTANTS_REGISTRY };

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode: AiTutorMode;
  isStreaming?: boolean;
  grammarCorrections?: {
    wrong: string;
    correct: string;
    explanationAr: string;
  }[];
  provider?: string;
  model?: string;
}

export interface AiRequestOptions {
  message: string;
  mode: AiTutorMode;
  userLevel: CEFRLevel;
  history?: AiChatMessage[];
  onChunk?: (chunk: string) => void;
  signal?: AbortSignal;
}

export interface AiResponseResult {
  text: string;
  corrections?: { wrong: string; correct: string; explanationAr: string }[];
  provider: string;
  model: string;
  isLocalFallback: boolean;
}

/**
 * Request one bounded learning-helper answer. onChunk receives the final text once.
 */
export async function sendAiTutorMessage(options: AiRequestOptions): Promise<AiResponseResult> {
  const { message, mode, userLevel, history = [], onChunk, signal } = options;
  // Send only bounded conversation text. Never send the learner's profile,
  // progress, email, name or arbitrary system/context objects to inference.
  const formattedHistory = history.filter(h => !h.isStreaming).slice(-4).map(h => ({
    role: h.sender === 'user' ? ('user' as const) : ('assistant' as const),
    content: h.content.slice(0, 1000),
  }));
  const requestBody = { message, mode, userLevel, history: formattedHistory };
  const token = getHenglishApiToken();

  // Standard non-streaming POST
  try {
    const response = await fetch('https://henglish-helper.hnz.workers.dev/api/helper/chat', {
      signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const data = await response.clone().json().catch(() => ({}));
      const messages: Record<string, string> = {
        HELPER_DAILY_LIMIT: 'المساعد وصل لحده المجاني النهارده. جرّب بكرة، وتقدر تكمل دروسك وتدريباتك عادي.',
        HELPER_RATE_LIMIT: 'استنى دقيقة قبل السؤال الجاي عشان المساعد يفضل متاح لكل الطلبة.',
        HELPER_INVALID_REQUEST: 'اكتب سؤال إنجليزي قصير، بحد أقصى 1200 حرف.',
        HELPER_UNAVAILABLE: 'المساعد مش متاح دلوقتي. جرّب بعد شوية.',
      };
      if (messages[data.code]) {
        const error = new Error('helper_request_failed') as Error & { helperMessage: string };
        error.helperMessage = messages[data.code];
        throw error;
      }
    }
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    await throwForAiResponse(response, `AI tutor request failed with status ${response.status}`);
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object' || Array.isArray(data) ||
        !('text' in data) || typeof data.text !== 'string' || !data.text.trim()) {
      throw new Error('AI tutor returned no usable answer');
    }
    const result = data as AiResponseResult;
    // No pseudo-streaming or second provider request. The view finalizes the
    // real answer once; cancellation still belongs to its request controller.
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    if (onChunk) onChunk(result.text);
    return {
      text: result.text,
      corrections: result.corrections,
      provider: result.provider || 'server-api',
      model: result.model || 'ai-model',
      isLocalFallback: result.isLocalFallback || false,
    };
  } catch (err) {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    if (err instanceof AiServiceUnavailableError) {
      throw err;
    }
    throw err instanceof Error ? err : new Error('AI tutor request failed');
  }
}
