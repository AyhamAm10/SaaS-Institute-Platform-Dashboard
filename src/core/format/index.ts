import { NUMBER_LOCALE } from '@/src/theme/typography';

const numberFormatter = new Intl.NumberFormat(NUMBER_LOCALE);

const dateFormatter = new Intl.DateTimeFormat(NUMBER_LOCALE, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  calendar: 'gregory',
});

const longDateFormatter = new Intl.DateTimeFormat(NUMBER_LOCALE, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  calendar: 'gregory',
});

/** Formats a number with Latin digits and Arabic grouping, e.g. 2480 -> "2,480". */
export function formatNumber(value: number | string | null | undefined): string {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? numberFormatter.format(n) : '—';
}

/** Formats a date as YYYY/MM/DD with Latin digits (Gregorian). */
export function formatDate(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  const parts = Object.fromEntries(dateFormatter.formatToParts(date).map((p) => [p.type, p.value]));
  return `${parts.year}/${parts.month}/${parts.day}`;
}

/** Formats a date with the Arabic month name, e.g. "25 أكتوبر 2026". */
export function formatLongDate(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : longDateFormatter.format(date);
}
