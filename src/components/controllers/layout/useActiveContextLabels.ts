'use client';

import { useAcademicYearsQuery, useBranchesQuery } from '@/src/core/api';
import { useOperationalContext } from '@/src/core/context';

/** Shown when no branch / year is active (never a made-up branch name). */
export const NO_BRANCH_LABEL = 'لم يُحدَّد فرع';
export const NO_YEAR_LABEL = 'لم تُحدَّد سنة';

/**
 * Names of the active branch and academic year: the ONE source for every
 * place that shows them (header pills, sidebar brand), so they never disagree.
 */
export function useActiveContextLabels(enabled = true): { branchName: string; yearName: string } {
  const { activeBranchId, activeAcademicYearId } = useOperationalContext();
  const { data: branches } = useBranchesQuery();
  const { data: years } = useAcademicYearsQuery({ limit: 50 }, { enabled });
  return {
    branchName: branches?.find((b) => b.id === activeBranchId)?.name ?? NO_BRANCH_LABEL,
    yearName: years?.data?.find((y) => y.id === activeAcademicYearId)?.name ?? NO_YEAR_LABEL,
  };
}
