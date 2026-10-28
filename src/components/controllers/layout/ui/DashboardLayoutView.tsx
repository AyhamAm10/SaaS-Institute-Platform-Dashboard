'use client';

import { AppShell, Box, rem } from '@mantine/core';
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
    <Box
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--app-bg)',
        overflow: 'hidden',
      }}
    >
      {/* Universal Ambient Luminous Glow Orbs (Fixed behind AppShell, Header & Sidebar) */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        {/* Top-Right Vibrant Luminous Orb (Purple/Indigo) */}
        <Box
          style={{
            position: 'absolute',
            top: '-10%',
            right: '10%',
            width: '48vw',
            height: '48vw',
            maxWidth: 680,
            maxHeight: 680,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--app-ambient-orb-1) 0%, transparent 68%)',
            filter: 'blur(75px)',
            opacity: 0.95,
          }}
        />
        {/* Center-Left Radiant Orb (Cyan / Sky Blue) */}
        <Box
          style={{
            position: 'absolute',
            top: '25%',
            left: '-5%',
            width: '44vw',
            height: '44vw',
            maxWidth: 620,
            maxHeight: 620,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--app-ambient-orb-2) 0%, transparent 70%)',
            filter: 'blur(80px)',
            opacity: 0.9,
          }}
        />
        {/* Bottom-Center Warm Luminous Orb (Warm Rose / Amber) */}
        <Box
          style={{
            position: 'absolute',
            bottom: '-15%',
            right: '25%',
            width: '52vw',
            height: '52vw',
            maxWidth: 720,
            maxHeight: 720,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--app-ambient-orb-3) 0%, transparent 70%)',
            filter: 'blur(85px)',
            opacity: 0.85,
          }}
        />
        {/* Top-Left Ambient Halo Orb (Amber / Gold) */}
        <Box
          style={{
            position: 'absolute',
            top: '5%',
            left: '20%',
            width: '35vw',
            height: '35vw',
            maxWidth: 480,
            maxHeight: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--app-ambient-orb-4) 0%, transparent 72%)',
            filter: 'blur(70px)',
            opacity: 0.8,
          }}
        />
      </Box>

      <AppShell
        header={{ height: headerHeight }}
        navbar={{
          width: isCollapsed ? rem(88) : rem(280),
          breakpoint: 'md',
          collapsed: { mobile: !isMobileOpen },
        }}
        padding={0}
        style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: 'transparent',
        }}
      >
        <DashboardHeader />
        <SidebarFactory />
        <MainContent>{children}</MainContent>
      </AppShell>
    </Box>
  );
}
