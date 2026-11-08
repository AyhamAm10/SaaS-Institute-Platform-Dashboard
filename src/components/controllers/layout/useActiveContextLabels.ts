'use client';

import { useOperationalContextStore } from '@/src/core/context';

/** Shown when no branch / year is active (never a made-up branch name). */
export const NO_BRANCH_LABEL = 'لم يُحدَّد فرع';
export const NO_YEAR_LABEL = 'لم تُحدَّد سنة';

/**
 * Names of the active branch and academic year: the ONE source for every
 * place that shows them (header pills, sidebar brand), so they never
 * disagree. Reads the context store only (no query in ui/).
 */
export function useActiveContextLabels(): { branchName: string; yearName: string } {
  const branchName = useOperationalContextStore(
    (s) => s.branches.find((b) => b.id === s.activeBranchId)?.name ?? NO_BRANCH_LABEL,
  );
  const yearName = useOperationalContextStore(
    (s) => s.years.find((y) => y.id === s.activeAcademicYearId)?.name ?? NO_YEAR_LABEL,
  );
  return { branchName, yearName };
}
