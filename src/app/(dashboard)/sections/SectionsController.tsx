'use client';

import { useState } from 'react';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { createSectionsStore, SectionsContext } from './store/sections.store';
import { SectionsView } from './ui/SectionsView';
import { OverviewSync, QuerySync } from './SectionsQuerySync';
import { useSectionFormActions } from './useSectionFormActions';
import { useSectionCatalogActions } from './useSectionCatalogActions';

/**
 * SectionsController
 *
 * Root entry point for the Sections page.
 * Owns the isolated Zustand store instance, lazy query synchronization,
 * and mutation orchestration. Strictly adheres to role.md.
 */
export function SectionsController() {
  const [store] = useState(() => createSectionsStore());
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.academicManage);
  const { handleFormSubmit, handleFeeSubmit } = useSectionFormActions(store);
  const { handleBranchCreate, handleBranchDelete, handleAssignSubject, handleRemoveSubject } =
    useSectionCatalogActions(store);

  return (
    <SectionsContext.Provider value={store}>
      <OverviewSync store={store} />
      <QuerySync store={store} />
      <SectionsView
        onFormSubmit={handleFormSubmit}
        onFeeSubmit={handleFeeSubmit}
        onBranchCreate={handleBranchCreate}
        onBranchDelete={handleBranchDelete}
        onAssignSubject={handleAssignSubject}
        onRemoveSubject={handleRemoveSubject}
        canManage={canManage}
      />
    </SectionsContext.Provider>
  );
}
