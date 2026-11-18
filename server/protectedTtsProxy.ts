// All hosting adapters delegate to the same manifest-gated, durable Worker.
// No hosting-platform API key or provider fallback is used here.
export const PROTECTED_TTS_URL = 'https://henglish-api.hnz.workers.dev/api/tts/synthesize';
export async function protectedTtsProxy(body: string): Promise<Response> {
  if (body.length > 24000) return Response.json({ error: 'too_large' }, { status: 413 });
  try {
    const response = await fetch(PROTECTED_TTS_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body,
      signal: AbortSignal.timeout(55000),
    });
    // The upstream only returns generic errors. Never expose provider bodies or keys.
    return new Response(await response.arrayBuffer(), { status: response.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'tts_unavailable' }, { status: 503 });
  }
}
