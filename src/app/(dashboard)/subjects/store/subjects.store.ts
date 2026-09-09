'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import {
  SubjectFormState,
  SubjectsState,
} from '../state/subjects.state';

export type SubjectsStore = ControllerStoreApi<SubjectsState>;

const defaultFormState: SubjectFormState = {
  name: '',
  code: '',
};

/**
 * Creates an isolated per-instance Zustand store for the Subjects Controller.
 * All UI state lives here.
 */
export function createSubjectsStore(): SubjectsStore {
  return createControllerStore<SubjectsState>((set) => ({
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
    drawerOpened: false,
    drawerMode: 'create',
    selectedSubject: null,
    form: { ...defaultFormState },
    formErrors: {},
    generalError: null,
    generalSuccess: null,
    isSubmitting: false,

    // ── Delete Modal State ──
    deleteModalOpened: false,
    subjectToDelete: null,
    deleteError: null,
    isDeleting: false,

    // ── Actions: Pagination & Filters ──
    setPage: (page: number) => set({ page }),
    setLimit: (limit: number) => set({ limit, page: 1 }),
    setSearch: (search: string) => set({ search, page: 1 }),

    // ── Actions: Drawer & Form ──
    openCreateDrawer: () =>
      set({
        drawerOpened: true,
        drawerMode: 'create',
        selectedSubject: null,
        form: { ...defaultFormState },
        formErrors: {},
        generalError: null,
        generalSuccess: null,
      }),

    openEditDrawer: (subject) =>
      set({
        drawerOpened: true,
        drawerMode: 'edit',
        selectedSubject: subject,
        form: {
          name: subject.name,
          code: subject.code,
        },
        formErrors: {},
        generalError: null,
        generalSuccess: null,
      }),

    closeDrawer: () => set({ drawerOpened: false }),

    setFormField: (field, value) =>
      set((state) => ({
        form: {
          ...state.form,
          [field]: value,
        },
        formErrors: {
          ...state.formErrors,
          [field]: '',
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

    // ── Actions: Delete Modal ──
    openDeleteModal: (subject) =>
      set({
        deleteModalOpened: true,
        subjectToDelete: subject,
        deleteError: null,
      }),

    closeDeleteModal: () =>
      set({
        deleteModalOpened: false,
        subjectToDelete: null,
        deleteError: null,
      }),

    setDeleteError: (error) => set({ deleteError: error }),
    setIsDeleting: (deleting) => set({ isDeleting: deleting }),

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

export const SubjectsContext = createContext<SubjectsStore | null>(null);

export function useSubjectsStore(): SubjectsStore {
  const store = useContext(SubjectsContext);
  if (!store) {
    throw new Error(
      'useSubjectsStore must be used within a <SubjectsController> component hierarchy.',
    );
  }
  return store;
}
