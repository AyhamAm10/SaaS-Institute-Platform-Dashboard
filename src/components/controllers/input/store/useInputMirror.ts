'use client';

import { useStore } from 'zustand';
import { useInputStore } from './input.store';
import { InputState } from '../state/input.state';

/**
 * Strongly typed Mirror hook for Input Controller.
 * Subscribes to a single key in the isolated store with selective re-rendering.
 */
export function useInputMirror<K extends keyof InputState>(key: K): InputState[K] {
  const store = useInputStore();
  return useStore(store, (state) => state[key]);
}

/**
 * Selector-based Mirror hook for Input Controller.
 */
export function useInputMirrorSelector<TSelected>(
  selector: (state: InputState) => TSelected,
): TSelected {
  const store = useInputStore();
  return useStore(store, selector);
}

/**
 * Mirror registry accessor returning the entire mirror state.
 */
export function useInputMirrorRegistry(): InputState {
  const store = useInputStore();
  return useStore(store, (state) => state);
}
