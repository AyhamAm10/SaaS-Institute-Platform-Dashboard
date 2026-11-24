'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { SupervisionState } from '../state/supervision.state';

export type SupervisionStore = ControllerStoreApi<SupervisionState>;

/** Isolated store of the "my supervisions" page (role.md §3). */
export function createSupervisionStore(): SupervisionStore {
  return createControllerStore<SupervisionState>((set) => ({
    today: '',
    data: [],
    isLoading: true,
    syncQueryData: (payload) => set(payload),
  }));
}

export const SupervisionContext = createContext<SupervisionStore | null>(null);

export function useSupervisionMirror<K extends keyof SupervisionState>(key: K): SupervisionState[K] {
  const store = useContext(SupervisionContext);
  if (!store) throw new Error('useSupervisionMirror must be used within <SupervisionController>.');
  return useStore(store, (state) => state[key]);
}
