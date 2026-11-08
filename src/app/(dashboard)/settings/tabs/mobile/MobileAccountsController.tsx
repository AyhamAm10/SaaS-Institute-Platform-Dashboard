'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStore } from 'zustand';
import { useEligibleStudentsQuery, useFamiliesSearchQuery, useMobileAccountsQuery } from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { createMobileAccountsStore, MobileAccountsContext, MobileAccountsStore } from './store/mobile-accounts.store';
import { useMobileAccountsActions } from './useMobileAccountsActions';
import { MobileAccountsView } from './ui/MobileAccountsView';

function QuerySync({ store }: { store: MobileAccountsStore }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const roleFilter = useStore(store, (s) => s.roleFilter);
  const syncData = useStore(store, (s) => s.syncData);

  const { data, isLoading } = useMobileAccountsQuery({
    page,
    limit,
    search: search.trim() || undefined,
    role: roleFilter ?? undefined,
  });

  useEffect(() => {
    syncData({
      data: data?.data ?? [],
      total: data?.total ?? 0,
      totalPages: data?.totalPages ?? 1,
      isLoading,
    });
  }, [data, isLoading, syncData]);

  return null;
}

export function MobileAccountsController() {
  const [store] = useState(createMobileAccountsStore);
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.studentsManage);

  const drawerOpened = useStore(store, (s) => s.drawerOpened);
  const drawerType = useStore(store, (s) => s.drawerType);

  const { data: families = [] } = useFamiliesSearchQuery('', drawerOpened && drawerType === 'FAMILY');
  const { data: eligibleStudents = [] } = useEligibleStudentsQuery('', drawerOpened && drawerType === 'STUDENT');

  const familiesData = useMemo(() => families.map((f) => ({ value: String(f.id), label: f.familyName })), [families]);
  const eligibleStudentsData = useMemo(
    () => eligibleStudents.map((s) => ({ value: String(s.id), label: s.fullName, suggestedPhone: s.suggestedPhone })),
    [eligibleStudents],
  );

  const { handleDrawerSubmit, handleResetPassword, handleDeactivate } = useMobileAccountsActions(store);

  return (
    <MobileAccountsContext.Provider value={store}>
      <QuerySync store={store} />
      <MobileAccountsView
        canManage={canManage}
        familiesData={familiesData}
        eligibleStudentsData={eligibleStudentsData}
        onSubmitDrawer={handleDrawerSubmit}
        onResetPassword={handleResetPassword}
        onDeactivate={handleDeactivate}
      />
    </MobileAccountsContext.Provider>
  );
}
