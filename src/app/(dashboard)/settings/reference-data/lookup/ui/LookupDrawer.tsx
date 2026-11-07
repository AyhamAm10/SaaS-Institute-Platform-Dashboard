'use client';

import { Alert, Stack } from '@mantine/core';
import { IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers';
import { useLookupMirror } from '../store/useLookupMirror';
import { LookupFieldInput } from './LookupFieldInput';

export interface LookupDrawerProps {
  onSubmit: () => Promise<void>;
}

/**
 * LookupDrawer
 *
 * Create / edit drawer of one reference table; fields come from the config.
 * ZERO useState hooks.
 */
export function LookupDrawer({ onSubmit }: LookupDrawerProps) {
  const config = useLookupMirror('config');
  const opened = useLookupMirror('drawerOpened');
  const editing = useLookupMirror('editing');
  const generalError = useLookupMirror('generalError');
  const isSubmitting = useLookupMirror('isSubmitting');
  const closeDrawer = useLookupMirror('closeDrawer');
  const setGeneralError = useLookupMirror('setGeneralError');

  const formId = `lookup-form-${config.key}`;
  const Icon = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <AppDrawer opened={opened} onClose={closeDrawer} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<Icon size={22} />} color="primary" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>
            {editing ? `تعديل ${config.singular}: ${editing.name}` : `إضافة ${config.singular}`}
          </AppDrawer.Title>
          <AppDrawer.Description>{config.description}</AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form id={formId} onSubmit={handleSubmit}>
          <Stack gap="lg">
            {generalError && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="light"
                radius="md"
                withCloseButton
                onClose={() => setGeneralError(null)}
              >
                {generalError}
              </Alert>
            )}

            <AppDrawer.Section title={`بيانات ${config.singular}`}>
              <Stack gap="md">
                {config.fields.map((field) => (
                  <LookupFieldInput key={field.name} field={field} />
                ))}
              </Stack>
            </AppDrawer.Section>
          </Stack>
        </form>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>إلغاء</AppDrawer.Cancel>
          <AppDrawer.Submit form={formId} loading={isSubmitting} leftSection={<IconCheck size={16} />}>
            {editing ? 'حفظ التعديلات' : 'إضافة'}
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
