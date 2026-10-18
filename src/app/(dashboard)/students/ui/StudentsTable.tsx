'use client';

import { ActionIcon, Badge, Group, Text, Tooltip } from '@mantine/core';
import { IconBuildingCommunity, IconEye, IconPhone, IconUser, IconUsers } from '@tabler/icons-react';
import { Student } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';

export function getStudentsColumns(onView?: (student: Student) => void): DataModuleColumn<Student>[] {
  return [
    {
      key: 'fullName',
      title: 'اسم الطالب',
      sortable: true,
      render: (student) => (
        <Group gap="sm" wrap="nowrap">
          <ActionIcon
            size="sm"
            radius="md"
            variant="light"
            color={student.gender === 'MALE' ? 'blue' : 'pink'}
          >
            <IconUser size={15} />
          </ActionIcon>
          <Text fw={600} size="xs" style={{ fontSize: '13px' }}>
            {student.fullName}
          </Text>
        </Group>
      ),
    },
    {
      key: 'family',
      title: 'العائلة والتواصل',
      render: (student) => (
        <Group gap="xs" wrap="nowrap">
          <Badge variant="light" color="teal" radius="sm" size="sm">
            عائلة {student.family?.familyName || '—'}
          </Badge>
          {student.family?.fatherName && (
            <Text size="xs" c="dimmed">
              (الأب: {student.family.fatherName})
            </Text>
          )}
          {student.family?.phone && (
            <Text size="xs" c="dimmed" dir="ltr">
              {student.family.phone}
            </Text>
          )}
        </Group>
      ),
    },
    {
      key: 'branch',
      title: 'الفرع الجغرافي',
      render: (student) =>
        student.branch ? (
          <Group gap={6} wrap="nowrap">
            <IconBuildingCommunity size={14} color="var(--mantine-color-dimmed)" />
            <Text size="xs" fw={500}>
              {student.branch.name}
            </Text>
          </Group>
        ) : (
          <Text size="xs" c="dimmed">
            —
          </Text>
        ),
    },
    {
      key: 'section',
      title: 'الشعبة المسجل بها',
      render: (student) => {
        const enrollment = student.studentEnrollments?.[0];
        if (!enrollment?.section) {
          return (
            <Badge variant="outline" color="gray" radius="sm" size="xs">
              غير مسكن بشعبة
            </Badge>
          );
        }
        return (
          <Badge variant="light" color="primary" radius="sm" size="sm">
            {enrollment.section.name} {enrollment.section.grade ? `(${enrollment.section.grade})` : ''}
          </Badge>
        );
      },
    },
    {
      key: 'birthDate',
      title: 'تاريخ الميلاد',
      render: (student) => (
        <Text size="xs" c="dimmed" dir="ltr" ta="right">
          {student.birthDate ? String(student.birthDate).split('T')[0] : '—'}
        </Text>
      ),
    },
  ];
}
