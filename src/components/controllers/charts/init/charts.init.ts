import { ReactNode } from 'react';

export interface BarChartDataPoint {
  label: string;
  value: number;
  /** Marks the bar selected by default (otherwise the peak value is selected). */
  highlight?: boolean;
  /** Custom tooltip text; defaults to "label · value+unit". */
  tooltipBadge?: string;
  secondaryValue?: number;
}

export interface CircleChartSegment {
  label: string;
  value: number;
  color?: string;
}

export interface ChartCardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  periods?: string[];
  activePeriod?: string;
  onPeriodChange?: (period: string) => void;
  className?: string;
}

export interface ResolvedChartConfig {
  periods: string[];
  activePeriod: string;
}

export function resolveChartConfig(props: ChartCardProps): ResolvedChartConfig {
  const periods = props.periods ?? ['يومي', 'أسبوعي', 'شهري'];
  return {
    periods,
    activePeriod: props.activePeriod ?? periods[1] ?? periods[0] ?? 'أسبوعي',
  };
}

/** Index of the bar selected by default: explicit highlight first, else the peak value. */
export function resolveDefaultBarIndex(data: BarChartDataPoint[]): number {
  if (data.length === 0) return -1;
  const highlighted = data.findIndex((d) => d.highlight);
  if (highlighted >= 0) return highlighted;
  return data.reduce((best, d, i) => (d.value > data[best].value ? i : best), 0);
}

/** Rounds the axis maximum up to a "nice" number so four equal ticks stay readable. */
export function resolveAxisMax(values: number[], minimum = 0): number {
  const peak = Math.max(minimum, ...values, 1);
  const magnitude = 10 ** Math.floor(Math.log10(peak));
  const steps = [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10];
  const step = steps.find((s) => s * magnitude >= peak) ?? 10;
  return step * magnitude;
}
