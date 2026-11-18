import Link from 'next/link';
import { Stack, Table, Text } from '@mantine/core';
import { AppSurface, DetailList, StatusBadge } from '@/src/components/controllers';
import { type PaymentRecord, toAmount } from '@/src/core/api';
import { formatDate, formatMoney, formatNumber } from '@/src/core/format';
import { PAYMENT_METHOD_LABELS } from '../../../students/finance/static-data/student-finance.data';
import { paymentDetailLabels as labels } from '../static-data/payment-detail.data';

const link = (href: string, text: string) => (
  <Text component={Link} href={href} size="sm" fw={500} c="inherit">
    {text}
  </Text>
);

/** Payment data and the installments it paid. Props only. */
export function PaymentDetailBody({ payment }: { payment: PaymentRecord }) {
  const { student, section, currency } = payment.subscription;
  const cancelled = payment.status === 'CANCELLED';
  return (
    <Stack gap="md">
      <AppSurface level={2} radius="lg" padding="md">
        <DetailList
          columns={2}
          items={[
            { label: labels.student, value: link(`/students/${student.id}?tab=finance`, student.fullName) },
            { label: labels.section, value: link(`/sections/${section.id}`, section.name) },
            { label: labels.contract, value: link(`/contracts/${payment.subscription.id}`, `#${payment.subscription.id}`) },
            { label: labels.family, value: student.family?.familyName ?? '—' },
            { label: labels.amount, value: formatMoney(toAmount(payment.amount), payment.currency) },
            ...(payment.currency !== currency
              ? [{ label: labels.applied, value: formatMoney(toAmount(payment.appliedAmount), currency) }]
              : []),
            { label: labels.date, value: formatDate(payment.paidAt) },
            { label: labels.method, value: PAYMENT_METHOD_LABELS[payment.paymentMethod] },
            { label: labels.branch, value: payment.branch.name },
            ...(payment.note ? [{ label: labels.note, value: payment.note }] : []),
            ...(cancelled && payment.cancelReason ? [{ label: labels.cancelReason, value: payment.cancelReason }] : []),
          ]}
        />
      </AppSurface>
      <AppSurface level={1} radius="lg" padding="sm">
        <Text fw={600} size="sm" mb="xs">
          {labels.allocations}
        </Text>
        {payment.allocations.length === 0 ? (
          <StatusBadge size="sm">{labels.noAllocations}</StatusBadge>
        ) : (
          <Table verticalSpacing="xs">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{labels.installment}</Table.Th>
                <Table.Th>{labels.dueDate}</Table.Th>
                <Table.Th>{labels.amount}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {payment.allocations.map((a) => (
                <Table.Tr key={a.installment.id}>
                  <Table.Td>{formatNumber(a.installment.installmentNumber)}</Table.Td>
                  <Table.Td>{formatDate(a.installment.dueDate.slice(0, 10))}</Table.Td>
                  <Table.Td>{formatMoney(toAmount(a.amount), currency)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </AppSurface>
    </Stack>
  );
}
