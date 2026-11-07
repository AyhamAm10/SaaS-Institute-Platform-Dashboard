'use client';

import { useCallback } from 'react';
import {
  getApiErrorMessage,
  useChangeEnrollmentStatusMutation,
  useSetEnrollmentSubjectsMutation,
  useTransferEnrollmentMutation,
} from '@/src/core/api';
import { SectionStudentsStore } from './store/section-students.store';
import { statusOfAction } from './utils/section-students.utils';
import { sectionStudentsLabels as labels } from './static-data/section-students.data';

interface EnrollmentMutations {
  transfer: ReturnType<typeof useTransferEnrollmentMutation>;
  status: ReturnType<typeof useChangeEnrollmentStatusMutation>;
  subjects: ReturnType<typeof useSetEnrollmentSubjectsMutation>;
}

/**
 * Submits the open per-student action (transfer / status / subjects) of the
 * roster store. Controller-level orchestration (role.md §3) — not UI.
 */
export function useEnrollmentActions(store: SectionStudentsStore, mutations: EnrollmentMutations) {
  const submit = useCallback(async () => {
    const state = store.getState();
    const { actionType, actionItem, setActionError, setIsSubmitting, closeAction } = state;
    if (!actionType || !actionItem) return;
    const id = actionItem.enrollmentId;

    const status = statusOfAction(actionType);
    if (status === 'WITHDRAWN' && !state.reason.trim()) {
      setActionError(labels.reasonRequired);
      return;
    }
    if (actionType === 'transfer' && !state.transferSectionId) return;

    setActionError(null);
    setIsSubmitting(true);
    try {
      if (actionType === 'transfer') {
        await mutations.transfer.mutateAsync({ id, sectionId: Number(state.transferSectionId) });
      } else if (actionType === 'subjects') {
        await mutations.subjects.mutateAsync({ id, subjectIds: state.subjectChoice });
      } else if (status) {
        await mutations.status.mutateAsync({
          id,
          payload: { status, reason: state.reason.trim() || undefined },
        });
      }
      closeAction();
    } catch (err: unknown) {
      const fallback =
        actionType === 'transfer'
          ? labels.transferError
          : actionType === 'subjects'
            ? labels.subjectsError
            : labels.statusError;
      setActionError(getApiErrorMessage(err, fallback));
    } finally {
      setIsSubmitting(false);
    }
  }, [store, mutations.transfer, mutations.status, mutations.subjects]);

  return { submit };
}
