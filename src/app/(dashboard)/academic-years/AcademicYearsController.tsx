'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  AcademicYear,
  useAcademicYearsQuery,
  useCreateAcademicYearMutation,
  useSetCurrentAcademicYearMutation,
  useUpdateAcademicYearMutation,
} from '@/src/core/api';
import { createAcademicYearsStore, AcademicYearsContext } from './store/academicYears.store';
import { AcademicYearsView } from './ui/AcademicYearsView';
import { useStore } from 'zustand';

/**
 * QuerySync
 *
 * Internal component that bridges React Query data into the Zustand store.
 * Keeps the store in sync with server data without the UI layer
 * needing to know about React Query.
 */
function QuerySync({ store }: { store: ReturnType<typeof createAcademicYearsStore> }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const { data: paginatedData, isLoading, isFetching } = useAcademicYearsQuery({
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
 * AcademicYearsController
 *
 * Root entry point for the Academic Years page.
 * Owns the Zustand store instance, query synchronization, and mutation orchestration.
 * Strictly adheres to the Controller Component Pattern (role.md).
 */
export function AcademicYearsController() {
  const [store] = useState(() => createAcademicYearsStore());

  // ── Mutations ──
  const createMutation = useCreateAcademicYearMutation();
  const updateMutation = useUpdateAcademicYearMutation();
  const setCurrentMutation = useSetCurrentAcademicYearMutation();

  // ── Form Submit Handler ──
  const handleFormSubmit = useCallback(
    async (formData: {
      name: string;
      startDate: string;
      endDate: string;
      isCurrent?: boolean;
    }) => {
      const selectedYear = store.getState().selectedYear;
      store.getState().setFormSubmitting(true);
      try {
        if (selectedYear) {
          await updateMutation.mutateAsync({
            id: selectedYear.id,
            payload: formData,
          });
        } else {
          await createMutation.mutateAsync(formData);
        }
        store.getState().closeModal();
      } finally {
        store.getState().setFormSubmitting(false);
      }
    },
    [store, createMutation, updateMutation],
  );

  // ── Set Current Handler ──
  const handleSetCurrent = useCallback(
    async (year: AcademicYear) => {
      if (year.isCurrent) return;
      store.getState().setSetCurrentPending(true, year.id);
      try {
        await setCurrentMutation.mutateAsync(year.id);
      } finally {
        store.getState().setSetCurrentPending(false, null);
      }
    },
    [store, setCurrentMutation],
  );

  return (
    <AcademicYearsContext.Provider value={store}>
      <QuerySync store={store} />
      <AcademicYearsView
        onFormSubmit={handleFormSubmit}
        onSetCurrent={handleSetCurrent}
      />
    </AcademicYearsContext.Provider>
  );
}
