'use client';

import { Group, Stack, Text } from '@mantine/core';
import { IconPrinter, IconReceiptOff } from '@tabler/icons-react';
import { AppIconButton, StatusBadge } from '@/src/components/controllers';
import { type Contract, toAmount } from '@/src/core/api';
import { formatDate, formatMoney } from '@/src/core/format';
import { useFinanceMirror } from '../store/student-finance.store';
import { financeLabels as labels, PAYMENT_METHOD_LABELS } from '../static-data/student-finance.data';

/** Payments of a contract with print and cancel actions. ZERO useState hooks. */
export function ContractPayments({ contract }: { contract: Contract }) {
  const openCancelPayment = useFinanceMirror('openCancelPayment');
  const canManage = useFinanceMirror('canManage');

  return (
    <Stack gap={6}>
      <Text size="sm" fw={500}>
        {labels.payments}
      </Text>
      {contract.payments.length === 0 ? (
        <Text size="xs" c="var(--app-text-muted)">
          {labels.noPayments}
        </Text>
      ) : (
        contract.payments.map((payment) => {
          const cancelled = payment.status === 'CANCELLED';
          const converted = payment.currency !== contract.currency;
          return (
            <Group key={payment.id} justify="space-between" wrap="nowrap" gap="xs">
              <Stack gap={0} style={{ minWidth: 0 }}>
                <Group gap={6}>
                  <Text size="sm" fw={500} td={cancelled ? 'line-through' : undefined}>
                    {formatMoney(toAmount(payment.amount), payment.currency)}
                  </Text>
                  {converted && (
                    <Text size="xs" c="var(--app-text-muted)">
                      = {formatMoney(toAmount(payment.appliedAmount), contract.currency)}
                    </Text>
                  )}
                  {cancelled && (
                    <StatusBadge tone="danger" size="xs">
                      ملغاة
                    </StatusBadge>
                  )}
                </Group>
                <Text size="xs" c="var(--app-text-muted)" truncate>
                  {labels.receipt} #{payment.receiptNumber} · {formatDate(payment.paidAt)} ·{' '}
                  {PAYMENT_METHOD_LABELS[payment.paymentMethod]}
                  {cancelled && payment.cancelReason ? ` · ${payment.cancelReason}` : ''}
                </Text>
              </Stack>
              <Group gap={4} wrap="nowrap">
                <AppIconButton
                  size="sm"
                  label={labels.print}
                  onClick={() => window.open(`/payments/${payment.id}/receipt`, '_blank')}
                >
                  <IconPrinter size={15} />
                </AppIconButton>
                {canManage && !cancelled && (
                  <AppIconButton
                    size="sm"
                    variant="danger"
                    label={labels.cancelPayment}
                    onClick={() => openCancelPayment(contract, payment)}
                  >
                    <IconReceiptOff size={15} />
                  </AppIconButton>
                )}
              </Group>
            </Group>
          );
        })
      )}
    </Stack>
  );
}
