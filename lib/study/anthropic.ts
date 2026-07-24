import { buildSystemPrompt, formatContext } from './prompt';
import type { ChatMessage, StudyChunk } from './types';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

export async function askAnthropic(options: {
  apiKey: string;
  lang: string;
  history: ChatMessage[];
  userText: string;
  chunks: StudyChunk[];
}): Promise<string> {
  const { apiKey, lang, history, userText, chunks } = options;

  const system = `${buildSystemPrompt(lang)}

Context passages from the student's study library:
${formatContext(chunks)}`;

  const messages = [
    ...history.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    {
      role: 'user' as const,
      content: userText,
    },
  ];

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 700,
      system,
      messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 401) {
      throw new Error('INVALID_API_KEY');
    }
    throw new Error(errText.slice(0, 240) || `HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = data.content?.find((c) => c.type === 'text')?.text?.trim();
  if (!text) throw new Error('EMPTY_RESPONSE');
  return text;
}
