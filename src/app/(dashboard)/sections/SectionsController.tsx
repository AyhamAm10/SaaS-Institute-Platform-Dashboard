'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Section,
  useAcademicYearsQuery,
  useCreateSectionMutation,
  useSectionsQuery,
  useUpdateSectionFeeMutation,
  useUpdateSectionMutation,
} from '@/src/core/api';
import { createSectionsStore, SectionsContext } from './store/sections.store';
import { SectionsView } from './ui/SectionsView';
import { useStore } from 'zustand';

/**
 * QuerySync
 *
 * Internal component that bridges React Query data into the Zustand store.
 * Keeps the store in sync with server data without the UI layer
 * needing to know about React Query.
 */
function QuerySync({ store }: { store: ReturnType<typeof createSectionsStore> }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const selectedYearId = useStore(store, (s) => s.selectedYearId);
  const selectedGrade = useStore(store, (s) => s.selectedGrade);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);
  const syncAcademicYears = useStore(store, (s) => s.syncAcademicYears);

  // ── Academic Years query (for filters & modal) ──
  const { data: yearsData } = useAcademicYearsQuery({ limit: 100 });

  useEffect(() => {
    syncAcademicYears(yearsData?.data ?? []);
  }, [yearsData, syncAcademicYears]);

  // ── Sections query ──
  const { data: paginatedData, isLoading, isFetching } = useSectionsQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    academicYearId: selectedYearId ? Number(selectedYearId) : undefined,
    grade: selectedGrade ? selectedGrade : undefined,
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
 * SectionsController
 *
 * Root entry point for the Sections page.
 * Owns the Zustand store instance, query synchronization, and mutation orchestration.
 * Strictly adheres to the Controller Component Pattern (role.md).
 */
export function SectionsController() {
  const [store] = useState(() => createSectionsStore());

  // ── Mutations ──
  const createMutation = useCreateSectionMutation();
  const updateMutation = useUpdateSectionMutation();
  const updateFeeMutation = useUpdateSectionFeeMutation();

  // ── Form Submit Handler ──
  const handleFormSubmit = useCallback(
    async (formData: {
      name: string;
      grade: string;
      branchId: number;
      academicYearId: number;
      feeAmount: number;
    }) => {
      const selectedSection = store.getState().selectedSection;
      store.getState().setFormSubmitting(true);
      try {
        if (selectedSection) {
          await updateMutation.mutateAsync({
            id: selectedSection.id,
            payload: {
              name: formData.name,
              grade: formData.grade,
              feeAmount: formData.feeAmount,
            },
          });
        } else {
          await createMutation.mutateAsync(formData);
        }
        store.getState().closeFormModal();
      } finally {
        store.getState().setFormSubmitting(false);
      }
    },
    [store, createMutation, updateMutation],
  );

  // ── Fee Submit Handler ──
  const handleFeeSubmit = useCallback(
    async (feeAmount: number) => {
      const feeSection = store.getState().feeSection;
      if (!feeSection) return;
      store.getState().setFeeSubmitting(true);
      try {
        await updateFeeMutation.mutateAsync({
          id: feeSection.id,
          payload: { feeAmount },
        });
        store.getState().closeFeeModal();
      } finally {
        store.getState().setFeeSubmitting(false);
      }
    },
    [store, updateFeeMutation],
  );

  return (
    <SectionsContext.Provider value={store}>
      <QuerySync store={store} />
      <SectionsView
        onFormSubmit={handleFormSubmit}
        onFeeSubmit={handleFeeSubmit}
      />
    </SectionsContext.Provider>
  );
}
