import { Center, Loader, Table, Text } from '@mantine/core';
import Link from 'next/link';
import { AppSurface, StatusBadge } from '@/src/components/controllers';
import type { OverdueInstallment } from '@/src/core/api';
import { formatDate, formatMoney } from '@/src/core/format';
import { sectionDetailLabels as labels } from '../static-data/section-detail.data';

interface Props {
  rows: OverdueInstallment[];
  isLoading: boolean;
}

/** Overdue installments of the section's students. Props only. */
export function SectionFinanceTab({ rows, isLoading }: Props) {
  if (isLoading)
    return (
      <Center py="xl">
        <Loader size="sm" color="primary" />
      </Center>
    );
  if (rows.length === 0)
    return (
      <Text ta="center" py="xl" c="var(--app-text-muted)">
        {labels.noOverdue}
      </Text>
    );
  return (
    <AppSurface level={1} radius="lg" padding="sm">
      <Text fw={600} size="sm" mb="xs">
        {labels.overdueTitle}
      </Text>
      <Table verticalSpacing="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{labels.student}</Table.Th>
            <Table.Th>{labels.family}</Table.Th>
            <Table.Th>{labels.dueDate}</Table.Th>
            <Table.Th>{labels.remaining}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((r) => {
            const { student, currency } = r.subscription;
            const remaining = Number(r.amount) - Number(r.paidAmount);
            return (
              <Table.Tr key={r.id}>
                <Table.Td>
                  <Text component={Link} href={`/students/${student.id}?tab=finance`} size="sm" c="inherit">
                    {student.fullName}
                  </Text>
                </Table.Td>
                <Table.Td>{student.family?.familyName ?? '—'}</Table.Td>
                <Table.Td>{formatDate(r.dueDate.slice(0, 10))}</Table.Td>
                <Table.Td>
                  <StatusBadge tone="danger" size="xs">
                    {formatMoney(remaining, currency)}
                  </StatusBadge>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </AppSurface>
  );
}
