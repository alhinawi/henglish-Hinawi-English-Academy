// Fetch chunks can end anywhere, including inside JSON or a UTF-8 character.
// Retain unfinished SSE lines instead of dropping partial response content.
export async function readTutorStream(
  stream: ReadableStream<Uint8Array>,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<{ text: string; metadata: Record<string, unknown> }> {
  const reader = stream.getReader();
  const decoder = new TextDecoder('utf-8');
  let pending = '';
  let text = '';
  let event = '';
  let metadata: Record<string, unknown> = {};
  const consume = (line: string) => {
    if (!line) { event = ''; return; }
    if (line.startsWith('event:')) { event = line.slice(6).trim(); return; }
    if (!line.startsWith('data:')) return;
    const data = line.slice(5).trim();
    if (!data || data === '[DONE]') return;
    let parsed: Record<string, unknown>;
    try {
      const value: unknown = JSON.parse(data);
      if (!value || typeof value !== 'object' || Array.isArray(value)) return;
      parsed = value as Record<string, unknown>;
    } catch { return; }
    if (event === 'error') throw new Error(typeof parsed.error === 'string' ? parsed.error : 'Tutor stream failed');
    if (event === 'done') {
      metadata = { ...metadata, ...parsed };
      if (typeof parsed.text === 'string') {
        // The done event contains the full answer, not another token.
        if (parsed.text.startsWith(text) && parsed.text.length > text.length) onChunk(parsed.text.slice(text.length));
        text = parsed.text;
      }
      return;
    }
    if (typeof parsed.text === 'string') {
      text += parsed.text;
      onChunk(parsed.text);
    }
    if (typeof parsed.provider === 'string' || typeof parsed.model === 'string' || Array.isArray(parsed.corrections)) {
      metadata = { ...metadata, ...parsed };
    }
  };
  // Abort must wake a pending read too, not only be checked between chunks.
  const cancelPendingRead = () => { void reader.cancel().catch(() => {}); };
  signal?.addEventListener('abort', cancelPendingRead, { once: true });
  try {
    while (true) {
      if (signal?.aborted) throw new DOMException('Request aborted', 'AbortError');
      const { done, value } = await reader.read();
      if (signal?.aborted) throw new DOMException('Request aborted', 'AbortError');
      pending += done ? decoder.decode() : decoder.decode(value, { stream: true });
      let newline: number;
      while ((newline = pending.indexOf('\n')) >= 0) {
        consume(pending.slice(0, newline).replace(/\r$/, ''));
        pending = pending.slice(newline + 1);
      }
      if (done) {
        if (pending) consume(pending.replace(/\r$/, ''));
        return { text, metadata };
      }
    }
  } finally {
    signal?.removeEventListener('abort', cancelPendingRead);
    reader.releaseLock();
  }
}
