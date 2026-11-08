'use client';

import { Group, Text } from '@mantine/core';
import { IconCash, IconClock, IconPigMoney } from '@tabler/icons-react';
import { AppModule, StatCard, StatusBadge } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';
import { formatMoney } from '@/src/core/format';
import { usePaymentsMirror } from '../store/payments.store';
import { collectionDatasets } from '../../dashboard/utils/dashboard-overview.utils';

export function PaymentsOverview() {
  const overview = usePaymentsMirror('overview');
  if (!overview) return null;

  const { finance } = overview;
  const datasets = collectionDatasets(finance.monthly);
  const periods = Object.keys(datasets);

  return (
    <>
      <AppModule.Stats cols={{ base: 1, sm: 2, lg: 3 }}>
        {finance.currencies.map((c) => (
          <StatCard key={`collected-${c.currency}`}>
            <Group justify="space-between" align="center">
              <StatCard.Icon tone="brand">
                <IconCash size={21} stroke={1.7} />
              </StatCard.Icon>
              <StatusBadge tone="info" size="xs">{c.currency}</StatusBadge>
            </Group>
            <StatCard.Title>المحصّل هذا الشهر ({c.currency})</StatCard.Title>
            <StatCard.Content>{formatMoney(c.collectedThisMonth, c.currency)}</StatCard.Content>
          </StatCard>
        ))}

        {finance.currencies.map((c) => (
          <StatCard key={`remaining-${c.currency}`}>
            <Group justify="space-between" align="center">
              <StatCard.Icon tone="ink">
                <IconPigMoney size={21} stroke={1.7} />
              </StatCard.Icon>
              <StatusBadge tone="neutral" size="xs">{c.currency}</StatusBadge>
            </Group>
            <StatCard.Title>المتبقي تحصيله ({c.currency})</StatCard.Title>
            <StatCard.Content>{formatMoney(c.remaining, c.currency)}</StatCard.Content>
          </StatCard>
        ))}

        {finance.currencies.map((c) => (
          <StatCard key={`overdue-${c.currency}`}>
            <Group justify="space-between" align="center">
              <StatCard.Icon tone="brand">
                <IconClock size={21} stroke={1.7} />
              </StatCard.Icon>
              <StatusBadge tone="danger" size="xs">{c.currency}</StatusBadge>
            </Group>
            <StatCard.Title>المتأخرات المستحقة ({c.currency})</StatCard.Title>
            <StatCard.Content>{formatMoney(c.overdue, c.currency)}</StatCard.Content>
          </StatCard>
        ))}
      </AppModule.Stats>

      <AppModule.Charts>
        <ChartCard
          title="حركة التحصيل الشهري"
          subtitle="إجمالي المبالغ المحصلة خلال آخر 6 أشهر لكل عملة"
          periods={periods.length > 1 ? periods : undefined}
          activePeriod={periods[0]}
        >
          {periods.length === 0 ? (
            <Text size="sm" c="var(--app-text-muted)" ta="center" py="xl">
              لا توجد دفعات محصلة خلال هذه الفترة
            </Text>
          ) : (
            <ChartCard.Bar datasets={datasets} data={datasets[periods[0]]} unit="" withSummary={false} />
          )}
        </ChartCard>
      </AppModule.Charts>
    </>
  );
}
