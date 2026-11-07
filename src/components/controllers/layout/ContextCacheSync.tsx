'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { clearContextQueries, useOperationalContextStore } from '@/src/core/context';

/**
 * Resets the context-dependent queries whenever the active branch or year
 * changes after the context was resolved (header menus). The only place
 * that clears the cache for a context switch (role.md dashboard §9.J).
 */
export function ContextCacheSync() {
  const queryClient = useQueryClient();

  useEffect(
    () =>
      useOperationalContextStore.subscribe((state, prev) => {
        const switched =
          state.activeBranchId !== prev.activeBranchId || state.activeAcademicYearId !== prev.activeAcademicYearId;
        if (prev.resolved && state.resolved && switched) void clearContextQueries(queryClient);
      }),
    [queryClient],
  );

  return null;
}
