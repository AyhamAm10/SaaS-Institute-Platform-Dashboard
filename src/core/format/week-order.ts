/**
 * Week order used across the dashboard: the week starts on Saturday.
 * Day values follow JS/backend convention (0 = Sunday … 6 = Saturday).
 */
export const WEEK_ORDER: readonly number[] = [6, 0, 1, 2, 3, 4, 5];

/** Sorts day-of-week values in week order (Saturday first). */
export function sortWeekDays(days: readonly number[]): number[] {
  return [...days].sort((a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b));
}
