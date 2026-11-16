'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconKey, IconPlayerPlay, IconUserOff } from '@tabler/icons-react';
import { AppButton, AppModal } from '@/src/components/controllers';
import { useAccountsMirror } from '../store/accounts.store';
import { accountsLabels as labels } from '../static-data/accounts.data';

const COPY = {
  reset: { title: labels.resetTitle, text: labels.resetConfirm, action: labels.confirmReset },
  deactivate: { title: labels.deactivateTitle, text: labels.deactivateConfirm, action: labels.confirmDeactivate },
  activate: { title: labels.activateTitle, text: labels.activateConfirm, action: labels.confirmActivate },
} as const;

/** Confirmation of reset / deactivate / activate of one account. ZERO useState hooks. */
export function AccountConfirmModal({ onConfirm }: { onConfirm: () => Promise<void> }) {
  const modal = useAccountsMirror('modal');
  const target = useAccountsMirror('target');
  const error = useAccountsMirror('modalError');
  const isSubmitting = useAccountsMirror('isModalSubmitting');
  const close = useAccountsMirror('closeModal');
  if (!modal || !target) return null;
  const copy = COPY[modal];
  const Icon = modal === 'reset' ? IconKey : modal === 'activate' ? IconPlayerPlay : IconUserOff;

  return (
    <AppModal opened onClose={close} size="sm" variant={modal === 'deactivate' ? 'danger' : undefined}>
      <AppModal.Header>
        <AppModal.Icon icon={<Icon size={22} />} color={modal === 'deactivate' ? 'red' : 'primary'} />
        <AppModal.Title>{copy.title}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>
      <AppModal.Content>
        <Stack gap="sm">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}
          <Text size="sm">{copy.text(target.fullName)}</Text>
        </Stack>
      </AppModal.Content>
      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
          <AppButton variant={modal === 'deactivate' ? 'dangerSolid' : undefined} onClick={onConfirm} loading={isSubmitting}>
            {copy.action}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
