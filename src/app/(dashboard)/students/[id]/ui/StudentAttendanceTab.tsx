'use client';

import { Center, Loader, SimpleGrid, Stack, Table, Text } from '@mantine/core';
import { AppSurface, StatusBadge } from '@/src/components/controllers';
import type { StudentAttendanceHistory } from '@/src/core/api';
import { formatDate } from '@/src/core/format';
import { toTime } from '../../../attendance/utils/attendance.utils';
import { ATTENDANCE_STATUS_META, attendanceLabels } from '../../../attendance/static-data/attendance.data';
import { profileLabels as labels } from '../static-data/student-profile.data';

const COUNT_KEYS = ['present', 'late', 'absent', 'excused'] as const;
const COUNT_TONES = {
  present: 'success',
  late: 'warning',
  absent: 'danger',
  excused: 'info',
} as const;

export interface StudentAttendanceTabProps {
  history: StudentAttendanceHistory | null;
  isLoading: boolean;
  timeZone?: string;
}

/** Last 30 days of attendance with counters. Props only. */
export function StudentAttendanceTab({ history, isLoading, timeZone }: StudentAttendanceTabProps) {
  if (isLoading || !history) {
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Text size="sm" c="var(--app-text-muted)">
        {labels.attendanceRange}: {formatDate(history.from)} – {formatDate(history.to)}
      </Text>
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
        {COUNT_KEYS.map((key) => (
          <AppSurface key={key} level={2} radius="md" padding="sm">
            <Text size="xs" c="var(--app-text-muted)">
              {attendanceLabels.counts[key]}
            </Text>
            <StatusBadge tone={COUNT_TONES[key]} size="md">
              {history.counts[key]}
            </StatusBadge>
          </AppSurface>
        ))}
      </SimpleGrid>

      {history.records.length === 0 ? (
        <Text ta="center" py="lg" c="var(--app-text-muted)">
          {labels.noAttendance}
        </Text>
      ) : (
        <AppSurface level={1} radius="lg" padding="sm">
          <Table verticalSpacing="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{labels.date}</Table.Th>
                <Table.Th>{labels.status}</Table.Th>
                <Table.Th>{labels.checkIn}</Table.Th>
                <Table.Th>{labels.checkOut}</Table.Th>
                <Table.Th>{labels.note}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {history.records.map((r) => {
                const meta = ATTENDANCE_STATUS_META[r.status];
                return (
                  <Table.Tr key={r.id}>
                    <Table.Td>{formatDate(r.date.slice(0, 10))}</Table.Td>
                    <Table.Td>
                      <StatusBadge tone={meta.tone} variant="dot" size="xs">
                        {meta.label}
                      </StatusBadge>
                    </Table.Td>
                    <Table.Td>{toTime(r.checkInAt, timeZone) || '—'}</Table.Td>
                    <Table.Td>{toTime(r.checkOutAt, timeZone) || '—'}</Table.Td>
                    <Table.Td>{r.note ?? ''}</Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </AppSurface>
      )}
    </Stack>
  );
}
