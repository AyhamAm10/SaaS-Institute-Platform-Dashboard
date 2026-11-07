'use client';

import { useMemo } from 'react';
import { AppSelect } from '@/src/components/controllers';
import { useSectionsMirror } from '../store/useSectionsMirror';

/**
 * SectionsFilters
 *
 * Filter controls for the Sections page (academic branch). The academic
 * year is the header context, never a page filter (role.md §9.J).
 * Uses AppSelect adhering to the unified input standard.
 * Lazy fetches filter options on demand when dropdowns are opened/focused.
 * Pure presentation — reads state and actions from the mirror.
 */
export function SectionsFilters() {
  const academicBranches = useSectionsMirror('academicBranches');
  const selectedBranchId = useSectionsMirror('selectedBranchId');
  const setSelectedBranchId = useSectionsMirror('setSelectedBranchId');
  const requestFilterOptions = useSectionsMirror('requestFilterOptions');

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
