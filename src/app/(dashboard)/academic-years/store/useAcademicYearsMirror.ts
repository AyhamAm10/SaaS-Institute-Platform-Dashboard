'use client';

import { useStore } from 'zustand';
import { useAcademicYearsStore } from './academicYears.store';
import { AcademicYearsState } from '../state/academicYears.state';

/**
 * Strongly typed Mirror hook for Academic Years Controller.
 * Subscribes only to the requested slice of state using Zustand selectors.
 */
export function useAcademicYearsMirror<K extends keyof AcademicYearsState>(
  key: K,
): AcademicYearsState[K] {
  const store = useAcademicYearsStore();
  return useStore(store, (state) => state[key]);
}

/**
 * Selector-based Mirror hook for Academic Years Controller.
 */
export function useAcademicYearsMirrorSelector<TSelected>(
  selector: (state: AcademicYearsState) => TSelected,
): TSelected {
  const store = useAcademicYearsStore();
  return useStore(store, selector);
}
