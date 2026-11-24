'use client';

import { useMemo } from 'react';
import { SimpleGrid, Stack, Text } from '@mantine/core';
import { InfoTile } from '@/src/components/controllers';
import { formatMoney } from '@/src/core/format';
import { usePortalMirror } from '../store/portal.store';
import { financeLabels as labels } from '../static-data/portal.data';
import { getInstallmentColumns, getPaymentColumns, installmentRows } from './FinanceColumns';
import { PortalTable } from './PortalTable';

/** Guardian only: the money of the child, per currency (never summed), the installments and the payments. ZERO useState hooks. */
export function FinanceTab() {
  const slot = usePortalMirror('slots').finance;
  const installmentColumns = useMemo(() => getInstallmentColumns(), []);
  const paymentColumns = useMemo(() => getPaymentColumns(), []);
  const rows = installmentRows(slot.data);
  const payments = slot.data?.payments ?? [];
  return (
    <Stack gap="md">
      {(slot.data?.totals ?? []).map((t) => (
        <Stack key={t.currency} gap="xs">
          <Text size="sm" fw={600}>
            {t.currency === 'SYP' ? 'ل.س' : '$'}
          </Text>
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
            <InfoTile label={labels.total} value={formatMoney(t.total, t.currency)} tone="neutral" />
            <InfoTile label={labels.paid} value={formatMoney(t.paid, t.currency)} tone="success" />
            <InfoTile label={labels.remaining} value={formatMoney(t.remaining, t.currency)} tone="brand" />
            <InfoTile label={labels.overdue} value={formatMoney(t.overdue, t.currency)} tone={t.overdue > 0 ? 'danger' : 'neutral'} />
          </SimpleGrid>
        </Stack>
      ))}
      <PortalTable
        title={labels.installments}
        data={rows}
        columns={installmentColumns}
        isLoading={slot.isLoading}
        emptyMessage={labels.emptyInstallments}
        keyOf={(r) => r.key}
      />
      <PortalTable
        title={labels.payments}
        data={payments}
        columns={paymentColumns}
        isLoading={slot.isLoading}
        emptyMessage={labels.emptyPayments}
        keyOf={(p) => p.id}
      />
    </Stack>
  );
}
