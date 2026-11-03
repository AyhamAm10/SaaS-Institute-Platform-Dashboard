'use client';

import { SimpleGrid, Stack } from '@mantine/core';
import { AppDatePicker, AppInput, AppSelect } from '@/src/components/controllers';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { GENDER_OPTIONS, studentsLabels } from '../static-data/students.data';

/**
 * StudentBasicFields
 *
 * Name, gender and birth date of the student being edited.
 * ZERO useState — reads useStudentsMirror.
 */
export function StudentBasicFields() {
  const form = useStudentsMirror('form');
  const formErrors = useStudentsMirror('formErrors');
  const setFormField = useStudentsMirror('setFormField');

  return (
    <Stack gap="md">
      <AppInput
        label={studentsLabels.fieldFullName}
        value={form.fullName}
        onChange={(val) => setFormField('fullName', String(val ?? ''))}
        error={formErrors['fullName']}
        required
      />

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <AppSelect
          label={studentsLabels.fieldGender}
          data={GENDER_OPTIONS}
          value={form.gender}
          onChange={(val: string | null) =>
            setFormField('gender', val === 'FEMALE' ? 'FEMALE' : 'MALE')
          }
          required
        />

        <AppDatePicker
          label={studentsLabels.fieldBirthDate}
          value={form.birthDate}
          onChange={(val: string | null) => setFormField('birthDate', val)}
          error={formErrors['birthDate']}
          required
        />
      </SimpleGrid>
    </Stack>
  );
}
