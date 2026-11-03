'use client';

import { Group, Text, ThemeIcon } from '@mantine/core';
import { IconBuildingCommunity, IconEdit, IconTrash, IconUser } from '@tabler/icons-react';
import { Student } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { AppIconButton } from '@/src/components/controllers/button';
import { StatusBadge } from '@/src/components/controllers/badge';
import { studentsLabels } from '../static-data/students.data';

/**
 * getStudentsColumns
 *
 * Column definitions for the Students table.
 * Strictly adheres to DataModuleController compound pattern.
 */
export function getStudentsColumns(
  onEdit: (student: Student) => void,
  onDelete: (student: Student) => void,
): DataModuleColumn<Student>[] {
  return [
    {
      key: 'fullName',
      title: studentsLabels.tableFullName,
      sortable: true,
      render: (student) => (
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon
            size="sm"
            radius="md"
            variant="light"
            color={student.gender === 'MALE' ? 'blue' : 'pink'}
          >
            <IconUser size={15} />
          </ThemeIcon>
          <Text fw={500} size="xs" style={{ fontSize: '13px' }}>
            {student.fullName}
          </Text>
        </Group>
      ),
    },
    {
      key: 'family',
      title: studentsLabels.tableFamily,
      render: (student) => (
        <Group gap="xs" wrap="nowrap">
          <StatusBadge tone="info" size="sm">
            عائلة {student.family?.familyName || '—'}
          </StatusBadge>
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
      title: studentsLabels.tableBranch,
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
      title: studentsLabels.tableSection,
      render: (student) => {
        const enrollment = student.studentEnrollments?.[0];
        if (!enrollment?.section) {
          return (
            <StatusBadge tone="neutral" variant="outline" size="xs">
              {studentsLabels.notEnrolled}
            </StatusBadge>
          );
        }
        return (
          <StatusBadge tone="brand" size="sm">
            {enrollment.section.name} {enrollment.section.grade ? `(${enrollment.section.grade})` : ''}
          </StatusBadge>
        );
      },
    },
    {
      key: 'birthDate',
      title: studentsLabels.tableBirthDate,
      render: (student) => (
        <Text size="xs" c="dimmed" dir="ltr" ta="right">
          {student.birthDate ? String(student.birthDate).split('T')[0] : '—'}
        </Text>
      ),
    },
    {
      key: 'actions',
      title: studentsLabels.tableActions,
      align: 'center',
      render: (student) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <AppIconButton
            variant="ghost"
            size="sm"
            label={studentsLabels.editButton}
            onClick={() => onEdit(student)}
          >
            <IconEdit size={15} />
          </AppIconButton>
          <AppIconButton
            variant="danger"
            size="sm"
            label={studentsLabels.deleteButton}
            onClick={() => onDelete(student)}
          >
            <IconTrash size={15} />
          </AppIconButton>
        </Group>
      ),
    },
  ];
}
