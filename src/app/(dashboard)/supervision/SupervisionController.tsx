'use client';

import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useMySupervisionsQuery } from '@/src/core/api';
import { createSupervisionStore, SupervisionContext, SupervisionStore } from './store/supervision.store';
import { SupervisionView } from './ui/SupervisionView';

/** Bridges the supervisor's own exams into the store. */
function QuerySync({ store }: { store: SupervisionStore }) {
  const syncQueryData = useStore(store, (s) => s.syncQueryData);
  const { data, isLoading } = useMySupervisionsQuery();

  useEffect(() => {
    syncQueryData({ today: data?.today ?? '', data: data?.items ?? [], isLoading });
  }, [data, isLoading, syncQueryData]);

  return null;
}

/**
 * SupervisionController
 *
 * "مراقباتي": what a supervisor sees — only the exams she was assigned, from the
 * institute's today on. Read-only; the administration chooses the supervisors.
 */
export function SupervisionController() {
  const [store] = useState(createSupervisionStore);
  return (
    <SupervisionContext.Provider value={store}>
      <QuerySync store={store} />
      <SupervisionView />
    </SupervisionContext.Provider>
  );
}
