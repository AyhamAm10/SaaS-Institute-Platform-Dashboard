'use client';

import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Checkbox,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { IconListDetails, IconPlus, IconX } from '@tabler/icons-react';
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
  const formLabel = useStudentFieldsMirror('formLabel');
  const formType = useStudentFieldsMirror('formType');
  const formOptions = useStudentFieldsMirror('formOptions');
  const formIsRequired = useStudentFieldsMirror('formIsRequired');
  const formDisplayInReport = useStudentFieldsMirror('formDisplayInReport');
  const isSubmitting = useStudentFieldsMirror('isSubmitting');
  const setFormField = useStudentFieldsMirror('setFormField');
  const addOption = useStudentFieldsMirror('addOption');
  const removeOption = useStudentFieldsMirror('removeOption');

  const [newOptionDraft, setNewOptionDraft] = useState('');

  const isEditing = Boolean(selectedField);

  const handleAddOption = () => {
    if (newOptionDraft.trim()) {
      addOption(newOptionDraft.trim());
      setNewOptionDraft('');
    }
  };

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
              <Stack gap="xs">
                <Text size="xs" fw={600} c="var(--mantine-color-text)">
                  خيارات القائمة المنسدلة
                </Text>
                <Group gap="xs" align="flex-start" wrap="nowrap">
                  <Box style={{ flex: 1 }}>
                    <AppInput
                      placeholder="أدخل خيارا (مثال: A+) واضغط إضافة..."
                      value={newOptionDraft}
                      onChange={(e) =>
                        setNewOptionDraft(
                          typeof e === 'string' ? e : e?.target?.value ?? '',
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddOption();
                        }
                      }}
                    />
                  </Box>
                  <ActionIcon
                    variant="filled"
                    color="primary"
                    size={38}
                    radius="md"
                    onClick={handleAddOption}
                    aria-label="إضافة خيار"
                  >
                    <IconPlus size={18} />
                  </ActionIcon>
                </Group>

                {formOptions && formOptions.length > 0 ? (
                  <Group gap="xs" wrap="wrap" mt={4}>
                    {formOptions.map((opt, idx) => (
                      <Badge
                        key={idx}
                        size="md"
                        radius="sm"
                        variant="light"
                        color="primary"
                        style={{ paddingRight: 6, paddingLeft: 10 }}
                        rightSection={
                          <ActionIcon
                            size="xs"
                            color="red"
                            variant="subtle"
                            radius="xl"
                            onClick={() => removeOption(idx)}
                            aria-label={`حذف الخيار ${opt}`}
                          >
                            <IconX size={12} />
                          </ActionIcon>
                        }
                      >
                        {opt}
                      </Badge>
                    ))}
                  </Group>
                ) : (
                  <Text size="xs" c="dimmed">
                    لم تتم إضافة أي خيارات بعد. اكتب الخيار أعلاه واضغط على زر (+) أو مفتاح Enter.
                  </Text>
                )}
              </Stack>
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
