'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { IconCalendarOff, IconSchool } from '@tabler/icons-react';
import { AppButton } from '@/src/components/controllers';
import {
  getApiErrorMessage,
  studentsKeys,
  useEnrollStudentsMutation,
  useExcuseMutation,
  useSectionsQuery,
} from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { profileLabels as labels } from './static-data/student-profile.data';
import { StudentActionModal, type StudentActionKind, type StudentActionValues } from './ui/StudentActionModal';

const EMPTY: StudentActionValues = { sectionId: null, date: null, note: '' };

/** Today in the institute's time zone (YYYY-MM-DD). */
function localToday(timeZone?: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date());
}

/** Sections of the header year, loaded only while the enroll form is open. */
function useSectionOptions(enabled: boolean) {
  const { data } = useSectionsQuery(enabled ? { limit: 100 } : { limit: 1 });
  return enabled ? (data?.data ?? []).map((s) => ({ value: String(s.id), label: s.name })) : [];
}

/**
 * StudentQuickActionsController
 *
 * Header actions of the student page: enroll in a section and excuse an
 * absence, with the student already fixed. The same mutations as the
 * section and attendance screens.
 */
export function StudentQuickActionsController({ studentId }: { studentId: number }) {
  const { can, user } = useAuth();
  const queryClient = useQueryClient();
  const enrollMutation = useEnrollStudentsMutation();
  const excuseMutation = useExcuseMutation();
  const [kind, setKind] = useState<StudentActionKind | null>(null);
  const [values, setValues] = useState<StudentActionValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionOptions = useSectionOptions(kind === 'enroll');

  const open = (next: StudentActionKind) => {
    setKind(next);
    setError(null);
    setValues({ ...EMPTY, date: next === 'excuse' ? localToday(user?.institute?.timezone ?? undefined) : null });
  };

  const submit = useCallback(async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (kind === 'enroll') {
        if (!values.sectionId) return setError(labels.pickSection);
        const result = await enrollMutation.mutateAsync({
          sectionId: Number(values.sectionId),
          studentIds: [studentId],
        });
        if (result.rejected.length > 0) return setError(result.rejected[0].reason);
      } else {
        if (!values.date) return setError(labels.pickDate);
        await excuseMutation.mutateAsync({ studentId, date: values.date, note: values.note.trim() || undefined });
      }
      await queryClient.invalidateQueries({ queryKey: studentsKeys.detail(studentId) });
      setKind(null);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, labels.actionError));
    } finally {
      setIsSubmitting(false);
    }
  }, [kind, values, studentId, enrollMutation, excuseMutation, queryClient]);

  return (
    <>
      {can(PERMISSIONS.studentsManage) && (
        <AppButton variant="outline" leftSection={<IconSchool size={16} />} onClick={() => open('enroll')}>
          {labels.enrollAction}
        </AppButton>
      )}
      {can(PERMISSIONS.attendanceManage) && (
        <AppButton variant="outline" leftSection={<IconCalendarOff size={16} />} onClick={() => open('excuse')}>
          {labels.excuseAction}
        </AppButton>
      )}
      <StudentActionModal
        kind={kind}
        values={values}
        sectionOptions={sectionOptions}
        error={error}
        isSubmitting={isSubmitting}
        onChange={(patch) => setValues((v) => ({ ...v, ...patch }))}
        onClose={() => setKind(null)}
        onSubmit={submit}
      />
    </>
  );
}
