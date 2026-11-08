'use client';

import { useDashboardOverviewQuery, useOverdueSummaryQuery } from '@/src/core/api';
import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useOverdueInstallmentsQuery } from '@/src/core/api';
import { createOverdueStore, OverdueContext, OverdueStore } from './store/overdue.store';
import { OverdueView } from './ui/OverdueView';

/** KPI / chart numbers of the page (role.md §12.1: no query in ui/). */
function OverviewSync({ store }: { store: OverdueStore }) {
  const syncOverview = useStore(store, (s) => s.syncOverview);
  const { data } = useDashboardOverviewQuery();
  const { data: aging } = useOverdueSummaryQuery();
  useEffect(() => {
    syncOverview(data ?? null, aging ?? []);
  }, [data, aging, syncOverview]);
  return null;
}

/** Bridges the overdue installments query into the store. */
function QuerySync({ store }: { store: OverdueStore }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const currency = useStore(store, (s) => s.currency);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);
  const { data, isLoading } = useOverdueInstallmentsQuery({
    page,
    limit,
    search: search.trim() || undefined,
    currency: currency ?? undefined,
  });

  useEffect(() => {
    syncQueryData({
      data: data?.data ?? [],
      total: data?.total ?? 0,
      totalPages: data?.totalPages ?? 1,
      isLoading,
    });
  }, [data, isLoading, syncQueryData]);

  return null;
}

/**
 * OverdueController
 *
 * Overdue installments report (E10). "Overdue" is computed by the server
 * from the institute's today, so it is correct even before the daily job runs.
 */
export function OverdueController() {
  const [store] = useState(createOverdueStore);
  return (
    <OverdueContext.Provider value={store}>
      <OverviewSync store={store} />
      <QuerySync store={store} />
      <OverdueView />
    </OverdueContext.Provider>
  );
}
