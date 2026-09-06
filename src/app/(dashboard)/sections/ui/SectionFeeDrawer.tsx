'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconCoin } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { AppInput } from '@/src/components/controllers/input';
import { AppModal } from '@/src/components/controllers';
import { Section } from '@/src/core/api';
import { sectionFormLabels } from '../static-data/sections.data';

export interface SectionFeeModalProps {
  opened: boolean;
  onClose: () => void;
  section?: Section | null;
  onSubmit: (feeAmount: number) => Promise<void>;
  isLoading?: boolean;
}

/**
 * SectionFeeModal
 *
 * Single-field financial update modal built with the AppModal system.
 * Perfect use-case for Modal (compact form, focused decision) rather than a full Drawer.
 */
export function SectionFeeModal({
  opened,
  onClose,
  section,
  onSubmit,
  isLoading = false,
}: SectionFeeModalProps) {
  const [feeAmount, setFeeAmount] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (section) {
      setFeeAmount(String(section.feeAmount));
    }
    setError(null);
  }, [section, opened]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numFee = Number(feeAmount);
    if (isNaN(numFee) || numFee < 0) {
      setError('يرجى إدخال مبلغ رسوم صالح (أكبر من أو يساوي 0)');
      return;
    }

    try {
      await onSubmit(numFee);
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'حدث خطأ أثناء تعديل الرسوم';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      variant="default"
      size="sm"
    >
      <AppModal.Header>
        <AppModal.Icon icon={<IconCoin size={20} />} />
        <AppModal.Title>{sectionFormLabels.feeModalTitle}</AppModal.Title>
        <AppModal.Description>
          تعديل الرسوم الدراسية المعتمدة لطلاب هذه الشُعبة
        </AppModal.Description>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <form id="section-fee-modal-form" onSubmit={handleSubmit}>
          <Stack gap="md">
            {error && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="light"
                radius="md"
              >
                {error}
              </Alert>
            )}

            {section && (
              <Text size="sm" fw={600} c="dimmed">
                الشُعبة: <Text span c="dark" fw={700}>{section.name}</Text>
              </Text>
            )}

            <Text size="xs" c="dimmed">
              سيتم تطبيق هذا المبلغ على أي تسجيلات أو حسابات مالية مستقبلية مرتبطة بهذه الشُعبة.
            </Text>

            <AppInput
              type="number"
              label={sectionFormLabels.feeAmount}
              value={feeAmount}
              min={0}
              onChange={(e) =>
                setFeeAmount(
                  typeof e === 'string'
                    ? e
                    : typeof e === 'number'
                    ? String(e)
                    : (e as any)?.target?.value ?? '0',
                )
              }
              required
            />
          </Stack>
        </form>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel disabled={isLoading} />
          <AppModal.Confirm
            form="section-fee-modal-form"
            type="submit"
            color="teal"
            loading={isLoading}
          >
            {sectionFormLabels.submitFee}
          </AppModal.Confirm>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}

// Keep Drawer alias for backward compatibility
export const SectionFeeDrawer = SectionFeeModal;
export type SectionFeeDrawerProps = SectionFeeModalProps;
