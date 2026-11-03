'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { InstituteFormState, InstitutesState } from '../state/institutes.state';
import {
  DEFAULT_INSTITUTE_COLORS,
  DEFAULT_INSTITUTE_TIMEZONE,
} from '../static-data/institutes.data';

export type InstitutesStore = ControllerStoreApi<InstitutesState>;

const defaultFormState: InstituteFormState = {
  name: '',
  code: '',
  timezone: DEFAULT_INSTITUTE_TIMEZONE,
  logoUrl: '',
  primaryColor: DEFAULT_INSTITUTE_COLORS.primary,
  secondaryColor: DEFAULT_INSTITUTE_COLORS.secondary,
  phone: '',
  address: '',
  adminFullName: '',
  adminPhone: '',
  adminPassword: '',
};

/**
 * Creates an isolated per-instance Zustand store for the Institutes Controller.
 * All UI state (pagination, filters, drawers, forms, feature flags, errors) lives here.
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

    // ── Form Drawer State ──
    formDrawerOpened: false,
    drawerMode: 'create',
    editingInstitute: null,
    form: { ...defaultFormState },
    formErrors: {},
    generalError: null,
    generalSuccess: null,
    isSubmitting: false,

    // ── Details Drawer State ──
    detailsDrawerOpened: false,
    selectedInstitute: null,

    // ── Feature Flags ──
    features: [],
    isLoadingFeatures: false,
    featureSavingKey: null,
    featuresError: null,

    // ── Actions: Pagination & Filters ──
    setPage: (page: number) => set({ page }),
    setLimit: (limit: number) => set({ limit, page: 1 }),
    setSearch: (search: string) => set({ search, page: 1 }),

    // ── Actions: Form Drawer ──
    openCreateDrawer: () =>
      set({
        formDrawerOpened: true,
        drawerMode: 'create',
        editingInstitute: null,
        form: { ...defaultFormState },
        formErrors: {},
        generalError: null,
        generalSuccess: null,
      }),

    openEditDrawer: (institute) =>
      set({
        formDrawerOpened: true,
        drawerMode: 'edit',
        editingInstitute: institute,
        detailsDrawerOpened: false,
        form: {
          ...defaultFormState,
          name: institute.name,
          code: institute.code ?? '',
          timezone: institute.timezone || DEFAULT_INSTITUTE_TIMEZONE,
          logoUrl: institute.logoUrl ?? '',
          primaryColor: institute.primaryColor || DEFAULT_INSTITUTE_COLORS.primary,
          secondaryColor: institute.secondaryColor || DEFAULT_INSTITUTE_COLORS.secondary,
          phone: institute.phone,
          address: institute.address,
        },
        formErrors: {},
        generalError: null,
        generalSuccess: null,
      }),

    closeFormDrawer: () => set({ formDrawerOpened: false }),

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
        featuresError: null,
      }),
    closeDetailsDrawer: () => set({ detailsDrawerOpened: false }),

    // ── Actions: Feature Flags ──
    setFeatureSavingKey: (featureSavingKey) => set({ featureSavingKey }),
    setFeaturesError: (featuresError) => set({ featuresError }),
    syncFeatures: ({ features, isLoading }) =>
      set({ features, isLoadingFeatures: isLoading }),

    // ── Actions: Query Sync ──
    syncQueryData: (payload) =>
      set((state) => ({
        data: payload.data,
        total: payload.total,
        totalPages: payload.totalPages,
        isLoading: payload.isLoading,
        isFetching: payload.isFetching,
        // Keep the open details drawer in sync after edits
        selectedInstitute: state.selectedInstitute
          ? (payload.data.find((i) => i.id === state.selectedInstitute!.id) ??
            state.selectedInstitute)
          : null,
      })),
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
