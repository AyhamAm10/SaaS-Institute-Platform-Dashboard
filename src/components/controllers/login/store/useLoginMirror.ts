'use client';

import { useStore } from 'zustand';
import { useLoginStore } from './login.store';
import { LoginState } from '../state/login.state';

/**
 * Strongly typed Mirror hook for Login Controller.
 * Subscribes only to the requested slice of state using Zustand selectors.
 */
export function useLoginMirror<K extends keyof LoginState>(key: K): LoginState[K] {
  const store = useLoginStore();
  return useStore(store, (state) => state[key]);
}

/**
 * Selector-based Mirror hook for Login Controller.
 */
export function useLoginMirrorSelector<TSelected>(
  selector: (state: LoginState) => TSelected,
): TSelected {
  const store = useLoginStore();
  return useStore(store, selector);
}
