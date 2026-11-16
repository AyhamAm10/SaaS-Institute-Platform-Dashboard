'use client';

import { useMemo } from 'react';
import { Alert, Stack } from '@mantine/core';
import { IconAlertCircle, IconSchool } from '@tabler/icons-react';
import { AppButton, AppDrawer, AppInput, AppSelect } from '@/src/components/controllers';
import { inputText } from '@/src/core/format';
import { useAccountsMirror } from '../store/accounts.store';
import { accountsLabels as labels } from '../static-data/accounts.data';

/** Login account of a student (students have no phone on file). ZERO useState hooks. */
export function StudentAccountDrawer({ onSubmit }: { onSubmit: () => Promise<void> }) {
  const opened = useAccountsMirror('studentDrawerOpened');
  const form = useAccountsMirror('studentForm');
  const errors = useAccountsMirror('studentErrors');
  const generalError = useAccountsMirror('studentGeneralError');
  const isSubmitting = useAccountsMirror('isStudentSubmitting');
  const students = useAccountsMirror('eligibleStudents');
  const setField = useAccountsMirror('setStudentField');
  const setSearch = useAccountsMirror('setStudentSearch');
  const close = useAccountsMirror('closeStudentDrawer');
  const options = useMemo(
    () => students.map((s) => ({ value: String(s.id), label: `${s.fullName} — ${s.familyName}` })),
    [students],
  );

  return (
    <AppDrawer opened={opened} onClose={close} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconSchool size={20} />} color="primary" />
        <Stack gap={2} style={{ flex: 1 }}>
          <AppDrawer.Title>{labels.studentCreateTitle}</AppDrawer.Title>
          <AppDrawer.Description>{labels.studentDrawerDescription}</AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>
      <AppDrawer.Content>
        <Stack gap="md">
          {generalError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
              {generalError}
            </Alert>
          )}
          <AppSelect
            label={labels.student}
            placeholder={labels.studentSearch}
            data={options}
            value={form.studentId}
            onChange={(v: string | null) => setField('studentId', v)}
            onSearchChange={setSearch}
            error={errors.studentId}
            searchable
            required
          />
          <AppInput
            label={labels.phone}
            value={form.phone}
            onChange={(e: unknown) => setField('phone', inputText(e))}
            error={errors.phone}
            dir="ltr"
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
