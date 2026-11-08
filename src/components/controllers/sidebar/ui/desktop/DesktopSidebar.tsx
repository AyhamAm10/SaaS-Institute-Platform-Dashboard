'use client';

import { AppShell, Box, Group, ScrollArea, Text, rem } from '@mantine/core';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';
import { useSidebarMirror } from '../../store/useSidebarMirror';
import { AppIconButton } from '../../../button';
import { SidebarBrand } from '../shared/SidebarBrand';
import { SidebarNavList } from '../shared/SidebarNavList';
import { SidebarLogout } from '../shared/SidebarLogout';

/**
 * Desktop sidebar: a floating frosted-glass panel inset from the viewport edge.
 * Collapses into an icon rail.
 */
export function DesktopSidebar() {
  const isCollapsed = useSidebarMirror('isDesktopCollapsed');
  const toggleCollapse = useSidebarMirror('toggleDesktopCollapse');

  return (
    <AppShell.Navbar p={rem(12)} pl={0} visibleFrom="md">
      <Box
        className="app-glass"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--app-radius-xl)',
          backgroundColor: 'var(--app-sidebar-bg)',
          padding: isCollapsed ? `${rem(18)} ${rem(10)}` : `${rem(20)} ${rem(14)}`,
          transition: 'padding 250ms var(--app-ease-soft)',
          overflow: 'hidden',
        }}
      >
        <Group justify={isCollapsed ? 'center' : 'space-between'} wrap="nowrap" mb={rem(22)}>
          <SidebarBrand compact={isCollapsed} />
        </Group>

        <AppShell.Section grow component={ScrollArea} scrollbars="y">
          {!isCollapsed && (
            <Text size="xs" fw={400} c="var(--app-text-muted)" px={12} pb={8}>
              القائمة الرئيسية
            </Text>
          )}
          <SidebarNavList compact={isCollapsed} />
        </AppShell.Section>

        <Box pt="md" mt="sm" style={{ borderTop: '1px solid var(--app-border)' }}>
          <Group justify={isCollapsed ? 'center' : 'space-between'} wrap="nowrap" gap={6} style={{ flexDirection: isCollapsed ? 'column' : 'row' }}>
            <Box style={{ flex: isCollapsed ? undefined : 1 }}>
              <SidebarLogout compact={isCollapsed} />
            </Box>
            <AppIconButton
              variant="ghost"
              label={isCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
              onClick={toggleCollapse}
            >
              {isCollapsed ? <IconLayoutSidebarLeftExpand size={18} stroke={1.6} /> : <IconLayoutSidebarLeftCollapse size={18} stroke={1.6} />}
            </AppIconButton>
          </Group>
        </Box>
      </Box>
    </AppShell.Navbar>
  );
}
