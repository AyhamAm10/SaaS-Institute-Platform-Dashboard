'use client';

import { useCallback, useMemo, useState } from 'react';
import { useStore } from 'zustand';
import {
  getApiErrorMessage,
  UserRole,
  useCreateExamMutation,
  useDeleteExamMutation,
  useSetExamSupervisorsMutation,
  useUpdateExamMutation,
} from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { createExamsStore, ExamsContext } from './store/exams.store';
import { toExamPayload, toUpdateExamPayload, validateExamForm } from './utils/exams.utils';
import { mustSaveSupervisors, supervisorIdsToSave } from './utils/exam-supervision.utils';
import { examsLabels as labels } from './static-data/exams.data';
import { ExamsView } from './ui/ExamsView';
import { OptionsSync, OverviewSync, QuerySync, SubjectsSync, SupervisorsSync } from './ExamsQuerySync';

/**
 * ExamsController
 *
 * Exams page (E9): filtered list, create / edit drawer, delete (with
 * confirmation when the exam has marks). Owns its isolated store (role.md §3).
 */
export function ExamsController({ sectionId }: { sectionId?: number } = {}) {
  const [store] = useState(() => createExamsStore(sectionId));
  const drawerOpened = useStore(store, (s) => s.drawerOpened);
  const createMutation = useCreateExamMutation();
  const updateMutation = useUpdateExamMutation();
  const deleteMutation = useDeleteExamMutation();
  const { can, user } = useAuth();
  const setSupervisorsMutation = useSetExamSupervisorsMutation();
  const canManage = can(PERMISSIONS.examsManage);
  const canEnterMarks = can(PERMISSIONS.marksEnter);
  // supervisors are chosen by the administration; a teacher manages exams but not supervision
  const canSupervise = canManage && user?.role !== UserRole.TEACHER;
  const access = useMemo(() => ({ canManage, canEnterMarks, canSupervise }), [canManage, canEnterMarks, canSupervise]);

  const handleSubmit = useCallback(async () => {
    const { form, editing, setFormErrors, setGeneralError, setIsSubmitting, closeDrawer } = store.getState();
    const errors = validateExamForm(form, !editing);
    if (Object.keys(errors).length > 0) return setFormErrors(errors);
    setGeneralError(null);
    setIsSubmitting(true);
    try {
      const saved = editing
        ? await updateMutation.mutateAsync({ id: editing.id, payload: toUpdateExamPayload(form, canSupervise) })
        : await createMutation.mutateAsync(toExamPayload(form, canSupervise));
      if (canSupervise && mustSaveSupervisors(form, editing)) {
        await setSupervisorsMutation.mutateAsync({ id: saved.id, userIds: supervisorIdsToSave(form) });
      }
      closeDrawer();
    } catch (err: unknown) {
      setGeneralError(getApiErrorMessage(err, labels.saveError));
    } finally {
      setIsSubmitting(false);
    }
  }, [store, createMutation, updateMutation, setSupervisorsMutation, canSupervise]);

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
      {!sectionId && <OverviewSync store={store} />}
      <QuerySync store={store} />
      <OptionsSync store={store} />
      {drawerOpened && <SubjectsSync store={store} />}
      {drawerOpened && canSupervise && <SupervisorsSync store={store} />}
      <ExamsView onSubmit={handleSubmit} onConfirmDelete={handleDelete} access={access} />
    </ExamsContext.Provider>
  );
}
