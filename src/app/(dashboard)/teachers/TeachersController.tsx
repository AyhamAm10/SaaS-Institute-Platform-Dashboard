'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { useQueryClient } from '@tanstack/react-query';
import {
  Teacher,
  teachersKeys,
  useAssignTeacherQualificationMutation,
  useCreateTeacherMutation,
  useDeleteTeacherMutation,
  useRemoveTeacherQualificationMutation,
  useSetTeacherAvailabilitiesMutation,
  useTeachersQuery,
  useUpdateTeacherMutation,
  useResetTeacherPasswordMutation,
  getTeacherById,
  useOperationalContext,
  getApiErrorMessage,
} from '@/src/core/api';
import { useAuth, PERMISSIONS, passwordError } from '@/src/core/auth';
import {
  createTeachersStore,
  TeachersContext,
} from './store/teachers.store';
import { TeachersView } from './ui/TeachersView';

function QuerySync({
  store,
}: {
  store: ReturnType<typeof createTeachersStore>;
}) {
  const { activeBranchId } = useOperationalContext();
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);

  const { data: paginated, isLoading, isFetching } = useTeachersQuery({
    page,
    limit,
    search: search.trim() ? search.trim() : undefined,
    branchId: activeBranchId ?? undefined,
  });

  useEffect(() => {
    syncQueryData({
      data: paginated?.data ?? [],
      total: paginated?.total ?? 0,
      totalPages: paginated?.totalPages ?? 1,
      isLoading,
      isFetching,
    });
  }, [paginated, isLoading, isFetching, syncQueryData]);

  return null;
}

export function TeachersController() {
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.academicManage);
  const [store] = useState(() => createTeachersStore());
  const queryClient = useQueryClient();
  const { activeBranchId } = useOperationalContext();

  const createMutation = useCreateTeacherMutation();
  const updateMutation = useUpdateTeacherMutation();
  const deleteMutation = useDeleteTeacherMutation();
  const resetPasswordMutation = useResetTeacherPasswordMutation();
  const assignQualMutation = useAssignTeacherQualificationMutation();
  const removeQualMutation = useRemoveTeacherQualificationMutation();
  const setAvailMutation = useSetTeacherAvailabilitiesMutation();

  // Mini-form state for availability window inside details drawer
  const [newAvailDay, setNewAvailDay] = useState('0');
  const [newAvailStart, setNewAvailStart] = useState('08:00');
  const [newAvailEnd, setNewAvailEnd] = useState('14:00');

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: teachersKeys.all });
  }, [queryClient]);

  const handleAddAvailabilityWindow = useCallback(() => {
    if (!newAvailStart || !newAvailEnd) return;
    store.getState().addStagedAvailability({
      dayOfWeek: Number(newAvailDay),
      startTime: newAvailStart.trim(),
      endTime: newAvailEnd.trim(),
    });
  }, [store, newAvailDay, newAvailStart, newAvailEnd]);

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
        form.branchIds && form.branchIds.length > 0
          ? form.branchIds
          : activeBranchId
            ? [activeBranchId]
            : [];

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

  const handleAssignQualification = useCallback(
    async (academicBranchId: number, subjectId: number) => {
      const current = store.getState().selectedTeacherDetails;
      if (!current) return;

      store.getState().setIsAssigningQualification(true);
      try {
        await assignQualMutation.mutateAsync({
          teacherId: current.id,
          payload: { academicBranchId, subjectId },
        });
        // Refetch full details
        const updated = await getTeacherById(current.id);
        store.getState().setSelectedTeacherDetails(updated);
        store.getState().setNewSubjectId(undefined);
      } catch (err: unknown) {
        console.error('Failed to assign qualification', err);
      } finally {
        store.getState().setIsAssigningQualification(false);
      }
    },
    [store, assignQualMutation],
  );

  const handleRemoveQualification = useCallback(
    async (assignmentId: number) => {
      const current = store.getState().selectedTeacherDetails;
      if (!current) return;

      try {
        await removeQualMutation.mutateAsync({
          teacherId: current.id,
          assignmentId,
        });
        const updated = await getTeacherById(current.id);
        store.getState().setSelectedTeacherDetails(updated);
      } catch (err: unknown) {
        console.error('Failed to remove qualification', err);
      }
    },
    [store, removeQualMutation],
  );

  const handleSaveAvailabilities = useCallback(async () => {
    const current = store.getState().selectedTeacherDetails;
    if (!current) return;

    const staged = store.getState().stagedAvailabilities;
    store.getState().setIsSavingAvailabilities(true);
    try {
      await setAvailMutation.mutateAsync({
        teacherId: current.id,
        windows: staged,
      });
      const updated = await getTeacherById(current.id);
      store.getState().setSelectedTeacherDetails(updated);
    } catch (err: unknown) {
      console.error('Failed to save availabilities', err);
    } finally {
      store.getState().setIsSavingAvailabilities(false);
    }
  }, [store, setAvailMutation]);

  return (
    <TeachersContext.Provider value={store}>
      <QuerySync store={store} />
      <TeachersView
        access={{ canManage }}
        onRefresh={handleRefresh}
        onSubmit={handleSubmit}
        onConfirmDelete={handleConfirmDelete}
        onResetPassword={handleResetPassword}
        onAssignQualification={handleAssignQualification}
        onRemoveQualification={handleRemoveQualification}
        onSaveAvailabilities={handleSaveAvailabilities}
        newAvailDay={newAvailDay}
        setNewAvailDay={setNewAvailDay}
        newAvailStart={newAvailStart}
        setNewAvailStart={setNewAvailStart}
        newAvailEnd={newAvailEnd}
        setNewAvailEnd={setNewAvailEnd}
        onAddAvailabilityWindow={handleAddAvailabilityWindow}
      />
    </TeachersContext.Provider>
  );
}
