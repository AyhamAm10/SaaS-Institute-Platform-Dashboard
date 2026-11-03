'use client';

import { Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { AppInput } from '@/src/components/controllers';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { institutesLabels } from '../static-data/institutes.data';

/**
 * InstituteAdminFields
 *
 * Initial administrator account fields — rendered in create mode only.
 * ZERO useState — reads useInstitutesMirror.
 */
export function InstituteAdminFields() {
  const form = useInstitutesMirror('form');
  const formErrors = useInstitutesMirror('formErrors');
  const setFormField = useInstitutesMirror('setFormField');

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Group gap="xs">
          <IconUser size={18} color="var(--mantine-color-teal-6)" />
          <Text fw={500} size="sm" c="teal">
            {institutesLabels.adminSectionTitle}
          </Text>
        </Group>
        <Text size="xs" c="dimmed">
          {institutesLabels.adminSectionDescription}
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
          type="tel"
          label={institutesLabels.adminPhone}
          placeholder={institutesLabels.adminPhonePlaceholder}
          value={form.adminPhone}
          onChange={(val) => setFormField('adminPhone', val)}
          error={formErrors['adminPhone']}
          required
        />
      </SimpleGrid>

      <AppInput
        type="password"
        label={institutesLabels.adminPassword}
        placeholder={institutesLabels.adminPasswordPlaceholder}
        value={form.adminPassword}
        onChange={(val) => setFormField('adminPassword', val)}
        error={formErrors['adminPassword']}
        required
      />
    </Stack>
  );
}
