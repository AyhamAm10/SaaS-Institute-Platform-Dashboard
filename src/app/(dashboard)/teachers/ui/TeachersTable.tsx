'use client';

import { Avatar, Badge, Group, Stack, Text } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { Teacher } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { TeacherActionsCell } from './TeacherActionsCell';

export interface TeachersColumnsAccess {
  canManage?: boolean;
}

export function getTeachersColumns(
  openDetailsDrawer: (teacher: Teacher) => void,
  openEditDrawer: (teacher: Teacher) => void,
  openDeleteModal: (teacher: Teacher) => void,
  openPasswordModal?: (teacher: Teacher) => void,
  access: TeachersColumnsAccess = { canManage: true },
): DataModuleColumn<Teacher>[] {
  const canManage = access.canManage ?? true;
  return [
    {
      key: 'user',
      title: 'المعلم',
      sortable: true,
      exportValue: (t) => t.user.fullName,
      exportKind: 'text',
      render: (teacher) => (
        <Group gap="sm" wrap="nowrap">
          <Avatar radius="md" color="blue" variant="light" size="sm">
            <IconUser size={16} />
          </Avatar>
          <Stack gap={1}>
            <Text fw={500} size="xs" style={{ fontSize: '13px' }}>
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
      exportValue: (t) => t.user.phone || null,
      exportKind: 'phone',
      render: (teacher) => (
        <Text size="xs" dir="ltr" ta="right" c="dimmed">
          {teacher.user.phone || '—'}
        </Text>
      ),
    },
    {
      key: 'specialization',
      title: 'التخصص',
      exportValue: (t) => t.specialization || 'غير محدد',
      exportKind: 'text',
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
      exportValue: (t) =>
        t.teacherBranches && t.teacherBranches.length > 0
          ? t.teacherBranches.map((tb) => tb.branch?.name || `فرع ${tb.branchId}`).join('، ')
          : 'كافة الفروع',
      exportKind: 'text',
      render: (teacher) => (
        <Group gap={4} wrap="nowrap">
          {teacher.teacherBranches && teacher.teacherBranches.length > 0 ? (
            teacher.teacherBranches.map((tb) => (
              <Badge key={tb.branchId} variant="outline" color="gray" size="xs" radius="sm">
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
      exportValue: (t) => ({
        text: t.isActive ? 'نشط' : 'معطل',
        tone: t.isActive ? 'success' : 'neutral',
      }),
      exportKind: 'badge',
      render: (teacher) => (
        <Badge
          variant="dot"
          color={teacher.isActive ? 'teal' : 'gray'}
          radius="sm"
          size="sm"
        >
          {teacher.isActive ? 'نشط' : 'معطل'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      align: 'center',
      render: (teacher) => (
        <TeacherActionsCell
          teacher={teacher}
          canManage={canManage}
          openDetailsDrawer={openDetailsDrawer}
          openEditDrawer={openEditDrawer}
          openDeleteModal={openDeleteModal}
          openPasswordModal={openPasswordModal}
        />
      ),
    },
  ];
}
