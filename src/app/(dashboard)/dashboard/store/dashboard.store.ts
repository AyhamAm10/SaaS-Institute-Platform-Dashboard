'use client';

import { createContext, useContext } from 'react';
import { createStore, StoreApi } from 'zustand';
import { DashboardState, DashboardPeriod } from '../state/dashboard.state';

export type DashboardStore = StoreApi<DashboardState>;

export function createDashboardStore(): DashboardStore {
  return createStore<DashboardState>((set) => ({
    selectedPeriod: 'semester',
    setSelectedPeriod: (selectedPeriod: DashboardPeriod) => set({ selectedPeriod }),

    selectedStageFilter: 'all',
    setSelectedStageFilter: (selectedStageFilter: string) => set({ selectedStageFilter }),
  }));
}

export const DashboardContext = createContext<DashboardStore | null>(null);

export function useDashboardStore(): DashboardStore {
  const store = useContext(DashboardContext);
  if (!store) {
    throw new Error('useDashboardStore must be used within DashboardContext.Provider');
  }
  return store;
}
