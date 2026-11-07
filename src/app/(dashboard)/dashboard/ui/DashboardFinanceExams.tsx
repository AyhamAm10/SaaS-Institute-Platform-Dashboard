'use client';

import { Group, Stack, Text } from '@mantine/core';
import { IconClipboardList } from '@tabler/icons-react';
import { AppModule, AppSurface, StatusBadge } from '@/src/components/controllers';
import { ChartCard } from '@/src/components/controllers/charts';
import { formatDate, formatMoney } from '@/src/core/format';
import { useDashboardMirror } from '../store/useDashboardMirror';
import { collectionDatasets, percentText } from '../utils/dashboard-overview.utils';
import { overviewLabels as labels } from '../static-data/dashboard-overview.data';

/** Monthly collections per currency + upcoming exams. ZERO useState hooks. */
export function DashboardFinanceExams() {
  const overview = useDashboardMirror('overview');
  if (!overview) return null;
  const { finance, exams } = overview;
  const datasets = collectionDatasets(finance.monthly);
  const periods = Object.keys(datasets);

  return (
    <AppModule.Charts ratio="main-side">
      <ChartCard
        title={labels.collectionsTitle}
        subtitle={labels.collectionsSubtitle}
        periods={periods.length > 1 ? periods : undefined}
        // One tab per currency; open on the first (the chart default is the 2nd period)
        activePeriod={periods[0]}
      >
        {periods.length === 0 ? (
          <Text size="sm" c="var(--app-text-muted)" ta="center" py="xl">
            {labels.noCollections}
          </Text>
        ) : (
          <ChartCard.Bar datasets={datasets} data={datasets[periods[0]]} unit="" withSummary={false} />
        )}
        <Group gap="xs" mt="md" wrap="wrap">
          {finance.currencies.map((c) => (
            <StatusBadge key={c.currency} tone="ink" size="sm">
              {labels.thisMonth}: {formatMoney(c.collectedThisMonth, c.currency)} · {labels.remaining}:{' '}
              {formatMoney(c.remaining, c.currency)}
            </StatusBadge>
          ))}
        </Group>
      </ChartCard>

      <ChartCard title={labels.upcomingTitle} subtitle={labels.upcomingSubtitle}>
        <Stack gap="xs">
          {exams.upcoming.length === 0 ? (
            <Text size="sm" c="var(--app-text-muted)" ta="center" py="md">
              {labels.noUpcoming}
            </Text>
          ) : (
            exams.upcoming.map((exam) => (
              <AppSurface key={exam.id} level={2} radius="md" padding="sm">
                <Group justify="space-between" wrap="nowrap" gap="xs">
                  <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
                    <IconClipboardList size={16} color="var(--app-text-muted)" />
                    <Stack gap={0} style={{ minWidth: 0 }}>
                      <Text size="sm" fw={500} truncate>
                        {exam.title}
                      </Text>
                      <Text size="xs" c="var(--app-text-muted)" truncate>
                        {exam.section.name} · {exam.subject.name}
                      </Text>
                    </Stack>
                  </Group>
                  <StatusBadge size="xs">{formatDate(exam.examDate)}</StatusBadge>
                </Group>
              </AppSurface>
            ))
          )}
          <Text size="xs" c="var(--app-text-muted)" mt="xs">
            {labels.average30d}: {percentText(exams.averagePercent30d)}
          </Text>
        </Stack>
      </ChartCard>
    </AppModule.Charts>
  );
}
