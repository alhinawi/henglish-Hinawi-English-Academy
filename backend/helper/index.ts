import { answerWithProviders, type ProviderEnv } from './providers'
import { DurableObject } from 'cloudflare:workers'
import { digest, extractAnswer, freshMeter, prepareMessages, reserve, type Meter } from './policy'

interface Env extends ProviderEnv {
  HELPER_LIMITS: DurableObjectNamespace<HelperLimits>
  DB: D1Database
  HELPER_ENABLED?: string
}
const ORIGINS = ['https://henglish.pages.dev', 'http://localhost:5173', 'http://127.0.0.1:4188']
const DAILY_MESSAGE = 'المساعد وصل لحده المجاني النهارده. جرّب بكرة، وتقدر تكمل دروسك وتدريباتك عادي.'
const RATE_MESSAGE = 'استنى دقيقة قبل السؤال الجاي عشان المساعد يفضل متاح لكل الطلبة.'
const UNAVAILABLE_MESSAGE = 'المساعد مش متاح دلوقتي. جرّب بعد شوية، وماتعتمدش على إجابة مش متأكد منها.'
function reply(message: string, status = 503, code = 'HELPER_UNAVAILABLE') {
  return Response.json({ error: message, message, code }, { status, headers: { 'Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': code === 'HELPER_RATE_LIMIT' ? '60' : String(Math.ceil((Date.parse(new Date().toISOString().slice(0, 10)) + 86400000 - Date.now()) / 1000)) } : {}) } })
}
export function freePlanEnabled(env: Env): boolean {
  // Deployment is approved only on the verified Workers Free plan. No API
  // token or billing-management permissions are present in this Worker.
  return env.HELPER_ENABLED === 'true'
}
export class HelperLimits extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    if (!freePlanEnabled(this.env)) return reply(UNAVAILABLE_MESSAGE)
    const body = await request.json() as { messages: { role: string; content: string }[]; identity: string; ip: string }
    const now = Date.now(), day = new Date(now).toISOString().slice(0, 10)
    const decision = await this.ctx.storage.transaction(async storage => {
      const old = await storage.get<Meter>('meter')
      const meter = old?.day === day ? old : freshMeter(now)
      const user = await digest(meter.salt + ':' + body.identity), ip = await digest(meter.salt + ':' + body.ip)
      const result = reserve(meter, user, ip, now)
      if (result === 'ok') await storage.put('meter', meter)
      return { result, groqBlocked: meter.groqBlocked }
    })
    if (decision.result !== 'ok') return reply(decision.result === 'daily' ? DAILY_MESSAGE : RATE_MESSAGE, 429, decision.result === 'daily' ? 'HELPER_DAILY_LIMIT' : 'HELPER_RATE_LIMIT')
    // Requests remain reserved on abort/errors: an uncertain inference may have
    // consumed the shared account allocation. One primary attempt and one free
    // fallback share this reservation; no retry loop is allowed.
    try {
      let timer: ReturnType<typeof setTimeout> | undefined
      const inference = answerWithProviders(this.env, body.messages, decision.groqBlocked, async () => {
        await this.ctx.storage.transaction(async storage => {
          const meter = await storage.get<Meter>('meter')
          if (meter?.day === day) { meter.groqBlocked = true; await storage.put('meter', meter) }
        })
      })
      let output: unknown
      try { output = await Promise.race([inference, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('helper_timeout')), 25000) })]) }
      finally { clearTimeout(timer) }
      const text = extractAnswer(output)
      if (!text) return reply(UNAVAILABLE_MESSAGE)
      return Response.json({ text, provider: 'helper', model: 'learning-helper', isLocalFallback: false }, { headers: { 'Cache-Control': 'no-store' } })
    } catch (error) {
      // Inspect only to classify. Never log the prompt, response, IP or error.
      const code = error && typeof error === 'object' ? error as { status?: number; code?: number; message?: string } : {}
      if (code.status === 429 || code.code === 3036 || /3036|daily.*limit|neurons.*limit/i.test(code.message || '')) {
        await this.ctx.storage.transaction(async storage => {
          const meter = await storage.get<Meter>('meter')
          if (meter?.day === day) { meter.parked = true; await storage.put('meter', meter) }
        })
        return reply(DAILY_MESSAGE, 429, 'HELPER_DAILY_LIMIT')
      }
      return reply(UNAVAILABLE_MESSAGE)
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || ''
    const cors = (response: Response) => {
      const headers = new Headers(response.headers)
      if (ORIGINS.includes(origin)) headers.set('Access-Control-Allow-Origin', origin)
      headers.set('Vary', 'Origin'); headers.set('Cache-Control', 'no-store')
      return new Response(response.body, { status: response.status, headers })
    }
    if (!ORIGINS.includes(origin)) return cors(reply(UNAVAILABLE_MESSAGE, 403))
    if (request.method === 'OPTIONS') return cors(new Response(null, { status: 204, headers: { 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '600' } }))
    if (new URL(request.url).pathname !== '/api/helper/chat' || request.method !== 'POST') return cors(reply(UNAVAILABLE_MESSAGE, 404))
    if (!freePlanEnabled(env)) return cors(reply(UNAVAILABLE_MESSAGE))
    try {
      if (Number(request.headers.get('Content-Length') || 0) > 20000) return cors(reply('السؤال طويل زيادة. ابعت جزء أقصر.', 413, 'HELPER_INVALID_REQUEST'))
      const raw = await request.text()
      if (raw.length > 20000) return cors(reply('السؤال طويل زيادة. ابعت جزء أقصر.', 413, 'HELPER_INVALID_REQUEST'))
      const messages = prepareMessages(JSON.parse(raw))
      if (!messages) return cors(reply('اكتب سؤال إنجليزي قصير، بحد أقصى 1200 حرف.', 400, 'HELPER_INVALID_REQUEST'))
      const ip = request.headers.get('CF-Connecting-IP')
      if (!ip) return cors(reply(UNAVAILABLE_MESSAGE))
      let identity = 'guest:' + ip
      const bearer = /^Bearer (.{1,512})$/.exec(request.headers.get('Authorization') || '')
      if (bearer) {
        const session = await env.DB.prepare('SELECT user_id FROM sessions WHERE token_hash = ? AND expires_at > ?').bind(await digest(bearer[1]), new Date().toISOString()).first<{ user_id: number }>()
        if (session) identity = 'user:' + session.user_id
      }
      const stub = env.HELPER_LIMITS.get(env.HELPER_LIMITS.idFromName('henglish-global-v1'))
      // Identity is derived by the Worker, never trusted from user input. Raw
      // identity exists only in transit; the DO stores daily-salted hash counters.
      return cors(await stub.fetch(new Request('https://internal/reserve-and-answer', { method: 'POST', body: JSON.stringify({ messages, identity, ip }) })))
    } catch { return cors(reply(UNAVAILABLE_MESSAGE)) }
  },
}
