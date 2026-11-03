'use client';

import { useStore } from 'zustand';
import { useFamiliesStore } from './families.store';
import { FamiliesState } from '../state/families.state';

/**
 * Strongly typed Mirror hook for Families Controller.
 * Subscribes only to the requested slice of state using Zustand selectors.
 */
export function useFamiliesMirror<K extends keyof FamiliesState>(key: K): FamiliesState[K] {
  const store = useFamiliesStore();
  return useStore(store, (state) => state[key]);
}

/**
 * Selector-based Mirror hook for Families Controller.
 */
export function useFamiliesMirrorSelector<TSelected>(
  selector: (state: FamiliesState) => TSelected,
): TSelected {
  const store = useFamiliesStore();
  return useStore(store, selector);
}
