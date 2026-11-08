'use client';

import { Divider, SimpleGrid, Stack } from '@mantine/core';
import { AppDatePicker, AppInput, AppSelect } from '@/src/components/controllers';
import { StudentField } from '@/src/core/api';
import { inputText } from '@/src/core/format';
import { useStudentRegistrationMirror } from '../store/useStudentRegistrationMirror';

/** The institute's own student fields, one input per field type. */
export function Step2CustomFields({ fields }: { fields: StudentField[] }) {
  const customFields = useStudentRegistrationMirror('customFields');
  const setCustomFieldValue = useStudentRegistrationMirror('setCustomFieldValue');
  if (fields.length === 0) return null;

  return (
    <Stack gap="lg" mt="xs">
      <Divider my="md" label="الحقول والبيانات الإضافية الخاصة بالمعهد" labelPosition="center" />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
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
                value={currentValue === true ? 'true' : currentValue === false ? 'false' : null}
                onChange={(val: string | null) =>
                  setCustomFieldValue(field.name, val === 'true' ? true : val === 'false' ? false : null)
                }
                placeholder={`اختر ${field.label}`}
                required={field.isRequired}
                clearable
              />
            );
          }

          if (field.type === 'NUMBER') {
            return (
              <AppInput
                key={field.name}
                type="number"
                label={field.label}
                placeholder={`أدخل ${field.label}`}
                value={currentValue != null ? String(currentValue) : ''}
                onChange={(e) => setCustomFieldValue(field.name, inputText(e) === '' ? null : Number(inputText(e)))}
                required={field.isRequired}
              />
            );
          }

          return (
            <AppInput
              key={field.name}
              label={field.label}
              placeholder={`أدخل ${field.label}`}
              value={currentValue != null ? String(currentValue) : ''}
              onChange={(e) => setCustomFieldValue(field.name, inputText(e))}
              required={field.isRequired}
            />
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
