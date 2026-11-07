'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import type { ControllerStoreApi } from '@/src/core/mirror/types';
import type { ReportsCenterState } from '../state/reports-center.state';

export type ReportsCenterStore = ControllerStoreApi<ReportsCenterState>;

/** Isolated store of the reports center (role.md §3). */
export function createReportsCenterStore(): ReportsCenterStore {
  return createControllerStore<ReportsCenterState>((set) => ({
    catalog: [],
    isLoading: true,
    search: '',
    category: 'all',
    setSearch: (search) => set({ search }),
    setCategory: (category) => set({ category }),
    syncCatalog: (catalog, isLoading) => set({ catalog, isLoading }),
  }));
}

export const ReportsCenterContext = createContext<ReportsCenterStore | null>(null);

export function useReportsCenterMirror<K extends keyof ReportsCenterState>(key: K): ReportsCenterState[K] {
  const store = useContext(ReportsCenterContext);
  if (!store) throw new Error('useReportsCenterMirror must be used within <ReportsCenterController>.');
  return useStore(store, (state) => state[key]);
}
