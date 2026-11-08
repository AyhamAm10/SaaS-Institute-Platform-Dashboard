'use client';

import { useCallback } from 'react';
import {
  getApiErrorMessage as getErrorMessage,
  useAssignSubjectToSectionMutation,
  useCreateAcademicBranchMutation,
  useDeleteAcademicBranchMutation,
  useRemoveSubjectFromSectionMutation,
} from '@/src/core/api';
import { SectionsStore } from './store/sections.store';

/** Academic-branch and section-subject mutations. Controller-level hook (role.md §3). */
export function useSectionCatalogActions(store: SectionsStore) {
  const createBranchMutation = useCreateAcademicBranchMutation();
  const deleteBranchMutation = useDeleteAcademicBranchMutation();
  const assignSubjectMutation = useAssignSubjectToSectionMutation();
  const removeSubjectMutation = useRemoveSubjectFromSectionMutation();

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
    async (sectionId: number, subjectId: number, weeklyPeriods?: number, teacherId?: number | null) => {
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
        // Reset the whole assign form for the next subject
        store.getState().setAssignSubjectId(null);
        store.getState().setAssignTeacherId(null);
        store.getState().setAssignWeeklyPeriods(2);
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

  return { handleBranchCreate, handleBranchDelete, handleAssignSubject, handleRemoveSubject };
}
