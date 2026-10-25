'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  useAcademicBranchesQuery,
  useAcademicYearsQuery,
  useAssignSubjectToSectionMutation,
  useCreateAcademicBranchMutation,
  useCreateSectionMutation,
  useDeleteAcademicBranchMutation,
  useRemoveSubjectFromSectionMutation,
  useSectionDetailsQuery,
  useSectionSubjectsQuery,
  useSectionsQuery,
  useSubjectsQuery,
  useTeachersQuery,
  useUpdateSectionFeeMutation,
  useUpdateSectionMutation,
  useOperationalContext,
} from '@/src/core/api';
import { createSectionsStore, SectionsContext } from './store/sections.store';
import { SectionsView } from './ui/SectionsView';
import { useStore } from 'zustand';

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
function QuerySync({ store }: { store: ReturnType<typeof createSectionsStore> }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const selectedYearId = useStore(store, (s) => s.selectedYearId);
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

  const { activeBranchId } = useOperationalContext();

  // 1. Sections query (Main table list — always enabled)
  const { data: paginatedData, isLoading, isFetching } = useSectionsQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    academicYearId: selectedYearId ? Number(selectedYearId) : undefined,
    academicBranchId: selectedBranchId ? Number(selectedBranchId) : undefined,
    branchId: activeBranchId ?? undefined,
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
  const { data: yearsData } = useAcademicYearsQuery(
    { limit: 100 },
    { enabled: isYearsNeeded },
  );

  useEffect(() => {
    if (yearsData?.data) {
      syncAcademicYears(yearsData.data);
    }
  }, [yearsData, syncAcademicYears]);

  // 3. Academic Branches query (Lazy: only when section form, branch drawer, or filter is active)
  const isBranchesNeeded = formModalOpened || branchesModalOpened || filterOptionsRequested;
  const { data: branchesData } = useAcademicBranchesQuery(
    { limit: 100 },
    { enabled: isBranchesNeeded },
  );

  useEffect(() => {
    if (branchesData?.data) {
      syncAcademicBranches(branchesData.data);
    }
  }, [branchesData, syncAcademicBranches]);

  // 4. Section Details query (Lazy: only when details drawer is open)
  const { data: detailsData, isLoading: loadingDetails } = useSectionDetailsQuery(
    detailSectionId ?? 0,
    { enabled: drawerOpened && Boolean(detailSectionId) },
  );

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
  const { data: instituteSubjectsData } = useSubjectsQuery(
    { limit: 100 },
    { enabled: drawerOpened },
  );

  useEffect(() => {
    if (drawerOpened && instituteSubjectsData?.data) {
      syncInstituteSubjects(instituteSubjectsData.data);
    }
  }, [instituteSubjectsData, drawerOpened, syncInstituteSubjects]);

  // 7. Teachers query (Lazy: only when details drawer is open)
  const { data: teachersData } = useTeachersQuery(
    { limit: 100 },
    { enabled: drawerOpened },
  );

  useEffect(() => {
    if (drawerOpened && teachersData?.data) {
      syncTeachers(teachersData.data);
    }
  }, [teachersData, drawerOpened, syncTeachers]);

  return null;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object') {
    const responseData = (err as { response?: { data?: { message?: string | string[] } } })
      .response?.data?.message;
    if (responseData) {
      return Array.isArray(responseData) ? responseData.join(', ') : responseData;
    }
    const msg = (err as { message?: string }).message;
    if (msg) return msg;
  }
  return fallback;
}

/**
 * SectionsController
 *
 * Root entry point for the Sections page.
 * Owns the isolated Zustand store instance, lazy query synchronization,
 * and mutation orchestration. Strictly adheres to role.md.
 */
