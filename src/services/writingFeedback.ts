// Accept real feedback only. Empty/malformed successful HTTP responses are not analyses.
export function writingFeedback(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const payload = data as Record<string, unknown>;
  for (const candidate of [payload.text, payload.response]) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }
  return null;
}
