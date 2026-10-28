'use client';

import { Box, Text, rem } from '@mantine/core';
import { ReactNode } from 'react';

export interface StatCardContentProps {
  children?: ReactNode;
  subtitle?: ReactNode;
}

export function StatCardContent({ children, subtitle }: StatCardContentProps) {
  return (
    <Box my={rem(6)}>
      <Text
        fw={800}
        style={{
          fontSize: rem(34),
          lineHeight: 1.1,
          color: 'var(--app-text-primary)',
          letterSpacing: '-0.5px',
        }}
      >
        {children}
      </Text>
      {subtitle && (
        <Text size="xs" c="dimmed" mt={rem(2)}>
          {subtitle}
        </Text>
      )}
    </Box>
  );
}
