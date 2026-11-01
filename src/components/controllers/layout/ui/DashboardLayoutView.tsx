'use client';

import { AppShell, Box, rem } from '@mantine/core';
import { ReactNode } from 'react';
import { DashboardHeader } from './Header';
import { MainContent } from './MainContent';
import { SidebarFactory } from '../../sidebar/ui/SidebarFactory';
import { useSidebarMirror } from '../../sidebar/store/useSidebarMirror';
import { useLayoutMirror } from '../store/useLayoutMirror';
import { AppAmbient } from '../../ambient';

export interface DashboardLayoutViewProps {
  children: ReactNode;
}

export function DashboardLayoutView({ children }: DashboardLayoutViewProps) {
  const headerHeight = useLayoutMirror('headerHeight');
  const isCollapsed = useSidebarMirror('isDesktopCollapsed');
  const isMobileOpen = useSidebarMirror('isMobileOpen');

  return (
    <Box style={{ position: 'relative', minHeight: '100vh', backgroundColor: 'var(--app-bg)' }}>
      {/* Living background: orange liquid blobs behind every glass surface */}
      <AppAmbient variant="dashboard" />

      <AppShell
        header={{ height: headerHeight }}
        navbar={{
          width: isCollapsed ? rem(100) : rem(284),
          breakpoint: 'md',
          collapsed: { mobile: !isMobileOpen },
        }}
        padding={0}
        transitionDuration={250}
        transitionTimingFunction="cubic-bezier(0.16, 1, 0.3, 1)"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <DashboardHeader />
        <SidebarFactory />
        <MainContent>{children}</MainContent>
      </AppShell>
    </Box>
  );
}
