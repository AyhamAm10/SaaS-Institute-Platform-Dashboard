'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { MobileAccountsState, MobileGuardianForm, MobileStudentForm } from '../state/mobile-accounts.state';

const initialGuardianForm: MobileGuardianForm = {
  familyId: null,
  familyName: '',
  fullName: '',
  phone: '',
  relationship: 'FATHER',
  password: '',
};

const initialStudentForm: MobileStudentForm = {
  studentId: null,
  studentName: '',
  phone: '',
  password: '',
};

export type MobileAccountsStore = ReturnType<typeof createMobileAccountsStore>;

export function createMobileAccountsStore() {
  return createControllerStore<MobileAccountsState>((set) => ({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    search: '',
    roleFilter: null,
    isLoading: true,

    drawerOpened: false,
    drawerType: 'FAMILY',
    guardianForm: { ...initialGuardianForm },
    studentForm: { ...initialStudentForm },
    drawerError: null,
    isSubmittingDrawer: false,

    passwordModalOpened: false,
    selectedAccount: null,
    newPassword: '',
    passwordError: null,
    isPasswordSubmitting: false,

    deactivateModalOpened: false,
    deactivateTarget: null,
    isDeactivating: false,
    deactivateError: null,

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),
    setRoleFilter: (roleFilter) => set({ roleFilter, page: 1 }),
    syncData: (payload) =>
      set({
        data: payload.data,
        total: payload.total,
        totalPages: payload.totalPages,
        isLoading: payload.isLoading,
      }),

    openDrawer: (type = 'FAMILY') =>
      set({
        drawerOpened: true,
        drawerType: type,
        guardianForm: { ...initialGuardianForm },
        studentForm: { ...initialStudentForm },
        drawerError: null,
        isSubmittingDrawer: false,
      }),
    closeDrawer: () => set({ drawerOpened: false, drawerError: null }),
    setDrawerType: (drawerType) => set({ drawerType, drawerError: null }),

    setGuardianFormField: (field, value) =>
      set((s) => ({
        guardianForm: { ...s.guardianForm, [field]: value },
        drawerError: null,
      })),
    setStudentFormField: (field, value) =>
      set((s) => ({
        studentForm: { ...s.studentForm, [field]: value },
        drawerError: null,
      })),
    setDrawerError: (drawerError) => set({ drawerError }),
    setIsSubmittingDrawer: (isSubmittingDrawer) => set({ isSubmittingDrawer }),

    openPasswordModal: (account) =>
      set({
        passwordModalOpened: true,
        selectedAccount: account,
        newPassword: '',
        passwordError: null,
        isPasswordSubmitting: false,
      }),
    closePasswordModal: () =>
      set({
        passwordModalOpened: false,
        selectedAccount: null,
        newPassword: '',
        passwordError: null,
      }),
    setNewPassword: (newPassword) => set({ newPassword, passwordError: null }),
    setPasswordError: (passwordError) => set({ passwordError }),
    setIsPasswordSubmitting: (isPasswordSubmitting) => set({ isPasswordSubmitting }),

    openDeactivateModal: (account) =>
      set({
        deactivateModalOpened: true,
        deactivateTarget: account,
        isDeactivating: false,
        deactivateError: null,
      }),
    closeDeactivateModal: () =>
      set({
        deactivateModalOpened: false,
        deactivateTarget: null,
        isDeactivating: false,
        deactivateError: null,
      }),
    setIsDeactivating: (isDeactivating) => set({ isDeactivating }),
    setDeactivateError: (deactivateError) => set({ deactivateError }),
  }));
}

export const MobileAccountsContext = createContext<MobileAccountsStore | null>(null);

export function useMobileAccountsStore(): MobileAccountsStore {
  const store = useContext(MobileAccountsContext);
  if (!store) {
    throw new Error('useMobileAccountsStore must be used within a MobileAccountsContext.Provider');
  }
  return store;
}

