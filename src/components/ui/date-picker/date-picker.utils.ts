/**
 * Date Picker pure helpers and Arabic localization utilities.
 */

export const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export const ARABIC_DAYS_SHORT = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];

/**
 * Format a Date object to standard ISO date format YYYY-MM-DD.
 */
export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse an ISO date string (YYYY-MM-DD) into a local Date object.
 */
export function parseISODate(isoStr: string | null | undefined): Date | null {
  if (!isoStr) return null;
  const parts = isoStr.split('T')[0]?.split('-');
  if (!parts || parts.length < 3) return null;
  const y = parseInt(parts[0]!, 10);
  const m = parseInt(parts[1]!, 10) - 1;
  const d = parseInt(parts[2]!, 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return new Date(y, m, d);
}

/**
 * Format a date for user-facing display with Arabic month name.
 * e.g., "1 سبتمبر 2027" (with YYYY-MM-DD fallback)
 */
export function formatDisplayDate(date: Date | null): string {
  if (!date || isNaN(date.getTime())) return '';
  const d = date.getDate();
  const monthName = ARABIC_MONTHS[date.getMonth()] ?? '';
  const y = date.getFullYear();
  return `${d} ${monthName} ${y}`;
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isoString: string;
}

/**
 * Generate a standard 42-cell calendar grid for a given year and month.
 */
export function generateMonthGrid(
  year: number,
  month: number,
): CalendarDay[] {
  const today = new Date();
  const todayStr = formatDateToISO(today);

  // First day of target month
  const firstDay = new Date(year, month, 1);
  const startDayOfWeek = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)

  // Total days in target month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const grid: CalendarDay[] = [];

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const date = new Date(year, month - 1, d);
    const isoString = formatDateToISO(date);
    grid.push({
      date,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: isoString === todayStr,
      isoString,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isoString = formatDateToISO(date);
    grid.push({
      date,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: isoString === todayStr,
      isoString,
    });
  }

  // Next month leading days to complete 35 or 42 cells
  const remainingCells = grid.length <= 35 ? 35 - grid.length : 42 - grid.length;
  for (let d = 1; d <= remainingCells; d++) {
    const date = new Date(year, month + 1, d);
    const isoString = formatDateToISO(date);
    grid.push({
      date,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: isoString === todayStr,
      isoString,
    });
  }

  return grid;
}
