'use client';

import { Center, Group, Text } from '@mantine/core';
import { IconBuildingCommunity, IconFlask, IconSchool, IconUsers } from '@tabler/icons-react';
import { Room } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { RoomActionsCell } from './RoomActionsCell';
import { BadgeTone, resolveBadgeStyle, StatusBadge } from '@/src/components/controllers/badge';

type RoomTypeIcon = React.ComponentType<{ size?: number | string }>;

const roomTypeLabels: Record<string, { label: string; color: BadgeTone; icon: RoomTypeIcon }> = {
  CLASSROOM: { label: 'صف دراسي', color: 'info', icon: IconSchool },
  LAB: { label: 'مختبر علمي', color: 'success', icon: IconFlask },
  HALL: { label: 'مدرج / قاعة', color: 'ink', icon: IconBuildingCommunity },
  ACTIVITY: { label: 'قاعة أنشطة', color: 'warning', icon: IconUsers },
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
          color: 'neutral' as BadgeTone,
          icon: IconBuildingCommunity,
        };
        const IconComp = meta.icon;
        return (
          <Group gap="sm" wrap="nowrap">
            <Center w={26} h={26} style={{ borderRadius: 8, ...resolveBadgeStyle(meta.color) }}>
              <IconComp size={16} />
            </Center>
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
          color: 'neutral' as BadgeTone,
        };
        return (
          <StatusBadge tone={meta.color} size="sm">
            {meta.label}
          </StatusBadge>
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
          <StatusBadge tone="neutral" variant="outline" size="sm">
            {room.branch.name}
          </StatusBadge>
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
        <StatusBadge tone="info" size="xs">
          {room._count?.timetableEntries ?? 0} حصة
        </StatusBadge>
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
