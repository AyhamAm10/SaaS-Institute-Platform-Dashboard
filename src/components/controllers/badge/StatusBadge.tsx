'use client';

import type { ReactNode } from 'react';
import { Badge, Box, rem } from '@mantine/core';
import { BadgeTone, BadgeVariant, resolveBadgeStyle } from './init/badge.init';

export interface StatusBadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md';
  icon?: ReactNode;
}

/**
 * StatusBadge
 *
 * Semantic pill: pages choose a `tone` (meaning), never a raw color,
 * so every status across the dashboard reads the same way.
 */
export function StatusBadge({ children, tone = 'neutral', variant = 'soft', size = 'sm', icon }: StatusBadgeProps) {
  const leftSection =
    variant === 'dot' ? (
      <Box
        style={{
          width: rem(6),
          height: rem(6),
          borderRadius: '50%',
          backgroundColor: 'currentColor',
        }}
      />
    ) : (
      icon
    );

  return (
    <Badge
      size={size}
      radius="xl"
      variant="light"
      leftSection={leftSection}
      style={{ ...resolveBadgeStyle(tone, variant), fontWeight: 500 }}
    >
      {children}
    </Badge>
  );
}
