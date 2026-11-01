'use client';

import { Group, Stack, Text, rem } from '@mantine/core';
import { AppSurface } from '../surface';
import { IconTile } from './IconTile';
import { InfoTileProps } from './init/info-tile.init';

/** Small metric block: icon + muted label + prominent value. */
export function InfoTile({ label, value, icon, tone = 'neutral', hint }: InfoTileProps) {
  return (
    <AppSurface level={1} padding="md">
      <Group gap="sm" wrap="nowrap" align="center">
        {icon && (
          <IconTile tone={tone} size={38}>
            {icon}
          </IconTile>
        )}
        <Stack gap={2} style={{ minWidth: 0 }}>
          <Text size="xs" c="var(--app-text-muted)" fw={400} truncate>
            {label}
          </Text>
          <Text fw={500} style={{ fontSize: rem(17), lineHeight: 1.3, color: 'var(--app-text-primary)' }}>
            {value}
          </Text>
          {hint && (
            <Text size="xs" c="var(--app-text-muted)" fw={300}>
              {hint}
            </Text>
          )}
        </Stack>
      </Group>
    </AppSurface>
  );
}
