'use client';

import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  Indicator,
  Menu,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  rem,
  useMantineColorScheme,
} from '@mantine/core';
import { ReactNode, useEffect } from 'react';
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
import { AppIconButton } from '../../button';
import { useAuth } from '@/src/core/auth';
import {
  useAcademicYearsQuery,
  useBranchesQuery,
  useOperationalContext,
  UserRole,
} from '@/src/core/api';

interface ContextPillProps {
  icon: ReactNode;
  label: string;
  accent?: boolean;
}

/** Glass pill used as a menu trigger for the operational context switchers. */
function ContextPill({ icon, label, accent }: ContextPillProps) {
  return (
    <UnstyledButton
      className="app-pill-trigger"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: rem(8),
        height: rem(40),
        padding: `0 ${rem(14)}`,
        borderRadius: 'var(--app-radius-pill)',
        border: '1px solid var(--app-border)',
        backgroundColor: 'var(--app-glass-bg)',
        color: 'var(--app-text-primary)',
      }}
    >
      <Box style={{ display: 'flex', color: accent ? 'var(--app-brand-accent)' : 'var(--app-text-secondary)' }}>{icon}</Box>
      <Text size="sm" fw={400} lineClamp={1}>
        {label}
      </Text>
      <IconChevronDown size={14} color="var(--app-text-muted)" />
    </UnstyledButton>
  );
}

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

  // Auto-initialize active branch if not yet set or if stored ID does not exist in branches
  useEffect(() => {
    if (!isSuperAdmin && branches && branches.length > 0) {
      const branchExists = branches.some((b) => b.id === activeBranchId);
      if (!activeBranchId || !branchExists) {
        setActiveBranchId(branches[0].id);
      }
    }
  }, [isSuperAdmin, activeBranchId, branches, setActiveBranchId]);

  // Auto-initialize active academic year to current year if not yet set or invalid
  useEffect(() => {
    if (!isSuperAdmin && yearsData?.data && yearsData.data.length > 0) {
      const yearExists = yearsData.data.some((y) => y.id === activeAcademicYearId);
      if (!activeAcademicYearId || !yearExists) {
        const currentYear = yearsData.data.find((y) => y.isCurrent) ?? yearsData.data[0];
        setActiveAcademicYearId(currentYear.id);
      }
    }
  }, [isSuperAdmin, activeAcademicYearId, yearsData, setActiveAcademicYearId]);

  const activeBranchName =
    branches?.find((b) => b.id === activeBranchId)?.name || 'اختر الفرع';
  const activeYearName =
    yearsData?.data?.find((y) => y.id === activeAcademicYearId)?.name || 'السنة الدراسية';

  const displayName = user?.fullName || (isSuperAdmin ? 'المشرف العام' : 'مدير النظام');

  return (
    <AppShell.Header px={{ base: rem(12), md: rem(12) }} pt={rem(12)} pb={rem(4)}>
      <Group
        className="app-glass"
        justify="space-between"
        wrap="nowrap"
        h="100%"
        gap="sm"
        px={rem(12)}
        style={{
          borderRadius: 'var(--app-radius-lg)',
          backgroundColor: 'var(--app-header-bg)',
        }}
      >
        {/* Start (right in RTL): menu toggle, context switchers */}
        <Group gap="sm" wrap="nowrap">
          <Burger
            opened={isMobileOpen}
            onClick={toggleMobile}
            hiddenFrom="md"
            size="sm"
            aria-label="تبديل القائمة الجانبية"
          />

          {isSuperAdmin ? (
            <Text size="sm" fw={500} c="var(--app-text-primary)" visibleFrom="xs">
              لوحة تحكم المشرف العام
            </Text>
          ) : (
            <Group gap="xs" wrap="nowrap" visibleFrom="xs">
              <Menu width={240} position="bottom-start">
                <Menu.Target>
                  <Box>
                    <ContextPill icon={<IconBuildingCommunity size={16} stroke={1.6} />} label={activeBranchName} accent />
                  </Box>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>الفرع النشط</Menu.Label>
                  {(branches || []).map((b) => {
                    const isSelected = b.id === activeBranchId;
                    return (
                      <Menu.Item
                        key={b.id}
                        leftSection={<IconBuildingCommunity size={15} stroke={1.6} />}
                        style={{ fontWeight: isSelected ? 500 : 400 }}
                        color={isSelected ? 'brand' : undefined}
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

              <Menu width={240} position="bottom-start">
                <Menu.Target>
                  <Box visibleFrom="sm">
                    <ContextPill icon={<IconCalendarEvent size={16} stroke={1.6} />} label={activeYearName} />
                  </Box>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>السنة الدراسية النشطة</Menu.Label>
                  {(yearsData?.data || []).map((y) => {
                    const isSelected = y.id === activeAcademicYearId;
                    return (
                      <Menu.Item
                        key={y.id}
                        leftSection={<IconCalendarEvent size={15} stroke={1.6} />}
                        style={{ fontWeight: isSelected ? 500 : 400 }}
                        color={isSelected ? 'brand' : undefined}
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

        {/* Center: search pill */}
        <Box style={{ flex: 1, maxWidth: rem(440) }} visibleFrom="md">
          <TextInput
            placeholder="ابحث عن طالب، شعبة، مادة..."
            radius="xl"
            leftSection={<IconSearch size={16} stroke={1.6} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            styles={{ input: { borderRadius: 'var(--app-radius-pill)', minHeight: rem(40), height: rem(40) } }}
          />
        </Box>

        {/* End (left in RTL): quick actions and account */}
        <Group gap={8} wrap="nowrap">
          <AppIconButton
            label={isDark ? 'الوضع الفاتح' : 'الوضع الليلي'}
            onClick={() => toggleColorScheme()}
            size="lg"
          >
            {isDark ? <IconSun size={18} stroke={1.6} /> : <IconMoon size={18} stroke={1.6} />}
          </AppIconButton>

          <Indicator color="brand" size={8} offset={9} withBorder processing={false}>
            <AppIconButton label="الإشعارات والتنبيهات" size="lg">
              <IconBell size={18} stroke={1.6} />
            </AppIconButton>
          </Indicator>

          <Menu width={230} position="bottom-end">
            <Menu.Target>
              <UnstyledButton
                className="app-pill-trigger"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: rem(10),
                  padding: rem(4),
                  paddingInlineEnd: rem(12),
                  borderRadius: 'var(--app-radius-pill)',
                  border: '1px solid var(--app-border)',
                  backgroundColor: 'var(--app-glass-bg)',
                }}
              >
                <Avatar
                  alt={displayName}
                  radius="xl"
                  size={34}
                  styles={{
                    placeholder: {
                      background: 'linear-gradient(145deg, var(--mantine-color-brand-5), var(--mantine-color-brand-7))',
                      color: 'var(--app-text-on-brand)',
                      fontWeight: 500,
                      fontSize: rem(13),
                      border: 0,
                    },
                  }}
                >
                  {user?.fullName ? user.fullName.slice(0, 1) : 'م'}
                </Avatar>
                <Stack gap={0} visibleFrom="sm">
                  <Text size="sm" fw={500} c="var(--app-text-primary)" lineClamp={1}>
                    {displayName}
                  </Text>
                  <Text size="xs" fw={300} c="var(--app-text-muted)" lineClamp={1}>
                    {isSuperAdmin ? 'المشرف العام للنظام' : user?.institute?.name || 'الفرع الرئيسي'}
                  </Text>
                </Stack>
                <IconChevronDown size={14} color="var(--app-text-muted)" />
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>إدارة الحساب</Menu.Label>
              <Menu.Item leftSection={<IconUser size={15} stroke={1.6} />}>الملف التعريفي</Menu.Item>
              <Menu.Item leftSection={<IconSettings size={15} stroke={1.6} />}>إعدادات المعهد</Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="danger"
                leftSection={<IconLogout size={15} stroke={1.6} />}
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
