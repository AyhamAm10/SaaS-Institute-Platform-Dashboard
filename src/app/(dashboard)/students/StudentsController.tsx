'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import {
  Student,
  useDeleteStudentMutation,
  useFamiliesSearchQuery,
  useStudentDeletionReportQuery,
  useStudentFieldsQuery,
  useStudentsQuery,
  useUpdateStudentMutation,
} from '@/src/core/api';
import { useOperationalContext } from '@/src/core/context';
import { createStudentsStore, StudentsContext } from './store/students.store';
import { StudentsView } from './ui/StudentsView';
import {
  extractErrorMessage,
  toUpdateStudentPayload,
  validateStudentEditForm,
} from './utils/student-edit.utils';

type Store = ReturnType<typeof createStudentsStore>;

/**
 * QuerySync
 *
 * Bridges React Query data for students into the isolated Zustand store.
 * Strictly adheres to QuerySync pattern from Section 9 & 12 of role.md.
 */
function QuerySync({ store }: { store: Store }) {
  const { activeBranchId } = useOperationalContext();
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const { data: paginatedData, isLoading } = useStudentsQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    branchId: activeBranchId || undefined,
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
 * EditLookupsSync
 *
 * While the edit drawer is open, loads family search results and the
 * institute's custom student fields into the store.
 */
function EditLookupsSync({ store }: { store: Store }) {
  const opened = useStore(store, (s) => s.editDrawerOpened);
  const familySearch = useStore(store, (s) => s.familySearch);
  const syncEditLookups = useStore(store, (s) => s.syncEditLookups);

  const { data: families, isLoading: isLoadingFamilies } = useFamiliesSearchQuery(
    familySearch.trim() ? familySearch.trim() : undefined,
    opened,
  );
  const { data: fields } = useStudentFieldsQuery();

  useEffect(() => {
    syncEditLookups({
      families: families ?? [],
      isLoadingFamilies: opened && isLoadingFamilies,
      fields: (fields ?? []).filter((f) => f.isActive),
    });
  }, [opened, families, isLoadingFamilies, fields, syncEditLookups]);

  return null;
}

/**
 * DeletionReportSync
 *
 * Loads what is attached to the student selected for deletion into the store.
 */
function DeletionReportSync({ store }: { store: Store }) {
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

/**
 * StudentsController
 *
 * Root Controller Component for Students Management.
 * Owns isolated Zustand store per Section 3 & 9 of role.md.
 */
export function StudentsController() {
  const [store] = useState(() => createStudentsStore());
  const updateMutation = useUpdateStudentMutation();
  const deleteMutation = useDeleteStudentMutation();

  const handleSubmitEdit = useCallback(async () => {
    const { form, selectedStudent, studentFields } = store.getState();
    if (!selectedStudent) return;
    store.getState().setGeneralError(null);

    // ── Client-side validation ──
    const errors = validateStudentEditForm(form, studentFields);
    Object.entries(errors).forEach(([field, msg]) => store.getState().setFieldError(field, msg));
    if (Object.keys(errors).length > 0) return;

    store.getState().setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({
        id: selectedStudent.id,
        payload: toUpdateStudentPayload(form, selectedStudent),
      });
      store.getState().closeEditDrawer();
    } catch (err: unknown) {
      store
        .getState()
        .setGeneralError(extractErrorMessage(err, 'حدث خطأ أثناء حفظ بيانات الطالب'));
    } finally {
      store.getState().setIsSubmitting(false);
    }
  }, [store, updateMutation]);

  const handleConfirmDelete = useCallback(
    async (student: Student) => {
      store.getState().setDeleteError(null);
      store.getState().setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(student.id);
        store.getState().closeDeleteModal();
      } catch (err: unknown) {
        store.getState().setDeleteError(extractErrorMessage(err, 'حدث خطأ أثناء حذف الطالب'));
      } finally {
        store.getState().setIsDeleting(false);
      }
    },
    [store, deleteMutation],
  );

  return (
    <StudentsContext.Provider value={store}>
      <QuerySync store={store} />
      <EditLookupsSync store={store} />
      <DeletionReportSync store={store} />
      <StudentsView onSubmitEdit={handleSubmitEdit} onConfirmDelete={handleConfirmDelete} />
    </StudentsContext.Provider>
  );
}
