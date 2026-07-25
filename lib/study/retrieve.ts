import { getCorpus } from './corpus';
import type { StudyChunk } from './types';

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

function tokens(s: string): string[] {
  return normalize(s)
    .split(/[^a-z0-9]+/i)
    .filter((w) => w.length > 2);
}

/** Simple lexical retrieval over the local corpus. */
export function retrieveChunks(query: string, limit = 4): StudyChunk[] {
  const qTokens = [...new Set(tokens(query))];
  if (qTokens.length === 0) {
    const all = getCorpus().chunks;
    const i = Math.floor(Date.now() / 86_400_000) % all.length;
    return [all[i]];
  }

  const scored = getCorpus().chunks.map((chunk) => {
    const hay = normalize(chunk.text);
    let score = 0;
    for (const t of qTokens) {
      if (hay.includes(t)) score += 2;
      // light bonus for title/author match
      if (normalize(chunk.title).includes(t)) score += 1;
    }
    // prefer denser short matches
    if (score > 0) score += Math.min(chunk.text.length, 800) / 800;
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.chunk);
}

export function dailyPassage(): StudyChunk {
  const all = getCorpus().chunks;
  const day = Math.floor(Date.now() / 86_400_000);
  return all[day % all.length];
}
