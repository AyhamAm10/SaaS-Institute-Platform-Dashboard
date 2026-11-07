'use client';

import { IconAward, IconCalendarEvent } from '@tabler/icons-react';
import { AppModule, StatCard } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';
import { formatNumber } from '@/src/core/format';
import { useDashboardOverviewQuery } from '@/src/core/api';

export function ExamsOverview() {
  const { data: overview } = useDashboardOverviewQuery();
  if (!overview) return null;

  const { exams, sections } = overview;
  const sectionAverageBars = sections
    .filter((s) => s.averagePercent !== null && s.averagePercent !== undefined)
    .map((s) => ({
      label: s.name,
      value: s.averagePercent as number,
    }));

  return (
    <>
      <AppModule.Stats cols={{ base: 1, sm: 2 }}>
        <StatCard>
          <StatCard.Icon tone="brand">
            <IconCalendarEvent size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>المذاكرات القادمة (14 يوماً)</StatCard.Title>
          <StatCard.Content>{formatNumber(exams.upcoming.length)}</StatCard.Content>
        </StatCard>

        <StatCard>
          <StatCard.Icon tone="ink">
            <IconAward size={21} stroke={1.7} />
          </StatCard.Icon>
          <StatCard.Title>متوسط النتائج (آخر 30 يوماً)</StatCard.Title>
          <StatCard.Content>
            {exams.averagePercent30d !== null ? `${exams.averagePercent30d}%` : '—'}
          </StatCard.Content>
        </StatCard>
      </AppModule.Stats>

      {sectionAverageBars.length > 0 && (
        <AppModule.Charts>
          <ChartCard title="متوسط درجات الشعب" subtitle="متوسط نسبة الدرجات في الشعب المسجل بها نتائج">
            <ChartCard.Bar data={sectionAverageBars} unit="%" withSummary={false} />
          </ChartCard>
        </AppModule.Charts>
      )}
    </>
  );
}
