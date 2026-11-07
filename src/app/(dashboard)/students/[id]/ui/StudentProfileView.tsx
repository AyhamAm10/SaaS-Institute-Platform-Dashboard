'use client';

import { Box, Center, Group, Loader, Stack, Text } from '@mantine/core';
import { IconArrowRight, IconCalendarCheck, IconCash, IconClipboardList, IconUser } from '@tabler/icons-react';
import { AppButton, AppPageHeader, AppSurface, ReportMenu, StatusBadge } from '@/src/components/controllers';
import { AppTabs } from '@/src/components/controllers/tabs';
import type { ReactNode } from 'react';
import type { Student } from '@/src/core/api';
import { STATUS_TONES } from '../../../settings/reference-data/static-data/reference-data.data';
import { StudentFinanceController } from '../../finance/StudentFinanceController';
import { financeStudentFrom } from '../../finance/utils/student-finance.utils';
import { StudentAttendanceController } from '../StudentAttendanceController';
import { StudentResultsController } from '../StudentResultsController';
import { profileLabels as labels } from '../static-data/student-profile.data';

export type ProfileTab = 'finance' | 'attendance' | 'results';

const TABS: { value: ProfileTab; label: string; icon: ReactNode }[] = [
  {
    value: 'finance',
    label: labels.tabFinance,
    icon: <IconCash size={16} stroke={1.6} />,
  },
  {
    value: 'attendance',
    label: labels.tabAttendance,
    icon: <IconCalendarCheck size={16} stroke={1.6} />,
  },
  {
    value: 'results',
    label: labels.tabResults,
    icon: <IconClipboardList size={16} stroke={1.6} />,
  },
];

interface StudentProfileViewProps {
  student: Student | null;
  isLoading: boolean;
  /** Tabs the user may open (role.md §8.6), in display order. */
  tabs: ProfileTab[];
}

/** Student profile: identity, enrollments and the permitted tabs. Props only. */
export function StudentProfileView({ student, isLoading, tabs }: StudentProfileViewProps) {
  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  }
  if (!student) {
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.notFound}
      </Text>
    );
  }
  const enrollments = student.studentEnrollments ?? [];
  const items = TABS.filter((t) => tabs.includes(t.value));
  const facts: [string, string][] = [
    [labels.family, student.family?.familyName ?? '—'],
    [labels.phone, student.family?.phone ?? '—'],
    [labels.branch, (student as Student & { branch?: { name: string } }).branch?.name ?? '—'],
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <AppPageHeader
          icon={<IconUser size={22} />}
          title={student.fullName}
          description={facts.map(([k, v]) => `${k}: ${v}`).join(' · ')}
        />
        <Group gap="xs">
          <ReportMenu
            keys={['student-statement', 'student-transcript', 'student-attendance', 'student-card']}
            params={{ studentId: student.id }}
          />
          <AppButton variant="outline" href="/students" leftSection={<IconArrowRight size={16} />}>
            {labels.back}
          </AppButton>
        </Group>
      </Group>

      <AppSurface level={2} radius="md" padding="sm">
        <Group gap="xs" wrap="wrap">
          {student.status && (
            <StatusBadge tone={STATUS_TONES[student.status.tone].badge} size="sm">
              {student.status.name}
            </StatusBadge>
          )}
          <Text size="sm" c="var(--app-text-muted)">
            {labels.enrollments}:
          </Text>
          {enrollments.length === 0 ? (
            <StatusBadge size="sm">{labels.noEnrollment}</StatusBadge>
          ) : (
            enrollments.map((e) => (
              <StatusBadge key={e.id} tone={e.status === 'ACTIVE' ? 'info' : 'neutral'} size="sm">
                {e.section?.name} · {e.academicYear?.name}
              </StatusBadge>
            ))
          )}
        </Group>
      </AppSurface>

      {items.length > 0 && (
        <AppTabs defaultValue={items[0].value} items={items}>
          <Box>
            <AppTabs.List />
          </Box>
          {tabs.includes('finance') && (
            <AppTabs.Panel value="finance">
              <StudentFinanceController embedded student={financeStudentFrom(student)} />
            </AppTabs.Panel>
          )}
          {tabs.includes('attendance') && (
            <AppTabs.Panel value="attendance">
              <StudentAttendanceController studentId={student.id} />
            </AppTabs.Panel>
          )}
          {tabs.includes('results') && (
            <AppTabs.Panel value="results">
              <StudentResultsController studentId={student.id} />
            </AppTabs.Panel>
          )}
        </AppTabs>
      )}
    </Stack>
  );
}
