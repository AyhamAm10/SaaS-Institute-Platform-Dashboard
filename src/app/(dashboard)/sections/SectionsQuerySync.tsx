'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';
import {
  useAcademicBranchesQuery,
  useAcademicYearsQuery,
  useDashboardOverviewQuery,
  useSectionDetailsQuery,
  useSectionSubjectsQuery,
  useSectionsQuery,
  useSubjectsQuery,
  useTeachersQuery,
} from '@/src/core/api';
import { SectionsStore } from './store/sections.store';

/** KPI / chart numbers of the page (role.md §12.1: no query in ui/). */
export function OverviewSync({ store }: { store: SectionsStore }) {
  const syncOverview = useStore(store, (s) => s.syncOverview);
  const { data } = useDashboardOverviewQuery();
  useEffect(() => {
    syncOverview(data ?? null);
  }, [data, syncOverview]);
  return null;
}

/**
 * QuerySync
 *
 * Internal component that bridges React Query data into the Zustand store.
 * Strictly enforces LAZY query execution:
 * - Sections query is enabled on page load.
 * - Auxiliary queries (years, branches, subjects, teachers, section details)
 *   are ONLY enabled when their respective modal or drawer is opened.
 * ZERO React Query hooks exist in the UI layer (role.md Section 12).
 */
export function QuerySync({ store }: { store: SectionsStore }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const selectedBranchId = useStore(store, (s) => s.selectedBranchId);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  // Modals / Drawers open flags
  const formModalOpened = useStore(store, (s) => s.formModalOpened);
  const branchesModalOpened = useStore(store, (s) => s.branchesModalOpened);
  const filterOptionsRequested = useStore(store, (s) => s.filterOptionsRequested);
  const drawerOpened = useStore(store, (s) => s.drawerOpened);
  const detailSectionId = useStore(store, (s) => s.detailSectionId);

  // Sync actions
  const syncAcademicYears = useStore(store, (s) => s.syncAcademicYears);
  const syncAcademicBranches = useStore(store, (s) => s.syncAcademicBranches);
  const syncSectionDetails = useStore(store, (s) => s.syncSectionDetails);
  const syncSectionSubjects = useStore(store, (s) => s.syncSectionSubjects);
  const syncInstituteSubjects = useStore(store, (s) => s.syncInstituteSubjects);
  const syncTeachers = useStore(store, (s) => s.syncTeachers);

  // 1. Sections query (Main table list — always enabled)
  const {
    data: paginatedData,
    isLoading,
    isFetching,
  } = useSectionsQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    academicBranchId: selectedBranchId ? Number(selectedBranchId) : undefined,
    // Branch / year: header context only (role.md dashboard §9.J)
  });

  useEffect(() => {
    syncQueryData({
      data: paginatedData?.data ?? [],
      total: paginatedData?.total ?? 0,
      totalPages: paginatedData?.totalPages ?? 1,
      isLoading,
      isFetching,
    });
  }, [paginatedData, isLoading, isFetching, syncQueryData]);

  // 2. Academic Years query (Lazy: only when section form or filter is active)
  const isYearsNeeded = formModalOpened || filterOptionsRequested;
  const { data: yearsData } = useAcademicYearsQuery({ limit: 100 }, { enabled: isYearsNeeded });

  useEffect(() => {
    if (yearsData?.data) {
      syncAcademicYears(yearsData.data);
    }
  }, [yearsData, syncAcademicYears]);

  // 3. Academic Branches query (Lazy: only when section form, branch drawer, or filter is active)
  const isBranchesNeeded = formModalOpened || branchesModalOpened || filterOptionsRequested;
  const { data: branchesData } = useAcademicBranchesQuery({ limit: 100 }, { enabled: isBranchesNeeded });

  useEffect(() => {
    if (branchesData?.data) {
      syncAcademicBranches(branchesData.data);
    }
  }, [branchesData, syncAcademicBranches]);

  // 4. Section Details query (Lazy: only when details drawer is open)
  const { data: detailsData, isLoading: loadingDetails } = useSectionDetailsQuery(detailSectionId ?? 0, {
    enabled: drawerOpened && Boolean(detailSectionId),
  });

  useEffect(() => {
    if (drawerOpened && detailSectionId) {
      syncSectionDetails(detailsData ?? null, loadingDetails);
    }
  }, [detailsData, loadingDetails, drawerOpened, detailSectionId, syncSectionDetails]);

  // 5. Section Subjects query (Lazy: only when details drawer is open)
  const { data: sectionSubjectsData, isLoading: loadingSectionSubjects } = useSectionSubjectsQuery(
    detailSectionId ?? 0,
    { enabled: drawerOpened && Boolean(detailSectionId) },
  );

  useEffect(() => {
    if (drawerOpened && detailSectionId) {
      syncSectionSubjects(sectionSubjectsData ?? [], loadingSectionSubjects);
    }
  }, [sectionSubjectsData, loadingSectionSubjects, drawerOpened, detailSectionId, syncSectionSubjects]);

  // 6. Institute Subjects query (Lazy: only when details drawer is open)
  const { data: instituteSubjectsData } = useSubjectsQuery({ limit: 100 }, { enabled: drawerOpened });

  useEffect(() => {
    if (drawerOpened && instituteSubjectsData?.data) {
      syncInstituteSubjects(instituteSubjectsData.data);
    }
  }, [instituteSubjectsData, drawerOpened, syncInstituteSubjects]);

  // 7. Teachers query (Lazy: only when details drawer is open)
  const { data: teachersData } = useTeachersQuery({ limit: 100 }, { enabled: drawerOpened });

  useEffect(() => {
    if (drawerOpened && teachersData?.data) {
      syncTeachers(teachersData.data);
    }
  }, [teachersData, drawerOpened, syncTeachers]);

  return null;
}
