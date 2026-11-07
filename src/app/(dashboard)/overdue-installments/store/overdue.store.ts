'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { OverdueState } from '../state/overdue.state';

export type OverdueStore = ControllerStoreApi<OverdueState>;

/** Isolated store of the overdue installments page (role.md §3). */
export function createOverdueStore(): OverdueStore {
  return createControllerStore<OverdueState>((set) => ({
    page: 1,
    limit: 10,
    search: '',
    currency: null,
    data: [],
    total: 0,
    totalPages: 1,
    isLoading: true,
    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),
    setCurrency: (currency) => set({ currency, page: 1 }),
    syncQueryData: (payload) => set(payload),
  }));
}

export const OverdueContext = createContext<OverdueStore | null>(null);

export function useOverdueMirror<K extends keyof OverdueState>(key: K): OverdueState[K] {
  const store = useContext(OverdueContext);
  if (!store) throw new Error('useOverdueMirror must be used within <OverdueController>.');
  return useStore(store, (state) => state[key]);
}
