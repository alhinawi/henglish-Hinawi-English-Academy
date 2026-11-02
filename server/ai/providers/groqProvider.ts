// ==============================================================================
// HENGLISH ACADEMY - GROQ AI PROVIDER (PRIMARY PROVIDER)
// Ultra-low latency LPU inference via Groq
// ==============================================================================

import { BaseAiProvider } from './baseProvider';
import {
  AiProviderName,
  AiCompletionOptions,
  AiCompletionResult,
  AiTaskType,
} from '../types';

export class GroqProvider extends BaseAiProvider {
  readonly name: AiProviderName = 'groq';
  readonly supportsStreaming = true;

  private getApiKey(): string {
    return (
      (typeof process !== 'undefined' && process.env.GROQ_API_KEY) ||
      ''
    );
  }

  isConfigured(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.trim() !== '' && !key.includes('your_groq_api_key'));
  }

  getRecommendedModel(task: AiTaskType): string {
    if (process.env.GROQ_AI_MODEL) {
      return process.env.GROQ_AI_MODEL;
    }

    switch (task) {
      case 'grammar_audit':
      case 'writing_evaluation':
        return 'openai/gpt-oss-120b';
      case 'vocabulary':
      case 'conversation':
      case 'question_generation':
      case 'translation':
      default:
        return 'qwen/qwen3.8-27b';
    }
  }

  async complete(options: AiCompletionOptions): Promise<AiCompletionResult> {
    const apiKey = this.getApiKey();
    if (!this.isConfigured()) {
      throw new Error('Groq API Key is not configured. (GROQ_API_KEY)');
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
      const requestedTokens = options.maxTokens ?? 2048;
      // Reasoning models (like openai/gpt-oss-*) consume tokens for internal reasoning before output
      const effectiveMaxTokens = model.includes('gpt-oss')
        ? Math.max(requestedTokens, 1024)
        : requestedTokens;

      const payload: Record<string, unknown> = {
        model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: effectiveMaxTokens,
      };

      if (options.responseFormat === 'json') {
        payload.response_format = { type: 'json_object' };
      }

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
        const err = new Error(`Groq HTTP ${res.status}: ${errorText}`);
        (err as unknown as { status: number }).status = res.status;
        throw err;
      }

      const data = await res.json();
      const durationMs = Date.now() - startTime;
      const msgChoice = data.choices?.[0]?.message;
      let text = (msgChoice?.content || '').trim();
      if (!text && msgChoice?.reasoning) {
        text = msgChoice.reasoning.trim();
      }

      if (!text) {
        throw new Error('Groq returned empty response');
      }

      return {
        text,
        provider: 'groq',
        model,
        durationMs,
        promptTokens: data.usage?.prompt_tokens,
        completionTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
        fallbackChain: ['groq'],
        isLocalFallback: false,
      };
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }
}
