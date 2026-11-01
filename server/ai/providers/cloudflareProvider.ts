// ==============================================================================
// HENGLISH ACADEMY - CLOUDFLARE WORKERS AI PROVIDER (SECOND FALLBACK)
// Serverless edge inference running on Cloudflare's global network
// ==============================================================================

import { BaseAiProvider } from './baseProvider';
import {
  AiProviderName,
  AiCompletionOptions,
  AiCompletionResult,
  AiTaskType,
} from '../types';

export class CloudflareProvider extends BaseAiProvider {
  readonly name: AiProviderName = 'cloudflare';
  readonly supportsStreaming = false;

  private getAccountId(): string {
    return process.env.CLOUDFLARE_ACCOUNT_ID || '';
  }

  private getApiToken(): string {
    return process.env.CLOUDFLARE_API_TOKEN || '';
  }

  isConfigured(): boolean {
    const acc = this.getAccountId();
    const token = this.getApiToken();
    return Boolean(
      acc &&
      acc.trim() !== '' &&
      !acc.includes('your_') &&
      token &&
      token.trim() !== '' &&
      !token.includes('your_')
    );
  }

  getRecommendedModel(task: AiTaskType): string {
    if (process.env.CLOUDFLARE_AI_MODEL) {
      return process.env.CLOUDFLARE_AI_MODEL;
    }

    switch (task) {
      case 'vocabulary':
      case 'conversation':
        return '@cf/meta/llama-3.1-8b-instruct';
      case 'grammar_audit':
      case 'writing_evaluation':
      case 'question_generation':
      case 'translation':
      default:
        return '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
    }
  }

  async complete(options: AiCompletionOptions): Promise<AiCompletionResult> {
    const accountId = this.getAccountId();
    const apiToken = this.getApiToken();

    if (!this.isConfigured()) {
      throw new Error(
        'Cloudflare Workers AI credentials missing (CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN required).'
      );
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
      const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

      const payload: Record<string, unknown> = {
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const errorText = await res.text();
        const err = new Error(`Cloudflare Workers AI HTTP ${res.status}: ${errorText}`);
        (err as unknown as { status: number }).status = res.status;
        throw err;
      }

      const data = await res.json();
      const durationMs = Date.now() - startTime;

      if (!data.success && data.errors && data.errors.length > 0) {
        const errMsg = data.errors.map((e: { message?: string }) => e.message || JSON.stringify(e)).join(', ');
        throw new Error(`Cloudflare AI execution error: ${errMsg}`);
      }

      // Cloudflare response format normalization
      const responseText = data.result?.response || data.result?.text || '';

      if (!responseText) {
        throw new Error('Cloudflare Workers AI returned empty text');
      }

      return {
        text: responseText,
        provider: 'cloudflare',
        model,
        durationMs,
        fallbackChain: ['cloudflare'],
        isLocalFallback: false,
      };
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }
}
