'use client';

import { useState } from 'react';
import {
  getApiErrorMessage,
  useAssignSubjectToSectionMutation,
  useRemoveSubjectFromSectionMutation,
  useSectionSubjectsQuery,
  useSubjectsQuery,
  useTeachersQuery,
} from '@/src/core/api';
import { PERMISSIONS, useAuth } from '@/src/core/auth';
import { sectionDetailLabels as labels } from './static-data/section-detail.data';
import { type AssignValues, SectionAssignBar } from './ui/SectionAssignBar';
import { SectionSubjectsTab } from './ui/SectionSubjectsTab';

const EMPTY: AssignValues = { subjectId: null, teacherId: null, periods: '2' };

interface Props {
  sectionId: number;
  academicBranchId: number;
}

/**
 * Subjects tab: the weekly plan with add / remove. Teachers offered are the
 * ones qualified for the section's academic branch and the chosen subject
 * (the server enforces it too).
 */
export function SectionSubjectsController({ sectionId, academicBranchId }: Props) {
  const { can } = useAuth();
  const canManage = can(PERMISSIONS.academicManage);
  const plan = useSectionSubjectsQuery(sectionId);
  const subjects = useSubjectsQuery({ limit: 100 }, { enabled: canManage });
  const [values, setValues] = useState<AssignValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const teachers = useTeachersQuery(
    { limit: 100, academicBranchId, subjectId: Number(values.subjectId ?? 0), isActive: true },
    { enabled: canManage && Boolean(values.subjectId) },
  );
  const assign = useAssignSubjectToSectionMutation();
  const remove = useRemoveSubjectFromSectionMutation();

  const submit = async () => {
    if (!values.subjectId) return setError(labels.pickSubjectFirst);
    setError(null);
    try {
      await assign.mutateAsync({
        sectionId,
        payload: {
          subjectId: Number(values.subjectId),
          weeklyPeriods: Number(values.periods) || 1,
          teacherId: values.teacherId ? Number(values.teacherId) : null,
        },
      });
      setValues(EMPTY);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, labels.assignError));
    }
  };

  const planned = new Set((plan.data ?? []).map((p) => p.subjectId));
  return (
    <SectionSubjectsTab
      plan={plan.data ?? []}
      isLoading={plan.isLoading}
      onRemove={
        canManage
          ? (subjectId) =>
              remove
                .mutateAsync({ sectionId, subjectId })
                .catch((err: unknown) => setError(getApiErrorMessage(err, labels.assignError)))
          : undefined
      }
      assignBar={
        canManage && (
          <SectionAssignBar
            values={values}
            subjectOptions={(subjects.data?.data ?? [])
              .filter((s) => !planned.has(s.id))
              .map((s) => ({ value: String(s.id), label: s.name }))}
            teacherOptions={(teachers.data?.data ?? []).map((t) => ({ value: String(t.id), label: t.user.fullName }))}
            error={error}
            isSubmitting={assign.isPending}
            onChange={(patch) => setValues((v) => ({ ...v, ...patch }))}
            onSubmit={submit}
          />
        )
      }
    />
  );
}
