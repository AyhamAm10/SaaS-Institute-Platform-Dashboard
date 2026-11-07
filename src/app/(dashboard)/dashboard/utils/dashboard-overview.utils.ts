import type { BarChartDataPoint, CircleChartSegment } from '@/src/components/controllers/charts/init/charts.init';
import type { Currency, DashboardOverview } from '@/src/core/api';
import { formatMoney } from '@/src/core/format';
import { NUMBER_LOCALE } from '@/src/theme/typography';
import { overviewLabels as labels } from '../static-data/dashboard-overview.data';

/**
 * Pure mapping of GET /dashboard/overview to the chart / card models.
 * No fetching, no state: tested in __tests__.
 */

/** Short Arabic weekday names, JS order (0 = Sunday). */
export const WEEKDAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export const CURRENCY_NAMES: Record<Currency, string> = { SYP: 'الليرة السورية', USD: 'الدولار' };

const monthFormatter = new Intl.DateTimeFormat(NUMBER_LOCALE, { month: 'long', timeZone: 'UTC' });
const compactFormatter = new Intl.NumberFormat(NUMBER_LOCALE, { notation: 'compact', maximumFractionDigits: 1 });

/** `YYYY-MM` → local month name (e.g. "تشرين الثاني"). */
export function monthName(month: string): string {
  return monthFormatter.format(new Date(`${month}-01T00:00:00.000Z`));
}

/** Big KPI figure: 1,075,000 → "1.1 مليون" (full value goes in the subtitle). */
export function compactNumber(value: number): string {
  return compactFormatter.format(value);
}

export function percentText(value: number | null): string {
  return value === null ? '—' : `${value}%`;
}

/**
 * Attendance rate of the last working days (bar per day, 0 when nothing
 * recorded). Labels carry the day of month: 7 working days can contain the
 * same weekday twice, and the chart keys its bars by label.
 */
export function weekBars(week: DashboardOverview['attendance']['week']): BarChartDataPoint[] {
  return week.map((day) => {
    const label = `${WEEKDAYS[day.dayOfWeek]} ${Number(day.date.slice(8, 10))}`;
    return {
      label,
      value: day.rate ?? 0,
      tooltipBadge:
        day.recorded > 0
          ? `${label} · ${day.rate}% (${day.attended} ${labels.of} ${day.recorded})`
          : `${label} · ${labels.noRecords}`,
    };
  });
}

/**
 * Today's statuses as circle segments, fixed order, coloured with the same
 * semantic tones as the attendance badges (theme palette: "yellow" is the
 * brand orange and "blue" is slate, so semantic names are used instead).
 */
export function todaySegments(today: DashboardOverview['attendance']['today']): CircleChartSegment[] {
  return [
    { label: labels.status.present, value: today.present, color: 'var(--mantine-color-success-6)' },
    { label: labels.status.late, value: today.late, color: 'var(--mantine-color-brand-5)' },
    { label: labels.status.absent, value: today.absent, color: 'var(--mantine-color-danger-5)' },
    { label: labels.status.excused, value: today.excused, color: 'var(--mantine-color-info-5)' },
    { label: labels.status.notRecorded, value: today.notRecorded, color: 'var(--app-border-hover)' },
  ];
}

/**
 * Segments worth drawing: a zero-length round-capped arc still paints a dot,
 * so empty segments are left out (an empty list means "nothing to show").
 */
export function nonEmptySegments(segments: CircleChartSegment[]): CircleChartSegment[] {
  return segments.filter((s) => s.value > 0);
}

/** Monthly collections: one dataset per currency (chart tabs), never mixed. */
export function collectionDatasets(
  monthly: DashboardOverview['finance']['monthly'],
): Record<string, BarChartDataPoint[]> {
  const datasets: Record<string, BarChartDataPoint[]> = {};
  for (const row of monthly) {
    const key = CURRENCY_NAMES[row.currency];
    (datasets[key] ??= []).push({
      label: monthName(row.month),
      value: row.amount,
      tooltipBadge: `${monthName(row.month)} · ${formatMoney(row.amount, row.currency)}`,
    });
  }
  return datasets;
}

/** Overdue KPI: the first currency as the figure, every currency in the subtitle. */
export function overdueSummary(currencies: DashboardOverview['finance']['currencies']) {
  const withOverdue = currencies.filter((c) => c.overdue > 0);
  const main = withOverdue[0] ?? currencies[0] ?? null;
  return {
    figure: main ? `${compactNumber(main.overdue)} ${main.currency === 'USD' ? '$' : 'ل.س'}` : '0',
    details: currencies.map((c) => formatMoney(c.overdue, c.currency)).join(' · '),
    installments: currencies.reduce((sum, c) => sum + c.overdueInstallments, 0),
  };
}