export function SectionsController() {
  const [store] = useState(() => createSectionsStore());
  const { activeBranchId, activeAcademicYearId } = useOperationalContext();

  // ── Mutations ──
  const createMutation = useCreateSectionMutation();
  const updateMutation = useUpdateSectionMutation();
  const updateFeeMutation = useUpdateSectionFeeMutation();
  const createBranchMutation = useCreateAcademicBranchMutation();
  const deleteBranchMutation = useDeleteAcademicBranchMutation();
  const assignSubjectMutation = useAssignSubjectToSectionMutation();
  const removeSubjectMutation = useRemoveSubjectFromSectionMutation();

  // ── Form Submit Handler (Section Create / Edit) ──
  const handleFormSubmit = useCallback(async () => {
    const { sectionForm, selectedSection } = store.getState();
    store.getState().setSectionFormError(null);

    const name = sectionForm.name.trim();
    if (!name) {
      store.getState().setSectionFormError('يرجى إدخال اسم الشعبة');
      return;
    }
    if (!sectionForm.academicBranchId) {
      store.getState().setSectionFormError('يرجى اختيار الفرع الأكاديمي');
      return;
    }
    const targetYearId = sectionForm.academicYearId || activeAcademicYearId;
    if (!selectedSection && !targetYearId) {
      store.getState().setSectionFormError('يرجى اختيار السنة الدراسية');
      return;
    }
    const numFee = Number(sectionForm.feeAmount);
    if (isNaN(numFee) || numFee < 0) {
      store.getState().setSectionFormError('يرجى إدخال مبلغ رسوم صحيح (أكبر من أو يساوي 0)');
      return;
    }

    store.getState().setFormSubmitting(true);
    try {
      if (selectedSection) {
        await updateMutation.mutateAsync({
          id: selectedSection.id,
          payload: {
            name,
            academicBranchId: Number(sectionForm.academicBranchId),
            feeAmount: numFee,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name,
          academicBranchId: Number(sectionForm.academicBranchId),
          academicYearId: targetYearId ? Number(targetYearId) : undefined,
          branchId: activeBranchId ?? undefined,
          feeAmount: numFee,
        });
      }
      store.getState().closeFormModal();
      store.getState().resetSectionForm();
    } catch (err: unknown) {
      store.getState().setSectionFormError(getErrorMessage(err, 'حدث خطأ أثناء حفظ الشعبة'));
    } finally {
      store.getState().setFormSubmitting(false);
    }
  }, [store, createMutation, updateMutation]);

  // ── Fee Submit Handler ──
  const handleFeeSubmit = useCallback(async () => {
    const { feeSection, feeFormAmount } = store.getState();
    if (!feeSection) return;
    store.getState().setFeeError(null);

    const numFee = Number(feeFormAmount);
    if (isNaN(numFee) || numFee < 0) {
      store.getState().setFeeError('يرجى إدخال مبلغ رسوم صالح (أكبر من أو يساوي 0)');
      return;
    }

    store.getState().setFeeSubmitting(true);
    try {
      await updateFeeMutation.mutateAsync({
        id: feeSection.id,
        payload: { feeAmount: numFee },
      });
      store.getState().closeFeeModal();
    } catch (err: unknown) {
      store.getState().setFeeError(getErrorMessage(err, 'حدث خطأ أثناء تعديل الرسوم'));
    } finally {
      store.getState().setFeeSubmitting(false);
    }
  }, [store, updateFeeMutation]);

  // ── Branch Create Handler ──
  const handleBranchCreate = useCallback(async () => {
    const { branchForm } = store.getState();
    store.getState().setBranchError(null);
    store.getState().setBranchSuccess(null);

    if (!branchForm.name.trim()) {
      store.getState().setBranchError('يرجى كتابة اسم الفرع الأكاديمي');
      return;
    }

    store.getState().setBranchSubmitting(true);
    try {
      await createBranchMutation.mutateAsync({
        name: branchForm.name.trim(),
        description: branchForm.description.trim() || undefined,
      });
      store.getState().resetBranchForm();
      store.getState().setBranchSuccess('تمت إضافة الفرع الأكاديمي بنجاح');
    } catch (err: unknown) {
      store.getState().setBranchError(getErrorMessage(err, 'حدث خطأ أثناء إنشاء الفرع الأكاديمي'));
    } finally {
      store.getState().setBranchSubmitting(false);
    }
  }, [store, createBranchMutation]);

  // ── Branch Delete Handler ──
  const handleBranchDelete = useCallback(
    async (branchId: number, branchName: string) => {
      store.getState().setBranchError(null);
      store.getState().setBranchSuccess(null);
      store.getState().setBranchSubmitting(true);
      try {
        await deleteBranchMutation.mutateAsync(branchId);
        store.getState().setBranchSuccess(`تم حذف الفرع الأكاديمي "${branchName}" بنجاح`);
      } catch (err: unknown) {
        store.getState().setBranchError(getErrorMessage(err, 'حدث خطأ أثناء حذف الفرع الأكاديمي'));
      } finally {
        store.getState().setBranchSubmitting(false);
      }
    },
    [store, deleteBranchMutation],
  );

  // ── Subject Assignment Handlers ──
  const handleAssignSubject = useCallback(
    async (
      sectionId: number,
      subjectId: number,
      weeklyPeriods?: number,
      teacherId?: number | null,
    ) => {
      store.getState().setAssignSubjectError(null);
      store.getState().setIsAssigningSubject(true);
      try {
        await assignSubjectMutation.mutateAsync({
          sectionId,
          payload: {
            subjectId,
            weeklyPeriods: weeklyPeriods ?? 2,
            teacherId: teacherId ?? undefined,
          },
        });
        store.getState().setAssignSubjectId(null);
      } catch (err: unknown) {
        store.getState().setAssignSubjectError(getErrorMessage(err, 'حدث خطأ أثناء إسناد المادة للشعبة'));
      } finally {
        store.getState().setIsAssigningSubject(false);
      }
    },
    [store, assignSubjectMutation],
  );

  const handleRemoveSubject = useCallback(
    async (sectionId: number, subjectId: number) => {
      store.getState().setAssignSubjectError(null);
      store.getState().setIsRemovingSubjectId(subjectId);
      try {
        await removeSubjectMutation.mutateAsync({
          sectionId,
          subjectId,
        });
      } catch (err: unknown) {
        store.getState().setAssignSubjectError(getErrorMessage(err, 'حدث خطأ أثناء إزالة المادة من الشعبة'));
      } finally {
        store.getState().setIsRemovingSubjectId(null);
      }
    },
    [store, removeSubjectMutation],
  );

  return (
    <SectionsContext.Provider value={store}>
      <QuerySync store={store} />
      <SectionsView
        onFormSubmit={handleFormSubmit}
        onFeeSubmit={handleFeeSubmit}
        onBranchCreate={handleBranchCreate}
        onBranchDelete={handleBranchDelete}
        onAssignSubject={handleAssignSubject}
        onRemoveSubject={handleRemoveSubject}
      />
    </SectionsContext.Provider>
  );
}
