'use client';

import { Checkbox, Stack } from '@mantine/core';
import { IconListDetails } from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers/drawer';
import { AppInput, AppSelect } from '@/src/components/controllers/input';
import { inputText } from '@/src/core/format';
import { useStudentFieldsMirror } from '../store/useStudentFieldsMirror';
import { studentFieldsLabels } from '../static-data/student-fields.data';
import { StudentFieldOptionsEditor } from './StudentFieldOptionsEditor';

const FIELD_TYPE_OPTIONS = [
  { value: 'TEXT', label: 'نصي' },
  { value: 'NUMBER', label: 'رقمي' },
  { value: 'DATE', label: 'تاريخ' },
  { value: 'SELECT', label: 'قائمة خيارات منسدلة' },
  { value: 'BOOLEAN', label: 'نعم / لا' },
];

export interface StudentFieldDrawerProps {
  onSubmit: () => Promise<void>;
}

/** Create / edit a custom student field. State lives in the store. ZERO useState. */
export function StudentFieldDrawer({ onSubmit }: StudentFieldDrawerProps) {
  const isDrawerOpen = useStudentFieldsMirror('isDrawerOpen');
  const closeDrawer = useStudentFieldsMirror('closeDrawer');
  const selectedField = useStudentFieldsMirror('selectedField');
  const formLabel = useStudentFieldsMirror('formLabel');
  const formType = useStudentFieldsMirror('formType');
  const formIsRequired = useStudentFieldsMirror('formIsRequired');
  const formDisplayInReport = useStudentFieldsMirror('formDisplayInReport');
  const isSubmitting = useStudentFieldsMirror('isSubmitting');
  const setFormField = useStudentFieldsMirror('setFormField');
  const isEditing = Boolean(selectedField);

  return (
    <AppDrawer opened={isDrawerOpen} onClose={closeDrawer} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconListDetails size={20} />} color="primary" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>
            {isEditing ? studentFieldsLabels.drawerEditTitle : studentFieldsLabels.drawerCreateTitle}
          </AppDrawer.Title>
          <AppDrawer.Description>{studentFieldsLabels.drawerDescription}</AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form
          id="student-field-form"
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit();
          }}
        >
          <Stack gap="md">
            <AppInput
              label="تسمية الحقل (العنوان المعروض)"
              placeholder="مثال: فصيلة الدم، المدرسة الصباحية..."
              value={formLabel}
              onChange={(e: unknown) => setFormField('formLabel', inputText(e))}
              required
            />
            <AppSelect
              label="نوع الحقل"
              data={FIELD_TYPE_OPTIONS}
              value={formType}
              onChange={(val: string | null) => setFormField('formType', val || 'TEXT')}
              disabled={isEditing}
              required
            />
            {formType === 'SELECT' && <StudentFieldOptionsEditor />}
            <Stack gap="xs" mt="xs">
              <Checkbox
                label="حقل إجباري (لا يمكن إتمام التسجيل بدونه)"
                checked={formIsRequired}
                onChange={(e) => setFormField('formIsRequired', e.currentTarget.checked)}
              />
              <Checkbox
                label="إظهار هذا الحقل في بطاقة الطالب والتقارير الأكاديمية"
                checked={formDisplayInReport}
                onChange={(e) => setFormField('formDisplayInReport', e.currentTarget.checked)}
              />
            </Stack>
          </Stack>
        </form>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel disabled={isSubmitting} />
          <AppDrawer.Submit form="student-field-form" loading={isSubmitting}>
            {isEditing ? 'حفظ التعديلات' : 'إضافة الحقل'}
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
