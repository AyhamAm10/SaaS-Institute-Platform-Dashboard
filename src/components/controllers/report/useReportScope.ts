'use client';

import { useMemo } from 'react';
import { useOperationalContextStore } from '@/src/core/context';
import type { ReportScopeItem } from './init/report.init';

/** Active branch and academic year (header context) as cover lines. */
export function useReportScope(): ReportScopeItem[] {
  const branches = useOperationalContextStore((s) => s.branches);
  const years = useOperationalContextStore((s) => s.years);
  const branchId = useOperationalContextStore((s) => s.activeBranchId);
  const yearId = useOperationalContextStore((s) => s.activeAcademicYearId);
  return useMemo(() => {
    const items: ReportScopeItem[] = [];
    const branch = branches.find((b) => b.id === branchId);
    const year = years.find((y) => y.id === yearId);
    if (branch) items.push({ label: 'الفرع', value: branch.name });
    if (year) items.push({ label: 'السنة الدراسية', value: year.name });
    return items;
  }, [branches, years, branchId, yearId]);
}
