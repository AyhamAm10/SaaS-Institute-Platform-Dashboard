'use client';

import { useStore } from 'zustand';
import { useSidebarStore } from './sidebar.store';
import { SidebarState } from '../state/sidebar.state';

/**
 * Strongly typed Mirror hook for Sidebar Controller.
 * Subscribes to a single key in the isolated store with selective re-rendering.
 */
export function useSidebarMirror<K extends keyof SidebarState>(key: K): SidebarState[K] {
  const store = useSidebarStore();
  return useStore(store, (state) => state[key]);
}

/**
 * Selector-based Mirror hook for Sidebar Controller.
 */
export function useSidebarMirrorSelector<TSelected>(
  selector: (state: SidebarState) => TSelected,
): TSelected {
  const store = useSidebarStore();
  return useStore(store, selector);
}

/**
 * Mirror registry accessor returning the entire mirror state.
 */
export function useSidebarMirrorRegistry(): SidebarState {
  const store = useSidebarStore();
  return useStore(store, (state) => state);
}
