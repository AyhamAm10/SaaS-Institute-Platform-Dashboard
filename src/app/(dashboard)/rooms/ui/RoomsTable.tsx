'use client';

import { Badge, Group, Text, ThemeIcon } from '@mantine/core';
import {
  IconBuildingCommunity,
  IconFlask,
  IconSchool,
  IconUsers,
} from '@tabler/icons-react';
import { Room } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { RoomActionsCell } from './RoomActionsCell';

type RoomTypeIcon = React.ComponentType<{ size?: number | string }>;

const roomTypeLabels: Record<string, { label: string; color: string; icon: RoomTypeIcon }> = {
  CLASSROOM: { label: 'صف دراسي', color: 'blue', icon: IconSchool },
  LAB: { label: 'مختبر علمي', color: 'teal', icon: IconFlask },
  HALL: { label: 'مدرج / قاعة', color: 'purple', icon: IconBuildingCommunity },
  ACTIVITY: { label: 'قاعة أنشطة', color: 'orange', icon: IconUsers },
};

export function getRoomsColumns(
  openDetailsDrawer: (room: Room) => void,
  openEditDrawer: (room: Room) => void,
  openDeleteModal: (room: Room) => void,
  access = { canManage: true },
): DataModuleColumn<Room>[] {
  const cols: DataModuleColumn<Room>[] = [
    {
      key: 'name',
      title: 'اسم القاعة',
      sortable: true,
      exportValue: (r) => r.name,
      exportKind: 'text',
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
            <Text fw={500} size="xs" style={{ fontSize: '13px' }}>
              {room.name}
            </Text>
          </Group>
        );
      },
    },
    {
      key: 'type',
      title: 'نوع القاعة',
      exportValue: (r) => roomTypeLabels[r.type]?.label || r.type,
      exportKind: 'text',
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
      exportValue: (r) => r.capacity,
      exportKind: 'number',
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
      exportValue: (r) => r.branch?.name ?? 'كافة الفروع',
      exportKind: 'text',
      render: (room) =>
        room.branch ? (
          <Badge variant="outline" color="gray" radius="sm" size="sm">
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
      exportValue: (r) => r._count?.timetableEntries ?? 0,
      exportKind: 'number',
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
        <RoomActionsCell
          room={room}
          canManage={access.canManage}
          onOpenDetails={openDetailsDrawer}
          onOpenEdit={openEditDrawer}
          onOpenDelete={openDeleteModal}
        />
      ),
    },
  ];

  return cols;
}
