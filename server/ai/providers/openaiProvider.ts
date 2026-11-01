// ==============================================================================
// HENGLISH ACADEMY - OPENAI PROVIDER (OPTIONAL ADDITIONAL PROVIDER)
// ==============================================================================

import { BaseAiProvider } from './baseProvider';
import {
  AiProviderName,
  AiCompletionOptions,
  AiCompletionResult,
  AiTaskType,
} from '../types';

export class OpenAiProvider extends BaseAiProvider {
  readonly name: AiProviderName = 'openai';
  readonly supportsStreaming = true;

  private getApiKey(): string {
    return process.env.OPENAI_API_KEY || '';
  }

  isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.trim() !== '' && !key.includes('your_'));
  }

  getRecommendedModel(task: AiTaskType): string {
    switch (task) {
      case 'vocabulary':
      case 'conversation':
        return 'gpt-4o-mini';
      case 'grammar_audit':
      case 'writing_evaluation':
      case 'question_generation':
      case 'translation':
      default:
        return 'gpt-4o';
    }
  }

  async complete(options: AiCompletionOptions): Promise<AiCompletionResult> {
    const apiKey = this.getApiKey();
    if (!this.isConfigured()) {
      throw new Error('OpenAI API Key is not configured. (OPENAI_API_KEY)');
    }

    const model = options.modelOverride || this.getRecommendedModel(options.task);
    const timeoutMs = options.timeoutMs || 25000;

    const messages = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    for (const m of options.messages) {
      messages.push({ role: m.role, content: m.content });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const startTime = Date.now();

    try {
      const payload: Record<string, unknown> = {
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
      };

      if (options.responseFormat === 'json') {
        payload.response_format = { type: 'json_object' };
      }

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errorText = await res.text();
        const err = new Error(`OpenAI HTTP ${res.status}: ${errorText}`);
        (err as unknown as { status: number }).status = res.status;
        throw err;
      }

      const data = await res.json();
      const durationMs = Date.now() - startTime;
      const text = data.choices?.[0]?.message?.content || '';

      if (!text) {
        throw new Error('OpenAI returned empty response');
      }

      return {
        text,
        provider: 'openai',
        model,
        durationMs,
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
        fallbackChain: ['openai'],
        isLocalFallback: false,
      };
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }
}
