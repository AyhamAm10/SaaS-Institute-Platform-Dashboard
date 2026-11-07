'use client';

import { Group } from '@mantine/core';
import { IconAlarm, IconCalendarCheck, IconSchool, IconUsers } from '@tabler/icons-react';
import { AppModule, StatCard, StatusBadge } from '@/src/components/controllers';
import { formatNumber } from '@/src/core/format';
import { useDashboardMirror } from '../store/useDashboardMirror';
import { overdueSummary, percentText } from '../utils/dashboard-overview.utils';
import { overviewLabels as labels } from '../static-data/dashboard-overview.data';

/** The four KPI cards of the home page (real numbers). ZERO useState hooks. */
export function DashboardStats() {
  const overview = useDashboardMirror('overview');
  if (!overview) return null;

  const { students, attendance, finance } = overview;
  const enrolledTotal = students.active + students.unassigned;
  const today = attendance.today;
  const attendedToday = today.present + today.late;
  const sections = overview.sections.length;
  const overdue = overdueSummary(finance.currencies);

  return (
    <AppModule.Stats>
      <StatCard>
        <Group justify="space-between" align="center">
          <StatCard.Icon tone="brand">
            <IconUsers size={21} stroke={1.7} />
          </StatCard.Icon>
          {students.newThisMonth > 0 && <StatusBadge tone="success">{labels.newThisMonth(students.newThisMonth)}</StatusBadge>}
        </Group>
        <StatCard.Title>{labels.activeStudents}</StatCard.Title>
        <StatCard.Content subtitle={labels.unassigned(students.unassigned)}>{formatNumber(students.active)}</StatCard.Content>
        <StatCard.Progress
          value={enrolledTotal ? (students.active / enrolledTotal) * 100 : 0}
          label={labels.enrolledShare}
        />
      </StatCard>

      <StatCard>
        <Group justify="space-between" align="center">
          <StatCard.Icon tone="ink">
            <IconCalendarCheck size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatusBadge tone={overview.isWorkingDay ? 'success' : 'neutral'}>
            {overview.isWorkingDay ? labels.workingDay : labels.dayOff}
          </StatusBadge>
        </Group>
        <StatCard.Title>{labels.attendanceToday}</StatCard.Title>
        <StatCard.Content subtitle={labels.attendedOf(attendedToday, students.active)}>
          {percentText(today.rate)}
        </StatCard.Content>
        <StatCard.Action href="/attendance">{labels.openAttendance}</StatCard.Action>
      </StatCard>

      <StatCard>
        <Group justify="space-between" align="center">
          <StatCard.Icon tone="ink">
            <IconSchool size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatusBadge tone="neutral">{labels.teachers(overview.teachers)}</StatusBadge>
        </Group>
        <StatCard.Title>{labels.sectionsAndStaff}</StatCard.Title>
        <StatCard.Content
          subtitle={labels.studentsPerSection(sections ? Math.round(students.active / sections) : 0)}
        >
          {formatNumber(sections)}
        </StatCard.Content>
        <StatCard.Action href="/sections">{labels.sectionsAction}</StatCard.Action>
      </StatCard>

      <StatCard>
        <Group justify="space-between" align="center">
          <StatCard.Icon tone="brand">
            <IconAlarm size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatusBadge tone={overdue.installments > 0 ? 'danger' : 'success'}>
            {labels.overdueInstallments(overdue.installments)}
          </StatusBadge>
        </Group>
        <StatCard.Title>{labels.overdue}</StatCard.Title>
        <StatCard.Content subtitle={overdue.details || undefined}>{overdue.figure}</StatCard.Content>
        <StatCard.Action href="/overdue-installments">{labels.openOverdue}</StatCard.Action>
      </StatCard>
    </AppModule.Stats>
  );
}
