'use client';

import type { ReactNode } from 'react';
import { Center, Stack, Text, rem } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';

export interface AppEmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}

/** Empty / no-results state: glass orb icon, short title, quiet description, optional action. */
export function AppEmptyState({ title, description, icon, action, compact }: AppEmptyStateProps) {
  const orb = compact ? 52 : 68;

  return (
    <Stack align="center" gap="xs" py={compact ? 'lg' : 'xl'} style={{ textAlign: 'center' }}>
      <Center
        mb={6}
        style={{
          width: rem(orb),
          height: rem(orb),
          borderRadius: '50%',
          color: 'var(--app-brand-accent)',
          backgroundColor: 'var(--app-glass-bg-strong)',
          border: '1px solid var(--app-glass-border)',
          boxShadow: 'var(--app-glass-highlight), var(--app-elev-1), 0 0 0 6px var(--app-brand-accent-soft)',
        }}
      >
        {icon ?? <IconInbox size={compact ? 22 : 28} stroke={1.5} />}
      </Center>
      <Text fw={500} size={compact ? 'sm' : 'md'} c="var(--app-text-primary)">
        {title}
      </Text>
      {description && (
        <Text size="sm" fw={300} c="var(--app-text-secondary)" maw={360}>
          {description}
        </Text>
      )}
      {action && <Stack mt="sm">{action}</Stack>}
    </Stack>
  );
}
