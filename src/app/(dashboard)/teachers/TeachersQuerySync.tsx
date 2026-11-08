'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';
import { useAcademicBranchesQuery, useSubjectsQuery, useTeachersQuery } from '@/src/core/api';
import { TeachersStore } from './store/teachers.store';

/** Teachers list (page / search) into the store (no query in ui/). */
export function QuerySync({ store }: { store: TeachersStore }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const {
    data: paginated,
    isLoading,
    isFetching,
  } = useTeachersQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
  });

  useEffect(() => {
    syncQueryData({
      data: paginated?.data ?? [],
      total: paginated?.total ?? 0,
      totalPages: paginated?.totalPages ?? 1,
      isLoading,
      isFetching,
    });
  }, [paginated, isLoading, isFetching, syncQueryData]);

  return null;
}

/** Academic branches / subjects for the qualification pickers (no query in ui/). */
export function QualificationOptionsSync({ store }: { store: TeachersStore }) {
  const sync = useStore(store, (s) => s.syncQualificationOptions);
  const { data: branches } = useAcademicBranchesQuery();
  const { data: subjects } = useSubjectsQuery({ limit: 100 });
  useEffect(() => {
    sync(
      (branches?.data ?? []).map((b) => ({ value: String(b.id), label: b.name })),
      (subjects?.data ?? []).map((s) => ({ value: String(s.id), label: s.name })),
    );
  }, [branches, subjects, sync]);
  return null;
}
