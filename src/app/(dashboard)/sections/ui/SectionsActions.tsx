'use client';

import { Button, Group } from '@mantine/core';
import { IconGitBranch, IconPlus } from '@tabler/icons-react';
import { useSectionsMirror } from '../store/useSectionsMirror';

/**
 * SectionsActions
 *
 * Header action buttons for the Sections page.
 * Pure presentation — reads actions from the mirror.
 */
export function SectionsActions() {
  const openCreate = useSectionsMirror('openCreate');
  const openBranchesModal = useSectionsMirror('openBranchesModal');

  return (
    <Group gap="sm">
      <Button
        variant="light"
        color="teal"
        radius="xl"
        leftSection={<IconGitBranch size={16} />}
        onClick={openBranchesModal}
      >
        إدارة الفروع الأكاديمية
      </Button>

      <Button
        color="primary"
        radius="xl"
        leftSection={<IconPlus size={16} />}
        onClick={openCreate}
      >
        إضافة شُعبة جديدة
      </Button>
    </Group>
  );
}
