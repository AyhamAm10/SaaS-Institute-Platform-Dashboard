/** Arabic count phrase for weekly periods: حصة / حصتان / 3 حصص / 11 حصة. */
export function formatWeeklyPeriods(count: number): string {
  if (count === 1) return 'حصة واحدة';
  if (count === 2) return 'حصتان';
  if (count >= 3 && count <= 10) return `${count} حصص`;
  return `${count} حصة`;
}
