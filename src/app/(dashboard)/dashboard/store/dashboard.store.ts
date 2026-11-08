'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import type { ControllerStoreApi } from '@/src/core/mirror/types';
import { DashboardState } from '../state/dashboard.state';

export type DashboardStore = ControllerStoreApi<DashboardState>;

export function createDashboardStore(): DashboardStore {
  return createControllerStore<DashboardState>((set) => ({
    overview: null,
    isLoading: true,
    syncOverview: (overview, isLoading) => set({ overview, isLoading }),
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
