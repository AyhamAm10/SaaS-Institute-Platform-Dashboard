'use client';

import {
  AppShell,
  Badge,
  Box,
  Group,
  NavLink,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  rem,
} from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconLogout,
  IconSchool,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSidebarMirror } from '../../store/useSidebarMirror';
import { isNavItemActive } from '../../utils/nav.utils';
import { NavSubItem } from '../../init/navigation';
import { useAuth } from '@/src/core/auth';
import { useBranchesQuery, useOperationalContext } from '@/src/core/api';

export function DesktopSidebar() {
  const { user, logout, isLoggingOut } = useAuth();
  const { activeBranchId } = useOperationalContext();
  const { data: branches } = useBranchesQuery();
  const activeBranch = branches?.find((b) => b.id === activeBranchId);
  const branchLabel =
    user?.role === 'SUPER_ADMIN'
      ? 'المدير العام'
      : activeBranch?.name || 'الفرع الرئيسي';

  const items = useSidebarMirror('items');
  const isCollapsed = useSidebarMirror('isDesktopCollapsed');
  const toggleCollapse = useSidebarMirror('toggleDesktopCollapse');
  const openedSections = useSidebarMirror('openedSections');
  const toggleSection = useSidebarMirror('toggleSection');
  const setActiveRoute = useSidebarMirror('setActiveRoute');

  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      setActiveRoute(pathname);
    }
  }, [pathname, setActiveRoute]);

  return (
    <AppShell.Navbar
      p="md"
      visibleFrom="md"
      style={{
        width: isCollapsed ? rem(88) : rem(270),
        transition: 'width 250ms ease, padding 250ms ease, background-color 200ms ease, border-color 200ms ease',
        overflow: 'hidden',
        borderLeft: '1px solid var(--app-border)',
        backgroundColor: 'var(--app-sidebar-bg)',
      }}
    >
      {/* Brand Header */}
      <AppShell.Section mb="lg">
        {isCollapsed ? (
          <Stack align="center" gap="xs">
            <ThemeIcon
              size={44}
              radius="xl"
              style={{
                backgroundColor: 'var(--app-brand-primary)',
                color: '#fff9f3',
                boxShadow: '0 6px 16px rgba(73, 29, 43, 0.16)',
              }}
            >
              <IconSchool size={24} />
            </ThemeIcon>
          </Stack>
        ) : (
          <Stack align="center" gap="xs" pos="relative">
            {/* Soft Circular Emblem Container with active status dot */}
            <Box pos="relative">
              <Paper
                p="sm"
                radius="xl"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--app-brand-primary)',
                  width: rem(58),
                  height: rem(58),
                  borderRadius: '50%',
                  boxShadow: '0 6px 18px rgba(73, 29, 43, 0.18)',
                }}
              >
                <IconSchool size={28} color="#fff9f3" stroke={1.8} />
              </Paper>
              <Box
                pos="absolute"
                top={2}
                right={2}
                w={10}
                h={10}
                style={{
                  backgroundColor: 'var(--app-brand-accent)',
                  borderRadius: '50%',
                  border: '2px solid var(--app-sidebar-bg)',
                }}
              />
            </Box>

            <Stack gap={3} align="center">
              <Text fw={700} size="sm" c="var(--app-text-primary)" ta="center">
                {user?.institute?.name || 'معهد النور الأكاديمي'}
              </Text>
              <Badge
                size="xs"
                radius="xl"
                style={{
                  backgroundColor: 'var(--app-badge-bg)',
                  color: 'var(--app-badge-text)',
                  fontWeight: 600,
                  border: '1px solid var(--app-border)',
                }}
              >
                {branchLabel}
              </Badge>
            </Stack>

            {/* Collapse toggle button */}
            <UnstyledButton
              onClick={toggleCollapse}
              aria-label="طي القائمة الجانبية"
              pos="absolute"
              left={0}
              top={0}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: rem(6),
                borderRadius: rem(8),
                color: 'var(--app-text-secondary)',
                backgroundColor: 'var(--app-sidebar-subtle)',
                transition: 'all 120ms ease',
              }}
            >
              <IconChevronRight size={16} />
            </UnstyledButton>
          </Stack>
        )}
      </AppShell.Section>

      {/* Navigation Scroll Area */}
      <AppShell.Section grow component={ScrollArea} scrollbars="y">
        <Stack gap={6}>
          {items.map((item) => {
            const isActive = isNavItemActive(item, pathname || '/');
            const IconComponent = item.icon;

            // Collapsed Icon-Only View (Pill icons)
            if (isCollapsed) {
              const buttonStyle = {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: rem(46),
                height: rem(46),
                margin: '0 auto',
                borderRadius: rem(12),
                backgroundColor: isActive ? 'var(--app-brand-primary)' : 'transparent',
                color: isActive ? '#fff9f3' : 'var(--app-text-secondary)',
                transition: 'all 150ms ease',
                boxShadow: isActive ? '0 6px 18px rgba(73, 29, 43, 0.18)' : 'none',
              };

              if (item.href) {
                return (
                  <Tooltip
                    key={item.key}
                    label={item.label}
                    position="left"
                    withArrow
                    transitionProps={{ transition: 'fade', duration: 150 }}
                  >
                    <UnstyledButton
                      component={Link}
                      href={item.href}
                      style={buttonStyle}
                    >
                      <IconComponent size={20} stroke={1.8} />
                    </UnstyledButton>
                  </Tooltip>
                );
              }

              return (
                <Tooltip
                  key={item.key}
                  label={item.label}
                  position="left"
                  withArrow
                  transitionProps={{ transition: 'fade', duration: 150 }}
                >
                  <UnstyledButton
                    onClick={toggleCollapse}
                    style={buttonStyle}
                  >
                    <IconComponent size={20} stroke={1.8} />
                  </UnstyledButton>
                </Tooltip>
              );
            }

            // Expanded Modern Curved Tree View
            const isSectionOpen = openedSections.includes(item.key);

            if (item.subItems && item.subItems.length > 0) {
              return (
                <NavLink
                  key={item.key}
                  label={item.label}
                  leftSection={
                    <ThemeIcon
                      size={32}
                      radius="md"
                      style={{
                        backgroundColor: isActive ? 'var(--app-brand-primary)' : 'var(--app-sidebar-subtle)',
                        color: isActive ? '#fff9f3' : 'var(--app-brand-primary)',
                      }}
                    >
                      <IconComponent size={17} stroke={1.8} />
                    </ThemeIcon>
                  }
                  opened={isSectionOpen}
                  onChange={() => toggleSection(item.key)}
                  active={isActive}
                  variant="subtle"
                  styles={{
                    root: {
                      borderRadius: rem(12),
                      paddingTop: rem(9),
                      paddingBottom: rem(9),
                      paddingLeft: rem(12),
                      paddingRight: rem(12),
                      backgroundColor: isActive && !isSectionOpen ? 'var(--app-sidebar-subtle)' : undefined,
                      color: isActive ? 'var(--app-brand-primary)' : 'var(--app-text-secondary)',
                      fontWeight: isActive ? 600 : 500,
                    },
                    label: {
                      color: isActive ? 'var(--app-brand-primary)' : 'var(--app-text-secondary)',
                    },
                  }}
                >
                  <Stack gap={3} pt={4}>
                    {item.subItems.map((sub: NavSubItem) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <NavLink
                          key={sub.key}
                          component={Link}
                          href={sub.href}
                          label={sub.label}
                          active={isSubActive}
                          styles={{
                            root: {
                              borderRadius: rem(10),
                              paddingRight: rem(36),
                              paddingTop: rem(8),
                              paddingBottom: rem(8),
                              backgroundColor: isSubActive
                                ? 'var(--app-brand-primary)'
                                : 'transparent',
                              color: isSubActive
                                ? '#fff9f3'
                                : 'var(--app-text-secondary)',
                              fontWeight: isSubActive ? 600 : 400,
                              boxShadow: isSubActive
                                ? '0 4px 12px rgba(73, 29, 43, 0.14)'
                                : 'none',
                            },
                          }}
                        />
                      );
                    })}
                  </Stack>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={item.key}
                component={Link}
                href={item.href || '/'}
                label={item.label}
                leftSection={
                  <ThemeIcon
                    size={32}
                    radius="md"
                    style={{
                      backgroundColor: isActive ? 'transparent' : 'var(--app-sidebar-subtle)',
                      color: isActive ? '#fff9f3' : 'var(--app-brand-primary)',
                    }}
                  >
                    <IconComponent size={17} stroke={1.8} />
                  </ThemeIcon>
                }
                active={isActive}
                styles={{
                  root: {
                    borderRadius: rem(12),
                    paddingTop: rem(9),
                    paddingBottom: rem(9),
                    paddingLeft: rem(12),
                    paddingRight: rem(12),
                    backgroundColor: isActive ? 'var(--app-brand-primary)' : 'transparent',
                    color: isActive ? '#fff9f3' : 'var(--app-text-secondary)',
                    fontWeight: isActive ? 600 : 500,
                    boxShadow: isActive ? '0 6px 16px rgba(73, 29, 43, 0.15)' : 'none',
                    '&:hover': {
                      backgroundColor: isActive ? 'var(--app-brand-primary)' : 'var(--app-sidebar-subtle)',
                      color: isActive ? '#fff9f3' : 'var(--app-brand-primary)',
                    },
                  },
                  label: {
                    color: isActive ? '#fff9f3' : 'var(--app-text-secondary)',
                  },
                }}
              />
            );
          })}
        </Stack>
      </AppShell.Section>

      {/* Footer: Logout & Expand button */}
      <AppShell.Section pt="md" style={{ borderTop: '1px solid var(--app-border)' }}>
        {isCollapsed ? (
          <Tooltip label="توسيع القائمة" position="left" withArrow>
            <UnstyledButton
              onClick={toggleCollapse}
              aria-label="توسيع القائمة"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: rem(10),
                borderRadius: rem(10),
                color: 'var(--app-text-secondary)',
                backgroundColor: 'var(--app-sidebar-subtle)',
              }}
            >
              <IconChevronLeft size={18} />
            </UnstyledButton>
          </Tooltip>
        ) : (
          <UnstyledButton
            onClick={() => logout()}
            disabled={isLoggingOut}
            aria-label="تسجيل الخروج"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: `${rem(10)} ${rem(14)}`,
              borderRadius: rem(12),
              color: '#9b4b51',
              backgroundColor: 'var(--app-sidebar-subtle)',
              transition: 'background-color 150ms ease',
              opacity: isLoggingOut ? 0.6 : 1,
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            }}
          >
            <Group gap="xs">
              <IconLogout size={17} stroke={1.8} />
              <Text size="xs" fw={700}>
                {isLoggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}
              </Text>
            </Group>
          </UnstyledButton>
        )}
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
