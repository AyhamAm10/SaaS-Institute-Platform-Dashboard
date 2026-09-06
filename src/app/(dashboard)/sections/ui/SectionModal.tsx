'use client';

import {
  Alert,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { AppInput } from '@/src/components/controllers/input';
import { AcademicYear, Section } from '@/src/core/api';
import { defaultGradesList, sectionFormLabels } from '../static-data/sections.data';

export interface SectionModalProps {
  opened: boolean;
  onClose: () => void;
  section?: Section | null;
  academicYears?: AcademicYear[];
  onSubmit: (data: {
    name: string;
    grade: string;
    branchId: number;
    academicYearId: number;
    feeAmount: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function SectionModal({
  opened,
  onClose,
  section,
  academicYears = [],
  onSubmit,
  isLoading = false,
}: SectionModalProps) {
  const isEditing = Boolean(section);

  const [name, setName] = useState('');
  const [grade, setGrade] = useState<string | null>(defaultGradesList[0] ?? '');
  const [academicYearId, setAcademicYearId] = useState<string | null>(null);
  const [feeAmount, setFeeAmount] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);

  // Derive academic year select options
  const yearOptions = academicYears.map((y) => ({
    value: String(y.id),
    label: `${y.name} ${y.isCurrent ? '(الحالية)' : ''}`,
  }));

  useEffect(() => {
    if (section) {
      setName(section.name);
      setGrade(section.grade);
      setAcademicYearId(String(section.academicYearId));
      setFeeAmount(String(section.feeAmount));
    } else {
      setName('');
      setGrade(defaultGradesList[0] ?? '');
      const currentYear = academicYears.find((y) => y.isCurrent) ?? academicYears[0];
      setAcademicYearId(currentYear ? String(currentYear.id) : null);
      setFeeAmount('0');
    }
    setError(null);
  }, [section, opened, academicYears]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('يرجى إدخال اسم الشُعبة');
      return;
    }
    if (!grade) {
      setError('يرجى اختيار المرحلة / الصف الدراسي');
      return;
    }
    if (!academicYearId) {
      setError('يرجى اختيار السنة الدراسية');
      return;
    }
    const numFee = Number(feeAmount);
    if (isNaN(numFee) || numFee < 0) {
      setError('يرجى إدخال مبلغ رسوم صحيح (أكبر من أو يساوي 0)');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        grade,
        branchId: section?.branchId ?? 1, // default branch for the tenant
        academicYearId: Number(academicYearId),
        feeAmount: numFee,
      });
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'حدث خطأ أثناء حفظ الشُعبة';
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
          {isEditing ? sectionFormLabels.editTitle : sectionFormLabels.createTitle}
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
            label={sectionFormLabels.name}
            placeholder={sectionFormLabels.namePlaceholder}
            value={name}
            onChange={(e) => setName(typeof e === 'string' ? e : (e as any)?.target?.value ?? '')}
            required
          />

          <Select
            label={sectionFormLabels.grade}
            data={defaultGradesList}
            value={grade}
            onChange={setGrade}
            radius="xl"
            searchable
            required
          />

          {!isEditing && (
            <Select
              label={sectionFormLabels.academicYearId}
              data={yearOptions}
              value={academicYearId}
              onChange={setAcademicYearId}
              radius="xl"
              required
              placeholder="اختر السنة الدراسية"
            />
          )}

          <AppInput
            type="number"
            label={sectionFormLabels.feeAmount}
            placeholder={sectionFormLabels.feePlaceholder}
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
              {isEditing ? sectionFormLabels.submitEdit : sectionFormLabels.submitCreate}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
