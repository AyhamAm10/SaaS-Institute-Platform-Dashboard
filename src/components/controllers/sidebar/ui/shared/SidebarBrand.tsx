'use client';

import { Box, Group, Image, Stack, Text, rem } from '@mantine/core';
import { useAuth } from '@/src/core/auth';
import { useBranchesQuery, useOperationalContext } from '@/src/core/api';

export const BRAND_LOGO_SRC = '/brand/logo-mark.png';

export interface BrandMarkProps {
  size?: number;
}

/** Institute logo mark on its native black tile, with a soft orange glow. */
export function BrandMark({ size = 44 }: BrandMarkProps) {
  return (
    <Box
      style={{
        width: rem(size),
        height: rem(size),
        flexShrink: 0,
        borderRadius: rem(Math.round(size * 0.3)),
        overflow: 'hidden',
        backgroundColor: '#000000',
        boxShadow:
          '0 10px 20px -8px rgba(20, 20, 22, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
      }}
    >
      <Image src={BRAND_LOGO_SRC} alt="شعار معهد جيل السلام" w="100%" h="100%" fit="cover" />
    </Box>
  );
}

export interface SidebarBrandProps {
  compact?: boolean;
}

/** Logo + institute name + active branch. `compact` renders the mark only. */
export function SidebarBrand({ compact }: SidebarBrandProps) {
  const { user } = useAuth();
  const { activeBranchId } = useOperationalContext();
  const { data: branches } = useBranchesQuery();
  const activeBranch = branches?.find((b) => b.id === activeBranchId);
  const branchLabel = user?.role === 'SUPER_ADMIN' ? 'المدير العام' : activeBranch?.name || 'الفرع الرئيسي';

  if (compact) {
    return (
      <Group justify="center">
        <BrandMark size={44} />
      </Group>
    );
  }

  return (
    <Group gap="sm" wrap="nowrap" px={4}>
      <BrandMark size={46} />
      <Stack gap={2} style={{ minWidth: 0 }}>
        <Text fw={600} size="sm" c="var(--app-text-primary)" truncate>
          {user?.institute?.name || 'معهد جيل السلام'}
        </Text>
        <Group gap={6} wrap="nowrap">
          <Box
            style={{
              width: rem(6),
              height: rem(6),
              borderRadius: '50%',
              backgroundColor: 'var(--app-brand-accent)',
              boxShadow: '0 0 8px var(--app-brand-accent)',
              flexShrink: 0,
            }}
          />
          <Text size="xs" fw={400} c="var(--app-text-muted)" truncate>
            {branchLabel}
          </Text>
        </Group>
      </Stack>
    </Group>
  );
}
