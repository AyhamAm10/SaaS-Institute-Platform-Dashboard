'use client';

import { createContext, useContext } from 'react';
import { createStore, StoreApi } from 'zustand';
import { StudentsState } from '../state/students.state';

export type StudentsStore = StoreApi<StudentsState>;

export function createStudentsStore(): StudentsStore {
  return createStore<StudentsState>((set) => ({
    students: [],
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 20,
    search: '',
    selectedBranchId: null,
    isLoading: true,

    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),
    setSelectedBranchId: (selectedBranchId) => set({ selectedBranchId, page: 1 }),

    syncQueryData: ({ data, total, totalPages, isLoading }) =>
      set({
        students: data,
        total,
        totalPages: totalPages > 0 ? totalPages : 1,
        isLoading,
      }),
  }));
}

export const StudentsContext = createContext<StudentsStore | null>(null);

export function useStudentsStore(): StudentsStore {
  const store = useContext(StudentsContext);
  if (!store) {
    throw new Error('useStudentsStore must be used within StudentsContext.Provider');
  }
  return store;
}
