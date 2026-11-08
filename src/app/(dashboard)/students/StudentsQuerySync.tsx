'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';
import {
  useDashboardOverviewQuery,
  useFamiliesSearchQuery,
  useStudentDeletionReportQuery,
  useStudentFieldsQuery,
  useStudentsQuery,
} from '@/src/core/api';
import { StudentsStore as Store } from './store/students.store';
import { useStudentReferenceOptions } from './utils/useStudentReferenceOptions';

/**
 * QuerySync
 *
 * Bridges React Query data for students into the isolated Zustand store.
 * Strictly adheres to QuerySync pattern from Section 9 & 12 of role.md.
 */
export function QuerySync({ store }: { store: Store }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const filters = useStore(store, (s) => s.filters);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const customFiltersJson =
    Object.keys(filters.customFilters || {}).length > 0
      ? JSON.stringify(filters.customFilters)
      : undefined;

  const { data: paginatedData, isLoading } = useStudentsQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    statusId: filters.statusId ?? undefined,
    busId: filters.busId ?? undefined,
    cityId: filters.cityId ?? undefined,
    schoolId: filters.schoolId ?? undefined,
    knowWayId: filters.knowWayId ?? undefined,
    customFilters: customFiltersJson,
    // Branch / year: header context; the column shows this year's enrollment
  });

  useEffect(() => {
    syncQueryData({
      data: paginatedData?.data ?? [],
      total: paginatedData?.total ?? 0,
      totalPages: paginatedData?.totalPages ?? 1,
      isLoading,
    });
  }, [paginatedData, isLoading, syncQueryData]);

  return null;
}

/**
 * StudentFieldsSync
 *
 * Keeps active custom fields synced in store for both list filters and edit drawer.
 */
export function StudentFieldsSync({ store }: { store: Store }) {
  const syncStudentFields = useStore(store, (s) => s.syncStudentFields);
  const { data: fields } = useStudentFieldsQuery();

  useEffect(() => {
    syncStudentFields((fields ?? []).filter((f) => f.isActive));
  }, [fields, syncStudentFields]);

  return null;
}

/**
 * EditLookupsSync
 *
 * While the edit drawer is open, loads family search results into the store.
 */
export function EditLookupsSync({ store }: { store: Store }) {
  const opened = useStore(store, (s) => s.editDrawerOpened);
  const familySearch = useStore(store, (s) => s.familySearch);
  const syncEditLookups = useStore(store, (s) => s.syncEditLookups);
  const studentFields = useStore(store, (s) => s.studentFields);

  const { data: families, isLoading: isLoadingFamilies } = useFamiliesSearchQuery(
    familySearch.trim() ? familySearch.trim() : undefined,
    opened,
  );

  useEffect(() => {
    syncEditLookups({
      families: families ?? [],
      isLoadingFamilies: opened && isLoadingFamilies,
      fields: studentFields,
    });
  }, [opened, families, isLoadingFamilies, studentFields, syncEditLookups]);

  return null;
}

/**
 * ReferenceOptionsSync
 *
 * Loads the reference tables (statuses, cities, schools, buses, know-ways)
 * used by the list filters and the edit drawer into the store.
 */
export function ReferenceOptionsSync({ store }: { store: Store }) {
  const syncReferenceOptions = useStore(store, (s) => s.syncReferenceOptions);
  const options = useStudentReferenceOptions();

  useEffect(() => {
    syncReferenceOptions(options);
  }, [options, syncReferenceOptions]);

  return null;
}

/** Real KPIs of the cards above the table (same numbers as the dashboard home). */
export function OverviewSync({ store }: { store: Store }) {
  const syncOverview = useStore(store, (s) => s.syncOverview);
  const { data } = useDashboardOverviewQuery();

  useEffect(() => {
    syncOverview(data ?? null);
  }, [data, syncOverview]);

  return null;
}

/**
 * DeletionReportSync
 *
 * Loads what is attached to the student selected for deletion into the store.
 */
export function DeletionReportSync({ store }: { store: Store }) {
  const studentId = useStore(store, (s) => s.studentToDelete?.id ?? null);
  const syncDeletionReport = useStore(store, (s) => s.syncDeletionReport);

  const { data, isLoading } = useStudentDeletionReportQuery(studentId);

  useEffect(() => {
    syncDeletionReport({
      report: studentId ? (data ?? null) : null,
      isLoading: Boolean(studentId) && isLoading,
    });
  }, [studentId, data, isLoading, syncDeletionReport]);

  return null;
}
