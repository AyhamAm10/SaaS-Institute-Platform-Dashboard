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

export function DesktopSidebar() {
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
        transition: 'width 250ms ease, padding 250ms ease',
        overflow: 'hidden',
        borderLeft: '1px solid var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      {/* Brand Header */}
      <AppShell.Section mb="lg">
        {isCollapsed ? (
          <Stack align="center" gap="xs">
            <ThemeIcon
              size={44}
              radius="xl"
              variant="light"
              color="primary"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
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
                withBorder
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--mantine-color-primary-0)',
                  borderColor: 'var(--mantine-color-primary-2)',
                  width: rem(64),
                  height: rem(64),
                  borderRadius: '50%',
                }}
              >
                <IconSchool size={30} color="var(--mantine-color-primary-6)" stroke={1.8} />
              </Paper>
              <Box
                pos="absolute"
                top={2}
                right={2}
                w={10}
                h={10}
                style={{
                  backgroundColor: 'var(--mantine-color-teal-5)',
                  borderRadius: '50%',
                  border: '2px solid white',
                }}
              />
            </Box>

            <Stack gap={2} align="center">
              <Text fw={800} size="sm" ta="center">
                معهد النور الأكاديمي
              </Text>
              <Badge variant="light" color="primary" size="xs" radius="xl">
                الفرع الرئيسي
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
                color: 'var(--mantine-color-dimmed)',
                backgroundColor: 'var(--mantine-color-gray-0)',
              }}
            >
              <IconChevronRight size={16} />
            </UnstyledButton>
          </Stack>
        )}
      </AppShell.Section>

      {/* Navigation Scroll Area */}
      <AppShell.Section grow component={ScrollArea} scrollbars="y">
        <Stack gap="xs">
          {items.map((item) => {
            const isActive = isNavItemActive(item, pathname || '/');
            const IconComponent = item.icon;

            // Collapsed Icon-Only View (Pill icons)
            if (isCollapsed) {
              const buttonStyle = {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: rem(48),
                height: rem(48),
                margin: '0 auto',
                borderRadius: rem(14),
                backgroundColor: isActive ? 'var(--mantine-color-primary-6)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--mantine-color-gray-7)',
                transition: 'all 150ms ease',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
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
                      <IconComponent size={22} stroke={1.6} />
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
                    <IconComponent size={22} stroke={1.6} />
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
                      radius="lg"
                      variant={isActive ? 'filled' : 'light'}
                      color={isActive ? 'primary' : 'gray'}
                    >
                      <IconComponent size={18} stroke={1.6} />
                    </ThemeIcon>
                  }
                  opened={isSectionOpen}
                  onChange={() => toggleSection(item.key)}
                  active={isActive}
                  variant="subtle"
                  styles={{
                    root: {
                      borderRadius: rem(12),
                      backgroundColor: isActive && !isSectionOpen ? 'var(--mantine-color-primary-0)' : undefined,
                    },
                  }}
                >
                  <Stack gap={4} pt={4}>
                    {item.subItems.map((sub: NavSubItem) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <NavLink
                          key={sub.key}
                          component={Link}
                          href={sub.href}
                          label={sub.label}
                          active={isSubActive}
                          variant="filled"
                          color="primary"
                          styles={{
                            root: {
                              borderRadius: rem(10),
                              paddingRight: rem(36),
                              backgroundColor: isSubActive
                                ? 'var(--mantine-color-primary-0)'
                                : 'transparent',
                              color: isSubActive
                                ? 'var(--mantine-color-primary-7)'
                                : 'var(--mantine-color-dimmed)',
                              fontWeight: isSubActive ? 700 : 500,
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
                    radius="lg"
                    variant={isActive ? 'filled' : 'light'}
                    color={isActive ? 'primary' : 'gray'}
                  >
                    <IconComponent size={18} stroke={1.6} />
                  </ThemeIcon>
                }
                active={isActive}
                variant="light"
                styles={{
                  root: {
                    borderRadius: rem(12),
                    backgroundColor: isActive ? 'var(--mantine-color-primary-0)' : undefined,
                    color: isActive ? 'var(--mantine-color-primary-7)' : undefined,
                  },
                }}
              />
            );
          })}
        </Stack>
      </AppShell.Section>

      {/* Footer: Logout & Expand button */}
      <AppShell.Section pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
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
                padding: rem(8),
                borderRadius: rem(10),
                color: 'var(--mantine-color-dimmed)',
              }}
            >
              <IconChevronLeft size={20} />
            </UnstyledButton>
          </Tooltip>
        ) : (
          <UnstyledButton
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: rem(10),
              borderRadius: rem(12),
              color: 'var(--mantine-color-red-6)',
              backgroundColor: 'var(--mantine-color-red-0)',
              transition: 'background-color 150ms ease',
            }}
          >
            <Group gap="xs">
              <IconLogout size={18} stroke={1.8} />
              <Text size="xs" fw={700}>
                تسجيل الخروج
              </Text>
            </Group>
          </UnstyledButton>
        )}
      </AppShell.Section>
    </AppShell.Navbar>
  );
}
