'use client';

import { useStore } from 'zustand';
import { useModalStore } from './modal.store';
import { ModalState } from '../state/modal.state';

export function useModalMirror<K extends keyof ModalState>(key: K): ModalState[K] {
  const store = useModalStore();
  return useStore(store, (state) => state[key]);
}

export function useModalMirrorSelector<TSelected>(
  selector: (state: ModalState) => TSelected,
): TSelected {
  const store = useModalStore();
  return useStore(store, selector);
}
