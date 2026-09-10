'use client';

import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Center,
  Group,
  Loader,
  Pagination,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconEdit,
  IconEye,
  IconSchool,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { Teacher } from '@/src/core/api';
import { useTeachersMirror } from '../store/useTeachersMirror';

export function TeachersTable() {
  const data = useTeachersMirror('data');
  const isLoading = useTeachersMirror('isLoading');
  const page = useTeachersMirror('page');
  const totalPages = useTeachersMirror('totalPages');
  const total = useTeachersMirror('total');
  const setPage = useTeachersMirror('setPage');
  const openEditDrawer = useTeachersMirror('openEditDrawer');
  const openDetailsDrawer = useTeachersMirror('openDetailsDrawer');
  const openDeleteModal = useTeachersMirror('openDeleteModal');

  if (isLoading) {
    return (
      <Card radius="xl" withBorder p="xl">
        <Center py="xl">
          <Stack align="center" gap="md">
            <Loader size="md" color="blue" />
            <Text size="sm" c="dimmed" fw={600}>
              جاري تحميل بيانات الكادر التدريسي...
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
            <IconSchool size={48} stroke={1.5} color="var(--mantine-color-gray-4)" />
            <Text size="md" fw={700} c="dimmed">
              لا يوجد معلمون مسجلون حالياً
            </Text>
            <Text size="xs" c="dimmed">
              يمكنك إضافة معلم جديد بالنقر على زر "إضافة معلم" في الأعلى
            </Text>
          </Stack>
        </Center>
      </Card>
    );
  }

  return (
    <Card radius="xl" withBorder p="md">
      <Table.ScrollContainer minWidth={700}>
        <Table verticalSpacing="sm" horizontalSpacing="md" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>المعلم</Table.Th>
              <Table.Th>رقم الهاتف</Table.Th>
              <Table.Th>التخصص</Table.Th>
              <Table.Th>الفروع التابعة</Table.Th>
              <Table.Th>الحالة</Table.Th>
              <Table.Th ta="center">الإجراءات</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((teacher) => (
              <Table.Tr key={teacher.id}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar radius="xl" color="blue" variant="light">
                      <IconUser size={18} />
                    </Avatar>
                    <Stack gap={2}>
                      <Text fw={700} size="sm">
                        {teacher.user.fullName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {teacher.assignments?.length || 0} مؤهلات تدريسية
                      </Text>
                    </Stack>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" dir="ltr" ta="right">
                    {teacher.user.phone}
                  </Text>
                </Table.Td>
                <Table.Td>
                  {teacher.specialization ? (
                    <Badge variant="light" color="indigo" radius="xl">
                      {teacher.specialization}
                    </Badge>
                  ) : (
                    <Text size="xs" c="dimmed">
                      غير محدد
                    </Text>
                  )}
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    {teacher.teacherBranches && teacher.teacherBranches.length > 0 ? (
                      teacher.teacherBranches.map((tb) => (
                        <Badge
                          key={tb.branchId}
                          variant="outline"
                          color="gray"
                          size="xs"
                          radius="xl"
                        >
                          {tb.branch?.name || `فرع ${tb.branchId}`}
                        </Badge>
                      ))
                    ) : (
                      <Text size="xs" c="dimmed">
                        كافة الفروع
                      </Text>
                    )}
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge
                    variant="dot"
                    color={teacher.isActive ? 'teal' : 'red'}
                    radius="xl"
                  >
                    {teacher.isActive ? 'نشط' : 'غير نشط'}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" justify="center">
                    <Tooltip label="التفاصيل والمؤهلات والدوام">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        radius="xl"
                        onClick={() => openDetailsDrawer(teacher)}
                      >
                        <IconEye size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="تعديل البيانات">
                      <ActionIcon
                        variant="subtle"
                        color="yellow"
                        radius="xl"
                        onClick={() => openEditDrawer(teacher)}
                      >
                        <IconEdit size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="حذف المعلم">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        radius="xl"
                        onClick={() => openDeleteModal(teacher)}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {/* Pagination Footer */}
      <Group justify="space-between" align="center" mt="md" wrap="wrap">
        <Text size="xs" c="dimmed">
          إجمالي المعلمين: {total} معلم
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
