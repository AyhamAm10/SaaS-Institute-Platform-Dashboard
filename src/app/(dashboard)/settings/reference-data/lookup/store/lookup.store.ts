'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { LookupState } from '../state/lookup.state';
import { LookupConfig } from '../lookup.config';
import { emptyLookupForm, lookupFormFrom } from '../utils/lookup-form.utils';

export type LookupStore = ControllerStoreApi<LookupState>;

/** Isolated store of one reference table (role.md §3: one per tab instance). */
export function createLookupStore(config: LookupConfig): LookupStore {
  return createControllerStore<LookupState>((set) => ({
    config,
    page: 1,
    limit: 20,
    search: '',
    data: [],
    total: 0,
    totalPages: 1,
    isLoading: true,
    isFetching: false,
    options: {},

    drawerOpened: false,
    editing: null,
    form: emptyLookupForm(config.fields),
    formErrors: {},
    generalError: null,
    isSubmitting: false,

    deleteTarget: null,
    deleteError: null,
    isDeleting: false,

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),

    openCreate: () =>
      set({
        drawerOpened: true,
        editing: null,
        form: emptyLookupForm(config.fields),
        formErrors: {},
        generalError: null,
      }),
    openEdit: (item) =>
      set({
        drawerOpened: true,
        editing: item,
        form: lookupFormFrom(config.fields, item),
        formErrors: {},
        generalError: null,
      }),
    closeDrawer: () => set({ drawerOpened: false }),
    setField: (name, value) =>
      set((state) => ({
        form: { ...state.form, [name]: value },
        formErrors: { ...state.formErrors, [name]: '' },
      })),
    setFormErrors: (formErrors) => set({ formErrors }),
    setGeneralError: (generalError) => set({ generalError }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

    openDelete: (item) => set({ deleteTarget: item, deleteError: null }),
    closeDelete: () => set({ deleteTarget: null, deleteError: null }),
    setDeleteError: (deleteError) => set({ deleteError }),
    setIsDeleting: (isDeleting) => set({ isDeleting }),

    syncQueryData: (payload) => set(payload),
    syncOptions: (source, options) =>
      set((state) => ({ options: { ...state.options, [source]: options } })),
  }));
}

export const LookupContext = createContext<LookupStore | null>(null);

export function useLookupStore(): LookupStore {
  const store = useContext(LookupContext);
  if (!store) {
    throw new Error('useLookupStore must be used within a <LookupController> component hierarchy.');
  }
  return store;
}
