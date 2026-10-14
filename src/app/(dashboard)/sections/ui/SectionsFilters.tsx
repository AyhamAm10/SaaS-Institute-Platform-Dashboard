'use client';

import { useMemo } from 'react';
import { AppSelect } from '@/src/components/controllers';
import { useSectionsMirror } from '../store/useSectionsMirror';

/**
 * SectionsFilters
 *
 * Filter controls for the Sections page (year + academic branch dropdowns).
 * Uses AppSelect adhering to the unified input standard.
 * Lazy fetches filter options on demand when dropdowns are opened/focused.
 * Pure presentation — reads state and actions from the mirror.
 */
export function SectionsFilters() {
  const academicYears = useSectionsMirror('academicYears');
  const selectedYearId = useSectionsMirror('selectedYearId');
  const setSelectedYearId = useSectionsMirror('setSelectedYearId');
  const academicBranches = useSectionsMirror('academicBranches');
  const selectedBranchId = useSectionsMirror('selectedBranchId');
  const setSelectedBranchId = useSectionsMirror('setSelectedBranchId');
  const requestFilterOptions = useSectionsMirror('requestFilterOptions');

  const yearFilterOptions = useMemo(
    () =>
      academicYears.map((y) => ({
        value: String(y.id),
        label: y.name,
      })),
    [academicYears],
  );

  const branchFilterOptions = useMemo(
    () =>
      academicBranches.map((b) => ({
        value: String(b.id),
        label: b.name,
      })),
    [academicBranches],
  );

  return (
    <>
      <AppSelect
        placeholder="السنة الدراسية"
        data={yearFilterOptions}
        value={selectedYearId}
        onChange={(val: string | null) => setSelectedYearId(val)}
        onDropdownOpen={requestFilterOptions}
        onFocus={requestFilterOptions}
        clearable
        size="xs"
        style={{ width: 160 }}
      />
      <AppSelect
        placeholder="الفرع الأكاديمي"
        data={branchFilterOptions}
        value={selectedBranchId}
        onChange={(val: string | null) => setSelectedBranchId(val)}
        onDropdownOpen={requestFilterOptions}
        onFocus={requestFilterOptions}
        clearable
        searchable
        size="xs"
        style={{ width: 220 }}
      />
    </>
  );
}
