import { describe, it, expect } from 'vitest';
import { GroqProvider } from '../server/ai/providers/groqProvider';
import { GeminiProvider } from '../server/ai/providers/geminiProvider';
import { CloudflareProvider } from '../server/ai/providers/cloudflareProvider';
import { OpenAiProvider } from '../server/ai/providers/openaiProvider';
import { LocalBrainProvider } from '../server/ai/providers/localBrainProvider';
import {
  dispatchThroughAiRouter,
  getProviderHealthList,
  getRouterConfig,
} from '../server/ai/aiRouter';

describe('Henglish Centralized Multi-Provider AI Architecture Suite', () => {
  it('correctly declares all provider implementations', () => {
    const groq = new GroqProvider();
    const gemini = new GeminiProvider();
    const cloudflare = new CloudflareProvider();
    const openai = new OpenAiProvider();
    const local = new LocalBrainProvider();

    expect(groq.name).toBe('groq');
    expect(gemini.name).toBe('gemini');
    expect(cloudflare.name).toBe('cloudflare');
    expect(openai.name).toBe('openai');
    expect(local.name).toBe('local');
  });

  it('guarantees LocalBrainProvider is permanently configured with zero external keys', () => {
    const local = new LocalBrainProvider();
    expect(local.isConfigured()).toBe(true);
  });

  it('detects rate limits (HTTP 429) across providers', () => {
    const groq = new GroqProvider();
    expect(groq.isRateLimit(429, 'rate limit exceeded')).toBe(true);
    expect(groq.isRateLimit(500, 'server error')).toBe(false);
  });

  it('detects authentication errors (HTTP 401)', () => {
    const groq = new GroqProvider();
    expect(groq.isAuthError(401, 'Unauthorized')).toBe(true);
    expect(groq.isAuthError(429, 'rate limit')).toBe(false);
  });

  it('maintains expected default routing hierarchy: Groq -> Gemini -> Cloudflare -> OpenAI -> Local', () => {
    const config = getRouterConfig();
    expect(config.providerPriority[0]).toBe('groq');
    expect(config.providerPriority[1]).toBe('gemini');
    expect(config.providerPriority[2]).toBe('cloudflare');
    expect(config.providerPriority[3]).toBe('openai');
    expect(config.providerPriority[4]).toBe('local');
  });

  it('provides comprehensive health status for all 5 providers', () => {
    const health = getProviderHealthList();
    expect(health.length).toBe(5);
    const names = health.map(h => h.provider);
    expect(names).toContain('groq');
    expect(names).toContain('gemini');
    expect(names).toContain('cloudflare');
    expect(names).toContain('openai');
    expect(names).toContain('local');
  });

  it('executes educational query cleanly through AI router with caching', async () => {
    const res = await dispatchThroughAiRouter({
      task: 'vocabulary',
      systemPrompt: 'You are an educational tutor.',
      messages: [{ role: 'user', content: 'What does "eloquent" mean in Arabic?' }],
      maxTokens: 50,
      temperature: 0.2,
    });

    expect(res.text).toBeDefined();
    expect(res.text.length).toBeGreaterThan(0);
    expect(res.provider).toBeDefined();
    expect(res.fallbackChain.length).toBeGreaterThan(0);
  });
});

