'use client';

import {
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { AppInput } from '@/src/components/controllers/input';
import { Section } from '@/src/core/api';
import { sectionFormLabels } from '../static-data/sections.data';

export interface SectionFeeModalProps {
  opened: boolean;
  onClose: () => void;
  section?: Section | null;
  onSubmit: (feeAmount: number) => Promise<void>;
  isLoading?: boolean;
}

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
    <Modal
      opened={opened}
      onClose={onClose}
      radius="lg"
      padding="lg"
      centered
      withCloseButton={true}
      title={
        <Title order={3} size="h4" fw={700}>
          {sectionFormLabels.feeModalTitle} — {section?.name}
        </Title>
      }
    >
      <form onSubmit={handleSubmit}>
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

          <Text size="sm" c="dimmed">
            تعديل الرسوم الدراسية المعتمدة لطلاب شُعبة{' '}
            <Text span fw={600} c="var(--mantine-color-text)">
              {section?.name}
            </Text>
          </Text>

          <AppInput
            type="number"
            label={sectionFormLabels.feeAmount}
            value={feeAmount}
            min={0}
            onChange={(e) => setFeeAmount(typeof e === 'string' ? e : typeof e === 'number' ? String(e) : (e as any)?.target?.value ?? '0')}
            required
          />

          <Group justify="flex-end" gap="sm" mt="md">
            <Button
              variant="subtle"
              color="gray"
              radius="xl"
              onClick={onClose}
              disabled={isLoading}
            >
              {sectionFormLabels.cancel}
            </Button>
            <Button
              type="submit"
              color="primary"
              radius="xl"
              loading={isLoading}
            >
              {sectionFormLabels.submitFee}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
