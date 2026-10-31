// ==============================================================================
// Henglish Academy (HENGLISH) - CLIENT AI TUTOR SERVICE
// Connects UI to secure server-side AI endpoints (/api/ai/chat, /api/ai/stream)
// with real-time SSE streaming, platform context, and fallback protection
// ==============================================================================

import { CEFRLevel } from '../types';
import { AiTutorMode, ASSISTANTS_REGISTRY } from './aiPrompts';
import { StudentPlatformContext } from './aiPlatformContext';

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
  platformContext?: StudentPlatformContext;
  onChunk?: (chunk: string) => void;
}

export interface AiResponseResult {
  text: string;
  corrections?: { wrong: string; correct: string; explanationAr: string }[];
  provider: string;
  model: string;
  isLocalFallback: boolean;
}

/**
 * Send a message to the AI Assistant with real-time streaming if onChunk is provided
 */
export async function sendAiTutorMessage(options: AiRequestOptions): Promise<AiResponseResult> {
  const { message, mode, userLevel, history = [], platformContext, onChunk } = options;

  // Format historical conversation for server
  const formattedHistory = history.map(h => ({
    role: h.sender === 'user' ? ('user' as const) : ('assistant' as const),
    content: h.content,
  }));

  const requestBody = {
    message,
    mode,
    userLevel,
    history: formattedHistory,
    platformContext,
  };

  // If onChunk is provided, use SSE stream endpoint
  if (onChunk) {
    try {
      const response = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullText = '';
        let resultMetadata: Partial<AiResponseResult> = {};

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const textChunk = decoder.decode(value, { stream: true });
          const lines = textChunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.replace('data: ', '').trim());
                if (parsed.text) {
                  fullText += parsed.text;
                  onChunk(parsed.text);
                }
                if (parsed.provider) {
                  resultMetadata = parsed;
                }
              } catch {
                // Ignore parse errors on partial chunks
              }
            }
          }
        }

        if (fullText.trim()) {
          return {
            text: fullText,
            corrections: resultMetadata.corrections,
            provider: resultMetadata.provider || 'server-stream',
            model: resultMetadata.model || 'ai-model',
            isLocalFallback: resultMetadata.isLocalFallback || false,
          };
        }
      }
    } catch (err) {
      console.warn('Streaming fetch failed, falling back to standard POST:', err);
    }
  }

  // Standard non-streaming POST
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        text: data.text,
        corrections: data.corrections,
        provider: data.provider || 'server-api',
        model: data.model || 'ai-model',
        isLocalFallback: data.isLocalFallback || false,
      };
    }
  } catch (err) {
    console.warn('Network call to /api/ai/chat failed:', err);
  }

  // Fallback client response if network or dev proxy disconnected
  return {
    text: `أهلاً بك! أنا معلمك الإنجليزي في أكاديمية هناوي. 🦅
لقد استلمت استفسارك: "${message}".
يمكنك مراجعة كافة الدروس التفاعلية في منصة هناوي، أو التحقق من الاتصال بالخادم الداخلي للمنصة.`,
    provider: 'client-offline-fallback',
    model: 'offline-agent',
    isLocalFallback: true,
  };
}
