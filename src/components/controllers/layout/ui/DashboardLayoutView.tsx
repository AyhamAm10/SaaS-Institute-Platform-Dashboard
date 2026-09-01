'use client';

import { AppShell, rem } from '@mantine/core';
import { ReactNode } from 'react';
import { DashboardHeader } from './Header';
import { MainContent } from './MainContent';
import { SidebarFactory } from '../../sidebar/ui/SidebarFactory';
import { useSidebarMirror } from '../../sidebar/store/useSidebarMirror';
import { useLayoutMirror } from '../store/useLayoutMirror';

export interface DashboardLayoutViewProps {
  children: ReactNode;
}

export function DashboardLayoutView({ children }: DashboardLayoutViewProps) {
  const headerHeight = useLayoutMirror('headerHeight');
  const isCollapsed = useSidebarMirror('isDesktopCollapsed');
  const isMobileOpen = useSidebarMirror('isMobileOpen');

  return (
    <AppShell
      header={{ height: headerHeight }}
      navbar={{
        width: isCollapsed ? rem(80) : rem(280),
        breakpoint: 'md',
        collapsed: { mobile: !isMobileOpen },
      }}
      padding="md"
    >
      <DashboardHeader />
      <SidebarFactory />
      <MainContent>{children}</MainContent>
    </AppShell>
  );
}
