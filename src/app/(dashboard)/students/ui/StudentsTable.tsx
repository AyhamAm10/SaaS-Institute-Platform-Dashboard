'use client';

import Link from 'next/link';
import { Group, Text, ThemeIcon } from '@mantine/core';
import { IconBuildingCommunity, IconCash, IconEdit, IconTrash, IconUser } from '@tabler/icons-react';
import { ReportTone, Student } from '@/src/core/api';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { StatusBadge } from '@/src/components/controllers/badge';
import { studentsLabels } from '../static-data/students.data';
import { STATUS_TONES } from '../../settings/reference-data/static-data/reference-data.data';
import { StudentsActionsCell } from './StudentsActionsCell';

function toReportTone(tone?: string): ReportTone {
  switch (tone) {
    case 'brand':
    case 'success':
    case 'danger':
    case 'warning':
    case 'info':
      return tone;
    default:
      return 'neutral';
  }
}

export interface StudentsAccess {
  canManage: boolean;
  canSeeFees: boolean;
}

export function getStudentsColumns(
  onEdit: (student: Student) => void,
  onDelete: (student: Student) => void,
  onFinance: (student: Student) => void,
  access: StudentsAccess,
): DataModuleColumn<Student>[] {
  return [
    {
      key: 'fullName',
      title: studentsLabels.tableFullName,
      sortable: true,
      exportValue: (s) => s.fullName,
      exportKind: 'text',
      render: (student) => (
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon size="sm" radius="md" variant="light" color={student.gender === 'MALE' ? 'blue' : 'pink'}>
            <IconUser size={15} />
          </ThemeIcon>
          <Text component={Link} href={`/students/${student.id}`} fw={500} size="xs" style={{ fontSize: '13px' }} c="inherit">
            {student.fullName}
          </Text>
        </Group>
      ),
    },
    {
      key: 'family',
      title: studentsLabels.tableFamily,
      exportValue: (s) => s.family?.familyName ?? '—',
      exportKind: 'text',
      render: (student) => (
        <Group gap="xs" wrap="nowrap">
          <StatusBadge tone="info" size="sm">
            عائلة {student.family?.familyName || '—'}
          </StatusBadge>
          {student.family?.fatherName && <Text size="xs" c="dimmed">(الأب: {student.family.fatherName})</Text>}
          {student.family?.phone && <Text size="xs" c="dimmed" dir="ltr">{student.family.phone}</Text>}
        </Group>
      ),
    },
    {
      key: 'branch',
      title: studentsLabels.tableBranch,
      exportValue: (s) => s.branch?.name ?? '—',
      exportKind: 'text',
      render: (student) =>
        student.branch ? (
          <Group gap={6} wrap="nowrap">
            <IconBuildingCommunity size={14} color="var(--mantine-color-dimmed)" />
            <Text size="xs" fw={500}>{student.branch.name}</Text>
          </Group>
        ) : <Text size="xs" c="dimmed">—</Text>,
    },
    {
      key: 'section',
      title: studentsLabels.tableSection,
      exportValue: (s) => {
        const e = s.studentEnrollments?.[0];
        return e?.section ? `${e.section.name}${e.section.grade ? ` (${e.section.grade})` : ''}` : 'غير مسجل';
      },
      exportKind: 'text',
      render: (student) => {
        const enrollment = student.studentEnrollments?.[0];
        if (!enrollment?.section) {
          return <StatusBadge tone="neutral" variant="outline" size="xs">{studentsLabels.notEnrolled}</StatusBadge>;
        }
        return (
          <StatusBadge tone="brand" size="sm">
            {enrollment.section.name} {enrollment.section.grade ? `(${enrollment.section.grade})` : ''}
          </StatusBadge>
        );
      },
    },
    {
      key: 'status',
      title: studentsLabels.tableStatus,
      exportValue: (s) =>
        s.status
          ? {
              text: s.status.name,
              tone: toReportTone(STATUS_TONES[s.status.tone]?.badge),
            }
          : null,
      exportKind: 'badge',
      render: (student) =>
        student.status ? (
          <StatusBadge tone={STATUS_TONES[student.status.tone].badge} size="xs">
            {student.status.name}
          </StatusBadge>
        ) : <Text size="xs" c="dimmed">—</Text>,
    },
    {
      key: 'birthDate',
      title: studentsLabels.tableBirthDate,
      exportValue: (s) => s.birthDate ? String(s.birthDate).split('T')[0] : null,
      exportKind: 'date',
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
        <StudentsActionsCell
          student={student}
          access={access}
          onEdit={onEdit}
          onDelete={onDelete}
          onFinance={onFinance}
        />
      ),
    },
  ];
}
