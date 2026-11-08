'use client';

import { Alert, Checkbox, Stack } from '@mantine/core';
import { IconAlertCircle, IconCalendar, IconCalendarPlus } from '@tabler/icons-react';
import { AppDatePicker, AppDrawer, AppInput } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { academicYearFormLabels as labels } from '../static-data/academic-years.data';
import { useAcademicYearsMirror } from '../store/useAcademicYearsMirror';

/**
 * Create / edit an academic year. Form, error and loading live in the store;
 * validation and the save run in the controller (role.md §12.1). ZERO useState.
 */
export function AcademicYearDrawer({ onSubmit }: { onSubmit: () => Promise<void> }) {
  const opened = useAcademicYearsMirror('modalOpened');
  const year = useAcademicYearsMirror('selectedYear');
  const form = useAcademicYearsMirror('yearForm');
  const error = useAcademicYearsMirror('formError');
  const isLoading = useAcademicYearsMirror('formSubmitting');
  const setField = useAcademicYearsMirror('setYearFormField');
  const close = useAcademicYearsMirror('closeModal');
  const isEditing = Boolean(year);

  return (
    <AppDrawer opened={opened} onClose={close} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon
          icon={isEditing ? <IconCalendar size={20} /> : <IconCalendarPlus size={20} />}
          color={isEditing ? 'blue' : 'primary'}
        />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>{isEditing ? labels.editTitle : labels.createTitle}</AppDrawer.Title>
          <AppDrawer.Description>
            {isEditing ? 'تحديث بيانات السنة والتواريخ المعتمدة' : 'إضافة سنة دراسية جديدة للمعهد لتنظيم الفصول والطلاب'}
          </AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form
          id="academic-year-form"
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
          }}
        >
          <Stack gap="md">
            {error && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
                {error}
              </Alert>
            )}

            <AppDrawer.Section title="معلومات السنة" description="أدخل اسم وفترة السنة الدراسية">
              <AppInput
                type="text"
                label={labels.name}
                placeholder={labels.namePlaceholder}
                value={form.name}
                onChange={(e: unknown) => setField('name', inputText(e))}
                required
              />
              <AppDatePicker
                label={labels.startDate}
                placeholder="اختر تاريخ البداية..."
                value={form.startDate}
                onChange={(val) => setField('startDate', val ?? '')}
                required
              />
              <AppDatePicker
                label={labels.endDate}
                placeholder="اختر تاريخ النهاية..."
                value={form.endDate}
                onChange={(val) => setField('endDate', val ?? '')}
                required
              />
            </AppDrawer.Section>

            {!isEditing && (
              <AppDrawer.Section>
                <Checkbox
                  label={labels.isCurrent}
                  checked={form.isCurrent}
                  onChange={(e) => setField('isCurrent', e.currentTarget.checked)}
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
          <AppDrawer.Submit form="academic-year-form" loading={isLoading}>
            {isEditing ? labels.submitEdit : labels.submitCreate}
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
