'use client';

import { useState, ReactNode } from 'react';
import { LayoutInitialProps } from './state/layout.state';
import { createLayoutStore, LayoutContext } from './store/layout.store';
import { SidebarController, SidebarInitialProps } from '../sidebar';
import {
  defaultNavigationConfig,
  superAdminNavigationConfig,
} from '../sidebar/init/navigation';
import { DashboardLayoutView } from './ui/DashboardLayoutView';
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
 * Dynamically provides role-based navigation (Super Admin vs Institute Admin).
 */
export function LayoutController({
  sidebarProps,
  children,
  ...layoutProps
}: LayoutControllerProps) {
  const [store] = useState(() => createLayoutStore(layoutProps));
  const { user } = useAuth();

  const isSuperAdmin =
    user?.role === UserRole.SUPER_ADMIN || user?.role === 'SUPER_ADMIN';

  const resolvedSidebarProps: SidebarInitialProps = {
    ...sidebarProps,
    items:
      sidebarProps?.items ??
      (isSuperAdmin ? superAdminNavigationConfig : defaultNavigationConfig),
  };

  return (
    <LayoutContext.Provider value={store}>
      <SidebarController {...resolvedSidebarProps}>
        <DashboardLayoutView>{children}</DashboardLayoutView>
      </SidebarController>
    </LayoutContext.Provider>
  );
}
