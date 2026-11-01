// ==============================================================================
// HENGLISH ACADEMY - BASE AI PROVIDER CONTRACT
// ==============================================================================

import {
  AiProviderName,
  AiCompletionOptions,
  AiCompletionResult,
  AiTaskType,
} from '../types';

export abstract class BaseAiProvider {
  abstract readonly name: AiProviderName;
  abstract readonly supportsStreaming: boolean;

  abstract isConfigured(): boolean;

  abstract complete(options: AiCompletionOptions): Promise<AiCompletionResult>;

  abstract getRecommendedModel(task: AiTaskType): string;

  /**
   * Classify common HTTP / Network errors
   */
  isRateLimit(status: number, message: string = ''): boolean {
    return status === 429 || message.toLowerCase().includes('rate limit') || message.toLowerCase().includes('too many requests');
  }

  isAuthError(status: number, message: string = ''): boolean {
    return status === 401 || status === 403 || message.toLowerCase().includes('invalid api key') || message.toLowerCase().includes('unauthorized');
  }

  isQuotaExceeded(status: number, message: string = ''): boolean {
    return status === 402 || message.toLowerCase().includes('quota') || message.toLowerCase().includes('insufficient_quota') || message.toLowerCase().includes('credit');
  }

  isTimeout(err: unknown): boolean {
    if (err instanceof Error) {
      return (
        err.name === 'AbortError' ||
        err.message.includes('timeout') ||
        err.message.includes('TIMED_OUT')
      );
    }
    return false;
  }
}
