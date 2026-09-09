'use client';

import {
  Alert,
  Button,
  Divider,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconBook,
  IconCheck,
} from '@tabler/icons-react';
import { AppDrawer, AppInput } from '@/src/components/controllers';
import { useSubjectsMirror } from '../store/useSubjectsMirror';
import { subjectsLabels } from '../static-data/subjects.data';

export interface SubjectDrawerProps {
  onSubmit: () => Promise<void>;
}

/**
 * SubjectDrawer
 *
 * Side drawer for adding or editing a Subject.
 * Strictly adheres to role.md.
 * ZERO useState hooks — all state and actions are subscribed via useSubjectsMirror.
 */
export function SubjectDrawer({ onSubmit }: SubjectDrawerProps) {
  const opened = useSubjectsMirror('drawerOpened');
  const drawerMode = useSubjectsMirror('drawerMode');
  const closeDrawer = useSubjectsMirror('closeDrawer');
  const form = useSubjectsMirror('form');
  const formErrors = useSubjectsMirror('formErrors');
  const generalError = useSubjectsMirror('generalError');
  const isSubmitting = useSubjectsMirror('isSubmitting');
  const setFormField = useSubjectsMirror('setFormField');
  const setGeneralError = useSubjectsMirror('setGeneralError');

  const isEdit = drawerMode === 'edit';
  const title = isEdit ? subjectsLabels.editTitle : subjectsLabels.createTitle;
  const description = isEdit
    ? subjectsLabels.editDescription
    : subjectsLabels.createDescription;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <AppDrawer opened={opened} onClose={closeDrawer} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconBook size={22} />} color="primary" />
        <AppDrawer.Title>{title}</AppDrawer.Title>
        <AppDrawer.Description>{description}</AppDrawer.Description>
        <AppDrawer.Close />
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form id="subject-form" onSubmit={handleSubmit}>
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

            <AppInput
              label={subjectsLabels.fieldNameLabel}
              placeholder={subjectsLabels.fieldNamePlaceholder}
              value={form.name}
              onChange={(val) => setFormField('name', val)}
              error={formErrors['name']}
              required
            />

            <AppInput
              label={subjectsLabels.fieldCodeLabel}
              placeholder={subjectsLabels.fieldCodePlaceholder}
              description={subjectsLabels.fieldCodeDescription}
              value={form.code}
              onChange={(val) => setFormField('code', val)}
              error={formErrors['code']}
              required
            />
          </Stack>
        </form>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>{subjectsLabels.cancel}</AppDrawer.Cancel>
          <Button
            type="submit"
            form="subject-form"
            variant="filled"
            color="primary"
            radius="xl"
            loading={isSubmitting}
            leftSection={<IconCheck size={16} />}
          >
            {isEdit ? subjectsLabels.submitEdit : subjectsLabels.submitCreate}
          </Button>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
