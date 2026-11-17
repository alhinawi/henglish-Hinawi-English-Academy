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
  let metadata: Record<string, unknown> = {};
  const consume = (line: string) => {
    if (!line.startsWith('data:')) return;
    const data = line.slice(5).trim();
    if (!data || data === '[DONE]') return;
    let parsed: Record<string, unknown>;
    try {
      const value: unknown = JSON.parse(data);
      if (!value || typeof value !== 'object' || Array.isArray(value)) return;
      parsed = value as Record<string, unknown>;
    } catch { return; }
    if (typeof parsed.text === 'string') {
      text += parsed.text;
      onChunk(parsed.text);
    }
    if (typeof parsed.provider === 'string' || typeof parsed.model === 'string' || Array.isArray(parsed.corrections)) {
      metadata = { ...metadata, ...parsed };
    }
  };
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
    reader.releaseLock();
  }
}
