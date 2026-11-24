'use client';

import { useState } from 'react';
import { MeSync } from './PortalQuerySync';
import { createPortalStore, PortalContext } from './store/portal.store';
import { PortalView } from './ui/PortalView';

/**
 * PortalController
 *
 * The follow-up portal of a guardian or a student (the home page of those two roles): the chosen
 * child's day, attendance, timetable, results and, for a guardian, finances and the institute's notes.
 * Read-only; it reads the same API as the parents app, which limits every read to the caller's own
 * children, so a child that is not hers answers 404 whatever the address says.
 */
export function PortalController() {
  const [store] = useState(createPortalStore);
  return (
    <PortalContext.Provider value={store}>
      <MeSync />
      <PortalView />
    </PortalContext.Provider>
  );
}
