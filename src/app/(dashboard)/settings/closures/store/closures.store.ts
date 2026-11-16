'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { ClosuresState } from '../state/closures.state';
import { closureFormFrom, EMPTY_CLOSURE_FORM, toggleId } from '../utils/closures.utils';

export type ClosuresStore = ControllerStoreApi<ClosuresState>;

const freshDrawer = { formErrors: {}, generalError: null, isSubmitting: false };
const closedDelete = { deleteTarget: null, deleteError: null, isDeleting: false };

/** Isolated store of the closures tab (role.md §3). */
export function createClosuresStore(): ClosuresStore {
  return createControllerStore<ClosuresState>((set) => ({
    data: [],
    isLoading: true,
    branches: [],
    sections: [],
    canManage: false,
    today: '',

    drawerOpened: false,
    editing: null,
    form: EMPTY_CLOSURE_FORM,
    ...freshDrawer,
    ...closedDelete,

    openCreate: () => set({ drawerOpened: true, editing: null, form: EMPTY_CLOSURE_FORM, ...freshDrawer }),
    openEdit: (closure) => set({ drawerOpened: true, editing: closure, form: closureFormFrom(closure), ...freshDrawer }),
    closeDrawer: () => set({ drawerOpened: false }),
    setField: (key, value) =>
      // "" clears the error (undefined keeps the previous one in AppInput)
      set((s) => ({ form: { ...s.form, [key]: value }, formErrors: { ...s.formErrors, [key]: '' } })),
    toggleSection: (id) =>
      set((s) => ({ form: { ...s.form, sectionIds: toggleId(s.form.sectionIds, id) }, formErrors: { ...s.formErrors, sectionIds: '' } })),
    setFormErrors: (formErrors) => set({ formErrors }),
    setGeneralError: (generalError) => set({ generalError }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    openDelete: (deleteTarget) => set({ ...closedDelete, deleteTarget }),
    closeDelete: () => set(closedDelete),
    setDeleteError: (deleteError) => set({ deleteError }),
    setIsDeleting: (isDeleting) => set({ isDeleting }),
    syncQueryData: (payload) => set(payload),
  }));
}

export const ClosuresContext = createContext<ClosuresStore | null>(null);

export function useClosuresMirror<K extends keyof ClosuresState>(key: K): ClosuresState[K] {
  const store = useContext(ClosuresContext);
  if (!store) throw new Error('useClosuresMirror must be used within <ClosuresController>.');
  return useStore(store, (state) => state[key]);
}
