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
  IconBook,
  IconCoin,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconPlus,
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
  onOpenDetails: (section: Section, tab?: string) => void,
): DataModuleColumn<Section>[] {
  return useMemo(
    () => [
      {
        key: 'name',
        title: 'اسم الشعبة',
        sortable: true,
        render: (row: Section) => (
          <Text
            fw={600}
            size="sm"
            style={{ cursor: 'pointer' }}
            onClick={() => onOpenDetails(row, 'subjects')}
          >
            {row.name}
          </Text>
        ),
      },
      {
        key: 'academicBranch',
        title: 'الفرع الأكاديمي',
        render: (row: Section) => (
          <Badge variant="light" color="teal" radius="xl" size="sm">
            {row.academicBranch?.name ?? row.grade}
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
        key: 'subjects',
        title: 'المواد المقررة',
        render: (row: Section) => {
          const count = row._count?.sectionSubjects ?? 0;
          return count > 0 ? (
            <Badge
              variant="light"
              color="indigo"
              radius="xl"
              size="sm"
              style={{ cursor: 'pointer' }}
              onClick={() => onOpenDetails(row, 'subjects')}
              leftSection={<IconBook size={13} />}
            >
              {count} مواد مسندة
            </Badge>
          ) : (
            <Badge
              variant="outline"
              color="orange"
              radius="xl"
              size="sm"
              style={{ cursor: 'pointer' }}
              onClick={() => onOpenDetails(row, 'subjects')}
              leftSection={<IconPlus size={13} />}
            >
              + إسناد المواد
            </Badge>
          );
        },
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
            <Tooltip label="إسناد المواد المقررة والخطة">
              <ActionIcon
                size="sm"
                variant="light"
                color="indigo"
                radius="xl"
                onClick={() => onOpenDetails(row, 'subjects')}
              >
                <IconBook size={16} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="عرض تفاصيل الشعبة">
              <ActionIcon
                size="sm"
                variant="light"
                color="blue"
                radius="xl"
                onClick={() => onOpenDetails(row, 'info')}
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

            <Menu shadow="md" width={180} position="bottom-end" radius="md">
              <Menu.Target>
                <ActionIcon size="sm" variant="subtle" color="gray" radius="xl">
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconBook size={14} />}
                  color="indigo"
                  onClick={() => onOpenDetails(row, 'subjects')}
                >
                  إسناد المواد المقررة
                </Menu.Item>
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
                <Menu.Item
                  leftSection={<IconEye size={14} />}
                  color="blue"
                  onClick={() => onOpenDetails(row, 'info')}
                >
                  عرض كامل التفاصيل
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
