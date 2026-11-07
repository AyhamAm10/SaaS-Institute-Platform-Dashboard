'use client';

import { Group, Stack, Text } from '@mantine/core';
import { IconPrinter, IconReceiptOff } from '@tabler/icons-react';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { AppIconButton, StatusBadge } from '@/src/components/controllers';
import { type PaymentRecord, toAmount } from '@/src/core/api';
import { formatDate, formatMoney } from '@/src/core/format';
import { PAYMENT_METHOD_LABELS } from '../../students/finance/static-data/student-finance.data';
import { paymentsLabels as labels } from '../static-data/payments.data';

export function getPaymentsColumns(
  onCancel: (p: PaymentRecord) => void,
  canCancel = true,
): DataModuleColumn<PaymentRecord>[] {
  return [
    {
      key: 'receiptNumber',
      title: labels.colReceipt,
      exportValue: (p) => `#${p.receiptNumber}`,
      exportKind: 'text',
      render: (p) => (
        <Text size="sm" fw={600}>
          #{p.receiptNumber}
        </Text>
      ),
    },
    {
      key: 'student',
      title: labels.colStudent,
      exportValue: (p) => `${p.subscription.student.fullName} (${p.subscription.section.name})`,
      exportKind: 'text',
      render: (p) => (
        <Stack gap={0}>
          <Text size="sm" fw={500}>
            {p.subscription.student.fullName}
          </Text>
          <Text size="xs" c="var(--app-text-muted)">
            {p.subscription.section.name} · {p.branch.name}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'amount',
      title: labels.colAmount,
      exportValue: (p) => ({
        amount: toAmount(p.amount),
        currency: p.currency as 'SYP' | 'USD',
      }),
      exportKind: 'money',
      render: (p) => (
        <Stack gap={0}>
          <Text size="sm" fw={500} td={p.status === 'CANCELLED' ? 'line-through' : undefined}>
            {formatMoney(toAmount(p.amount), p.currency)}
          </Text>
          {p.currency !== p.subscription.currency && (
            <Text size="xs" c="var(--app-text-muted)">
              = {formatMoney(toAmount(p.appliedAmount), p.subscription.currency)}
            </Text>
          )}
        </Stack>
      ),
    },
    {
      key: 'paidAt',
      title: labels.colDate,
      exportValue: (p) => (p.paidAt ? String(p.paidAt).split('T')[0] : null),
      exportKind: 'date',
      render: (p) => formatDate(p.paidAt),
    },
    {
      key: 'method',
      title: labels.colMethod,
      exportValue: (p) => PAYMENT_METHOD_LABELS[p.paymentMethod] || p.paymentMethod,
      exportKind: 'text',
      render: (p) => PAYMENT_METHOD_LABELS[p.paymentMethod],
    },
    {
      key: 'status',
      title: labels.colStatus,
      exportValue: (p) => ({
        text: p.status === 'CANCELLED' ? (p.cancelReason ? `ملغي (${p.cancelReason})` : 'ملغي') : 'نشط',
        tone: p.status === 'CANCELLED' ? 'danger' : 'success',
      }),
      exportKind: 'badge',
      render: (p) =>
        p.status === 'CANCELLED' ? (
          <Stack gap={2}>
            <StatusBadge tone="danger" size="xs">
              {labels.cancelled}
            </StatusBadge>
            {p.cancelReason && (
              <Text size="xs" c="var(--app-text-muted)">
                {p.cancelReason}
              </Text>
            )}
          </Stack>
        ) : (
          <StatusBadge tone="success" variant="dot" size="xs">
            {labels.active}
          </StatusBadge>
        ),
    },
    {
      key: 'actions',
      title: labels.colActions,
      align: 'center',
      render: (p) => (
        <Group gap="xs" justify="center" wrap="nowrap">
          <AppIconButton
            size="sm"
            label={labels.print}
            onClick={() => window.open(`/payments/${p.id}/receipt`, '_blank')}
          >
            <IconPrinter size={15} />
          </AppIconButton>
          {canCancel && p.status === 'ACTIVE' && (
            <AppIconButton
              size="sm"
              variant="danger"
              label={labels.cancel}
              onClick={() => onCancel(p)}
            >
              <IconReceiptOff size={15} />
            </AppIconButton>
          )}
        </Group>
      ),
    },
  ];
}
