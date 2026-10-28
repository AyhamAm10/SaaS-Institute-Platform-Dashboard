import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { StatsState, createInitialStatsState } from '../state/stats.state';
import { StatCardProps, resolveStatCardConfig } from '../init/stats.init';

export type StatsStore = ControllerStoreApi<StatsState>;

export function createStatsStore(props: StatCardProps): StatsStore {
  const config = resolveStatCardConfig(props);
  const initial = createInitialStatsState(config.variant);

  return createControllerStore<StatsState>((set) => ({
    ...initial,
    setIsHovered: (isHovered: boolean) => set({ isHovered }),
  }));
}

export const StatsContext = createContext<StatsStore | null>(null);

export function useStatsStoreContext(): StatsStore {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('StatCard subcomponents must be rendered within a <StatCard> provider');
  }
  return context;
}
