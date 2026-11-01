'use client';

import { Group, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useAuth } from '@/src/core/auth';

export interface SidebarLogoutProps {
  compact?: boolean;
  onBeforeLogout?: () => void;
}

export function SidebarLogout({ compact, onBeforeLogout }: SidebarLogoutProps) {
  const { logout, isLoggingOut } = useAuth();
  const label = isLoggingOut ? 'جاري الخروج...' : 'تسجيل الخروج';

  const handleClick = () => {
    onBeforeLogout?.();
    logout();
  };

  if (compact) {
    return (
      <Tooltip label={label} position="left">
        <UnstyledButton className="app-nav-icon" onClick={handleClick} disabled={isLoggingOut} aria-label={label}>
          <IconLogout size={19} stroke={1.6} />
        </UnstyledButton>
      </Tooltip>
    );
  }

  return (
    <UnstyledButton
      className="app-nav-link"
      onClick={handleClick}
      disabled={isLoggingOut}
      aria-label={label}
      style={{
        width: '100%',
        padding: '10px 12px',
        borderRadius: 'var(--app-radius-md)',
        opacity: isLoggingOut ? 0.6 : 1,
        cursor: isLoggingOut ? 'not-allowed' : 'pointer',
      }}
    >
      <Group gap="sm" wrap="nowrap">
        <IconLogout size={19} stroke={1.6} />
        <Text size="sm" fw={400}>
          {label}
        </Text>
      </Group>
    </UnstyledButton>
  );
}
