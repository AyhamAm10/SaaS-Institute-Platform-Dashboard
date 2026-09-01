'use client';

import { Fragment } from 'react';
import { DesktopSidebar } from './desktop/DesktopSidebar';
import { MobileSidebar } from './mobile/MobileSidebar';

/**
 * Sidebar UI Factory
 *
 * Encapsulates the visual variant resolution.
 * Mounts DesktopSidebar for wide screens (hidden on mobile) and
 * MobileSidebar for small screens (hidden on desktop) without layout shift.
 */
export function SidebarFactory() {
  return (
    <Fragment>
      <DesktopSidebar />
      <MobileSidebar />
    </Fragment>
  );
}
