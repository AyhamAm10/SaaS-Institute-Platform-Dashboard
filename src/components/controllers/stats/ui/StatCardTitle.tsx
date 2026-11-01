'use client';

import { Text } from '@mantine/core';
import { ReactNode } from 'react';

export interface StatCardTitleProps {
  children?: ReactNode;
}

export function StatCardTitle({ children }: StatCardTitleProps) {
  if (!children) return null;

  return (
    <Text
      size="xs"
      fw={500}
      style={{
        color: 'var(--app-text-secondary)',
        fontSize: 'var(--mantine-font-size-sm)',
        lineHeight: 1.3,
      }}
    >
      {children}
    </Text>
  );
}
