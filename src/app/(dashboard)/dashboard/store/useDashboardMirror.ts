'use client';

import { useStore } from 'zustand';
import { useDashboardStore } from './dashboard.store';
import { DashboardState } from '../state/dashboard.state';

/**
 * Strongly typed Mirror hook for DashboardController.
 * Ensures selective re-renders by subscribing to individual keys.
 */
export function useDashboardMirror<K extends keyof DashboardState>(key: K): DashboardState[K] {
  const store = useDashboardStore();
  return useStore(store, (s) => s[key]);
}

/**
 * Selector-based Mirror hook for derived state.
 */
export function useDashboardMirrorSelector<T>(selector: (state: DashboardState) => T): T {
  const store = useDashboardStore();
  return useStore(store, selector);
}
