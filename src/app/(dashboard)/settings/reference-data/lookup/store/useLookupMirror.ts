'use client';

import { useStore } from 'zustand';
import { useLookupStore } from './lookup.store';
import { LookupState } from '../state/lookup.state';

/** Strongly typed Mirror hook for LookupController. */
export function useLookupMirror<K extends keyof LookupState>(key: K): LookupState[K] {
  const store = useLookupStore();
  return useStore(store, (state) => state[key]);
}

/** Selector-based Mirror hook for LookupController. */
export function useLookupMirrorSelector<TSelected>(
  selector: (state: LookupState) => TSelected,
): TSelected {
  const store = useLookupStore();
  return useStore(store, selector);
}
