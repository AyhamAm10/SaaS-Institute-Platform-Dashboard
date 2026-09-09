'use client';

import { useStore } from 'zustand';
import { useSubjectsStore } from './subjects.store';
import { SubjectsState } from '../state/subjects.state';

/**
 * Strongly typed Mirror hook for Subjects Controller.
 * Subscribes only to the requested slice of state using Zustand selectors.
 */
export function useSubjectsMirror<K extends keyof SubjectsState>(
  key: K,
): SubjectsState[K] {
  const store = useSubjectsStore();
  return useStore(store, (state) => state[key]);
}

/**
 * Selector-based Mirror hook for Subjects Controller.
 */
export function useSubjectsMirrorSelector<TSelected>(
  selector: (state: SubjectsState) => TSelected,
): TSelected {
  const store = useSubjectsStore();
  return useStore(store, selector);
}
