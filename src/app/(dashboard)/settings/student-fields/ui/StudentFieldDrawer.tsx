'use client';

import { Button, Checkbox, Group, Stack } from '@mantine/core';
import { IconListDetails } from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers/drawer';
import { AppInput, AppSelect } from '@/src/components/controllers/input';
import { useStudentFieldsMirror } from '../store/useStudentFieldsMirror';
import { studentFieldsLabels } from '../static-data/student-fields.data';

export interface StudentFieldDrawerProps {
  onSubmit: () => Promise<void>;
}

export function StudentFieldDrawer({ onSubmit }: StudentFieldDrawerProps) {
  const isDrawerOpen = useStudentFieldsMirror('isDrawerOpen');
  const closeDrawer = useStudentFieldsMirror('closeDrawer');
  const selectedField = useStudentFieldsMirror('selectedField');
  const formName = useStudentFieldsMirror('formName');
  const formLabel = useStudentFieldsMirror('formLabel');
  const formType = useStudentFieldsMirror('formType');
  const formOptionsText = useStudentFieldsMirror('formOptionsText');
  const formIsRequired = useStudentFieldsMirror('formIsRequired');
  const formDisplayInReport = useStudentFieldsMirror('formDisplayInReport');
  const isSubmitting = useStudentFieldsMirror('isSubmitting');
  const setFormField = useStudentFieldsMirror('setFormField');

  const isEditing = Boolean(selectedField);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <AppDrawer opened={isDrawerOpen} onClose={closeDrawer} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconListDetails size={20} />} color="primary" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>
            {isEditing ? studentFieldsLabels.drawerEditTitle : studentFieldsLabels.drawerCreateTitle}
          </AppDrawer.Title>
          <AppDrawer.Description>
            {studentFieldsLabels.drawerDescription}
          </AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form id="student-field-form" onSubmit={handleSubmit}>
          <Stack gap="md">
            <AppInput
              label="تسمية الحقل (العنوان المعروض)"
              placeholder="مثال: فصيلة الدم، المدرسة الصباحية..."
              value={formLabel}
              onChange={(e) =>
                setFormField('formLabel', typeof e === 'string' ? e : e?.target?.value ?? '')
              }
              required
            />

            <AppInput
              label="رمز الحقل البرمجي (Key)"
              placeholder="مثال: blood_type, morning_school"
              value={formName}
              onChange={(e) =>
                setFormField('formName', typeof e === 'string' ? e : e?.target?.value ?? '')
              }
              disabled={isEditing}
              required
            />

            <AppSelect
              label="نوع الحقل"
              data={[
                { value: 'TEXT', label: 'نصي (Text)' },
                { value: 'NUMBER', label: 'رقمي (Number)' },
                { value: 'DATE', label: 'تاريخ (Date)' },
                { value: 'SELECT', label: 'قائمة خيارات منسدلة (Select Dropdown)' },
                { value: 'BOOLEAN', label: 'نعم / لا (Boolean)' },
              ]}
              value={formType}
              onChange={(val: string | null) => setFormField('formType', val || 'TEXT')}
              disabled={isEditing}
              required
            />

            {formType === 'SELECT' && (
              <AppInput
                type="textarea"
                label="خيارات القائمة المنسدلة (كل خيار بسطر منفصل)"
                placeholder={'A+\nA-\nB+\nB-\nO+\nO-'}
                value={formOptionsText}
                onChange={(e) =>
                  setFormField(
                    'formOptionsText',
                    typeof e === 'string' ? e : e?.target?.value ?? '',
                  )
                }
                rows={4}
                required
              />
            )}

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
        <Button variant="subtle" color="gray" onClick={closeDrawer} radius="xl">
          إلغاء
        </Button>
        <Button
          type="submit"
          form="student-field-form"
          loading={isSubmitting}
          radius="xl"
          color="primary"
        >
          {isEditing ? 'حفظ التعديلات' : 'إضافة الحقل'}
        </Button>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
