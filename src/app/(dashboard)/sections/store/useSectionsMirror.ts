'use client';

import { useStore } from 'zustand';
import { useSectionsStore } from './sections.store';
import { SectionsState } from '../state/sections.state';

/**
 * Strongly typed Mirror hook for Sections Controller.
 * Subscribes only to the requested slice of state using Zustand selectors.
 */
export function useSectionsMirror<K extends keyof SectionsState>(
  key: K,
): SectionsState[K] {
  const store = useSectionsStore();
  return useStore(store, (state) => state[key]);
}

/**
 * Selector-based Mirror hook for Sections Controller.
 */
export function useSectionsMirrorSelector<TSelected>(
  selector: (state: SectionsState) => TSelected,
): TSelected {
  const store = useSectionsStore();
  return useStore(store, selector);
}
