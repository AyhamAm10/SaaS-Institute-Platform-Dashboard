'use client';

import { createContext, useContext } from 'react';
import { createStore, StoreApi } from 'zustand';
import { BranchesState } from '../state/branches.state';

export type BranchesStore = StoreApi<BranchesState>;

export function createBranchesStore(): BranchesStore {
  return createStore<BranchesState>((set) => ({
    branches: [],
    isLoading: true,
    search: '',

    isDrawerOpen: false,
    selectedBranch: null,

    formName: '',
    formCode: '',
    formPhone: '',
    formAddress: '',
    isSubmitting: false,

    setSearch: (search) => set({ search }),
    syncBranches: (branches, isLoading) => set({ branches, isLoading }),

    openCreateDrawer: () =>
      set({
        isDrawerOpen: true,
        selectedBranch: null,
        formName: '',
        formCode: '',
        formPhone: '',
        formAddress: '',
      }),

    openEditDrawer: (branch) =>
      set({
        isDrawerOpen: true,
        selectedBranch: branch,
        formName: branch.name,
        formCode: branch.code || '',
        formPhone: branch.phone || '',
        formAddress: branch.address || '',
      }),

    closeDrawer: () =>
      set({
        isDrawerOpen: false,
        selectedBranch: null,
      }),

    setFormField: (field, value) =>
      set((state) => ({ ...state, [field]: value })),

    setSubmitting: (isSubmitting) => set({ isSubmitting }),

    resetForm: () =>
      set({
        formName: '',
        formCode: '',
        formPhone: '',
        formAddress: '',
        isSubmitting: false,
      }),
  }));
}

export const BranchesContext = createContext<BranchesStore | null>(null);

export function useBranchesStore(): BranchesStore {
  const store = useContext(BranchesContext);
  if (!store) {
    throw new Error('useBranchesStore must be used within BranchesContext.Provider');
  }
  return store;
}
