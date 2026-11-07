'use client';

import { Alert, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconCalendarDollar, IconEye } from '@tabler/icons-react';
import { AppButton, AppDatePicker, AppInput, AppModal, AppSelect } from '@/src/components/controllers';
import type { Currency } from '@/src/core/api';
import { CURRENCY_OPTIONS, inputText } from '@/src/core/format';
import { useFinanceMirror } from '../store/student-finance.store';
import { financeLabels as labels } from '../static-data/student-finance.data';
import { SchedulePreview } from './SchedulePreview';

export interface ContractFormModalProps {
  onPreview: () => Promise<void>;
  onSubmit: () => Promise<void>;
}

/**
 * ContractFormModal
 *
 * Create a contract (with a schedule preview) or edit one (discount and
 * unpaid installments only). ZERO useState hooks.
 */
export function ContractFormModal({ onPreview, onSubmit }: ContractFormModalProps) {
  const modal = useFinanceMirror('modal');
  const form = useFinanceMirror('contractForm');
  const setField = useFinanceMirror('setContractField');
  const preview = useFinanceMirror('preview');
  const isPreviewing = useFinanceMirror('isPreviewing');
  const error = useFinanceMirror('error');
  const isSubmitting = useFinanceMirror('isSubmitting');
  const closeModal = useFinanceMirror('closeModal');

  if (modal !== 'contract' && modal !== 'editContract') return null;
  const isEdit = modal === 'editContract';
  const text = (key: 'grossAmount' | 'discountAmount' | 'discountReason' | 'firstPaymentAmount' | 'numberOfInstallments') =>
    (e: unknown) => setField(key, inputText(e));

  return (
    <AppModal opened onClose={closeModal} size="lg">
      <AppModal.Header>
        <AppModal.Icon icon={<IconCalendarDollar size={22} />} />
        <AppModal.Title>{isEdit ? labels.editContractTitle : labels.contractTitle}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <Stack gap="md">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}
          {isEdit && (
            <Text size="xs" c="var(--app-text-muted)">
              {labels.editContractHint}
            </Text>
          )}
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            {!isEdit && (
              <>
                <AppInput type="number" label={labels.grossAmount} description={labels.grossAmountHint} value={form.grossAmount} onChange={text('grossAmount')} />
                <AppSelect
                  label={labels.currency}
                  description={labels.currencyHint}
                  data={CURRENCY_OPTIONS}
                  value={form.currency}
                  onChange={(v: string | null) => setField('currency', v as Currency | null)}
                  clearable
                />
              </>
            )}
            <AppInput type="number" label={labels.discountAmount} value={form.discountAmount} onChange={text('discountAmount')} />
            <AppInput label={labels.discountReason} value={form.discountReason} onChange={text('discountReason')} />
            {!isEdit && (
              <AppInput type="number" label={labels.firstPayment} description={labels.firstPaymentHint} value={form.firstPaymentAmount} onChange={text('firstPaymentAmount')} />
            )}
            <AppInput type="number" label={labels.installmentsCount} value={form.numberOfInstallments} onChange={text('numberOfInstallments')} required />
            <AppDatePicker
              label={labels.startDate}
              description={labels.startDateHint}
              value={form.startDate || null}
              onChange={(v) => setField('startDate', v ?? '')}
              clearable
            />
          </SimpleGrid>
          {!isEdit && preview && <SchedulePreview preview={preview} />}
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
          {!isEdit && (
            <AppButton variant="outline" onClick={onPreview} loading={isPreviewing} leftSection={<IconEye size={16} />}>
              {labels.previewButton}
            </AppButton>
          )}
          <AppButton onClick={onSubmit} loading={isSubmitting}>
            {isEdit ? labels.save : labels.createButton}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
