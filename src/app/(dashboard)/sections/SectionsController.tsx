'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Section,
  useAcademicBranchesQuery,
  useAcademicYearsQuery,
  useAssignSubjectToSectionMutation,
  useCreateAcademicBranchMutation,
  useCreateSectionMutation,
  useDeleteAcademicBranchMutation,
  useRemoveSubjectFromSectionMutation,
  useSectionsQuery,
  useUpdateSectionFeeMutation,
  useUpdateSectionMutation,
} from '@/src/core/api';
import { createSectionsStore, SectionsContext } from './store/sections.store';
import { SectionsView } from './ui/SectionsView';
import { useStore } from 'zustand';

/**
 * QuerySync
 *
 * Internal component that bridges React Query data into the Zustand store.
 * Keeps the store in sync with server data without the UI layer
 * needing to know about React Query.
 */
function QuerySync({ store }: { store: ReturnType<typeof createSectionsStore> }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const selectedYearId = useStore(store, (s) => s.selectedYearId);
  const selectedBranchId = useStore(store, (s) => s.selectedBranchId);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);
  const syncAcademicYears = useStore(store, (s) => s.syncAcademicYears);
  const syncAcademicBranches = useStore(store, (s) => s.syncAcademicBranches);

  // ── Academic Years query (for filters & modal) ──
  const { data: yearsData } = useAcademicYearsQuery({ limit: 100 });

  useEffect(() => {
    syncAcademicYears(yearsData?.data ?? []);
  }, [yearsData, syncAcademicYears]);

  // ── Academic Branches query (for filters & modal) ──
  const { data: branchesData } = useAcademicBranchesQuery({ limit: 100 });

  useEffect(() => {
    syncAcademicBranches(branchesData?.data ?? []);
  }, [branchesData, syncAcademicBranches]);

  // ── Sections query ──
  const { data: paginatedData, isLoading, isFetching } = useSectionsQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    academicYearId: selectedYearId ? Number(selectedYearId) : undefined,
    academicBranchId: selectedBranchId ? Number(selectedBranchId) : undefined,
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

  return null;
}

/**
 * SectionsController
 *
 * Root entry point for the Sections page.
 * Owns the Zustand store instance, query synchronization, and mutation orchestration.
 * Strictly adheres to the Controller Component Pattern (role.md).
 */
export function SectionsController() {
  const [store] = useState(() => createSectionsStore());

  // ── Mutations ──
  const createMutation = useCreateSectionMutation();
  const updateMutation = useUpdateSectionMutation();
  const updateFeeMutation = useUpdateSectionFeeMutation();
  const createBranchMutation = useCreateAcademicBranchMutation();
  const deleteBranchMutation = useDeleteAcademicBranchMutation();
  const assignSubjectMutation = useAssignSubjectToSectionMutation();
  const removeSubjectMutation = useRemoveSubjectFromSectionMutation();

  // ── Form Submit Handler ──
  const handleFormSubmit = useCallback(
    async (formData: {
      name: string;
      academicBranchId: number;
      branchId: number;
      academicYearId: number;
      feeAmount: number;
    }) => {
      const selectedSection = store.getState().selectedSection;
      store.getState().setFormSubmitting(true);
      try {
        if (selectedSection) {
          await updateMutation.mutateAsync({
            id: selectedSection.id,
            payload: {
              name: formData.name,
              academicBranchId: formData.academicBranchId,
              feeAmount: formData.feeAmount,
            },
          });
        } else {
          await createMutation.mutateAsync(formData);
        }
        store.getState().closeFormModal();
      } finally {
        store.getState().setFormSubmitting(false);
      }
    },
    [store, createMutation, updateMutation],
  );

  // ── Fee Submit Handler ──
  const handleFeeSubmit = useCallback(
    async (feeAmount: number) => {
      const feeSection = store.getState().feeSection;
      if (!feeSection) return;
      store.getState().setFeeSubmitting(true);
      try {
        await updateFeeMutation.mutateAsync({
          id: feeSection.id,
          payload: { feeAmount },
        });
        store.getState().closeFeeModal();
      } finally {
        store.getState().setFeeSubmitting(false);
      }
    },
    [store, updateFeeMutation],
  );

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
        code: branchForm.code.trim() || undefined,
        description: branchForm.description.trim() || undefined,
      });
      store.getState().resetBranchForm();
      store.getState().setBranchSuccess('تمت إضافة الفرع الأكاديمي بنجاح');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'حدث خطأ أثناء إنشاء الفرع الأكاديمي';
      store.getState().setBranchError(Array.isArray(msg) ? msg.join(', ') : msg);
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
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'حدث خطأ أثناء حذف الفرع الأكاديمي';
        store.getState().setBranchError(Array.isArray(msg) ? msg.join(', ') : msg);
      } finally {
        store.getState().setBranchSubmitting(false);
      }
    },
    [store, deleteBranchMutation],
  );

  // ── Subject Assignment Handlers ──
  const handleAssignSubject = useCallback(
    async (sectionId: number, subjectId: number) => {
      store.getState().setAssignSubjectError(null);
      store.getState().setIsAssigningSubject(true);
      try {
        await assignSubjectMutation.mutateAsync({
          sectionId,
          payload: { subjectId },
        });
        store.getState().setAssignSubjectId(null);
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'حدث خطأ أثناء إسناد المادة للشُعبة';
        store
          .getState()
          .setAssignSubjectError(Array.isArray(msg) ? msg.join(', ') : msg);
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
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'حدث خطأ أثناء إزالة المادة من الشُعبة';
        store
          .getState()
          .setAssignSubjectError(Array.isArray(msg) ? msg.join(', ') : msg);
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
