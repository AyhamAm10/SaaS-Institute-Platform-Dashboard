import { useStore } from 'zustand';
import { useStatsStoreContext } from './stats.store';
import { StatsState } from '../state/stats.state';

export function useStatsMirror<K extends keyof StatsState>(key: K): StatsState[K] {
  const store = useStatsStoreContext();
  return useStore(store, (state) => state[key]);
}

export function useStatsMirrorSelector<T>(selector: (state: StatsState) => T): T {
  const store = useStatsStoreContext();
  return useStore(store, selector);
}
