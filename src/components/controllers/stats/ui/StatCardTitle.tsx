'use client';

import { Text, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface StatCardTitleProps {
  children?: ReactNode;
}

export function StatCardTitle({ children }: StatCardTitleProps) {
  if (!children) return null;

  return (
    <Text
      size="xs"
      fw={600}
      style={{
        color: 'var(--app-text-secondary)',
        fontSize: rem(13),
        lineHeight: 1.3,
      }}
    >
      {children}
    </Text>
  );
}
