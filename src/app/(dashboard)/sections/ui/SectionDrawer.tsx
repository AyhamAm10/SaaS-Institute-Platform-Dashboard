'use client';

import { Alert, Stack } from '@mantine/core';
import { IconAlertCircle, IconEdit, IconSchool } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { AppDrawer, AppInput, AppSelect } from '@/src/components/controllers';
import { AcademicBranch, AcademicYear, Section } from '@/src/core/api';
import { sectionFormLabels } from '../static-data/sections.data';

export interface SectionDrawerProps {
  opened: boolean;
  onClose: () => void;
  section?: Section | null;
  academicYears?: AcademicYear[];
  academicBranches?: AcademicBranch[];
  onSubmit: (data: {
    name: string;
    academicBranchId: number;
    branchId: number;
    academicYearId: number;
    feeAmount: number;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function SectionDrawer({
  opened,
  onClose,
  section,
  academicYears = [],
  academicBranches = [],
  onSubmit,
  isLoading = false,
}: SectionDrawerProps) {
  const isEditing = Boolean(section);

  const [name, setName] = useState('');
  const [academicBranchId, setAcademicBranchId] = useState<string | null>(null);
  const [academicYearId, setAcademicYearId] = useState<string | null>(null);
  const [feeAmount, setFeeAmount] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);

  // Derive academic year select options
  const yearOptions = academicYears.map((y) => ({
    value: String(y.id),
    label: `${y.name} ${y.isCurrent ? '(الحالية)' : ''}`,
  }));

  // Derive academic branch select options
  const branchOptions = academicBranches.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));

  useEffect(() => {
    if (section) {
      setName(section.name);
      setAcademicBranchId(String(section.academicBranchId));
      setAcademicYearId(String(section.academicYearId));
      setFeeAmount(String(section.feeAmount));
    } else {
      setName('');
      setAcademicBranchId(academicBranches[0] ? String(academicBranches[0].id) : null);
      const currentYear = academicYears.find((y) => y.isCurrent) ?? academicYears[0];
      setAcademicYearId(currentYear ? String(currentYear.id) : null);
      setFeeAmount('0');
    }
    setError(null);
  }, [section, opened, academicYears, academicBranches]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('يرجى إدخال اسم الشُعبة');
      return;
    }
    if (!academicBranchId) {
      setError('يرجى اختيار الفرع الأكاديمي');
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
        academicBranchId: Number(academicBranchId),
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
    <AppDrawer
      opened={opened}
      onClose={onClose}
      size="md"
    >
      <AppDrawer.Header>
        <AppDrawer.Icon
          icon={isEditing ? <IconEdit size={20} /> : <IconSchool size={20} />}
          color={isEditing ? 'blue' : 'primary'}
        />
        <AppDrawer.Title>
          {isEditing
            ? sectionFormLabels.editTitle
            : sectionFormLabels.createTitle}
        </AppDrawer.Title>
        <AppDrawer.Description>
          {isEditing
            ? 'تحديث بيانات ومرحلة الشُعبة الدراسية'
            : 'إضافة شُعبة دراسية جديدة وتعيين الرسوم والمرحلة التعليمية'}
        </AppDrawer.Description>
        <AppDrawer.Close />
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form id="section-form" onSubmit={handleSubmit}>
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

            {/* Basic Information Section */}
            <AppDrawer.Section
              title="البيانات الأساسية"
              description="حدد اسم الشُعبة والمرحلة التعليمية والسنة الدراسية"
            >
              <AppInput
                type="text"
                label={sectionFormLabels.name}
                placeholder={sectionFormLabels.namePlaceholder}
                value={name}
                onChange={(e) => setName(typeof e === 'string' ? e : (e as any)?.target?.value ?? '')}
                required
              />

              <AppSelect
                label={sectionFormLabels.academicBranchId}
                placeholder="اختر الفرع الأكاديمي (مثال: الثانوي العام — الفرع العلمي)"
                data={branchOptions}
                value={academicBranchId}
                onChange={(val: any) => setAcademicBranchId(val as string | null)}
                searchable
                required
              />

              {!isEditing && (
                <AppSelect
                  label={sectionFormLabels.academicYearId}
                  data={yearOptions}
                  value={academicYearId}
                  onChange={(val: any) => setAcademicYearId(val as string | null)}
                  required
                  placeholder="اختر السنة الدراسية"
                />
              )}
            </AppDrawer.Section>

            {/* Financial Information Section */}
            <AppDrawer.Section
              title="البيانات المالية"
              description="الرسوم الدراسية المقررة لطلاب هذه الشُعبة"
            >
              <AppInput
                type="number"
                label={sectionFormLabels.feeAmount}
                placeholder={sectionFormLabels.feePlaceholder}
                value={feeAmount}
                min={0}
                onChange={(e) => setFeeAmount(typeof e === 'string' ? e : typeof e === 'number' ? String(e) : (e as any)?.target?.value ?? '0')}
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
            form="section-form"
            loading={isLoading}
          >
            {isEditing ? sectionFormLabels.submitEdit : sectionFormLabels.submitCreate}
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}

// Backward compatibility alias
export const SectionModal = SectionDrawer;
export type SectionModalProps = SectionDrawerProps;
