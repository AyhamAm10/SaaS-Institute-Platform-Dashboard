'use client';

import { Group, Stack, Text, Title } from '@mantine/core';
import { IconBook, IconPlus } from '@tabler/icons-react';
import { useSubjectsMirror } from '../store/useSubjectsMirror';
import { subjectsLabels } from '../static-data/subjects.data';
import { AppButton } from '@/src/components/controllers/button';
import { StatusBadge } from '@/src/components/controllers/badge';

/**
 * SubjectsHeader
 *
 * Header displaying page title, count badge, and creation action.
 * Pure presentation layer — reads state from useSubjectsMirror.
 * ZERO useState hooks.
 */
export function SubjectsHeader() {
  const total = useSubjectsMirror('total');
  const isLoading = useSubjectsMirror('isLoading');
  const openCreateDrawer = useSubjectsMirror('openCreateDrawer');

  return (
    <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
      <Stack gap={4}>
        <Group gap="xs" align="center">
          <IconBook size={28} color="var(--mantine-color-primary-6)" />
          <Title order={2} size="h3" fw={500}>
            {subjectsLabels.title}
          </Title>
          <StatusBadge tone="ink" variant="solid" size="md">
            {isLoading ? '...' : `${total} ${subjectsLabels.totalCountBadge}`}
          </StatusBadge>
        </Group>
        <Text size="sm" c="dimmed">
          {subjectsLabels.subtitle}
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
        {subjectsLabels.createNewButton}
      </AppButton>
    </Group>
  );
}
