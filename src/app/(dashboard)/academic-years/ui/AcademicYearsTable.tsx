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

export function useAcademicYearsColumns(
  onEdit: (year: AcademicYear) => void,
  onOpenSetCurrent: (year: AcademicYear) => void,
  access = { canManage: true },
): DataModuleColumn<AcademicYear>[] {
  const setCurrentPending = useAcademicYearsMirror('setCurrentPending');
  const setCurrentTargetId = useAcademicYearsMirror('setCurrentTargetId');

  return useMemo(
    () => {
      const cols: DataModuleColumn<AcademicYear>[] = [
        {
          key: 'name',
          title: 'السنة الدراسية',
          sortable: true,
          exportValue: (y) => y.name,
          exportKind: 'text',
          render: (row: AcademicYear) => (
            <Text fw={500} size="sm">
              {row.name}
            </Text>
          ),
        },
        {
          key: 'startDate',
          title: 'تاريخ البداية',
          exportValue: (y) => (y.startDate ? y.startDate.split('T')[0] : null),
          exportKind: 'date',
          render: (row: AcademicYear) => (
            <Text size="sm" c="dimmed">
              {row.startDate ? row.startDate.split('T')[0] : '—'}
            </Text>
          ),
        },
        {
          key: 'endDate',
          title: 'تاريخ النهاية',
          exportValue: (y) => (y.endDate ? y.endDate.split('T')[0] : null),
          exportKind: 'date',
          render: (row: AcademicYear) => (
            <Text size="sm" c="dimmed">
              {row.endDate ? row.endDate.split('T')[0] : '—'}
            </Text>
          ),
        },
        {
          key: 'isCurrent',
          title: 'الحالة',
          exportValue: (y) => ({
            text: y.isCurrent ? 'الحالية' : 'مؤرشفة',
            tone: y.isCurrent ? 'success' : 'neutral',
          }),
          exportKind: 'badge',
          render: (row: AcademicYear) => <AcademicYearStatusBadge isCurrent={row.isCurrent} />,
        },
      ];

      if (access.canManage) {
        cols.push({
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
                      تعيين كحالية
                    </Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>
          ),
        });
      }

      return cols;
    },
    [onEdit, onOpenSetCurrent, access.canManage, setCurrentPending, setCurrentTargetId],
  );
}
