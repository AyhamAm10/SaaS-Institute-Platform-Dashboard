'use client';

import { Alert, Stack } from '@mantine/core';
import { IconAlertCircle, IconUsersGroup } from '@tabler/icons-react';
import { AppButton, AppDrawer, AppInput, AppSelect } from '@/src/components/controllers';
import type { StaffRole } from '@/src/core/api';
import { inputText } from '@/src/core/format';
import { useAccountsMirror } from '../store/accounts.store';
import { STAFF_ROLE_OPTIONS, accountsLabels as labels } from '../static-data/accounts.data';

interface StaffAccountDrawerProps {
  onSubmit: () => Promise<void>;
  currentUserId: number | null;
}

/** Create / edit a staff member. The phone (login) is fixed once created; no password here. ZERO useState hooks. */
export function StaffAccountDrawer({ onSubmit, currentUserId }: StaffAccountDrawerProps) {
  const opened = useAccountsMirror('staffDrawerOpened');
  const editing = useAccountsMirror('editingStaff');
  const form = useAccountsMirror('staffForm');
  const errors = useAccountsMirror('staffErrors');
  const generalError = useAccountsMirror('staffGeneralError');
  const isSubmitting = useAccountsMirror('isStaffSubmitting');
  const setField = useAccountsMirror('setStaffField');
  const close = useAccountsMirror('closeStaffDrawer');
  const isSelf = editing !== null && editing.id === currentUserId;

  return (
    <AppDrawer opened={opened} onClose={close} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconUsersGroup size={20} />} color="primary" />
        <Stack gap={2} style={{ flex: 1 }}>
          <AppDrawer.Title>{editing ? labels.staffEditTitle : labels.staffCreateTitle}</AppDrawer.Title>
          <AppDrawer.Description>{labels.staffDrawerDescription}</AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>
      <AppDrawer.Content>
        <Stack gap="md">
          {generalError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {generalError}
            </Alert>
          )}
          <AppInput
            label={labels.fullName}
            value={form.fullName}
            onChange={(e: unknown) => setField('fullName', inputText(e))}
            error={errors.fullName}
            required
          />
          <AppInput
            label={labels.phone}
            value={form.phone}
            onChange={(e: unknown) => setField('phone', inputText(e))}
            error={errors.phone}
            disabled={Boolean(editing)}
            dir="ltr"
            required
          />
          <AppSelect
            label={labels.role}
            description={isSelf ? labels.selfRoleHint : editing ? labels.roleChangeHint : undefined}
            data={STAFF_ROLE_OPTIONS}
            value={form.role}
            onChange={(v: string | null) => setField('role', v as StaffRole | null)}
            error={errors.role}
            disabled={isSelf}
            required
          />
        </Stack>
      </AppDrawer.Content>
      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>{labels.cancel}</AppDrawer.Cancel>
          <AppButton onClick={onSubmit} loading={isSubmitting}>
            {labels.save}
          </AppButton>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
