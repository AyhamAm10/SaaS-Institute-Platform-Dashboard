import { ControllerState } from '@/src/core/mirror';
import { ChartCardProps, resolveChartConfig } from '../init/charts.init';

export interface ChartsState extends ControllerState {
  activePeriod: string;
  periods: string[];
  setActivePeriod: (period: string) => void;
  rawProps: ChartCardProps;
}

export function createInitialChartsState(props: ChartCardProps): ChartsState {
  const config = resolveChartConfig(props);
  return {
    activePeriod: config.activePeriod,
    periods: config.periods,
    setActivePeriod: () => {},
    rawProps: props,
  };
}
