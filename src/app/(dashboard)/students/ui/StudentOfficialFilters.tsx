'use client';

import { AppSelect } from '@/src/components/controllers';
import { useStudentsMirror } from '../store/useStudentsMirror';
import type { StudentListFilters } from '../state/students.state';

const toValue = (id: number | null) => (id ? String(id) : null);

const GENDERS = [
  { value: 'MALE', label: 'ذكور' },
  { value: 'FEMALE', label: 'إناث' },
];
const CANDIDACY = [
  { value: 'true', label: 'المتقدمون للامتحان' },
  { value: 'false', label: 'غير المتقدمين' },
];

/**
 * StudentOfficialFilters
 *
 * Filters on the official data: nationality, religion, language, gender, and this
 * year's situation and exam candidacy. ZERO useState hooks.
 */
export function StudentOfficialFilters() {
  const filters = useStudentsMirror('filters');
  const options = useStudentsMirror('referenceOptions');
  const setFilter = useStudentsMirror('setFilter');

  const lists: { field: keyof StudentListFilters; placeholder: string; data: { value: string; label: string }[] }[] = [
    { field: 'situationId', placeholder: 'وضع الطالب', data: options.situations },
    { field: 'nationalityId', placeholder: 'الجنسية', data: options.nationalities },
    { field: 'religionId', placeholder: 'الديانة', data: options.religions },
    { field: 'languageId', placeholder: 'اللغة', data: options.languages },
  ];

  return (
    <>
      {lists.map(({ field, placeholder, data }) => (
        <AppSelect
          key={field}
          placeholder={placeholder}
          data={data}
          value={toValue(filters[field] as number | null)}
          onChange={(val: string | null) => setFilter(field, (val ? Number(val) : null) as never)}
          clearable
          size="sm"
          w={140}
        />
      ))}
      <AppSelect
        placeholder="الجنس"
        data={GENDERS}
        value={filters.gender}
        onChange={(val: string | null) => setFilter('gender', val as StudentListFilters['gender'])}
        clearable
        size="sm"
        w={110}
      />
      <AppSelect
        placeholder="الترشح للامتحان"
        data={CANDIDACY}
        value={filters.examCandidate === null ? null : String(filters.examCandidate)}
        onChange={(val: string | null) => setFilter('examCandidate', val === null ? null : val === 'true')}
        clearable
        size="sm"
        w={200}
      />
    </>
  );
}
