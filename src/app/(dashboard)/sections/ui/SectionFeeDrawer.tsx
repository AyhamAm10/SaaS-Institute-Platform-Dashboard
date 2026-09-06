'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconCoin } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { AppInput } from '@/src/components/controllers/input';
import { AppDrawer } from '@/src/components/ui';
import { Section } from '@/src/core/api';
import { sectionFormLabels } from '../static-data/sections.data';

export interface SectionFeeDrawerProps {
  opened: boolean;
  onClose: () => void;
  section?: Section | null;
  onSubmit: (feeAmount: number) => Promise<void>;
  isLoading?: boolean;
}

export function SectionFeeDrawer({
  opened,
  onClose,
  section,
  onSubmit,
  isLoading = false,
}: SectionFeeDrawerProps) {
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
    <AppDrawer
      opened={opened}
      onClose={onClose}
      size="sm"
    >
      <AppDrawer.Header>
        <AppDrawer.Icon
          icon={<IconCoin size={20} />}
          color="teal"
        />
        <AppDrawer.Title>{sectionFormLabels.feeModalTitle}</AppDrawer.Title>
        <AppDrawer.Description>
          تعديل الرسوم الدراسية المعتمدة لطلاب هذه الشُعبة
        </AppDrawer.Description>
        <AppDrawer.Close />
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form id="section-fee-form" onSubmit={handleSubmit}>
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

            <AppDrawer.Section
              title={section?.name}
              description="حدد الرسوم الدراسية المعتمدة بالريال السعودي"
            >
              <Text size="xs" c="dimmed">
                سيتم تطبيق هذا المبلغ على أي تسجيلات أو حسابات مستقبلية مرتبطة بهذه الشُعبة.
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
            </AppDrawer.Section>
          </Stack>
        </form>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel disabled={isLoading} />
          <AppDrawer.Submit
            form="section-fee-form"
            color="teal"
            loading={isLoading}
          >
            {sectionFormLabels.submitFee}
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}

// Backward compatibility alias
export const SectionFeeModal = SectionFeeDrawer;
export type SectionFeeModalProps = SectionFeeDrawerProps;
