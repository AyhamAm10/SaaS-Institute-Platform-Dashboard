'use client';

import { useState } from 'react';
import { createDashboardStore, DashboardContext } from './store/dashboard.store';
import { DashboardView } from './ui/DashboardView';

/**
 * DashboardController
 *
 * Root Controller Component for the Executive Analytics Dashboard.
 * Owns isolated Zustand store per Section 3 & 9 of role.md.
 */
export function DashboardController() {
  const [store] = useState(() => createDashboardStore());

  return (
    <DashboardContext.Provider value={store}>
      <DashboardView />
    </DashboardContext.Provider>
  );
}
