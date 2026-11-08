'use client';

import { createContext, useContext } from 'react';
import { createControllerStore } from '@/src/core/mirror';
import { TeachersTabState } from '../state/teachers-tab.state';

export type TeachersTabStore = ReturnType<typeof createTeachersTabStore>;

export function createTeachersTabStore() {
  return createControllerStore<TeachersTabState>((set) => ({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    search: '',
    isLoading: true,

    passwordModalOpened: false,
    selectedTeacher: null,
    newPassword: '',
    passwordError: null,
    isPasswordSubmitting: false,

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),

    syncData: (payload) =>
      set({
        data: payload.data,
        total: payload.total,
        totalPages: payload.totalPages,
        isLoading: payload.isLoading,
      }),

    openPasswordModal: (teacher) =>
      set({
        passwordModalOpened: true,
        selectedTeacher: teacher,
        newPassword: '',
        passwordError: null,
      }),

    closePasswordModal: () =>
      set({
        passwordModalOpened: false,
        selectedTeacher: null,
        newPassword: '',
        passwordError: null,
      }),

    setNewPassword: (newPassword) => set({ newPassword, passwordError: null }),
    setPasswordError: (passwordError) => set({ passwordError }),
    setIsPasswordSubmitting: (isPasswordSubmitting) => set({ isPasswordSubmitting }),
  }));
}

export const TeachersTabContext = createContext<TeachersTabStore | null>(null);

export function useTeachersTabStore(): TeachersTabStore {
  const store = useContext(TeachersTabContext);
  if (!store) {
    throw new Error('useTeachersTabStore must be used within a TeachersTabContext.Provider');
  }
  return store;
}

