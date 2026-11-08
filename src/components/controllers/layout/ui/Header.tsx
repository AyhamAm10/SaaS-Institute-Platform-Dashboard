'use client';

import { AppShell, Box, Burger, Group, Indicator, Text, TextInput, rem, useMantineColorScheme } from '@mantine/core';
import { IconBell, IconMoon, IconSearch, IconSun } from '@tabler/icons-react';
import { useSidebarMirror } from '../../sidebar/store/useSidebarMirror';
import { useLayoutMirror } from '../store/useLayoutMirror';
import { AppIconButton } from '../../button';
import { useAuth } from '@/src/core/auth';
import { UserRole } from '@/src/core/api';
import { HeaderContextSwitchers } from './HeaderContextSwitchers';
import { HeaderAccountMenu } from './HeaderAccountMenu';

export function DashboardHeader() {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN || user?.role === 'SUPER_ADMIN';

  const isMobileOpen = useSidebarMirror('isMobileOpen');
  const toggleMobile = useSidebarMirror('toggleMobile');

  const searchQuery = useLayoutMirror('searchQuery');
  const setSearchQuery = useLayoutMirror('setSearchQuery');

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

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
            <HeaderContextSwitchers />
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
          <AppIconButton label={isDark ? 'الوضع الفاتح' : 'الوضع الليلي'} onClick={() => toggleColorScheme()} size="lg">
            {isDark ? <IconSun size={18} stroke={1.6} /> : <IconMoon size={18} stroke={1.6} />}
          </AppIconButton>

          <Indicator color="brand" size={8} offset={9} withBorder processing={false}>
            <AppIconButton label="الإشعارات والتنبيهات" size="lg">
              <IconBell size={18} stroke={1.6} />
            </AppIconButton>
          </Indicator>

          <HeaderAccountMenu isSuperAdmin={isSuperAdmin} />
        </Group>
      </Group>
    </AppShell.Header>
  );
}
