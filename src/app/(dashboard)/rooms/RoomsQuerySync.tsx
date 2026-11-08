'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';
import { useRoomsQuery } from '@/src/core/api';
import { RoomsStore } from './store/rooms.store';

/** Rooms list (page / search / type) into the store (no query in ui/). */
export function QuerySync({ store }: { store: RoomsStore }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const type = useStore(store, (s) => s.type);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const {
    data: paginated,
    isLoading,
    isFetching,
  } = useRoomsQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    type,
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
