'use client';

import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useReportCatalogQuery } from '@/src/core/api';
import { createReportsCenterStore, ReportsCenterContext, type ReportsCenterStore } from './store/reports-center.store';
import { ReportsCenterView } from './ui/ReportsCenterView';

/** Catalog (filtered by the server for this user) → store. */
function CatalogSync({ store }: { store: ReportsCenterStore }) {
  const syncCatalog = useStore(store, (s) => s.syncCatalog);
  const { data, isLoading } = useReportCatalogQuery();
  useEffect(() => {
    syncCatalog(data ?? [], isLoading);
  }, [data, isLoading, syncCatalog]);
  return null;
}

/**
 * ReportsCenterController
 *
 * Reports center (D3): every report the user may open, grouped by
 * category with search. Each card opens the report workspace.
 */
export function ReportsCenterController() {
  const [store] = useState(createReportsCenterStore);
  return (
    <ReportsCenterContext.Provider value={store}>
      <CatalogSync store={store} />
      <ReportsCenterView />
    </ReportsCenterContext.Provider>
  );
}
