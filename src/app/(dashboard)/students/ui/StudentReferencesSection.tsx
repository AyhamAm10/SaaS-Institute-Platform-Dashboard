'use client';

import { useStudentsMirror, useStudentsMirrorSelector } from '../store/useStudentsMirror';
import { Divider, Stack } from '@mantine/core';
import { StudentReferenceFields } from './StudentReferenceFields';
import { StudentIdentityFields } from './StudentIdentityFields';

/**
 * StudentReferencesSection
 *
 * Reference-data links of the student being edited (status, city, school,
 * bus, referral source) and his official identity. ZERO useState hooks.
 */
export function StudentReferencesSection() {
  const references = useStudentsMirrorSelector((s) => s.form.references);
  const options = useStudentsMirror('referenceOptions');
  const setReference = useStudentsMirror('setReference');

  return (
    <Stack gap="md">
      <StudentReferenceFields values={references} options={options} onChange={setReference} />
      <Divider label="البيانات الرسمية (اختيارية)" labelPosition="center" />
      <StudentIdentityFields values={references} options={options} onSelect={setReference} onText={setReference} />
    </Stack>
  );
}
