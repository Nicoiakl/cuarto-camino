import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { es } from 'date-fns/locale';

export function todayKey(date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDayLabel(isoOrKey: string): string {
  const d = isoOrKey.includes('T') ? parseISO(isoOrKey) : parseISO(`${isoOrKey}T12:00:00`);
  if (isToday(d)) return 'Hoy';
  if (isYesterday(d)) return 'Ayer';
  return format(d, "EEEE d 'de' MMMM", { locale: es });
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), 'HH:mm');
}

export function formatFriendlyDateTime(iso: string): string {
  const d = parseISO(iso);
  if (isToday(d)) return `Hoy · ${format(d, 'HH:mm')}`;
  if (isYesterday(d)) return `Ayer · ${format(d, 'HH:mm')}`;
  return format(d, "d MMM · HH:mm", { locale: es });
}
