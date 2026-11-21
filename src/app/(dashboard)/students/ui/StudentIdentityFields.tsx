'use client';

import { SimpleGrid } from '@mantine/core';
import { AppInput, AppSelect } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import type {
  StudentIdentityField,
  StudentReferenceField,
  StudentReferenceOptions,
  StudentReferenceValues,
} from '../utils/student-references.utils';

export interface StudentIdentityFieldsProps {
  values: StudentReferenceValues;
  options: StudentReferenceOptions;
  onSelect: (field: StudentReferenceField, value: number | null) => void;
  onText: (field: StudentIdentityField, value: string) => void;
}

const toValue = (id: number | null) => (id ? String(id) : null);
const toId = (val: string | null) => (val ? Number(val) : null);

const TEXTS: { field: StudentIdentityField; label: string; placeholder: string }[] = [
  { field: 'nationalId', label: 'الرقم الوطني', placeholder: '11 رقماً' },
  { field: 'birthPlace', label: 'مكان الولادة', placeholder: 'مثال: دمشق' },
  { field: 'civilRegistry', label: 'محل ورقم القيد', placeholder: 'مثال: المزة 123' },
  { field: 'grandfatherName', label: 'اسم الجد', placeholder: '' },
  { field: 'foreignName', label: 'الاسم بالأحرف الأجنبية', placeholder: 'مثال: Yazan Al-Khatib' },
  { field: 'address', label: 'العنوان الدائم', placeholder: 'المدينة - الحي - الشارع' },
];

/**
 * StudentIdentityFields
 *
 * The official identity of a student (nationality, religion, foreign language and the
 * civil data the official lists and forms need). Every field is optional. Shared by the
 * registration wizard and the edit drawer; fully controlled (no state).
 */
export function StudentIdentityFields({ values, options, onSelect, onText }: StudentIdentityFieldsProps) {
  const lists: { field: StudentReferenceField; label: string; data: StudentReferenceOptions['languages'] }[] = [
    { field: 'nationalityId', label: 'الجنسية', data: options.nationalities },
    { field: 'religionId', label: 'الديانة', data: options.religions },
    { field: 'languageId', label: 'اللغة الأجنبية', data: options.languages },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
      {lists.map(({ field, label, data }) => (
        <AppSelect
          key={field}
          label={label}
          placeholder="اختر..."
          data={data}
          value={toValue(values[field])}
          onChange={(val: string | null) => onSelect(field, toId(val))}
          clearable
        />
      ))}
      {TEXTS.map(({ field, label, placeholder }) => (
        <AppInput
          key={field}
          label={label}
          placeholder={placeholder}
          value={values[field]}
          onChange={(e: unknown) => onText(field, inputText(e))}
        />
      ))}
    </SimpleGrid>
  );
}
