'use client';

import { useCallback, useMemo, useState } from 'react';
import { useStore } from 'zustand';
import {
  getApiErrorMessage,
  useCreateExamMutation,
  useDeleteExamMutation,
  useUpdateExamMutation,
} from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { createExamsStore, ExamsContext } from './store/exams.store';
import { toExamPayload, toUpdateExamPayload, validateExamForm } from './utils/exams.utils';
import { examsLabels as labels } from './static-data/exams.data';
import { ExamsView } from './ui/ExamsView';
import { OptionsSync, OverviewSync, QuerySync, SubjectsSync } from './ExamsQuerySync';

/**
 * ExamsController
 *
 * Exams page (E9): filtered list, create / edit drawer, delete (with
 * confirmation when the exam has marks). Owns its isolated store (role.md §3).
 */
export function ExamsController() {
  const [store] = useState(createExamsStore);
  const drawerOpened = useStore(store, (s) => s.drawerOpened);
  const createMutation = useCreateExamMutation();
  const updateMutation = useUpdateExamMutation();
  const deleteMutation = useDeleteExamMutation();
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.examsManage);
  const canEnterMarks = can(PERMISSIONS.marksEnter);
  const access = useMemo(() => ({ canManage, canEnterMarks }), [canManage, canEnterMarks]);

  const handleSubmit = useCallback(async () => {
    const { form, editing, setFormErrors, setGeneralError, setIsSubmitting, closeDrawer } = store.getState();
    const errors = validateExamForm(form, !editing);
    if (Object.keys(errors).length > 0) return setFormErrors(errors);
    setGeneralError(null);
    setIsSubmitting(true);
    try {
      if (editing)
        await updateMutation.mutateAsync({
          id: editing.id,
          payload: toUpdateExamPayload(form),
        });
      else await createMutation.mutateAsync(toExamPayload(form));
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
      // The modal already warned about the marks, so the deletion is confirmed
      await deleteMutation.mutateAsync({
        id: deleteTarget.id,
        force: deleteTarget._count.results > 0,
      });
      closeDelete();
    } catch (err: unknown) {
      setDeleteError(getApiErrorMessage(err, labels.deleteError));
    } finally {
      setIsDeleting(false);
    }
  }, [store, deleteMutation]);

  return (
    <ExamsContext.Provider value={store}>
      <OverviewSync store={store} />
      <QuerySync store={store} />
      <OptionsSync store={store} />
      {drawerOpened && <SubjectsSync store={store} />}
      <ExamsView onSubmit={handleSubmit} onConfirmDelete={handleDelete} access={access} />
    </ExamsContext.Provider>
  );
}
