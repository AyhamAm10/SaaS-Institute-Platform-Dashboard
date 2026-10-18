'use client';

import {
  ActionIcon,
  Badge,
  Group,
  Text,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import {
  IconBuildingCommunity,
  IconEdit,
  IconEye,
  IconFlask,
  IconSchool,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react';
import { Room } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';

const roomTypeLabels: Record<string, { label: string; color: string; icon: any }> = {
  CLASSROOM: { label: 'صف دراسي', color: 'blue', icon: IconSchool },
  LAB: { label: 'مختبر علمي', color: 'teal', icon: IconFlask },
  HALL: { label: 'مدرج / قاعة', color: 'purple', icon: IconBuildingCommunity },
  ACTIVITY: { label: 'قاعة أنشطة', color: 'orange', icon: IconUsers },
};

/**
 * getRoomsColumns
 *
 * Column definitions for Rooms table.
 * Strictly adheres to DataModuleController compound pattern.
 */
export function getRoomsColumns(
  openDetailsDrawer: (room: Room) => void,
  openEditDrawer: (room: Room) => void,
  openDeleteModal: (room: Room) => void,
): DataModuleColumn<Room>[] {
  return [
    {
      key: 'name',
      title: 'اسم القاعة',
      sortable: true,
      render: (room) => {
        const meta = roomTypeLabels[room.type] || {
          label: room.type,
          color: 'gray',
          icon: IconBuildingCommunity,
        };
        const IconComp = meta.icon;
        return (
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon radius="md" color={meta.color} variant="light" size="sm">
              <IconComp size={16} />
            </ThemeIcon>
            <Text fw={600} size="xs" style={{ fontSize: '13px' }}>
              {room.name}
            </Text>
          </Group>
        );
      },
    },
    {
      key: 'type',
      title: 'نوع القاعة',
      render: (room) => {
        const meta = roomTypeLabels[room.type] || {
          label: room.type,
          color: 'gray',
        };
        return (
          <Badge variant="light" color={meta.color} radius="sm" size="sm">
            {meta.label}
          </Badge>
        );
      },
    },
    {
      key: 'capacity',
      title: 'السعة الاستيعابية',
      sortable: true,
      render: (room) => (
        <Group gap={4} wrap="nowrap">
          <IconUsers size={14} color="var(--mantine-color-dimmed)" />
          <Text size="xs" fw={500}>
            {room.capacity} مقعد
          </Text>
        </Group>
      ),
    },
    {
      key: 'branch',
      title: 'الفرع',
      render: (room) =>
        room.branch ? (
          <Badge variant="outline" color="gray" radius="sm" size="xs">
            {room.branch.name}
          </Badge>
        ) : (
          <Text size="xs" c="dimmed">
            كافة الفروع
          </Text>
        ),
    },
    {
      key: 'timetableEntries',
      title: 'الحصص المجدولة',
      render: (room) => (
        <Badge variant="light" color="blue" radius="sm" size="xs">
          {room._count?.timetableEntries ?? 0} حصة
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      align: 'center',
      render: (room) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <Tooltip label="التفاصيل وتوافر القاعة" withArrow>
            <ActionIcon
              variant="subtle"
              color="blue"
              radius="md"
              size="sm"
              onClick={() => openDetailsDrawer(room)}
            >
              <IconEye size={15} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="تعديل القاعة" withArrow>
            <ActionIcon
              variant="subtle"
              color="yellow"
              radius="md"
              size="sm"
              onClick={() => openEditDrawer(room)}
            >
              <IconEdit size={15} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="حذف القاعة" withArrow>
            <ActionIcon
              variant="subtle"
              color="red"
              radius="md"
              size="sm"
              onClick={() => openDeleteModal(room)}
            >
              <IconTrash size={15} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];
}
