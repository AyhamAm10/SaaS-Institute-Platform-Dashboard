'use client';

import { useMemo } from 'react';
import {
  ActionIcon,
  Badge,
  Group,
  Menu,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconCoin,
  IconDotsVertical,
  IconEdit,
  IconEye,
} from '@tabler/icons-react';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { Section } from '@/src/core/api';

/**
 * Hook that builds the column definitions for the Sections table.
 * All action callbacks are injected from the parent — the hook itself has zero business logic.
 */
export function useSectionsColumns(
  onEdit: (section: Section) => void,
  onOpenFee: (section: Section) => void,
  onOpenDetails: (section: Section) => void,
): DataModuleColumn<Section>[] {
  return useMemo(
    () => [
      {
        key: 'name',
        title: 'اسم الشُعبة',
        sortable: true,
        render: (row: Section) => (
          <Text fw={600} size="sm">
            {row.name}
          </Text>
        ),
      },
      {
        key: 'grade',
        title: 'المرحلة / الصف',
        render: (row: Section) => (
          <Badge variant="light" color="blue" radius="xl" size="sm">
            {row.grade}
          </Badge>
        ),
      },
      {
        key: 'academicYear',
        title: 'السنة الدراسية',
        render: (row: Section) => (
          <Text size="sm" c="dimmed">
            {row.academicYear?.name ?? '—'}
          </Text>
        ),
      },
      {
        key: 'branch',
        title: 'الفرع',
        render: (row: Section) => (
          <Text size="sm" c="dimmed">
            {row.branch?.name ?? 'الفرع الرئيسي'}
          </Text>
        ),
      },
      {
        key: 'feeAmount',
        title: 'الرسوم الدراسية',
        render: (row: Section) => (
          <Text fw={600} size="sm" c="teal">
            {Number(row.feeAmount).toLocaleString('ar-SA')} ر.س
          </Text>
        ),
      },
      {
        key: 'actions',
        title: 'الإجراءات',
        align: 'center' as const,
        render: (row: Section) => (
          <Group gap={6} justify="center">
            <Tooltip label="عرض التفاصيل">
              <ActionIcon
                size="sm"
                variant="light"
                color="blue"
                radius="xl"
                onClick={() => onOpenDetails(row)}
              >
                <IconEye size={16} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="تعديل الرسوم">
              <ActionIcon
                size="sm"
                variant="light"
                color="teal"
                radius="xl"
                onClick={() => onOpenFee(row)}
              >
                <IconCoin size={16} />
              </ActionIcon>
            </Tooltip>

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
                <Menu.Item
                  leftSection={<IconCoin size={14} />}
                  color="teal"
                  onClick={() => onOpenFee(row)}
                >
                  تعديل الرسوم
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        ),
      },
    ],
    [onEdit, onOpenFee, onOpenDetails],
  );
}
