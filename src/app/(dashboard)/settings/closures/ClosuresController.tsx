'use client';

import { useCallback, useEffect, useState } from 'react';
import { useStore } from 'zustand';
import {
  getApiErrorMessage,
  useBranchesQuery,
  useClosuresQuery,
  useCreateClosureMutation,
  useDeleteClosureMutation,
  useSectionsQuery,
  useUpdateClosureMutation,
} from '@/src/core/api';
import { useAuth } from '@/src/core/auth';
import { PERMISSIONS } from '@/src/core/auth';
import { localToday } from '../../attendance/utils/attendance.utils';
import { ClosuresContext, ClosuresStore, createClosuresStore } from './store/closures.store';
import { closureLabels as labels } from './static-data/closures.data';
import { toClosurePayload, validateClosureForm } from './utils/closures.utils';
import { ClosuresView } from './ui/ClosuresView';

/** Bridges closures, branches and the context sections (drawer options) into the store. */
function QuerySync({ store }: { store: ClosuresStore }) {
  const syncQueryData = useStore(store, (s) => s.syncQueryData);
  const { can, user } = useAuth();
  const { data, isLoading } = useClosuresQuery();
  const { data: branches } = useBranchesQuery();
  const { data: sections } = useSectionsQuery({ limit: 100 });
  const timeZone = user?.institute?.timezone ?? undefined;
  const canManage = can(PERMISSIONS.settingsManage);

  useEffect(() => {
    syncQueryData({ data: data ?? [], isLoading });
  }, [data, isLoading, syncQueryData]);
  useEffect(() => {
    syncQueryData({ branches: (branches ?? []).map((b) => ({ value: String(b.id), label: b.name })) });
  }, [branches, syncQueryData]);
  useEffect(() => {
    syncQueryData({ sections: (sections?.data ?? []).map((s) => ({ value: String(s.id), label: s.name })) });
  }, [sections, syncQueryData]);
  useEffect(() => {
    syncQueryData({ canManage, today: localToday(new Date(), timeZone) });
  }, [canManage, timeZone, syncQueryData]);
  return null;
}

/**
 * ClosuresController
 *
 * Closures (holidays) tab of the settings hub: days on which attendance is not
 * taken, for the whole institute, one branch or some sections. Absence and
 * lateness are not counted on those days. Owns its isolated store (role.md §3).
 */
export function ClosuresController({ hideHeader }: { hideHeader?: boolean } = {}) {
  const [store] = useState(createClosuresStore);
  const createMutation = useCreateClosureMutation();
  const updateMutation = useUpdateClosureMutation();
  const deleteMutation = useDeleteClosureMutation();

  const handleSubmit = useCallback(async () => {
    const { form, editing, setFormErrors, setGeneralError, setIsSubmitting, closeDrawer } = store.getState();
    const errors = validateClosureForm(form);
    if (Object.keys(errors).length > 0) return setFormErrors(errors);
    setGeneralError(null);
    setIsSubmitting(true);
    try {
      const payload = toClosurePayload(form);
      if (editing) await updateMutation.mutateAsync({ id: editing.id, payload });
      else await createMutation.mutateAsync(payload);
      closeDrawer();
    } catch (err: unknown) {
      setGeneralError(getApiErrorMessage(err, labels.saveError));
    } finally {
      setIsSubmitting(false);
    }
  }, [store, createMutation, updateMutation]);

  const handleDelete = useCallback(async () => {
    const { deleteTarget, setDeleteError, setIsDeleting, closeDelete } = store.getState();
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      closeDelete();
    } catch (err: unknown) {
      setDeleteError(getApiErrorMessage(err, labels.deleteError));
    } finally {
      setIsDeleting(false);
    }
  }, [store, deleteMutation]);

  return (
    <ClosuresContext.Provider value={store}>
      <QuerySync store={store} />
      <ClosuresView hideHeader={hideHeader} onSubmit={handleSubmit} onDelete={handleDelete} />
    </ClosuresContext.Provider>
  );
}
