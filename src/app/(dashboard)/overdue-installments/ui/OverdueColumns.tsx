'use client';

import { Stack, Text } from '@mantine/core';
import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { StatusBadge } from '@/src/components/controllers';
import { type OverdueInstallment, toAmount } from '@/src/core/api';
import { formatDate, formatMoney } from '@/src/core/format';
import { overdueLabels as labels } from '../static-data/overdue.data';

const DAY_MS = 24 * 60 * 60 * 1000;

export function getOverdueColumns(): DataModuleColumn<OverdueInstallment>[] {
  const money = (i: OverdueInstallment, v: number) => formatMoney(v, i.subscription.currency);
  return [
    {
      key: 'student',
      title: labels.colStudent,
      exportValue: (i) => `${i.subscription.student.fullName} (${i.subscription.section.name})`,
      exportKind: 'text',
      render: (i) => (
        <Stack gap={0}>
          <Text size="sm" fw={500}>
            {i.subscription.student.fullName}
          </Text>
          <Text size="xs" c="var(--app-text-muted)">
            {i.subscription.section.name}
            {i.subscription.student.family?.phone ? ` · ${i.subscription.student.family.phone}` : ''}
          </Text>
        </Stack>
      ),
    },
    {
      key: 'installment',
      title: labels.colInstallment,
      exportValue: (i) => `#${i.installmentNumber}`,
      exportKind: 'text',
      render: (i) => `#${i.installmentNumber}`,
    },
    {
      key: 'dueDate',
      title: labels.colDueDate,
      exportValue: (i) => (i.dueDate ? String(i.dueDate).split('T')[0] : null),
      exportKind: 'date',
      render: (i) => formatDate(i.dueDate),
    },
    {
      key: 'late',
      title: labels.colDaysLate,
      exportValue: (i) =>
        labels.daysLate(Math.max(1, Math.floor((Date.now() - new Date(i.dueDate).getTime()) / DAY_MS))),
      exportKind: 'text',
      render: (i) => (
        <StatusBadge tone="danger" size="xs">
          {labels.daysLate(Math.max(1, Math.floor((Date.now() - new Date(i.dueDate).getTime()) / DAY_MS)))}
        </StatusBadge>
      ),
    },
    {
      key: 'amount',
      title: labels.colAmount,
      exportValue: (i) => ({
        amount: toAmount(i.amount),
        currency: i.subscription.currency as 'SYP' | 'USD',
      }),
      exportKind: 'money',
      render: (i) => money(i, toAmount(i.amount)),
    },
    {
      key: 'remaining',
      title: labels.colRemaining,
      exportValue: (i) => ({
        amount: toAmount(i.amount) - toAmount(i.paidAmount),
        currency: i.subscription.currency as 'SYP' | 'USD',
      }),
      exportKind: 'money',
      render: (i) => (
        <Text size="sm" fw={600} c="red">
          {money(i, toAmount(i.amount) - toAmount(i.paidAmount))}
        </Text>
      ),
    },
  ];
}

