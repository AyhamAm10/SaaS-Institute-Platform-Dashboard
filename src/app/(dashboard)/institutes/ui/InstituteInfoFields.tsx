'use client';

import { ColorInput, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';
import { AppInput } from '@/src/components/controllers';
import { useInstitutesMirror } from '../store/useInstitutesMirror';
import { institutesLabels } from '../static-data/institutes.data';

/**
 * InstituteInfoFields
 *
 * Institute identity, login code, contact and branding fields
 * (shared by create and edit modes). ZERO useState — reads useInstitutesMirror.
 */
export function InstituteInfoFields() {
  const drawerMode = useInstitutesMirror('drawerMode');
  const form = useInstitutesMirror('form');
  const formErrors = useInstitutesMirror('formErrors');
  const setFormField = useInstitutesMirror('setFormField');

  const isEdit = drawerMode === 'edit';

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Group gap="xs">
          <IconSchool size={18} color="var(--mantine-color-primary-6)" />
          <Text fw={500} size="sm" c="primary">
            {institutesLabels.instituteSectionTitle}
          </Text>
        </Group>
        <Text size="xs" c="dimmed">
          {institutesLabels.instituteSectionDescription}
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
          type="tel"
          label={institutesLabels.institutePhone}
          placeholder={institutesLabels.institutePhonePlaceholder}
          value={form.phone}
          onChange={(val) => setFormField('phone', val)}
          error={formErrors['phone']}
          required
        />
      </SimpleGrid>

      <AppInput
        label={isEdit ? institutesLabels.instituteCodeRequired : institutesLabels.instituteCode}
        description={isEdit ? institutesLabels.instituteCodeEditHint : undefined}
        placeholder={institutesLabels.instituteCodePlaceholder}
        value={form.code}
        onChange={(val) => setFormField('code', val)}
        error={formErrors['code']}
        required={isEdit}
      />

      <AppInput
        label={institutesLabels.instituteAddress}
        placeholder={institutesLabels.instituteAddressPlaceholder}
        value={form.address}
        onChange={(val) => setFormField('address', val)}
        error={formErrors['address']}
        required
      />

      <AppInput
        type="url"
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
    </Stack>
  );
}
