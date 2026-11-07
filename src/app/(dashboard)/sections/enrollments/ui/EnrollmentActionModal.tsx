'use client';

import { Alert, Stack, Text } from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowsExchange,
  IconBook,
  IconCircleCheck,
  IconPlayerPlay,
  IconUserMinus,
} from '@tabler/icons-react';
import { AppButton, AppModal } from '@/src/components/controllers';
import { useSectionStudentsMirror } from '../store/useSectionStudentsMirror';
import type { EnrollmentActionType } from '../state/section-students.state';
import { sectionStudentsLabels as labels } from '../static-data/section-students.data';
import { ReasonField, SubjectsFields, TransferFields } from './EnrollmentActionFields';

const MODAL_META: Record<
  EnrollmentActionType,
  { title: string; icon: React.ReactNode; submit: string; danger?: boolean; hint?: string }
> = {
  transfer: { title: labels.transferTitle, icon: <IconArrowsExchange size={22} />, submit: labels.transferButton },
  subjects: { title: labels.subjectsTitle, icon: <IconBook size={22} />, submit: labels.save },
  withdraw: { title: labels.withdrawTitle, icon: <IconUserMinus size={22} />, submit: labels.confirm, danger: true },
  complete: { title: labels.completeTitle, icon: <IconCircleCheck size={22} />, submit: labels.confirm, hint: labels.completeHint },
  reactivate: { title: labels.reactivateTitle, icon: <IconPlayerPlay size={22} />, submit: labels.confirm, hint: labels.reactivateHint },
};

export interface EnrollmentActionModalProps {
  onSubmit: () => Promise<void>;
}

/**
 * EnrollmentActionModal
 *
 * One modal for the per-student actions; the body depends on the action.
 * ZERO useState hooks.
 */
export function EnrollmentActionModal({ onSubmit }: EnrollmentActionModalProps) {
  const actionType = useSectionStudentsMirror('actionType');
  const item = useSectionStudentsMirror('actionItem');
  const actionError = useSectionStudentsMirror('actionError');
  const isSubmitting = useSectionStudentsMirror('isSubmitting');
  const transferSectionId = useSectionStudentsMirror('transferSectionId');
  const closeAction = useSectionStudentsMirror('closeAction');

  if (!actionType || !item) return null;
  const meta = MODAL_META[actionType];
  const blocked = actionType === 'transfer' && !transferSectionId;

  return (
    <AppModal opened onClose={closeAction} size="sm" variant={meta.danger ? 'danger' : undefined}>
      <AppModal.Header>
        <AppModal.Icon icon={meta.icon} color={meta.danger ? 'red' : undefined} />
        <AppModal.Title>{meta.title}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>

      <AppModal.Content>
        <Stack gap="md">
          <Text size="sm" fw={500}>
            {item.student.fullName}
          </Text>
          {actionError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {actionError}
            </Alert>
          )}
          {actionType === 'transfer' && <TransferFields />}
          {actionType === 'subjects' && <SubjectsFields />}
          {(actionType === 'withdraw' || actionType === 'complete') && (
            <ReasonField required={actionType === 'withdraw'} />
          )}
          {meta.hint && (
            <Text size="xs" c="var(--app-text-muted)">
              {meta.hint}
            </Text>
          )}
        </Stack>
      </AppModal.Content>

      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
          <AppButton
            variant={meta.danger ? 'dangerSolid' : 'primary'}
            onClick={onSubmit}
            loading={isSubmitting}
            disabled={blocked}
          >
            {meta.submit}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
