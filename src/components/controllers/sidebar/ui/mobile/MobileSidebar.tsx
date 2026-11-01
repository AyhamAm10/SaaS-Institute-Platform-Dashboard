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
import { useAuth } from '@/src/core/auth';
import { useBranchesQuery, useOperationalContext } from '@/src/core/api';

export function MobileSidebar() {
  const { user, logout, isLoggingOut } = useAuth();
  const { activeBranchId } = useOperationalContext();
  const { data: branches } = useBranchesQuery();
  const activeBranch = branches?.find((b) => b.id === activeBranchId);
  const branchLabel =
    user?.role === 'SUPER_ADMIN'
      ? 'المدير العام'
      : activeBranch?.name || 'الفرع الرئيسي';

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
      styles={{
        content: {
          backgroundColor: 'var(--app-sidebar-bg)',
          color: 'var(--app-text-primary)',
        },
        header: {
          backgroundColor: 'var(--app-sidebar-bg)',
          borderBottom: '1px solid var(--app-border)',
          color: 'var(--app-text-primary)',
        },
      }}
      title={
        <Group gap="xs">
          <Paper
            p="xs"
            radius="xl"
            style={{
              backgroundColor: 'var(--app-brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: rem(36),
              height: rem(36),
            }}
          >
            <IconSchool size={20} color="var(--app-text-on-brand)" />
          </Paper>
          <Stack gap={0}>
            <Text fw={700} size="sm" c="var(--app-text-primary)">
              {user?.institute?.name || 'معهد النور الأكاديمي'}
            </Text>
            <Badge
              size="xs"
              radius="xl"
              style={{
                backgroundColor: 'var(--app-badge-bg)',
                color: 'var(--app-badge-text)',
                fontWeight: 500,
                border: '1px solid var(--app-border)',
              }}
            >
              {branchLabel}
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
                    <ThemeIcon size={30} radius="md" className="app-nav-link-icon">
                      <IconComponent size={16} stroke={1.8} />
                    </ThemeIcon>
                  }
                  opened={isSectionOpen}
                  onChange={() => toggleSection(item.key)}
                  active={isActive}
                  variant="subtle"
                  className="app-nav-link app-nav-link--group"
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
                          className="app-nav-link app-nav-link--sub"
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
                  <ThemeIcon size={30} radius="md" className="app-nav-link-icon">
                    <IconComponent size={16} stroke={1.8} />
                  </ThemeIcon>
                }
                active={isActive}
                className="app-nav-link"
                onClick={close}
              />
            );
          })}
        </Stack>
      </ScrollArea>

      <Box pt="md" style={{ borderTop: '1px solid var(--app-border)' }}>
        <UnstyledButton
          onClick={() => {
            close();
            logout();
          }}
          disabled={isLoggingOut}
          aria-label="تسجيل الخروج"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: rem(8),
            borderRadius: 'var(--mantine-radius-md)',
            color: 'var(--mantine-color-danger-6)',
            backgroundColor: 'var(--app-sidebar-subtle)',
            opacity: isLoggingOut ? 0.6 : 1,
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
          }}
        >
          <Group gap="xs">
            <IconLogout size={16} stroke={1.8} />
            <Text size="xs" fw={700}>
              {isLoggingOut ? 'جاري الخروج...' : 'تسجيل الخروج'}
            </Text>
          </Group>
        </UnstyledButton>
      </Box>
    </Drawer>
  );
}
