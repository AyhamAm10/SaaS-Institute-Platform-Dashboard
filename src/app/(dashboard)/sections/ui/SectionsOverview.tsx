'use client';

import { IconCalendarCheck, IconSchool, IconUserCheck, IconUserOff } from '@tabler/icons-react';
import { AppModule, StatCard } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';
import { formatNumber } from '@/src/core/format';
import { useDashboardOverviewQuery } from '@/src/core/api';

export function SectionsOverview() {
  const { data: overview } = useDashboardOverviewQuery();
  if (!overview) return null;

  const { sections, students, attendance } = overview;
  const attendedToday = attendance.today.present + attendance.today.late;

  const sectionBars = sections.map((s) => ({
    label: s.name,
    value: s.students,
  }));

  return (
    <>
      <AppModule.Stats cols={{ base: 1, sm: 2, lg: 4 }}>
        <StatCard>
          <StatCard.Icon tone="brand">
            <IconSchool size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>عدد الشعب</StatCard.Title>
          <StatCard.Content>{formatNumber(sections.length)}</StatCard.Content>
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="brand">
            <IconUserCheck size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>الطلاب الفعالون</StatCard.Title>
          <StatCard.Content>{formatNumber(students.active)}</StatCard.Content>
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="ink">
            <IconUserOff size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>غير المسجّلين بشعبة</StatCard.Title>
          <StatCard.Content>{formatNumber(students.unassigned)}</StatCard.Content>
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="ink">
            <IconCalendarCheck size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>الحاضرون اليوم</StatCard.Title>
          <StatCard.Content subtitle={`من أصل ${formatNumber(students.active)} طالب`}>
            {formatNumber(attendedToday)}
          </StatCard.Content>
        </StatCard>
      </AppModule.Stats>

      {sectionBars.length > 0 && (
        <AppModule.Charts>
          <ChartCard title="توزيع الطلاب على الشعب" subtitle="عدد الطلاب المسجلين في كل شعبة">
            <ChartCard.Bar data={sectionBars} unit=" طالب" withSummary={false} />
          </ChartCard>
        </AppModule.Charts>
      )}
    </>
  );
}
