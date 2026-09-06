'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { AcademicYearsState } from '../state/academicYears.state';

export type AcademicYearsStore = ControllerStoreApi<AcademicYearsState>;

/**
 * Creates an isolated per-instance Zustand store for the Academic Years Controller.
 * All UI state (pagination, filters, modals, mutation tracking) lives here.
 */
export function createAcademicYearsStore(): AcademicYearsStore {
  return createControllerStore<AcademicYearsState>((set) => ({
    // ── Pagination & Filters ──
    page: 1,
    limit: 10,
    search: '',

    // ── Query-Derived Data ──
    data: [],
    total: 0,
    totalPages: 1,
    isLoading: true,
    isFetching: false,

    // ── Modal State ──
    modalOpened: false,
    selectedYear: null,

    // ── Set-Current Mutation Tracking ──
    setCurrentPending: false,
    setCurrentTargetId: null,

    // ── Mutation Loading ──
    formSubmitting: false,

    // ── Actions: Pagination & Filters ──
    setPage: (page: number) => set({ page }),
    setSearch: (search: string) => set({ search, page: 1 }),

    // ── Actions: Modal ──
    openCreate: () => set({ selectedYear: null, modalOpened: true }),
    openEdit: (year) => set({ selectedYear: year, modalOpened: true }),
    closeModal: () => set({ modalOpened: false }),

    // ── Actions: Query Sync ──
    syncQueryData: (payload) =>
      set({
        data: payload.data,
        total: payload.total,
        totalPages: payload.totalPages,
        isLoading: payload.isLoading,
        isFetching: payload.isFetching,
      }),

    // ── Actions: Mutations ──
    setFormSubmitting: (submitting: boolean) => set({ formSubmitting: submitting }),
    setSetCurrentPending: (pending: boolean, targetId: number | null) =>
      set({ setCurrentPending: pending, setCurrentTargetId: targetId }),
  }));
}

export const AcademicYearsContext = createContext<AcademicYearsStore | null>(null);

export function useAcademicYearsStore(): AcademicYearsStore {
  const store = useContext(AcademicYearsContext);
  if (!store) {
    throw new Error(
      'useAcademicYearsStore must be used within an <AcademicYearsController> component hierarchy.',
    );
  }
  return store;
}
