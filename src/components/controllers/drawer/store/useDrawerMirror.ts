'use client';

import { useStore } from 'zustand';
import { useDrawerStore } from './drawer.store';
import { DrawerState } from '../state/drawer.state';

export function useDrawerMirror<K extends keyof DrawerState>(key: K): DrawerState[K] {
  const store = useDrawerStore();
  return useStore(store, (state) => state[key]);
}

export function useDrawerMirrorSelector<TSelected>(
  selector: (state: DrawerState) => TSelected,
): TSelected {
  const store = useDrawerStore();
  return useStore(store, selector);
}
