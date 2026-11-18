import Link from 'next/link';
import { Stack, Table, Text } from '@mantine/core';
import { AppSurface, DetailList, StatusBadge } from '@/src/components/controllers';
import { type Contract, toAmount } from '@/src/core/api';
import { formatDate, formatMoney, formatNumber } from '@/src/core/format';
import {
  INSTALLMENT_STATUS_META,
  PAYMENT_METHOD_LABELS,
} from '../../../students/finance/static-data/student-finance.data';
import { contractDetailLabels as labels } from '../static-data/contract-detail.data';

/** Contract terms, installments and payments. Props only. */
export function ContractBody({ contract }: { contract: Contract }) {
  const money = (v: number | string) => formatMoney(toAmount(v), contract.currency);
  return (
    <Stack gap="md">
      <AppSurface level={2} radius="lg" padding="md">
        <DetailList
          columns={2}
          items={[
            {
              label: labels.section,
              value: (
                <Text component={Link} href={`/sections/${contract.section.id}`} size="sm" fw={500} c="inherit">
                  {contract.section.name}
                </Text>
              ),
            },
            { label: labels.year, value: contract.academicYear.name },
            { label: labels.gross, value: money(contract.grossAmount) },
            { label: labels.discount, value: money(contract.discountAmount) },
            { label: labels.total, value: money(contract.totalAmount) },
            { label: labels.installments, value: formatNumber(contract.numberOfInstallments) },
            { label: labels.start, value: formatDate(contract.startDate.slice(0, 10)) },
            ...(contract.discountReason ? [{ label: labels.discountReason, value: contract.discountReason }] : []),
          ]}
        />
      </AppSurface>

      <AppSurface level={1} radius="lg" padding="sm">
        <Text fw={600} size="sm" mb="xs">
          {labels.schedule}
        </Text>
        <Table verticalSpacing="xs">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{labels.number}</Table.Th>
              <Table.Th>{labels.dueDate}</Table.Th>
              <Table.Th>{labels.amount}</Table.Th>
              <Table.Th>{labels.paid}</Table.Th>
              <Table.Th>{labels.status}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {contract.installments.map((i) => {
              const meta = INSTALLMENT_STATUS_META[i.status];
              return (
                <Table.Tr key={i.id}>
                  <Table.Td>{formatNumber(i.installmentNumber)}</Table.Td>
                  <Table.Td>{formatDate(i.dueDate.slice(0, 10))}</Table.Td>
                  <Table.Td>{money(i.amount)}</Table.Td>
                  <Table.Td>{money(i.paidAmount)}</Table.Td>
                  <Table.Td>
                    <StatusBadge tone={meta.tone} variant="dot" size="xs">
                      {meta.label}
                    </StatusBadge>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </AppSurface>

      <AppSurface level={1} radius="lg" padding="sm">
        <Text fw={600} size="sm" mb="xs">
          {labels.payments}
        </Text>
        {contract.payments.length === 0 ? (
          <StatusBadge size="sm">{labels.noPayments}</StatusBadge>
        ) : (
          <Table verticalSpacing="xs">
            <Table.Tbody>
              {contract.payments.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>
                    <Text component={Link} href={`/payments/${p.id}`} size="sm" fw={600} c="inherit">
                      #{p.receiptNumber}
                    </Text>
                  </Table.Td>
                  <Table.Td>{formatDate(p.paidAt)}</Table.Td>
                  <Table.Td>{formatMoney(toAmount(p.amount), p.currency)}</Table.Td>
                  <Table.Td>{PAYMENT_METHOD_LABELS[p.paymentMethod]}</Table.Td>
                  <Table.Td>
                    {p.status === 'CANCELLED' && (
                      <StatusBadge tone="danger" size="xs">
                        {labels.cancelled}
                      </StatusBadge>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </AppSurface>
    </Stack>
  );
}
