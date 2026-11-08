'use client';

import { Group } from '@mantine/core';
import { IconAlertTriangle, IconClockExclamation } from '@tabler/icons-react';
import { AppModule, StatCard, StatusBadge } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';
import { formatMoney, formatNumber } from '@/src/core/format';
import { useOverdueMirror } from '../store/overdue.store';
import { nonEmptySegments } from '../../dashboard/utils/dashboard-overview.utils';

const BUCKET_COLORS = {
  '1-30': 'brand',
  '31-60': 'info',
  '61-90': 'warning',
  '90+': 'danger',
};

const BUCKET_LABELS: Record<string, string> = {
  '1-30': '1 - 30 يوماً',
  '31-60': '31 - 60 يوماً',
  '61-90': '61 - 90 يوماً',
  '90+': 'أكثر من 90 يوماً',
};

export function OverdueOverview() {
  const overview = useOverdueMirror('overview');
  const aging = useOverdueMirror('aging');

  if (!overview) return null;

  const { finance } = overview;
  const currenciesWithOverdue = finance.currencies.filter(
    (c) => c.overdue > 0 || c.overdueInstallments > 0,
  );
  const activeCurrencies = currenciesWithOverdue.length > 0 ? currenciesWithOverdue : finance.currencies;

  // Group aging by currency
  const agingCurrencies = Array.from(new Set(aging?.map((a) => a.currency) ?? []));

  return (
    <>
      <AppModule.Stats cols={{ base: 1, sm: 2, lg: Math.max(2, activeCurrencies.length * 2) }}>
        {activeCurrencies.map((c) => (
          <StatCard key={`total-overdue-${c.currency}`}>
            <Group justify="space-between" align="center">
              <StatCard.Icon tone="brand">
                <IconAlertTriangle size={21} stroke={1.7} />
              </StatCard.Icon>
              <StatusBadge tone="danger" size="xs">{c.currency}</StatusBadge>
            </Group>
            <StatCard.Title>إجمالي المتأخرات ({c.currency})</StatCard.Title>
            <StatCard.Content>{formatMoney(c.overdue, c.currency)}</StatCard.Content>
          </StatCard>
        ))}

        {activeCurrencies.map((c) => (
          <StatCard key={`count-overdue-${c.currency}`}>
            <Group justify="space-between" align="center">
              <StatCard.Icon tone="ink">
                <IconClockExclamation size={21} stroke={1.7} />
              </StatCard.Icon>
              <StatusBadge tone="warning" size="xs">{c.currency}</StatusBadge>
            </Group>
            <StatCard.Title>عدد الأقساط المتأخرة ({c.currency})</StatCard.Title>
            <StatCard.Content>{formatNumber(c.overdueInstallments)} قسط</StatCard.Content>
          </StatCard>
        ))}
      </AppModule.Stats>

      {agingCurrencies.length > 0 && (
        <AppModule.Charts ratio="split">
          {agingCurrencies.map((cur) => {
            const items = (aging ?? []).filter((a) => a.currency === cur);
            const segments = nonEmptySegments(
              items.map((i) => ({
                label: BUCKET_LABELS[i.bucket] ?? i.bucket,
                value: i.amount,
                color: BUCKET_COLORS[i.bucket as keyof typeof BUCKET_COLORS] ?? 'var(--app-text-muted)',
              })),
            );

            if (segments.length === 0) return null;

            return (
              <ChartCard
                key={cur}
                title={`توزيع المتأخرات حسب المدة (${cur})`}
                subtitle={`توزيع المبالغ المتأخرة حسب فترات التأخير لعملة ${cur}`}
              >
                <ChartCard.Circle
                  segments={segments}
                  totalLabel={`إجمالي ${cur}`}
                />
              </ChartCard>
            );
          })}
        </AppModule.Charts>
      )}
    </>
  );
}
