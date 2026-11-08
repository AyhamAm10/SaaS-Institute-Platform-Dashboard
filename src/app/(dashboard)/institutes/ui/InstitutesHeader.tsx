'use client';

import { Group, Stack, Text, Title } from '@mantine/core';
import { IconPlus, IconSchool } from '@tabler/icons-react';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { institutesLabels } from '../static-data/institutes.data';
import { AppButton } from '@/src/components/controllers/button';
import { StatusBadge } from '@/src/components/controllers/badge';

/**
 * InstitutesHeader
 *
 * Header component displaying page title, count badge, and creation action.
 * Pure presentation layer — reads state from useInstitutesMirror.
 */
export function InstitutesHeader() {
  const total = useInstitutesMirror('total');
  const isLoading = useInstitutesMirror('isLoading');
  const openCreateDrawer = useInstitutesMirror('openCreateDrawer');

  return (
    <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
      <Stack gap={4}>
        <Group gap="xs" align="center">
          <IconSchool size={28} color="var(--mantine-color-primary-6)" />
          <Title order={2} size="h3" fw={500}>
            {institutesLabels.title}
          </Title>
          <StatusBadge tone="ink" variant="solid" size="md">
            {isLoading ? '...' : `${total} ${institutesLabels.totalCountBadge}`}
          </StatusBadge>
        </Group>
        <Text size="sm" c="dimmed">
          {institutesLabels.subtitle}
        </Text>
      </Stack>

      <AppButton
        leftSection={<IconPlus size={16} />}
        onClick={openCreateDrawer}
        styles={{
          root: {
            boxShadow: '0 4px 14px rgba(30, 78, 140, 0.25)',
          },
        }}
      >
        {institutesLabels.createNewButton}
      </AppButton>
    </Group>
  );
}
