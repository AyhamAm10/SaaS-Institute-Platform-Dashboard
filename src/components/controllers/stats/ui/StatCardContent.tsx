'use client';

import { Box, Text, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface StatCardContentProps {
  children?: ReactNode;
  subtitle?: ReactNode;
}

/** Large, light-weight figure (the reference "3D" dashboards favour big but airy numbers). */
export function StatCardContent({ children, subtitle }: StatCardContentProps) {
  return (
    <Box my={rem(4)}>
      <Text
        fw={500}
        style={{
          fontSize: rem(36),
          lineHeight: 1.05,
          color: 'var(--app-text-primary)',
          letterSpacing: '-0.02em',
        }}
      >
        {children}
      </Text>
      {subtitle && (
        <Text size="xs" fw={300} c="var(--app-text-muted)" mt={rem(6)}>
          {subtitle}
        </Text>
      )}
    </Box>
  );
}
