import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { ChartsState, createInitialChartsState } from '../state/charts.state';
import { ChartCardProps } from '../init/charts.init';

export type ChartsStore = ControllerStoreApi<ChartsState>;

export function createChartsStore(props: ChartCardProps): ChartsStore {
  const initial = createInitialChartsState(props);

  return createControllerStore<ChartsState>((set, get) => ({
    ...initial,
    setActivePeriod: (period: string) => {
      set({ activePeriod: period });
      get().rawProps.onPeriodChange?.(period);
    },
  }));
}

export const ChartsContext = createContext<ChartsStore | null>(null);

export function useChartsStoreContext(): ChartsStore {
  const context = useContext(ChartsContext);
  if (!context) {
    throw new Error('ChartCard subcomponents must be rendered within a <ChartCard> provider');
  }
  return context;
}
