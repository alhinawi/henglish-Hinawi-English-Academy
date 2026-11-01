// ==============================================================================
// HENGLISH ACADEMY - GOOGLE GEMINI AI PROVIDER (FIRST FALLBACK)
// Multimodal reasoning & structured output via Google Gemini 2.5 / 1.5 Flash
// ==============================================================================

import { BaseAiProvider } from './baseProvider';
import {
  AiProviderName,
  AiCompletionOptions,
  AiCompletionResult,
  AiTaskType,
} from '../types';

export class GeminiProvider extends BaseAiProvider {
  readonly name: AiProviderName = 'gemini';
  readonly supportsStreaming = true;

  private getApiKey(): string {
    return process.env.GEMINI_API_KEY || process.env.VITE_AI_API_KEY || '';
  }

  isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.trim() !== '' && !key.includes('your_') && !key.includes('placeholder'));
  }

  getRecommendedModel(task: AiTaskType): string {
    switch (task) {
      case 'vocabulary':
      case 'conversation':
        return 'gemini-1.5-flash';
      case 'grammar_audit':
      case 'writing_evaluation':
      case 'question_generation':
      case 'translation':
      default:
        return 'gemini-2.5-flash';
    }
  }

  async complete(options: AiCompletionOptions): Promise<AiCompletionResult> {
    const apiKey = this.getApiKey();
    if (!this.isConfigured()) {
      throw new Error('Google Gemini API Key is not configured. (GEMINI_API_KEY)');
    }

    const model = options.modelOverride || this.getRecommendedModel(options.task);
    const timeoutMs = options.timeoutMs || 25000;

    // Convert messages to Gemini format (user | model)
    const contents: Array<{ role: 'user' | 'model'; parts: { text: string }[] }> = [];

    for (const m of options.messages) {
      if (m.role === 'system') continue; // Handled in systemInstruction
      const role = m.role === 'assistant' ? 'model' : 'user';

      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += '\n\n' + m.content;
      } else {
        contents.push({ role, parts: [{ text: m.content }] });
      }
    }

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const startTime = Date.now();

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const generationConfig: Record<string, unknown> = {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens ?? 2048,
      };

      if (options.responseFormat === 'json') {
        generationConfig.responseMimeType = 'application/json';
      }

      const requestBody: Record<string, unknown> = {
        contents,
        generationConfig,
      };

      if (options.systemPrompt) {
        requestBody.systemInstruction = {
          parts: [{ text: options.systemPrompt }],
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errorText = await res.text();
        const err = new Error(`Gemini HTTP ${res.status}: ${errorText}`);
        (err as unknown as { status: number }).status = res.status;
        throw err;
      }

      const data = await res.json();
      const durationMs = Date.now() - startTime;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        throw new Error('Gemini returned empty response candidate');
      }

      return {
        text,
        provider: 'gemini',
        model,
        durationMs,
        promptTokens: data.usageMetadata?.promptTokenCount,
        completionTokens: data.usageMetadata?.candidatesTokenCount,
        totalTokens: data.usageMetadata?.totalTokenCount,
        fallbackChain: ['gemini'],
        isLocalFallback: false,
      };
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }
}
