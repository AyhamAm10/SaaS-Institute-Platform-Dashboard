'use client';

import { DataModuleColumn } from '@/src/components/controllers/data-module';
import { StatusBadge } from '@/src/components/controllers';
import type { PortalCurrency, PortalFinance } from '@/src/core/api';
import { formatDate, formatMoney } from '@/src/core/format';
import { financeLabels as labels, INSTALLMENT_BADGES, PAYMENT_METHODS } from '../static-data/portal.data';

/** One installment of one contract, flattened for the table. */
export interface InstallmentRow {
  key: string;
  yearName: string;
  currency: PortalCurrency;
  number: number;
  dueDate: string;
  amount: number;
  paid: number;
  remaining: number;
  status: string;
}

export type PaymentRow = PortalFinance['payments'][number];

export function installmentRows(finance: PortalFinance | null): InstallmentRow[] {
  return (finance?.contracts ?? []).flatMap((c) =>
    c.installments.map((i) => ({ key: `${c.id}-${i.id}`, yearName: c.yearName, currency: c.currency, number: i.number, dueDate: i.dueDate, amount: i.amount, paid: i.paid, remaining: i.remaining, status: i.status })),
  );
}

export function getInstallmentColumns(): DataModuleColumn<InstallmentRow>[] {
  const badge = (s: string) => INSTALLMENT_BADGES[s] ?? { label: s, tone: 'neutral' as const };
  return [
    { key: 'year', title: labels.colYear, exportValue: (r) => r.yearName, exportKind: 'text', render: (r) => r.yearName },
    { key: 'number', title: labels.colNumber, exportValue: (r) => `#${r.number}`, exportKind: 'text', render: (r) => `#${r.number}` },
    { key: 'due', title: labels.colDue, exportValue: (r) => r.dueDate, exportKind: 'date', render: (r) => formatDate(r.dueDate) },
    { key: 'amount', title: labels.colAmount, exportValue: (r) => ({ amount: r.amount, currency: r.currency }), exportKind: 'money', render: (r) => formatMoney(r.amount, r.currency) },
    { key: 'paid', title: labels.colPaid, exportValue: (r) => ({ amount: r.paid, currency: r.currency }), exportKind: 'money', render: (r) => formatMoney(r.paid, r.currency) },
    { key: 'remaining', title: labels.colRemaining, exportValue: (r) => ({ amount: r.remaining, currency: r.currency }), exportKind: 'money', render: (r) => formatMoney(r.remaining, r.currency) },
    {
      key: 'status',
      title: labels.colStatus,
      exportValue: (r) => badge(r.status).label,
      exportKind: 'text',
      render: (r) => (
        <StatusBadge tone={badge(r.status).tone} size="xs">
          {badge(r.status).label}
        </StatusBadge>
      ),
    },
  ];
}

export function getPaymentColumns(): DataModuleColumn<PaymentRow>[] {
  return [
    { key: 'receipt', title: labels.colReceipt, exportValue: (p) => p.receiptNumber, exportKind: 'text', render: (p) => `#${p.receiptNumber}` },
    { key: 'date', title: labels.colDate, exportValue: (p) => p.date, exportKind: 'date', render: (p) => formatDate(p.date) },
    { key: 'amount', title: labels.colAmount, exportValue: (p) => ({ amount: p.amount, currency: p.currency }), exportKind: 'money', render: (p) => formatMoney(p.amount, p.currency) },
    { key: 'method', title: labels.colMethod, exportValue: (p) => PAYMENT_METHODS[p.method] ?? p.method, exportKind: 'text', render: (p) => PAYMENT_METHODS[p.method] ?? p.method },
    {
      key: 'status',
      title: labels.colStatus,
      exportValue: (p) => (p.status === 'CANCELLED' ? labels.cancelled : ''),
      exportKind: 'text',
      render: (p) => (p.status === 'CANCELLED' ? <StatusBadge tone="neutral" size="xs">{labels.cancelled}</StatusBadge> : null),
    },
  ];
}
