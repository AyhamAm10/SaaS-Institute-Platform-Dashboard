'use client';

import { Group, Stack, Table, Text } from '@mantine/core';
import { StatusBadge } from '@/src/components/controllers';
import type { ContractPreview } from '@/src/core/api';
import { formatDate, formatMoney } from '@/src/core/format';
import { financeLabels as labels } from '../static-data/student-finance.data';

/** Installment schedule returned by the preview endpoint. Props only. */
export function SchedulePreview({ preview }: { preview: ContractPreview }) {
  const money = (v: number) => formatMoney(v, preview.currency);

  return (
    <Stack gap={6}>
      <Group justify="space-between">
        <Text size="sm" fw={500}>
          {labels.previewTitle}
        </Text>
        <StatusBadge tone="brand" size="sm">
          {labels.total}: {money(preview.totalAmount)}
        </StatusBadge>
      </Group>
      <Table verticalSpacing={4} fz="xs">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>تاريخ الاستحقاق</Table.Th>
            <Table.Th>المبلغ</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {preview.installments.map((line) => (
            <Table.Tr key={line.installmentNumber}>
              <Table.Td>{line.installmentNumber}</Table.Td>
              <Table.Td>{formatDate(line.dueDate)}</Table.Td>
              <Table.Td>{money(line.amount)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}
