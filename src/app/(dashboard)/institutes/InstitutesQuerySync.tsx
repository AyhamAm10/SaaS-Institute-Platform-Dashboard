'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';
import { useInstituteFeaturesQuery, useInstitutesQuery } from '@/src/core/api';
import { InstitutesStore as Store } from './store/institutes.store';

/**
 * QuerySync
 *
 * Internal component bridging React Query data into the Zustand store.
 * Keeps the store synchronized with server data without the UI layer needing
 * to know about React Query.
 */
export function QuerySync({ store }: { store: Store }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const {
    data: paginatedData,
    isLoading,
    isFetching,
  } = useInstitutesQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
  });

  useEffect(() => {
    syncQueryData({
      data: paginatedData?.data ?? [],
      total: paginatedData?.total ?? 0,
      totalPages: paginatedData?.totalPages ?? 1,
      isLoading,
      isFetching,
    });
  }, [paginatedData, isLoading, isFetching, syncQueryData]);

  return null;
}

/**
 * FeaturesSync
 *
 * Loads the feature flags of the institute open in the details drawer.
 */
export function FeaturesSync({ store }: { store: Store }) {
  const instituteId = useStore(store, (s) => (s.detailsDrawerOpened ? (s.selectedInstitute?.id ?? null) : null));
  const syncFeatures = useStore(store, (s) => s.syncFeatures);

  const { data, isLoading } = useInstituteFeaturesQuery(instituteId);

  useEffect(() => {
    syncFeatures({
      features: instituteId ? (data ?? []) : [],
      isLoading: Boolean(instituteId) && isLoading,
    });
  }, [instituteId, data, isLoading, syncFeatures]);

  return null;
}
