'use client';

import { useStudentsMirror, useStudentsMirrorSelector } from '../store/useStudentsMirror';
import { StudentReferenceFields } from './StudentReferenceFields';

/**
 * StudentReferencesSection
 *
 * Reference-data links of the student being edited (status, city, school,
 * bus, referral source). ZERO useState hooks.
 */
export function StudentReferencesSection() {
  const references = useStudentsMirrorSelector((s) => s.form.references);
  const options = useStudentsMirror('referenceOptions');
  const setReference = useStudentsMirror('setReference');

  return <StudentReferenceFields values={references} options={options} onChange={setReference} />;
}
