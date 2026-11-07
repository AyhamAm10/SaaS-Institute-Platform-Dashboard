'use client';

import { Alert, Stack, Text } from '@mantine/core';
import { IconAlertCircle, IconKey, IconUserOff } from '@tabler/icons-react';
import { AppButton, AppInput, AppModal } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { useStaffMirror } from '../store/staff.store';
import { staffLabels as labels } from '../static-data/staff.data';

export interface StaffModalActions {
  onResetPassword: () => Promise<void>;
  onDeactivate: () => Promise<void>;
}

/** Reset password / deactivate confirmation of one member. ZERO useState hooks. */
export function StaffModals({ onResetPassword, onDeactivate }: StaffModalActions) {
  const modal = useStaffMirror('modal');
  const target = useStaffMirror('target');
  const newPassword = useStaffMirror('newPassword');
  const error = useStaffMirror('modalError');
  const isSubmitting = useStaffMirror('isModalSubmitting');
  const setNewPassword = useStaffMirror('setNewPassword');
  const close = useStaffMirror('closeModal');
  if (!modal || !target) return null;
  const isPassword = modal === 'password';

  return (
    <AppModal opened onClose={close} size="sm" variant={isPassword ? undefined : 'danger'}>
      <AppModal.Header>
        <AppModal.Icon
          icon={isPassword ? <IconKey size={22} /> : <IconUserOff size={22} />}
          color={isPassword ? 'primary' : 'red'}
        />
        <AppModal.Title>{isPassword ? labels.passwordTitle : labels.deactivateTitle}</AppModal.Title>
        <AppModal.Close />
      </AppModal.Header>
      <AppModal.Content>
        <Stack gap="sm">
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {error}
            </Alert>
          )}
          <Text size="sm">
            {isPassword ? labels.passwordFor(target.fullName) : labels.deactivateConfirm(target.fullName)}
          </Text>
          {isPassword && (
            <AppInput
              type="password"
              label={labels.newPassword}
              description={labels.passwordHint}
              value={newPassword}
              onChange={(e: unknown) => setNewPassword(inputText(e))}
              required
            />
          )}
        </Stack>
      </AppModal.Content>
      <AppModal.Footer>
        <AppModal.FooterEnd>
          <AppModal.Cancel>{labels.cancel}</AppModal.Cancel>
          <AppButton
            variant={isPassword ? undefined : 'dangerSolid'}
            onClick={isPassword ? onResetPassword : onDeactivate}
            loading={isSubmitting}
          >
            {isPassword ? labels.save : labels.confirmDeactivate}
          </AppButton>
        </AppModal.FooterEnd>
      </AppModal.Footer>
    </AppModal>
  );
}
