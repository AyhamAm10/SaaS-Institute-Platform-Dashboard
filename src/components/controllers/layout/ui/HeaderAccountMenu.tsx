'use client';

import { Avatar, Menu, Stack, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronDown, IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { useAuth } from '@/src/core/auth';

/** Signed-in account pill and its menu (profile, settings, sign out). */
export function HeaderAccountMenu({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const { user, logout, isLoggingOut } = useAuth();
  const displayName = user?.fullName || (isSuperAdmin ? 'المشرف العام' : 'مدير النظام');

  return (
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
  );
}
