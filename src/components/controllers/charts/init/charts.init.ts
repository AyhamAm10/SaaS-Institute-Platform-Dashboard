import { ReactNode } from 'react';

export interface BarChartDataPoint {
  label: string;
  value: number;
  highlight?: boolean;
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
    activePeriod: props.activePeriod ?? periods[1] ?? 'أسبوعي',
  };
}
