'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { ExamsState } from '../state/exams.state';
import { EMPTY_EXAM_FORM, examFormFrom } from '../utils/exams.utils';

export type ExamsStore = ControllerStoreApi<ExamsState>;

const freshDrawer = { formErrors: {}, generalError: null, isSubmitting: false };

/** Isolated store of the exams page (role.md §3). */
export function createExamsStore(): ExamsStore {
  return createControllerStore<ExamsState>((set) => ({
    page: 1,
    limit: 20,
    search: '',
    filters: { sectionId: null, examTypeId: null, from: null, to: null },
    data: [],
    total: 0,
    totalPages: 1,
    isLoading: true,
    sectionOptions: [],
    examTypeOptions: [],
    subjectOptions: [],

    drawerOpened: false,
    editing: null,
    form: EMPTY_EXAM_FORM,
    ...freshDrawer,

    deleteTarget: null,
    deleteError: null,
    isDeleting: false,

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),
    setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value }, page: 1 })),
    openCreate: () =>
      set((s) => ({
        drawerOpened: true,
        editing: null,
        // Start in the section being filtered, if any
        form: { ...EMPTY_EXAM_FORM, sectionId: s.filters.sectionId },
        ...freshDrawer,
      })),
    openEdit: (exam) =>
      set({
        drawerOpened: true,
        editing: exam,
        form: examFormFrom(exam),
        ...freshDrawer,
      }),
    closeDrawer: () => set({ drawerOpened: false }),
    setField: (key, value) =>
      set((s) => ({
        form: {
          ...s.form,
          [key]: value,
          // Changing the section resets the subject (plan subjects differ)
          ...(key === 'sectionId' && { subjectId: null }),
        },
        // "" clears the error (undefined keeps the previous one in AppInput)
        formErrors: { ...s.formErrors, [key]: '' },
      })),
    setFormErrors: (formErrors) => set({ formErrors }),
    setGeneralError: (generalError) => set({ generalError }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    openDelete: (deleteTarget) => set({ deleteTarget, deleteError: null }),
    closeDelete: () => set({ deleteTarget: null, deleteError: null }),
    setDeleteError: (deleteError) => set({ deleteError }),
    setIsDeleting: (isDeleting) => set({ isDeleting }),
    syncQueryData: (payload) => set(payload),
    syncOptions: (key, options) => set({ [key]: options }),
  }));
}

export const ExamsContext = createContext<ExamsStore | null>(null);

export function useExamsMirror<K extends keyof ExamsState>(key: K): ExamsState[K] {
  const store = useContext(ExamsContext);
  if (!store) throw new Error('useExamsMirror must be used within <ExamsController>.');
  return useStore(store, (state) => state[key]);
}
