'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useBranchesQuery, Branch } from '@/src/core/api';
import { createBranchesStore, BranchesContext } from './store/branches.store';
import { BranchesView } from './ui/BranchesView';

/**
 * QuerySync
 *
 * Bridges React Query data for physical branches into the isolated Zustand store.
 * Strictly adheres to QuerySync pattern from Section 9 & 12 of role.md.
 */
function QuerySync({ store }: { store: ReturnType<typeof createBranchesStore> }) {
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
 * Owns the isolated Zustand store lifecycle and coordinates state transitions.
 */
export function BranchesController() {
  const [store] = useState(() => createBranchesStore());

  const handleSubmit = useCallback(async () => {
    const { selectedBranch, formName, formCode, formPhone, formAddress, branches } =
      store.getState();

    store.getState().setSubmitting(true);
    try {
      if (selectedBranch) {
        // Optimistic / Local update for selected branch
        const updated = branches.map((b) =>
          b.id === selectedBranch.id
            ? {
                ...b,
                name: formName.trim(),
                code: formCode.trim() || undefined,
                phone: formPhone.trim() || undefined,
                address: formAddress.trim() || undefined,
              }
            : b,
        );
        store.getState().syncBranches(updated, false);
      } else {
        // Optimistic / Local addition for new branch
        const newBranch: Branch = {
          id: Date.now(),
          instituteId: 1,
          name: formName.trim(),
          code: formCode.trim() || undefined,
          phone: formPhone.trim() || undefined,
          address: formAddress.trim() || undefined,
        };
        store.getState().syncBranches([...branches, newBranch], false);
      }
      store.getState().closeDrawer();
      store.getState().resetForm();
    } finally {
      store.getState().setSubmitting(false);
    }
  }, [store]);

  return (
    <BranchesContext.Provider value={store}>
      <QuerySync store={store} />
      <BranchesView onSubmit={handleSubmit} />
    </BranchesContext.Provider>
  );
}
