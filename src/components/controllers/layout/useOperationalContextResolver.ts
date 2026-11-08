'use client';

import { useEffect } from 'react';
import { useAcademicYearsQuery, useBranchesQuery, UserRole } from '@/src/core/api';
import { useAuth } from '@/src/core/auth';
import { useOperationalContextStore } from '@/src/core/context';

/**
 * Resolves the operational context once per signed-in account:
 * 1. binds the account (its own remembered branch / year);
 * 2. checks them against the institute lists (stale ids are replaced by the
 *    first branch and the current year);
 * 3. marks the context resolved, which unlocks the API headers and the pages.
 * The super admin has no operational context and resolves at once.
 */
export function useOperationalContextResolver(): void {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const identity = useOperationalContextStore((s) => s.identity);
  const resolved = useOperationalContextStore((s) => s.resolved);
  const branchId = useOperationalContextStore((s) => s.activeBranchId);
  const yearId = useOperationalContextStore((s) => s.activeAcademicYearId);
  const { bindIdentity, setActiveBranchId, setActiveAcademicYearId, markResolved } = useOperationalContextStore.getState();

  const lookupsEnabled = Boolean(identity) && !isSuperAdmin;
  const branches = useBranchesQuery();
  const years = useAcademicYearsQuery({ limit: 50 }, { enabled: lookupsEnabled });

  useEffect(() => {
    if (user) bindIdentity(user.instituteId, user.id);
  }, [user, bindIdentity]);

  // Lists for the header menus / labels (kept fresh after edits)
  useEffect(() => {
    useOperationalContextStore.getState().setLists(
      (branches.data ?? []).map((b) => ({ id: b.id, name: b.name })),
      (years.data?.data ?? []).map((y) => ({ id: y.id, name: y.name, isCurrent: y.isCurrent })),
    );
  }, [branches.data, years.data]);

  useEffect(() => {
    if (!identity || resolved) return;
    if (isSuperAdmin) return markResolved();
    if (!branches.isSuccess || !years.isSuccess) return;

    const branchList = branches.data ?? [];
    if (!branchList.some((b) => b.id === branchId)) setActiveBranchId(branchList[0]?.id ?? null);

    const yearList = years.data?.data ?? [];
    if (!yearList.some((y) => y.id === yearId)) {
      setActiveAcademicYearId((yearList.find((y) => y.isCurrent) ?? yearList[0])?.id ?? null);
    }
    markResolved();
  }, [identity, resolved, isSuperAdmin, branches.isSuccess, branches.data, years.isSuccess, years.data, branchId, yearId, setActiveBranchId, setActiveAcademicYearId, markResolved]);
}
