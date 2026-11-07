'use client';

import { ReactNode } from 'react';
import { Group, Text } from '@mantine/core';
import { IconEdit, IconStar, IconTrash } from '@tabler/icons-react';
import { LookupItem, StatusTone } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { AppIconButton } from '@/src/components/controllers/button';
import { StatusBadge } from '@/src/components/controllers/badge';
import { STATUS_TONES } from '../../static-data/reference-data.data';
import { LookupColumnConfig, LookupConfig } from '../lookup.config';
import { LookupState } from '../state/lookup.state';

type Row = Record<string, unknown>;

function getExportCell(column: LookupColumnConfig, row: Row, options: LookupState['options']): string {
  const value = row[column.field];
  switch (column.render) {
    case 'tone':
      return String(row.name ?? '');
    case 'default':
      return value ? 'افتراضية' : '—';
    case 'active':
      return value ? 'مفعّل' : 'متوقف';
    case 'option': {
      const label = options[column.options!]?.find((o) => o.value === String(value))?.label;
      return label ?? '—';
    }
    case 'phone':
      return value ? String(value) : '—';
    default:
      return value === null || value === undefined ? '—' : String(value);
  }
}

function renderCell(column: LookupColumnConfig, row: Row, options: LookupState['options']): ReactNode {
  const value = row[column.field];
  switch (column.render) {
    case 'tone': {
      const tone = STATUS_TONES[value as StatusTone] ?? STATUS_TONES.NEUTRAL;
      return (
        <StatusBadge tone={tone.badge} size="xs">
          {String(row.name)}
        </StatusBadge>
      );
    }
    case 'default':
      return value ? (
        <StatusBadge tone="brand" size="xs" icon={<IconStar size={12} />}>
          افتراضية
        </StatusBadge>
      ) : (
        <Text size="xs" c="dimmed">—</Text>
      );
    case 'active':
      return (
        <StatusBadge tone={value ? 'success' : 'neutral'} size="xs">
          {value ? 'مفعّل' : 'متوقف'}
        </StatusBadge>
      );
    case 'option': {
      const label = options[column.options!]?.find((o) => o.value === String(value))?.label;
      return <Text size="sm">{label ?? '—'}</Text>;
    }
    case 'phone':
      return (
        <Text size="xs" dir="ltr">
          {value ? String(value) : '—'}
        </Text>
      );
    default:
      return <Text size="sm">{value === null || value === undefined ? '—' : String(value)}</Text>;
  }
}

/** Name column + the table's configured columns + actions. */
export function getLookupColumns(
  config: LookupConfig,
  options: LookupState['options'],
  openEdit: (item: LookupItem) => void,
  openDelete: (item: LookupItem) => void,
  access = { canManage: true },
): DataModuleColumn<LookupItem>[] {
  const cols: DataModuleColumn<LookupItem>[] = [
    {
      key: 'name',
      title: 'الاسم',
      exportValue: (item) => item.name,
      exportKind: 'text',
      render: (item) => (
        <Text size="sm" fw={500}>
          {item.name}
        </Text>
      ),
    },
    ...config.columns.map((column) => ({
      key: column.field,
      title: column.title,
      exportValue: (item: LookupItem) => getExportCell(column, item as unknown as Row, options),
      exportKind: 'text' as const,
      render: (item: LookupItem) => renderCell(column, item as unknown as Row, options),
    })),
  ];

  if (access.canManage) {
    cols.push({
      key: 'actions',
      title: 'الإجراءات',
      align: 'center',
      render: (item) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <AppIconButton variant="ghost" size="sm" label="تعديل" onClick={() => openEdit(item)}>
            <IconEdit size={15} />
          </AppIconButton>
          <AppIconButton variant="danger" size="sm" label="حذف" onClick={() => openDelete(item)}>
            <IconTrash size={15} />
          </AppIconButton>
        </Group>
      ),
    });
  }

  return cols;
}
