import { Alert, Group, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconCash } from '@tabler/icons-react';
import { AppButton, AppInput, AppModal, AppSelect } from '@/src/components/controllers';
import type { FamilyOpenContract, PaymentMethod } from '@/src/core/api';
import { formatMoney, inputText } from '@/src/core/format';
import { PAYMENT_METHOD_OPTIONS } from '../../../students/finance/static-data/student-finance.data';
import { familyDetailLabels as labels } from '../static-data/family-detail.data';

export interface FamilyPaymentValues {
  /** Amount typed per contract id. */
  amounts: Record<number, string>;
  method: PaymentMethod;
  note: string;
}

interface Props {
  opened: boolean;
  contracts: FamilyOpenContract[];
  values: FamilyPaymentValues;
  error: string | null;
  isSubmitting: boolean;
  onChange: (patch: Partial<FamilyPaymentValues>) => void;
  onAmount: (contractId: number, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

/** One line per open contract of the family: how much goes to each child. Props only. */
export function FamilyPaymentModal({
  opened,
  contracts,
  values,
  error,
  isSubmitting,
  onChange,
  onAmount,
  onClose,
  onSubmit,
}: Props) {
  if (!opened) return null;
  return (
    <AppModal opened onClose={onClose} size="lg">
      <AppModal.Header>
        <AppModal.Icon icon={<IconCash size={22} />} />
        <AppModal.Title>{labels.payTitle}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>
      <AppModal.Content>
        <Stack gap="sm">
          <Text size="xs" c="var(--app-text-muted)">
            {labels.payHint}
          </Text>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}
          {contracts.length === 0 && (
            <Text c="var(--app-text-muted)" ta="center" py="md">
              {labels.nothingToPay}
            </Text>
          )}
          {contracts.map((c) => (
            <Group key={c.contractId} justify="space-between" align="flex-end" wrap="nowrap">
              <Stack gap={0} style={{ minWidth: 0 }}>
                <Text size="sm" fw={500}>
                  {c.fullName}
                </Text>
                <Text size="xs" c="var(--app-text-muted)">
                  {c.sectionName} · {c.yearName} · {labels.remaining}: {formatMoney(c.remaining, c.currency)}
                </Text>
              </Stack>
              <AppInput
                type="number"
                placeholder={labels.amount}
                value={values.amounts[c.contractId] ?? ''}
                onChange={(e: unknown) => onAmount(c.contractId, inputText(e))}
                w={150}
              />
            </Group>
          ))}
          <AppSelect
            label={labels.method}
            data={PAYMENT_METHOD_OPTIONS}
            value={values.method}
            onChange={(v: string | null) => v && onChange({ method: v as PaymentMethod })}
          />
          <AppInput label={labels.note} value={values.note} onChange={(e: unknown) => onChange({ note: inputText(e) })} />
        </Stack>
      </AppModal.Content>
      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
          <AppButton onClick={onSubmit} loading={isSubmitting}>
            {labels.save}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
