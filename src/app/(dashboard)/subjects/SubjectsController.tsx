'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useQueryClient } from '@tanstack/react-query';
import {
  Subject,
  subjectsKeys,
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  useSubjectsQuery,
  useUpdateSubjectMutation,
} from '@/src/core/api';
import {
  createSubjectsStore,
  SubjectsContext,
} from './store/subjects.store';
import { SubjectsView } from './ui/SubjectsView';

/**
 * QuerySync
 *
 * Bridges React Query data into the Zustand store.
 * Synchronizes server data into the isolated store without UI layer knowing about React Query.
 */
function QuerySync({
  store,
}: {
  store: ReturnType<typeof createSubjectsStore>;
}) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const { data: paginatedData, isLoading, isFetching } = useSubjectsQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
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
 * SubjectsController
 *
 * Controller orchestrator for Subjects module.
 * Owns the Zustand store instance, query synchronization, and mutation orchestration.
 * Strictly adheres to role.md.
 */
export function SubjectsController() {
  const [store] = useState(() => createSubjectsStore());
  const queryClient = useQueryClient();
  const createMutation = useCreateSubjectMutation();
  const updateMutation = useUpdateSubjectMutation();
  const deleteMutation = useDeleteSubjectMutation();

  const handleRefetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: subjectsKeys.all });
  }, [queryClient]);

  const handleSubmit = useCallback(async () => {
    const { form, drawerMode, selectedSubject } = store.getState();
    store.getState().setGeneralError(null);
    store.getState().setGeneralSuccess(null);

    // ── Client-side validation ──
    let hasError = false;

    if (!form.name.trim()) {
      store.getState().setFieldError('name', 'يرجى إدخال اسم المادة الدراسية');
      hasError = true;
    }

    if (!form.code.trim()) {
      store.getState().setFieldError('code', 'يرجى إدخال الرمز الكودي للمادة');
      hasError = true;
    }

    if (hasError) return;

    store.getState().setIsSubmitting(true);
    try {
      if (drawerMode === 'edit' && selectedSubject) {
        await updateMutation.mutateAsync({
          id: selectedSubject.id,
          payload: {
            name: form.name.trim(),
            code: form.code.trim(),
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: form.name.trim(),
          code: form.code.trim(),
        });
      }

      store.getState().closeDrawer();
      store.getState().resetForm();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'حدث خطأ أثناء حفظ بيانات المادة الدراسية';
      store.getState().setGeneralError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      store.getState().setIsSubmitting(false);
    }
  }, [store, createMutation, updateMutation]);

  const handleConfirmDelete = useCallback(
    async (subject: Subject) => {
      store.getState().setDeleteError(null);
      store.getState().setIsDeleting(true);

      try {
        await deleteMutation.mutateAsync(subject.id);
        store.getState().closeDeleteModal();
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'حدث خطأ أثناء حذف المادة الدراسية';
        store.getState().setDeleteError(Array.isArray(msg) ? msg.join(', ') : msg);
      } finally {
        store.getState().setIsDeleting(false);
      }
    },
    [store, deleteMutation],
  );

  return (
    <SubjectsContext.Provider value={store}>
      <QuerySync store={store} />
      <SubjectsView
        onRefresh={handleRefetch}
        onSubmit={handleSubmit}
        onConfirmDelete={handleConfirmDelete}
      />
    </SubjectsContext.Provider>
  );
}
