'use client';

import { ActionIcon, Group, Menu, Tooltip } from '@mantine/core';
import { IconBook, IconCoin, IconDotsVertical, IconEdit, IconEye } from '@tabler/icons-react';
import { Section } from '@/src/core/api';
import { ReportMenu } from '@/src/components/controllers/report';

const SECTION_REPORTS = [
  'section-roster',
  'attendance-sheet',
  'section-attendance',
  'section-results',
  'section-finance',
  'timetable',
];

interface SectionsActionsCellProps {
  row: Section;
  canManage: boolean;
  onEdit: (section: Section) => void;
  onOpenFee: (section: Section) => void;
  onOpenDetails: (section: Section, tab?: string) => void;
}

export function SectionsActionsCell({
  row,
  canManage,
  onEdit,
  onOpenFee,
  onOpenDetails,
}: SectionsActionsCellProps) {
  if (!canManage) {
    return (
      <Group gap={6} justify="center">
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
        <ReportMenu compact keys={SECTION_REPORTS} params={{ sectionId: row.id }} />
      </Group>
    );
  }

  return (
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

      <ReportMenu compact keys={SECTION_REPORTS} params={{ sectionId: row.id }} />

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
          <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => onEdit(row)}>
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
  );
}

