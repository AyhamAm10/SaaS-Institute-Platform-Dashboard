'use client';

import { Group, Stack, Text } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { AppIconButton, StatusBadge } from '@/src/components/controllers';
import type { Closure } from '@/src/core/api';
import { formatDate } from '@/src/core/format';
import {
  closureLabels as labels,
  SCOPE_LABELS,
  SCOPE_TONES,
  STATUS_LABELS,
  STATUS_TONES,
} from '../static-data/closures.data';
import { closureDays, closureStatus, closureTarget } from '../utils/closures.utils';

/** Columns of the closures table. Edit / delete only with `canManage`. Props only. */
export function getClosuresColumns(
  onEdit: (closure: Closure) => void,
  onDelete: (closure: Closure) => void,
  canManage: boolean,
  today: string,
): DataModuleColumn<Closure>[] {
  const columns: DataModuleColumn<Closure>[] = [
    {
      key: 'reason',
      title: labels.colReason,
      exportValue: (c) => c.reason,
      exportKind: 'text',
      render: (c) => (
        <Stack gap={0}>
          <Text size="sm" fw={500}>
            {c.reason}
          </Text>
          <Text size="xs" c="var(--app-text-muted)">
            {closureTarget(c)}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'scope',
      title: labels.colScope,
      exportValue: (c) => SCOPE_LABELS[c.scope],
      exportKind: 'text',
      render: (c) => (
        <StatusBadge tone={SCOPE_TONES[c.scope]} size="sm">
          {SCOPE_LABELS[c.scope]}
        </StatusBadge>
      ),
    },
    {
      key: 'period',
      title: labels.colPeriod,
      exportValue: (c) => `${formatDate(c.fromDate)} - ${formatDate(c.toDate)}`,
      exportKind: 'text',
      render: (c) => (
        <Stack gap={0}>
          <Text size="sm">
            {c.fromDate === c.toDate
              ? formatDate(c.fromDate)
              : `${formatDate(c.fromDate)} ${labels.until} ${formatDate(c.toDate)}`}
          </Text>
          <Text size="xs" c="var(--app-text-muted)">
            {labels.days(closureDays(c))}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'status',
      title: labels.colStatus,
      exportValue: (c) => STATUS_LABELS[closureStatus(c, today)],
      exportKind: 'text',
      render: (c) => {
        const status = closureStatus(c, today);
        return (
          <StatusBadge tone={STATUS_TONES[status]} size="sm">
            {STATUS_LABELS[status]}
          </StatusBadge>
        );
      },
    },
  ];
  if (!canManage) return columns;
  return [
    ...columns,
    {
      key: 'actions',
      title: labels.colActions,
      align: 'center',
      render: (c) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <AppIconButton size="sm" variant="ghost" label={labels.edit} onClick={() => onEdit(c)}>
            <IconEdit size={15} />
          </AppIconButton>
          <AppIconButton size="sm" variant="danger" label={labels.remove} onClick={() => onDelete(c)}>
            <IconTrash size={15} />
          </AppIconButton>
        </Group>
      ),
    },
  ];
}
