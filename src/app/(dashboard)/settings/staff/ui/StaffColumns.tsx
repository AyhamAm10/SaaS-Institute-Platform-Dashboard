'use client';

import { Group, Stack, Text } from '@mantine/core';
import { IconEdit, IconKey, IconUserOff } from '@tabler/icons-react';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { AppIconButton, StatusBadge } from '@/src/components/controllers';
import type { StaffMember } from '@/src/core/api';
import { ROLE_LABELS } from '@/src/core/auth';
import { formatDate } from '@/src/core/format';
import type { StaffModal } from '../state/staff.state';
import { STAFF_ROLE_TONES, staffLabels as labels } from '../static-data/staff.data';

/** Columns of the staff table. Self actions the server refuses are hidden. Props only. */
export function getStaffColumns(
  onEdit: (member: StaffMember) => void,
  onModal: (modal: Exclude<StaffModal, null>, member: StaffMember) => void,
  currentUserId: number | null,
): DataModuleColumn<StaffMember>[] {
  return [
    {
      key: 'name',
      title: labels.colName,
      exportValue: (m) => `${m.fullName}${m.phone ? ` (${m.phone})` : ''}`,
      exportKind: 'text',
      render: (m) => (
        <Stack gap={0}>
          <Group gap={6}>
            <Text size="sm" fw={500}>
              {m.fullName}
            </Text>
            {m.id === currentUserId && (
              <StatusBadge tone="neutral" size="xs">
                {labels.you}
              </StatusBadge>
            )}
          </Group>
          <Text size="xs" c="var(--app-text-muted)" dir="ltr" ta="right">
            {m.phone}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'role',
      title: labels.colRole,
      exportValue: (m) => ROLE_LABELS[m.role] ?? m.role,
      exportKind: 'text',
      render: (m) => (
        <StatusBadge tone={STAFF_ROLE_TONES[m.role]} size="sm">
          {ROLE_LABELS[m.role] ?? m.role}
        </StatusBadge>
      ),
    },
    {
      key: 'created',
      title: labels.colCreated,
      exportValue: (m) => formatDate(m.createdAt),
      exportKind: 'date',
      render: (m) => formatDate(m.createdAt),
    },
    {
      key: 'actions',
      title: labels.colActions,
      align: 'center',
      render: (m) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <AppIconButton size="sm" variant="ghost" label={labels.edit} onClick={() => onEdit(m)}>
            <IconEdit size={15} />
          </AppIconButton>
          <AppIconButton size="sm" variant="ghost" label={labels.resetPassword} onClick={() => onModal('password', m)}>
            <IconKey size={15} />
          </AppIconButton>
          {m.id !== currentUserId && (
            <AppIconButton size="sm" variant="danger" label={labels.deactivate} onClick={() => onModal('deactivate', m)}>
              <IconUserOff size={15} />
            </AppIconButton>
          )}
        </Group>
      ),
    },
  ];
}
