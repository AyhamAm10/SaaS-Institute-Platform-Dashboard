'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';
import { useAccountsQuery, useAccountsSummaryQuery, useEligibleStudentsQuery } from '@/src/core/api';
import type { AccountsStore } from './store/accounts.store';
import { toQueryParams } from './utils/accounts.utils';

/** The ONLY place with the accounts queries: list, missing-families summary, eligible students. */
export function AccountsQuerySync({ store }: { store: AccountsStore }) {
  const type = useStore(store, (s) => s.type);
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const status = useStore(store, (s) => s.status);
  const studentDrawerOpened = useStore(store, (s) => s.studentDrawerOpened);
  const studentSearch = useStore(store, (s) => s.studentSearch);
  const { syncList, syncSummary, syncEligible } = store.getState();

  const list = useAccountsQuery(toQueryParams(type, page, limit, search, status));
  const summary = useAccountsSummaryQuery(type === 'families');
  const eligible = useEligibleStudentsQuery(studentSearch.trim() || undefined, studentDrawerOpened);

  useEffect(() => {
    syncList({
      data: list.data?.data ?? [],
      total: list.data?.total ?? 0,
      totalPages: list.data?.totalPages ?? 1,
      isLoading: list.isLoading,
    });
  }, [list.data, list.isLoading, syncList]);

  useEffect(() => syncSummary(summary.data ?? null), [summary.data, syncSummary]);
  useEffect(() => syncEligible(eligible.data ?? []), [eligible.data, syncEligible]);
  return null;
}
