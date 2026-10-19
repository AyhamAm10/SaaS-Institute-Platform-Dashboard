'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import {
  useBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
} from '@/src/core/api';
import { createBranchesStore, BranchesContext } from './store/branches.store';
import { BranchesView } from './ui/BranchesView';

/**
 * QuerySync
 *
 * Bridges React Query data for physical branches into the isolated Zustand store.
 * Strictly adheres to QuerySync pattern from Section 9 & 12 of role.md.
 */
function QuerySync({
  store,
}: {
  store: ReturnType<typeof createBranchesStore>;
}) {
  const syncBranches = useStore(store, (s) => s.syncBranches);
  const { data = [], isLoading } = useBranchesQuery();

  useEffect(() => {
    syncBranches(data, isLoading);
  }, [data, isLoading, syncBranches]);

  return null;
}

/**
 * BranchesController
 *
 * Root Controller Component for Geographical Branches management.
 * Owns the isolated Zustand store lifecycle and coordinates state transitions and mutations.
 */
export function BranchesController() {
  const [store] = useState(() => createBranchesStore());
  const createMutation = useCreateBranchMutation();
  const updateMutation = useUpdateBranchMutation();

  const handleSubmit = useCallback(async () => {
    const { selectedBranch, formName, formCode, formPhone, formAddress } =
      store.getState();

    store.getState().setSubmitting(true);
    try {
      if (selectedBranch) {
        await updateMutation.mutateAsync({
          id: selectedBranch.id,
          data: {
            name: formName.trim(),
            code: formCode.trim() || undefined,
            phone: formPhone.trim() || undefined,
            address: formAddress.trim() || undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formName.trim(),
          code: formCode.trim(),
          phone: formPhone.trim() || undefined,
          address: formAddress.trim() || undefined,
        });
      }
      store.getState().closeDrawer();
      store.getState().resetForm();
    } catch (err: unknown) {
      console.error('Failed to save branch:', err);
    } finally {
      store.getState().setSubmitting(false);
    }
  }, [store, createMutation, updateMutation]);

  return (
    <BranchesContext.Provider value={store}>
      <QuerySync store={store} />
      <BranchesView onSubmit={handleSubmit} />
    </BranchesContext.Provider>
  );
}
