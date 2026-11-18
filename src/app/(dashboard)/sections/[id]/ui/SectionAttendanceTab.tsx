import { Alert, Center, Group, Loader, SimpleGrid, Table, Text } from '@mantine/core';
import { AppButton, AppSurface, StatusBadge } from '@/src/components/controllers';
import type { DailyAttendance } from '@/src/core/api';
import { formatDate } from '@/src/core/format';
import { toTime } from '../../../attendance/utils/attendance.utils';
import { ATTENDANCE_STATUS_META, attendanceLabels } from '../../../attendance/static-data/attendance.data';
import { sectionDetailLabels as labels } from '../static-data/section-detail.data';

const KEYS = ['present', 'late', 'absent', 'excused', 'notRecorded'] as const;

interface Props {
  daily: DailyAttendance | null;
  isLoading: boolean;
  timeZone?: string;
  canManage?: boolean;
  isBusy?: boolean;
  notice?: { tone: 'success' | 'error'; text: string } | null;
  onBulk?: (action: 'check-in' | 'check-out') => void;
}

/** Today's roster of the section with counters. Props only. */
export function SectionAttendanceTab({ daily, isLoading, timeZone, canManage, isBusy, notice, onBulk }: Props) {
  if (isLoading || !daily)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  const off = daily.closure ? `${labels.holiday}: ${daily.closure.reason}` : !daily.isWorkingDay && labels.notWorkingDay;
  return (
    <>
      <Text component="div" size="sm" c="var(--app-text-muted)" mb="sm">
        {labels.attendanceToday}: {formatDate(daily.date)} {off && <StatusBadge size="xs">{off}</StatusBadge>}
      </Text>
      {canManage && onBulk && (
        <Group gap="xs" mb="sm">
          <AppButton loading={isBusy} onClick={() => onBulk('check-in')}>
            {labels.checkInAll}
          </AppButton>
          <AppButton variant="outline" loading={isBusy} onClick={() => onBulk('check-out')}>
            {labels.checkOutAll}
          </AppButton>
        </Group>
      )}
      {notice && (
        <Alert color={notice.tone === 'success' ? 'green' : 'red'} variant="light" radius="md" mb="sm">
          {notice.text}
        </Alert>
      )}
      <SimpleGrid cols={{ base: 2, sm: 5 }} spacing="sm" mb="md">
        {KEYS.map((k) => (
          <AppSurface key={k} level={2} radius="md" padding="sm">
            <Text size="xs" c="var(--app-text-muted)">
              {attendanceLabels.counts[k]}
            </Text>
            <Text fw={600}>{daily.counts[k]}</Text>
          </AppSurface>
        ))}
      </SimpleGrid>
      {daily.rows.length === 0 ? (
        <Text ta="center" py="lg" c="var(--app-text-muted)">
          {labels.noRoster}
        </Text>
      ) : (
        <AppSurface level={1} radius="lg" padding="sm">
          <Table verticalSpacing="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{labels.student}</Table.Th>
                <Table.Th>{labels.status}</Table.Th>
                <Table.Th>{labels.checkIn}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {daily.rows.map(({ student, record }) => {
                const meta = record && ATTENDANCE_STATUS_META[record.status];
                return (
                  <Table.Tr key={student.id}>
                    <Table.Td>{student.fullName}</Table.Td>
                    <Table.Td>
                      <StatusBadge tone={meta?.tone ?? 'neutral'} variant="dot" size="xs">
                        {meta?.label ?? labels.notRecorded}
                      </StatusBadge>
                    </Table.Td>
                    <Table.Td>{toTime(record?.checkInAt ?? null, timeZone) || '—'}</Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </AppSurface>
      )}
    </>
  );
}
