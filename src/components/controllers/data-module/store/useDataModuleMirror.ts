'use client';

import { useStore } from 'zustand';
import { useDataModuleStore } from './data-module.store';
import { DataModuleState } from '../state/data-module.state';

/**
 * Strongly typed Mirror hook for DataModuleController.
 * Subscribes to a single key in the isolated store with selective re-rendering.
 */
export function useDataModuleMirror<K extends keyof DataModuleState<unknown>>(
  key: K,
): DataModuleState<unknown>[K] {
  const store = useDataModuleStore();
  return useStore(store, (state) => state[key]);
}

/**
 * Selector-based Mirror hook for DataModuleController.
 */
export function useDataModuleMirrorSelector<TSelected>(
  selector: (state: DataModuleState<unknown>) => TSelected,
): TSelected {
  const store = useDataModuleStore();
  return useStore(store, selector);
}

/**
 * Mirror registry accessor returning the entire mirror state.
 */
export function useDataModuleMirrorRegistry<T = unknown>(): DataModuleState<T> {
  const store = useDataModuleStore<T>();
  return useStore(store, (state) => state);
}
