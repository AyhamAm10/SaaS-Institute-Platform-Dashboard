'use client';

import { Group, Stack, Table, Text } from '@mantine/core';
import { IconEdit, IconLogin, IconLogout, IconNotes } from '@tabler/icons-react';
import { AppButton, AppIconButton, AppSurface, StatusBadge } from '@/src/components/controllers';
import { useAttendanceMirror } from '../store/attendance.store';
import type { AttendanceActions } from '../useAttendanceActions';
import { rowActions, toTime } from '../utils/attendance.utils';
import { ATTENDANCE_STATUS_META, attendanceLabels as labels } from '../static-data/attendance.data';

/** Day roster: one row per active student with check-in / check-out actions. ZERO useState hooks. */
export function AttendanceTable({ actions }: { actions: AttendanceActions }) {
  const day = useAttendanceMirror('day');
  const busyStudentId = useAttendanceMirror('busyStudentId');
  const openExcuse = useAttendanceMirror('openExcuse');
  const openEdit = useAttendanceMirror('openEdit');
  const timeZone = useAttendanceMirror('timeZone');
  const rows = day?.rows ?? [];
  const working = Boolean(day?.isWorkingDay);

  if (rows.length === 0) {
    return (
      <Text c="var(--app-text-muted)" ta="center" py="xl">
        {labels.noStudents}
      </Text>
    );
  }

  return (
    <AppSurface level={1} radius="lg" padding="sm">
      <Table.ScrollContainer minWidth={640}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{labels.student}</Table.Th>
              <Table.Th>{labels.status}</Table.Th>
              <Table.Th>{labels.checkInTime}</Table.Th>
              <Table.Th>{labels.checkOutTime}</Table.Th>
              <Table.Th ta="center">{labels.actions}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((row) => {
              const { record } = row;
              const can = rowActions(row);
              const meta = record ? ATTENDANCE_STATUS_META[record.status] : null;
              const busy = busyStudentId === row.student.id;
              return (
                <Table.Tr key={row.student.id}>
                  <Table.Td>
                    <Stack gap={0}>
                      <Text size="sm" fw={500}>
                        {row.student.fullName}
                      </Text>
                      {record?.note && (
                        <Text size="xs" c="var(--app-text-muted)">
                          {record.note}
                        </Text>
                      )}
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <StatusBadge tone={meta?.tone ?? 'neutral'} variant="dot" size="xs">
                      {meta?.label ?? labels.notRecorded}
                    </StatusBadge>
                  </Table.Td>
                  <Table.Td>{toTime(record?.checkInAt, timeZone) || '—'}</Table.Td>
                  <Table.Td>{toTime(record?.checkOutAt, timeZone) || '—'}</Table.Td>
                  <Table.Td>
                    <Group gap={6} justify="center" wrap="nowrap">
                      {can.canCheckIn && (
                        <AppButton size="xs" leftSection={<IconLogin size={14} />} disabled={!working} loading={busy} onClick={() => actions.mark(row.student.id, 'check-in')}>
                          {labels.checkIn}
                        </AppButton>
                      )}
                      {can.canCheckOut && (
                        <AppButton size="xs" variant="outline" leftSection={<IconLogout size={14} />} loading={busy} onClick={() => actions.mark(row.student.id, 'check-out')}>
                          {labels.checkOut}
                        </AppButton>
                      )}
                      {can.canExcuse && (
                        <AppIconButton size="sm" label={labels.excuse} onClick={() => openExcuse(row)}>
                          <IconNotes size={15} />
                        </AppIconButton>
                      )}
                      {can.canEdit && record && (
                        <AppIconButton size="sm" variant="ghost" label={labels.edit} onClick={() => openEdit(record)}>
                          <IconEdit size={15} />
                        </AppIconButton>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </AppSurface>
  );
}
