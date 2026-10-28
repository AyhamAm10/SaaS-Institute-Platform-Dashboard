import { useStore } from 'zustand';
import { useChartsStoreContext } from './charts.store';
import { ChartsState } from '../state/charts.state';

export function useChartsMirror<K extends keyof ChartsState>(key: K): ChartsState[K] {
  const store = useChartsStoreContext();
  return useStore(store, (state) => state[key]);
}

export function useChartsMirrorSelector<T>(selector: (state: ChartsState) => T): T {
  const store = useChartsStoreContext();
  return useStore(store, selector);
}
