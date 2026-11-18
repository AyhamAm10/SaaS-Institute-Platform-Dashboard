'use client';

import { useState } from 'react';
import {
  getApiErrorMessage,
  type StudentNote,
  useCreateStudentNoteMutation,
  useDeleteStudentNoteMutation,
  useStudentNotesQuery,
  useUpdateStudentNoteMutation,
} from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { profileLabels as labels } from './static-data/student-profile.data';
import { type NoteDraft, StudentNotesTab } from './ui/StudentNotesTab';

const EMPTY: NoteDraft = { body: '', visibleToFamily: true };

/**
 * Notes tab of the student page: staff write notes for the family; the ones
 * marked visible reach the parents app. Deleting needs `records.delete`.
 */
export function StudentNotesController({ studentId }: { studentId: number }) {
  const { can } = useAuth();
  const { data, isLoading } = useStudentNotesQuery(studentId);
  const create = useCreateStudentNoteMutation(studentId);
  const update = useUpdateStudentNoteMutation(studentId);
  const remove = useDeleteStudentNoteMutation(studentId);
  const [draft, setDraft] = useState<NoteDraft>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const guard = async (action: () => Promise<unknown>) => {
    setError(null);
    try {
      await action();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, labels.noteError));
    }
  };

  const submit = () => {
    if (!draft.body.trim()) return setError(labels.noteEmpty);
    return guard(async () => {
      await create.mutateAsync({ body: draft.body.trim(), visibleToFamily: draft.visibleToFamily });
      setDraft(EMPTY);
    });
  };

  return (
    <StudentNotesTab
      notes={data ?? []}
      isLoading={isLoading}
      canWrite={can(PERMISSIONS.studentsManage)}
      canDelete={can(PERMISSIONS.recordsDelete)}
      draft={draft}
      error={error}
      isSaving={create.isPending}
      onDraftChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
      onSubmit={submit}
      onToggleVisible={(note: StudentNote) =>
        guard(() => update.mutateAsync({ id: note.id, payload: { visibleToFamily: !note.visibleToFamily } }))
      }
      onDelete={(note: StudentNote) => guard(() => remove.mutateAsync(note.id))}
    />
  );
}
