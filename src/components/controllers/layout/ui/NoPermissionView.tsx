'use client';

import { Center, Stack, Text } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { AppButton } from '../../button/AppButton';
import { AppSurface } from '../../surface/AppSurface';
import { IconTile } from '../../info-tile/IconTile';

/** Shown instead of a page the user's role may not open (role.md §8.6). Props only. */
export function NoPermissionView() {
  return (
    <Center py="xl">
      <AppSurface level={1} radius="lg" padding="xl">
        <Stack align="center" gap="sm" maw={360}>
          <IconTile tone="neutral" size={52}>
            <IconLock size={24} />
          </IconTile>
          <Text fw={600}>لا تملك صلاحية لهذه الصفحة</Text>
          <Text size="sm" c="var(--app-text-muted)" ta="center">
            هذه الصفحة غير متاحة لدورك. تواصل مع مدير المعهد إذا كنت تحتاجها.
          </Text>
          <AppButton href="/" variant="outline" size="sm">
            الصفحة الرئيسية
          </AppButton>
        </Stack>
      </AppSurface>
    </Center>
  );
}
