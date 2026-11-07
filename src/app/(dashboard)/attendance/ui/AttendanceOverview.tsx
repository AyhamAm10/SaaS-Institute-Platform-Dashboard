'use client';

import { IconCalendarCheck, IconClock, IconUserCheck, IconUserX } from '@tabler/icons-react';
import { AppModule, StatCard } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';
import { formatDate, formatNumber } from '@/src/core/format';
import { useDashboardOverviewQuery } from '@/src/core/api';

export function AttendanceOverview() {
  const { data: overview } = useDashboardOverviewQuery();
  if (!overview) return null;

  const { attendance } = overview;
  const { today, week } = attendance;

  const weekBars = week.map((w) => ({
    label: formatDate(w.date),
    value: w.rate != null ? Math.round(w.rate * 100) : 0,
  }));

  const todayRateLabel = today.rate != null ? `${Math.round(today.rate * 100)}%` : '—';

  return (
    <>
      <AppModule.Stats cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatCard>
          <StatCard.Icon tone="brand">
            <IconCalendarCheck size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>نسبة حضور اليوم</StatCard.Title>
          <StatCard.Content>{todayRateLabel}</StatCard.Content>
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="brand">
            <IconUserCheck size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>حاضر</StatCard.Title>
          <StatCard.Content>{formatNumber(today.present)}</StatCard.Content>
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="ink">
            <IconClock size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>متأخر</StatCard.Title>
          <StatCard.Content>{formatNumber(today.late)}</StatCard.Content>
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="ink">
            <IconUserX size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>غائب</StatCard.Title>
          <StatCard.Content>{formatNumber(today.absent)}</StatCard.Content>
        </StatCard>
      </AppModule.Stats>

      {weekBars.length > 0 && (
        <AppModule.Charts>
          <ChartCard title="نسبة الحضور خلال الأسبوع" subtitle="نسبة الحضور اليومية لآخر أيام الدوام">
            <ChartCard.Bar data={weekBars} unit="%" withSummary={false} />
          </ChartCard>
        </AppModule.Charts>
      )}
    </>
  );
}
