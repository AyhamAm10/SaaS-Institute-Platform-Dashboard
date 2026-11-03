'use client';

import { Alert, Stack } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconUserEdit } from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers';
import { useStudentsMirror } from '../store/useStudentsMirror';
import { studentsLabels } from '../static-data/students.data';
import { StudentBasicFields } from './StudentBasicFields';
import { StudentFamilyField } from './StudentFamilyField';
import { StudentCustomFieldsEditor } from './StudentCustomFieldsEditor';

export interface StudentEditDrawerProps {
  onSubmit: () => Promise<void>;
}

/**
 * StudentEditDrawer
 *
 * Side drawer for editing a student's profile: basic data, family and the
 * institute's custom fields. Section moves are enrollment operations (not here).
 * ZERO useState hooks — all state and actions are subscribed via useStudentsMirror.
 */
export function StudentEditDrawer({ onSubmit }: StudentEditDrawerProps) {
  const opened = useStudentsMirror('editDrawerOpened');
  const closeEditDrawer = useStudentsMirror('closeEditDrawer');
  const generalError = useStudentsMirror('generalError');
  const isSubmitting = useStudentsMirror('isSubmitting');
  const setGeneralError = useStudentsMirror('setGeneralError');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <AppDrawer opened={opened} onClose={closeEditDrawer} size="lg">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconUserEdit size={22} />} color="primary" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>{studentsLabels.editTitle}</AppDrawer.Title>
          <AppDrawer.Description>{studentsLabels.editDescription}</AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form id="student-edit-form" onSubmit={handleSubmit}>
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

            <AppDrawer.Section title={studentsLabels.sectionBasic}>
              <StudentBasicFields />
            </AppDrawer.Section>

            <AppDrawer.Section
              title={studentsLabels.sectionFamily}
              description={studentsLabels.sectionFamilyDescription}
            >
              <StudentFamilyField />
            </AppDrawer.Section>

            <AppDrawer.Section title={studentsLabels.sectionCustomFields}>
              <StudentCustomFieldsEditor />
            </AppDrawer.Section>
          </Stack>
        </form>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>{studentsLabels.cancel}</AppDrawer.Cancel>
          <AppDrawer.Submit
            form="student-edit-form"
            loading={isSubmitting}
            leftSection={<IconCheck size={16} />}
          >
            {studentsLabels.submitEdit}
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
