'use client';

import { useCallback } from 'react';
import {
  getApiErrorMessage,
  useCreateStaffMutation,
  useCreateStudentAccountMutation,
  useResetAccountPasswordMutation,
  useSetAccountActiveMutation,
  useSyncFamilyAccountsMutation,
  useUpdateStaffMutation,
} from '@/src/core/api';
import type { AccountsStore } from './store/accounts.store';
import { accountsLabels as labels } from './static-data/accounts.data';
import {
  toCreateStaffPayload,
  toStudentPayload,
  toUpdateStaffPayload,
  validateStaffForm,
  validateStudentForm,
} from './utils/accounts.utils';

/** Mutations of the accounts screen (controller-level hook, role.md §3). */
export function useAccountsActions(store: AccountsStore, currentUserId: number | null) {
  const createStaff = useCreateStaffMutation();
  const updateStaff = useUpdateStaffMutation();
  const createStudent = useCreateStudentAccountMutation();
  const reset = useResetAccountPasswordMutation();
  const setActive = useSetAccountActiveMutation();
  const sync = useSyncFamilyAccountsMutation();

  const submitStaff = useCallback(async () => {
    const s = store.getState();
    const errors = validateStaffForm(s.staffForm, !s.editingStaff);
    if (Object.keys(errors).length > 0) return s.setStaffErrors(errors);
    s.setStaffGeneralError(null);
    s.setIsStaffSubmitting(true);
    try {
      if (!s.editingStaff) await createStaff.mutateAsync(toCreateStaffPayload(s.staffForm));
      else {
        const payload = toUpdateStaffPayload(s.staffForm, s.editingStaff, s.editingStaff.id === currentUserId);
        if (Object.keys(payload).length > 0) await updateStaff.mutateAsync({ id: s.editingStaff.id, payload });
      }
      s.closeStaffDrawer();
    } catch (err: unknown) {
      s.setStaffGeneralError(getApiErrorMessage(err, labels.staffSaveError));
    } finally {
      s.setIsStaffSubmitting(false);
    }
  }, [store, createStaff, updateStaff, currentUserId]);

  const submitStudent = useCallback(async () => {
    const s = store.getState();
    const errors = validateStudentForm(s.studentForm);
    if (Object.keys(errors).length > 0) return s.setStudentErrors(errors);
    s.setStudentGeneralError(null);
    s.setIsStudentSubmitting(true);
    try {
      await createStudent.mutateAsync(toStudentPayload(s.studentForm));
      s.closeStudentDrawer();
    } catch (err: unknown) {
      s.setStudentGeneralError(getApiErrorMessage(err, labels.studentSaveError));
    } finally {
      s.setIsStudentSubmitting(false);
    }
  }, [store, createStudent]);

  /** Runs the confirmed reset / deactivate / activate of the target account. */
  const confirmModal = useCallback(async () => {
    const { modal, target, setModalError, setIsModalSubmitting, closeModal } = store.getState();
    if (!modal || !target) return;
    const fallback = { reset: labels.resetError, deactivate: labels.deactivateError, activate: labels.activateError }[modal];
    setIsModalSubmitting(true);
    try {
      if (modal === 'reset') await reset.mutateAsync(target.id);
      else await setActive.mutateAsync({ id: target.id, isActive: modal === 'activate' });
      closeModal();
    } catch (err: unknown) {
      setModalError(getApiErrorMessage(err, fallback));
    } finally {
      setIsModalSubmitting(false);
    }
  }, [store, reset, setActive]);

  const syncFamilies = useCallback(async () => {
    const s = store.getState();
    s.setIsSyncing(true);
    s.setSyncResult(null, null);
    try {
      s.setSyncResult(labels.syncDone(await sync.mutateAsync()), null);
    } catch (err: unknown) {
      s.setSyncResult(null, getApiErrorMessage(err, labels.syncError));
    } finally {
      s.setIsSyncing(false);
    }
  }, [store, sync]);

  return { submitStaff, submitStudent, confirmModal, syncFamilies };
}
