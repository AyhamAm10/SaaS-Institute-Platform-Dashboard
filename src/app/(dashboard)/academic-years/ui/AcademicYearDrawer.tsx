'use client';

import { Alert, Checkbox, Stack } from '@mantine/core';
import { IconAlertCircle, IconCalendar, IconCalendarPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { AppInput } from '@/src/components/controllers/input';
import { AppDatePicker, AppDrawer } from '@/src/components/ui';
import { AcademicYear } from '@/src/core/api';
import { academicYearFormLabels } from '../static-data/academic-years.data';

export interface AcademicYearDrawerProps {
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

export function AcademicYearDrawer({
  opened,
  onClose,
  year,
  onSubmit,
  isLoading = false,
}: AcademicYearDrawerProps) {
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
    <AppDrawer
      opened={opened}
      onClose={onClose}
      size="md"
    >
      <AppDrawer.Header>
        <AppDrawer.Icon
          icon={isEditing ? <IconCalendar size={20} /> : <IconCalendarPlus size={20} />}
          color={isEditing ? 'blue' : 'primary'}
        />
        <AppDrawer.Title>
          {isEditing
            ? academicYearFormLabels.editTitle
            : academicYearFormLabels.createTitle}
        </AppDrawer.Title>
        <AppDrawer.Description>
          {isEditing
            ? 'تحديث بيانات السنة والتواريخ المعتمدة'
            : 'إضافة سنة دراسية جديدة للمعهد لتنظيم الفصول والطلاب'}
        </AppDrawer.Description>
        <AppDrawer.Close />
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form id="academic-year-form" onSubmit={handleSubmit}>
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
              title="معلومات السنة"
              description="أدخل اسم وفترة السنة الدراسية"
            >
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
            </AppDrawer.Section>

            {!isEditing && (
              <AppDrawer.Section>
                <Checkbox
                  label={academicYearFormLabels.isCurrent}
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.currentTarget.checked)}
                  color="teal"
                  radius="sm"
                />
              </AppDrawer.Section>
            )}
          </Stack>
        </form>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel disabled={isLoading} />
          <AppDrawer.Submit
            form="academic-year-form"
            loading={isLoading}
          >
            {isEditing
              ? academicYearFormLabels.submitEdit
              : academicYearFormLabels.submitCreate}
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}

// Backward compatibility export alias
export const AcademicYearModal = AcademicYearDrawer;
