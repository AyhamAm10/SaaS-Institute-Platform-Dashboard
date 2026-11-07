'use client';

import { Text } from '@mantine/core';
import { AppModule } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';
import { formatDate } from '@/src/core/format';
import { useDashboardMirror } from '../store/useDashboardMirror';
import { nonEmptySegments, todaySegments, weekBars } from '../utils/dashboard-overview.utils';
import { overviewLabels as labels } from '../static-data/dashboard-overview.data';

/** Attendance rate of the last working days + today's statuses. ZERO useState hooks. */
export function DashboardAttendanceCharts() {
  const overview = useDashboardMirror('overview');
  if (!overview) return null;
  const bars = weekBars(overview.attendance.week);
  const segments = nonEmptySegments(todaySegments(overview.attendance.today));

  return (
    <AppModule.Charts ratio="main-side">
      <ChartCard title={labels.weekTitle} subtitle={labels.weekSubtitle}>
        {bars.length > 0 ? (
          <ChartCard.Bar data={bars} unit="%" withSummary={false} />
        ) : (
          <Text size="sm" c="var(--app-text-muted)" ta="center" py="xl">
            {labels.noRecords}
          </Text>
        )}
      </ChartCard>

      <ChartCard title={labels.todayTitle} subtitle={overview.isWorkingDay ? formatDate(overview.today) : labels.dayOff}>
        {segments.length > 0 ? (
          <ChartCard.Circle segments={segments} totalLabel={labels.todayTotal} />
        ) : (
          <Text size="sm" c="var(--app-text-muted)" ta="center" py="xl">
            {labels.noRecords}
          </Text>
        )}
      </ChartCard>
    </AppModule.Charts>
  );
}
