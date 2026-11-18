import Link from 'next/link';
import { Stack, Text } from '@mantine/core';
import { AppSurface, DetailList, StatusBadge } from '@/src/components/controllers';
import type { Student } from '@/src/core/api';
import { formatDate } from '@/src/core/format';
import { profileLabels as labels } from '../static-data/student-profile.data';

/** Identity, family and the enrollments (each links to its section page). Props only. */
export function StudentOverviewTab({ student }: { student: Student }) {
  const enrollments = student.studentEnrollments ?? [];
  return (
    <Stack gap="md">
      <AppSurface level={2} radius="lg" padding="md">
        <DetailList
          columns={2}
          items={[
            { label: labels.birthDate, value: student.birthDate ? formatDate(student.birthDate.slice(0, 10)) : '—' },
            { label: labels.gender, value: student.gender === 'MALE' ? labels.male : labels.female },
            { label: labels.family, value: student.family?.familyName ?? '—' },
            { label: labels.phone, value: student.family?.phone ?? '—' },
            { label: labels.city, value: student.city?.name ?? '—' },
            { label: labels.school, value: student.school?.name ?? '—' },
            { label: labels.bus, value: student.bus?.name ?? '—' },
            { label: labels.knowWay, value: student.knowWay?.name ?? '—' },
          ]}
        />
      </AppSurface>
      <AppSurface level={2} radius="lg" padding="md">
        <Text fw={600} size="sm" mb="xs">
          {labels.enrollments}
        </Text>
        {enrollments.length === 0 ? (
          <StatusBadge size="sm">{labels.noEnrollment}</StatusBadge>
        ) : (
          <Stack gap={6}>
            {enrollments.map((e) => (
              <Text key={e.id} component="div" size="sm">
                <Text component={Link} href={`/sections/${e.sectionId}`} c="inherit" fw={500} span>
                  {e.section?.name}
                </Text>
                {' · '}
                {e.academicYear?.name}{' '}
                <StatusBadge tone={e.status === 'ACTIVE' ? 'info' : 'neutral'} size="xs">
                  {e.status === 'ACTIVE' ? labels.active : e.status}
                </StatusBadge>
              </Text>
            ))}
          </Stack>
        )}
      </AppSurface>
    </Stack>
  );
}
