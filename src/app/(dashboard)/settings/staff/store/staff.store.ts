'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import { StaffState } from '../state/staff.state';
import { EMPTY_STAFF_FORM, staffFormFrom } from '../utils/staff.utils';

export type StaffStore = ControllerStoreApi<StaffState>;

const freshDrawer = { formErrors: {}, generalError: null, isSubmitting: false };
const closedModal = { modal: null, target: null, newPassword: '', modalError: null, isModalSubmitting: false };

/** Isolated store of the staff page (role.md §3). */
export function createStaffStore(): StaffStore {
  return createControllerStore<StaffState>((set) => ({
    page: 1,
    limit: 10,
    search: '',
    roleFilter: null,
    data: [],
    total: 0,
    totalPages: 1,
    isLoading: true,

    drawerOpened: false,
    editing: null,
    form: EMPTY_STAFF_FORM,
    ...freshDrawer,
    ...closedModal,

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),
    setRoleFilter: (roleFilter) => set({ roleFilter, page: 1 }),
    openCreate: () => set({ drawerOpened: true, editing: null, form: EMPTY_STAFF_FORM, ...freshDrawer }),
    openEdit: (member) => set({ drawerOpened: true, editing: member, form: staffFormFrom(member), ...freshDrawer }),
    closeDrawer: () => set({ drawerOpened: false }),
    setField: (key, value) =>
      // "" clears the error (undefined keeps the previous one in AppInput)
      set((s) => ({ form: { ...s.form, [key]: value }, formErrors: { ...s.formErrors, [key]: '' } })),
    setFormErrors: (formErrors) => set({ formErrors }),
    setGeneralError: (generalError) => set({ generalError }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    openModal: (modal, target) => set({ ...closedModal, modal, target }),
    closeModal: () => set(closedModal),
    setNewPassword: (newPassword) => set({ newPassword, modalError: null }),
    setModalError: (modalError) => set({ modalError }),
    setIsModalSubmitting: (isModalSubmitting) => set({ isModalSubmitting }),
    syncQueryData: (payload) => set(payload),
  }));
}

export const StaffContext = createContext<StaffStore | null>(null);

export function useStaffMirror<K extends keyof StaffState>(key: K): StaffState[K] {
  const store = useContext(StaffContext);
  if (!store) throw new Error('useStaffMirror must be used within <StaffController>.');
  return useStore(store, (state) => state[key]);
}
