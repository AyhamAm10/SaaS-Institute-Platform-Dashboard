'use client';

import { useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutInitialProps } from './state/layout.state';
import { createLayoutStore, LayoutContext } from './store/layout.store';
import { SidebarController, SidebarInitialProps } from '../sidebar';
import {
  defaultNavigationConfig,
  superAdminNavigationConfig,
} from '../sidebar/init/navigation';
import { filterNavigation, requiredPermissionFor } from '../sidebar/utils/nav.utils';
import { DashboardLayoutView } from './ui/DashboardLayoutView';
import { NoPermissionView } from './ui/NoPermissionView';
import { OperationalContextGate } from './OperationalContextGate';
import { useAuth } from '@/src/core/auth';
import { UserRole } from '@/src/core/api';

export interface LayoutControllerProps extends LayoutInitialProps {
  sidebarProps?: SidebarInitialProps;
  children: ReactNode;
}

/**
 * LayoutController
 *
 * Manages the Dashboard layout shell (header, search, responsive structure)
 * and composes the SidebarController while keeping state domains strictly separated.
 * Navigation is role-based: the super admin has their own menu; institute
 * users see the entries their permissions allow, and a page they may not
 * open shows NoPermissionView (the server enforces the same rules).
 */
export function LayoutController({
  sidebarProps,
  children,
  ...layoutProps
}: LayoutControllerProps) {
  const [store] = useState(() => createLayoutStore(layoutProps));
  const { user, can } = useAuth();
  const pathname = usePathname();

  const isSuperAdmin =
    user?.role === UserRole.SUPER_ADMIN || user?.role === 'SUPER_ADMIN';

  const required = isSuperAdmin ? null : requiredPermissionFor(pathname, defaultNavigationConfig);
  const allowed = !required || can(required);

  const resolvedSidebarProps: SidebarInitialProps = {
    ...sidebarProps,
    items:
      sidebarProps?.items ??
      (isSuperAdmin ? superAdminNavigationConfig : filterNavigation(defaultNavigationConfig, can)),
  };

  return (
    <LayoutContext.Provider value={store}>
      {/* Keyed by role: the sidebar store is created once per menu */}
      <SidebarController key={user?.role ?? 'guest'} {...resolvedSidebarProps}>
        <DashboardLayoutView>
          {/* Pages load only once the branch / year context is resolved */}
          <OperationalContextGate>{allowed ? children : <NoPermissionView />}</OperationalContextGate>
        </DashboardLayoutView>
      </SidebarController>
    </LayoutContext.Provider>
  );
}
