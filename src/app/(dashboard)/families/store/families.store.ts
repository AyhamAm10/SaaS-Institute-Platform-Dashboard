'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { FamiliesState, FamilyFormState } from '../state/families.state';

export type FamiliesStore = ControllerStoreApi<FamiliesState>;

const defaultFormState: FamilyFormState = {
  familyName: '',
  fatherName: '',
  motherName: '',
  phone: '',
};

/**
 * Creates an isolated per-instance Zustand store for the Families Controller.
 * All UI state (search, drawer, form, delete modal, errors) lives here.
 */
export function createFamiliesStore(): FamiliesStore {
  return createControllerStore<FamiliesState>((set) => ({
    // ── Search ──
    search: '',

    // ── Query-Derived Data ──
    data: [],
    isLoading: true,
    isFetching: false,

    // ── Form Drawer State ──
    drawerOpened: false,
    drawerMode: 'create',
    selectedFamily: null,
    form: { ...defaultFormState },
    formErrors: {},
    generalError: null,
    isSubmitting: false,

    // ── Delete Modal State ──
    deleteModalOpened: false,
    familyToDelete: null,
    deleteError: null,
    isDeleting: false,

    // ── Actions: Search ──
    setSearch: (search) => set({ search }),

    // ── Actions: Drawer & Form ──
    openCreateDrawer: () =>
      set({
        drawerOpened: true,
        drawerMode: 'create',
        selectedFamily: null,
        form: { ...defaultFormState },
        formErrors: {},
        generalError: null,
      }),

    openEditDrawer: (family) =>
      set({
        drawerOpened: true,
        drawerMode: 'edit',
        selectedFamily: family,
        form: {
          familyName: family.familyName,
          fatherName: family.fatherName ?? '',
          motherName: family.motherName ?? '',
          phone: family.phone ?? '',
        },
        formErrors: {},
        generalError: null,
      }),

    closeDrawer: () => set({ drawerOpened: false }),

    setFormField: (field, value) =>
      set((state) => ({
        form: { ...state.form, [field]: value },
        formErrors: { ...state.formErrors, [field]: '' },
      })),

    setFieldError: (field, error) =>
      set((state) => ({
        formErrors: { ...state.formErrors, [field]: error || '' },
      })),

    setGeneralError: (generalError) => set({ generalError }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

    // ── Actions: Delete Modal ──
    openDeleteModal: (family) =>
      set({ deleteModalOpened: true, familyToDelete: family, deleteError: null }),

    closeDeleteModal: () =>
      set({ deleteModalOpened: false, familyToDelete: null, deleteError: null }),

    setDeleteError: (deleteError) => set({ deleteError }),
    setIsDeleting: (isDeleting) => set({ isDeleting }),

    // ── Actions: Query Sync ──
    syncQueryData: ({ data, isLoading, isFetching }) => set({ data, isLoading, isFetching }),
  }));
}

export const FamiliesContext = createContext<FamiliesStore | null>(null);

export function useFamiliesStore(): FamiliesStore {
  const store = useContext(FamiliesContext);
  if (!store) {
    throw new Error(
      'useFamiliesStore must be used within a <FamiliesController> component hierarchy.',
    );
  }
  return store;
}
