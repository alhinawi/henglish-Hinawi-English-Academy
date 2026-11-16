// ==============================================================================
// Henglish Academy (HENGLISH) - AI ENDPOINT AVAILABILITY
// Classifies /api/ai/* failures so the UI can show an honest unavailable state
// when no AI backend is deployed (static host SPA fallback answers 404/405/501
// or returns HTML), instead of technical errors or console spam.
// ==============================================================================

export class AiServiceUnavailableError extends Error {
  constructor() {
    super('AI_SERVICE_UNAVAILABLE');
    this.name = 'AiServiceUnavailableError';
  }
}

export function isAiServiceUnavailable(err: unknown): boolean {
  return err instanceof AiServiceUnavailableError;
}

/**
 * Validates /api/ai/* response availability. When the response is the static
 * host's SPA fallback (404/405/501 or a non-JSON body), throws
 * AiServiceUnavailableError; otherwise rethrows the server's real error.
 */
export async function throwForAiResponse(response: Response, fallbackMessage: string): Promise<void> {
  const contentType = response.headers.get('content-type') || '';
  if (response.ok && contentType.includes('application/json')) return;
  if (
    response.status === 404 ||
    response.status === 405 ||
    response.status === 501 ||
    !contentType.includes('application/json')
  ) {
    throw new AiServiceUnavailableError();
  }
  const data: { error?: string; message?: string } = await response.json().catch(() => ({}));
  throw new Error(data.error || data.message || fallbackMessage);
}

/**
 * True when a Response is the static host's SPA fallback (HTML, no AI backend).
 * For GET endpoints where the fallback answers 200 with index.html.
 */
export function isSpaFallbackResponse(response: Response): boolean {
  const contentType = response.headers.get('content-type') || '';
  return !contentType.includes('application/json');
}
