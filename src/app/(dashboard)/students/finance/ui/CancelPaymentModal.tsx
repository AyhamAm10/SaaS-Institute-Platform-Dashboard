'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconReceiptOff } from '@tabler/icons-react';
import { AppButton, AppInput, AppModal } from '@/src/components/controllers';
import { toAmount } from '@/src/core/api';
import { formatMoney, inputText } from '@/src/core/format';
import { useFinanceMirror } from '../store/student-finance.store';
import { financeLabels as labels } from '../static-data/student-finance.data';

/** Cancel a payment with a mandatory reason (never deleted). ZERO useState hooks. */
export function CancelPaymentModal({ onSubmit }: { onSubmit: () => Promise<void> }) {
  const modal = useFinanceMirror('modal');
  const payment = useFinanceMirror('payment');
  const reason = useFinanceMirror('cancelReason');
  const setReason = useFinanceMirror('setCancelReason');
  const error = useFinanceMirror('error');
  const isSubmitting = useFinanceMirror('isSubmitting');
  const closeModal = useFinanceMirror('closeModal');

  if (modal !== 'cancelPayment' || !payment) return null;

  return (
    <AppModal opened onClose={closeModal} size="sm" variant="danger">
      <AppModal.Header>
        <AppModal.Icon icon={<IconReceiptOff size={22} />} color="red" />
        <AppModal.Title>{labels.cancelTitle}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <Stack gap="md">
          <Text size="sm" fw={500}>
            {labels.receipt} #{payment.receiptNumber} — {formatMoney(toAmount(payment.amount), payment.currency)}
          </Text>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}
          <AppInput
            type="textarea"
            label={labels.cancelReason}
            value={reason}
            onChange={(e: unknown) => setReason(inputText(e))}
            required
            rows={2}
          />
          <Text size="xs" c="var(--app-text-muted)">
            {labels.cancelHint}
          </Text>
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
          <AppButton variant="dangerSolid" onClick={onSubmit} loading={isSubmitting}>
            {labels.confirmCancel}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
