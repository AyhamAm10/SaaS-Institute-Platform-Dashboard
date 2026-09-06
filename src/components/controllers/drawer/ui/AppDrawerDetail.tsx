'use client';

import { Group, Skeleton, Stack, Text, ThemeIcon } from '@mantine/core';
import { ReactNode } from 'react';

export interface AppDrawerDetailProps {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  iconColor?: string;
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

export function AppDrawerDetail({
  label,
  value,
  icon,
  iconColor = 'gray',
  loading = false,
  emptyText = '—',
  className,
}: AppDrawerDetailProps) {
  if (loading) {
    return (
      <Group justify="space-between" align="center" py={6} className={className}>
        <Skeleton height={14} width={80} radius="sm" />
        <Skeleton height={14} width={120} radius="sm" />
      </Group>
    );
  }

  const isValueEmpty =
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0);

  return (
    <Group justify="space-between" align="center" py={6} className={className} wrap="nowrap">
      <Group gap="xs" align="center" style={{ minWidth: 0 }}>
        {icon && (
          <ThemeIcon size="sm" variant="transparent" color={iconColor}>
            {icon}
          </ThemeIcon>
        )}
        <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
          {label}
        </Text>
      </Group>

      <Text
        size="sm"
        fw={600}
        c={isValueEmpty ? 'dimmed' : 'var(--mantine-color-text)'}
        ta="left"
        style={{
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {isValueEmpty ? emptyText : value}
      </Text>
    </Group>
  );
}
