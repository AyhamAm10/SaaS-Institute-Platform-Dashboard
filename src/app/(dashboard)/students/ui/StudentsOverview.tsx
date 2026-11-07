'use client';

import { Group } from '@mantine/core';
import { IconCalendarCheck, IconClipboardList, IconSchool, IconUsers } from '@tabler/icons-react';
import { AppModule, StatCard, StatusBadge } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';
import { formatNumber } from '@/src/core/format';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { nonEmptySegments, percentText, weekBars } from '../../dashboard/utils/dashboard-overview.utils';
import { overviewLabels } from '../../dashboard/static-data/dashboard-overview.data';
import { studentsLabels as labels } from '../static-data/students.data';

/**
 * StudentsOverview
 *
 * Real KPI cards and charts above the students table (same numbers as the
 * dashboard home: GET /dashboard/overview). ZERO useState hooks.
 */
export function StudentsOverview() {
  const overview = useStudentsMirror('overview');
  if (!overview) return null;

  const { students, attendance, exams } = overview;
  const enrolledTotal = students.active + students.unassigned;
  const attendedToday = attendance.today.present + attendance.today.late;
  const bars = weekBars(attendance.week);

  return (
    <>
      <AppModule.Stats cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatCard>
          <Group justify="space-between" align="center">
            <StatCard.Icon tone="brand">
              <IconUsers size={21} stroke={1.7} />
            </StatCard.Icon>
            {students.newThisMonth > 0 && (
              <StatusBadge tone="success">{overviewLabels.newThisMonth(students.newThisMonth)}</StatusBadge>
            )}
          </Group>
          <StatCard.Title>{labels.kpiEnrolled}</StatCard.Title>
          <StatCard.Content subtitle={overviewLabels.unassigned(students.unassigned)}>
            {formatNumber(students.active)}
          </StatCard.Content>
          <StatCard.Progress
            value={enrolledTotal ? (students.active / enrolledTotal) * 100 : 0}
            label={overviewLabels.enrolledShare}
          />
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="ink">
            <IconSchool size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>{labels.kpiSections}</StatCard.Title>
          <StatCard.Content>{formatNumber(overview.sections.length)}</StatCard.Content>
          <StatCard.Action href="/sections">{labels.kpiSectionsAction}</StatCard.Action>
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="ink">
            <IconCalendarCheck size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>{labels.kpiAttendance}</StatCard.Title>
          <StatCard.Content subtitle={overviewLabels.attendedOf(attendedToday, students.active)}>
            {overview.isWorkingDay ? percentText(attendance.today.rate) : overviewLabels.dayOff}
          </StatCard.Content>
          <StatCard.Action href="/attendance">{labels.kpiAttendanceAction}</StatCard.Action>
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="brand">
            <IconClipboardList size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>{labels.kpiUpcomingExams}</StatCard.Title>
          <StatCard.Content subtitle={`${overviewLabels.average30d}: ${percentText(exams.averagePercent30d)}`}>
            {formatNumber(exams.upcoming.length)}
          </StatCard.Content>
          <StatCard.Action href="/exams">{labels.kpiExamsAction}</StatCard.Action>
        </StatCard>
      </AppModule.Stats>

      <AppModule.Charts ratio="main-side">
        <ChartCard title={overviewLabels.weekTitle} subtitle={overviewLabels.weekSubtitle}>
          {bars.length > 0 && <ChartCard.Bar data={bars} unit="%" withSummary={false} />}
        </ChartCard>
        <ChartCard title={labels.chartEnrollment} subtitle={labels.chartEnrollmentSubtitle}>
          <ChartCard.Circle
            segments={nonEmptySegments([
              { label: labels.segmentEnrolled, value: students.active, color: 'brand' },
              { label: labels.segmentUnassigned, value: students.unassigned, color: 'var(--app-border-hover)' },
            ])}
            totalLabel={labels.segmentTotal}
          />
        </ChartCard>
      </AppModule.Charts>
    </>
  );
}
