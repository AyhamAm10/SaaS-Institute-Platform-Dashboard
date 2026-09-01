'use client';

import {
  Badge,
  Box,
  Drawer,
  Group,
  NavLink,
  Paper,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { IconLogout, IconSchool } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSidebarMirror } from '../../store/useSidebarMirror';
import { isNavItemActive } from '../../utils/nav.utils';
import { NavSubItem } from '../../init/navigation';

export function MobileSidebar() {
  const items = useSidebarMirror('items');
  const isOpen = useSidebarMirror('isMobileOpen');
  const close = useSidebarMirror('closeMobile');
  const openedSections = useSidebarMirror('openedSections');
  const toggleSection = useSidebarMirror('toggleSection');
  const setActiveRoute = useSidebarMirror('setActiveRoute');

  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      setActiveRoute(pathname);
      close(); // Auto-close drawer on route change
    }
  }, [pathname, setActiveRoute, close]);

  return (
    <Drawer
      opened={isOpen}
      onClose={close}
      size="280px"
      padding="md"
      position="right"
      hiddenFrom="md"
      title={
        <Group gap="xs">
          <Paper
            p="xs"
            radius="xl"
            withBorder
            style={{
              backgroundColor: 'var(--mantine-color-primary-0)',
              borderColor: 'var(--mantine-color-primary-2)',
            }}
          >
            <IconSchool size={20} color="var(--mantine-color-primary-6)" />
          </Paper>
          <Stack gap={0}>
            <Text fw={700} size="sm">
              معهد النور الأكاديمي
            </Text>
            <Badge variant="light" color="primary" size="xs" radius="xl">
              الفرع الرئيسي
            </Badge>
          </Stack>
        </Group>
      }
    >
      <ScrollArea h="calc(100vh - 120px)" offsetScrollbars>
        <Stack gap="xs" pt="sm">
          {items.map((item) => {
            const isActive = isNavItemActive(item, pathname || '/');
            const IconComponent = item.icon;
            const isSectionOpen = openedSections.includes(item.key);

            if (item.subItems && item.subItems.length > 0) {
              return (
                <NavLink
                  key={item.key}
                  label={item.label}
                  leftSection={
                    <ThemeIcon
                      size={30}
                      radius="md"
                      variant={isActive ? 'filled' : 'light'}
                      color={isActive ? 'primary' : 'gray'}
                    >
                      <IconComponent size={16} stroke={1.6} />
                    </ThemeIcon>
                  }
                  opened={isSectionOpen}
                  onChange={() => toggleSection(item.key)}
                  active={isActive}
                  variant="subtle"
                  styles={{
                    root: {
                      borderRadius: rem(12),
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
                              paddingRight: rem(32),
                              backgroundColor: isSubActive
                                ? 'var(--mantine-color-primary-0)'
                                : 'transparent',
                              color: isSubActive
                                ? 'var(--mantine-color-primary-7)'
                                : 'var(--mantine-color-dimmed)',
                              fontWeight: isSubActive ? 700 : 500,
                            },
                          }}
                          onClick={close}
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
                    size={30}
                    radius="md"
                    variant={isActive ? 'filled' : 'light'}
                    color={isActive ? 'primary' : 'gray'}
                  >
                    <IconComponent size={16} stroke={1.6} />
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
                onClick={close}
              />
            );
          })}
        </Stack>
      </ScrollArea>

      <Box pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
        <UnstyledButton
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: rem(8),
            borderRadius: rem(10),
            color: 'var(--mantine-color-red-6)',
            backgroundColor: 'var(--mantine-color-red-0)',
          }}
        >
          <Group gap="xs">
            <IconLogout size={16} stroke={1.8} />
            <Text size="xs" fw={700}>
              تسجيل الخروج
            </Text>
          </Group>
        </UnstyledButton>
      </Box>
    </Drawer>
  );
}
