'use client';

import { Group, Stack, Table, Text } from '@mantine/core';
import { IconCash, IconEdit } from '@tabler/icons-react';
import { AppButton, AppSurface, StatusBadge } from '@/src/components/controllers';
import { type Contract, toAmount } from '@/src/core/api';
import { formatDate, formatMoney } from '@/src/core/format';
import { useFinanceMirror } from '../store/student-finance.store';
import { contractRemaining } from '../utils/student-finance.utils';
import {
  CONTRACT_STATUS_META,
  financeLabels as labels,
  INSTALLMENT_STATUS_META,
} from '../static-data/student-finance.data';
import { ContractPayments } from './ContractPayments';

/** One contract: totals, installment schedule and payments. ZERO useState hooks. */
export function ContractCard({ contract }: { contract: Contract }) {
  const openPayment = useFinanceMirror('openPayment');
  const openEditContract = useFinanceMirror('openEditContract');
  const canManage = useFinanceMirror('canManage');
  const status = CONTRACT_STATUS_META[contract.status];
  const money = (v: string | number | null) => formatMoney(toAmount(v), contract.currency);
  const discount = toAmount(contract.discountAmount);

  return (
    <AppSurface level={2} radius="md" padding="md">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start" wrap="wrap">
          <Stack gap={4}>
            <Group gap={6}>
              <Text fw={600}>
                {contract.section.name} · {contract.academicYear.name}
              </Text>
              <StatusBadge tone={status.tone} variant="dot" size="xs">
                {status.label}
              </StatusBadge>
            </Group>
            <Text size="xs" c="var(--app-text-muted)">
              {labels.total}: {money(contract.totalAmount)}
              {discount > 0 &&
                ` · ${labels.discount}: ${money(discount)}${contract.discountReason ? ` (${contract.discountReason})` : ''}`}
              {` · ${labels.remaining}: ${formatMoney(contractRemaining(contract), contract.currency)}`}
            </Text>
          </Stack>
          {canManage && contract.status !== 'CANCELLED' && (
            <Group gap="xs">
              <AppButton size="xs" variant="outline" leftSection={<IconEdit size={14} />} onClick={() => openEditContract(contract)}>
                {labels.editContract}
              </AppButton>
              {contract.status === 'ACTIVE' && (
                <AppButton size="xs" leftSection={<IconCash size={14} />} onClick={() => openPayment(contract)}>
                  {labels.recordPayment}
                </AppButton>
              )}
            </Group>
          )}
        </Group>

        <Stack gap={6}>
          <Text size="sm" fw={500}>
            {labels.installments}
          </Text>
          <Table.ScrollContainer minWidth={420}>
            <Table verticalSpacing={6} fz="xs">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>تاريخ الاستحقاق</Table.Th>
                  <Table.Th>المبلغ</Table.Th>
                  <Table.Th>المدفوع</Table.Th>
                  <Table.Th>الحالة</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {contract.installments.map((inst) => {
                  const meta = INSTALLMENT_STATUS_META[inst.status];
                  return (
                    <Table.Tr key={inst.id}>
                      <Table.Td>{inst.installmentNumber}</Table.Td>
                      <Table.Td>{formatDate(inst.dueDate)}</Table.Td>
                      <Table.Td>{money(inst.amount)}</Table.Td>
                      <Table.Td>{money(inst.paidAmount)}</Table.Td>
                      <Table.Td>
                        <StatusBadge tone={meta.tone} size="xs">
                          {meta.label}
                        </StatusBadge>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Stack>

        <ContractPayments contract={contract} />
      </Stack>
    </AppSurface>
  );
}
