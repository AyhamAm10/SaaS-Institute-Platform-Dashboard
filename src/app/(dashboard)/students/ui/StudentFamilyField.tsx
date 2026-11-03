'use client';

import { Stack } from '@mantine/core';
import { AppInput, AppSelect } from '@/src/components/controllers';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { studentsLabels } from '../static-data/students.data';

/**
 * StudentFamilyField
 *
 * Moves the student to another family: a server-side search box feeding a select.
 * ZERO useState — reads useStudentsMirror.
 */
export function StudentFamilyField() {
  const form = useStudentsMirror('form');
  const formErrors = useStudentsMirror('formErrors');
  const setFormField = useStudentsMirror('setFormField');
  const familySearch = useStudentsMirror('familySearch');
  const setFamilySearch = useStudentsMirror('setFamilySearch');
  const familyOptions = useStudentsMirror('familyOptions');
  const isLoadingFamilies = useStudentsMirror('isLoadingFamilies');

  const options = familyOptions.map((family) => ({
    value: String(family.id),
    label: [
      `عائلة ${family.familyName}`,
      family.fatherName && `الأب: ${family.fatherName}`,
      family.phone,
    ]
      .filter(Boolean)
      .join(' — '),
  }));

  return (
    <Stack gap="md">
      <AppInput
        type="search"
        label={studentsLabels.fieldFamilySearch}
        placeholder={studentsLabels.fieldFamilySearchPlaceholder}
        value={familySearch}
        onChange={(val) => setFamilySearch(String(val ?? ''))}
      />
      <AppSelect
        label={studentsLabels.fieldFamily}
        data={options}
        value={form.familyId ? String(form.familyId) : null}
        onChange={(val: string | null) => setFormField('familyId', val ? Number(val) : null)}
        error={formErrors['familyId']}
        nothingFoundMessage={
          isLoadingFamilies ? studentsLabels.familiesLoading : studentsLabels.familiesEmpty
        }
        searchable
        required
      />
    </Stack>
  );
}
