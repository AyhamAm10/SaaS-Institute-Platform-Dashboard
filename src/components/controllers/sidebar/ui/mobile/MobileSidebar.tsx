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
          backgroundColor: '#fbf7f2',
        },
        header: {
          backgroundColor: '#fbf7f2',
          borderBottom: '1px solid #e5d9cf',
        },
      }}
      title={
        <Group gap="xs">
          <Paper
            p="xs"
            radius="xl"
            style={{
              backgroundColor: '#491d2b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: rem(36),
              height: rem(36),
            }}
          >
            <IconSchool size={20} color="#fff9f3" />
          </Paper>
          <Stack gap={0}>
            <Text fw={700} size="sm" c="#351b25">
              {user?.institute?.name || 'معهد النور الأكاديمي'}
            </Text>
            <Badge
              size="xs"
              radius="xl"
              style={{
                backgroundColor: '#f0e3d8',
                color: '#8b6a34',
                fontWeight: 600,
                border: '1px solid #e5d9cf',
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
                    <ThemeIcon
                      size={30}
                      radius="md"
                      style={{
                        backgroundColor: isActive ? '#491d2b' : '#f0e3d8',
                        color: isActive ? '#fff9f3' : '#491d2b',
                      }}
                    >
                      <IconComponent size={16} stroke={1.8} />
                    </ThemeIcon>
                  }
                  opened={isSectionOpen}
                  onChange={() => toggleSection(item.key)}
                  active={isActive}
                  variant="subtle"
                  styles={{
                    root: {
                      borderRadius: rem(12),
                      paddingTop: rem(8),
                      paddingBottom: rem(8),
                      paddingLeft: rem(12),
                      paddingRight: rem(12),
                      backgroundColor: isActive && !isSectionOpen ? '#f0e3d8' : undefined,
                      color: isActive ? '#491d2b' : '#806c69',
                      fontWeight: isActive ? 600 : 500,
                    },
                    label: {
                      color: isActive ? '#491d2b' : '#806c69',
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
                              paddingRight: rem(34),
                              paddingTop: rem(7),
                              paddingBottom: rem(7),
                              backgroundColor: isSubActive
                                ? '#491d2b'
                                : 'transparent',
                              color: isSubActive
                                ? '#fff9f3'
                                : '#806c69',
                              fontWeight: isSubActive ? 600 : 400,
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
                    style={{
                      backgroundColor: isActive ? 'transparent' : '#f0e3d8',
                      color: isActive ? '#fff9f3' : '#491d2b',
                    }}
                  >
                    <IconComponent size={16} stroke={1.8} />
                  </ThemeIcon>
                }
                active={isActive}
                styles={{
                  root: {
                    borderRadius: rem(12),
                    paddingTop: rem(8),
                    paddingBottom: rem(8),
                    paddingLeft: rem(12),
                    paddingRight: rem(12),
                    backgroundColor: isActive ? '#491d2b' : 'transparent',
                    color: isActive ? '#fff9f3' : '#806c69',
                    fontWeight: isActive ? 600 : 500,
                    boxShadow: isActive ? '0 4px 12px rgba(73, 29, 43, 0.14)' : 'none',
                  },
                  label: {
                    color: isActive ? '#fff9f3' : '#806c69',
                  },
                }}
                onClick={close}
              />
            );
          })}
        </Stack>
      </ScrollArea>

      <Box pt="md" style={{ borderTop: '1px solid #e5d9cf' }}>
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
            borderRadius: rem(10),
            color: '#9b4b51',
            backgroundColor: '#f5e6e8',
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
