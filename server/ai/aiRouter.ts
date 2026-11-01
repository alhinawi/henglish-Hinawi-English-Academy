// ==============================================================================
// HENGLISH ACADEMY - CENTRALIZED MULTI-PROVIDER AI ROUTER
// Intelligently orchestrates Groq -> Gemini -> Cloudflare -> OpenAI -> Local
// With Circuit Breakers, Exponential Cooldowns, In-Memory Caching & Analytics
// ==============================================================================

import {
  AiProviderName,
  AiCompletionOptions,
  AiCompletionResult,
  AiRouterConfig,
  ProviderHealthStatus,
  AiUsageAnalyticsEntry,
} from './types';
import { BaseAiProvider } from './providers/baseProvider';
import { GroqProvider } from './providers/groqProvider';
import { GeminiProvider } from './providers/geminiProvider';
import { CloudflareProvider } from './providers/cloudflareProvider';
import { OpenAiProvider } from './providers/openaiProvider';
import { LocalBrainProvider } from './providers/localBrainProvider';

// Provider Instances
const PROVIDERS: Record<AiProviderName, BaseAiProvider> = {
  groq: new GroqProvider(),
  gemini: new GeminiProvider(),
  cloudflare: new CloudflareProvider(),
  openai: new OpenAiProvider(),
  local: new LocalBrainProvider(),
};

// Default Router Configuration
let routerConfig: AiRouterConfig = {
  providerPriority: ['groq', 'gemini', 'cloudflare', 'openai', 'local'],
  enabledProviders: {
    groq: true,
    gemini: true,
    cloudflare: true,
    openai: true,
    local: true,
  },
  defaultTimeoutMs: 25000,
  maxRetriesPerProvider: 1,
  cooldownPeriodMs: 45000, // 45 seconds on rate limit / server error
  cacheEnabled: true,
  cacheTtlMs: 15 * 60 * 1000, // 15 minutes
};

// Health & Statistics Tracking
interface InternalProviderStats {
  consecutiveFailures: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalDurationMs: number;
  inCooldownUntil: number;
  isPermanentlyMisconfigured: boolean;
  lastError?: string;
  lastUsedAt?: string;
}

const providerStats: Record<AiProviderName, InternalProviderStats> = {
  groq: { consecutiveFailures: 0, totalRequests: 0, successfulRequests: 0, failedRequests: 0, totalDurationMs: 0, inCooldownUntil: 0, isPermanentlyMisconfigured: false },
  gemini: { consecutiveFailures: 0, totalRequests: 0, successfulRequests: 0, failedRequests: 0, totalDurationMs: 0, inCooldownUntil: 0, isPermanentlyMisconfigured: false },
  cloudflare: { consecutiveFailures: 0, totalRequests: 0, successfulRequests: 0, failedRequests: 0, totalDurationMs: 0, inCooldownUntil: 0, isPermanentlyMisconfigured: false },
  openai: { consecutiveFailures: 0, totalRequests: 0, successfulRequests: 0, failedRequests: 0, totalDurationMs: 0, inCooldownUntil: 0, isPermanentlyMisconfigured: false },
  local: { consecutiveFailures: 0, totalRequests: 0, successfulRequests: 0, failedRequests: 0, totalDurationMs: 0, inCooldownUntil: 0, isPermanentlyMisconfigured: false },
};

// In-Memory Response Cache
interface CacheEntry {
  result: AiCompletionResult;
  expiresAt: number;
}
const responseCache = new Map<string, CacheEntry>();

// In-Flight Request Deduplication Map
const inFlightRequests = new Map<string, Promise<AiCompletionResult>>();

// Analytics Buffer (Last 200 requests)
const usageAnalyticsBuffer: AiUsageAnalyticsEntry[] = [];

/**
 * Generate unique cache & deduplication key
 */
function createRequestKey(options: AiCompletionOptions): string {
  const content = options.messages.map(m => `${m.role}:${m.content}`).join('|');
  const sys = options.systemPrompt || '';
  const fmt = options.responseFormat || 'text';
  return `${options.task}:${fmt}:${sys}:${content}`;
}

/**
 * Approximate USD cost per 1K tokens for analytics
 */
