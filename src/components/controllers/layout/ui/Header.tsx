'use client';

import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  TextInput,
  rem,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconBell,
  IconChevronDown,
  IconLogout,
  IconMoon,
  IconSearch,
  IconSettings,
  IconSun,
  IconUser,
} from '@tabler/icons-react';
import { useSidebarMirror } from '../../sidebar/store/useSidebarMirror';
import { useLayoutMirror } from '../store/useLayoutMirror';
import { useAuth } from '@/src/core/auth';

export function DashboardHeader() {
  const { user, logout, isLoggingOut } = useAuth();

  const isMobileOpen = useSidebarMirror('isMobileOpen');
  const toggleMobile = useSidebarMirror('toggleMobile');

  const searchQuery = useLayoutMirror('searchQuery');
  const setSearchQuery = useLayoutMirror('setSearchQuery');

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <AppShell.Header
      p="xs"
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      <Group justify="space-between" h="100%" px="md">
        {/* Right Section (in RTL): Section Indicator with Accent Bar */}
        <Group gap="md">
          <Burger
            opened={isMobileOpen}
            onClick={toggleMobile}
            hiddenFrom="md"
            size="sm"
            aria-label="تبديل القائمة الجانبية"
          />

          <Group gap="xs">
            <Box
              w={4}
              h={28}
              style={{
                borderRadius: rem(4),
                backgroundColor: 'var(--mantine-color-teal-5)',
              }}
            />
            <Stack gap={0}>
              <Text size="xs" c="dimmed" fw={600}>
                إدارة المعهد
              </Text>
              <Text size="sm" fw={800} style={{ letterSpacing: '-0.2px' }}>
                لوحة التحكم
              </Text>
            </Stack>
          </Group>
        </Group>

        {/* Center Section: Modern Curved Search Pill */}
        <Box style={{ flex: 1, maxWidth: rem(460) }} visibleFrom="sm" mx="lg">
          <TextInput
            placeholder="البحث عن..."
            size="sm"
            radius="xl"
            rightSection={<IconSearch size={16} stroke={2} color="var(--mantine-color-primary-6)" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            styles={{
              input: {
                backgroundColor: 'var(--mantine-color-gray-0)',
                border: '1px solid var(--mantine-color-gray-2)',
                paddingRight: rem(38),
              },
            }}
          />
        </Box>

        {/* Left Section (in RTL): User Profile Pill & Quick Actions */}
        <Group gap="sm">
          {/* Color Scheme Toggle */}
          <ActionIcon
            variant="light"
            size="lg"
            radius="xl"
            onClick={() => toggleColorScheme()}
            aria-label="تبديل المظهر"
          >
            {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>

          {/* Notifications */}
          <ActionIcon
            variant="light"
            size="lg"
            radius="xl"
            color="gray"
            aria-label="الإشعارات والتنبيهات"
          >
            <IconBell size={18} />
          </ActionIcon>

          {/* User Profile Pill Menu */}
          <Menu shadow="lg" width={220} position="bottom-start" radius="lg">
            <Menu.Target>
              <Paper
                p="xs"
                radius="xl"
                withBorder
                style={{
                  cursor: 'pointer',
                  borderColor: 'var(--mantine-color-gray-2)',
                  transition: 'background-color 150ms ease',
                }}
              >
                <Group gap="xs" wrap="nowrap">
                  <Avatar
                    src={null}
                    alt={user?.fullName || 'مدير النظام'}
                    color="primary"
                    radius="xl"
                    size="sm"
                  >
                    {user?.fullName ? user.fullName.slice(0, 2) : 'من'}
                  </Avatar>
                  <Stack gap={0} visibleFrom="sm" pr="xs">
                    <Text size="xs" fw={700} lineClamp={1}>
                      {user?.fullName || 'مدير النظام'}
                    </Text>
                    <Text size="10px" c="dimmed">
                      {user?.institute?.name || 'الفرع الرئيسي'}
                    </Text>
                  </Stack>
                  <IconChevronDown size={14} color="var(--mantine-color-dimmed)" />
                </Group>
              </Paper>
            </Menu.Target>

            <Menu.Dropdown p="xs">
              <Menu.Label>إدارة الحساب</Menu.Label>
              <Menu.Item leftSection={<IconUser size={15} />}>
                الملف التعريفي
              </Menu.Item>
              <Menu.Item leftSection={<IconSettings size={15} />}>
                إعدادات المعهد
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<IconLogout size={15} />}
                onClick={() => logout()}
                disabled={isLoggingOut}
              >
                تسجيل الخروج
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </AppShell.Header>
  );
}
