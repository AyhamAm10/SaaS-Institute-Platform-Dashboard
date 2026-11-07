'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from 'zustand';
import {
  examTypesResource,
  getApiErrorMessage,
  useCreateExamMutation,
  useDeleteExamMutation,
  useExamsQuery,
  useSectionSubjectsQuery,
  useSectionsQuery,
  useUpdateExamMutation,
} from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { createExamsStore, ExamsContext, ExamsStore } from './store/exams.store';
import { toExamPayload, toUpdateExamPayload, validateExamForm } from './utils/exams.utils';
import { examsLabels as labels } from './static-data/exams.data';
import { ExamsView } from './ui/ExamsView';

type SyncProps = { store: ExamsStore };

function QuerySync({ store }: SyncProps) {
  const page = useStore(store, (s) => s.page);
  const limit = useStore(store, (s) => s.limit);
  const search = useStore(store, (s) => s.search);
  const f = useStore(store, (s) => s.filters);
  const syncQueryData = useStore(store, (s) => s.syncQueryData);
  const { data, isLoading } = useExamsQuery({
    page,
    limit,
    search: search.trim() || undefined,
    sectionId: f.sectionId ? Number(f.sectionId) : undefined,
    examTypeId: f.examTypeId ? Number(f.examTypeId) : undefined,
    from: f.from ?? undefined,
    to: f.to ?? undefined,
  });

  useEffect(() => {
    syncQueryData({
      data: data?.data ?? [],
      total: data?.total ?? 0,
      totalPages: data?.totalPages ?? 1,
      isLoading,
    });
  }, [data, isLoading, syncQueryData]);
  return null;
}

/** Sections and exam types (filters + drawer). */
function OptionsSync({ store }: SyncProps) {
  const syncOptions = useStore(store, (s) => s.syncOptions);
  const sections = useSectionsQuery({ limit: 100 });
  const types = examTypesResource.useList({ limit: 100 });

  useEffect(() => {
    syncOptions(
      'sectionOptions',
      (sections.data?.data ?? []).map((s) => ({
        value: String(s.id),
        label: s.name,
      })),
    );
  }, [sections.data, syncOptions]);
  useEffect(() => {
    syncOptions(
      'examTypeOptions',
      (types.data?.data ?? []).map((t) => ({
        value: String(t.id),
        label: t.name,
      })),
    );
  }, [types.data, syncOptions]);
  return null;
}

/** Plan subjects of the section chosen in the drawer. */
function SubjectsSync({ store }: SyncProps) {
  const sectionId = useStore(store, (s) => s.form.sectionId);
  const syncOptions = useStore(store, (s) => s.syncOptions);
  const { data } = useSectionSubjectsQuery(Number(sectionId ?? 0));

  useEffect(() => {
    syncOptions(
      'subjectOptions',
      (data ?? []).map((p) => ({
        value: String(p.subject.id),
        label: p.subject.name,
      })),
    );
  }, [data, syncOptions]);
  return null;
}

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
      <QuerySync store={store} />
      <OptionsSync store={store} />
      {drawerOpened && <SubjectsSync store={store} />}
      <ExamsView onSubmit={handleSubmit} onConfirmDelete={handleDelete} access={access} />
    </ExamsContext.Provider>
  );
}
