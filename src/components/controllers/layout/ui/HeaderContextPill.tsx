'use client';

import { ReactNode } from 'react';
import { Box, Text, UnstyledButton, rem } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';

interface ContextPillProps {
  icon: ReactNode;
  label: string;
  accent?: boolean;
}

/** Glass pill used as a menu trigger for the operational context switchers. */
export function ContextPill({ icon, label, accent }: ContextPillProps) {
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
      <Box style={{ display: 'flex', color: accent ? 'var(--app-brand-accent)' : 'var(--app-text-secondary)' }}>
        {icon}
      </Box>
      <Text size="sm" fw={400} lineClamp={1}>
        {label}
      </Text>
      <IconChevronDown size={14} color="var(--app-text-muted)" />
    </UnstyledButton>
  );
}
