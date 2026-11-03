'use client';

import { Alert, SimpleGrid, Stack } from '@mantine/core';
import { IconAlertCircle, IconCheck, IconHome } from '@tabler/icons-react';
import { AppDrawer, AppInput } from '@/src/components/controllers';
import { useFamiliesMirror } from '../store/useFamiliesMirror';
import { familiesLabels } from '../static-data/families.data';

export interface FamilyDrawerProps {
  onSubmit: () => Promise<void>;
}

/**
 * FamilyDrawer
 *
 * Side drawer for adding or editing a family.
 * ZERO useState hooks — all state and actions are subscribed via useFamiliesMirror.
 */
export function FamilyDrawer({ onSubmit }: FamilyDrawerProps) {
  const opened = useFamiliesMirror('drawerOpened');
  const drawerMode = useFamiliesMirror('drawerMode');
  const closeDrawer = useFamiliesMirror('closeDrawer');
  const form = useFamiliesMirror('form');
  const formErrors = useFamiliesMirror('formErrors');
  const generalError = useFamiliesMirror('generalError');
  const isSubmitting = useFamiliesMirror('isSubmitting');
  const setFormField = useFamiliesMirror('setFormField');
  const setGeneralError = useFamiliesMirror('setGeneralError');

  const isEdit = drawerMode === 'edit';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <AppDrawer opened={opened} onClose={closeDrawer} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconHome size={22} />} color="primary" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>
            {isEdit ? familiesLabels.editTitle : familiesLabels.createTitle}
          </AppDrawer.Title>
          <AppDrawer.Description>
            {isEdit ? familiesLabels.editDescription : familiesLabels.createDescription}
          </AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form id="family-form" onSubmit={handleSubmit}>
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

            <AppDrawer.Section title={familiesLabels.sectionIdentity}>
              <Stack gap="md">
                <AppInput
                  label={familiesLabels.fieldFamilyName}
                  placeholder={familiesLabels.fieldFamilyNamePlaceholder}
                  value={form.familyName}
                  onChange={(val) => setFormField('familyName', val)}
                  error={formErrors['familyName']}
                  required
                />
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                  <AppInput
                    label={familiesLabels.fieldFatherName}
                    value={form.fatherName}
                    onChange={(val) => setFormField('fatherName', val)}
                  />
                  <AppInput
                    label={familiesLabels.fieldMotherName}
                    value={form.motherName}
                    onChange={(val) => setFormField('motherName', val)}
                  />
                </SimpleGrid>
              </Stack>
            </AppDrawer.Section>

            <AppDrawer.Section title={familiesLabels.sectionContact}>
              <AppInput
                type="tel"
                label={familiesLabels.fieldPhone}
                placeholder={familiesLabels.fieldPhonePlaceholder}
                value={form.phone}
                onChange={(val) => setFormField('phone', val)}
              />
            </AppDrawer.Section>
          </Stack>
        </form>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <AppDrawer.FooterEnd>
          <AppDrawer.Cancel>{familiesLabels.cancel}</AppDrawer.Cancel>
          <AppDrawer.Submit
            form="family-form"
            loading={isSubmitting}
            leftSection={<IconCheck size={16} />}
          >
            {isEdit ? familiesLabels.submitEdit : familiesLabels.submitCreate}
          </AppDrawer.Submit>
        </AppDrawer.FooterEnd>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
