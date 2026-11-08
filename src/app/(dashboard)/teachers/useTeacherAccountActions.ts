'use client';

import { useCallback } from 'react';
import {
  getApiErrorMessage,
  Teacher,
  useCreateTeacherMutation,
  useDeleteTeacherMutation,
  useOperationalContext,
  useResetTeacherPasswordMutation,
  useUpdateTeacherMutation,
} from '@/src/core/api';
import { passwordError } from '@/src/core/auth';
import { TeachersStore } from './store/teachers.store';

/** Teacher create / edit, delete and password reset. Controller-level hook (role.md §3). */
export function useTeacherAccountActions(store: TeachersStore) {
  const { activeBranchId } = useOperationalContext();
  const createMutation = useCreateTeacherMutation();
  const updateMutation = useUpdateTeacherMutation();
  const deleteMutation = useDeleteTeacherMutation();
  const resetPasswordMutation = useResetTeacherPasswordMutation();

  const handleSubmit = useCallback(async () => {
    const { form, drawerMode, selectedTeacher } = store.getState();
    store.getState().setGeneralError(null);
    store.getState().setGeneralSuccess(null);

    let hasError = false;
    if (!form.fullName.trim()) {
      store.getState().setFieldError('fullName', 'يرجى إدخال اسم المعلم');
      hasError = true;
    }
    if (!form.phone.trim()) {
      store.getState().setFieldError('phone', 'يرجى إدخال رقم هاتف المعلم');
      hasError = true;
    }
    if (drawerMode === 'create') {
      const pErr = passwordError(form.password || '');
      if (pErr) {
        store.getState().setFieldError('password', pErr);
        hasError = true;
      }
    }

    if (hasError) return;

    store.getState().setIsSubmitting(true);
    try {
      const targetBranchIds =
        form.branchIds && form.branchIds.length > 0 ? form.branchIds : activeBranchId ? [activeBranchId] : [];

      if (drawerMode === 'edit' && selectedTeacher) {
        await updateMutation.mutateAsync({
          id: selectedTeacher.id,
          payload: {
            fullName: form.fullName.trim(),
            phone: form.phone.trim(),
            specialization: form.specialization?.trim() || undefined,
            branchIds: targetBranchIds,
            isActive: form.isActive,
          },
        });
      } else {
        await createMutation.mutateAsync({
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          password: form.password?.trim() || '',
          specialization: form.specialization?.trim() || undefined,
          branchIds: targetBranchIds,
        });
      }

      store.getState().closeDrawer();
      store.getState().resetForm();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'حدث خطأ أثناء حفظ بيانات المعلم');
      store.getState().setGeneralError(msg);
    } finally {
      store.getState().setIsSubmitting(false);
    }
  }, [store, createMutation, updateMutation, activeBranchId]);

  const handleConfirmDelete = useCallback(
    async (teacher: Teacher) => {
      store.getState().setDeleteError(null);
      store.getState().setIsDeleting(true);
      try {
        await deleteMutation.mutateAsync(teacher.id);
        store.getState().closeDeleteModal();
      } catch (err: unknown) {
        const msg = getApiErrorMessage(err, 'حدث خطأ أثناء حذف المعلم');
        store.getState().setDeleteError(msg);
      } finally {
        store.getState().setIsDeleting(false);
      }
    },
    [store, deleteMutation],
  );

  const handleResetPassword = useCallback(async () => {
    const { passwordTarget, newPassword } = store.getState();
    if (!passwordTarget) return;

    const pErr = passwordError(newPassword);
    if (pErr) {
      store.getState().setPasswordModalError(pErr);
      return;
    }

    store.getState().setPasswordModalError(null);
    store.getState().setIsPasswordSubmitting(true);
    try {
      await resetPasswordMutation.mutateAsync({
        id: passwordTarget.id,
        password: newPassword,
      });
      store.getState().closePasswordModal();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'تعذّر تغيير كلمة المرور');
      store.getState().setPasswordModalError(msg);
    } finally {
      store.getState().setIsPasswordSubmitting(false);
    }
  }, [store, resetPasswordMutation]);

  return { handleSubmit, handleConfirmDelete, handleResetPassword };
}
