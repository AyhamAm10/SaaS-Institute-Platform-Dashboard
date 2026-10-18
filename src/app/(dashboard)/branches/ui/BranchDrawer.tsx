'use client';

import { Button, Group, Stack } from '@mantine/core';
import { IconBuildingCommunity } from '@tabler/icons-react';
import { AppDrawer } from '@/src/components/controllers/drawer';
import { AppInput } from '@/src/components/controllers/input';
import { useBranchesMirror } from '../store/useBranchesMirror';
import { branchesLabels } from '../static-data/branches.data';

export interface BranchDrawerProps {
  onSubmit: () => Promise<void>;
}

export function BranchDrawer({ onSubmit }: BranchDrawerProps) {
  const isDrawerOpen = useBranchesMirror('isDrawerOpen');
  const closeDrawer = useBranchesMirror('closeDrawer');
  const selectedBranch = useBranchesMirror('selectedBranch');
  const formName = useBranchesMirror('formName');
  const formCode = useBranchesMirror('formCode');
  const formPhone = useBranchesMirror('formPhone');
  const formAddress = useBranchesMirror('formAddress');
  const isSubmitting = useBranchesMirror('isSubmitting');
  const setFormField = useBranchesMirror('setFormField');

  const isEditing = Boolean(selectedBranch);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <AppDrawer opened={isDrawerOpen} onClose={closeDrawer} size="md">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconBuildingCommunity size={20} />} color="teal" />
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <AppDrawer.Title>
            {isEditing ? branchesLabels.drawerEditTitle : branchesLabels.drawerCreateTitle}
          </AppDrawer.Title>
          <AppDrawer.Description>
            {branchesLabels.drawerDescription}
          </AppDrawer.Description>
        </Stack>
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form id="branch-form" onSubmit={handleSubmit}>
          <Stack gap="lg">
            <AppDrawer.Section title="البيانات الأساسية للفرع">
              <Stack gap="md">
                <AppInput
                  label={branchesLabels.nameLabel}
                  placeholder={branchesLabels.namePlaceholder}
                  value={formName}
                  onChange={(e) =>
                    setFormField(
                      'formName',
                      typeof e === 'string' ? e : e?.target?.value ?? '',
                    )
                  }
                  required
                />
                <AppInput
                  label={branchesLabels.codeLabel}
                  placeholder={branchesLabels.codePlaceholder}
                  value={formCode}
                  onChange={(e) =>
                    setFormField(
                      'formCode',
                      typeof e === 'string' ? e : e?.target?.value ?? '',
                    )
                  }
                  required
                />
              </Stack>
            </AppDrawer.Section>

            <AppDrawer.Section title="بيانات الاتصال والموقع">
              <Stack gap="md">
                <AppInput
                  type="tel"
                  label={branchesLabels.phoneLabel}
                  placeholder={branchesLabels.phonePlaceholder}
                  value={formPhone}
                  onChange={(e) =>
                    setFormField(
                      'formPhone',
                      typeof e === 'string' ? e : e?.target?.value ?? '',
                    )
                  }
                />
                <AppInput
                  type="textarea"
                  label={branchesLabels.addressLabel}
                  placeholder={branchesLabels.addressPlaceholder}
                  value={formAddress}
                  onChange={(e) =>
                    setFormField(
                      'formAddress',
                      typeof e === 'string' ? e : e?.target?.value ?? '',
                    )
                  }
                  rows={3}
                />
              </Stack>
            </AppDrawer.Section>
          </Stack>
        </form>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <Button variant="subtle" color="gray" onClick={closeDrawer} radius="xl">
          {branchesLabels.cancel}
        </Button>
        <Button
          type="submit"
          form="branch-form"
          loading={isSubmitting}
          radius="xl"
          color="teal"
        >
          {isEditing ? branchesLabels.submitUpdate : branchesLabels.submitCreate}
        </Button>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
