'use client';

import { Alert, Center, Group, Loader, Stack } from '@mantine/core';
import { IconArrowLeft, IconInfoCircle, IconSchool, IconUsers } from '@tabler/icons-react';
import { AppButton, AppModule } from '@/src/components/controllers';
import { useDashboardMirror } from '../store/useDashboardMirror';
import { overviewLabels as labels } from '../static-data/dashboard-overview.data';
import { DashboardStats } from './DashboardStats';
import { DashboardAttendanceCharts } from './DashboardAttendanceCharts';
import { DashboardFinanceExams } from './DashboardFinanceExams';
import { DashboardSectionsTable } from './DashboardSectionsTable';

/**
 * DashboardView
 *
 * Dashboard home with real numbers of the active branch and year
 * (GET /dashboard/overview). Composition only. ZERO useState hooks.
 */
export function DashboardView() {
  const overview = useDashboardMirror('overview');
  const isLoading = useDashboardMirror('isLoading');

  return (
    <AppModule>
      {/* Title + actions only: branch and academic year already live in the top bar. */}
      <AppModule.Header
        title={labels.title}
        actions={
          <Group gap="sm">
            <AppButton href="/sections" variant="outline" leftSection={<IconSchool size={16} stroke={1.7} />}>
              {labels.sectionsAction}
            </AppButton>
            <AppButton href="/students" leftSection={<IconUsers size={16} stroke={1.7} />} rightSection={<IconArrowLeft size={14} />}>
              {labels.studentsAction}
            </AppButton>
          </Group>
        }
      />

      {isLoading && !overview ? (
        <Center py="xl">
          <Loader size="sm" color="primary" />
        </Center>
      ) : !overview ? (
        <Alert color="red" variant="light" radius="md">
          {labels.loadError}
        </Alert>
      ) : (
        <Stack gap={0}>
          {!overview.academicYear && (
            <Alert icon={<IconInfoCircle size={16} />} color="yellow" variant="light" radius="md" mb="md">
              {labels.noYear}
            </Alert>
          )}
          <DashboardStats />
          <DashboardAttendanceCharts />
          <DashboardFinanceExams />
          <DashboardSectionsTable />
        </Stack>
      )}
    </AppModule>
  );
}
