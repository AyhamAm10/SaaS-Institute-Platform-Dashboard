'use client';

import { Alert, Card, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import { AppDatePicker, AppInput, AppSelect } from '@/src/components/controllers';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';
import { StudentField } from '@/src/core/api';
import { inputText } from '@/src/core/format';

export interface Step3CustomFieldsProps {
  fields: StudentField[];
}

export function Step3CustomFields({ fields }: Step3CustomFieldsProps) {
  const customFields = useStudentRegistrationMirror('customFields');
  const setCustomFieldValue = useStudentRegistrationMirror('setCustomFieldValue');
  const stepErrors = useStudentRegistrationMirror('stepErrors');

  const error = stepErrors[2];

  if (fields.length === 0) {
    return (
      <Stack gap="md">
        <Stack gap={2}>
          <Text size="md" fw={500}>
            الخطوة الثالثة: الحقول المخصصة والبيانات الإضافية
          </Text>
          <Text size="xs" c="dimmed">
            الحقول الإضافية الخاصة بمعهدك (مثل فصيلة الدم، المدرسة الصباحية، خط الباص...)
          </Text>
        </Stack>

        <Card radius="lg" withBorder p="xl" ta="center">
          <Stack align="center" gap="sm">
            <IconInfoCircle size={32} color="var(--mantine-color-primary-6)" />
            <Text size="sm" fw={500}>
              لا توجد حقول إضافية معرفة حاليا في نظام المعهد.
            </Text>
            <Text size="xs" c="dimmed" maw={450}>
              يمكنك متابعة التسجيل مباشرة بالضغط على &quot;التالي&quot;، أو إضافة حقول مخصصة جديدة من خلال صفحة
              &quot;الحقول المخصصة للطلاب&quot; في الإعدادات.
            </Text>
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Stack gap={2}>
        <Text size="md" fw={500}>
          الخطوة الثالثة: الحقول الإضافية الخاصة بالمعهد
        </Text>
        <Text size="xs" c="dimmed">
          يرجى تعبئة البيانات المخصصة المطلوبة من إدارة المعهد
        </Text>
      </Stack>

      {error && (
        <Alert icon={<IconAlertCircle size={16} />} color="red" radius="xl" variant="light">
          {error}
        </Alert>
      )}

      <Card radius="lg" withBorder p="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {fields.map((field) => {
            const currentValue = customFields[field.name] ?? '';

            if (field.type === 'SELECT') {
              const selectOptions = (field.options || []).map((opt) => ({
                value: opt,
                label: opt,
              }));
              return (
                <AppSelect
                  key={field.name}
                  label={field.label}
                  placeholder={`اختر ${field.label}`}
                  data={selectOptions}
                  value={currentValue ? String(currentValue) : null}
                  onChange={(val: string | null) => setCustomFieldValue(field.name, val)}
                  required={field.isRequired}
                  clearable
                />
              );
            }

            if (field.type === 'DATE') {
              return (
                <AppDatePicker
                  key={field.name}
                  label={field.label}
                  placeholder={`اختر ${field.label}`}
                  value={typeof currentValue === 'string' ? currentValue : ''}
                  onChange={(val: string | null) => setCustomFieldValue(field.name, val)}
                  required={field.isRequired}
                />
              );
            }

            if (field.type === 'BOOLEAN') {
              return (
                <AppSelect
                  key={field.name}
                  label={field.label}
                  data={[
                    { value: 'true', label: 'نعم' },
                    { value: 'false', label: 'لا' },
                  ]}
                  value={currentValue !== '' ? String(currentValue) : null}
                  onChange={(val: string | null) => setCustomFieldValue(field.name, val === 'true')}
                  required={field.isRequired}
                  clearable
                />
              );
            }

            return (
              <AppInput
                key={field.name}
                type={field.type === 'NUMBER' ? 'number' : 'text'}
                label={field.label}
                placeholder={`أدخل ${field.label}`}
                value={currentValue != null ? String(currentValue) : ''}
                onChange={(e) =>
                  setCustomFieldValue(
                    field.name,
                    inputText(e),
                  )
                }
                required={field.isRequired}
              />
            );
          })}
        </SimpleGrid>
      </Card>
    </Stack>
  );
}
