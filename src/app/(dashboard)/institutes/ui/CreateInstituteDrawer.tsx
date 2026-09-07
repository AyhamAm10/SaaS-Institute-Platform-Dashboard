'use client';

import {
  Alert,
  Button,
  ColorInput,
  Divider,
  Grid,
  Group,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconBuildingCommunity,
  IconLock,
  IconPhone,
  IconPlus,
  IconSchool,
  IconUser,
} from '@tabler/icons-react';
import { AppDrawer, AppInput } from '@/src/components/controllers';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { institutesLabels } from '../static-data/institutes.data';

export interface CreateInstituteDrawerProps {
  onSubmit: () => Promise<void>;
}

/**
 * CreateInstituteDrawer
 *
 * Drawer for creating a new educational institute along with its initial administrator account.
 * Pure presentation layer adhering strictly to role.md.
 * ZERO useState hooks — all form state, errors, and actions read from useInstitutesMirror.
 */
export function CreateInstituteDrawer({ onSubmit }: CreateInstituteDrawerProps) {
  const opened = useInstitutesMirror('createDrawerOpened');
  const closeCreateDrawer = useInstitutesMirror('closeCreateDrawer');
  const form = useInstitutesMirror('form');
  const formErrors = useInstitutesMirror('formErrors');
  const generalError = useInstitutesMirror('generalError');
  const isSubmitting = useInstitutesMirror('isSubmitting');
  const setFormField = useInstitutesMirror('setFormField');
  const setGeneralError = useInstitutesMirror('setGeneralError');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <AppDrawer opened={opened} onClose={closeCreateDrawer} size="xl">
      <AppDrawer.Header>
        <AppDrawer.Icon icon={<IconBuildingCommunity size={22} />} color="primary" />
        <AppDrawer.Title>{institutesLabels.createDrawerTitle}</AppDrawer.Title>
        <AppDrawer.Description>
          {institutesLabels.createDrawerDescription}
        </AppDrawer.Description>
        <AppDrawer.Close />
      </AppDrawer.Header>

      <AppDrawer.Content>
        <form onSubmit={handleSubmit}>
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

            {/* ── Section 1: Institute Information ── */}
            <Stack gap="xs">
              <Group gap="xs">
                <IconSchool size={18} color="var(--mantine-color-primary-6)" />
                <Text fw={700} size="sm" c="primary">
                  {institutesLabels.instituteSectionTitle}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                الهوية البصرية والبيانات الرسمية للمؤسسة التعليمية.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <AppInput
                label={institutesLabels.instituteName}
                placeholder={institutesLabels.instituteNamePlaceholder}
                value={form.name}
                onChange={(val) => setFormField('name', val)}
                error={formErrors['name']}
                required
              />

              <AppInput
                label={institutesLabels.institutePhone}
                placeholder={institutesLabels.institutePhonePlaceholder}
                value={form.phone}
                onChange={(val) => setFormField('phone', val)}
                error={formErrors['phone']}
                required
              />
            </SimpleGrid>

            <AppInput
              label={institutesLabels.instituteAddress}
              placeholder={institutesLabels.instituteAddressPlaceholder}
              value={form.address}
              onChange={(val) => setFormField('address', val)}
              error={formErrors['address']}
              required
            />

            <AppInput
              label={institutesLabels.instituteLogoUrl}
              placeholder={institutesLabels.instituteLogoUrlPlaceholder}
              value={form.logoUrl}
              onChange={(val) => setFormField('logoUrl', val)}
              error={formErrors['logoUrl']}
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <ColorInput
                label={institutesLabels.institutePrimaryColor}
                value={form.primaryColor}
                onChange={(val) => setFormField('primaryColor', val)}
                radius="md"
                size="sm"
                format="hex"
              />

              <ColorInput
                label={institutesLabels.instituteSecondaryColor}
                value={form.secondaryColor}
                onChange={(val) => setFormField('secondaryColor', val)}
                radius="md"
                size="sm"
                format="hex"
              />
            </SimpleGrid>

            <Divider my="xs" />

            {/* ── Section 2: Administrator Account ── */}
            <Stack gap="xs">
              <Group gap="xs">
                <IconUser size={18} color="var(--mantine-color-teal-6)" />
                <Text fw={700} size="sm" c="teal">
                  {institutesLabels.adminSectionTitle}
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                الحساب الإداري المسؤول الذي سيتمكن من تسجيل الدخول وإدارة هذا المعهد.
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <AppInput
                label={institutesLabels.adminFullName}
                placeholder={institutesLabels.adminFullNamePlaceholder}
                value={form.adminFullName}
                onChange={(val) => setFormField('adminFullName', val)}
                error={formErrors['adminFullName']}
                required
              />

              <AppInput
                label={institutesLabels.adminPhone}
                placeholder={institutesLabels.adminPhonePlaceholder}
                value={form.adminPhone}
                onChange={(val) => setFormField('adminPhone', val)}
                error={formErrors['adminPhone']}
                required
              />
            </SimpleGrid>

            <PasswordInput
              label={institutesLabels.adminPassword}
              placeholder={institutesLabels.adminPasswordPlaceholder}
              value={form.adminPassword}
              onChange={(e) => setFormField('adminPassword', e.currentTarget.value)}
              error={formErrors['adminPassword']}
              radius="md"
              size="sm"
              leftSection={<IconLock size={16} />}
              required
            />
          </Stack>
        </form>
      </AppDrawer.Content>

      <AppDrawer.Footer>
        <Group justify="space-between" w="100%">
          <Button
            variant="default"
            radius="xl"
            onClick={closeCreateDrawer}
            disabled={isSubmitting}
          >
            {institutesLabels.cancelButton}
          </Button>

          <Button
            variant="filled"
            color="primary"
            radius="xl"
            leftSection={<IconPlus size={16} />}
            onClick={handleSubmit}
            loading={isSubmitting}
          >
            {institutesLabels.submitButton}
          </Button>
        </Group>
      </AppDrawer.Footer>
    </AppDrawer>
  );
}
