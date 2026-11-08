'use client';

import { Group, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { AppDrawer, AppInput } from '@/src/components/controllers';
import { AppButton } from '@/src/components/controllers/button';
import { inputText } from '@/src/core/format';
import { useSectionsMirror } from '../store/useSectionsMirror';
import { sectionFormLabels } from '../static-data/sections.data';

/** New academic branch form. */
export function AcademicBranchForm({ onCreate }: { onCreate: () => Promise<void> }) {
  const branchForm = useSectionsMirror('branchForm');
  const setBranchFormField = useSectionsMirror('setBranchFormField');
  const branchSubmitting = useSectionsMirror('branchSubmitting');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreate();
  };

  return (
    <AppDrawer.Section
      title={sectionFormLabels.branchCreateTitle}
      description="أنشئ فرعا أو مرحلة جديدة لمعهدك لتوزيع الشعب عليها"
    >
      <form onSubmit={handleCreate}>
        <Stack gap="sm">
          <AppInput
            type="text"
            label={sectionFormLabels.branchName}
            placeholder={sectionFormLabels.branchNamePlaceholder}
            value={branchForm.name}
            onChange={(e) => setBranchFormField('name', inputText(e))}
            required
          />

          <AppInput
            type="text"
            label={sectionFormLabels.branchDescription}
            placeholder={sectionFormLabels.branchDescriptionPlaceholder}
            value={branchForm.description}
            onChange={(e) => setBranchFormField('description', inputText(e))}
          />

          <Group justify="flex-end" mt="xs">
            <AppButton type="submit" size="sm" loading={branchSubmitting} leftSection={<IconPlus size={16} />}>
              إضافة الفرع
            </AppButton>
          </Group>
        </Stack>
      </form>
    </AppDrawer.Section>
  );
}
