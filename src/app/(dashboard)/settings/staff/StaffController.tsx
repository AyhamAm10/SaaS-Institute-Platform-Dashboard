'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import {
  getApiErrorMessage,
  useCreateStaffMutation,
  useDeactivateStaffMutation,
  useResetStaffPasswordMutation,
  useStaffQuery,
  useUpdateStaffMutation,
} from '@/src/core/api';
import { useAuth } from '@/src/core/auth';
import { createStaffStore, StaffContext, StaffStore } from './store/staff.store';
import { passwordError, toCreateStaffPayload, toUpdateStaffPayload, validateStaffForm } from './utils/staff.utils';
import { staffLabels as labels } from './static-data/staff.data';
import { StaffView } from './ui/StaffView';

/** Bridges the filtered staff query into the store. */
function QuerySync({ store }: { store: StaffStore }) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const role = useStore(store, (s) => s.roleFilter);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);
  const { data, isLoading } = useStaffQuery({ page, limit, search: search.trim() || undefined, role: role ?? undefined });

  useEffect(() => {
    syncQueryData({ data: data?.data ?? [], total: data?.total ?? 0, totalPages: data?.totalPages ?? 1, isLoading });
  }, [data, isLoading, syncQueryData]);
  return null;
}

/**
 * StaffController
 *
 * Staff page (D2): institute admins manage the staff accounts and their
 * role (admin / registrar / accountant), reset passwords and deactivate.
 * The server guards self changes and the last admin. Owns its isolated store (role.md §3).
 */
export function StaffController() {
  const [store] = useState(createStaffStore);
  const currentUserId = useAuth().user?.id ?? null;
  const createMutation = useCreateStaffMutation();
  const updateMutation = useUpdateStaffMutation();
  const resetMutation = useResetStaffPasswordMutation();
  const deactivateMutation = useDeactivateStaffMutation();

  const handleSubmit = useCallback(async () => {
    const { form, editing, setFormErrors, setGeneralError, setIsSubmitting, closeDrawer } = store.getState();
    const errors = validateStaffForm(form, !editing);
    if (Object.keys(errors).length > 0) return setFormErrors(errors);
    setGeneralError(null);
    setIsSubmitting(true);
    try {
      if (!editing) await createMutation.mutateAsync(toCreateStaffPayload(form));
      else {
        const payload = toUpdateStaffPayload(form, editing, editing.id === currentUserId);
        if (Object.keys(payload).length > 0) await updateMutation.mutateAsync({ id: editing.id, payload });
      }
      closeDrawer();
    } catch (err: unknown) {
      setGeneralError(getApiErrorMessage(err, labels.saveError));
    } finally {
      setIsSubmitting(false);
    }
  }, [store, createMutation, updateMutation, currentUserId]);

  /** Runs a modal action with its loading / error state, closing on success. */
  const runModal = useCallback(
    async (action: (id: number, password: string) => Promise<unknown>, fallback: string) => {
      const { target, newPassword, setModalError, setIsModalSubmitting, closeModal } = store.getState();
      if (!target) return;
      setIsModalSubmitting(true);
      try {
        await action(target.id, newPassword);
        closeModal();
      } catch (err: unknown) {
        setModalError(getApiErrorMessage(err, fallback));
      } finally {
        setIsModalSubmitting(false);
      }
    },
    [store],
  );

  const handleResetPassword = useCallback(async () => {
    const invalid = passwordError(store.getState().newPassword);
    if (invalid) return store.getState().setModalError(invalid);
    await runModal((id, password) => resetMutation.mutateAsync({ id, password }), labels.passwordError);
  }, [store, runModal, resetMutation]);

  const handleDeactivate = useCallback(
    () => runModal((id) => deactivateMutation.mutateAsync(id), labels.deactivateError),
    [runModal, deactivateMutation],
  );

  return (
    <StaffContext.Provider value={store}>
      <QuerySync store={store} />
      <StaffView
        onSubmit={handleSubmit}
        onResetPassword={handleResetPassword}
        onDeactivate={handleDeactivate}
        currentUserId={currentUserId}
      />
    </StaffContext.Provider>
  );
}
