'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconCoin } from '@tabler/icons-react';
import { AppInput } from '@/src/components/controllers/input';
import { AppModal } from '@/src/components/controllers';
import { sectionFormLabels } from '../static-data/sections.data';
import { useSectionsMirror } from '../store/useSectionsMirror';

export interface SectionFeeModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
}

/**
 * SectionFeeModal
 *
 * Single-field financial update modal built with the AppModal system.
 * Strictly adheres to role.md Section 12 (ZERO useState, reads via useSectionsMirror).
 */
export function SectionFeeModal({
  opened,
  onClose,
  onSubmit,
}: SectionFeeModalProps) {
  const feeSection = useSectionsMirror('feeSection');
  const feeFormAmount = useSectionsMirror('feeFormAmount');
  const setFeeFormAmount = useSectionsMirror('setFeeFormAmount');
  const feeError = useSectionsMirror('feeError');
  const feeSubmitting = useSectionsMirror('feeSubmitting');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
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
          تعديل الرسوم الدراسية المعتمدة لطلاب هذه الشعبة
        </AppModal.Description>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <form id="section-fee-modal-form" onSubmit={handleSubmit}>
          <Stack gap="md">
            {feeError && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="light"
                radius="md"
              >
                {feeError}
              </Alert>
            )}

            {feeSection && (
              <Text size="sm" fw={600} c="dimmed">
                الشعبة: <Text span c="dark" fw={700}>{feeSection.name}</Text>
              </Text>
            )}

            <Text size="xs" c="dimmed">
              الرسوم السابقة: {Number(feeSection?.feeAmount ?? 0).toLocaleString()} ر.س
            </Text>

            <AppInput
              type="number"
              label={sectionFormLabels.feeAmount}
              placeholder={sectionFormLabels.feePlaceholder}
              value={feeFormAmount}
              min={0}
              onChange={(e) =>
                setFeeFormAmount(
                  typeof e === 'string'
                    ? e
                    : typeof e === 'number'
                      ? String(e)
                      : e && typeof e === 'object' && 'target' in e
                        ? (e.target as HTMLInputElement).value
                        : '0',
                )
              }
              required
            />
          </Stack>
        </form>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel disabled={feeSubmitting} />
          <AppModal.Confirm
            form="section-fee-modal-form"
            type="submit"
            loading={feeSubmitting}
          >
            {sectionFormLabels.submitFee}
          </AppModal.Confirm>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}

// Backward compatibility alias
export const SectionFeeDrawer = SectionFeeModal;
