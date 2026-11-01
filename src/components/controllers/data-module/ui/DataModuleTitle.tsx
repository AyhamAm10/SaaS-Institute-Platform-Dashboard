'use client';

import { Box, Group, Stack, Text, Title, rem } from '@mantine/core';
import { ReactNode } from 'react';
import { StatusBadge } from '../../badge';
import { formatNumber } from '@/src/core/format';
import { useDataModuleMirror } from '../store/useDataModuleMirror';

export interface DataModuleTitleProps {
  title?: string;
  description?: string;
  showBadge?: boolean;
  badgeLabel?: string;
  icon?: ReactNode;
}

export function DataModuleTitle(props: DataModuleTitleProps) {
  const storeTitle = useDataModuleMirror('title');
  const storeDescription = useDataModuleMirror('description');
  const total = useDataModuleMirror('total');

  const title = props.title ?? storeTitle;
  const description = props.description ?? storeDescription;
  const showBadge = props.showBadge ?? true;

  return (
    <Stack gap={6}>
      <Group gap="sm" align="center">
        {props.icon && (
          <Box style={{ display: 'inline-flex', color: 'var(--app-brand-accent)' }}>{props.icon}</Box>
        )}
        <Title order={1} fw={600} style={{ fontSize: rem(26), letterSpacing: '-0.01em' }}>
          {title}
        </Title>
        {showBadge && total !== undefined && (
          <StatusBadge tone="brand">
            {props.badgeLabel ? `${formatNumber(total)} ${props.badgeLabel}` : formatNumber(total)}
          </StatusBadge>
        )}
      </Group>
      {description && (
        <Text fw={300} style={{ fontSize: rem(13.5), lineHeight: 1.6, color: 'var(--app-text-secondary)' }}>
          {description}
        </Text>
      )}
    </Stack>
  );
}
