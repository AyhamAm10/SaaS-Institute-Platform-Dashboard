'use client';

import { Group, Stack, Text } from '@mantine/core';
import { IconEdit, IconKey, IconPlayerPlay, IconUserOff } from '@tabler/icons-react';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { AppIconButton, StatusBadge } from '@/src/components/controllers';
import type { AccountItem, AccountType } from '@/src/core/api';
import type { AccountModal } from '../state/accounts.state';
import { accountRoleLabel, accountsLabels as labels } from '../static-data/accounts.data';

export interface AccountColumnActions {
  type: AccountType;
  currentUserId: number | null;
  onEdit: (account: AccountItem) => void;
  onModal: (modal: Exclude<AccountModal, null>, account: AccountItem) => void;
}

/** Columns of the accounts table. Self actions the server refuses are hidden. Props only. */
export function getAccountColumns({ type, currentUserId, onEdit, onModal }: AccountColumnActions): DataModuleColumn<AccountItem>[] {
  return [
    {
      key: 'name',
      title: labels.colName,
      exportValue: (a) => `${a.fullName} (${a.phone})`,
      exportKind: 'text',
      render: (a) => (
        <Stack gap={0}>
          <Group gap={6}>
            <Text size="sm" fw={500}>
              {a.fullName}
            </Text>
            {a.id === currentUserId && (
              <StatusBadge tone="neutral" size="xs">
                {labels.you}
              </StatusBadge>
            )}
            {type === 'staff' && (
              <StatusBadge tone="info" size="xs">
                {accountRoleLabel(a.role)}
              </StatusBadge>
            )}
          </Group>
          <Text size="xs" c="var(--app-text-muted)" dir="ltr" ta="right">
            {a.phone}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'linked',
      title: labels.colLinked,
      exportValue: (a) => a.linkedTo ?? '',
      exportKind: 'text',
      render: (a) => (
        <Text size="sm" c={a.linkedTo ? undefined : 'var(--app-text-muted)'}>
          {a.linkedTo ?? '—'}
        </Text>
      ),
    },
    {
      key: 'status',
      title: labels.colStatus,
      exportValue: (a) => (a.isActive ? labels.statusActive : labels.statusInactive),
      exportKind: 'text',
      render: (a) => (
        <Group gap={6}>
          <StatusBadge tone={a.isActive ? 'success' : 'danger'} size="sm">
            {a.isActive ? labels.statusActive : labels.statusInactive}
          </StatusBadge>
          {a.mustChangePassword && (
            <StatusBadge tone="warning" size="xs">
              {labels.mustChange}
            </StatusBadge>
          )}
        </Group>
      ),
    },
    {
      key: 'actions',
      title: labels.colActions,
      align: 'center',
      render: (a) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          {type === 'staff' && a.isActive && (
            <AppIconButton size="sm" variant="ghost" label={labels.edit} onClick={() => onEdit(a)}>
              <IconEdit size={15} />
            </AppIconButton>
          )}
          {a.id !== currentUserId && (
            <AppIconButton size="sm" variant="ghost" label={labels.resetPassword} onClick={() => onModal('reset', a)}>
              <IconKey size={15} />
            </AppIconButton>
          )}
          {a.id !== currentUserId &&
            (a.isActive ? (
              <AppIconButton size="sm" variant="danger" label={labels.deactivate} onClick={() => onModal('deactivate', a)}>
                <IconUserOff size={15} />
              </AppIconButton>
            ) : (
              <AppIconButton size="sm" variant="brand" label={labels.activate} onClick={() => onModal('activate', a)}>
                <IconPlayerPlay size={15} />
              </AppIconButton>
            ))}
        </Group>
      ),
    },
  ];
}
