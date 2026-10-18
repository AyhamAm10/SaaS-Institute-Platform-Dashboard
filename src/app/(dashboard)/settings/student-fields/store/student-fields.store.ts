'use client';

import { createContext, useContext } from 'react';
import { createStore, StoreApi } from 'zustand';
import { StudentFieldsState } from '../state/student-fields.state';

export type StudentFieldsStore = StoreApi<StudentFieldsState>;

export function createStudentFieldsStore(): StudentFieldsStore {
  return createStore<StudentFieldsState>((set) => ({
    fields: [],
    isLoading: true,
    search: '',

    isDrawerOpen: false,
    selectedField: null,

    formName: '',
    formLabel: '',
    formType: 'TEXT',
    formOptionsText: '',
    formIsRequired: false,
    formDisplayInReport: true,
    formSortOrder: 0,
    isSubmitting: false,

    setSearch: (search) => set({ search }),
    syncFields: (fields, isLoading) => set({ fields, isLoading }),

    openCreateDrawer: () =>
      set({
        isDrawerOpen: true,
        selectedField: null,
        formName: '',
        formLabel: '',
        formType: 'TEXT',
        formOptionsText: '',
        formIsRequired: false,
        formDisplayInReport: true,
        formSortOrder: 0,
      }),

    openEditDrawer: (field) =>
      set({
        isDrawerOpen: true,
        selectedField: field,
        formName: field.name,
        formLabel: field.label,
        formType: field.type,
        formOptionsText: Array.isArray(field.options) ? field.options.join('\n') : '',
        formIsRequired: field.isRequired,
        formDisplayInReport: field.displayInReport,
        formSortOrder: field.sortOrder,
      }),

    closeDrawer: () =>
      set({
        isDrawerOpen: false,
        selectedField: null,
      }),

    setFormField: (field, value) =>
      set((state) => ({ ...state, [field]: value })),

    setSubmitting: (isSubmitting) => set({ isSubmitting }),
  }));
}

export const StudentFieldsContext = createContext<StudentFieldsStore | null>(null);

export function useStudentFieldsStore(): StudentFieldsStore {
  const store = useContext(StudentFieldsContext);
  if (!store) {
    throw new Error('useStudentFieldsStore must be used within StudentFieldsContext.Provider');
  }
  return store;
}
