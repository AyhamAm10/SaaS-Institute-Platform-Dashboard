import type { BadgeTone } from '@/src/components/controllers';
import { supervisionLabels as labels } from '../static-data/supervision.data';

/** Days from `from` to `to` (both YYYY-MM-DD, whole days, calendar dates without a time zone). */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** "اليوم" / "غداً" next to the date of an exam, relative to the institute's today (none further away). */
export function dayBadge(examDate: string, today: string): { label: string; tone: BadgeTone } | null {
  if (!today) return null;
  const days = daysBetween(today, examDate);
  if (days === 0) return { label: labels.today, tone: 'danger' };
  if (days === 1) return { label: labels.tomorrow, tone: 'warning' };
  return null;
}
