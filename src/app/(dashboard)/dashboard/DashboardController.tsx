'use client';

import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useDashboardOverviewQuery } from '@/src/core/api';
import { createDashboardStore, DashboardContext, DashboardStore } from './store/dashboard.store';
import { DashboardView } from './ui/DashboardView';

/** GET /dashboard/overview → store (refreshed every minute by the query). */
function OverviewSync({ store }: { store: DashboardStore }) {
  const syncOverview = useStore(store, (s) => s.syncOverview);
  const { data, isLoading } = useDashboardOverviewQuery();

  useEffect(() => {
    syncOverview(data ?? null, isLoading);
  }, [data, isLoading, syncOverview]);

  return null;
}

/**
 * DashboardController
 *
 * Root Controller of the dashboard home: real numbers of the active branch
 * and academic year (phase 3 D1). Owns its isolated store (role.md §3 & §9).
 */
export function DashboardController() {
  const [store] = useState(() => createDashboardStore());

  return (
    <DashboardContext.Provider value={store}>
      <OverviewSync store={store} />
      <DashboardView />
    </DashboardContext.Provider>
  );
}
