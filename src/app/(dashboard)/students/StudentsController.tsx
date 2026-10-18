'use client';

import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useStudentsQuery, useBranchesQuery } from '@/src/core/api';
import { createStudentsStore, StudentsContext } from './store/students.store';
import { StudentsView } from './ui/StudentsView';

/**
 * QuerySync
 *
 * Bridges React Query data for students into the isolated Zustand store.
 * Strictly adheres to QuerySync pattern from Section 9 & 12 of role.md.
 */
function QuerySync({ store }: { store: ReturnType<typeof createStudentsStore> }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const selectedBranchId = useStore(store, (s) => s.selectedBranchId);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const { data: paginatedData, isLoading } = useStudentsQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    branchId: selectedBranchId || undefined,
  });

  useEffect(() => {
    syncQueryData({
      data: paginatedData?.data ?? [],
      total: paginatedData?.total ?? 0,
      totalPages: paginatedData?.totalPages ?? 1,
      isLoading,
    });
  }, [paginatedData, isLoading, syncQueryData]);

  return null;
}

/**
 * StudentsController
 *
 * Root Controller Component for Students Management.
 * Owns isolated Zustand store per Section 3 & 9 of role.md.
 */
export function StudentsController() {
  const [store] = useState(() => createStudentsStore());
  const { data: branches = [] } = useBranchesQuery();

  return (
    <StudentsContext.Provider value={store}>
      <QuerySync store={store} />
      <StudentsView branches={branches} />
    </StudentsContext.Provider>
  );
}
