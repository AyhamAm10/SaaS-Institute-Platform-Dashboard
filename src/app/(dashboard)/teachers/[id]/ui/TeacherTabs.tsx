import Link from 'next/link';
import { Center, Loader, Stack, Table, Text } from '@mantine/core';
import { AppSurface, DetailList, StatusBadge } from '@/src/components/controllers';
import type { Teacher, TeacherSection } from '@/src/core/api';
import { formatNumber, sortWeekDays, weekDayName } from '@/src/core/format';
import { teacherDetailLabels as labels } from '../static-data/teacher-detail.data';

/** Identity, status and branches. Props only. */
export function TeacherOverviewTab({ teacher }: { teacher: Teacher }) {
  const branches = (teacher.teacherBranches ?? []).map((b) => b.branch?.name ?? `#${b.branchId}`);
  return (
    <AppSurface level={2} radius="lg" padding="md">
      <DetailList
        columns={2}
        items={[
          { label: labels.phone, value: teacher.user.phone },
          { label: labels.specialization, value: teacher.specialization || labels.notSet },
          {
            label: labels.status,
            value: (
              <StatusBadge tone={teacher.isActive ? 'success' : 'danger'} variant="dot" size="sm">
                {teacher.isActive ? labels.active : labels.inactive}
              </StatusBadge>
            ),
          },
          { label: labels.branches, value: branches.join('، ') || '—' },
        ]}
      />
    </AppSurface>
  );
}

/** Sections and subjects the teacher teaches, each section a link. Props only. */
export function TeacherSectionsTab({ rows, isLoading }: { rows: TeacherSection[]; isLoading: boolean }) {
  if (isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  if (rows.length === 0)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.noSections}
      </Text>
    );
  return (
    <AppSurface level={1} radius="lg" padding="sm">
      <Table verticalSpacing="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{labels.section}</Table.Th>
            <Table.Th>{labels.subject}</Table.Th>
            <Table.Th>{labels.branch}</Table.Th>
            <Table.Th>{labels.periods}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((r) => (
            <Table.Tr key={`${r.sectionId}-${r.subjectId}`}>
              <Table.Td>
                <Text component={Link} href={`/sections/${r.sectionId}`} size="sm" fw={500} c="inherit">
                  {r.sectionName}
                </Text>
              </Table.Td>
              <Table.Td>{r.subjectName}</Table.Td>
              <Table.Td>{r.branchName ?? '—'}</Table.Td>
              <Table.Td>{formatNumber(r.weeklyPeriods)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </AppSurface>
  );
}

/** What the teacher may teach (academic branch + subject). Props only. */
export function TeacherQualificationsTab({ teacher }: { teacher: Teacher }) {
  const rows = teacher.assignments ?? [];
  if (rows.length === 0)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.noQualifications}
      </Text>
    );
  return (
    <Stack gap="xs">
      <AppSurface level={1} radius="lg" padding="sm">
        <Table verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{labels.academicBranch}</Table.Th>
              <Table.Th>{labels.subject}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((a) => (
              <Table.Tr key={a.id}>
                <Table.Td>{a.academicBranch?.name ?? '—'}</Table.Td>
                <Table.Td>{a.subject?.name ?? '—'}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </AppSurface>
      <Text size="xs" c="var(--app-text-muted)">
        {labels.manageHint}
      </Text>
    </Stack>
  );
}

/** Weekly availability windows, grouped by day. Props only. */
export function TeacherAvailabilityTab({ teacher }: { teacher: Teacher }) {
  const windows = teacher.availabilities ?? [];
  if (windows.length === 0)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.noAvailability}
      </Text>
    );
  const days = sortWeekDays([...new Set(windows.map((w) => w.dayOfWeek))]);
  return (
    <Stack gap="sm">
      {days.map((day) => (
        <AppSurface key={day} level={2} radius="md" padding="sm">
          <Text fw={600} size="sm">
            {weekDayName(day)}
          </Text>
          <Text size="sm">
            {windows
              .filter((w) => w.dayOfWeek === day)
              .map((w) => `${w.startTime.slice(0, 5)} – ${w.endTime.slice(0, 5)}`)
              .join(' · ')}
          </Text>
        </AppSurface>
      ))}
    </Stack>
  );
}
