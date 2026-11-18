import { extractAnswer, MODEL, MAX_OUTPUT_TOKENS } from './policy'
export const GROQ_MODEL = 'openai/gpt-oss-120b'
export interface ProviderEnv {
  AI: Ai
  GROQ_ENABLED?: string
  GROQ_API_KEY?: string
  GROQ_FREE_VERIFIED_UNTIL?: string
}
export function groqVerified(env: ProviderEnv, now = Date.now()): boolean {
  const until = Date.parse(env.GROQ_FREE_VERIFIED_UNTIL || '')
  return env.GROQ_ENABLED === 'true' && !!env.GROQ_API_KEY && Number.isFinite(until) && until > now && until - now <= 7 * 86400000
}
export async function answerWithProviders(env: ProviderEnv, messages: { role: string; content: string }[], groqBlocked: boolean, parkGroq: () => Promise<void>): Promise<unknown> {
  if (!groqBlocked && groqVerified(env)) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST', headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({ model: GROQ_MODEL, messages, max_completion_tokens: MAX_OUTPUT_TOKENS, temperature: 0.2, reasoning_effort: 'low', include_reasoning: false }),
      })
      if (response.ok) {
        const output = await response.json()
        if (extractAnswer(output)) return output
      } else {
        // No provider body is logged or returned. If billing or paid access is
        // mentioned, park this provider for the day and keep the free fallback.
        const details = await response.json().catch(() => ({})) as { error?: { code?: string; message?: string } }
        if (/billing|payment|paid|on.demand|credit card|spend/i.test((details.error?.code || '') + ' ' + (details.error?.message || ''))) await parkGroq()
      }
    } catch { /* A failed primary gets exactly one already-budgeted free fallback. */ }
  }
  return env.AI.run(MODEL, { messages, max_completion_tokens: MAX_OUTPUT_TOKENS, temperature: 0.2, chat_template_kwargs: { enable_thinking: false } } as any)
}
