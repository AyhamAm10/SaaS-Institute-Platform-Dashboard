'use client';

import { useStore } from 'zustand';
import { useInstitutesStore } from './institutes.store';
import { InstitutesState } from '../state/institutes.state';

/**
 * Strongly typed Mirror hook for Institutes Controller.
 * Subscribes only to the requested slice of state using Zustand selectors.
 */
export function useInstitutesMirror<K extends keyof InstitutesState>(
  key: K,
): InstitutesState[K] {
  const store = useInstitutesStore();
  return useStore(store, (state) => state[key]);
}

/**
 * Selector-based Mirror hook for Institutes Controller.
 */
export function useInstitutesMirrorSelector<TSelected>(
  selector: (state: InstitutesState) => TSelected,
): TSelected {
  const store = useInstitutesStore();
  return useStore(store, selector);
}
