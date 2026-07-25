#!/usr/bin/env node
/**
 * Builds a searchable chunk index from private/corpus/*.txt
 * Output: assets/corpus/chunks.json (gitignored — for personal study on device)
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'private', 'corpus');
const OUT_DIR = path.join(ROOT, 'assets', 'corpus');
const OUT = path.join(OUT_DIR, 'chunks.json');

const BOOKS = [
  {
    match: /Fragmentos|Ouspensky/i,
    id: 'ouspensky-fragmentos',
    title: 'Fragmentos de una enseñanza desconocida',
    author: 'P. D. Ouspensky',
  },
  {
    match: /Perspectivas|mundo real/i,
    id: 'gurdjieff-perspectivas',
    title: 'Perspectivas desde el mundo real',
    author: 'G. I. Gurdjieff',
  },
  {
    match: /vida.es.real|yo.soy/i,
    id: 'gurdjieff-vida-real',
    title: 'La vida es real sólo cuando «Yo soy»',
    author: 'G. I. Gurdjieff',
  },
  {
    match: /mensajero|bien venidero/i,
    id: 'gurdjieff-mensajero',
    title: 'El mensajero del bien venidero',
    author: 'G. I. Gurdjieff',
  },
];

function clean(text) {
  return text
    .replace(/\f/g, '\n')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function chunkText(text, size = 900, overlap = 120) {
  const parts = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + size, text.length);
    if (end < text.length) {
      const slice = text.slice(i, end);
      const lastStop = Math.max(
        slice.lastIndexOf('. '),
        slice.lastIndexOf('.\n'),
        slice.lastIndexOf('? '),
        slice.lastIndexOf('!\n'),
      );
      if (lastStop > size * 0.5) end = i + lastStop + 1;
    }
    const body = text.slice(i, end).trim();
    if (body.length > 80) parts.push(body);
    if (end >= text.length) break;
    i = Math.max(end - overlap, i + 1);
  }
  return parts;
}

function tokenize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/[^a-z0-9áéíóúñü]+/i)
    .filter((w) => w.length > 2);
}

const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.txt'));
const chunks = [];

for (const file of files) {
  const meta = BOOKS.find((b) => b.match.test(file));
  if (!meta) {
    console.warn('No book meta for', file);
    continue;
  }
  const raw = clean(fs.readFileSync(path.join(SRC, file), 'utf8'));
  const parts = chunkText(raw);
  parts.forEach((text, idx) => {
    chunks.push({
      id: `${meta.id}-${idx}`,
      bookId: meta.id,
      title: meta.title,
      author: meta.author,
      index: idx,
      text,
    });
  });
  console.log(`${meta.title}: ${parts.length} chunks`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  OUT,
  JSON.stringify({
    version: 1,
    builtAt: new Date().toISOString(),
    count: chunks.length,
    books: BOOKS.map(({ id, title, author }) => ({ id, title, author })),
    chunks,
  }),
);

const mb = (fs.statSync(OUT).size / (1024 * 1024)).toFixed(2);
console.log(`Wrote ${chunks.length} chunks → ${OUT} (${mb} MB)`);
