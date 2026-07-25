import i18n from '@/i18n';

export type QuoteTheme = 'recuerdo' | 'observacion' | 'aim' | 'centros' | 'trabajo';

export type Quote = {
  id: keyof typeof QUOTE_IDS;
  theme: QuoteTheme;
};

const QUOTE_IDS = {
  q1: true,
  q2: true,
  q3: true,
  q4: true,
  q5: true,
  q6: true,
  q7: true,
  q8: true,
  q9: true,
  q10: true,
  q11: true,
  q12: true,
} as const;

export const QUOTES: Quote[] = [
  { id: 'q1', theme: 'recuerdo' },
  { id: 'q2', theme: 'trabajo' },
  { id: 'q3', theme: 'observacion' },
  { id: 'q4', theme: 'observacion' },
  { id: 'q5', theme: 'aim' },
  { id: 'q6', theme: 'observacion' },
  { id: 'q7', theme: 'observacion' },
  { id: 'q8', theme: 'trabajo' },
  { id: 'q9', theme: 'centros' },
  { id: 'q10', theme: 'recuerdo' },
  { id: 'q11', theme: 'observacion' },
  { id: 'q12', theme: 'aim' },
];

export function quoteText(id: Quote['id']): string {
  return i18n.t(`quotes.items.${id}`);
}

export function quoteSource(): string {
  return i18n.t('quotes.source');
}

export function quoteThemeLabel(theme: QuoteTheme): string {
  return i18n.t(`quotes.themes.${theme}`);
}

export function quoteOfDay(date = new Date()): Quote {
  const day = Math.floor(date.getTime() / 86_400_000);
  return QUOTES[day % QUOTES.length];
}
