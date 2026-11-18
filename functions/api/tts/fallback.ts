// Explicit last resort. The shared service enforces the server text/voice allowlist,
// pool eligibility, cache, budgets and concurrency. Never expose its token to clients.
interface Env {
  AUDIO_FALLBACK_ENABLED?: string;
  AUDIO_FALLBACK_SERVICE_TOKEN?: string;
  AUDIO_FALLBACK?: {fetch(request: Request): Promise<Response>};
}
const unavailable = (code: string, status = 503) => Response.json({ok:false,code,retryable:false},{status,headers:{'Cache-Control':'no-store'}});
export async function onRequestPost({request,env}: {request:Request;env:Env}): Promise<Response> {
  if (env.AUDIO_FALLBACK_ENABLED !== 'true') return unavailable('disabled');
  if (!env.AUDIO_FALLBACK || !env.AUDIO_FALLBACK_SERVICE_TOKEN) return unavailable('disabled');
  try {
    const origin = request.headers.get('Origin');
    if (origin && origin !== new URL(request.url).origin) return unavailable('site_not_allowed',403);
    const body = await request.json() as {text?:unknown;fallbackReason?:unknown;accent?:unknown;gender?:unknown};
    const voices = {'US-female':'EXAVITQu4vr4xnSDxMaL','US-male':'CwhRBWXzGAHq8TQ4Fs17','UK-female':'Xb7hH8MSUJpSbSDYk0k2','UK-male':'JBFqnCBsd6RMkjVDRZzb'};
    const profile = `${body.accent === 'UK' ? 'UK' : 'US'}-${body.gender === 'male' ? 'male' : 'female'}` as keyof typeof voices;
    if (typeof body.text !== 'string' || !body.text.trim() || body.text.length > 1000 || !['free_unavailable','free_playback_error','free_start_timeout'].includes(String(body.fallbackReason))) return unavailable('invalid_request',400);
    const controller = new AbortController();
    const timer = setTimeout(()=>controller.abort(),15000);
    request.signal.addEventListener('abort',()=>controller.abort(),{once:true});
    try {
      if (request.signal.aborted) return unavailable('cancelled',499);
      const response = await env.AUDIO_FALLBACK.fetch(new Request('https://audio-fallback.internal/v1/speech',{
        method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json','Authorization':'Bearer '+env.AUDIO_FALLBACK_SERVICE_TOKEN,'X-Audio-Site':'henglish'},
        body:JSON.stringify({text:body.text.normalize('NFC').trim().replace(/\s+/g,' '),language:'en',voice:voices[profile],fallbackReason:body.fallbackReason}),
      }));
      if (!response.ok) return unavailable('fallback_unavailable',response.status);
      if (!response.headers.get('Content-Type')?.startsWith('audio/mpeg')) return unavailable('ambiguous_result',502);
      return new Response(response.body,{headers:{'Content-Type':'audio/mpeg','Cache-Control':'private, no-store','X-Audio-Cache':response.headers.get('X-Audio-Cache')==='HIT'?'HIT':'MISS'}});
    } finally {clearTimeout(timer);}
  } catch { return unavailable('fallback_unavailable',502); }
}
