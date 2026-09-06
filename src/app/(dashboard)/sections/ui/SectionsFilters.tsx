'use client';

import { useMemo } from 'react';
import { Select } from '@mantine/core';
import { useSectionsMirror } from '../store/useSectionsMirror';
import { defaultGradesList } from '../static-data/sections.data';

/**
 * SectionsFilters
 *
 * Filter controls for the Sections page (year + grade dropdowns).
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
      <Select
        placeholder="السنة الدراسية"
        data={yearFilterOptions}
        value={selectedYearId}
        onChange={setSelectedYearId}
        clearable
        radius="xl"
        size="xs"
        style={{ width: 160 }}
      />
      <Select
        placeholder="المرحلة الدراسية"
        data={defaultGradesList}
        value={selectedGrade}
        onChange={setSelectedGrade}
        clearable
        searchable
        radius="xl"
        size="xs"
        style={{ width: 180 }}
      />
    </>
  );
}
