'use client';

import { Badge, Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconPlus, IconSchool } from '@tabler/icons-react';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { institutesLabels } from '../static-data/institutes.data';

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
          <Title order={2} size="h3" fw={700}>
            {institutesLabels.title}
          </Title>
          <Badge variant="filled" color="primary" radius="xl" size="lg">
            {isLoading ? '...' : `${total} ${institutesLabels.totalCountBadge}`}
          </Badge>
        </Group>
        <Text size="sm" c="dimmed">
          {institutesLabels.subtitle}
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
        {institutesLabels.createNewButton}
      </Button>
    </Group>
  );
}
