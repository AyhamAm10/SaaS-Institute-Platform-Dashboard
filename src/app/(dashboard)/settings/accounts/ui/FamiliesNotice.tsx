'use client';

import { Alert, Group, Stack, Text } from '@mantine/core';
import { IconAlertTriangle, IconCircleCheck, IconUsersGroup } from '@tabler/icons-react';
import { AppButton } from '@/src/components/controllers';
import { useAccountsMirror } from '../store/accounts.store';
import { accountsLabels as labels } from '../static-data/accounts.data';

/** Families tab: families that still have no login, with the one-click back-fill. ZERO useState hooks. */
export function FamiliesNotice({ onSync }: { onSync: () => Promise<void> }) {
  const summary = useAccountsMirror('summary');
  const isSyncing = useAccountsMirror('isSyncing');
  const notice = useAccountsMirror('notice');
  const error = useAccountsMirror('error');
  const withPhone = summary?.missingFamilies.withPhone ?? 0;
  const withoutPhone = summary?.missingFamilies.withoutPhone ?? 0;

  return (
    <Stack gap="xs">
      <Text size="sm" c="var(--app-text-muted)">
        {labels.familiesHint}
      </Text>
      {notice && (
        <Alert icon={<IconCircleCheck size={16} />} color="green" variant="light" radius="md">
          {notice}
        </Alert>
      )}
      {error && (
        <Alert icon={<IconAlertTriangle size={16} />} color="red" variant="light" radius="md">
          {error}
        </Alert>
      )}
      {withPhone > 0 && (
        <Alert icon={<IconUsersGroup size={16} />} color="yellow" variant="light" radius="md">
          <Group justify="space-between" wrap="nowrap">
            <Text size="sm">{labels.missingWithPhone(withPhone)}</Text>
            <AppButton size="xs" onClick={onSync} loading={isSyncing}>
              {isSyncing ? labels.syncing : labels.syncFamilies}
            </AppButton>
          </Group>
        </Alert>
      )}
      {withoutPhone > 0 && (
        <Text size="xs" c="var(--app-text-muted)">
          {labels.missingWithoutPhone(withoutPhone)}
        </Text>
      )}
    </Stack>
  );
}
