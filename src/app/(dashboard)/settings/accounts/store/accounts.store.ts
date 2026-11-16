'use client';

import { createContext, useContext } from 'react';
import { useStore } from 'zustand';
import { createControllerStore } from '@/src/core/mirror';
import { ControllerStoreApi } from '@/src/core/mirror/types';
import type { AccountsState } from '../state/accounts.state';
import { EMPTY_STAFF_FORM, EMPTY_STUDENT_FORM, staffFormFrom } from '../utils/accounts.utils';

export type AccountsStore = ControllerStoreApi<AccountsState>;

const closedModal = { modal: null, target: null, modalError: null, isModalSubmitting: false } as const;
const freshStaff = { staffErrors: {}, staffGeneralError: null, isStaffSubmitting: false };
const freshStudent = { studentErrors: {}, studentGeneralError: null, isStudentSubmitting: false, studentSearch: '' };
/** A list of another type starts on its first page with no filters. */
const freshList = { page: 1, search: '', status: null, data: [], total: 0, totalPages: 1, isLoading: true };

/** Isolated store of the accounts screen (role.md §3). */
export function createAccountsStore(): AccountsStore {
  return createControllerStore<AccountsState>((set) => ({
    type: 'staff',
    limit: 10,
    ...freshList,
    summary: null,
    isSyncing: false,
    notice: null,
    error: null,
    ...closedModal,

    staffDrawerOpened: false,
    editingStaff: null,
    staffForm: EMPTY_STAFF_FORM,
    ...freshStaff,

    studentDrawerOpened: false,
    studentForm: EMPTY_STUDENT_FORM,
    eligibleStudents: [],
    ...freshStudent,

    setType: (type) => set({ type, ...freshList, notice: null, error: null }),
    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),
    setStatus: (status) => set({ status, page: 1 }),
    openModal: (modal, target) => set({ ...closedModal, modal, target }),
    closeModal: () => set(closedModal),
    setModalError: (modalError) => set({ modalError }),
    setIsModalSubmitting: (isModalSubmitting) => set({ isModalSubmitting }),

    openStaffCreate: () => set({ staffDrawerOpened: true, editingStaff: null, staffForm: EMPTY_STAFF_FORM, ...freshStaff }),
    openStaffEdit: (member) =>
      set({ staffDrawerOpened: true, editingStaff: member, staffForm: staffFormFrom(member), ...freshStaff }),
    closeStaffDrawer: () => set({ staffDrawerOpened: false }),
    // "" clears the error (undefined keeps the previous one in AppInput)
    setStaffField: (key, value) =>
      set((s) => ({ staffForm: { ...s.staffForm, [key]: value }, staffErrors: { ...s.staffErrors, [key]: '' } })),
    setStaffErrors: (staffErrors) => set({ staffErrors }),
    setStaffGeneralError: (staffGeneralError) => set({ staffGeneralError }),
    setIsStaffSubmitting: (isStaffSubmitting) => set({ isStaffSubmitting }),

    openStudentDrawer: () => set({ studentDrawerOpened: true, studentForm: EMPTY_STUDENT_FORM, ...freshStudent }),
    closeStudentDrawer: () => set({ studentDrawerOpened: false }),
    setStudentField: (key, value) =>
      set((s) => ({ studentForm: { ...s.studentForm, [key]: value }, studentErrors: { ...s.studentErrors, [key]: '' } })),
    setStudentErrors: (studentErrors) => set({ studentErrors }),
    setStudentGeneralError: (studentGeneralError) => set({ studentGeneralError }),
    setIsStudentSubmitting: (isStudentSubmitting) => set({ isStudentSubmitting }),
    setStudentSearch: (studentSearch) => set({ studentSearch }),

    setIsSyncing: (isSyncing) => set({ isSyncing }),
    setSyncResult: (notice, error) => set({ notice, error }),
    syncList: (payload) => set(payload),
    syncSummary: (summary) => set({ summary }),
    syncEligible: (eligibleStudents) => set({ eligibleStudents }),
  }));
}

export const AccountsContext = createContext<AccountsStore | null>(null);

export function useAccountsMirror<K extends keyof AccountsState>(key: K): AccountsState[K] {
  const store = useContext(AccountsContext);
  if (!store) throw new Error('useAccountsMirror must be used within <AccountsController>.');
  return useStore(store, (state) => state[key]);
}
