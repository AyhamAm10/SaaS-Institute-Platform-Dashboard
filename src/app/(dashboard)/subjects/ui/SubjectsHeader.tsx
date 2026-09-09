'use client';

import { Badge, Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconBook, IconPlus } from '@tabler/icons-react';
import { useSubjectsMirror } from '../store/useSubjectsMirror';
import { subjectsLabels } from '../static-data/subjects.data';

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
          <Title order={2} size="h3" fw={700}>
            {subjectsLabels.title}
          </Title>
          <Badge variant="filled" color="primary" radius="xl" size="lg">
            {isLoading ? '...' : `${total} ${subjectsLabels.totalCountBadge}`}
          </Badge>
        </Group>
        <Text size="sm" c="dimmed">
          {subjectsLabels.subtitle}
        </Text>
      </Stack>

      <Button
        variant="filled"
        color="primary"
        radius="xl"
        leftSection={<IconPlus size={16} />}
        onClick={openCreateDrawer}
        styles={{
          root: {
            boxShadow: '0 4px 14px rgba(30, 78, 140, 0.25)',
          },
        }}
      >
        {subjectsLabels.createNewButton}
      </Button>
    </Group>
  );
}
