'use client';

import { Alert, Stack } from '@mantine/core';
import { IconAlertCircle, IconUsersGroup } from '@tabler/icons-react';
import { AppButton, AppDrawer, AppInput, AppSelect } from '@/src/components/controllers';
import type { StaffRole } from '@/src/core/api';
import { inputText } from '@/src/core/format';
import { useStaffMirror } from '../store/staff.store';
import { STAFF_ROLE_OPTIONS, staffLabels as labels } from '../static-data/staff.data';

/** Create / edit a staff account. The phone (login) is fixed once created. ZERO useState hooks. */
export function StaffDrawer({ onSubmit, currentUserId }: { onSubmit: () => Promise<void>; currentUserId: number | null }) {
  const opened = useStaffMirror('drawerOpened');
  const editing = useStaffMirror('editing');
  const form = useStaffMirror('form');
  const errors = useStaffMirror('formErrors');
  const generalError = useStaffMirror('generalError');
  const isSubmitting = useStaffMirror('isSubmitting');
  const setField = useStaffMirror('setField');
  const closeDrawer = useStaffMirror('closeDrawer');
  const isSelf = editing !== null && editing.id === currentUserId;

  return (
    <AppDrawer opened={opened} onClose={closeDrawer} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconUsersGroup size={20} />} color="primary" />
        <Stack gap={2} style={{ flex: 1 }}>
          <AppDrawer.Title>{editing ? labels.editTitle : labels.createTitle}</AppDrawer.Title>
          <AppDrawer.Description>{labels.drawerDescription}</AppDrawer.Description>
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
          {!editing && (
            <AppInput
              type="password"
              label={labels.password}
              description={labels.passwordHint}
              value={form.password}
              onChange={(e: unknown) => setField('password', inputText(e))}
              error={errors.password}
              required
            />
          )}
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
