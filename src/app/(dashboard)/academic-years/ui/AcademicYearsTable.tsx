'use client';

import { useMemo } from 'react';
import {
  ActionIcon,
  Group,
  Menu,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconCalendarCheck,
  IconDotsVertical,
  IconEdit,
} from '@tabler/icons-react';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { AcademicYear } from '@/src/core/api';
import { AcademicYearStatusBadge } from './AcademicYearStatusBadge';
import { useAcademicYearsMirror } from '../store/useAcademicYearsMirror';

/**
 * Hook that builds the column definitions for the Academic Years table.
 * Reads mutation tracking state via the mirror to show loading indicators.
 */
export function useAcademicYearsColumns(
  onEdit: (year: AcademicYear) => void,
  onOpenSetCurrent: (year: AcademicYear) => void,
): DataModuleColumn<AcademicYear>[] {
  const setCurrentPending = useAcademicYearsMirror('setCurrentPending');
  const setCurrentTargetId = useAcademicYearsMirror('setCurrentTargetId');

  return useMemo(
    () => [
      {
        key: 'name',
        title: 'السنة الدراسية',
        sortable: true,
        render: (row: AcademicYear) => (
          <Text fw={600} size="sm">
            {row.name}
          </Text>
        ),
      },
      {
        key: 'startDate',
        title: 'تاريخ البداية',
        render: (row: AcademicYear) => (
          <Text size="sm" c="dimmed">
            {row.startDate ? row.startDate.split('T')[0] : '—'}
          </Text>
        ),
      },
      {
        key: 'endDate',
        title: 'تاريخ النهاية',
        render: (row: AcademicYear) => (
          <Text size="sm" c="dimmed">
            {row.endDate ? row.endDate.split('T')[0] : '—'}
          </Text>
        ),
      },
      {
        key: 'isCurrent',
        title: 'الحالة',
        render: (row: AcademicYear) => <AcademicYearStatusBadge isCurrent={row.isCurrent} />,
      },
      {
        key: 'actions',
        title: 'الإجراءات',
        align: 'center' as const,
        render: (row: AcademicYear) => (
          <Group gap={6} justify="center">
            {!row.isCurrent && (
              <Tooltip label="تعيين كسنة حالية نشطة">
                <ActionIcon
                  size="sm"
                  variant="light"
                  color="teal"
                  radius="xl"
                  loading={setCurrentPending && setCurrentTargetId === row.id}
                  onClick={() => onOpenSetCurrent(row)}
                >
                  <IconCalendarCheck size={16} />
                </ActionIcon>
              </Tooltip>
            )}

            <Menu shadow="md" width={160} position="bottom-end" radius="md">
              <Menu.Target>
                <ActionIcon size="sm" variant="subtle" color="gray" radius="xl">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => onEdit(row)}
                >
                  تعديل البيانات
                </Menu.Item>
                {!row.isCurrent && (
                  <Menu.Item
                    leftSection={<IconCalendarCheck size={14} />}
                    color="teal"
                    onClick={() => onOpenSetCurrent(row)}
                  >
                    تعيين كنشطة
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        ),
      },
    ],
    [setCurrentPending, setCurrentTargetId, onEdit, onOpenSetCurrent],
  );
}
