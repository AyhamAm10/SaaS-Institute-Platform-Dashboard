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
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  IconBell,
  IconBuildingCommunity,
  IconCalendarEvent,
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
import {
  useAcademicYearsQuery,
  useBranchesQuery,
  useOperationalContext,
  UserRole,
} from '@/src/core/api';

export function DashboardHeader() {
  const { user, logout, isLoggingOut } = useAuth();
  const queryClient = useQueryClient();

  const isSuperAdmin =
    user?.role === UserRole.SUPER_ADMIN || user?.role === 'SUPER_ADMIN';

  const isMobileOpen = useSidebarMirror('isMobileOpen');
  const toggleMobile = useSidebarMirror('toggleMobile');

  const searchQuery = useLayoutMirror('searchQuery');
  const setSearchQuery = useLayoutMirror('setSearchQuery');

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Operational Context (Active Branch and Academic Year)
  const {
    activeBranchId,
    activeAcademicYearId,
    setActiveBranchId,
    setActiveAcademicYearId,
  } = useOperationalContext();

  const { data: branches } = useBranchesQuery();
  const { data: yearsData } = useAcademicYearsQuery(
    { limit: 50 },
    { enabled: !isSuperAdmin },
  );

  // Auto-initialize active branch if not yet set
  useEffect(() => {
    if (!isSuperAdmin && !activeBranchId && branches && branches.length > 0) {
      setActiveBranchId(branches[0].id);
    }
  }, [isSuperAdmin, activeBranchId, branches, setActiveBranchId]);

  // Auto-initialize active academic year to current year if not yet set
  useEffect(() => {
    if (!isSuperAdmin && !activeAcademicYearId && yearsData?.data && yearsData.data.length > 0) {
      const currentYear = yearsData.data.find((y) => y.isCurrent) ?? yearsData.data[0];
      setActiveAcademicYearId(currentYear.id);
    }
  }, [isSuperAdmin, activeAcademicYearId, yearsData, setActiveAcademicYearId]);

  const activeBranchName =
    branches?.find((b) => b.id === activeBranchId)?.name || 'اختر الفرع';
  const activeYearName =
    yearsData?.data?.find((y) => y.id === activeAcademicYearId)?.name || 'السنة الدراسية';

  return (
    <AppShell.Header
      p="xs"
      style={{
        borderBottom: '1px solid var(--mantine-color-gray-2)',
        backgroundColor: 'var(--mantine-color-body)',
      }}
    >
      <Group justify="space-between" h="100%" px="md">
        {/* Right Section (in RTL): Section Indicator with Accent Bar & Operational Selectors */}
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
                backgroundColor: isSuperAdmin
                  ? 'var(--mantine-color-primary-6)'
                  : 'var(--mantine-color-teal-5)',
              }}
            />
            <Stack gap={0}>
              <Text size="xs" c="dimmed" fw={600}>
                {isSuperAdmin ? 'إدارة المنصة المركزية' : 'إدارة المعهد'}
              </Text>
              <Text size="sm" fw={800} style={{ letterSpacing: '-0.2px' }}>
                {isSuperAdmin ? 'لوحة تحكم المشرف العام' : 'لوحة التحكم'}
              </Text>
            </Stack>
          </Group>

          {/* Operational Context Switchers (Branch & Academic Year) - Institute Admin ONLY */}
          {!isSuperAdmin && (
            <Group gap="xs" visibleFrom="xs" ml="xs">
              {/* Branch Selector Pill */}
              <Menu shadow="md" width={220} position="bottom-start" radius="lg">
                <Menu.Target>
                  <Paper
                    px="md"
                    py={7}
                    radius="xl"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      borderColor: 'var(--mantine-color-gray-2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: rem(8),
                      transition: 'all 150ms ease',
                    }}
                  >
                    <IconBuildingCommunity size={16} color="var(--mantine-color-teal-6)" />
                    <Text size="xs" fw={700} lineClamp={1}>
                      {activeBranchName}
                    </Text>
                    <IconChevronDown size={13} color="var(--mantine-color-dimmed)" />
                  </Paper>
                </Menu.Target>
                <Menu.Dropdown p="xs">
                  <Menu.Label>الفرع الجغرافي النشط</Menu.Label>
                  {(branches || []).map((b) => {
                    const isSelected = b.id === activeBranchId;
                    return (
                      <Menu.Item
                        key={b.id}
                        leftSection={<IconBuildingCommunity size={14} />}
                        style={{ fontWeight: isSelected ? 700 : 500 }}
                        color={isSelected ? 'teal' : undefined}
                        onClick={() => {
                          if (b.id !== activeBranchId) {
                            setActiveBranchId(b.id);
                            queryClient.invalidateQueries();
                          }
                        }}
                      >
                        {b.name}
                      </Menu.Item>
                    );
                  })}
                </Menu.Dropdown>
              </Menu>

              {/* Academic Year Selector Pill */}
              <Menu shadow="md" width={220} position="bottom-start" radius="lg">
                <Menu.Target>
                  <Paper
                    px="md"
                    py={7}
                    radius="xl"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      borderColor: 'var(--mantine-color-gray-2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: rem(8),
                      transition: 'all 150ms ease',
                    }}
                  >
                    <IconCalendarEvent size={16} color="var(--mantine-color-primary-6)" />
                    <Text size="xs" fw={700} lineClamp={1}>
                      {activeYearName}
                    </Text>
                    <IconChevronDown size={13} color="var(--mantine-color-dimmed)" />
                  </Paper>
                </Menu.Target>
                <Menu.Dropdown p="xs">
                  <Menu.Label>الدورة الأكاديمية النشطة</Menu.Label>
                  {(yearsData?.data || []).map((y) => {
                    const isSelected = y.id === activeAcademicYearId;
                    return (
                      <Menu.Item
                        key={y.id}
                        leftSection={<IconCalendarEvent size={14} />}
                        style={{ fontWeight: isSelected ? 700 : 500 }}
                        color={isSelected ? 'primary' : undefined}
                        onClick={() => {
                          if (y.id !== activeAcademicYearId) {
                            setActiveAcademicYearId(y.id);
                            queryClient.invalidateQueries();
                          }
                        }}
                      >
                        {y.name} {y.isCurrent ? '(الحالية)' : ''}
                      </Menu.Item>
                    );
                  })}
                </Menu.Dropdown>
              </Menu>
            </Group>
          )}
        </Group>

        {/* Center Section: Modern Curved Search Pill */}
        <Box style={{ flex: 1, maxWidth: rem(460) }} visibleFrom="sm" mx="lg">
          <TextInput
            placeholder="البحث عن..."
            size="sm"
            radius="xl"
            rightSection={<IconSearch size={16} stroke={2} color="var(--mantine-color-gray-5)" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            styles={{
              input: {
                backgroundColor: 'var(--mantine-color-gray-0)',
                border: '1px solid var(--mantine-color-gray-2)',
                height: rem(42),
                borderRadius: rem(9999),
                paddingRight: rem(38),
                transition: 'all 150ms ease',
                '&:focus': {
                  backgroundColor: '#ffffff',
                  borderColor: 'var(--mantine-color-primary-4)',
                  boxShadow: '0 0 0 3px rgba(32, 183, 223, 0.12)',
                },
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
                px="sm"
                py={5}
                radius="xl"
                withBorder
                style={{
                  cursor: 'pointer',
                  borderColor: 'var(--mantine-color-gray-2)',
                  backgroundColor: 'var(--mantine-color-body)',
                  transition: 'all 150ms ease',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
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
                      {user?.fullName || (isSuperAdmin ? 'المشرف العام' : 'مدير النظام')}
                    </Text>
                    <Text size="10px" c="dimmed">
                      {isSuperAdmin
                        ? 'المشرف العام للنظام'
                        : user?.institute?.name || 'الفرع الرئيسي'}
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
