'use client';

import { Alert, Divider, Stack } from '@mantine/core';
import {
  IconAlertCircle,
  IconBuildingCommunity,
  IconCheck,
  IconPlus,
} from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { institutesLabels } from '../static-data/institutes.data';
import { InstituteInfoFields } from './InstituteInfoFields';
import { InstituteAdminFields } from './InstituteAdminFields';

export interface InstituteFormDrawerProps {
  onSubmit: () => Promise<void>;
}

/**
 * InstituteFormDrawer
 *
 * Drawer for creating an institute (with its initial administrator account)
 * or editing an existing institute's details and login code.
 * ZERO useState hooks — all form state, errors, and actions read from useInstitutesMirror.
 */
export function InstituteFormDrawer({ onSubmit }: InstituteFormDrawerProps) {
  const opened = useInstitutesMirror('formDrawerOpened');
  const drawerMode = useInstitutesMirror('drawerMode');
  const closeFormDrawer = useInstitutesMirror('closeFormDrawer');
  const generalError = useInstitutesMirror('generalError');
  const isSubmitting = useInstitutesMirror('isSubmitting');
  const setGeneralError = useInstitutesMirror('setGeneralError');

  const isEdit = drawerMode === 'edit';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <AppDrawer opened={opened} onClose={closeFormDrawer} size="xl">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconBuildingCommunity size={22} />} color="primary" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>
            {isEdit ? institutesLabels.editDrawerTitle : institutesLabels.createDrawerTitle}
          </AppDrawer.Title>
          <AppDrawer.Description>
            {isEdit
              ? institutesLabels.editDrawerDescription
              : institutesLabels.createDrawerDescription}
          </AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form id="institute-form" onSubmit={handleSubmit}>
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

            <InstituteInfoFields />

            {!isEdit && (
              <>
                <Divider my="xs" />
                <InstituteAdminFields />
              </>
            )}
          </Stack>
        </form>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>{institutesLabels.cancelButton}</AppDrawer.Cancel>
          <AppDrawer.Submit
            form="institute-form"
            loading={isSubmitting}
            leftSection={isEdit ? <IconCheck size={16} /> : <IconPlus size={16} />}
          >
            {isEdit ? institutesLabels.submitEditButton : institutesLabels.submitButton}
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
