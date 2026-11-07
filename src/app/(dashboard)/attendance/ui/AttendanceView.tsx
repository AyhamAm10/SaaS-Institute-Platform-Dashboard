'use client';

import { Alert, Center, Group, Loader, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconCalendarCheck, IconLogin, IconLogout } from '@tabler/icons-react';
import {
  AppButton,
  AppDatePicker,
  AppModule,
  AppPageHeader,
  AppSelect,
  AppSurface,
  ReportMenu,
  StatusBadge,
} from '@/src/components/controllers';
import { useAttendanceMirror } from '../store/attendance.store';
import type { AttendanceActions } from '../useAttendanceActions';
import { attendanceLabels as labels } from '../static-data/attendance.data';
import { AttendanceOverview } from './AttendanceOverview';
import { AttendanceTable } from './AttendanceTable';
import { AttendanceModals } from './AttendanceModals';

const COUNT_TONES = { present: 'success', late: 'warning', absent: 'danger', excused: 'info', notRecorded: 'neutral' } as const;

/** Section + date toolbar, counters, roster and modals. ZERO useState hooks. */
export function AttendanceView({ actions }: { actions: AttendanceActions }) {
  const sectionId = useAttendanceMirror('sectionId');
  const sectionOptions = useAttendanceMirror('sectionOptions');
  const setSectionId = useAttendanceMirror('setSectionId');
  const date = useAttendanceMirror('date');
  const setDate = useAttendanceMirror('setDate');
  const day = useAttendanceMirror('day');
  const isLoading = useAttendanceMirror('isLoading');
  const bulkBusy = useAttendanceMirror('bulkBusy');
  const notice = useAttendanceMirror('notice');
  const setNotice = useAttendanceMirror('setNotice');
  const canAct = Boolean(sectionId && day?.isWorkingDay && day.rows.length > 0);

  return (
    <AppModule exportTitle="تسجيل الحضور">
      <Stack gap="lg">
        <AppPageHeader
          icon={<IconCalendarCheck size={22} />}
          title={labels.title}
          description={labels.description}
          actions={<ReportMenu keys={['daily-attendance', 'frequent-absences']} params={{}} />}
        />

        <AttendanceOverview />

        <AppSurface level={1} radius="lg" padding="md">
        <Group justify="space-between" align="flex-end" wrap="wrap" gap="sm">
          <Group gap="sm" align="flex-end" wrap="wrap">
            <AppSelect
              label={labels.section}
              placeholder={labels.sectionPlaceholder}
              data={sectionOptions}
              value={sectionId}
              onChange={(v: string | null) => setSectionId(v)}
              searchable
              w={220}
            />
            <AppDatePicker label={labels.date} value={date} onChange={(v) => v && setDate(v)} w={180} />
          </Group>
          <Group gap="xs">
            <AppButton leftSection={<IconLogin size={16} />} disabled={!canAct} loading={bulkBusy === 'check-in'} onClick={() => actions.markAll('check-in')}>
              {labels.bulkCheckIn}
            </AppButton>
            <AppButton variant="outline" leftSection={<IconLogout size={16} />} disabled={!canAct} loading={bulkBusy === 'check-out'} onClick={() => actions.markAll('check-out')}>
              {labels.bulkCheckOut}
            </AppButton>
          </Group>
        </Group>
      </AppSurface>

      {notice && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color={notice.tone === 'success' ? 'green' : notice.tone === 'warning' ? 'yellow' : 'red'}
          variant="light"
          radius="md"
          withCloseButton
          onClose={() => setNotice(null)}
        >
          {notice.text}
        </Alert>
      )}

      {day && (
        <SimpleGrid cols={{ base: 2, sm: 5 }} spacing="sm">
          {(Object.keys(COUNT_TONES) as (keyof typeof COUNT_TONES)[]).map((key) => (
            <AppSurface key={key} level={2} radius="md" padding="sm">
              <Text size="xs" c="var(--app-text-muted)">
                {labels.counts[key]}
              </Text>
              <StatusBadge tone={COUNT_TONES[key]} size="md">
                {day.counts[key]}
              </StatusBadge>
            </AppSurface>
          ))}
        </SimpleGrid>
      )}

      {day && !day.isWorkingDay && (
        <Alert color="yellow" variant="light" radius="md">
          {labels.notWorkingDay}
        </Alert>
      )}

      {!sectionId ? (
        <Text c="var(--app-text-muted)" ta="center" py="xl">
          {labels.pickSection}
        </Text>
      ) : isLoading && !day ? (
        <Center py="xl">
          <Loader size="sm" color="primary" />
        </Center>
      ) : (
        <AttendanceTable actions={actions} />
      )}

      <AttendanceModals actions={actions} />
      </Stack>
    </AppModule>
  );
}
