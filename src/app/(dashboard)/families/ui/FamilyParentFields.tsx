'use client';

import { SimpleGrid } from '@mantine/core';
import { AppInput } from '@/src/components/controllers/input';
import { inputText } from '@/src/core/format';
import type { ParentDetails } from '../utils/parent-details';

export interface FamilyParentFieldsProps {
  values: ParentDetails;
  onChange: (field: keyof ParentDetails, value: string) => void;
}

const FIELDS: { field: keyof ParentDetails; label: string; type?: 'tel' }[] = [
  { field: 'fatherJob', label: 'عمل الأب' },
  { field: 'motherJob', label: 'عمل الأم' },
  { field: 'fatherPhone', label: 'جوال الأب', type: 'tel' },
  { field: 'motherPhone', label: 'جوال الأم', type: 'tel' },
];

/**
 * FamilyParentFields
 *
 * The parents' jobs and own mobiles (optional). Shared by the family drawer and the
 * registration wizard; fully controlled (no state). The family phone above stays the
 * number of the guardian's app account.
 */
export function FamilyParentFields({ values, onChange }: FamilyParentFieldsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      {FIELDS.map(({ field, label, type }) => (
        <AppInput
          key={field}
          type={type}
          label={label}
          placeholder={type === 'tel' ? '09xxxxxxxx' : ''}
          value={values[field]}
          onChange={(e: unknown) => onChange(field, inputText(e))}
        />
      ))}
    </SimpleGrid>
  );
}
