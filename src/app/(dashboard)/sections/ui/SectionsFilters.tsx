'use client';

import { useMemo } from 'react';
import { AppSelect } from '@/src/components/controllers';
import { useSectionsMirror } from '../store/useSectionsMirror';
import { defaultGradesList } from '../static-data/sections.data';

/**
 * SectionsFilters
 *
 * Filter controls for the Sections page (year + grade dropdowns).
 * Uses AppSelect adhering to the unified input standard.
 * Pure presentation — reads state and actions from the mirror.
 */
export function SectionsFilters() {
  const academicYears = useSectionsMirror('academicYears');
  const selectedYearId = useSectionsMirror('selectedYearId');
  const setSelectedYearId = useSectionsMirror('setSelectedYearId');
  const selectedGrade = useSectionsMirror('selectedGrade');
  const setSelectedGrade = useSectionsMirror('setSelectedGrade');

  const yearFilterOptions = useMemo(
    () =>
      academicYears.map((y) => ({
        value: String(y.id),
        label: y.name,
      })),
    [academicYears],
  );

  return (
    <>
      <AppSelect
        placeholder="السنة الدراسية"
        data={yearFilterOptions}
        value={selectedYearId}
        onChange={(val: any) => setSelectedYearId(val as string | null)}
        clearable
        size="xs"
        style={{ width: 160 }}
      />
      <AppSelect
        placeholder="المرحلة الدراسية"
        data={defaultGradesList}
        value={selectedGrade}
        onChange={(val: any) => setSelectedGrade(val as string | null)}
        clearable
        searchable
        size="xs"
        style={{ width: 180 }}
      />
    </>
  );
}
