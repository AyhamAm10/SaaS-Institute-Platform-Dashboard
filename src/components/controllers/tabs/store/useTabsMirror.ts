import { useStore } from 'zustand';
import { useTabsStore } from './tabs.store';
import { TabsState } from '../state/tabs.state';

export function useTabsMirror<K extends keyof TabsState>(key: K): TabsState[K] {
  const store = useTabsStore();
  return useStore(store, (state) => state[key]);
}

export function useTabsMirrorSelector<T>(selector: (state: TabsState) => T): T {
  const store = useTabsStore();
  return useStore(store, selector);
}
