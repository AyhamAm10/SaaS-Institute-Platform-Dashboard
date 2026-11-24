'use client';

import { useMemo } from 'react';
import { SimpleGrid, Stack, Text } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import { AppSurface, InfoTile } from '@/src/components/controllers';
import { formatDate } from '@/src/core/format';
import { usePortalMirror } from '../store/portal.store';
import { portalLabels, resultsLabels as labels } from '../static-data/portal.data';
import { percentText } from '../utils/portal.utils';
import { PortalTable } from './PortalTable';
import { getResultsColumns, type ResultRow } from './ResultsColumns';

/** His marks: the overall average, the average of each subject and every exam; the upcoming ones. ZERO useState hooks. */
export function ResultsTab() {
  const slot = usePortalMirror('slots').results;
  const columns = useMemo(() => getResultsColumns(), []);
  const subjects = slot.data?.subjects ?? [];
  const upcoming = slot.data?.upcoming ?? [];
  const rows: ResultRow[] = subjects.flatMap((s) =>
    s.results.map((r) => ({ key: `${s.subjectId}-${r.examId}`, subject: s.subject, title: r.title, date: r.date, score: r.score, max: r.max, percent: r.percent, status: r.status })),
  );

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        <InfoTile label={labels.overall} value={percentText(slot.data?.averagePercent)} icon={<IconChartBar size={20} />} tone="brand" />
        {subjects.map((s) => (
          <InfoTile key={s.subjectId} label={s.subject} value={percentText(s.averagePercent)} tone="neutral" />
        ))}
      </SimpleGrid>
      {upcoming.length > 0 && (
        <AppSurface level={2} radius="lg" padding="md">
          <Text fw={600} size="sm" mb="xs">
            {labels.upcoming}
          </Text>
          <Stack gap={6}>
            {upcoming.map((e) => (
              <Text key={e.examId} size="sm">
                {formatDate(e.date)} · {e.subject} - {e.title}
              </Text>
            ))}
          </Stack>
        </AppSurface>
      )}
      <PortalTable
        title={portalLabels.tabResults}
        data={rows}
        columns={columns}
        isLoading={slot.isLoading}
        emptyMessage={labels.empty}
        keyOf={(r) => r.key}
      />
    </Stack>
  );
}
