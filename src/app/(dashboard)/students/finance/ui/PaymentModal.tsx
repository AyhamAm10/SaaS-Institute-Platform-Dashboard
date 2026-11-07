'use client';

import { Alert, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconCash } from '@tabler/icons-react';
import { AppButton, AppInput, AppModal, AppSelect, AppSurface } from '@/src/components/controllers';
import type { Currency, PaymentMethod } from '@/src/core/api';
import { CURRENCY_OPTIONS, formatMoney, inputText } from '@/src/core/format';
import { useFinanceMirror } from '../store/student-finance.store';
import { contractRemaining, paymentPreview } from '../utils/student-finance.utils';
import { financeLabels as labels, PAYMENT_METHOD_OPTIONS } from '../static-data/student-finance.data';

/**
 * PaymentModal
 *
 * Amount, currency (+ rate when it differs from the contract), method and a
 * live preview of how the payment is split over the installments.
 * ZERO useState hooks.
 */
export function PaymentModal({ onSubmit }: { onSubmit: () => Promise<void> }) {
  const modal = useFinanceMirror('modal');
  const contract = useFinanceMirror('contract');
  const form = useFinanceMirror('paymentForm');
  const setField = useFinanceMirror('setPaymentField');
  const error = useFinanceMirror('error');
  const isSubmitting = useFinanceMirror('isSubmitting');
  const closeModal = useFinanceMirror('closeModal');

  if (modal !== 'payment' || !contract) return null;
  const sameCurrency = form.currency === contract.currency;
  const preview = paymentPreview(form, contract);

  return (
    <AppModal opened onClose={closeModal} size="md">
      <AppModal.Header>
        <AppModal.Icon icon={<IconCash size={22} />} />
        <AppModal.Title>{labels.paymentTitle}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <Stack gap="md">
          <Text size="sm">
            {labels.remaining}: <b>{formatMoney(contractRemaining(contract), contract.currency)}</b>
          </Text>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            <AppInput type="number" label={labels.amount} value={form.amount} onChange={(e: unknown) => setField('amount', inputText(e))} required />
            <AppSelect
              label={labels.currency}
              data={CURRENCY_OPTIONS}
              value={form.currency}
              onChange={(v: string | null) => setField('currency', (v ?? contract.currency) as Currency)}
            />
            {!sameCurrency && (
              <AppInput type="number" label={labels.exchangeRate} value={form.exchangeRate} onChange={(e: unknown) => setField('exchangeRate', inputText(e))} required />
            )}
            <AppSelect
              label={labels.method}
              data={PAYMENT_METHOD_OPTIONS}
              value={form.paymentMethod}
              onChange={(v: string | null) => setField('paymentMethod', (v ?? 'CASH') as PaymentMethod)}
            />
          </SimpleGrid>
          <AppInput label={labels.note} value={form.note} onChange={(e: unknown) => setField('note', inputText(e))} />

          {preview?.applied != null && (
            <AppSurface level={2} radius="md" padding="sm">
              <Stack gap={4}>
                {!sameCurrency && (
                  <Text size="xs">
                    {labels.applied}: <b>{formatMoney(preview.applied, contract.currency)}</b>
                  </Text>
                )}
                {preview.allocation ? (
                  <>
                    <Text size="xs" fw={500}>{labels.allocationTitle}</Text>
                    {preview.allocation.map((a) => (
                      <Text key={a.installmentNumber} size="xs">
                        {labels.installmentShort(a.installmentNumber)}: {formatMoney(a.amount, contract.currency)}
                      </Text>
                    ))}
                  </>
                ) : (
                  <Text size="xs" c="red">{labels.exceedsRemaining}</Text>
                )}
              </Stack>
            </AppSurface>
          )}
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
          <AppButton onClick={onSubmit} loading={isSubmitting} leftSection={<IconCash size={16} />}>
            {labels.recordPayment}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
