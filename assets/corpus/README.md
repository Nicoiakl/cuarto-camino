# Corpus de estudio (personal)

Los PDFs y el índice `chunks.json` **no se suben al repositorio** (copyright / uso personal).

## Cómo generar el índice completo

1. Coloca los PDF en `private/pdfs/`
2. Extrae texto (ej. `pdftotext`) a `private/corpus/*.txt`
3. Ejecuta:

```bash
node scripts/build-corpus.mjs
```

Eso crea `assets/corpus/chunks.json` para búsqueda y conversación en el dispositivo.

Sin ese archivo, la app usa `seed.json` (notas de estudio originales).
