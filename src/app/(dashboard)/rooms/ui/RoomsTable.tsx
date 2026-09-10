'use client';

import {
  ActionIcon,
  Badge,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  Stack,
  Table,
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
import { useRoomsMirror } from '../store/useRoomsMirror';

const roomTypeLabels: Record<string, { label: string; color: string; icon: any }> = {
  CLASSROOM: { label: 'صف دراسي', color: 'blue', icon: IconSchool },
  LAB: { label: 'مختبر علمي', color: 'teal', icon: IconFlask },
  HALL: { label: 'مدرج / قاعة', color: 'purple', icon: IconBuildingCommunity },
  ACTIVITY: { label: 'قاعة أنشطة', color: 'orange', icon: IconUsers },
};

export function RoomsTable() {
  const data = useRoomsMirror('data');
  const isLoading = useRoomsMirror('isLoading');
  const page = useRoomsMirror('page');
  const totalPages = useRoomsMirror('totalPages');
  const total = useRoomsMirror('total');
  const setPage = useRoomsMirror('setPage');
  const openEditDrawer = useRoomsMirror('openEditDrawer');
  const openDetailsDrawer = useRoomsMirror('openDetailsDrawer');
  const openDeleteModal = useRoomsMirror('openDeleteModal');

  if (isLoading) {
    return (
      <Card radius="xl" withBorder p="xl">
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="md" color="blue" />
            <Text size="sm" c="dimmed" fw={600}>
              جاري تحميل القاعات الدراسية...
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card radius="xl" withBorder p="xl">
        <Center py="xl">
          <Stack align="center" gap="xs">
            <IconBuildingCommunity size={48} stroke={1.5} color="var(--mantine-color-gray-4)" />
            <Text size="md" fw={700} c="dimmed">
              لا توجد قاعات دراسية مسجلة
            </Text>
            <Text size="xs" c="dimmed">
              يمكنك إضافة قاعة جديدة بالنقر على زر "إضافة قاعة" في الأعلى
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  return (
    <Card radius="xl" withBorder p="md">
      <Table.ScrollContainer minWidth={650}>
        <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>اسم القاعة</Table.Th>
              <Table.Th>نوع القاعة</Table.Th>
              <Table.Th>السعة الاستيعابية</Table.Th>
              <Table.Th>الفرع</Table.Th>
              <Table.Th>الحصص المجدولة</Table.Th>
              <Table.Th ta="center">الإجراءات</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((room) => {
              const meta = roomTypeLabels[room.type] || {
                label: room.type,
                color: 'gray',
                icon: IconBuildingCommunity,
              };
              const IconComp = meta.icon;

              return (
                <Table.Tr key={room.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <ThemeIcon radius="xl" color={meta.color} variant="light">
                        <IconComp size={18} />
                      </ThemeIcon>
                      <Text fw={700} size="sm">
                        {room.name}
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color={meta.color} radius="xl">
                      {meta.label}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <IconUsers size={14} color="gray" />
                      <Text size="sm" fw={600}>
                        {room.capacity} مقعد
                      </Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {room.branch ? (
                      <Badge variant="outline" color="gray" radius="xl" size="xs">
                        {room.branch.name}
                      </Badge>
                    ) : (
                      <Text size="xs" c="dimmed">
                        كافة الفروع
                      </Text>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="blue" radius="xl" size="xs">
                      {room._count?.timetableEntries ?? 0} حصة
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs" justify="center">
                      <Tooltip label="التفاصيل وتوافر القاعة">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          radius="xl"
                          onClick={() => openDetailsDrawer(room)}
                        >
                          <IconEye size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="تعديل القاعة">
                        <ActionIcon
                          variant="subtle"
                          color="yellow"
                          radius="xl"
                          onClick={() => openEditDrawer(room)}
                        >
                          <IconEdit size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="حذف القاعة">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          radius="xl"
                          onClick={() => openDeleteModal(room)}
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Pagination Footer */}
      <Group justify="space-between" align="center" mt="md" wrap="wrap">
        <Text size="xs" c="dimmed">
          إجمالي القاعات: {total} قاعة
        </Text>
        {totalPages > 1 && (
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            radius="xl"
            size="sm"
          />
        )}
      </Group>
    </Card>
  );
}
