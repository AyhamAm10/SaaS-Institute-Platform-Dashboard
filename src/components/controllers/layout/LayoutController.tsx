'use client';

import { useState, ReactNode } from 'react';
import { LayoutInitialProps } from './state/layout.state';
import { createLayoutStore, LayoutContext } from './store/layout.store';
import { SidebarController, SidebarInitialProps } from '../sidebar';
import { DashboardLayoutView } from './ui/DashboardLayoutView';

export interface LayoutControllerProps extends LayoutInitialProps {
  sidebarProps?: SidebarInitialProps;
  children: ReactNode;
}

/**
 * LayoutController
 *
 * Manages the Dashboard layout shell (header, search, responsive structure)
 * and composes the SidebarController while keeping state domains strictly separated.
 */
export function LayoutController({
  sidebarProps,
  children,
  ...layoutProps
}: LayoutControllerProps) {
  const [store] = useState(() => createLayoutStore(layoutProps));

  return (
    <LayoutContext.Provider value={store}>
      <SidebarController {...sidebarProps}>
        <DashboardLayoutView>{children}</DashboardLayoutView>
      </SidebarController>
    </LayoutContext.Provider>
  );
}
