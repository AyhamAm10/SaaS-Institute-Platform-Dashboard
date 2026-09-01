'use client';

import { useStore } from 'zustand';
import { useLayoutStore } from './layout.store';
import { LayoutState } from '../state/layout.state';

/**
 * Strongly typed Mirror hook for Layout Controller.
 */
export function useLayoutMirror<K extends keyof LayoutState>(key: K): LayoutState[K] {
  const store = useLayoutStore();
  return useStore(store, (state) => state[key]);
}

/**
 * Selector-based Mirror hook for Layout Controller.
 */
export function useLayoutMirrorSelector<TSelected>(
  selector: (state: LayoutState) => TSelected,
): TSelected {
  const store = useLayoutStore();
  return useStore(store, selector);
}
