import type { IncomingMessage, ServerResponse } from 'node:http';
import dns from 'node:dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

interface ChatRequestBody {
  mode?: string;
  userLevel?: string;
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

async function parseBody(req: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown>> {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
    if (typeof req.body === 'object' && req.body !== null) {
      return req.body as Record<string, unknown>;
    }
  }

  return new Promise(resolve => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1024 * 1024) resolve({});
    });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

function formatGeminiContents(
  history: { role: 'user' | 'assistant'; content: string }[] | undefined,
  currentMessage: string
): Array<{ role: 'user' | 'model'; parts: { text: string }[] }> {
  const contents: Array<{ role: 'user' | 'model'; parts: { text: string }[] }> = [];

  if (history && history.length > 0) {
    for (const h of history.slice(-10)) {
      if (!h.content || !h.content.trim()) continue;
      const role = h.role === 'user' ? 'user' : 'model';

      if (contents.length === 0 && role === 'model') {
        continue;
      }

      const last = contents[contents.length - 1];
      if (last && last.role === role) {
        last.parts[0].text += '\n\n' + h.content;
      } else {
        contents.push({ role, parts: [{ text: h.content }] });
      }
    }
  }

  const last = contents[contents.length - 1];
  if (last && last.role === 'user') {
    last.parts[0].text += '\n\n' + currentMessage;
  } else {
    contents.push({
      role: 'user',
      parts: [{ text: currentMessage }],
    });
  }

  return contents;
}

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = (await parseBody(req)) as unknown as ChatRequestBody;
    if (!body || !body.message) {
      sendJson(res, 400, { error: 'Missing required field: message' });
      return;
    }

    const env = process.env;
    const geminiKey = env.GEMINI_API_KEY || '';
    const mode = body.mode || 'grammar-teacher';
    const userLevel = body.userLevel || 'B1';

    const systemPrompt = `You are the Henglish Academy AI Tutor (mode: ${mode}, student level: ${userLevel}).
Speak warmly with helpful Egyptian Arabic pedagogical explanations when explaining concepts.
Always be encouraging, provide clear English examples, and highlight common traps.`;

    if (geminiKey && geminiKey !== 'your_ai_api_key_here') {
      const contents = formatGeminiContents(body.history, body.message);
      const candidateModels = [
        env.AI_MODEL || 'gemini-flash-lite-latest',
        'gemini-flash-lite-latest',
        'gemini-2.5-flash',
        'gemini-1.5-flash',
      ];
      const models = [...new Set(candidateModels.filter(Boolean))];

      for (const modelName of models) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 25000);
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`;

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
              },
            }),
          });

          clearTimeout(timer);

          if (response.ok) {
            const data = (await response.json()) as {
              candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
            };
            const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (candidateText) {
              sendJson(res, 200, {
                text: candidateText,
                provider: 'gemini',
                model: modelName,
                isLocalFallback: false,
              });
              return;
            }
          }
        } catch (err) {
          console.warn(`Gemini call to ${modelName} failed:`, err);
        }
      }
    }

    // Default friendly educational response if key is missing or calls fail
    sendJson(res, 200, {
      text: `أهلاً بك في أكاديمية هناوي للغة الإنجليزية! 🦅\nأنا معلمك الذكي لمستوى **${userLevel}**.\n\nيسعدني جداً مساعدتك في فهم أي قاعدة، ممارسة المحادثات، أو مراجعة نصوصك!`,
      provider: 'henglisheducational-brain',
      model: 'henglisheducational-brain',
      isLocalFallback: true,
    });
  } catch (err) {
    console.error('API /api/ai/chat error:', err);
    sendJson(res, 500, { error: 'Internal AI service error', message: String(err) });
  }
}