function calculateEstimatedCost(provider: AiProviderName, promptTokens = 0, completionTokens = 0): number {
  let promptRatePerM = 0;
  let completionRatePerM = 0;

  switch (provider) {
    case 'groq': // Llama 3.3 ~ $0.59 / $0.79 per M
      promptRatePerM = 0.59;
      completionRatePerM = 0.79;
      break;
    case 'gemini': // Gemini 2.5 Flash ~ $0.15 / $0.60 per M
      promptRatePerM = 0.15;
      completionRatePerM = 0.60;
      break;
    case 'cloudflare': // Cloudflare Workers AI
      promptRatePerM = 0.20;
      completionRatePerM = 0.20;
      break;
    case 'openai': // GPT-4o-mini ~ $0.15 / $0.60 per M
      promptRatePerM = 0.15;
      completionRatePerM = 0.60;
      break;
    default:
      return 0;
  }

  const cost = (promptTokens / 1_000_000) * promptRatePerM + (completionTokens / 1_000_000) * completionRatePerM;
  return Number(cost.toFixed(6));
}

/**
 * Main Centralized AI Router Method
 */
export async function dispatchThroughAiRouter(
  options: AiCompletionOptions
): Promise<AiCompletionResult> {
  const cacheKey = createRequestKey(options);

  // 1. Check in-memory cache
  if (routerConfig.cacheEnabled && !options.skipCache) {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return {
        ...cached.result,
        cached: true,
      };
    }
  }

  // 2. Request deduplication (merge simultaneous identical requests)
  if (inFlightRequests.has(cacheKey)) {
    return inFlightRequests.get(cacheKey)!;
  }

  const executionPromise = executeWithFallback(options, cacheKey);
  inFlightRequests.set(cacheKey, executionPromise);

  try {
    const result = await executionPromise;
    return result;
  } finally {
    inFlightRequests.delete(cacheKey);
  }
}

/**
 * Execute request across provider priority queue with intelligent fallback
 */
