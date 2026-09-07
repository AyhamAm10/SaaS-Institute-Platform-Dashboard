'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import {
  CreateInstituteFormState,
  InstitutesState,
} from '../state/institutes.state';

export type InstitutesStore = ControllerStoreApi<InstitutesState>;

const defaultFormState: CreateInstituteFormState = {
  name: '',
  logoUrl: '',
  primaryColor: '#1a73e8',
  secondaryColor: '#34a853',
  phone: '',
  address: '',
  adminFullName: '',
  adminPhone: '',
  adminPassword: '',
};

/**
 * Creates an isolated per-instance Zustand store for the Institutes Controller.
 * All UI state (pagination, filters, drawers, creation form, errors) lives here.
 */
export function createInstitutesStore(): InstitutesStore {
  return createControllerStore<InstitutesState>((set) => ({
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

    // ── Form State ──
    createDrawerOpened: false,
    form: { ...defaultFormState },
    formErrors: {},
    generalError: null,
    generalSuccess: null,
    isSubmitting: false,

    // ── Details Drawer State ──
    detailsDrawerOpened: false,
    selectedInstitute: null,

    // ── Actions: Pagination & Filters ──
    setPage: (page: number) => set({ page }),
    setLimit: (limit: number) => set({ limit, page: 1 }),
    setSearch: (search: string) => set({ search, page: 1 }),

    // ── Actions: Create Drawer & Form ──
    openCreateDrawer: () =>
      set({
        createDrawerOpened: true,
        form: { ...defaultFormState },
        formErrors: {},
        generalError: null,
        generalSuccess: null,
      }),
    closeCreateDrawer: () => set({ createDrawerOpened: false }),

    setFormField: (field, value) =>
      set((state) => ({
        form: {
          ...state.form,
          [field]: value,
        },
        formErrors: {
          ...state.formErrors,
          [field]: '', // clear field error on input
        },
      })),

    resetForm: () =>
      set({
        form: { ...defaultFormState },
        formErrors: {},
        generalError: null,
        generalSuccess: null,
      }),

    setFieldError: (field, error) =>
      set((state) => ({
        formErrors: {
          ...state.formErrors,
          [field]: error || '',
        },
      })),

    setGeneralError: (error) => set({ generalError: error }),
    setGeneralSuccess: (success) => set({ generalSuccess: success }),
    setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

    // ── Actions: Details Drawer ──
    openDetailsDrawer: (institute) =>
      set({
        selectedInstitute: institute,
        detailsDrawerOpened: true,
      }),
    closeDetailsDrawer: () => set({ detailsDrawerOpened: false }),

    // ── Actions: Query Sync ──
    syncQueryData: (payload) =>
      set({
        data: payload.data,
        total: payload.total,
        totalPages: payload.totalPages,
        isLoading: payload.isLoading,
        isFetching: payload.isFetching,
      }),
  }));
}

export const InstitutesContext = createContext<InstitutesStore | null>(null);

export function useInstitutesStore(): InstitutesStore {
  const store = useContext(InstitutesContext);
  if (!store) {
    throw new Error(
      'useInstitutesStore must be used within an <InstitutesController> component hierarchy.',
    );
  }
  return store;
}
