export type StudyChunk = {
  id: string;
  bookId: string;
  title: string;
  author: string;
  index: number;
  text: string;
};

export type StudyCorpus = {
  version: number;
  count: number;
  books: { id: string; title: string; author: string }[];
  chunks: StudyChunk[];
};

export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  id: string;
  role: Exclude<ChatRole, 'system'>;
  content: string;
  sources?: { title: string; author: string; excerpt: string }[];
};

export type StudyMode = 'chat' | 'daily' | 'fromObservation';
