'use client';

import { Group } from '@mantine/core';
import { AppDatePicker, AppInput, AppSelect } from '@/src/components/controllers';
import type { Currency, PaymentMethod, PaymentStatus } from '@/src/core/api';
import { CURRENCY_OPTIONS, inputText } from '@/src/core/format';
import { PAYMENT_METHOD_OPTIONS } from '../../students/finance/static-data/student-finance.data';
import { usePaymentsMirror } from '../store/payments.store';
import { paymentsLabels as labels, PAYMENT_STATUS_OPTIONS } from '../static-data/payments.data';

/** Receipt number, date range, currency, method and status filters. ZERO useState hooks. */
export function PaymentsFilters() {
  const filters = usePaymentsMirror('filters');
  const setFilter = usePaymentsMirror('setFilter');

  return (
    <Group gap="xs" wrap="wrap">
      <AppInput
        placeholder={labels.receiptPlaceholder}
        value={filters.receiptNumber}
        onChange={(e: unknown) => setFilter('receiptNumber', inputText(e))}
        size="sm"
        w={130}
      />
      <AppDatePicker
        placeholder={labels.fromPlaceholder}
        value={filters.from}
        onChange={(v) => setFilter('from', v)}
        clearable
        size="sm"
        w={150}
      />
      <AppDatePicker
        placeholder={labels.toPlaceholder}
        value={filters.to}
        onChange={(v) => setFilter('to', v)}
        clearable
        size="sm"
        w={150}
      />
      <AppSelect
        placeholder={labels.currencyPlaceholder}
        data={CURRENCY_OPTIONS}
        value={filters.currency}
        onChange={(v: string | null) => setFilter('currency', v as Currency | null)}
        clearable
        size="sm"
        w={160}
      />
      <AppSelect
        placeholder={labels.methodPlaceholder}
        data={PAYMENT_METHOD_OPTIONS}
        value={filters.paymentMethod}
        onChange={(v: string | null) => setFilter('paymentMethod', v as PaymentMethod | null)}
        clearable
        size="sm"
        w={140}
      />
      <AppSelect
        placeholder={labels.statusPlaceholder}
        data={PAYMENT_STATUS_OPTIONS}
        value={filters.status}
        onChange={(v: string | null) => setFilter('status', v as PaymentStatus | null)}
        clearable
        size="sm"
        w={130}
      />
    </Group>
  );
}
