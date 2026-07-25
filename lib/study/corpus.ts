import type { StudyCorpus } from './types';

// Metro resolver falls back to seed.json if chunks.json is absent.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const corpus = require('../../assets/corpus/chunks.json') as StudyCorpus;

export function getCorpus(): StudyCorpus {
  return corpus;
}

export function corpusSummary(): string {
  const c = getCorpus();
  const books = c.books.map((b) => `${b.author}: ${b.title}`).join(' · ');
  return `${c.count} pasajes · ${books}`;
}
