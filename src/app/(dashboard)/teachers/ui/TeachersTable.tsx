'use client';

import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  IconEdit,
  IconEye,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { Teacher } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';

/**
 * getTeachersColumns
 *
 * Column definitions for Teachers table.
 * Strictly adheres to DataModuleController compound pattern.
 */
export function getTeachersColumns(
  openDetailsDrawer: (teacher: Teacher) => void,
  openEditDrawer: (teacher: Teacher) => void,
  openDeleteModal: (teacher: Teacher) => void,
): DataModuleColumn<Teacher>[] {
  return [
    {
      key: 'user',
      title: 'المعلم',
      sortable: true,
      render: (teacher) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar radius="md" color="blue" variant="light" size="sm">
            <IconUser size={16} />
          </Avatar>
          <Stack gap={1}>
            <Text fw={600} size="xs" style={{ fontSize: '13px' }}>
              {teacher.user.fullName}
            </Text>
            <Text size="xs" c="dimmed" style={{ fontSize: '11px' }}>
              {teacher.assignments?.length || 0} مؤهلات تدريسية
            </Text>
          </Stack>
        </Group>
      ),
    },
    {
      key: 'phone',
      title: 'رقم الهاتف',
      render: (teacher) => (
        <Text size="xs" dir="ltr" ta="right" c="dimmed">
          {teacher.user.phone || '—'}
        </Text>
      ),
    },
    {
      key: 'specialization',
      title: 'التخصص',
      render: (teacher) =>
        teacher.specialization ? (
          <Badge variant="light" color="indigo" radius="sm" size="sm">
            {teacher.specialization}
          </Badge>
        ) : (
          <Text size="xs" c="dimmed">
            غير محدد
          </Text>
        ),
    },
    {
      key: 'branches',
      title: 'الفروع التابعة',
      render: (teacher) => (
        <Group gap={4} wrap="nowrap">
          {teacher.teacherBranches && teacher.teacherBranches.length > 0 ? (
            teacher.teacherBranches.map((tb) => (
              <Badge
                key={tb.branchId}
                variant="outline"
                color="gray"
                size="xs"
                radius="sm"
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
      ),
    },
    {
      key: 'isActive',
      title: 'الحالة',
      render: (teacher) => (
        <Badge
          variant="dot"
          color={teacher.isActive ? 'teal' : 'red'}
          radius="sm"
          size="sm"
        >
          {teacher.isActive ? 'نشط' : 'غير نشط'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      align: 'center',
      render: (teacher) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <Tooltip label="التفاصيل والمؤهلات والدوام" withArrow>
            <ActionIcon
              variant="subtle"
              color="blue"
              radius="md"
              size="sm"
              onClick={() => openDetailsDrawer(teacher)}
            >
              <IconEye size={15} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="تعديل البيانات" withArrow>
            <ActionIcon
              variant="subtle"
              color="yellow"
              radius="md"
              size="sm"
              onClick={() => openEditDrawer(teacher)}
            >
              <IconEdit size={15} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="حذف المعلم" withArrow>
            <ActionIcon
              variant="subtle"
              color="red"
              radius="md"
              size="sm"
              onClick={() => openDeleteModal(teacher)}
            >
              <IconTrash size={15} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];
}
