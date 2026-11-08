'use client';

import { useCallback, useState } from 'react';
import { Student, useDeleteStudentMutation, useUpdateStudentMutation } from '@/src/core/api';
import { createStudentsStore, StudentsContext } from './store/students.store';
import { StudentsView } from './ui/StudentsView';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { extractErrorMessage, toUpdateStudentPayload, validateStudentEditForm } from './utils/student-edit.utils';
import {
  DeletionReportSync,
  EditLookupsSync,
  OverviewSync,
  QuerySync,
  ReferenceOptionsSync,
  StudentFieldsSync,
} from './StudentsQuerySync';

/**
 * StudentsController
 *
 * Root Controller Component for Students Management.
 * Owns isolated Zustand store per Section 3 & 9 of role.md.
 */
export function StudentsController() {
  const [store] = useState(() => createStudentsStore());
  const { can } = useAuth();
  // Buttons follow the role; the server enforces the same rules (role.md §8.6)
  const access = {
    canManage: can(PERMISSIONS.studentsManage),
    canSeeFees: can(PERMISSIONS.feesView),
  };
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
      store.getState().setGeneralError(extractErrorMessage(err, 'حدث خطأ أثناء حفظ بيانات الطالب'));
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
      <StudentFieldsSync store={store} />
      <EditLookupsSync store={store} />
      <ReferenceOptionsSync store={store} />
      <DeletionReportSync store={store} />
      <OverviewSync store={store} />
      <StudentsView access={access} onSubmitEdit={handleSubmitEdit} onConfirmDelete={handleConfirmDelete} />
    </StudentsContext.Provider>
  );
}
