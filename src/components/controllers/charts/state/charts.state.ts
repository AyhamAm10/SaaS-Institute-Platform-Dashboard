import { ControllerState } from '@/src/core/mirror';
import { ChartCardProps, resolveChartConfig } from '../init/charts.init';

export interface ChartsState extends ControllerState {
  activePeriod: string;
  periods: string[];
  /** Bar under the pointer (null when none). */
  hoveredIndex: number | null;
  /** Bar the user clicked; null means "use the dataset default". */
  selectedIndex: number | null;

  setActivePeriod: (period: string) => void;
  setHoveredIndex: (index: number | null) => void;
  setSelectedIndex: (index: number | null) => void;
  rawProps: ChartCardProps;
}

export function createInitialChartsState(props: ChartCardProps): ChartsState {
  const config = resolveChartConfig(props);
  return {
    activePeriod: config.activePeriod,
    periods: config.periods,
    hoveredIndex: null,
    selectedIndex: null,
    setActivePeriod: () => {},
    setHoveredIndex: () => {},
    setSelectedIndex: () => {},
    rawProps: props,
  };
}
