'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { SectionsState } from '../state/sections.state';

export type SectionsStore = ControllerStoreApi<SectionsState>;

/**
 * Creates an isolated per-instance Zustand store for the Sections Controller.
 * All UI state (pagination, filters, modals, drawer, mutation tracking) lives here.
 */
export function createSectionsStore(): SectionsStore {
  return createControllerStore<SectionsState>((set) => ({
    // ── Pagination & Filters ──
    page: 1,
    limit: 10,
    search: '',
    selectedYearId: null,
    selectedBranchId: null,

    // ── Query-Derived Data ──
    data: [],
    total: 0,
    totalPages: 1,
    isLoading: true,
    isFetching: false,

    // ── Academic Years & Academic Branches ──
    academicYears: [],
    academicBranches: [],

    // ── Form Modal State ──
    formModalOpened: false,
    selectedSection: null,

    // ── Fee Modal State ──
    feeModalOpened: false,
    feeSection: null,

    // ── Details Drawer State ──
    drawerOpened: false,
    detailSectionId: null,

    // ── Academic Branches Management Modal State ──
    branchesModalOpened: false,
    branchForm: {
      name: '',
      code: '',
      description: '',
    },
    branchError: null,
    branchSuccess: null,

    // ── Mutation Loading ──
    formSubmitting: false,
    feeSubmitting: false,
    branchSubmitting: false,

    // ── Actions: Pagination & Filters ──
    setPage: (page: number) => set({ page }),
    setSearch: (search: string) => set({ search, page: 1 }),
    setSelectedYearId: (yearId: string | null) => set({ selectedYearId: yearId, page: 1 }),
    setSelectedBranchId: (branchId: string | null) => set({ selectedBranchId: branchId, page: 1 }),

    // ── Actions: Form Modal ──
    openCreate: () => set({ selectedSection: null, formModalOpened: true }),
    openEdit: (section) => set({ selectedSection: section, formModalOpened: true }),
    closeFormModal: () => set({ formModalOpened: false }),

    // ── Actions: Fee Modal ──
    openFeeModal: (section) => set({ feeSection: section, feeModalOpened: true }),
    closeFeeModal: () => set({ feeModalOpened: false }),

    // ── Actions: Details Drawer ──
    openDetails: (section) => set({ detailSectionId: section.id, drawerOpened: true }),
    closeDrawer: () => set({ drawerOpened: false }),

    // ── Actions: Branches Modal ──
    openBranchesModal: () =>
      set({
        branchesModalOpened: true,
        branchError: null,
        branchSuccess: null,
      }),
    closeBranchesModal: () => set({ branchesModalOpened: false }),
    setBranchFormField: (field, value) =>
      set((state) => ({
        branchForm: {
          ...state.branchForm,
          [field]: value,
        },
      })),
    resetBranchForm: () =>
      set({
        branchForm: {
          name: '',
          code: '',
          description: '',
        },
      }),
    setBranchError: (error) => set({ branchError: error }),
    setBranchSuccess: (success) => set({ branchSuccess: success }),

    // ── Actions: Query Sync ──
    syncQueryData: (payload) =>
      set({
        data: payload.data,
        total: payload.total,
        totalPages: payload.totalPages,
        isLoading: payload.isLoading,
        isFetching: payload.isFetching,
      }),
    syncAcademicYears: (years) => set({ academicYears: years }),
    syncAcademicBranches: (branches) => set({ academicBranches: branches }),

    // ── Actions: Mutations ──
    setFormSubmitting: (submitting: boolean) => set({ formSubmitting: submitting }),
    setFeeSubmitting: (submitting: boolean) => set({ feeSubmitting: submitting }),
    setBranchSubmitting: (submitting: boolean) => set({ branchSubmitting: submitting }),
  }));
}

export const SectionsContext = createContext<SectionsStore | null>(null);

export function useSectionsStore(): SectionsStore {
  const store = useContext(SectionsContext);
  if (!store) {
    throw new Error(
      'useSectionsStore must be used within a <SectionsController> component hierarchy.',
    );
  }
  return store;
}
