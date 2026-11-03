'use client';

import { SimpleGrid, Text } from '@mantine/core';
import { AppDatePicker, AppInput, AppSelect } from '@/src/components/controllers';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { BOOLEAN_OPTIONS, studentsLabels } from '../static-data/students.data';

/**
 * StudentCustomFieldsEditor
 *
 * Renders the institute's custom student fields (TEXT / NUMBER / DATE / SELECT /
 * BOOLEAN) for editing. ZERO useState — reads useStudentsMirror.
 */
export function StudentCustomFieldsEditor() {
  const fields = useStudentsMirror('studentFields');
  const customFields = useStudentsMirror('form').customFields;
  const formErrors = useStudentsMirror('formErrors');
  const setCustomFieldValue = useStudentsMirror('setCustomFieldValue');

  if (fields.length === 0) {
    return (
      <Text size="xs" c="dimmed">
        {studentsLabels.customFieldsEmpty}
      </Text>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      {fields.map((field) => {
        const value = customFields[field.name];
        const error = formErrors[`custom.${field.name}`];

        if (field.type === 'SELECT') {
          return (
            <AppSelect
              key={field.name}
              label={field.label}
              data={(field.options ?? []).map((opt) => ({ value: opt, label: opt }))}
              value={value !== undefined && value !== null ? String(value) : null}
              onChange={(val: string | null) => setCustomFieldValue(field.name, val)}
              error={error}
              required={field.isRequired}
              clearable
            />
          );
        }

        if (field.type === 'BOOLEAN') {
          return (
            <AppSelect
              key={field.name}
              label={field.label}
              data={BOOLEAN_OPTIONS}
              value={typeof value === 'boolean' ? String(value) : null}
              onChange={(val: string | null) =>
                setCustomFieldValue(field.name, val === null ? null : val === 'true')
              }
              error={error}
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
              value={typeof value === 'string' ? value : null}
              onChange={(val: string | null) => setCustomFieldValue(field.name, val)}
              error={error}
              required={field.isRequired}
            />
          );
        }

        return (
          <AppInput
            key={field.name}
            type={field.type === 'NUMBER' ? 'number' : 'text'}
            label={field.label}
            value={value === undefined || value === null ? '' : String(value)}
            onChange={(val) => setCustomFieldValue(field.name, val ?? null)}
            error={error}
            required={field.isRequired}
          />
        );
      })}
    </SimpleGrid>
  );
}
