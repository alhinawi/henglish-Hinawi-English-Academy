// ==============================================================================
// HENGLISH ACADEMY - CENTRALIZED MULTI-PROVIDER AI SYSTEM
// Types, Interfaces & Health Monitoring Definitions
// ==============================================================================

export type AiProviderName = 'groq' | 'gemini' | 'cloudflare' | 'openai' | 'local';

export type AiTaskType =
  | 'conversation'
  | 'grammar_audit'
  | 'question_generation'
  | 'vocabulary'
  | 'writing_evaluation'
  | 'translation'
  | 'speech_evaluation';

export interface AiMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AiCompletionOptions {
  task: AiTaskType;
  messages: AiMessage[];
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
  timeoutMs?: number;
  skipCache?: boolean;
  modelOverride?: string;
}

export interface AiCompletionResult {
  text: string;
  provider: AiProviderName;
  model: string;
  durationMs: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  fallbackChain: string[];
  isLocalFallback: boolean;
  cached?: boolean;
}

export interface ProviderHealthStatus {
  provider: AiProviderName;
  isConfigured: boolean;
  isEnabled: boolean;
  isAvailable: boolean;
  inCooldown: boolean;
  cooldownRemainingSeconds: number;
  consecutiveFailures: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatencyMs: number;
  lastError?: string;
  lastUsedAt?: string;
}

export interface AiRouterConfig {
  providerPriority: AiProviderName[];
  enabledProviders: Record<AiProviderName, boolean>;
  defaultTimeoutMs: number;
  maxRetriesPerProvider: number;
  cooldownPeriodMs: number;
  cacheEnabled: boolean;
  cacheTtlMs: number;
  taskModelOverrides?: Partial<Record<AiTaskType, Partial<Record<AiProviderName, string>>>>;
}

export interface AiUsageAnalyticsEntry {
  id: string;
  timestamp: string;
  provider: AiProviderName;
  model: string;
  taskType: AiTaskType;
  durationMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  status: 'success' | 'fallback_recovered' | 'failed';
  fallbackChain: string[];
  errorMessage?: string;
}
