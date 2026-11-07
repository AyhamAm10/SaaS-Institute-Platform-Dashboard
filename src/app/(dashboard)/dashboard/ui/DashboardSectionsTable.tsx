'use client';

import { Progress, Stack, Table, Text } from '@mantine/core';
import { AppSurface } from '@/src/components/controllers';
import { useDashboardMirror } from '../store/useDashboardMirror';
import { percentText } from '../utils/dashboard-overview.utils';
import { overviewLabels as labels } from '../static-data/dashboard-overview.data';

/** Per-section students, attendance today and exam average. ZERO useState hooks. */
export function DashboardSectionsTable() {
  const overview = useDashboardMirror('overview');
  if (!overview) return null;

  return (
    <AppSurface level={1} radius="lg" padding="md">
      <Stack gap="sm">
        <Text fw={600}>{labels.sectionsTitle}</Text>
        {overview.sections.length === 0 ? (
          <Text size="sm" c="var(--app-text-muted)" ta="center" py="md">
            {labels.noSections}
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={520}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{labels.section}</Table.Th>
                  <Table.Th>{labels.students}</Table.Th>
                  <Table.Th>{labels.attendedTodayCol}</Table.Th>
                  <Table.Th w={220}>{labels.averageCol}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {overview.sections.map((s) => (
                  <Table.Tr key={s.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {s.name}
                      </Text>
                    </Table.Td>
                    <Table.Td>{s.students}</Table.Td>
                    <Table.Td>
                      {s.attendedToday} / {s.students}
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={2}>
                        <Text size="sm">{percentText(s.averagePercent)}</Text>
                        {s.averagePercent !== null && <Progress value={s.averagePercent} size="sm" radius="xl" />}
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Stack>
    </AppSurface>
  );
}
