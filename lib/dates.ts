import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { de, enUS, es, fr, it, pt } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import i18n from '@/i18n';

const LOCALE_MAP: Record<string, Locale> = {
  en: enUS,
  es,
  fr,
  pt,
  de,
  it,
};

function dateLocale(): Locale {
  return LOCALE_MAP[i18n.language] ?? enUS;
}

export function todayKey(date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDayLabel(isoOrKey: string): string {
  const d = isoOrKey.includes('T')
    ? parseISO(isoOrKey)
    : parseISO(`${isoOrKey}T12:00:00`);
  if (isToday(d)) return i18n.t('dates.today');
  if (isYesterday(d)) return i18n.t('dates.yesterday');
  return format(d, 'EEEE d MMMM', { locale: dateLocale() });
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), 'HH:mm');
}

export function formatFriendlyDateTime(iso: string): string {
  const d = parseISO(iso);
  const time = format(d, 'HH:mm');
  if (isToday(d)) return `${i18n.t('dates.today')} · ${time}`;
  if (isYesterday(d)) return `${i18n.t('dates.yesterday')} · ${time}`;
  return format(d, 'd MMM · HH:mm', { locale: dateLocale() });
}
