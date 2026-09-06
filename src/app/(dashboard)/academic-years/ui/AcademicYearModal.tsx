'use client';

import {
  Alert,
  Button,
  Checkbox,
  Group,
  Modal,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { AppInput } from '@/src/components/controllers/input';
import { AppDatePicker } from '@/src/components/ui';
import { AcademicYear } from '@/src/core/api';
import { academicYearFormLabels } from '../static-data/academic-years.data';

export interface AcademicYearModalProps {
  opened: boolean;
  onClose: () => void;
  year?: AcademicYear | null;
  onSubmit: (data: {
    name: string;
    startDate: string;
    endDate: string;
    isCurrent?: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function AcademicYearModal({
  opened,
  onClose,
  year,
  onSubmit,
  isLoading = false,
}: AcademicYearModalProps) {
  const isEditing = Boolean(year);

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (year) {
      setName(year.name);
      setStartDate(year.startDate ? year.startDate.split('T')[0] : '');
      setEndDate(year.endDate ? year.endDate.split('T')[0] : '');
      setIsCurrent(year.isCurrent);
    } else {
      setName('');
      setStartDate('');
      setEndDate('');
      setIsCurrent(false);
    }
    setError(null);
  }, [year, opened]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('يرجى إدخال اسم السنة الدراسية');
      return;
    }
    if (!startDate) {
      setError('يرجى تحديد تاريخ بداية السنة الدراسية (YYYY-MM-DD)');
      return;
    }
    if (!endDate) {
      setError('يرجى تحديد تاريخ نهاية السنة الدراسية (YYYY-MM-DD)');
      return;
    }
    let formattedStart = startDate.trim();
    let formattedEnd = endDate.trim();

    if (/^\d{4}$/.test(formattedStart)) {
      formattedStart = `${formattedStart}-09-01`;
    }
    if (/^\d{4}$/.test(formattedEnd)) {
      formattedEnd = `${formattedEnd}-06-30`;
    }

    if (new Date(formattedStart) >= new Date(formattedEnd)) {
      setError('يجب أن يكون تاريخ البداية قبل تاريخ النهاية');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        startDate: formattedStart,
        endDate: formattedEnd,
        isCurrent,
      });
      onClose();
    } catch (err: any) {
      let msg =
        err?.response?.data?.message ||
        err?.message ||
        'حدث خطأ أثناء حفظ السنة الدراسية';
      if (Array.isArray(msg)) {
        msg = msg.join(', ');
      }
      if (typeof msg === 'string' && (msg.includes('overlap') || msg.includes('تتداخل'))) {
        msg = 'تواريخ السنة الدراسية تتداخل مع سنة دراسية أخرى موجودة مسبقاً، يرجى اختيار تاريخ بداية ونهاية لا يتقاطعان مع السنوات السابقة';
      }
      setError(msg);
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
          {isEditing
            ? academicYearFormLabels.editTitle
            : academicYearFormLabels.createTitle}
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

          <AppInput
            type="text"
            label={academicYearFormLabels.name}
            placeholder={academicYearFormLabels.namePlaceholder}
            value={name}
            onChange={(e) => setName(typeof e === 'string' ? e : (e as any)?.target?.value ?? '')}
            required
          />

          <AppDatePicker
            label={academicYearFormLabels.startDate}
            placeholder="اختر تاريخ البداية..."
            value={startDate}
            onChange={(val) => setStartDate(val ?? '')}
            required
          />

          <AppDatePicker
            label={academicYearFormLabels.endDate}
            placeholder="اختر تاريخ النهاية..."
            value={endDate}
            onChange={(val) => setEndDate(val ?? '')}
            required
          />

          <Checkbox
            label={academicYearFormLabels.isCurrent}
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.currentTarget.checked)}
            radius="sm"
            size="sm"
          />

          <Group justify="flex-end" gap="sm" mt="md">
            <Button
              variant="subtle"
              color="gray"
              radius="xl"
              onClick={onClose}
              disabled={isLoading}
            >
              {academicYearFormLabels.cancel}
            </Button>
            <Button
              type="submit"
              color="primary"
              radius="xl"
              loading={isLoading}
            >
              {isEditing
                ? academicYearFormLabels.submitEdit
                : academicYearFormLabels.submitCreate}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