async function executeWithFallback(
  options: AiCompletionOptions,
  cacheKey: string
): Promise<AiCompletionResult> {
  const now = Date.now();
  const fallbackChain: string[] = [];
  const priorityList = routerConfig.providerPriority;

  for (const providerName of priorityList) {
    // Check if enabled
    if (!routerConfig.enabledProviders[providerName]) {
      continue;
    }

    const provider = PROVIDERS[providerName];
    const stats = providerStats[providerName];

    // Check if configured
    if (!provider.isConfigured()) {
      continue;
    }

    // Check if permanently misconfigured (e.g. 401 invalid key)
    if (stats.isPermanentlyMisconfigured && providerName !== 'local') {
      continue;
    }

    // Check if in cooldown
    if (now < stats.inCooldownUntil && providerName !== 'local') {
      continue;
    }

    fallbackChain.push(providerName);
    stats.totalRequests += 1;
    stats.lastUsedAt = new Date().toISOString();

    const startTime = Date.now();

    try {
      const result = await provider.complete({
        ...options,
        timeoutMs: options.timeoutMs || routerConfig.defaultTimeoutMs,
      });

      const durationMs = Date.now() - startTime;
      stats.successfulRequests += 1;
      stats.consecutiveFailures = 0;
      stats.totalDurationMs += durationMs;

      const finalResult: AiCompletionResult = {
        ...result,
        fallbackChain,
      };

      // Record in usage analytics
      recordAnalytics({
        id: `usage-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        provider: providerName,
        model: result.model,
        taskType: options.task,
        durationMs,
        promptTokens: result.promptTokens || 0,
        completionTokens: result.completionTokens || 0,
        totalTokens: (result.promptTokens || 0) + (result.completionTokens || 0),
        estimatedCostUsd: calculateEstimatedCost(providerName, result.promptTokens, result.completionTokens),
        status: fallbackChain.length > 1 ? 'fallback_recovered' : 'success',
        fallbackChain,
      });

      // Save in cache if enabled
      if (routerConfig.cacheEnabled && !options.skipCache) {
        responseCache.set(cacheKey, {
          result: finalResult,
          expiresAt: Date.now() + routerConfig.cacheTtlMs,
        });

        // Prune cache if oversized
        if (responseCache.size > 500) {
          const oldestKey = responseCache.keys().next().value;
          if (oldestKey) responseCache.delete(oldestKey);
        }
      }

      return finalResult;
    } catch (err: unknown) {
      const durationMs = Date.now() - startTime;
      stats.failedRequests += 1;
      stats.consecutiveFailures += 1;
      stats.totalDurationMs += durationMs;

      const errorMsg = err instanceof Error ? err.message : String(err);
      stats.lastError = errorMsg;

      const httpStatus = (err as { status?: number })?.status || 0;

      // Handle Authentication / Invalid Key -> Do not hammer invalid key
      if (provider.isAuthError(httpStatus, errorMsg)) {
        stats.isPermanentlyMisconfigured = true;
        console.warn(`[AI Router] Provider ${providerName} failed authentication (${httpStatus}). Flagged as misconfigured.`);
      }

      // Handle Rate Limit (429) or Server Overload (5xx) -> Trigger Cooldown
      if (provider.isRateLimit(httpStatus, errorMsg) || httpStatus >= 500 || provider.isTimeout(err)) {
        stats.inCooldownUntil = Date.now() + routerConfig.cooldownPeriodMs;
        console.warn(`[AI Router] Provider ${providerName} encountered error (${errorMsg}). Set in cooldown for ${routerConfig.cooldownPeriodMs / 1000}s.`);
      }

      // Fallback continues to next provider in loop
      continue;
    }
  }

  // If all providers failed or were unavailable, use Local Brain guaranteed fallback
  const localProvider = PROVIDERS.local;
  fallbackChain.push('local');
  const localRes = await localProvider.complete(options);

  recordAnalytics({
    id: `usage-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    provider: 'local',
    model: localRes.model,
    taskType: options.task,
    durationMs: localRes.durationMs,
    promptTokens: 0,
    completionTokens: 0,
    totalTokens: 0,
    estimatedCostUsd: 0,
    status: 'fallback_recovered',
    fallbackChain,
  });

  return {
    ...localRes,
    fallbackChain,
  };
}

/**
 * Record usage event to in-memory buffer
 */
function recordAnalytics(entry: AiUsageAnalyticsEntry) {
  usageAnalyticsBuffer.unshift(entry);
  if (usageAnalyticsBuffer.length > 300) {
    usageAnalyticsBuffer.pop();
  }
}

/**
 * Get Provider Health Status list for Admin Dashboard
 */
export function getProviderHealthList(): ProviderHealthStatus[] {
  const now = Date.now();
  return (Object.keys(PROVIDERS) as AiProviderName[]).map(name => {
    const provider = PROVIDERS[name];
    const stats = providerStats[name];
    const isConfigured = provider.isConfigured();
    const isEnabled = routerConfig.enabledProviders[name];
    const inCooldown = now < stats.inCooldownUntil;
    const cooldownRemaining = inCooldown ? Math.round((stats.inCooldownUntil - now) / 1000) : 0;
    const avgLatency =
      stats.totalRequests > 0 ? Math.round(stats.totalDurationMs / stats.totalRequests) : 0;

    return {
      provider: name,
      isConfigured,
      isEnabled,
      isAvailable: isConfigured && isEnabled && !inCooldown && !stats.isPermanentlyMisconfigured,
      inCooldown,
      cooldownRemainingSeconds: cooldownRemaining,
      consecutiveFailures: stats.consecutiveFailures,
      totalRequests: stats.totalRequests,
      successfulRequests: stats.successfulRequests,
      failedRequests: stats.failedRequests,
      averageLatencyMs: avgLatency,
      lastError: stats.lastError,
      lastUsedAt: stats.lastUsedAt,
    };
  });
}

/**
 * Router Configuration Getters & Setters
 */
export function getRouterConfig(): AiRouterConfig {
  return { ...routerConfig };
}

export function updateRouterConfig(partial: Partial<AiRouterConfig>): AiRouterConfig {
  routerConfig = {
    ...routerConfig,
    ...partial,
  };
  return { ...routerConfig };
}

/**
 * Get Recent Usage Analytics
 */
export function getRecentUsageAnalytics(): AiUsageAnalyticsEntry[] {
  return [...usageAnalyticsBuffer];
}

/**
 * Clear In-Memory Cache
 */
export function clearAiResponseCache(): void {
  responseCache.clear();
}
