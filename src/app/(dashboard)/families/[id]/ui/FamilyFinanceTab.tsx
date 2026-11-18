import Link from 'next/link';
import { Center, Loader, SimpleGrid, Table, Text } from '@mantine/core';
import { AppSurface, StatusBadge } from '@/src/components/controllers';
import type { FamilyFinanceSummary } from '@/src/core/api';
import { CURRENCY_LABELS, formatMoney } from '@/src/core/format';
import { familyDetailLabels as labels } from '../static-data/family-detail.data';

interface Props {
  summary: FamilyFinanceSummary | null;
  isLoading: boolean;
}

/** Totals per currency (never mixed) and one row per child. Props only. */
export function FamilyFinanceTab({ summary, isLoading }: Props) {
  if (isLoading || !summary)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  if (summary.totals.length === 0)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.noFinance}
      </Text>
    );
  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: summary.totals.length > 1 ? 2 : 1 }} spacing="sm" mb="md">
        {summary.totals.map((t) => (
          <AppSurface key={t.currency} level={2} radius="lg" padding="md">
            <Text fw={600} size="sm" mb="xs">
              {labels.allChildren} · {CURRENCY_LABELS[t.currency]}
            </Text>
            <Text size="sm">
              {labels.total}: {formatMoney(t.total, t.currency)}
            </Text>
            <Text size="sm">
              {labels.paid}: {formatMoney(t.paid, t.currency)}
            </Text>
            <Text size="sm" fw={600}>
              {labels.remaining}: {formatMoney(t.remaining, t.currency)}
            </Text>
            {t.overdue > 0 && (
              <StatusBadge tone="danger" size="sm">
                {labels.overdue}: {formatMoney(t.overdue, t.currency)}
              </StatusBadge>
            )}
          </AppSurface>
        ))}
      </SimpleGrid>
      <AppSurface level={1} radius="lg" padding="sm">
        <Table verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{labels.student}</Table.Th>
              <Table.Th>{labels.remaining}</Table.Th>
              <Table.Th>{labels.overdue}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {summary.students.map((s) => (
              <Table.Tr key={s.studentId}>
                <Table.Td>
                  <Text component={Link} href={`/students/${s.studentId}?tab=finance`} size="sm" c="inherit">
                    {s.fullName}
                  </Text>
                </Table.Td>
                <Table.Td>{s.summary.map((x) => formatMoney(x.remaining, x.currency)).join(' · ')}</Table.Td>
                <Table.Td>
                  {s.summary
                    .filter((x) => x.overdue > 0)
                    .map((x) => formatMoney(x.overdue, x.currency))
                    .join(' · ') || '—'}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </AppSurface>
    </>
  );
}
