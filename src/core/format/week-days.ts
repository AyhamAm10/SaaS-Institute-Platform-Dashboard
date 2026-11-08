import { WEEK_ORDER } from './week-order';

/** Arabic day names by day-of-week value (0 = Sunday … 6 = Saturday). */
export const WEEK_DAY_NAMES: Record<number, string> = {
  0: 'الأحد',
  1: 'الإثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
};

/** Day name of a day-of-week value, with a fallback for unknown values. */
export function weekDayName(day: number): string {
  return WEEK_DAY_NAMES[day] ?? `يوم ${day}`;
}

/** Select options for a day picker, in week order (values are strings). */
export const WEEK_DAY_OPTIONS = WEEK_ORDER.map((d) => ({ value: String(d), label: WEEK_DAY_NAMES[d] }));
